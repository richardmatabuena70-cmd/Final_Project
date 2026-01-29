<<<<<<< HEAD
# API DOCUMENTATION - Complete Reference

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### Register User
**Endpoint:** `POST /api/register`  
**Purpose:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Account created successfully"
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Email already registered"
}
```

**Backend Logic:**
1. Extract name, email, password from request body
2. Validate all fields are provided
3. Query: `SELECT * FROM users WHERE email = ?`
4. If user exists: Return error "Email already registered"
5. If user doesn't exist: `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
6. Return success message

**Frontend Usage (from api.js):**
```javascript
const result = await registerUser(name, email, password);
if (result.status === 'success') {
  alert('Account created! Please login.');
}
```

---

### Login User
**Endpoint:** `POST /api/login`  
**Purpose:** Authenticate user and receive authentication token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "dummy-token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

**Backend Logic:**
1. Extract email and password from request body
2. Validate both fields are provided
3. Query: `SELECT * FROM users WHERE email = ?`
4. If no user found: Return error "Invalid credentials"
5. Compare passwords: `password === user.password`
6. If match: Return success with token and user info
7. If no match: Return error "Invalid credentials"

**Frontend Usage (from api.js):**
```javascript
const result = await loginUser(email, password);
if (result.status === 'success') {
  // Store token
  localStorage.setItem('authToken', result.token);
  // Store user
  localStorage.setItem('currentUser', JSON.stringify(result.user));
  // Redirect to dashboard
  window.location.href = 'dashboard.html';
}
```

---

## Quiz Endpoints

### Get All Quizzes
**Endpoint:** `GET /api/quizzes`  
**Purpose:** Retrieve all available quizzes

**Request:** No body needed
```
GET /api/quizzes HTTP/1.1
Host: localhost:5000
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "Math Quiz",
    "description": "Basic math quiz"
  },
  {
    "id": 2,
    "title": "Advanced Math",
    "description": "Advanced mathematics"
  }
]
```

**Backend Logic:**
1. Get database connection from pool
2. Execute: `SELECT * FROM quizzes`
3. Return array of quizzes

**Frontend Usage (from api.js):**
```javascript
const quizzes = await getQuizzes();
// Returns: [{ id, title, description }, ...]
```

---

## Score Endpoints

### Save Quiz Score
**Endpoint:** `POST /api/save-score`  
**Purpose:** Store user's quiz score in database

**Request Headers:**
```
POST /api/save-score HTTP/1.1
Content-Type: application/json
Authorization: Bearer dummy-token
```

**Request Body:**
```json
{
  "userId": 1,
  "quizId": 1,
  "score": 8,
  "totalQuestions": 10
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Score saved"
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

**Backend Logic:**
1. Extract userId, quizId, score, totalQuestions from body
2. Validate all fields are present
3. Get database connection from pool
4. Insert: `INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)`
5. Release connection
6. Return success message

**Frontend Usage (from api.js):**
```javascript
// Called after quiz completion
const result = await saveQuizScore(1, 1, 8, 10);
if (result.status === 'success') {
  console.log('Score saved to database');
}
```

**Database Insert:**
```sql
INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions, created_at)
VALUES (1, 1, 8, 10, CURRENT_TIMESTAMP);

-- Results in a row like:
-- id: 42, user_id: 1, quiz_id: 1, score: 8, total_questions: 10, 
-- created_at: 2026-01-28 14:35:22
```

---

### Get User Scores
**Endpoint:** `GET /api/scores/:userId`  
**Purpose:** Retrieve all quiz scores for a specific user

**Request:**
```
GET /api/scores/1 HTTP/1.1
Host: localhost:5000
Authorization: Bearer dummy-token
```

**URL Parameter:**
- `userId` (integer) - The user ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "quiz_id": 1,
    "score": 8,
    "total_questions": 10,
    "created_at": "2026-01-28T14:35:22.000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "quiz_id": 1,
    "score": 9,
    "total_questions": 10,
    "created_at": "2026-01-28T15:10:45.000Z"
  }
]
```

**Backend Logic:**
1. Extract userId from URL parameters
2. Get database connection from pool
3. Query: `SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY created_at DESC`
4. Return array of scores sorted by newest first

