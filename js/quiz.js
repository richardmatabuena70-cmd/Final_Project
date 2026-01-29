// Store all questions
let quizData = [];
// Current question index
let currentIndex = 0;
// Store user answers
let userAnswers = [];
// Remaining time (600 = 10 minutes)
let timer = 600;
// Timer interval ID
let timerInterval;
// Flag kung galing sa progress view
let cameFromProgress = false;


// taga generate ng questions depende sa difficulty level
// EASY: Addition 1-10
// MEDIUM: Subtraction 1-30
// HARD: Multiplication/Division 1-100
function generateQuestions() {
  // Reset questions array
  quizData = [];

  // Get difficulty level
  let max;
  const difficulty = window.difficulty || "easy";

  // Set number range based on difficulty
  if (difficulty === "easy") max = APP_CONFIG.QUIZ.DIFFICULTY_LEVELS.EASY.max;
  else if (difficulty === "medium")
    max = APP_CONFIG.QUIZ.DIFFICULTY_LEVELS.MEDIUM.max;
  else max = APP_CONFIG.QUIZ.DIFFICULTY_LEVELS.HARD.max;

  // Generate 10 questions
  for (let i = 0; i < APP_CONFIG.QUIZ.TOTAL_QUESTIONS; i++) {
    // Generate two random numbers
    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;

    // Store question at correct answer
    let question, correct;

    // Create question based on difficulty
    if (difficulty === "easy") {
      // EASY: Addition
      correct = a + b;
      question = `${a} + ${b} = ?`;
    } else if (difficulty === "medium") {
      // MEDIUM: Subtraction
      if (b > a) [a, b] = [b, a]; // Swap kung needed
      correct = a - b;
      question = `${a} - ${b} = ?`;
    } else {
      // HARD: Multiplication or Division
      if (Math.random() < 0.5) {
        // Multiplication
        correct = a * b;
        question = `${a} × ${b} = ?`;
      } else {
        // Division
        correct = a;
        const dividend = a * b;
        question = `${dividend} ÷ ${b} = ?`;
      }
    }

    // Generate answer choices
    let choices = new Set([correct]); // Start with correct answer
    // Add 2 more choices
    while (choices.size < APP_CONFIG.ANSWER_CHOICES) {
      // Generate wrong answer
      choices.add(correct + Math.floor(Math.random() * 10) - 5);
    }

    // Add question to array
    quizData.push({
      question, // Question text
      choices: [...choices].sort(() => Math.random() - 0.5), // Shuffle choices
      answer: correct, // Store correct answer
    });
  }
}

// Start quiz game
// Set up questions at display first question
function loadGame() {
  generateQuestions(); // Create 10 questions
  // Initialize answers array
  userAnswers = Array(APP_CONFIG.QUIZ.TOTAL_QUESTIONS).fill(null);
  currentIndex = 0; // Start at first question
  timer = APP_CONFIG.QUIZ.TIME_LIMIT_SECONDS; // Reset timer
  startTimer(); // Start countdown
  renderQuestion(); // Show first question
}

// ============ QUESTION DISPLAY ============

