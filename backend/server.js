// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test root
app.get("/", (req, res) => {
  res.send("Finance Tracker API is running");
});

// ✅ GET all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ✅ POST new expense
app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, date } = req.body;
    const result = await pool.query(
      "INSERT INTO expenses (title, amount, date) VALUES ($1, $2, $3) RETURNING *",
      [title, amount, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ✅ PUT update an expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date } = req.body;
    const result = await pool.query(
      "UPDATE expenses SET title = $1, amount = $2, date = $3 WHERE id = $4 RETURNING *",
      [title, amount, date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Expense not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ✅ DELETE an expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM expenses WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Expense not found");
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});