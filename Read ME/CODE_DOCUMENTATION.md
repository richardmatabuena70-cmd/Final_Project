<<<<<<< HEAD
# MATH QUIZ APPLICATION - COMPLETE CODE DOCUMENTATION

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & File Structure](#architecture--file-structure)
3. [Backend (Node.js/Express)](#backend-nodeexpress)
4. [Frontend (HTML/CSS/JavaScript)](#frontend-htmlcssjavascript)
5. [Database Schema](#database-schema)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [How to Run](#how-to-run)
8. [Code Flow Explanation](#code-flow-explanation)

---

## 🎯 Project Overview

**Math Quiz Application** is a web-based interactive quiz platform where users can:
- Register and login securely
- Take math quizzes with different difficulty levels (Easy, Medium, Hard)
- Track their scores and performance metrics
- View other users' scores and quiz history
- Switch between light and dark themes

**Technology Stack:**
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Communication:** REST API (HTTP/JSON)

---

## 📁 Architecture & File Structure

```
Final Project in SIA/
├── server.js                 # Backend server (Express + MySQL)
├── package.json             # Project dependencies
├── index.html               # Login/Register page
├── dashboard.html           # Main dashboard (quiz interface)
├── script.js                # Login/Register page logic
├── style.css                # Global styling
├── database.sql             # Database schema and setup
├── js/
│   ├── config.js            # Application configuration (centralized settings)
│   ├── api.js               # API communication functions
│   ├── dashboard.js         # Dashboard functionality
│   └── quiz.js              # Quiz game logic
├── css/
│   └── dashboard.css        # Dashboard specific styles
└── images/                  # Application images/assets
```

---

## 🖥️ Backend (Node.js/Express)

### File: `server.js`

**Purpose:** RESTful API server handling user authentication and quiz score management

#### Key Components:

##### 1. **Dependencies & Configuration**
```javascript
const express = require('express');          // Web framework
const mysql = require('mysql2/promise');     // Database driver
const cors = require('cors');                // Cross-Origin requests
require('dotenv').config();                  // Environment variables
```

##### 2. **Middleware Setup**
- **CORS:** Allows frontend to communicate with backend from different origins
- **JSON Parser:** Automatically converts incoming JSON to JavaScript objects
- **Static Server:** Serves HTML, CSS, JS files from the root directory

##### 3. **MySQL Connection Pool**
Creates reusable database connections for better performance:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'math_quiz',
  connectionLimit: 10  // Max 10 connections simultaneously
});
```

#### Authentication Routes:

##### `POST /api/register`
**Purpose:** Create new user account

**Flow:**
1. Receive: `name`, `email`, `password`
2. Validate all fields are provided
3. Check if email already exists (prevent duplicates)
4. Insert new user into database
5. Return: `{ status: 'success', message: 'Account created' }`

**Line-by-line:**
```javascript
const { name, email, password } = req.body;  // Extract from request
if (!existing.length) {                       // If email not found
  await connection.execute(                   // Insert into DB
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
}
```

##### `POST /api/login`
**Purpose:** Authenticate user and return user info

**Flow:**
1. Receive: `email`, `password`
2. Query database for user with matching email
3. Compare password (plain text comparison - not secure)
4. If match: Return user info and authentication token
5. Return: `{ status: 'success', token: 'dummy-token', user: {...} }`

#### Quiz Routes:

##### `GET /api/quizzes`
**Purpose:** Retrieve all available quizzes
**Returns:** Array of quiz objects from database

##### `POST /api/save-score`
**Purpose:** Store user's quiz score after completion
**Receives:** `userId`, `quizId`, `score`, `totalQuestions`
**Stores:** Score record in `quiz_scores` table

##### `GET /api/scores/:userId`
**Purpose:** Get all quiz scores for a specific user
**URL Parameter:** `userId` (user ID)
**Returns:** Array of all scores from newest to oldest

##### `GET /api/all-scores`
**Purpose:** Get all scores from all users (for leaderboard)
**Returns:** Array sorted by highest score first

##### `GET /api/all-users`
**Purpose:** Get list of all registered users
**Returns:** Array of users (without passwords for security)

##### `GET /api/user-history/:userId`
**Purpose:** View another user's complete quiz history
**URL Parameter:** `userId` (user ID)
**Returns:** `{ user: {...}, scores: [...] }`

---

## 🎨 Frontend (HTML/CSS/JavaScript)

### File: `index.html` - Login/Register Page

**Purpose:** User authentication interface

**HTML Structure:**
```html
<div class="auth-container">
  <!-- Login Form -->
  <form id="loginForm">
    <input id="loginEmail" placeholder="Email or Username" />
    <input id="loginPassword" type="password" placeholder="Password" />
    <button type="submit">Login</button>
    <button onclick="showRegister()">Register</button>
  </form>

  <!-- Register Form (hidden by default) -->
  <form id="registerForm" class="hidden">
    <input id="regName" placeholder="Full Name" />
    <input id="regEmail" placeholder="Email" />
    <input id="regPassword" type="password" placeholder="Password" />
    <input id="regConfirm" type="password" placeholder="Confirm Password" />
    <button type="submit">Create Account</button>
    <button onclick="showLogin()">Login</button>
  </form>
</div>
```

### File: `script.js` - Login/Register Logic

**Purpose:** Handle form switching and user authentication

**Key Functions:**

#### `showRegister()`
- Hides login form (add "hidden" class)
- Shows register form (remove "hidden" class)
- Updates form title to "Register"

#### `showLogin()`
- Shows login form (remove "hidden" class)
- Hides register form (add "hidden" class)
- Updates form title to "Login"

#### Register Form Submit Handler
```javascript
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();  // Prevent page reload
  
  // Check passwords match
  if (regPassword.value !== regConfirm.value) {
    alert("Passwords do not match");
    return;
  }
  
  // Call API to register
  const result = await registerUser(name, email, password);
  
  if (result.status === "success") {
    alert("Account created! Please login.");
    showLogin();  // Switch to login form
    registerForm.reset();  // Clear inputs
  }
});
```

#### Login Form Submit Handler
```javascript
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();  // Prevent page reload
  
  // Call API to login
  const result = await loginUser(email, password);
  
  if (result.status === "success") {
    window.location.href = "dashboard.html";  // Redirect to dashboard
  }
});
```

---

### File: `js/config.js` - Application Configuration

**Purpose:** Centralized settings for the entire application

**Configuration Sections:**

#### API Configuration
```javascript
API_BASE_URL: 'http://localhost:5000',  // Server address
API_TIMEOUT: 5000,                       // Request timeout in ms
```

#### Quiz Configuration
```javascript
QUIZ: {
  TOTAL_QUESTIONS: 10,           // Questions per quiz
  TIME_LIMIT_SECONDS: 600,       // 10 minutes
  POINTS_PER_QUESTION: 10,       // Points per correct answer
  DIFFICULTY_LEVELS: {
    EASY: { max: 10, type: 'addition' },
    MEDIUM: { max: 30, type: 'subtraction' },
    HARD: { max: 100, type: 'multiplication/division' }
  }
}
```

#### Color Configuration
```javascript
COLORS: {
  PRIMARY: '#4CAF50',      // Green - main color
  SECONDARY: '#2196F3',    // Blue - secondary color
  DANGER: '#F44336',       // Red - errors
  WARNING: '#FF9800',      // Orange - warnings
  // ... more colors for theming
}
```

#### Storage Keys
```javascript
STORAGE_KEYS: {
  AUTH_TOKEN: 'authToken',           // Authentication token key
  CURRENT_USER: 'currentUser',       // User data key
  USERS_LIST: 'users',               // List of users key
  THEME: 'theme'                     // Theme preference key
}
```

---

### File: `js/api.js` - API Communication

**Purpose:** All functions that communicate with the backend server

#### User Management Functions:

##### `getToken()`
```javascript
// Retrieves authentication token from localStorage
// Used to verify user is logged in for secure requests
return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
```

##### `getCurrentUser()`
```javascript
// Retrieves logged-in user from localStorage
// Returns user object with id, name, email
// Returns null if not logged in
const userStr = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
return userStr ? JSON.parse(userStr) : null;
```

##### `logout()`
```javascript
// Clears authentication data and redirects to login
localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
window.location.href = 'index.html';
```

#### Authentication Functions:

##### `registerUser(name, email, password)`
```javascript
// Sends registration request to backend
// POST /api/register
// Returns: { status, message }
```

##### `loginUser(email, password)`
```javascript
// Sends login request to backend
// POST /api/login
// On success: Stores token and user in localStorage
// Returns: { status, token, user }
```

#### Quiz Functions:

##### `getQuizzes()`
```javascript
// Retrieves all available quizzes from database
// GET /api/quizzes
// Returns: Array of quiz objects
```

##### `saveQuizScore(quizId, score, totalQuestions)`
```javascript
// Saves user's quiz score to database
// POST /api/save-score
// Requires: User to be logged in
// Returns: { status, message }
```

##### `getUserScores()`
```javascript
// Retrieves current user's all quiz scores
// GET /api/scores/:userId
// Returns: Array of score objects
```

---

### File: `js/quiz.js` - Quiz Game Logic

**Purpose:** Handle quiz gameplay, questions, timer, and scoring

**Global Variables:**
```javascript
let quizData = [];           // Array of question objects
let currentIndex = 0;        // Current question index
let userAnswers = [];        // User's answers to questions
let timer = 600;             // Remaining time in seconds
let timerInterval;           // setInterval ID for timer
let cameFromProgress = false; // Flag for navigation tracking
```

#### Question Generation:

##### `generateQuestions()`
**Purpose:** Create 10 random math questions based on difficulty level

**Flow:**
1. Determine difficulty level (Easy/Medium/Hard)
2. For each question:
   - Generate two random numbers based on difficulty
   - Calculate correct answer
   - Generate 3 incorrect answers
   - Shuffle answer choices
   - Create question object
3. Store in `quizData` array

**Example for Easy (Addition):**
```javascript
let a = Math.floor(Math.random() * 10) + 1;  // 1-10
let b = Math.floor(Math.random() * 10) + 1;  // 1-10
let question = `${a} + ${b} = ?`;
let correct = a + b;