**Frontend Usage (from api.js):**
```javascript
const user = getCurrentUser();  // user.id = 1
const scores = await getUserScores();
// Returns array of score objects
// Can calculate stats like average, best score
```

---

### Get All Scores (Leaderboard)
**Endpoint:** `GET /api/all-scores`  
**Purpose:** Get all scores from all users (for leaderboard/ranking)

**Request:**
```
GET /api/all-scores HTTP/1.1
Host: localhost:5000
```

**Success Response (200):**
```json
[
  {
    "user_id": 2,
    "score": 10
  },
  {
    "user_id": 1,
    "score": 9
  },
  {
    "user_id": 3,
    "score": 7
  }
]
```

**Backend Logic:**
1. Get database connection from pool
2. Query: `SELECT user_id, score FROM quiz_scores ORDER BY score DESC`
3. Return array sorted by highest score first

**Frontend Usage (from dashboard.js):**
```javascript
const allScores = await fetch(`${API_URL}/all-scores`).then(r => r.json());
// Use for creating leaderboard
```

---

## User Endpoints

### Get All Users
**Endpoint:** `GET /api/all-users`  
**Purpose:** Retrieve list of all registered users

**Request:**
```
GET /api/all-users HTTP/1.1
Host: localhost:5000
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  {
    "id": 3,
    "name": "Bob Johnson",
    "email": "bob@example.com"
  }
]
```

**Backend Logic:**
1. Get database connection from pool
2. Query: `SELECT id, name, email FROM users`
3. Return array of all users (passwords not included for security)

**Frontend Usage (from dashboard.js):**
```javascript
const allUsers = await fetch(`${API_URL}/all-users`).then(r => r.json());
// Display clickable list of users
// User can select one to view their scores
```

---

### Get User History
**Endpoint:** `GET /api/user-history/:userId`  
**Purpose:** Retrieve another user's complete quiz history with details

**Request:**
```
GET /api/user-history/2 HTTP/1.1
Host: localhost:5000
```

**URL Parameter:**
- `userId` (integer) - The user ID to retrieve history for

**Success Response (200):**
```json
{
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "scores": [
    {
      "id": 5,
      "user_id": 2,
      "quiz_id": 1,
      "score": 9,
      "total_questions": 10,
      "created_at": "2026-01-28T16:20:33.000Z"
    },
    {
      "id": 4,
      "user_id": 2,
      "quiz_id": 1,
      "score": 7,
      "total_questions": 10,
      "created_at": "2026-01-28T15:45:12.000Z"
    }
  ]
}
```

**Backend Logic:**
1. Extract userId from URL parameters
2. Get database connection from pool
3. Query user: `SELECT id, name, email FROM users WHERE id = ?`
4. Query scores: `SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY created_at DESC`
5. Return combined object with user info and their scores

**Frontend Usage (from dashboard.js):**
```javascript
async function viewUserAnswers(userId, userName) {
  const response = await fetch(`${API_URL}/user-history/${userId}`);
  const data = await response.json();
  
  // data.user contains user info
  // data.scores contains all their quiz attempts
  // Display name, scores, and progress bars
}
```

---

## Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request succeeded | GET request returns data |
| 201 | Created - Resource created | POST /api/register success |
| 400 | Bad Request - Invalid data | Missing required fields |
| 401 | Unauthorized - No token | API request without token |
| 404 | Not Found - Resource missing | Wrong endpoint URL |
| 500 | Server Error - Backend issue | Database connection failed |

---

## Testing Endpoints

### Using Browser Console
```javascript
// Test register
fetch('http://localhost:5000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log);

// Test login
fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log);

// Test get scores
fetch('http://localhost:5000/api/scores/1').then(r => r.json()).then(console.log);

// Test get all users
fetch('http://localhost:5000/api/all-users').then(r => r.json()).then(console.log);
```

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get user scores
curl http://localhost:5000/api/scores/1

