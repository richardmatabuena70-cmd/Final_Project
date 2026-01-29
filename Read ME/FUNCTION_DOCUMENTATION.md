<<<<<<< HEAD
# SUPPLEMENTARY CODE COMMENTS FOR QUIZ.JS AND DASHBOARD.JS

## quiz.js - Remaining Functions

### selectAnswer(ans)
```javascript
// Store user's selected answer for current question
// Parameter: ans - the answer value user selected
// Updates: userAnswers[currentIndex] with selected answer
// Then: Re-renders question to highlight the selected answer
```

### nextQuestion()
```javascript
// Move to next question
// Check: If at last question (currentIndex >= quizData.length - 1)
// If yes: Call finishQuiz() to end quiz
// If no: Increment currentIndex and render next question
```

### prevQuestion()
```javascript
// Move to previous question
// Check: If not at first question (currentIndex > 0)
// If yes: Decrement currentIndex and render previous question
```

### startTimer()
```javascript
// Start countdown timer that runs every 1 second
// setInterval runs every 1000ms (1 second):
//   - Decrement timer by 1
//   - Re-render question (updates timer display)
//   - If timer <= 0: Stop timer and call finishQuiz()
```

### finishQuiz()
```javascript
// End quiz and calculate score
// Steps:
// 1. Stop timer using clearInterval(timerInterval)
// 2. Count correct answers by comparing userAnswers with correct answers
// 3. Get current user from localStorage
// 4. Save quiz to user.history array with:
//    - score (number correct)
//    - timeLeft (remaining timer)
//    - answers (user's answers array)
//    - quiz (questions array)
//    - date (current timestamp)
// 5. Update users array in localStorage
// 6. Save to database via saveScoreToDatabase() API call
// 7. Call showGameOverScreen() to display results
```

### chooseLevel()
```javascript
// Display difficulty level selection buttons
// Shows three buttons: Easy, Medium, Hard
// Each button calls startQuiz(level) with that difficulty
```

### startQuiz(level)
```javascript
// Start quiz with selected difficulty level
// Steps:
// 1. Store level in global 'difficulty' variable (accessed by generateQuestions)
// 2. Call loadGame() to initialize quiz
```

### toggleTheme()
```javascript
// Switch between light theme and dark theme
// Toggle "light-theme" class on body element
// Call updateTextColors() to update all UI colors
```

### updateTextColors()
```javascript
// Update all text and background colors based on current theme
// Check: if body has "light-theme" class
// If light theme:
//   - Text color = black (#000000)
//   - Background = light gray (#f5f5f5)
// If dark theme:
//   - Text color = white (#ffffff)
//   - Background = dark (#111111)
// Apply colors to:
//   - document.body
//   - All panels
//   - All input fields
//   - All buttons
//   - Content area
```

### playAgain()
```javascript
// Reset quiz state to play another round
// Reset all variables:
//   - userAnswers = []
//   - quizData = []
//   - currentIndex = 0
//   - timer = 600
//   - cameFromProgress = false
// Call chooseLevel() to let user select difficulty again
```

### window.onload
```javascript
// Runs when page loads
// Calls updateTextColors() to apply correct theme on page load
```

---

## dashboard.js - Main Functions

### getUser()
```javascript
// Retrieve currently logged-in user from localStorage
// Gets string from APP_CONFIG.STORAGE_KEYS.CURRENT_USER
// Parse JSON string back to object
// Return: user object with id, name, email
```

### loadQuizzesFromDatabase()
```javascript
// Fetch all available quizzes from server
// Call: getQuizzes() from api.js
// Returns: array of quiz objects
```

### saveScoreToDatabase(quizId, score, totalQuestions)
```javascript
// Save user's quiz score to database
// Call: saveQuizScore() from api.js with parameters
// Returns: response with status and message
```

### loadUserScoresFromDatabase()
```javascript
// Fetch current user's all quiz scores from database
// Call: getUserScores() from api.js
// Returns: array of score objects
```

### showScores()
```javascript
// Display all quiz scores for current user on dashboard
// Get user from localStorage
// Check: if user has history (previous quizzes)
// If no history: Show "No quiz taken yet"
// If yes: Display HTML table with:
//   - Game number (Game 1, Game 2, etc.)
//   - Score (e.g., 8/10)
//   - Delete button for each score
// On delete: Call deleteRecord() to remove from history
```