// Show current question or game over screen
// Display quiz interface at update it
function renderQuestion() {
  // Check if quiz is complete
  if (currentIndex >= quizData.length) {
    // ============ GAME OVER ============
    // Count results
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    // Count each result
    quizData.forEach((q, i) => {
      if (userAnswers[i] === null || userAnswers[i] === undefined) {
        unanswered++; // No answer
      } else if (userAnswers[i] === q.answer) {
        correct++; // Correct answer
      } else {
        wrong++; // Wrong answer
      }
    });

    // Calculate total score
    const score = correct * 10;
    // Get current user
    const user = getUser();

    // Create game over screen
    content.innerHTML = `
      <div style="
        max-width:500px;
        margin:40px auto;
        padding:25px;
        border-radius:12px;
        text-align:center;
        background:#1e1e1e;
        color:white;
      ">
        <!-- Game over title -->
        <h1>🎮 Game Over</h1>
        <!-- Player name -->
        <h2>${user?.name || "Player"}</h2>

        <!-- Score summary -->
        <p><b>Score:</b> ${score} / ${quizData.length * 10}</p>
        <!-- Correct answers -->
        <p>✅ Correct: ${correct}</p>
        <p>❌ Wrong: ${wrong}</p>
        <p>⚪ Unanswered: ${unanswered}</p>

        <div style="margin-top:20px">
          <button onclick="showAnswers()">📋 Review Answers</button>
          <button onclick="showProgress()">📊 Question Progress</button>
          <button onclick="playAgain()">🔁 Play Again</button>
        </div>
      </div>
    `;
    return;
  }

  // For button highlight

  let q = quizData[currentIndex];

  // Back button kung galing sa progress view
  let backButton = cameFromProgress
    ? `<button onclick="backToProgress()">⬅ Back to Question Progress</button>`
    : "";

  // Format timer display
  const mins = Math.floor(timer / 60);
  const secs = timer % 60;
  const timerDisplay = `${mins}:${secs.toString().padStart(2, "0")}`;
  // Timer color: green, orange, or red
  const timerColor =
    timer > APP_CONFIG.TIMER.GREEN_THRESHOLD
      ? APP_CONFIG.COLORS.PRIMARY
      : timer > APP_CONFIG.TIMER.ORANGE_THRESHOLD
        ? APP_CONFIG.COLORS.WARNING
        : APP_CONFIG.COLORS.DANGER;

  // Show question interface
  content.innerHTML = `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:15px;
      padding:10px;
      background:#f0f0f0;
      border-radius:8px;
    ">
      <div><strong>Question ${currentIndex + 1}/10</strong></div>
      <div style="
        font-size:20px;
        font-weight:bold;
        color:${timerColor};
        background:white;
        padding:8px 15px;
        border-radius:6px;
        border:2px solid ${timerColor};
      ">
        ⏱ ${timerDisplay}
      </div>
    </div>

    ${backButton}
    <h2>Question ${currentIndex + 1}/10</h2>
    <h3>${q.question}</h3>

    ${q.choices
      .map(
        (c) => `
      <button class="${userAnswers[currentIndex] === c ? "selected" : ""}"
        onclick="selectAnswer(${c})">${c}</button>
    `,
      )
      .join("")}

    <div style="margin-top:20px">
      <button onclick="prevQuestion()">Previous</button>
      <button onclick="nextQuestion()">Next</button>
    </div>
  `;

  // Update colors
  updateTextColors();

  function backToProgress() {
    cameFromProgress = false;
    showProgress();
  }

  // Highlight selected answer
  const isLight = document.body.classList.contains("light-theme");
  const selectedBg = isLight ? "#b0e0e6" : "#1e90ff";
  const selectedText = isLight ? "#000000" : "#ffffff";

  // Style selected button
  document.querySelectorAll("button.selected").forEach((b) => {
    b.style.backgroundColor = selectedBg;
    b.style.color = selectedText;
  });
}

// Show game over screen with review options
function showGameOverScreen() {
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  // Count results
  quizData.forEach((q, i) => {
    if (userAnswers[i] === null || userAnswers[i] === undefined) {
      unanswered++;
    } else if (userAnswers[i] === q.answer) {
      correct++;
    } else {
      wrong++;
    }
  });

  // Calculate score
  const score = correct * 10;
  const user = getUser();

  // Show game over screen
  content.innerHTML = `
    <div style="
      max-width:500px;
      margin:40px auto;
      padding:25px;
      border-radius:12px;
      text-align:center;
      background:#1e1e1e;
      color:white;
    ">
      <h1>🎮 Game Over</h1>
      <h2>${user?.name || "Player"}</h2>

      <p><b>Score:</b> ${score} / ${quizData.length * 10}</p>
      <p>✅ Correct: ${correct}</p>
      <p>❌ Wrong: ${wrong}</p>
      <p>⚪ Unanswered: ${unanswered}</p>

      <div style="margin-top:20px">
        <button onclick="showAnswers()">📋 Review Answers</button>
        <button onclick="showProgress()">📊 Question Progress</button>
        <button onclick="playAgain()">🔁 Play Again</button>
      </div>
    </div>
  `;
}

