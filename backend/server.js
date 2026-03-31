// server.js
require("dotenv").config(); 
const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require("better-sqlite3");
const { GoogleGenerativeAI } = require("@google/generative-ai"); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// --- AI Setup ---
const genAI = new GoogleGenerativeAI("AIzaSyD5RrKUo7Ynzdqzazd10RaG6CV4ymQEb78");

// --- Database Connection ---
const db = new Database("drphone.db"); // SQLite file will be created automatically

// --- Table Creation ---
db.prepare(`
  CREATE TABLE IF NOT EXISTS repairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_id TEXT UNIQUE,
    brand TEXT,
    model TEXT,
    service TEXT,
    issue TEXT,
    name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Create default admin user if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run("admin", "password123");
  console.log("Default admin created with username 'admin' and password 'password123'");
}

// --- Helper Functions ---
function generateTrackingId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26));
  const randomNumbers = Math.floor(100 + Math.random() * 900); // 3 digits
  return randomLetters + randomNumbers; 
}

// -------------------- API Endpoints -------------------- //

// GET all repairs
app.get("/api/repairs", (req, res) => {
  const results = db.prepare("SELECT * FROM repairs").all();
  res.json(results);
});

// POST a new repair
app.post("/api/repairs", (req, res) => {
  const { brand, model, service, issue, name, phone } = req.body;
  const tracking_id = generateTrackingId();
  db.prepare(`
    INSERT INTO repairs (tracking_id, brand, model, service, issue, name, phone, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `).run(tracking_id, brand, model, service, issue, name, phone);

  res.json({ tracking_id, brand, model, service, issue, name, phone, status: "Pending" });
});

// GET repair by tracking ID
app.get("/api/repairs/track/:tracking_id", (req, res) => {
  const { tracking_id } = req.params;
  const repair = db.prepare("SELECT * FROM repairs WHERE tracking_id = ?").get(tracking_id);
  if (!repair) return res.status(404).json({ error: "Repair not found" });
  res.json(repair);
});

// UPDATE repair status
app.put("/api/repairs/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = db.prepare("UPDATE repairs SET status = ? WHERE id = ?").run(status, id);
  if (result.changes === 0) return res.status(404).json({ error: "Repair not found" });
  res.json({ id: parseInt(id), status });
});

// DELETE repair
app.delete("/api/repairs/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM repairs WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Repair not found" });
  res.json({ message: "Repair deleted successfully" });
});

// --- Admin Login Endpoint (INSECURE: Plain-text password) ---
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
  if (!user) return res.status(401).json({ error: "Invalid username or password" });
  res.json({ message: "Login successful", username: user.username });
});


// -------------------- Chatbot Endpoint -------------------- //

// POST /api/chatbot/message
app.post("/api/chatbot/message", async (req, res) => {
  console.log("\n📩 [START] Chatbot request");

  try {
    // 1️⃣ Validate request
    const { message, conversationHistory } = req.body || {};
    console.log("📝 Incoming request message:", message);

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const safeHistory = Array.isArray(conversationHistory) ? conversationHistory : [];

    // 2️⃣ Fetch repair records from database
    let allRepairs = [];
    try {
      // Note: Make sure 'db' is properly defined in your file
      allRepairs = db.prepare(`
        SELECT tracking_id, name, brand, model, service, status, created_at
        FROM repairs
      `).all();
      console.log(`✅ Fetched ${allRepairs.length} repairs`);
    } catch (dbError) {
      console.error("❌ DB error:", dbError);
      return res.status(500).json({ error: "Database error" });
    }

    const repairsSummary = allRepairs.map((r) => ({
      trackingNumber: r.tracking_id,
      ownerName: r.name,
      brand: r.brand,
      model: r.model,
      service: r.service,
      status: r.status || "Unknown",
      date: r.created_at,
    }));

    // 3️⃣ Build AI system prompt
    const systemPrompt = `
You are a helpful AI assistant for "PhoneFix Pro" repair shop.
Answer ONLY about:
- Repair status
- Completion times
- Tracking number lookup
- General mobile phone repair advice

Current repair data:
${JSON.stringify(repairsSummary, null, 2)}

RULES:
- Status: Pending → 1-2 business days, Ongoing → same/next day, Completed → ready now
- Only give info for the customer's own record
- Be concise, warm, professional
`;

    // 4️⃣ Build chat history
    // Note: Make sure 'genAI' is properly initialized at the top of your file
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    let history = safeHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // FIXED 4: Gemini API rule - History MUST start with a 'user' message.
    // Because your frontend state has an initial bot greeting, we must prepend a dummy user message to prevent crashes.
    if (history.length > 0 && history[0].role === "model") {
      history.unshift({ role: "user", parts: [{ text: "Hello!" }] });
    }

    const chat = model.startChat({ history });

    // 5️⃣ Send user message to AI
    console.log("🧠 Sending message to Gemini...");
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    console.log("✅ AI reply:", responseText);

    // 6️⃣ Send response to frontend
    res.json({ reply: responseText });

  } catch (err) {
    console.error("🔥 Chatbot error:", err);
    res.status(500).json({ error: "Chatbot service unavailable" });
  } finally {
    console.log("🏁 [END] Chatbot request\n");
  }
});
// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Gemini AI Status: ${process.env.GEMINI_API_KEY ? " API Key Loaded" : " Missing API Key"}`);
});