### formatTime(seconds)
```javascript
// Convert seconds to MM:SS format
// Example: 125 seconds → "2:05"
// Calculation:
//   - minutes = Math.floor(seconds / 60)
//   - secs = seconds % 60
//   - Format: "m:ss"
```

### showTime()
```javascript
// Display time remaining for each quiz attempt
// Similar to showScores() but shows formatted time instead of score
// Shows how much time was left when each quiz was completed
```

### showAccuracy()
```javascript
// Calculate and display overall accuracy percentage
// Formula: (Total Correct Answers / Total Questions) * 100
// Example: 15 correct out of 30 questions = 50%
// Show delete all records button
```

### showAnswers()
```javascript
// Display detailed review of all user's answers from all quizzes
// For each quiz in history:
//   - Show quiz number
//   - For each question:
//     - Display question text
//     - Show user's answer
//     - Show correct answer
//     - Color code: Green (✔) if correct, Red (❌) if wrong, Gray if unanswered
// Add button to view other users' answers
```

### showOtherUsersAnswers()
```javascript
// Fetch and display list of all registered users
// API: GET /api/all-users
// For each user:
//   - Display name and email
//   - Add clickable button
// On click: Call viewUserAnswers(userId, userName)
// Error handling: Show "No users found" if list empty
```

### viewUserAnswers(userId, userName)
```javascript
// Display another user's quiz history
// API: GET /api/user-history/:userId
// Show:
//   - User name as header
//   - Back button to user list
//   - For each quiz attempt:
//     - Quiz number
//     - Score (e.g., 8/10)
//     - Date of attempt
//     - Progress bar showing score percentage
// Error handling: Show "No quizzes taken yet" if no scores
```

### showProgress()
```javascript
// Display visual progress of last quiz attempt
// Get last quiz from user.history
// For each question:
//   - Show number button (1-10)
//   - Color: Green if answered, Gray if not answered
// On click: Call goToQuestion(index) to navigate
```

### goToQuestion(index)
```javascript
// Jump to specific question in quiz review
// Set cameFromProgress = true (for back button)
// Set currentIndex = index (jump to question)
// Call renderQuestion() to display it
```

### showLiveProgress()
```javascript
// Show progress during active quiz (game in progress)
// Similar to showProgress() but shows current quiz state
// Display grid of question numbers colored by status:
//   - Green = answered
//   - Gray = not answered
// Clickable to jump to question
```

### showUsers()
```javascript
// Display list of all users
// Get users array from localStorage
// For each user:
//   - Show name and email
//   - Add remove button
```

### removeUser(i)
```javascript
// Remove user from the users list
// Get users array from localStorage
// Remove user at index i using splice()
// Update localStorage with modified array
// Refresh display by calling showUsers()
```

### showAllUsersStats()
```javascript
// Display leaderboard with all users' statistics
// API calls:
//   - GET /api/all-users (get all users)
//   - GET /api/all-scores (get all scores)
// For each user, calculate:
//   - totalQuizzes = count of quizzes taken
//   - bestScore = max score
//   - averageScore = sum of scores / count
// Sort by bestScore (descending)
// Display as ranking:
//   - Rank number (1st place highlighted)
//   - User name and email
//   - Stats: Quizzes taken, Best score, Average score
//   - Progress bar showing best score
```

### deleteRecord(index, refreshFn)
```javascript
// Delete one specific quiz record
// Ask user confirmation: "Delete this record?"
// If yes:
//   - Get user from localStorage
//   - Remove user.history[index] using splice()
//   - Update users array in localStorage
//   - Update current user in localStorage
//   - Call refreshFn() to refresh current view
// If no: Do nothing
```

### deleteAllRecords()
```javascript
// Delete ALL quiz records for current user
// Ask user confirmation: "Delete ALL quiz records?"
// If yes:
//   - Get user from localStorage
//   - Set user.history = [] (empty array)
//   - Update users array in localStorage
//   - Update current user in localStorage
//   - Call showScores() to show empty view
// If no: Do nothing
```

---

## Key Patterns Used

