// server.js
const PORT = 3000;
// Import dependencies
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Open SQLite database (creates database.db if not exists)
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("DB connection error:", err.message);
  else console.log("Connected to SQLite database.");
});

// Create repairs table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS repairs (
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
)`);

// Function to generate unique tracking IDs
function generateTrackingId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26));
  const randomNumbers = Math.floor(100 + Math.random() * 900); // 3 digits
  return randomLetters + randomNumbers; // Example: ABC123
}

// -------------------- API Endpoints -------------------- //

// GET all repairs
app.get("/api/repairs", (req, res) => {
  db.all("SELECT * FROM repairs", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// POST a new repair
app.post("/api/repairs", (req, res) => {
  const { brand, model, service, issue, name, phone } = req.body;
  const tracking_id = generateTrackingId();

  const stmt = db.prepare(
    `INSERT INTO repairs (tracking_id, brand, model, service, issue, name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  stmt.run(
    [tracking_id, brand, model, service, issue, name, phone],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        tracking_id,
        brand,
        model,
        service,
        issue,
        name,
        phone,
        status: "Pending",
      });
    }
  );
  stmt.finalize();
});

// GET repair by tracking ID
app.get("/api/repairs/track/:tracking_id", (req, res) => {
  const { tracking_id } = req.params;
  db.get(
    "SELECT * FROM repairs WHERE tracking_id = ?",
    [tracking_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Repair not found" });
      res.json(row);
    }
  );
});

// UPDATE repair status
app.put("/api/repairs/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.run(
    "UPDATE repairs SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, status });
    }
  );
});

// DELETE repair
app.delete("/api/repairs/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM repairs WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Repair deleted" });
  });
});

// Start server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
