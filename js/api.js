// ============================================
// API COMMUNICATION MODULE
// Purpose: Handle all HTTP requests to backend
// ============================================

// Set API base URL
const API_URL = APP_CONFIG.API_BASE_URL + '/api';

// ============ TOKEN & USER MANAGEMENT ============

// Get auth token from browser storage
function getToken() {
  return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
}

// Get current logged-in user
function getCurrentUser() {
  // Get user from storage
  const userStr = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
  // Parse at return, or null
  return userStr ? JSON.parse(userStr) : null;
}

// Logout user - clear data at redirect
function logout() {
  // Remove token
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  // Remove user
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
  // Go back to login
  window.location.href = 'index.html';
}

// ============ AUTHENTICATION FUNCTIONS ============

// Register new user account
// Parameters: name, email, password
// Returns: Response object
async function registerUser(name, email, password) {
  try {
    // Send registration request to backend
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    // Get response data
    const data = await response.json();
    // Return response
    return data;
  } catch (error) {
    // Log error
    console.error('Register error:', error);
    // Return error message
    return { status: 'error', message: 'Network error' };
  }
}

// Login user with email at password
// Parameters: email, password
// Returns: Response with token at user info
async function loginUser(email, password) {
  try {
    // Send login request to backend
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    // Get response data
    const data = await response.json();
    
    // If login successful, store token and user info in localStorage
    if (data.status === 'success') {
      // Save token to storage
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.token);
      // Save user info
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
    }
    // Return response
    return data;
  } catch (error) {
    // Log error
    console.error('Login error:', error);
    // Return error
    return { status: 'error', message: 'Network error' };
  }
}

// ============ QUIZ FUNCTIONS ============

// Get all available quizzes from database
// Returns: Array ng quizzes
async function getQuizzes() {
  try {
    // Fetch quizzes from backend
    const response = await fetch(`${API_URL}/quizzes`);
    // Parse response
    const data = await response.json();
    // Return quizzes
    return data;
  } catch (error) {
    // Log error
    console.error('Error fetching quizzes:', error);
    // Return empty array
    return [];
  }
}

// ============ SCORE FUNCTIONS ============

// Save quiz score to database
// Parameters: quizId, score, totalQuestions
// Returns: Response object
async function saveQuizScore(quizId, score, totalQuestions) {
  try {
    // Get current user
    const user = getCurrentUser();
    if (!user) {
      console.error('User not logged in');
      return { status: 'error', message: 'User not logged in' };
    }

    // Send score data to backend
    const response = await fetch(`${API_URL}/save-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` // Add auth token
      },
      // Send score data
      body: JSON.stringify({
        userId: user.id,
        quizId,
        score,
        totalQuestions
      })
    });
    // Parse response
    const data = await response.json();
    // Return response
    return data;
  } catch (error) {
    // Log error
    console.error('Error saving score:', error);
    // Return error
    return { status: 'error', message: 'Network error' };
  }
}

// Get all scores para sa current user
// Returns: Array ng scores from database
async function getUserScores() {
  try {
    // Get current user
    const user = getCurrentUser();
    if (!user) {
      console.error('User not logged in');
      return [];
    }

    // Fetch user scores from backend
    const response = await fetch(`${API_URL}/scores/${user.id}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` } // Add auth token
    });
    // Parse response
    const data = await response.json();
    // Return scores
    return data;
  } catch (error) {
    // Log error
    console.error('Error fetching scores:', error);
    // Return empty array
    return [];
  }
}