// Generate wrong choices
let choices = new Set([correct]);
while (choices.size < 3) {
  choices.add(correct + Math.floor(Math.random() * 10) - 5);
}
```

#### Game Management:

##### `loadGame()`
**Purpose:** Initialize quiz (called when user selects difficulty)
```javascript
function loadGame() {
  generateQuestions();      // Create questions
  userAnswers = Array(10).fill(null);  // Initialize empty answers
  currentIndex = 0;         // Start at question 1
  timer = 600;              // Reset timer to 10 minutes
  startTimer();             // Begin countdown
  renderQuestion();         // Display first question
}
```

##### `startQuiz(level)`
**Purpose:** Start quiz with selected difficulty level
```javascript
function startQuiz(level) {
  difficulty = level;       // Store difficulty globally
  loadGame();               // Initialize game
}
```

#### Question Display:

##### `renderQuestion()`
**Purpose:** Display current question on screen

**Displays:**
- Question number (e.g., "Question 3/10")
- Timer with color coding:
  - Green: > 2 minutes
  - Orange: 1-2 minutes
  - Red: < 1 minute
- Question text
- Answer choices (buttons)
- Previous/Next navigation buttons

**Example Output:**
```
Question 3/10
⏱ 9:45

What is 15 + 27?

[42] [40] [45]