// Save selected answer
function selectAnswer(ans) {
  userAnswers[currentIndex] = ans;
  renderQuestion();
}

// Go to specific question
function goToQuestion(index) {
  cameFromProgress = true;
  currentIndex = index;

  // Load last quiz session
  const user = getUser();
  if (!user || !user.history || user.history.length === 0) return;

  const lastGame = user.history.at(-1);
  quizData = lastGame.quiz; // Load last quiz questions
  userAnswers = lastGame.answers; // Load last answers

  renderQuestion();
}

// Back to progress view
function backToProgress() {
  cameFromProgress = false;
}

// Back to progress view
function backToProgress() {
  cameFromProgress = false;
  showLiveProgress();
}

// Go to next question
function nextQuestion() {
  // Finish quiz kung last question na
  if (currentIndex >= quizData.length - 1) {
    finishQuiz();
    return;
  }
  currentIndex++;
  renderQuestion();
}

// Go to previous question
function prevQuestion() {
  if (currentIndex > 0) currentIndex--;
  renderQuestion();
}

// Start countdown timer
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    // Update display every second
    if (currentIndex < quizData.length) {
      renderQuestion();
    }
    // Finish quiz kung time up
    if (timer <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);
}

// Finish quiz at save results
function finishQuiz() {
  clearInterval(timerInterval);

  // Count correct answers
  let correct = 0;
  quizData.forEach((q, i) => {
    if (userAnswers[i] === q.answer) correct++;
  });

  // Get current user
  const user = JSON.parse(localStorage.getItem("currentUser"));
  user.history = user.history || [];

  // Add game to history
  user.history.push({
    score: correct,
    timeLeft: timer,
    answers: [...userAnswers],
    quiz: [...quizData],
    date: new Date().toISOString(),
  });

  // Update users list
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map((u) => (u.email === user.email ? user : u));

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Save to database
  saveScoreToDatabase(1, correct, 10).catch((err) =>
    console.error("Database save error:", err),
  );

  //  show game over screen pagtapos ng quiz
  showGameOverScreen();
}

function chooseLevel() {
  content.innerHTML = `
    <h2>Select Quiz Level</h2>
    <button onclick="startQuiz('easy')">Easy</button>
    <button onclick="startQuiz('medium')">Medium</button>
    <button onclick="startQuiz('hard')">Hard</button>
  `;
}
function startQuiz(level) {
  difficulty = level;
  loadGame();
}

// wala lang nilagyan ko lang ng darkmode HAHAHA
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  updateTextColors();
}

// dito naman sumasabay yung kulay ng text pag nag darkmode or lightmode
function updateTextColors() {
  // Determine current theme
  const isLight = document.body.classList.contains("light-theme");

  // kulay ng text nakakalito e
  const textColor = isLight ? "#000000" : "#ffffff";
  const panelColor = isLight ? "#ffffff" : "#1e1e1e";
  const buttonBg = isLight ? "#f0f0f0" : "#2a2a2a";
  const buttonText = isLight ? "#000000" : "#ffffff";

  // Body & main content
  document.body.style.color = textColor;
  document.body.style.backgroundColor = isLight ? "#f5f5f5" : "#111111";

  // Panels lang to ng login&signup phase
  const panels = document.querySelectorAll(".panel");
  panels.forEach((p) => {
    p.style.backgroundColor = panelColor;
    p.style.color = textColor;
  });

  // Inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((i) => {
    i.style.backgroundColor = isLight ? "#ffffff" : "#333333";
    i.style.color = textColor;
    i.style.borderColor = isLight ? "#ccc" : "#555";
  });

  // Buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((b) => {
    b.style.backgroundColor = buttonBg;
    b.style.color = buttonText;
  });

  // Main content
  const contentArea = document.getElementById("content");
  if (contentArea) {
    contentArea.style.color = textColor;
  }
}

// kusa lang mag load ng text colors pag nag load yung page
window.onload = function () {
  updateTextColors();
};

function playAgain() {
  userAnswers = [];
  quizData = [];
  currentIndex = 0;
  timer = 600;
  cameFromProgress = false;

  chooseLevel(); // pag pinindot yung play again babalik sa level selection para maglaro ulit
}

