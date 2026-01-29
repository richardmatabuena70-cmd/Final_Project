<<<<<<< HEAD
# QUICK REFERENCE GUIDE - MATH QUIZ APPLICATION

## 📋 File Guide at a Glance

| File | Purpose | Key Functions |
|------|---------|---|
| **server.js** | Backend API | register, login, save-score, get scores |
| **index.html** | Login page | Form layout for auth |
| **script.js** | Auth logic | showLogin, showRegister, form submission |
| **js/config.js** | Settings | APP_CONFIG object with all settings |
| **js/api.js** | API calls | registerUser, loginUser, saveQuizScore |
| **js/quiz.js** | Game logic | generateQuestions, renderQuestion, finishQuiz |
| **js/dashboard.js** | Dashboard | showScores, showAnswers, showProgress |
| **database.sql** | DB setup | Users, quizzes, quiz_scores tables |

---

## 🔄 User Journey Through Code

### 1. User Registers
```
index.html 
  ↓ (fill form)
script.js → registerForm.submit()
  ↓ (validate)
js/api.js → registerUser()
  ↓ (HTTP POST)
server.js → POST /api/register
  ↓ (insert user)
database.sql → users table
  ↓ (success)
script.js → showLogin()
```

### 2. User Logs In
```
index.html
  ↓ (fill form)
script.js → loginForm.submit()
  ↓ (send credentials)
js/api.js → loginUser()
  ↓ (HTTP POST)
server.js → POST /api/login
  ↓ (check database)
database.sql → find user
  ↓ (return token)
js/api.js → save to localStorage
  ↓ (redirect)
dashboard.html
```

### 3. User Takes Quiz
```
dashboard.html → chooseLevel()
  ↓ (select difficulty)
js/quiz.js → startQuiz(level)
  ↓ (generate questions)
generateQuestions()
  ↓ (display)
renderQuestion()
  ↓ (answer each question)
selectAnswer() → nextQuestion()
  ↓ (complete all 10)
finishQuiz()
  ↓ (calculate score)
saveScoreToDatabase()
  ↓ (HTTP POST)
server.js → POST /api/save-score
  ↓ (insert score)
database.sql → quiz_scores table
  ↓ (show results)
renderQuestion() → Game Over Screen
```

### 4. User Views Scores
```
dashboard.html → showScores()
  ↓ (get user from localStorage)
js/dashboard.js
  ↓ (check history)
user.history array
  ↓ (display HTML)
renderQuestion()
```

---

## 🎯 Key Concepts Explained Simply

### Configuration (js/config.js)
- **What:** Central place for all settings
- **Why:** Easy to change values without editing code logic
- **Example:** Change TOTAL_QUESTIONS: 10 to make 20-question quizzes

### API Functions (js/api.js)
- **What:** Functions that talk to backend
- **How:** Use `fetch()` to send HTTP requests
- **Why:** Separates API logic from UI logic

### State (localStorage)
- **What:** Data stored on user's computer
- **Where:** Can access from DevTools → Application → Storage
- **Why:** Persists even after closing browser

### DOM Manipulation
- **What:** Changing HTML content with JavaScript
- **How:** Use `innerHTML = "<html>"` to render content
- **Why:** Makes UI dynamic and responsive

### Event Listeners
- **What:** Code that runs when something happens
- **How:** `.addEventListener("event", function)`
- **Examples:** 
  - "submit" when form submitted
  - "click" when button clicked

---

## 💻 Running the Application

### Step 1: Start Database
```bash
# Make sure MySQL is running
mysql -u root -p
```

### Step 2: Start Server
```bash
cd "Final Project in SIA"
npm start
# Or: npm run dev (with auto-restart)
```

### Step 3: Open Browser
```
http://localhost:5000
```

### Step 4: Test
1. Register new account
2. Login with credentials
3. Take a quiz
4. Check scores on dashboard
5. View other users' scores

---

## 🐛 Debugging Tips

### Check if Backend is Running
```bash
# Terminal should show: "Server running on http://localhost:5000"
```

### Check Browser Console
- Right-click → Inspect → Console tab
- Look for errors in red

### Check Network Requests
- Inspect → Network tab
- Take quiz, should see POST requests to /api/save-score

### Check Local Storage
- Inspect → Application → Storage → Local Storage
- Should see `authToken` and `currentUser` after login

### Check Database
```sql
-- In MySQL terminal
SELECT * FROM users;
SELECT * FROM quiz_scores;
```