[Previous] [Next]
```

#### Answer Selection:

##### `selectAnswer(ans)`
**Purpose:** Record user's answer for current question
```javascript
function selectAnswer(ans) {
  userAnswers[currentIndex] = ans;  // Store answer
  renderQuestion();                  // Re-render with selection highlighted
}
```

#### Navigation:

##### `nextQuestion()`
```javascript
// Move to next question or finish if at last question
if (currentIndex >= quizData.length - 1) {
  finishQuiz();      // End quiz if last question
} else {
  currentIndex++;    // Move to next
  renderQuestion();  // Display it
}
```

##### `prevQuestion()`
```javascript
// Move to previous question
if (currentIndex > 0) {
  currentIndex--;
  renderQuestion();
}
```

##### `goToQuestion(index)`
```javascript
// Jump to specific question (from progress view)
cameFromProgress = true;
currentIndex = index;
renderQuestion();
```

#### Timer Management:

##### `startTimer()`
**Purpose:** Start countdown timer
```javascript
timerInterval = setInterval(() => {
  timer--;              // Decrease by 1 second
  renderQuestion();     // Update display
  
  if (timer <= 0) {     // Time's up
    clearInterval(timerInterval);
    finishQuiz();       // End quiz automatically
  }
}, 1000);              // Run every second
```

#### Quiz Completion:

##### `finishQuiz()`
**Purpose:** End quiz and calculate score

**Flow:**
1. Stop timer
2. Count correct answers
3. Save to localStorage (quiz history)
4. Save to database via API
5. Display game over screen

```javascript
function finishQuiz() {
  clearInterval(timerInterval);  // Stop timer
  
  let correct = 0;
  quizData.forEach((q, i) => {
    if (userAnswers[i] === q.answer) correct++;  // Count matches
  });
  
  const score = correct * 10;  // Calculate score (10 pts per correct)
  
  // Save to localStorage
  user.history.push({
    score: correct,
    timeLeft: timer,
    answers: [...userAnswers],
    quiz: [...quizData],
    date: new Date().toISOString()
  });
  
  // Save to database
  saveScoreToDatabase(1, correct, 10);
  
  // Show results
  showGameOverScreen();
}
```

#### Theme Management:

##### `toggleTheme()`
**Purpose:** Switch between light and dark theme
```javascript
document.body.classList.toggle("light-theme");
updateTextColors();  // Update all text/background colors
```

##### `updateTextColors()`
**Purpose:** Update all UI colors based on current theme
```javascript
const isLight = document.body.classList.contains("light-theme");

// Set colors based on theme
const textColor = isLight ? "#000000" : "#ffffff";
const bgColor = isLight ? "#f5f5f5" : "#111111";

// Apply to all elements
document.body.style.color = textColor;
document.body.style.backgroundColor = bgColor;
```

---

### File: `js/dashboard.js` - Dashboard Interface

**Purpose:** Display user statistics, scores, and quiz history

#### User Data:

##### `getUser()`
```javascript
// Retrieve current logged-in user from localStorage
const userStr = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
return userStr ? JSON.parse(userStr) : null;
```

#### Display Functions:

##### `showScores()`
**Purpose:** Display all quiz scores for current user
**Shows:** List of games with scores (e.g., "Game 1: 8/10")

##### `showTime()`
**Purpose:** Display time remaining in each quiz
**Shows:** Formatted time for each quiz attempt (e.g., "9:45")

##### `showAccuracy()`
**Purpose:** Calculate and display overall accuracy percentage
```javascript
// Formula: (Correct Answers / Total Questions) * 100
const totalQuestions = user.history.length * 10;
const correctAnswers = user.history.reduce((a, b) => a + b.score, 0);
const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);
```

##### `showAnswers()`
**Purpose:** Display detailed review of answers with correctness
**Shows:**
- Each question
- User's answer (with color coding)
- Correct answer
- ✔️ for correct, ❌ for wrong

**Color Coding:**
- 🟢 Green = Correct
- 🔴 Red = Wrong
- ⚪ Gray = Unanswered

##### `showLiveProgress()`
**Purpose:** Display progress on current active quiz
**Shows:** Grid of question numbers colored by:
- 🟢 Green = Answered
- ⚪ Gray = Unanswered

**Example Output:**
```
[1] [2] [3] [4] [5]
[6] [7] [8] [9] [10]
```

#### Other Users' Data:

##### `showOtherUsersAnswers()`
**Purpose:** Fetch and display all registered users
**API:** GET /api/all-users
**Shows:** Clickable list of users to view their quiz history

##### `viewUserAnswers(userId, userName)`
**Purpose:** Display another user's complete quiz history
**API:** GET /api/user-history/:userId
**Shows:** 
- User's name and email
- All quiz attempts
- Scores with progress bar
- Date of attempt

**Example:**
```
Quiz #1 | Score: 8/10 | Date: 1/28/2026
████████░░ 80%
```

#### Statistics:

##### `showAllUsersStats()`
**Purpose:** Display leaderboard with all users' statistics
**Shows for each user:**
- Rank (1st, 2nd, 3rd...)
- Name and email
- Number of quizzes taken
- Best score
- Average score
- Score progress bar

**Formula for Average:**
```javascript
averageScore = (sum of all scores) / (number of quizzes)
```

#### Record Management:

##### `deleteRecord(index, refreshFn)`
**Purpose:** Delete a specific quiz record
**Flow:**
1. Ask for confirmation: "Delete this record?"
2. Remove from user.history array
3. Update localStorage
4. Refresh current display

##### `deleteAllRecords()`
**Purpose:** Delete all quiz records for current user
**Flow:**
1. Ask for confirmation: "Delete ALL quiz records?"
2. Empty user.history array
3. Update localStorage
4. Show empty scores view

---

## 📊 Database Schema

### Table: `users`
Stores user account information
```
users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Table: `quizzes`
Stores available quizzes (pre-populated)
```
quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Table: `quiz_scores`
Stores user quiz scores
```
quiz_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
)
```

---

## 🔗 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/api/register` | Create account | `{name, email, password}` | `{status, message}` |
| POST | `/api/login` | Login user | `{email, password}` | `{status, token, user}` |

### Quiz Endpoints

| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| GET | `/api/quizzes` | Get all quizzes | Array of quizzes |
| POST | `/api/save-score` | Save quiz score | `{status, message}` |

### Score Endpoints

| Method | Endpoint | Purpose | Parameter | Returns |
|--------|----------|---------|-----------|---------|
| GET | `/api/scores/:userId` | Get user scores | `userId` | Array of scores |
| GET | `/api/all-scores` | Get all scores | - | Array of all scores |
| GET | `/api/all-users` | Get all users | - | Array of users |
| GET | `/api/user-history/:userId` | Get user history | `userId` | `{user, scores}` |

---

## 🚀 How to Run

### Prerequisites
1. **Node.js** (v14 or higher)
2. **MySQL** server running
3. **npm** (comes with Node.js)

### Installation Steps

