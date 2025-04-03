const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config({ path: `${__dirname}/.env` });

const app = express();
app.use(express.json());

app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER || 'nayeem',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mms_todo',
  password: process.env.DB_PASSWORD || 'pass1234',
  port: process.env.DB_PORT || 5432
});

const PORT = process.env.PORT || 8000;

// Function to test database connection
async function testDatabaseConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('Database connection successful');
    await client.query('SELECT NOW()'); // Simple query to verify connection
  } catch (err) {
    console.error('Database connection failed:', err.message);
    throw err; // Throw error to be caught in startServer
  } finally {
    if (client) client.release(); // Release the client back to the pool
  }
}

// Create todos table if it doesn't exist
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err.message);
    throw err;
  }
}

// CRUD Routes
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const result = await pool.query(
      'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title, completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server only if database operations succeed
async function startServer() {
  try {
    // Step 1: Test database connection
    await testDatabaseConnection();

    // Step 2: Initialize database (create tables)
    await initializeDatabase();

    // Step 3: Start the server only if above steps succeed
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server failed to start due to database error:', err.message);
    process.exit(1); // Exit the process with an error code
  }
}

startServer();