---

## 📊 Data Flow Diagram

```
USER INTERFACE (HTML)
    ↓
LOGIC LAYER (JavaScript)
    ↓
API LAYER (fetch to backend)
    ↓
SERVER (Express.js)
    ↓
DATABASE LAYER (MySQL queries)
    ↓
DATABASE (MySQL)
```

### Example Flow:
```
User clicks "Login" (index.html)
    ↓
Triggers form submit (script.js)
    ↓
Calls loginUser() (js/api.js)
    ↓
Sends POST /api/login (HTTP)
    ↓
Backend processes request (server.js)
    ↓
Queries users table (database.sql)
    ↓
Returns user or error
    ↓
Frontend stores token (localStorage)
    ↓
Redirects to dashboard
```

---

## 🔐 Security Notes

### Current Implementation
- ✅ Login/Register with email and password
- ✅ Passwords stored in database
- ✅ Basic validation on frontend

### For Production (Not implemented)
- ❌ Passwords should be hashed (use bcrypt)
- ❌ Need JWT tokens instead of dummy tokens
- ❌ Need HTTPS instead of HTTP
- ❌ Need rate limiting on login attempts

---

## 📱 Feature Breakdown

### Authentication
- Register new account
- Login with email/password
- Store authentication token

### Quiz Features
- 3 difficulty levels (Easy, Medium, Hard)
- 10 questions per quiz
- 10 minute time limit
- Real-time timer with color coding

### Scoring System
- 10 points per correct answer
- Max score: 100 points
- Tracks: Correct, Wrong, Unanswered

### Dashboard Features
- Current scores
- Time remaining
- Accuracy percentage
- Answer review (show correct/wrong)
- Question progress (which answered)
- View other users' scores
- Leaderboard

### Theme
- Light/Dark mode toggle
- Colors from APP_CONFIG
- Applied to all elements

---

## 🎓 Learning Points

### What Makes Good Code
1. **Comments** - Explain WHY not WHAT
2. **Configuration** - Centralize settings
3. **Separation of Concerns** - API separate from UI
4. **Error Handling** - Check for errors, show messages
5. **State Management** - Track data consistently

### Design Patterns Used
1. **Module Pattern** - Organize code in files
2. **Observer Pattern** - Event listeners
3. **MVC Pattern** - Model (data), View (HTML), Controller (logic)
4. **API Pattern** - Frontend-Backend communication

---

## 📞 For During Defense

### If Asked "How does X work?"

**Q: How does login work?**
A: User enters credentials, frontend sends to backend API, backend queries database, returns token, token stored in localStorage for authentication.

**Q: How does quiz generation work?**
A: generateQuestions() creates 10 random problems based on difficulty level, generates 3 answer choices (1 correct + 2 wrong), shuffles them.

**Q: How are scores saved?**
A: After quiz completes, finishQuiz() calculates correct answers, saves to localStorage (offline), calls API to save to database (persistent).

**Q: How does timer work?**
A: startTimer() uses setInterval to run every 1 second, decrements timer, if reaches 0 automatically calls finishQuiz().

**Q: How are colors managed?**
A: APP_CONFIG.COLORS has all color values, updateTextColors() reads current theme and applies colors to all elements.

### If Asked "What would you improve?"

1. **Security**: Use bcrypt for password hashing, JWT for tokens
2. **Database**: Add more constraints, indexes for performance
3. **UI**: Add animations, loading states
4. **Testing**: Add unit tests for functions
5. **Error Handling**: More specific error messages
6. **Mobile**: Make responsive for phones

---

## ✅ Checklist Before Defense

- [ ] server.js running without errors
- [ ] Database connected (can insert/query)
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can take quiz and see timer
- [ ] Can see scores on dashboard
- [ ] Can view other users' scores
- [ ] Light/Dark theme works
- [ ] All comments are in place
- [ ] Can explain each file's purpose

---

## 📚 Related Documentation

- **CODE_DOCUMENTATION.md** - Detailed code explanation
- **FUNCTION_DOCUMENTATION.md** - Individual function documentation
- **README.md** - Project overview

---

**Quick Start Reminder:**
```bash
npm install        # Install dependencies
npm start         # Start server
# Open http://localhost:5000 in browser
# Test: Register → Login → Take Quiz → View Scores
```