#### 1. Set up Database
```bash
# Create database and tables
mysql -u root -p < database.sql
```

#### 2. Install Dependencies
```bash
# Install npm packages (in project directory)
npm install
```

#### 3. Environment Setup
Create `.env` file in project root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=math_quiz
PORT=5000
```

#### 4. Start Server
```bash
# Development mode (with auto-restart)
npm run dev

# OR production mode
npm start
```

#### 5. Open in Browser
```
http://localhost:5000
```

---

## 📋 Code Flow Explanation

### User Registration Flow

```
1. User clicks "Register" on login page
   ↓
2. showRegister() called
   - Hide login form
   - Show register form
   ↓
3. User fills in: name, email, password, confirm password
   ↓
4. User clicks "Create Account"
   ↓
5. registerForm submit event triggered
   - Check passwords match
   - Call registerUser(name, email, password) [from api.js]
   ↓
6. Frontend sends POST to /api/register
   ↓
7. Backend processes:
   - Validate all fields
   - Check email not duplicate
   - Insert user to database
   - Return success/error
   ↓
8. Frontend receives response
   - If success: Show "Account created!", switch to login form
   - If error: Show error message
```

### User Login Flow

```
1. User enters email and password on login page
   ↓
2. User clicks "Login"
   ↓
3. loginForm submit event triggered
   - Call loginUser(email, password) [from api.js]
   ↓
4. Frontend sends POST to /api/login
   ↓
5. Backend processes:
   - Find user by email
   - Check password match
   - Return token and user info
   ↓
6. Frontend receives response
   - Store token in localStorage
   - Store user info in localStorage
   - Redirect to dashboard.html
   ↓
7. Dashboard loads and displays user info
```

### Quiz Gameplay Flow

```
1. User clicks "Play the Game" on dashboard
   ↓
2. chooseLevel() displays difficulty options
   ↓
3. User selects difficulty (Easy/Medium/Hard)
   ↓
4. startQuiz(level) called
   - generateQuestions() creates 10 random math questions
   - loadGame() initializes:
     * userAnswers array
     * timer = 600 seconds
     * currentIndex = 0
   ↓
5. startTimer() begins countdown (1 sec per iteration)
   ↓
6. renderQuestion() displays current question
   ↓
7. User clicks answer choice
   - selectAnswer(ans) stores answer
   - renderQuestion() highlights selected answer
   ↓
8. User clicks "Next" to go to next question
   - nextQuestion() increments currentIndex
   - renderQuestion() displays next question
   ↓
9. Repeat steps 7-8 for all 10 questions
   ↓
10. On last question, user clicks "Next"
    - finishQuiz() triggers
    ↓
11. finishQuiz() calculates score:
    - Count correct answers
    - Score = correct * 10
    - Save to localStorage
    - Save to database via API
    ↓
12. showGameOverScreen() displays:
    - Score: 70/100
    - Correct: 7
    - Wrong: 3
    - Unanswered: 0
    - Options: Review Answers, View Progress, Play Again
    ↓
13. User can:
    - Click "Review Answers" to see all answers with correct/incorrect
    - Click "Play Again" to restart
    - Click "Back to Dashboard" to return home
```

### Dashboard Display Flow

```
1. User clicks "Current Score" on dashboard
   ↓
2. showScores() called
   - Get user from localStorage
   - Get user.history array (all previous quizzes)
   - Display each quiz score
   ↓
3. User clicks "View Other Users' Answers"
   ↓
4. showOtherUsersAnswers() called
   - Fetch from /api/all-users
   - Display clickable list of all users
   ↓
5. User clicks on a user's name
   ↓
6. viewUserAnswers(userId) called
   - Fetch from /api/user-history/:userId
   - Display their quiz history with scores
   ↓
7. User can go back or view another user
```

---

## 🎓 Key Concepts

### LocalStorage (Browser Storage)
- Stores data on user's computer, persists after browser closes
- Used for: authentication token, user info, quiz history
- Accessible from JavaScript: `localStorage.getItem()`, `localStorage.setItem()`

### REST API
- HTTP requests: GET (retrieve), POST (create/update)
- Request contains: URL, method, headers, body
- Response contains: status code, body (JSON)

### Async/Await
- `async function` - allows use of `await`
- `await` - waits for Promise to resolve before continuing
- Used for API calls that take time

### DOM Manipulation
- `document.getElementById()` - get element by ID
- `element.classList.add/remove()` - add/remove CSS classes
- `element.addEventListener()` - listen for events
- `innerHTML` - set HTML content

### Event Listeners
- `submit` - form submission
- `click` - button click
- `change` - input field value change

---

## 🐛 Common Issues & Solutions

**Issue: Can't connect to database**
- Solution: Check MySQL is running, verify credentials in .env

**Issue: Frontend can't reach backend**
- Solution: Verify PORT in server.js, check CORS is enabled

**Issue: Quiz timer stops**
- Solution: Check startTimer() is called, verify timer logic

**Issue: Scores not saving**
- Solution: Check user is logged in, verify API endpoint is correct

---

## 📝 Notes for Defense/Explanation

### What to Emphasize:
1. **Full Stack Application** - Both frontend and backend
2. **Database Integration** - Real data storage in MySQL
3. **User Authentication** - Login/register with validation
4. **RESTful API** - Proper HTTP methods and status codes
5. **Interactive UI** - Theme switching, real-time timer, dynamic content
6. **Code Organization** - Separation of concerns (config, api, dashboard, quiz)
7. **Error Handling** - Validation, error messages, network error handling

### Code Quality Points:
- Comments explain purpose and logic
- Configuration centralized in config.js
- API abstraction in api.js
- No hardcoded values
- Proper variable naming
- Consistent code structure

---

## 📞 For Questions During Defense

**Q: How does authentication work?**
A: User registers → credentials stored in database → on login, email/password checked → token stored in localStorage for future API calls

**Q: How does the timer work?**
A: setInterval runs every 1 second, decrements timer, updates display, when reaches 0 calls finishQuiz()

**Q: How are scores saved?**
A: Stored in both localStorage (for offline access) and database (persistent storage)

**Q: How do users see other users' scores?**
A: API endpoint fetches all users, displays list, clicking user fetches their score history from database

---

**Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Status:** Ready for Defense
=======
# MATH QUIZ APPLICATION - COMPLETE CODE DOCUMENTATION

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & File Structure](#architecture--file-structure)
3. [Backend (Node.js/Express)](#backend-nodeexpress)
4. [Frontend (HTML/CSS/JavaScript)](#frontend-htmlcssjavascript)
5. [Database Schema](#database-schema)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [How to Run](#how-to-run)
8. [Code Flow Explanation](#code-flow-explanation)

---

## 🎯 Project Overview

**Math Quiz Application** is a web-based interactive quiz platform where users can:
- Register and login securely
- Take math quizzes with different difficulty levels (Easy, Medium, Hard)
- Track their scores and performance metrics
- View other users' scores and quiz history
- Switch between light and dark themes

**Technology Stack:**
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Communication:** REST API (HTTP/JSON)

---

## 📁 Architecture & File Structure

```
Final Project in SIA/
├── server.js                 # Backend server (Express + MySQL)
├── package.json             # Project dependencies
├── index.html               # Login/Register page
├── dashboard.html           # Main dashboard (quiz interface)
├── script.js                # Login/Register page logic
├── style.css                # Global styling
├── database.sql             # Database schema and setup
├── js/
│   ├── config.js            # Application configuration (centralized settings)
│   ├── api.js               # API communication functions
│   ├── dashboard.js         # Dashboard functionality
│   └── quiz.js              # Quiz game logic
├── css/
│   └── dashboard.css        # Dashboard specific styles
└── images/                  # Application images/assets
```

---

## 🖥️ Backend (Node.js/Express)

### File: `server.js`

**Purpose:** RESTful API server handling user authentication and quiz score management

#### Key Components:

##### 1. **Dependencies & Configuration**
```javascript
const express = require('express');          // Web framework
const mysql = require('mysql2/promise');     // Database driver
const cors = require('cors');                // Cross-Origin requests
require('dotenv').config();                  // Environment variables
```

##### 2. **Middleware Setup**
- **CORS:** Allows frontend to communicate with backend from different origins
- **JSON Parser:** Automatically converts incoming JSON to JavaScript objects
- **Static Server:** Serves HTML, CSS, JS files from the root directory

##### 3. **MySQL Connection Pool**
Creates reusable database connections for better performance:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'math_quiz',
  connectionLimit: 10  // Max 10 connections simultaneously
});
```