### Form Switching Pattern
```javascript
// Hide element: element.classList.add("hidden")
// Show element: element.classList.remove("hidden")
// Used for: Login/Register form, Quiz levels, Dashboard views
```

### Data Storage Pattern
```javascript
// Store: localStorage.setItem(key, JSON.stringify(object))
// Retrieve: JSON.parse(localStorage.getItem(key))
// Used for: User data, Quiz history, Authentication token
```

### HTML Template Pattern
```javascript
// Generate HTML strings: content.innerHTML = `<html string>`
// Used for: Dynamic content rendering on dashboard
// Advantages: Easy to create complex UI from data
```

### Array Mapping Pattern
```javascript
// arr.map((item, i) => `<html for ${item}>`).join("")
// Used for: Creating HTML lists from data arrays
// Used in: Quiz choices, Score lists, User lists
```

### Conditional Rendering Pattern
```javascript
// if (condition) { show A } else { show B }
// Used for: Different screens based on state
// Examples:
//   - Show game over screen if quiz complete
//   - Show "no data" if empty
//   - Show different content based on theme
```

### Event Listener Pattern
```javascript
// element.addEventListener("event", handler)
// Used for: Form submission, Button clicks, Input changes
// Examples:
//   - Form submit: triggers API call
//   - Button click: shows new content
//   - Form change: validates input
```

---

## State Management

### User State (localStorage)
```javascript
{
  id: 1,
  name: "John",
  email: "john@example.com",
  history: [
    { score: 8, timeLeft: 245, answers: [...], quiz: [...], date: "..." },
    { score: 9, timeLeft: 120, answers: [...], quiz: [...], date: "..." }
  ]
}
```

### Quiz State (global variables)
```javascript
quizData = [
  { question: "5 + 3 = ?", choices: [8, 7, 9], answer: 8 },
  ...
]
userAnswers = [8, null, 9, ...] // null means unanswered
currentIndex = 0 // which question showing
timer = 345 // seconds remaining
```

### Theme State
```javascript
// Stored in localStorage: theme key
// Applied by: "light-theme" class on body element
// Affects: updateTextColors() function
```

---

**Note:** These patterns ensure the application is maintainable, scalable, and follows best practices for web development.
=======
# SUPPLEMENTARY CODE COMMENTS FOR QUIZ.JS AND DASHBOARD.JS

## quiz.js - Remaining Functions

### selectAnswer(ans)
```javascript
// Store user's selected answer for current question
// Parameter: ans - the answer value user selected
// Updates: userAnswers[currentIndex] with selected answer
// Then: Re-renders question to highlight the selected answer
```

### nextQuestion()
```javascript
// Move to next question
// Check: If at last question (currentIndex >= quizData.length - 1)
// If yes: Call finishQuiz() to end quiz
// If no: Increment currentIndex and render next question
```

### prevQuestion()
```javascript
// Move to previous question
// Check: If not at first question (currentIndex > 0)
// If yes: Decrement currentIndex and render previous question
```

### startTimer()
```javascript
// Start countdown timer that runs every 1 second
// setInterval runs every 1000ms (1 second):
//   - Decrement timer by 1
//   - Re-render question (updates timer display)
//   - If timer <= 0: Stop timer and call finishQuiz()
```

### finishQuiz()
```javascript
// End quiz and calculate score
// Steps:
// 1. Stop timer using clearInterval(timerInterval)
// 2. Count correct answers by comparing userAnswers with correct answers
// 3. Get current user from localStorage
// 4. Save quiz to user.history array with:
//    - score (number correct)
//    - timeLeft (remaining timer)
//    - answers (user's answers array)
//    - quiz (questions array)
//    - date (current timestamp)
// 5. Update users array in localStorage
// 6. Save to database via saveScoreToDatabase() API call
// 7. Call showGameOverScreen() to display results
```

### chooseLevel()
```javascript
// Display difficulty level selection buttons
// Shows three buttons: Easy, Medium, Hard
// Each button calls startQuiz(level) with that difficulty
```

### startQuiz(level)
```javascript
// Start quiz with selected difficulty level
// Steps:
// 1. Store level in global 'difficulty' variable (accessed by generateQuestions)
// 2. Call loadGame() to initialize quiz
```

