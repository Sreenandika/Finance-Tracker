const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC, id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new expense
app.post('/expenses', async (req, res) => {
  try {
    const { title, amount, date } = req.body;
    const result = await pool.query(
      'INSERT INTO expenses (title, amount, date) VALUES ($1, $2, $3) RETURNING *',
      [title, amount, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update an expense
app.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date } = req.body;
    const result = await pool.query(
      'UPDATE expenses SET title = $1, amount = $2, date = $3 WHERE id = $4 RETURNING *',
      [title, amount, date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an expense
app.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
app.get('/', (req, res) => {
  res.send('Welcome to the Finance Tracker API!');
});
// Start server
app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});