#### Authentication Routes:

##### `POST /api/register`
**Purpose:** Create new user account

**Flow:**
1. Receive: `name`, `email`, `password`
2. Validate all fields are provided
3. Check if email already exists (prevent duplicates)
4. Insert new user into database
5. Return: `{ status: 'success', message: 'Account created' }`

**Line-by-line:**
```javascript
const { name, email, password } = req.body;  // Extract from request
if (!existing.length) {                       // If email not found
  await connection.execute(                   // Insert into DB
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
}
```

##### `POST /api/login`
**Purpose:** Authenticate user and return user info

**Flow:**
1. Receive: `email`, `password`
2. Query database for user with matching email
3. Compare password (plain text comparison - not secure)
4. If match: Return user info and authentication token
5. Return: `{ status: 'success', token: 'dummy-token', user: {...} }`

#### Quiz Routes:

##### `GET /api/quizzes`
**Purpose:** Retrieve all available quizzes
**Returns:** Array of quiz objects from database

##### `POST /api/save-score`
**Purpose:** Store user's quiz score after completion
**Receives:** `userId`, `quizId`, `score`, `totalQuestions`
**Stores:** Score record in `quiz_scores` table

##### `GET /api/scores/:userId`
**Purpose:** Get all quiz scores for a specific user
**URL Parameter:** `userId` (user ID)
**Returns:** Array of all scores from newest to oldest

##### `GET /api/all-scores`
**Purpose:** Get all scores from all users (for leaderboard)
**Returns:** Array sorted by highest score first

##### `GET /api/all-users`
**Purpose:** Get list of all registered users
**Returns:** Array of users (without passwords for security)

##### `GET /api/user-history/:userId`
**Purpose:** View another user's complete quiz history
**URL Parameter:** `userId` (user ID)
**Returns:** `{ user: {...}, scores: [...] }`

---

## 🎨 Frontend (HTML/CSS/JavaScript)

### File: `index.html` - Login/Register Page

**Purpose:** User authentication interface

**HTML Structure:**
```html
<div class="auth-container">
  <!-- Login Form -->
  <form id="loginForm">
    <input id="loginEmail" placeholder="Email or Username" />
    <input id="loginPassword" type="password" placeholder="Password" />
    <button type="submit">Login</button>
    <button onclick="showRegister()">Register</button>
  </form>

  <!-- Register Form (hidden by default) -->
  <form id="registerForm" class="hidden">
    <input id="regName" placeholder="Full Name" />
    <input id="regEmail" placeholder="Email" />
    <input id="regPassword" type="password" placeholder="Password" />
    <input id="regConfirm" type="password" placeholder="Confirm Password" />
    <button type="submit">Create Account</button>
    <button onclick="showLogin()">Login</button>
  </form>
</div>
```

### File: `script.js` - Login/Register Logic

**Purpose:** Handle form switching and user authentication

**Key Functions:**

#### `showRegister()`
- Hides login form (add "hidden" class)
- Shows register form (remove "hidden" class)
- Updates form title to "Register"

#### `showLogin()`
- Shows login form (remove "hidden" class)
- Hides register form (add "hidden" class)
- Updates form title to "Login"

#### Register Form Submit Handler
```javascript
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();  // Prevent page reload
  
  // Check passwords match
  if (regPassword.value !== regConfirm.value) {
    alert("Passwords do not match");
    return;
  }
  
  // Call API to register
  const result = await registerUser(name, email, password);
  
  if (result.status === "success") {
    alert("Account created! Please login.");
    showLogin();  // Switch to login form
    registerForm.reset();  // Clear inputs
  }
});
```

#### Login Form Submit Handler
```javascript
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();  // Prevent page reload
  
  // Call API to login
  const result = await loginUser(email, password);
  
  if (result.status === "success") {
    window.location.href = "dashboard.html";  // Redirect to dashboard
  }
});
```

---