### toggleTheme()
```javascript
// Switch between light theme and dark theme
// Toggle "light-theme" class on body element
// Call updateTextColors() to update all UI colors
```

### updateTextColors()
```javascript
// Update all text and background colors based on current theme
// Check: if body has "light-theme" class
// If light theme:
//   - Text color = black (#000000)
//   - Background = light gray (#f5f5f5)
// If dark theme:
//   - Text color = white (#ffffff)
//   - Background = dark (#111111)
// Apply colors to:
//   - document.body
//   - All panels
//   - All input fields
//   - All buttons
//   - Content area
```

### playAgain()
```javascript
// Reset quiz state to play another round
// Reset all variables:
//   - userAnswers = []
//   - quizData = []
//   - currentIndex = 0
//   - timer = 600
//   - cameFromProgress = false
// Call chooseLevel() to let user select difficulty again
```

### window.onload
```javascript
// Runs when page loads
// Calls updateTextColors() to apply correct theme on page load
```

---

## dashboard.js - Main Functions

### getUser()
```javascript
// Retrieve currently logged-in user from localStorage
// Gets string from APP_CONFIG.STORAGE_KEYS.CURRENT_USER
// Parse JSON string back to object
// Return: user object with id, name, email
```

### loadQuizzesFromDatabase()
```javascript
// Fetch all available quizzes from server
// Call: getQuizzes() from api.js
// Returns: array of quiz objects
```

### saveScoreToDatabase(quizId, score, totalQuestions)
```javascript
// Save user's quiz score to database
// Call: saveQuizScore() from api.js with parameters
// Returns: response with status and message
```

### loadUserScoresFromDatabase()
```javascript
// Fetch current user's all quiz scores from database
// Call: getUserScores() from api.js
// Returns: array of score objects
```

### showScores()
```javascript
// Display all quiz scores for current user on dashboard
// Get user from localStorage
// Check: if user has history (previous quizzes)
// If no history: Show "No quiz taken yet"
// If yes: Display HTML table with:
//   - Game number (Game 1, Game 2, etc.)
//   - Score (e.g., 8/10)
//   - Delete button for each score
// On delete: Call deleteRecord() to remove from history
```

### formatTime(seconds)
```javascript
// Convert seconds to MM:SS format
// Example: 125 seconds → "2:05"
// Calculation:
//   - minutes = Math.floor(seconds / 60)
//   - secs = seconds % 60
//   - Format: "m:ss"
```

### showTime()
```javascript
// Display time remaining for each quiz attempt
// Similar to showScores() but shows formatted time instead of score
// Shows how much time was left when each quiz was completed
```

### showAccuracy()
```javascript
// Calculate and display overall accuracy percentage
// Formula: (Total Correct Answers / Total Questions) * 100
// Example: 15 correct out of 30 questions = 50%
// Show delete all records button
```

### showAnswers()
```javascript
// Display detailed review of all user's answers from all quizzes
// For each quiz in history:
//   - Show quiz number
//   - For each question:
//     - Display question text
//     - Show user's answer
//     - Show correct answer
//     - Color code: Green (✔) if correct, Red (❌) if wrong, Gray if unanswered
// Add button to view other users' answers
```

### showOtherUsersAnswers()
```javascript
// Fetch and display list of all registered users
// API: GET /api/all-users
// For each user:
//   - Display name and email
//   - Add clickable button
// On click: Call viewUserAnswers(userId, userName)
// Error handling: Show "No users found" if list empty
```

### viewUserAnswers(userId, userName)
```javascript
// Display another user's quiz history
// API: GET /api/user-history/:userId
// Show:
//   - User name as header
//   - Back button to user list
//   - For each quiz attempt:
//     - Quiz number
//     - Score (e.g., 8/10)
//     - Date of attempt
//     - Progress bar showing score percentage
// Error handling: Show "No quizzes taken yet" if no scores
```

### showProgress()
```javascript
// Display visual progress of last quiz attempt
// Get last quiz from user.history
// For each question:
//   - Show number button (1-10)
//   - Color: Green if answered, Gray if not answered
// On click: Call goToQuestion(index) to navigate
```

### goToQuestion(index)
```javascript
// Jump to specific question in quiz review
// Set cameFromProgress = true (for back button)
// Set currentIndex = index (jump to question)
// Call renderQuestion() to display it
```