# Get all users
curl http://localhost:5000/api/all-users
```

---

## Response Format Convention

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed",
  "data": { /* optional data */ }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

### Data Response (for GET)
```json
[
  { /* object 1 */ },
  { /* object 2 */ }
]
```

---

## Authentication

### How Authentication Works
1. User registers/logins
2. Server returns a token
3. Token stored in `localStorage['authToken']`
4. Token included in API request headers for secure endpoints
5. Server verifies token on each request

### Token Usage
```javascript
// Set token in request header
const token = localStorage.getItem('authToken');
fetch(`${API_URL}/scores/1`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Current Implementation:**
- ✅ Stores token in localStorage
- ✅ Sends token with requests
- ❌ Token is "dummy-token" (not secure)

**Production Note:**
- Should use JWT (JSON Web Token)
- Should have token expiration
- Should verify token on backend

---

## Database Schema for API

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quizzes Table
```sql
CREATE TABLE quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quiz Scores Table
```sql
CREATE TABLE quiz_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);
```

---

## API Flow Examples

### Complete Flow: Register → Login → Take Quiz → Save Score

```
1. User registers
   POST /api/register
   → { name, email, password }
   → { status: 'success' }

2. User logins
   POST /api/login
   → { email, password }
   → { status: 'success', token, user }
   → Store: localStorage.authToken = token
   → Store: localStorage.currentUser = user

3. User takes quiz and finishes
   POST /api/save-score
   → { userId, quizId, score, totalQuestions }
   → { status: 'success' }

4. User views scores
   GET /api/scores/1
   → [] array of score objects
   → Display on dashboard

5. User views leaderboard
   GET /api/all-users
   → [] array of users
   GET /api/all-scores
   → [] array of scores sorted by highest
   → Display leaderboard
```

---

## Performance Notes

### Connection Pooling
- Server uses MySQL connection pool
- Max 10 concurrent connections
- Prevents database overload
- Connections reused for multiple requests

### Query Optimization
- All queries use parameterized statements (? placeholders)
- Prevents SQL injection attacks
- Better performance than string concatenation

### Sorting
- All score queries sorted by date or score
- Most recent scores shown first
- Leaderboard sorted by highest score

---

**API Version:** 1.0  
**Last Updated:** January 28, 2026  
**Status:** Ready for use
=======
# API DOCUMENTATION - Complete Reference

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### Register User
**Endpoint:** `POST /api/register`  
**Purpose:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Account created successfully"
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Email already registered"
}
```

**Backend Logic:**
1. Extract name, email, password from request body
2. Validate all fields are provided
3. Query: `SELECT * FROM users WHERE email = ?`
4. If user exists: Return error "Email already registered"
5. If user doesn't exist: `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
6. Return success message

**Frontend Usage (from api.js):**
```javascript
const result = await registerUser(name, email, password);
if (result.status === 'success') {
  alert('Account created! Please login.');
}
```

---

### Login User
**Endpoint:** `POST /api/login`  
**Purpose:** Authenticate user and receive authentication token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "dummy-token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

**Backend Logic:**
1. Extract email and password from request body
2. Validate both fields are provided
3. Query: `SELECT * FROM users WHERE email = ?`
4. If no user found: Return error "Invalid credentials"
5. Compare passwords: `password === user.password`
6. If match: Return success with token and user info
7. If no match: Return error "Invalid credentials"

**Frontend Usage (from api.js):**
```javascript
const result = await loginUser(email, password);
if (result.status === 'success') {
  // Store token
  localStorage.setItem('authToken', result.token);
  // Store user
  localStorage.setItem('currentUser', JSON.stringify(result.user));
  // Redirect to dashboard
  window.location.href = 'dashboard.html';
}
```

---

## Quiz Endpoints

### Get All Quizzes
**Endpoint:** `GET /api/quizzes`  
**Purpose:** Retrieve all available quizzes

**Request:** No body needed
```
GET /api/quizzes HTTP/1.1
Host: localhost:5000
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "Math Quiz",
    "description": "Basic math quiz"
  },
  {
    "id": 2,
    "title": "Advanced Math",
    "description": "Advanced mathematics"
  }
]
```

**Backend Logic:**
1. Get database connection from pool
2. Execute: `SELECT * FROM quizzes`
3. Return array of quizzes

**Frontend Usage (from api.js):**
```javascript
const quizzes = await getQuizzes();
// Returns: [{ id, title, description }, ...]
```

