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
// Keeping the same db file as requested, but changing internal structure
const db = new Database("drphone.db"); 

// --- CLEAR OLD DATA & CREATE NEW TABLES ---
db.prepare("DROP TABLE IF EXISTS repairs").run(); // Deletes old phone data

db.prepare(`
  CREATE TABLE IF NOT EXISTS book_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_id TEXT UNIQUE,
    book_title TEXT,
    author TEXT,
    member_name TEXT,
    member_email TEXT,
    status TEXT DEFAULT 'Borrowed',
    due_date DATE,
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

// Create default admin user (Same credentials as before)
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run("admin", "password123");
  console.log("Default admin created (admin / password123)");
}

// --- SEED SAMPLE DATA ---
const issueCount = db.prepare("SELECT COUNT(*) as count FROM book_issues").get().count;
if (issueCount === 0) {
  const seedQuery = db.prepare(`
    INSERT INTO book_issues (tracking_id, book_title, author, member_name, member_email, status, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  seedQuery.run("LIB-1001", "The Great Gatsby", "F. Scott Fitzgerald", "Alice Johnson", "alice@test.com", "Borrowed", "2024-12-01");
  seedQuery.run("LIB-1002", "Clean Code", "Robert C. Martin", "Bob Smith", "bob@test.com", "Overdue", "2023-10-15");
  seedQuery.run("LIB-1003", "Design Patterns", "Gang of Four", "Charlie Davis", "charlie@test.com", "Returned", "2023-11-20");
  console.log("Sample library data seeded successfully.");
}

// --- Helper Functions ---
function generateTrackingId() {
  const randomNumbers = Math.floor(1000 + Math.random() * 9000); 
  return `LIB-${randomNumbers}`; 
}

// -------------------- API Endpoints (CRUD) -------------------- //

// GET all book issues
app.get("/api/issues", (req, res) => {
  const results = db.prepare("SELECT * FROM book_issues ORDER BY created_at DESC").all();
  res.json(results);
});

// POST a new book issue
app.post("/api/issues", (req, res) => {
  const { book_title, author, member_name, member_email, due_date } = req.body;
  const tracking_id = generateTrackingId();
  
  const stmt = db.prepare(`
    INSERT INTO book_issues (tracking_id, book_title, author, member_name, member_email, status, due_date)
    VALUES (?, ?, ?, ?, ?, 'Borrowed', ?)
  `);
  
  const info = stmt.run(tracking_id, book_title, author, member_name, member_email, due_date);
  res.json({ id: info.lastInsertRowid, tracking_id, book_title, status: "Borrowed" });
});

// GET issue by tracking ID (For Frontend Tracking Modal)
app.get("/api/issues/track/:tracking_id", (req, res) => {
  const { tracking_id } = req.params;
  const issue = db.prepare("SELECT * FROM book_issues WHERE tracking_id = ?").get(tracking_id);
  if (!issue) return res.status(404).json({ error: "Record not found" });
  res.json(issue);
});

// UPDATE issue status (Borrowed -> Returned)
app.put("/api/issues/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = db.prepare("UPDATE book_issues SET status = ? WHERE id = ?").run(status, id);
  if (result.changes === 0) return res.status(404).json({ error: "Record not found" });
  res.json({ message: "Status updated", id, status });
});

// DELETE issue
app.delete("/api/issues/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM book_issues WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "Record not found" });
  res.json({ message: "Record deleted successfully" });
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
  if (!user) return res.status(401).json({ error: "Invalid username or password" });
  res.json({ message: "Login successful", token: "fake-jwt-token-123" });
});


// -------------------- Chatbot Endpoint -------------------- //
app.post("/api/chatbot/message", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body || {};
    const safeHistory = Array.isArray(conversationHistory) ? conversationHistory : [];

    // Fetch library data for AI Context
    const allIssues = db.prepare(`SELECT tracking_id, book_title, member_name, status, due_date FROM book_issues`).all();

    const systemPrompt = `
You are 'LibBot', a helpful AI assistant for EduLib Library.
Answer questions regarding:
- Book availability / Borrowing status
- Tracking ID lookups
- Library rules and due dates

Current Borrowed Books Data:
${JSON.stringify(allIssues, null, 2)}

RULES:
- Be polite, concise, and act like a professional librarian.
- If someone asks for tracking ID, use the provided data to tell them if their book is Overdue, Borrowed, or Returned.
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    let history = safeHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    if (history.length > 0 && history[0].role === "model") {
      history.unshift({ role: "user", parts: [{ text: "Hello!" }] });
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    res.json({ reply: result.response.text() });

  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Server/Gemini Error" });
  }
});

// --- Server Start ---
app.listen(PORT, () => console.log(`Library Backend running on port ${PORT}`));