### showLiveProgress()
```javascript
// Show progress during active quiz (game in progress)
// Similar to showProgress() but shows current quiz state
// Display grid of question numbers colored by status:
//   - Green = answered
//   - Gray = not answered
// Clickable to jump to question
```

### showUsers()
```javascript
// Display list of all users
// Get users array from localStorage
// For each user:
//   - Show name and email
//   - Add remove button
```

### removeUser(i)
```javascript
// Remove user from the users list
// Get users array from localStorage
// Remove user at index i using splice()
// Update localStorage with modified array
// Refresh display by calling showUsers()
```

### showAllUsersStats()
```javascript
// Display leaderboard with all users' statistics
// API calls:
//   - GET /api/all-users (get all users)
//   - GET /api/all-scores (get all scores)
// For each user, calculate:
//   - totalQuizzes = count of quizzes taken
//   - bestScore = max score
//   - averageScore = sum of scores / count
// Sort by bestScore (descending)
// Display as ranking:
//   - Rank number (1st place highlighted)
//   - User name and email
//   - Stats: Quizzes taken, Best score, Average score
//   - Progress bar showing best score
```

### deleteRecord(index, refreshFn)
```javascript
// Delete one specific quiz record
// Ask user confirmation: "Delete this record?"
// If yes:
//   - Get user from localStorage
//   - Remove user.history[index] using splice()
//   - Update users array in localStorage
//   - Update current user in localStorage
//   - Call refreshFn() to refresh current view
// If no: Do nothing
```

### deleteAllRecords()
```javascript
// Delete ALL quiz records for current user
// Ask user confirmation: "Delete ALL quiz records?"
// If yes:
//   - Get user from localStorage
//   - Set user.history = [] (empty array)
//   - Update users array in localStorage
//   - Update current user in localStorage
//   - Call showScores() to show empty view
// If no: Do nothing
```

---

## Key Patterns Used

### Form Switching Pattern
```javascript
// Hide element: element.classList.add("hidden")
// Show element: element.classList.remove("hidden")
// Used for: Login/Register form, Quiz levels, Dashboard views
```

### Data Storage Pattern
```javascript
// Store: localStorage.setItem(key, JSON.stringify(object))
// Retrieve: JSON.parse(localStorage.getItem(key))
// Used for: User data, Quiz history, Authentication token
```

### HTML Template Pattern
```javascript
// Generate HTML strings: content.innerHTML = `<html string>`
// Used for: Dynamic content rendering on dashboard
// Advantages: Easy to create complex UI from data
```

### Array Mapping Pattern
```javascript
// arr.map((item, i) => `<html for ${item}>`).join("")
// Used for: Creating HTML lists from data arrays
// Used in: Quiz choices, Score lists, User lists
```

### Conditional Rendering Pattern
```javascript
// if (condition) { show A } else { show B }
// Used for: Different screens based on state
// Examples:
//   - Show game over screen if quiz complete
//   - Show "no data" if empty
//   - Show different content based on theme
```

### Event Listener Pattern
```javascript
// element.addEventListener("event", handler)
// Used for: Form submission, Button clicks, Input changes
// Examples:
//   - Form submit: triggers API call
//   - Button click: shows new content
//   - Form change: validates input
```

---

## State Management

### User State (localStorage)
```javascript
{
  id: 1,
  name: "John",
  email: "john@example.com",
  history: [
    { score: 8, timeLeft: 245, answers: [...], quiz: [...], date: "..." },
    { score: 9, timeLeft: 120, answers: [...], quiz: [...], date: "..." }
  ]
}
```

### Quiz State (global variables)
```javascript
quizData = [
  { question: "5 + 3 = ?", choices: [8, 7, 9], answer: 8 },
  ...
]
userAnswers = [8, null, 9, ...] // null means unanswered
currentIndex = 0 // which question showing
timer = 345 // seconds remaining
```

### Theme State
```javascript
// Stored in localStorage: theme key
// Applied by: "light-theme" class on body element
// Affects: updateTextColors() function
```

---

**Note:** These patterns ensure the application is maintainable, scalable, and follows best practices for web development.
>>>>>>> a10d6143e0bfcf74ae470e4c478d2b3c2d1e4d5f