### File: `js/config.js` - Application Configuration

**Purpose:** Centralized settings for the entire application

**Configuration Sections:**

#### API Configuration
```javascript
API_BASE_URL: 'http://localhost:5000',  // Server address
API_TIMEOUT: 5000,                       // Request timeout in ms
```

#### Quiz Configuration
```javascript
QUIZ: {
  TOTAL_QUESTIONS: 10,           // Questions per quiz
  TIME_LIMIT_SECONDS: 600,       // 10 minutes
  POINTS_PER_QUESTION: 10,       // Points per correct answer
  DIFFICULTY_LEVELS: {
    EASY: { max: 10, type: 'addition' },
    MEDIUM: { max: 30, type: 'subtraction' },
    HARD: { max: 100, type: 'multiplication/division' }
  }
}
```

#### Color Configuration
```javascript
COLORS: {
  PRIMARY: '#4CAF50',      // Green - main color
  SECONDARY: '#2196F3',    // Blue - secondary color
  DANGER: '#F44336',       // Red - errors
  WARNING: '#FF9800',      // Orange - warnings
  // ... more colors for theming
}
```

#### Storage Keys
```javascript
STORAGE_KEYS: {
  AUTH_TOKEN: 'authToken',           // Authentication token key
  CURRENT_USER: 'currentUser',       // User data key
  USERS_LIST: 'users',               // List of users key
  THEME: 'theme'                     // Theme preference key
}
```

---

### File: `js/api.js` - API Communication

**Purpose:** All functions that communicate with the backend server

#### User Management Functions:

##### `getToken()`
```javascript
// Retrieves authentication token from localStorage
// Used to verify user is logged in for secure requests
return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
```

##### `getCurrentUser()`
```javascript
// Retrieves logged-in user from localStorage
// Returns user object with id, name, email
// Returns null if not logged in
const userStr = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
return userStr ? JSON.parse(userStr) : null;
```

##### `logout()`
```javascript
// Clears authentication data and redirects to login
localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
window.location.href = 'index.html';
```

#### Authentication Functions:

##### `registerUser(name, email, password)`
```javascript
// Sends registration request to backend
// POST /api/register
// Returns: { status, message }
```

##### `loginUser(email, password)`
```javascript
// Sends login request to backend
// POST /api/login
// On success: Stores token and user in localStorage
// Returns: { status, token, user }
```

#### Quiz Functions:

##### `getQuizzes()`
```javascript
// Retrieves all available quizzes from database
// GET /api/quizzes
// Returns: Array of quiz objects
```

##### `saveQuizScore(quizId, score, totalQuestions)`
```javascript
// Saves user's quiz score to database
// POST /api/save-score
// Requires: User to be logged in
// Returns: { status, message }
```

##### `getUserScores()`
```javascript
// Retrieves current user's all quiz scores
// GET /api/scores/:userId
// Returns: Array of score objects
```

---

### File: `js/quiz.js` - Quiz Game Logic

**Purpose:** Handle quiz gameplay, questions, timer, and scoring

**Global Variables:**
```javascript
let quizData = [];           // Array of question objects
let currentIndex = 0;        // Current question index
let userAnswers = [];        // User's answers to questions
let timer = 600;             // Remaining time in seconds
let timerInterval;           // setInterval ID for timer
let cameFromProgress = false; // Flag for navigation tracking
```

#### Question Generation:

##### `generateQuestions()`
**Purpose:** Create 10 random math questions based on difficulty level

**Flow:**
1. Determine difficulty level (Easy/Medium/Hard)
2. For each question:
   - Generate two random numbers based on difficulty
   - Calculate correct answer
   - Generate 3 incorrect answers
   - Shuffle answer choices
   - Create question object
3. Store in `quizData` array

**Example for Easy (Addition):**
```javascript
let a = Math.floor(Math.random() * 10) + 1;  // 1-10
let b = Math.floor(Math.random() * 10) + 1;  // 1-10
let question = `${a} + ${b} = ?`;
let correct = a + b;

// Generate wrong choices
let choices = new Set([correct]);
while (choices.size < 3) {
  choices.add(correct + Math.floor(Math.random() * 10) - 5);
}
```

#### Game Management:

##### `loadGame()`
**Purpose:** Initialize quiz (called when user selects difficulty)
```javascript
function loadGame() {
  generateQuestions();      // Create questions
  userAnswers = Array(10).fill(null);  // Initialize empty answers
  currentIndex = 0;         // Start at question 1
  timer = 600;              // Reset timer to 10 minutes
  startTimer();             // Begin countdown
  renderQuestion();         // Display first question
}
```

##### `startQuiz(level)`
**Purpose:** Start quiz with selected difficulty level
```javascript
function startQuiz(level) {
  difficulty = level;       // Store difficulty globally
  loadGame();               // Initialize game
}
```

#### Question Display:

##### `renderQuestion()`
**Purpose:** Display current question on screen

**Displays:**
- Question number (e.g., "Question 3/10")
- Timer with color coding:
  - Green: > 2 minutes
  - Orange: 1-2 minutes
  - Red: < 1 minute
- Question text
- Answer choices (buttons)
- Previous/Next navigation buttons

**Example Output:**
```
Question 3/10
⏱ 9:45

What is 15 + 27?

[42] [40] [45]

[Previous] [Next]
```

#### Answer Selection:

##### `selectAnswer(ans)`
**Purpose:** Record user's answer for current question
```javascript
function selectAnswer(ans) {
  userAnswers[currentIndex] = ans;  // Store answer
  renderQuestion();                  // Re-render with selection highlighted
}
```

#### Navigation:

##### `nextQuestion()`
```javascript
// Move to next question or finish if at last question
if (currentIndex >= quizData.length - 1) {
  finishQuiz();      // End quiz if last question
} else {
  currentIndex++;    // Move to next
  renderQuestion();  // Display it
}
```

##### `prevQuestion()`
```javascript
// Move to previous question
if (currentIndex > 0) {
  currentIndex--;
  renderQuestion();
}
```

##### `goToQuestion(index)`
```javascript
// Jump to specific question (from progress view)
cameFromProgress = true;
currentIndex = index;
renderQuestion();
```

#### Timer Management:

##### `startTimer()`
**Purpose:** Start countdown timer
```javascript
timerInterval = setInterval(() => {
  timer--;              // Decrease by 1 second
  renderQuestion();     // Update display
  
  if (timer <= 0) {     // Time's up
    clearInterval(timerInterval);
    finishQuiz();       // End quiz automatically
  }
}, 1000);              // Run every second
```

#### Quiz Completion:

##### `finishQuiz()`
**Purpose:** End quiz and calculate score

**Flow:**
1. Stop timer
2. Count correct answers
3. Save to localStorage (quiz history)
4. Save to database via API
5. Display game over screen

```javascript
function finishQuiz() {
  clearInterval(timerInterval);  // Stop timer
  
  let correct = 0;
  quizData.forEach((q, i) => {
    if (userAnswers[i] === q.answer) correct++;  // Count matches
  });
  
  const score = correct * 10;  // Calculate score (10 pts per correct)
  
  // Save to localStorage
  user.history.push({
    score: correct,
    timeLeft: timer,
    answers: [...userAnswers],
    quiz: [...quizData],
    date: new Date().toISOString()
  });
  
  // Save to database
  saveScoreToDatabase(1, correct, 10);
  
  // Show results
  showGameOverScreen();
}
```

#### Theme Management:

##### `toggleTheme()`
**Purpose:** Switch between light and dark theme
```javascript
document.body.classList.toggle("light-theme");
updateTextColors();  // Update all text/background colors
```

##### `updateTextColors()`
**Purpose:** Update all UI colors based on current theme
```javascript
const isLight = document.body.classList.contains("light-theme");

// Set colors based on theme
const textColor = isLight ? "#000000" : "#ffffff";
const bgColor = isLight ? "#f5f5f5" : "#111111";

// Apply to all elements
document.body.style.color = textColor;
document.body.style.backgroundColor = bgColor;
```

---

### File: `js/dashboard.js` - Dashboard Interface

**Purpose:** Display user statistics, scores, and quiz history

#### User Data:

##### `getUser()`
```javascript
// Retrieve current logged-in user from localStorage
const userStr = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
return userStr ? JSON.parse(userStr) : null;
```

#### Display Functions:

##### `showScores()`
**Purpose:** Display all quiz scores for current user
**Shows:** List of games with scores (e.g., "Game 1: 8/10")

##### `showTime()`
**Purpose:** Display time remaining in each quiz
**Shows:** Formatted time for each quiz attempt (e.g., "9:45")

##### `showAccuracy()`
**Purpose:** Calculate and display overall accuracy percentage
```javascript
// Formula: (Correct Answers / Total Questions) * 100
const totalQuestions = user.history.length * 10;
const correctAnswers = user.history.reduce((a, b) => a + b.score, 0);
const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);
```

##### `showAnswers()`
**Purpose:** Display detailed review of answers with correctness
**Shows:**
- Each question
- User's answer (with color coding)
- Correct answer
- ✔️ for correct, ❌ for wrong

**Color Coding:**
- 🟢 Green = Correct
- 🔴 Red = Wrong
- ⚪ Gray = Unanswered

##### `showLiveProgress()`
**Purpose:** Display progress on current active quiz
**Shows:** Grid of question numbers colored by:
- 🟢 Green = Answered
- ⚪ Gray = Unanswered

**Example Output:**
```
[1] [2] [3] [4] [5]
[6] [7] [8] [9] [10]
```

#### Other Users' Data:

##### `showOtherUsersAnswers()`
**Purpose:** Fetch and display all registered users
**API:** GET /api/all-users
**Shows:** Clickable list of users to view their quiz history

##### `viewUserAnswers(userId, userName)`
**Purpose:** Display another user's complete quiz history
**API:** GET /api/user-history/:userId
**Shows:** 
- User's name and email
- All quiz attempts
- Scores with progress bar
- Date of attempt

**Example:**
```
Quiz #1 | Score: 8/10 | Date: 1/28/2026
████████░░ 80%
```

#### Statistics:

##### `showAllUsersStats()`
**Purpose:** Display leaderboard with all users' statistics
**Shows for each user:**
- Rank (1st, 2nd, 3rd...)
- Name and email
- Number of quizzes taken
- Best score
- Average score
- Score progress bar

**Formula for Average:**
```javascript
averageScore = (sum of all scores) / (number of quizzes)
```

#### Record Management:

##### `deleteRecord(index, refreshFn)`
**Purpose:** Delete a specific quiz record
**Flow:**
1. Ask for confirmation: "Delete this record?"
2. Remove from user.history array
3. Update localStorage
4. Refresh current display

##### `deleteAllRecords()`
**Purpose:** Delete all quiz records for current user
**Flow:**
1. Ask for confirmation: "Delete ALL quiz records?"
2. Empty user.history array
3. Update localStorage
4. Show empty scores view

---

## 📊 Database Schema

### Table: `users`
Stores user account information
```
users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Table: `quizzes`
Stores available quizzes (pre-populated)
```
quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Table: `quiz_scores`
Stores user quiz scores
```
quiz_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
)
```

---

## 🔗 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | `/api/register` | Create account | `{name, email, password}` | `{status, message}` |
| POST | `/api/login` | Login user | `{email, password}` | `{status, token, user}` |

### Quiz Endpoints

| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| GET | `/api/quizzes` | Get all quizzes | Array of quizzes |
| POST | `/api/save-score` | Save quiz score | `{status, message}` |

### Score Endpoints

| Method | Endpoint | Purpose | Parameter | Returns |
|--------|----------|---------|-----------|---------|
| GET | `/api/scores/:userId` | Get user scores | `userId` | Array of scores |
| GET | `/api/all-scores` | Get all scores | - | Array of all scores |
| GET | `/api/all-users` | Get all users | - | Array of users |
| GET | `/api/user-history/:userId` | Get user history | `userId` | `{user, scores}` |

---

## 🚀 How to Run

### Prerequisites
1. **Node.js** (v14 or higher)
2. **MySQL** server running
3. **npm** (comes with Node.js)

### Installation Steps

#### 1. Set up Database
```bash
# Create database and tables
mysql -u root -p < database.sql
```

#### 2. Install Dependencies
```bash
# Install npm packages (in project directory)
npm install
```

