// ============================================
// APP CONFIGURATION
// Purpose: Centralized settings para sa Math Quiz app
// ============================================

// Main config object - modify values dito to customize app
const APP_CONFIG = {
  // ============ API CONFIG ============
  // Where the backend server is
  API_BASE_URL: 'http://localhost:5000',
  // Max time to wait for API response (in milliseconds)
  API_TIMEOUT: 5000,

  // ============ QUIZ CONFIG ============
  // Settings para sa quiz game
  QUIZ: {
    // Total number ng questions
    TOTAL_QUESTIONS: 10,
    // Time limit in seconds (600 = 10 minutes)
    TIME_LIMIT_SECONDS: 600,
    // Points per correct answer
    POINTS_PER_QUESTION: 10,
    // Difficulty levels
    DIFFICULTY_LEVELS: {
      // Easy: Addition up to 10
      EASY: { name: 'Easy', max: 10, type: 'addition' },
      // Medium: Subtraction up to 30
      MEDIUM: { name: 'Medium', max: 30, type: 'subtraction' },
      // Hard: Multiplication/Division up to 100
      HARD: { name: 'Hard', max: 100, type: 'multiplication/division' }
    }
  },

  // ============ COLOR CONFIG ============
  // Colors used sa app UI
  COLORS: {
    // Primary green
    PRIMARY: '#4CAF50',
    // Light green
    PRIMARY_LIGHT: '#8BC34A',
    // Secondary blue
    SECONDARY: '#2196F3',
    // Error red
    DANGER: '#F44336',
    // Warning orange
    WARNING: '#FF9800',
    // Success green
    SUCCESS: '#4CAF50',
    // Info blue
    INFO: '#2196F3',
    // Neutral gray
    NEUTRAL_GRAY: '#9E9E9E',
    // Dark background
    DARK_BG: '#1e1e1e',
    // Light background
    LIGHT_BG: '#ffffff',
    // Dark text
    DARK_TEXT: '#ffffff',
    // Light text
    LIGHT_TEXT: '#000000'
  },

  // ============ TIMER CONFIG ============
  // Timer color based sa remaining time
  TIMER: {
    // Green threshold (120 seconds = 2 minutes)
    GREEN_THRESHOLD: 120,
    // Orange threshold (60 seconds = 1 minute)
    ORANGE_THRESHOLD: 60,
    // Red below (60 seconds)
    RED_BELOW: 60
  },

  // Number ng answer choices per question
  ANSWER_CHOICES: 3,

  // ============ LOCAL STORAGE KEYS ============
  // Keys para sa browser storage
  STORAGE_KEYS: {
    // Key para sa auth token
    AUTH_TOKEN: 'authToken',
    // Key para sa current user
    CURRENT_USER: 'currentUser',
    // Key para sa users list
    USERS_LIST: 'users',
    // Key para sa theme preference
    THEME: 'theme'
  },

  // ============ MESSAGES ============
  // User messages throughout app
  MESSAGES: {
    // Login success
    LOGIN_SUCCESS: 'Login successful',
    // Registration success
    REGISTER_SUCCESS: 'Account created successfully',
    // Quiz complete
    QUIZ_COMPLETE: 'Quiz completed!',
    // Time up message
    TIME_UP: 'Time is up!',
    // Answer saved
    ANSWER_SAVED: 'Answer saved',
    // No quiz taken yet
    NO_QUIZ: 'No quiz taken yet'
  },

  // ============ DASHBOARD BUTTONS ============
  // Buttons sa dashboard
  DASHBOARD_BUTTONS: [
    // Toggle theme button
    { id: 'theme', label: '🌗 Light / Dark', action: 'toggleTheme()' },
    // Play quiz button
    { id: 'play', label: 'Play the Game', action: 'chooseLevel()' },
    // View scores
    { id: 'scores', label: 'Current Score', action: 'showScores()' },
    // View remaining time
    { id: 'time', label: 'Remaining Time', action: 'showTime()' },
    // View accuracy
    { id: 'accuracy', label: 'Accuracy', action: 'showAccuracy()' },
    // View past answers
    { id: 'answers', label: 'Response Review', action: 'showAnswers()' },
    // View progress
    { id: 'progress', label: 'Question Progress', action: 'showLiveProgress()' },
    // Logout button
    { id: 'logout', label: '🚪 Logout', action: 'logout()', style: 'background:#F44336; color:white; margin-top:20px;' }
  ]
};
