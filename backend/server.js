// server.js
const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

// --- Server Start ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
