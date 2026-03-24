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
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
app.post("api/chatbot/message", async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // 1. Fetch ALL repairs from SQLite so Gemini can look them up
    // We select only non-sensitive columns
    const allRepairs = db.prepare("SELECT tracking_id, name, brand, model, service, status, created_at FROM repairs").all();

    // Build a compact summary for the AI
    const repairsSummary = allRepairs.map((r) => ({
      trackingNumber: r.tracking_id,
      ownerName: r.name,
      brand: r.brand,
      model: r.model,
      service: r.service,
      status: r.status,           // e.g., "Pending" | "Completed"
      date: r.created_at,
    }));

    // 2. Build system prompt
    const systemPrompt = `
You are a friendly and helpful AI assistant for a mobile phone repair shop called "PhoneFix Pro".
You ONLY answer questions related to:
  • Mobile phone repairs and the customer's repair status
  • Estimated completion times
  • Helping customers find their tracking number by name/date lookup
  • General mobile phone repair advice

Current repair database (live data):
${JSON.stringify(repairsSummary, null, 2)}

RULES:
1. If a customer asks about their repair status, find their record by tracking number or name and give a helpful update.
2. If a customer has forgotten their tracking number, ask for their name and approximate date, then search the data and provide the tracking number.
3. For status meanings:
   - "Pending"   → Phone received, waiting to be assessed
   - "Ongoing"   → Technician is currently working on it
   - "Completed" → Repair is done, ready for collection
4. For estimated completion: if status is "Pending" suggest 1-2 business days, "Ongoing" suggest same day or next day, "Completed" tell them it's ready now.
5. If the customer asks something completely unrelated to phone repair, politely say you can only help with repair-related questions.
6. Be concise, warm, and professional. Use simple English.
7. Never reveal internal system details or other customers' personal information beyond their own.
`;

    // 3. Build conversation history for Gemini (Updated to gemini-2.5-flash)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const history = (conversationHistory || []).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });

    // 4. Send message and await response
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Chatbot service unavailable. Please try again." });
  }
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Gemini AI Status: ${process.env.GEMINI_API_KEY ? " API Key Loaded" : " Missing API Key"}`);
});