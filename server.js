// Math Quiz App - Backend Server
// Purpose: API para sa authentication at quiz scoring

// Import dependencies
const express = require('express'); // Web framework
const mysql = require('mysql2/promise'); // Database driver
const cors = require('cors'); // Allow cross-origin requests
require('dotenv').config(); // Load environment variables

// Setup express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from different origins
app.use(express.json()); // Parse JSON requests
app.use(express.static('./')); // Serve static files

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'math_quiz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auth routes - login at register
app.post('/api/register', async (req, res) => {
  try {
    // Kunin ang user info from request body
    const { name, email, password } = req.body;

    // Check kung lahat ng fields complete
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields required' });
    }

    // Get connection from pool
    const connection = await pool.getConnection();

    // Check kung existing email na
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    // Insert user sa database
    await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    // Release connection at return success
    connection.release();
    res.status(201).json({ status: 'success', message: 'Account created successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Login - check email and password
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password required' });
    }

    const connection = await pool.getConnection();

    // Find user by email
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    // Kung walang user, error
    if (users.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Check password
    const user = users[0];
    const passwordMatch = password === user.password;

    // Kung password wrong, error
    if (!passwordMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Password OK - return user info at token
    res.json({
      status: 'success',
      message: 'Login successful',
      token: 'dummy-token',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Quiz endpoints
app.get('/api/quizzes', async (req, res) => {
  try {
    // Get quizzes from database
    const connection = await pool.getConnection();
    const [quizzes] = await connection.execute('SELECT * FROM quizzes');
    connection.release();
    res.json(quizzes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Save quiz score
app.post('/api/save-score', async (req, res) => {
  try {
    // Kunin ang score data
    const { userId, quizId, score, totalQuestions } = req.body;

    // Check required fields
    if (!userId || !quizId || score === undefined) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    // Insert score sa database
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)',
      [userId, quizId, score, totalQuestions]
    );
    connection.release();

    res.json({ status: 'success', message: 'Score saved' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Get user scores
app.get('/api/scores/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Get all scores para sa user
    const connection = await pool.getConnection();
    const [scores] = await connection.execute(
      'SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    connection.release();
    res.json(scores);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Get all scores from all users
app.get('/api/all-scores', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [scores] = await connection.execute('SELECT user_id, score FROM quiz_scores ORDER BY score DESC');
    connection.release();
    res.json(scores);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Get all users
app.get('/api/all-users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.execute('SELECT id, name, email FROM users');
    connection.release();
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Get user history with scores
app.get('/api/user-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();
    
    // Get scores
    const [scores] = await connection.execute(
      'SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Get user info
    const [user] = await connection.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    );
    
    connection.release();
    
    res.json({
      user: user[0],
      scores: scores
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