**Version:** 1.0.0  
**Last Updated:** January 28, 2026
=======
# QUICK REFERENCE GUIDE - MATH QUIZ APPLICATION

## 📋 File Guide at a Glance

| File | Purpose | Key Functions |
|------|---------|---|
| **server.js** | Backend API | register, login, save-score, get scores |
| **index.html** | Login page | Form layout for auth |
| **script.js** | Auth logic | showLogin, showRegister, form submission |
| **js/config.js** | Settings | APP_CONFIG object with all settings |
| **js/api.js** | API calls | registerUser, loginUser, saveQuizScore |
| **js/quiz.js** | Game logic | generateQuestions, renderQuestion, finishQuiz |
| **js/dashboard.js** | Dashboard | showScores, showAnswers, showProgress |
| **database.sql** | DB setup | Users, quizzes, quiz_scores tables |

---

## 🔄 User Journey Through Code

### 1. User Registers
```
index.html 
  ↓ (fill form)
script.js → registerForm.submit()
  ↓ (validate)
js/api.js → registerUser()
  ↓ (HTTP POST)
server.js → POST /api/register
  ↓ (insert user)
database.sql → users table
  ↓ (success)
script.js → showLogin()
```

### 2. User Logs In
```
index.html
  ↓ (fill form)
script.js → loginForm.submit()
  ↓ (send credentials)
js/api.js → loginUser()
  ↓ (HTTP POST)
server.js → POST /api/login
  ↓ (check database)
database.sql → find user
  ↓ (return token)
js/api.js → save to localStorage
  ↓ (redirect)
dashboard.html
```

### 3. User Takes Quiz
```
dashboard.html → chooseLevel()
  ↓ (select difficulty)
js/quiz.js → startQuiz(level)
  ↓ (generate questions)
generateQuestions()
  ↓ (display)
renderQuestion()
  ↓ (answer each question)
selectAnswer() → nextQuestion()
  ↓ (complete all 10)
finishQuiz()
  ↓ (calculate score)
saveScoreToDatabase()
  ↓ (HTTP POST)
server.js → POST /api/save-score
  ↓ (insert score)
database.sql → quiz_scores table
  ↓ (show results)
renderQuestion() → Game Over Screen
```

### 4. User Views Scores
```
dashboard.html → showScores()
  ↓ (get user from localStorage)
js/dashboard.js
  ↓ (check history)
user.history array
  ↓ (display HTML)
renderQuestion()
```

---

## 🎯 Key Concepts Explained Simply

### Configuration (js/config.js)
- **What:** Central place for all settings
- **Why:** Easy to change values without editing code logic
- **Example:** Change TOTAL_QUESTIONS: 10 to make 20-question quizzes

### API Functions (js/api.js)
- **What:** Functions that talk to backend
- **How:** Use `fetch()` to send HTTP requests
- **Why:** Separates API logic from UI logic

### State (localStorage)
- **What:** Data stored on user's computer
- **Where:** Can access from DevTools → Application → Storage
- **Why:** Persists even after closing browser

### DOM Manipulation
- **What:** Changing HTML content with JavaScript
- **How:** Use `innerHTML = "<html>"` to render content
- **Why:** Makes UI dynamic and responsive

### Event Listeners
- **What:** Code that runs when something happens
- **How:** `.addEventListener("event", function)`
- **Examples:** 
  - "submit" when form submitted
  - "click" when button clicked

---

## 💻 Running the Application

### Step 1: Start Database
```bash
# Make sure MySQL is running
mysql -u root -p
```

### Step 2: Start Server
```bash
cd "Final Project in SIA"
npm start
# Or: npm run dev (with auto-restart)
```

### Step 3: Open Browser
```
http://localhost:5000
```

### Step 4: Test
1. Register new account
2. Login with credentials
3. Take a quiz
4. Check scores on dashboard
5. View other users' scores

---

## 🐛 Debugging Tips

### Check if Backend is Running
```bash
# Terminal should show: "Server running on http://localhost:5000"
```

### Check Browser Console
- Right-click → Inspect → Console tab
- Look for errors in red

### Check Network Requests
- Inspect → Network tab
- Take quiz, should see POST requests to /api/save-score

### Check Local Storage
- Inspect → Application → Storage → Local Storage
- Should see `authToken` and `currentUser` after login

### Check Database
```sql
-- In MySQL terminal
SELECT * FROM users;
SELECT * FROM quiz_scores;
```

---

## 📊 Data Flow Diagram