---

## Score Endpoints

### Save Quiz Score
**Endpoint:** `POST /api/save-score`  
**Purpose:** Store user's quiz score in database

**Request Headers:**
```
POST /api/save-score HTTP/1.1
Content-Type: application/json
Authorization: Bearer dummy-token
```

**Request Body:**
```json
{
  "userId": 1,
  "quizId": 1,
  "score": 8,
  "totalQuestions": 10
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Score saved"
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

**Backend Logic:**
1. Extract userId, quizId, score, totalQuestions from body
2. Validate all fields are present
3. Get database connection from pool
4. Insert: `INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)`
5. Release connection
6. Return success message

**Frontend Usage (from api.js):**
```javascript
// Called after quiz completion
const result = await saveQuizScore(1, 1, 8, 10);
if (result.status === 'success') {
  console.log('Score saved to database');
}
```

**Database Insert:**
```sql
INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions, created_at)
VALUES (1, 1, 8, 10, CURRENT_TIMESTAMP);

-- Results in a row like:
-- id: 42, user_id: 1, quiz_id: 1, score: 8, total_questions: 10, 
-- created_at: 2026-01-28 14:35:22
```

---

### Get User Scores
**Endpoint:** `GET /api/scores/:userId`  
**Purpose:** Retrieve all quiz scores for a specific user

**Request:**
```
GET /api/scores/1 HTTP/1.1
Host: localhost:5000
Authorization: Bearer dummy-token
```

**URL Parameter:**
- `userId` (integer) - The user ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "quiz_id": 1,
    "score": 8,
    "total_questions": 10,
    "created_at": "2026-01-28T14:35:22.000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "quiz_id": 1,
    "score": 9,
    "total_questions": 10,
    "created_at": "2026-01-28T15:10:45.000Z"
  }
]
```

**Backend Logic:**
1. Extract userId from URL parameters
2. Get database connection from pool
3. Query: `SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY created_at DESC`
4. Return array of scores sorted by newest first

**Frontend Usage (from api.js):**
```javascript
const user = getCurrentUser();  // user.id = 1
const scores = await getUserScores();
// Returns array of score objects
// Can calculate stats like average, best score
```

---

### Get All Scores (Leaderboard)
**Endpoint:** `GET /api/all-scores`  
**Purpose:** Get all scores from all users (for leaderboard/ranking)

**Request:**
```
GET /api/all-scores HTTP/1.1
Host: localhost:5000
```

**Success Response (200):**
```json
[
  {
    "user_id": 2,
    "score": 10
  },
  {
    "user_id": 1,
    "score": 9
  },
  {
    "user_id": 3,
    "score": 7
  }
]
```

**Backend Logic:**
1. Get database connection from pool
2. Query: `SELECT user_id, score FROM quiz_scores ORDER BY score DESC`
3. Return array sorted by highest score first

**Frontend Usage (from dashboard.js):**
```javascript
const allScores = await fetch(`${API_URL}/all-scores`).then(r => r.json());
// Use for creating leaderboard
```

---

## User Endpoints

### Get All Users
**Endpoint:** `GET /api/all-users`  
**Purpose:** Retrieve list of all registered users

**Request:**
```
GET /api/all-users HTTP/1.1
Host: localhost:5000
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  {
    "id": 3,
    "name": "Bob Johnson",
    "email": "bob@example.com"
  }
]
```

**Backend Logic:**
1. Get database connection from pool
2. Query: `SELECT id, name, email FROM users`
3. Return array of all users (passwords not included for security)

**Frontend Usage (from dashboard.js):**
```javascript
const allUsers = await fetch(`${API_URL}/all-users`).then(r => r.json());
// Display clickable list of users
// User can select one to view their scores
```

---

### Get User History
**Endpoint:** `GET /api/user-history/:userId`  
**Purpose:** Retrieve another user's complete quiz history with details

**Request:**
```
GET /api/user-history/2 HTTP/1.1
Host: localhost:5000
```

**URL Parameter:**
- `userId` (integer) - The user ID to retrieve history for

