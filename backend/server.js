// server.js
const PORT = 3000;
// Import dependencies
const express = require("express");
const mysql = require("mysql2"); // Using MySQL
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Database Connection ---
// Create a connection pool for MySQL using your credentials
const db = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12796502",
  password: "eUDgeXXtUP",
  database: "sql12796502",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
  connection.release(); // Release the connection
});

// --- Table Creation ---
// Create repairs table if it doesn't exist (MySQL syntax)
const createRepairsTable = `CREATE TABLE IF NOT EXISTS repairs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tracking_id VARCHAR(10) UNIQUE,
    brand VARCHAR(255),
    model VARCHAR(255),
    service VARCHAR(255),
    issue TEXT,
    name VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// Create users table for admin login (stores plain-text passwords)
const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createRepairsTable, (err) => {
  if (err) console.error("Error creating 'repairs' table:", err.message);
  else console.log("'repairs' table is ready.");
});

db.query(createUsersTable, (err) => {
  if (err) console.error("Error creating 'users' table:", err.message);
  else {
    console.log("'users' table is ready.");
    // Optional: Create a default admin user with a plain-text password.
    // This is NOT secure and is for demonstration purposes only.
    const adminUsername = "admin";
    const plainPassword = "password123"; // DANGEROUS: Storing plain text
    const checkUserSql = "SELECT * FROM users WHERE username = ?";
    const insertUserSql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(checkUserSql, [adminUsername], (err, results) => {
      if (results.length === 0) {
        db.query(insertUserSql, [adminUsername, plainPassword], (err) => {
          if (err) console.error("Error creating default admin:", err);
          else console.log(`Default admin '${adminUsername}' created with plain-text password. This is not secure!`);
        });
      }
    });
  }
});

// --- Helper Functions ---
// Function to generate unique tracking IDs (no changes needed)
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
  db.query("SELECT * FROM repairs", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new repair
app.post("/api/repairs", (req, res) => {
  const { brand, model, service, issue, name, phone } = req.body;
  const tracking_id = generateTrackingId();

  const newRepair = {
    tracking_id,
    brand,
    model,
    service,
    issue,
    name,
    phone,
    status: "Pending",
  };

  db.query("INSERT INTO repairs SET ?", newRepair, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      id: results.insertId,
      ...newRepair,
    });
  });
});

// GET repair by tracking ID
app.get("/api/repairs/track/:tracking_id", (req, res) => {
  const { tracking_id } = req.params;
  db.query(
    "SELECT * FROM repairs WHERE tracking_id = ?",
    [tracking_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ error: "Repair not found" });
      }
      res.json(results[0]);
    }
  );
});

// UPDATE repair status
app.put("/api/repairs/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query(
    "UPDATE repairs SET status = ? WHERE id = ?",
    [status, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Repair not found" });
      }
      res.json({ id: parseInt(id), status });
    }
  );
});

// DELETE repair
app.delete("/api/repairs/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM repairs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Repair not found" });
    }
    res.json({ message: "Repair deleted successfully" });
  });
});

// --- Admin Login Endpoint (INSECURE: Plain-text password) ---
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  // DANGER: Comparing plain-text passwords directly in the query.
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error("Login database error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      // If a user is found, the login is successful.
      const user = results[0];
      res.json({ message: "Login successful", username: user.username });
    }
  );
});

// --- Server Start ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));