```
USER INTERFACE (HTML)
    ↓
LOGIC LAYER (JavaScript)
    ↓
API LAYER (fetch to backend)
    ↓
SERVER (Express.js)
    ↓
DATABASE LAYER (MySQL queries)
    ↓
DATABASE (MySQL)
```

### Example Flow:
```
User clicks "Login" (index.html)
    ↓
Triggers form submit (script.js)
    ↓
Calls loginUser() (js/api.js)
    ↓
Sends POST /api/login (HTTP)
    ↓
Backend processes request (server.js)
    ↓
Queries users table (database.sql)
    ↓
Returns user or error
    ↓
Frontend stores token (localStorage)
    ↓
Redirects to dashboard
```

---

## 🔐 Security Notes

### Current Implementation
- ✅ Login/Register with email and password
- ✅ Passwords stored in database
- ✅ Basic validation on frontend

### For Production (Not implemented)
- ❌ Passwords should be hashed (use bcrypt)
- ❌ Need JWT tokens instead of dummy tokens
- ❌ Need HTTPS instead of HTTP
- ❌ Need rate limiting on login attempts

---

## 📱 Feature Breakdown

### Authentication
- Register new account
- Login with email/password
- Store authentication token

### Quiz Features
- 3 difficulty levels (Easy, Medium, Hard)
- 10 questions per quiz
- 10 minute time limit
- Real-time timer with color coding

### Scoring System
- 10 points per correct answer
- Max score: 100 points
- Tracks: Correct, Wrong, Unanswered

### Dashboard Features
- Current scores
- Time remaining
- Accuracy percentage
- Answer review (show correct/wrong)
- Question progress (which answered)
- View other users' scores
- Leaderboard

### Theme
- Light/Dark mode toggle
- Colors from APP_CONFIG
- Applied to all elements

---

## 🎓 Learning Points

### What Makes Good Code
1. **Comments** - Explain WHY not WHAT
2. **Configuration** - Centralize settings
3. **Separation of Concerns** - API separate from UI
4. **Error Handling** - Check for errors, show messages
5. **State Management** - Track data consistently

### Design Patterns Used
1. **Module Pattern** - Organize code in files
2. **Observer Pattern** - Event listeners
3. **MVC Pattern** - Model (data), View (HTML), Controller (logic)
4. **API Pattern** - Frontend-Backend communication

---

## 📞 For During Defense

### If Asked "How does X work?"

**Q: How does login work?**
A: User enters credentials, frontend sends to backend API, backend queries database, returns token, token stored in localStorage for authentication.

**Q: How does quiz generation work?**
A: generateQuestions() creates 10 random problems based on difficulty level, generates 3 answer choices (1 correct + 2 wrong), shuffles them.

**Q: How are scores saved?**
A: After quiz completes, finishQuiz() calculates correct answers, saves to localStorage (offline), calls API to save to database (persistent).

**Q: How does timer work?**
A: startTimer() uses setInterval to run every 1 second, decrements timer, if reaches 0 automatically calls finishQuiz().

**Q: How are colors managed?**
A: APP_CONFIG.COLORS has all color values, updateTextColors() reads current theme and applies colors to all elements.

### If Asked "What would you improve?"

1. **Security**: Use bcrypt for password hashing, JWT for tokens
2. **Database**: Add more constraints, indexes for performance
3. **UI**: Add animations, loading states
4. **Testing**: Add unit tests for functions
5. **Error Handling**: More specific error messages
6. **Mobile**: Make responsive for phones

---

## ✅ Checklist Before Defense

- [ ] server.js running without errors
- [ ] Database connected (can insert/query)
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can take quiz and see timer
- [ ] Can see scores on dashboard
- [ ] Can view other users' scores
- [ ] Light/Dark theme works
- [ ] All comments are in place
- [ ] Can explain each file's purpose

---

## 📚 Related Documentation

- **CODE_DOCUMENTATION.md** - Detailed code explanation
- **FUNCTION_DOCUMENTATION.md** - Individual function documentation
- **README.md** - Project overview

---

**Quick Start Reminder:**
```bash
npm install        # Install dependencies
npm start         # Start server
# Open http://localhost:5000 in browser
# Test: Register → Login → Take Quiz → View Scores
```

**Version:** 1.0.0  
**Last Updated:** January 28, 2026
>>>>>>> a10d6143e0bfcf74ae470e4c478d2b3c2d1e4d5f