**Success Response (200):**
```json
{
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "scores": [
    {
      "id": 5,
      "user_id": 2,
      "quiz_id": 1,
      "score": 9,
      "total_questions": 10,
      "created_at": "2026-01-28T16:20:33.000Z"
    },
    {
      "id": 4,
      "user_id": 2,
      "quiz_id": 1,
      "score": 7,
      "total_questions": 10,
      "created_at": "2026-01-28T15:45:12.000Z"
    }
  ]
}
```

**Backend Logic:**
1. Extract userId from URL parameters
2. Get database connection from pool
3. Query user: `SELECT id, name, email FROM users WHERE id = ?`
4. Query scores: `SELECT * FROM quiz_scores WHERE user_id = ? ORDER BY created_at DESC`
5. Return combined object with user info and their scores

**Frontend Usage (from dashboard.js):**
```javascript
async function viewUserAnswers(userId, userName) {
  const response = await fetch(`${API_URL}/user-history/${userId}`);
  const data = await response.json();
  
  // data.user contains user info
  // data.scores contains all their quiz attempts
  // Display name, scores, and progress bars
}
```

---

## Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request succeeded | GET request returns data |
| 201 | Created - Resource created | POST /api/register success |
| 400 | Bad Request - Invalid data | Missing required fields |
| 401 | Unauthorized - No token | API request without token |
| 404 | Not Found - Resource missing | Wrong endpoint URL |
| 500 | Server Error - Backend issue | Database connection failed |

---

## Testing Endpoints

### Using Browser Console
```javascript
// Test register
fetch('http://localhost:5000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log);

// Test login
fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log);

// Test get scores
fetch('http://localhost:5000/api/scores/1').then(r => r.json()).then(console.log);

// Test get all users
fetch('http://localhost:5000/api/all-users').then(r => r.json()).then(console.log);
```

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get user scores
curl http://localhost:5000/api/scores/1

# Get all users
curl http://localhost:5000/api/all-users
```

---

## Response Format Convention

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed",
  "data": { /* optional data */ }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

### Data Response (for GET)
```json
[
  { /* object 1 */ },
  { /* object 2 */ }
]
```

---

## Authentication

### How Authentication Works
1. User registers/logins
2. Server returns a token
3. Token stored in `localStorage['authToken']`
4. Token included in API request headers for secure endpoints
5. Server verifies token on each request

### Token Usage
```javascript
// Set token in request header
const token = localStorage.getItem('authToken');
fetch(`${API_URL}/scores/1`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Current Implementation:**
- ✅ Stores token in localStorage
- ✅ Sends token with requests
- ❌ Token is "dummy-token" (not secure)

**Production Note:**
- Should use JWT (JSON Web Token)
- Should have token expiration
- Should verify token on backend

---

## Database Schema for API

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quizzes Table
```sql
CREATE TABLE quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quiz Scores Table
```sql
CREATE TABLE quiz_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);
```

---

## API Flow Examples

### Complete Flow: Register → Login → Take Quiz → Save Score

```
1. User registers
   POST /api/register
   → { name, email, password }
   → { status: 'success' }

2. User logins
   POST /api/login
   → { email, password }
   → { status: 'success', token, user }
   → Store: localStorage.authToken = token
   → Store: localStorage.currentUser = user

3. User takes quiz and finishes
   POST /api/save-score
   → { userId, quizId, score, totalQuestions }
   → { status: 'success' }

4. User views scores
   GET /api/scores/1
   → [] array of score objects
   → Display on dashboard

5. User views leaderboard
   GET /api/all-users
   → [] array of users
   GET /api/all-scores
   → [] array of scores sorted by highest
   → Display leaderboard
```

---

## Performance Notes

### Connection Pooling
- Server uses MySQL connection pool
- Max 10 concurrent connections
- Prevents database overload
- Connections reused for multiple requests

### Query Optimization
- All queries use parameterized statements (? placeholders)
- Prevents SQL injection attacks
- Better performance than string concatenation

### Sorting
- All score queries sorted by date or score
- Most recent scores shown first
- Leaderboard sorted by highest score

---

**API Version:** 1.0  
**Last Updated:** January 28, 2026  
**Status:** Ready for use
>>>>>>> a10d6143e0bfcf74ae470e4c478d2b3c2d1e4d5f