#### 3. Environment Setup
Create `.env` file in project root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=math_quiz
PORT=5000
```

#### 4. Start Server
```bash
# Development mode (with auto-restart)
npm run dev

# OR production mode
npm start
```

#### 5. Open in Browser
```
http://localhost:5000
```

---

## 📋 Code Flow Explanation

### User Registration Flow

```
1. User clicks "Register" on login page
   ↓
2. showRegister() called
   - Hide login form
   - Show register form
   ↓
3. User fills in: name, email, password, confirm password
   ↓
4. User clicks "Create Account"
   ↓
5. registerForm submit event triggered
   - Check passwords match
   - Call registerUser(name, email, password) [from api.js]
   ↓
6. Frontend sends POST to /api/register
   ↓
7. Backend processes:
   - Validate all fields
   - Check email not duplicate
   - Insert user to database
   - Return success/error
   ↓
8. Frontend receives response
   - If success: Show "Account created!", switch to login form
   - If error: Show error message
```

### User Login Flow

```
1. User enters email and password on login page
   ↓
2. User clicks "Login"
   ↓
3. loginForm submit event triggered
   - Call loginUser(email, password) [from api.js]
   ↓
4. Frontend sends POST to /api/login
   ↓
5. Backend processes:
   - Find user by email
   - Check password match
   - Return token and user info
   ↓
6. Frontend receives response
   - Store token in localStorage
   - Store user info in localStorage
   - Redirect to dashboard.html
   ↓
7. Dashboard loads and displays user info
```

### Quiz Gameplay Flow

```
1. User clicks "Play the Game" on dashboard
   ↓
2. chooseLevel() displays difficulty options
   ↓
3. User selects difficulty (Easy/Medium/Hard)
   ↓
4. startQuiz(level) called
   - generateQuestions() creates 10 random math questions
   - loadGame() initializes:
     * userAnswers array
     * timer = 600 seconds
     * currentIndex = 0
   ↓
5. startTimer() begins countdown (1 sec per iteration)
   ↓
6. renderQuestion() displays current question
   ↓
7. User clicks answer choice
   - selectAnswer(ans) stores answer
   - renderQuestion() highlights selected answer
   ↓
8. User clicks "Next" to go to next question
   - nextQuestion() increments currentIndex
   - renderQuestion() displays next question
   ↓
9. Repeat steps 7-8 for all 10 questions
   ↓
10. On last question, user clicks "Next"
    - finishQuiz() triggers
    ↓
11. finishQuiz() calculates score:
    - Count correct answers
    - Score = correct * 10
    - Save to localStorage
    - Save to database via API
    ↓
12. showGameOverScreen() displays:
    - Score: 70/100
    - Correct: 7
    - Wrong: 3
    - Unanswered: 0
    - Options: Review Answers, View Progress, Play Again
    ↓
13. User can:
    - Click "Review Answers" to see all answers with correct/incorrect
    - Click "Play Again" to restart
    - Click "Back to Dashboard" to return home
```

### Dashboard Display Flow

```
1. User clicks "Current Score" on dashboard
   ↓
2. showScores() called
   - Get user from localStorage
   - Get user.history array (all previous quizzes)
   - Display each quiz score
   ↓
3. User clicks "View Other Users' Answers"
   ↓
4. showOtherUsersAnswers() called
   - Fetch from /api/all-users
   - Display clickable list of all users
   ↓
5. User clicks on a user's name
   ↓
6. viewUserAnswers(userId) called
   - Fetch from /api/user-history/:userId
   - Display their quiz history with scores
   ↓
7. User can go back or view another user
```

---

## 🎓 Key Concepts

### LocalStorage (Browser Storage)
- Stores data on user's computer, persists after browser closes
- Used for: authentication token, user info, quiz history
- Accessible from JavaScript: `localStorage.getItem()`, `localStorage.setItem()`

### REST API
- HTTP requests: GET (retrieve), POST (create/update)
- Request contains: URL, method, headers, body
- Response contains: status code, body (JSON)

### Async/Await
- `async function` - allows use of `await`
- `await` - waits for Promise to resolve before continuing
- Used for API calls that take time

### DOM Manipulation
- `document.getElementById()` - get element by ID
- `element.classList.add/remove()` - add/remove CSS classes
- `element.addEventListener()` - listen for events
- `innerHTML` - set HTML content

### Event Listeners
- `submit` - form submission
- `click` - button click
- `change` - input field value change

---

## 🐛 Common Issues & Solutions

**Issue: Can't connect to database**
- Solution: Check MySQL is running, verify credentials in .env

**Issue: Frontend can't reach backend**
- Solution: Verify PORT in server.js, check CORS is enabled

**Issue: Quiz timer stops**
- Solution: Check startTimer() is called, verify timer logic

**Issue: Scores not saving**
- Solution: Check user is logged in, verify API endpoint is correct

---

## 📝 Notes for Defense/Explanation

### What to Emphasize:
1. **Full Stack Application** - Both frontend and backend
2. **Database Integration** - Real data storage in MySQL
3. **User Authentication** - Login/register with validation
4. **RESTful API** - Proper HTTP methods and status codes
5. **Interactive UI** - Theme switching, real-time timer, dynamic content
6. **Code Organization** - Separation of concerns (config, api, dashboard, quiz)
7. **Error Handling** - Validation, error messages, network error handling

### Code Quality Points:
- Comments explain purpose and logic
- Configuration centralized in config.js
- API abstraction in api.js
- No hardcoded values
- Proper variable naming
- Consistent code structure

---

## 📞 For Questions During Defense

**Q: How does authentication work?**
A: User registers → credentials stored in database → on login, email/password checked → token stored in localStorage for future API calls

**Q: How does the timer work?**
A: setInterval runs every 1 second, decrements timer, updates display, when reaches 0 calls finishQuiz()

**Q: How are scores saved?**
A: Stored in both localStorage (for offline access) and database (persistent storage)

**Q: How do users see other users' scores?**
A: API endpoint fetches all users, displays list, clicking user fetches their score history from database

---

**Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Status:** Ready for Defense
>>>>>>> a10d6143e0bfcf74ae470e4c478d2b3c2d1e4d5f
