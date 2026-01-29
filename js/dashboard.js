function getUser() {
  const userStr = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
}

// ============ DATABASE FUNCTIONS ============

// Load quizzes from database
async function loadQuizzesFromDatabase() {
  const quizzes = await getQuizzes();
  return quizzes;
}

// Save score to database
async function saveScoreToDatabase(quizId, score, totalQuestions) {
  return await saveQuizScore(quizId, score, totalQuestions);
}

// Get user's scores from database
async function loadUserScoresFromDatabase() {
  return await getUserScores();
}

function showScores() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Current Scores</h2><p>No quiz taken yet.</p>";
    return;
  }

  content.innerHTML = `
    <h2>Current Scores</h2>
    ${user.history
      .map(
        (h, i) => `
      <div style="
        margin-bottom:10px;
        padding:6px;
        border-radius:6px;
        border:1px solid #ccc;
      ">
        Game ${i + 1}: <b>${h.score}/${APP_CONFIG.QUIZ.TOTAL_QUESTIONS}</b>
        <button onclick="deleteRecord(${i}, showScores)">🗑 Delete</button>
      </div>
    `,
      )
      .join("")}
  `;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function showTime() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Remaining Time</h2><p>No quiz taken yet.</p>";
    return;
  }

  content.innerHTML = `
    <h2>Remaining Time</h2>
    ${user.history
      .map(
        (h, i) => `
      <div style="
        margin-bottom:10px;
        padding:6px;
        border-radius:6px;
        border:1px solid #ccc;
      ">
        Game ${i + 1}: ⏱ ${formatTime(h.timeLeft)}
        <button onclick="deleteRecord(${i}, showTime)">🗑 Delete</button>
      </div>
    `,
      )
      .join("")}
  `;
}

function showAccuracy() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Accuracy</h2><p>No quiz taken yet.</p>";
    return;
  }

  const totalQuestions = user.history.length * 10;
  const correctAnswers = user.history.reduce((a, b) => a + b.score, 0);
  const acc = totalQuestions
    ? ((correctAnswers / totalQuestions) * 100).toFixed(2)
    : 0;

  content.innerHTML = `
    <h2>Accuracy</h2>
    <div style="
      margin-bottom:10px;
      padding:6px;
      border-radius:6px;
      border:1px solid #ccc;
    ">
      Accuracy: <b>${acc}%</b>
    </div>
    <button onclick="deleteAllRecords()">🗑 Delete All Records</button>
  `;
}

function showAnswers() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Response Review</h2><p>No quiz taken yet.</p>";
    return;
  }

  content.innerHTML = `
    <h2>Response Review - Your Answers</h2>
    <button onclick="showOtherUsersAnswers()" style="margin-bottom:15px; padding:8px 15px; background:${APP_CONFIG.COLORS.SECONDARY}; color:white; border:none; border-radius:6px; cursor:pointer;">
      👥 View Other Users' Answers
    </button>

    ${user.history
      .map(
        (h, gameIndex) => `
      <div style="
        margin-bottom:25px; 
        padding:10px; 
        border:1px solid #ccc; 
        border-radius:8px;
      ">
        <h3>
          Quiz ${gameIndex + 1}
          <button onclick="deleteRecord(${gameIndex}, showAnswers)">🗑 Delete</button>
        </h3>

        ${h.quiz
          .map((q, i) => {
            const userAns = h.answers[i];
            const isCorrect = userAns === q.answer;
            const isUnanswered = userAns === null;

            let bg = APP_CONFIG.COLORS.SUCCESS;
            if (isUnanswered) bg = APP_CONFIG.COLORS.NEUTRAL_GRAY;
            else if (!isCorrect) bg = APP_CONFIG.COLORS.DANGER;

            return `
            <div style="
              margin:6px 0;
              padding:8px;
              border-radius:6px;
              background:${bg};
              color:white;
            ">
              <strong>Q${i + 1}:</strong> ${q.question}<br>
              Your Answer: <b>${userAns ?? "No Answer"}</b><br>
              Correct Answer: <b>${q.answer}</b>
              ${isCorrect ? " ✔" : !isUnanswered ? " ❌" : ""}
            </div>
          `;
          })
          .join("")}
      </div>
    `,
      )
      .join("")}
  `;
}

// Show other users' answers
async function showOtherUsersAnswers() {
  try {
    content.innerHTML =
      "<h2>👥 Other Users Responses</h2><p>Loading users...</p>";

    // Fetch all users
    const response = await fetch(`${API_URL}/all-users`);
    const allUsers = await response.json();

    if (!allUsers || allUsers.length === 0) {
      content.innerHTML =
        "<h2>👥 Other Users Responses</h2><p>No users found</p>";
      return;
    }

    // Display user list
    content.innerHTML = `
      <h2>👥 Other Users - Quiz Responses</h2>
      <p>Click on a user to view their quiz answers:</p>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${allUsers
          .map(
            (user) => `
          <button onclick="viewUserAnswers(${user.id}, '${user.name}')" style="
            padding:12px;
            text-align:left;
            border:2px solid #ccc;
            border-radius:8px;
            background:#f9f9f9;
            cursor:pointer;
            font-weight:bold;
          ">
            👤 ${user.name} (${user.email})
          </button>
        `,
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error:", error);
    content.innerHTML =
      "<h2>👥 Other Users Responses</h2><p>Error loading users</p>";
  }
}

// View specific user's answers
async function viewUserAnswers(userId, userName) {
  try {
    content.innerHTML = `<h2>📋 ${userName}'s Quiz Answers</h2><p>Loading...</p>`;

    const response = await fetch(`${API_URL}/user-history/${userId}`);
    const data = await response.json();

    if (!data.scores || data.scores.length === 0) {
      content.innerHTML = `<h2>📋 ${userName}'s Quiz Answers</h2><p>No quizzes taken yet</p>
        <button onclick="showOtherUsersAnswers()" style="margin-top:15px; padding:8px 15px; background:${APP_CONFIG.COLORS.SECONDARY}; color:white; border:none; border-radius:6px; cursor:pointer;">
          ⬅ Back to Users List
        </button>`;
      return;
    }

    // Display user's scores
    content.innerHTML = `
      <h2>📋 ${userName}'s Quiz History</h2>
      <button onclick="showOtherUsersAnswers()" style="margin-bottom:15px; padding:8px 15px; background:${APP_CONFIG.COLORS.SECONDARY}; color:white; border:none; border-radius:6px; cursor:pointer;">
        ⬅ Back to Users List
      </button>
      
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${data.scores
          .map(
            (score, i) => `
          <div style="
            padding:12px;
            border-radius:8px;
            border:2px solid ${APP_CONFIG.COLORS.PRIMARY};
            background:#f9f9f9;
          ">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>Quiz #${i + 1}</strong>
                <p style="margin:5px 0; color:#666;">Score: <strong>${score.score}/${score.total_questions}</strong> | Date: ${new Date(score.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div style="
              margin-top:8px;
              height:20px;
              border-radius:6px;
              background:#ddd;
              overflow:hidden;
            ">
              <div style="
                width:${(score.score / score.total_questions) * 100}%;
                height:100%;
                background:linear-gradient(to right, ${APP_CONFIG.COLORS.PRIMARY}, ${APP_CONFIG.COLORS.PRIMARY_LIGHT});
                border-radius:6px;
              "></div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error:", error);
    content.innerHTML = "<h2>Error</h2><p>Failed to load user answers</p>";
  }
}

function showProgress() {
  const user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = `
      <h2>Question Progress</h2>
      <p>No quiz taken yet.</p>
    `;
    return;
  }

  // dito ma rerecord yung last quiz
  const lastGame = user.history.at(-1);
  const answers = lastGame.answers || [];

  // Fixed colors, theme-independent
  const answeredColor = "#4CAF50";
  const unansweredColor = "#9E9E9E";
  const textColor = "#ffffff";

  let html = `
    <h2>Question Progress</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
  `;

  for (let i = 0; i < answers.length; i++) {
    const bg = answers[i] !== null ? answeredColor : unansweredColor;

    html += `
      <div
        onclick="goToQuestion(${i})"
        style="
          width:35px;
          height:35px;
          background:${bg};
          color:${textColor};
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
        ">
        ${i + 1}
      </div>
    `;
  }

  html += `</div>`;

  // dito naman yung button dun na pwede mo iback para makita mo kung mahalaga kapa ba
  if (answers.length > 0) {
    html += `<button onclick="backToProgress()" style="margin-top:12px;">⬅ Back to Progress</button>`;
  }

  content.innerHTML = html;
}

function goToQuestion(index) {
  cameFromProgress = true;
  currentIndex = index;
  renderQuestion();
}

function showLiveProgress() {
  if (!userAnswers || userAnswers.length === 0) {
    content.innerHTML = `
      <h2>Question Progress</h2>
      <p>No active quiz.</p>
    `;
    return;
  }

  const answeredColor = "#4CAF50"; // Green
  const unansweredColor = "#9E9E9E"; // Gray
  const textColor = "#ffffff";

  let html = `
    <h2>Question Progress</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
  `;

  for (let i = 0; i < userAnswers.length; i++) {
    const bg = userAnswers[i] !== null ? answeredColor : unansweredColor;

    html += `
      <div
        onclick="goToQuestion(${i})"
        style="
          width:35px;
          height:35px;
          background:${bg};
          color:${textColor};
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
        ">
        ${i + 1}
      </div>
    `;
  }

  html += `</div>`;
  content.innerHTML = html;
}

function showUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  content.innerHTML = users
    .map(
      (u, i) => `
    ${u.name} (${u.email})
    <button onclick="removeUser(${i})">Remove</button>
  `,
    )
    .join("<br>");
}

function removeUser(i) {
  let users = JSON.parse(localStorage.getItem("users"));
  users.splice(i, 1);
  localStorage.setItem("users", JSON.stringify(users));
  showUsers();
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
}

// Show all users' statistics from database
async function showAllUsersStats() {
  try {
    content.innerHTML = "<h2>📊 All Users Stats</h2><p>Loading...</p>";

    // Fetch all users from database
    const response = await fetch(`${API_URL}/all-users`);
    const allUsers = await response.json();

    if (!allUsers || allUsers.length === 0) {
      content.innerHTML =
        "<h2>📊 All Users Stats</h2><p>No users registered yet</p>";
      return;
    }

    // Fetch all scores
    const scoresResponse = await fetch(`${API_URL}/all-scores`);
    const allScores = await scoresResponse.json();

    // Calculate stats per user
    const userStats = {};

    allUsers.forEach((user) => {
      userStats[user.id] = {
        id: user.id,
        name: user.name,
        email: user.email,
        scores: [],
        totalQuizzes: 0,
      };
    });

    allScores.forEach((score) => {
      if (userStats[score.user_id]) {
        userStats[score.user_id].scores.push(score.score);
        userStats[score.user_id].totalQuizzes++;
      }
    });

    // Calculate averages and best scores
    const stats = Object.values(userStats).map((user) => ({
      ...user,
      bestScore: user.scores.length > 0 ? Math.max(...user.scores) : 0,
      averageScore:
        user.scores.length > 0
          ? (
              user.scores.reduce((a, b) => a + b, 0) / user.scores.length
            ).toFixed(1)
          : 0,
    }));

    // Sort by best score
    stats.sort((a, b) => b.bestScore - a.bestScore);

    // Display
    content.innerHTML = `
      <h2>📊 All Users Quiz Statistics</h2>
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="padding:10px; background:#f0f0f0; border-radius:8px; font-weight:bold;">
          Total Users: ${stats.length} | Total Quizzes: ${allScores.length}
        </div>
        ${stats
          .map(
            (user, i) => `
          <div style="
            padding:12px;
            border-radius:8px;
            border:2px solid ${i === 0 ? APP_CONFIG.COLORS.PRIMARY : "#ccc"};
            background:#f9f9f9;
          ">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>${i + 1}. ${user.name}</strong>
                <p style="margin:3px 0; color:#666; font-size:12px;">${user.email}</p>
              </div>
            </div>
            <div style="margin-top:8px; display:flex; gap:15px; font-size:14px;">
              <span>📝 Quizzes: <strong>${user.totalQuizzes}</strong></span>
              <span>🏆 Best: <strong>${user.bestScore}/10</strong></span>
              <span>📊 Avg: <strong>${user.averageScore}/10</strong></span>
            </div>
            <div style="
              margin-top:8px;
              height:16px;
              border-radius:6px;
              background:#ddd;
              overflow:hidden;
            ">
              <div style="
                width:${(user.bestScore / 10) * 100}%;
                height:100%;
                background:linear-gradient(to right, ${APP_CONFIG.COLORS.PRIMARY}, ${APP_CONFIG.COLORS.PRIMARY_LIGHT});
                border-radius:6px;
              "></div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error loading all users stats:", error);
    content.innerHTML =
      "<h2>📊 All Users Stats</h2><p>Error loading statistics</p>";
  }
}

// nilagyan ko lang ng mga delete button ambilis mapuno pag marami nagsagot
function deleteRecord(index, refreshFn) {
  let user = getUser();
  if (!user || !user.history) return;

  if (!confirm("Delete this record?")) return;

  user.history.splice(index, 1);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map((u) => (u.email === user.email ? user : u));

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Refresh the current dashboard view
  refreshFn();
}

function deleteAllRecords() {
  if (!confirm("Delete ALL quiz records?")) return;

  let user = getUser();
  user.history = [];

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map((u) => (u.email === user.email ? user : u));

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  showScores();
}

function showScores() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Current Scores</h2><p>No quiz taken yet.</p>";
    return;
  }

  content.innerHTML = `
    <h2>Current Scores</h2>
    ${user.history
      .map(
        (h, i) => `
      <div style="
        margin-bottom:10px;
        padding:6px;
        border-radius:6px;
        border:1px solid #ccc;
      ">
        Game ${i + 1}: <b>${h.score}/${APP_CONFIG.QUIZ.TOTAL_QUESTIONS}</b>
        <button onclick="deleteRecord(${i}, showScores)">🗑 Delete</button>
      </div>
    `,
      )
      .join("")}
  `;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function showTime() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Remaining Time</h2><p>No quiz taken yet.</p>";
    return;
  }

  content.innerHTML = `
    <h2>Remaining Time</h2>
    ${user.history
      .map(
        (h, i) => `
      <div style="
        margin-bottom:10px;
        padding:6px;
        border-radius:6px;
        border:1px solid #ccc;
      ">
        Game ${i + 1}: ⏱ ${formatTime(h.timeLeft)}
        <button onclick="deleteRecord(${i}, showTime)">🗑 Delete</button>
      </div>
    `,
      )
      .join("")}
  `;
}

function showAccuracy() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Accuracy</h2><p>No quiz taken yet.</p>";
    return;
  }

  const totalQuestions = user.history.length * 10;
  const correctAnswers = user.history.reduce((a, b) => a + b.score, 0);
  const acc = totalQuestions
    ? ((correctAnswers / totalQuestions) * 100).toFixed(2)
    : 0;

  content.innerHTML = `
    <h2>Accuracy</h2>
    <div style="
      margin-bottom:10px;
      padding:6px;
      border-radius:6px;
      border:1px solid #ccc;
    ">
      Accuracy: <b>${acc}%</b>
    </div>
    <button onclick="deleteAllRecords()">🗑 Delete All Records</button>
  `;
}

function showAnswers() {
  let user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = "<h2>Response Review</h2><p>No quiz taken yet.</p>";
    return;
  }

  content.innerHTML = `
    <h2>Response Review - Your Answers</h2>
    <button onclick="showOtherUsersAnswers()" style="margin-bottom:15px; padding:8px 15px; background:${APP_CONFIG.COLORS.SECONDARY}; color:white; border:none; border-radius:6px; cursor:pointer;">
      👥 View Other Users' Answers
    </button>

    ${user.history
      .map(
        (h, gameIndex) => `
      <div style="
        margin-bottom:25px; 
        padding:10px; 
        border:1px solid #ccc; 
        border-radius:8px;
      ">
        <h3>
          Quiz ${gameIndex + 1}
          <button onclick="deleteRecord(${gameIndex}, showAnswers)">🗑 Delete</button>
        </h3>

        ${h.quiz
          .map((q, i) => {
            const userAns = h.answers[i];
            const isCorrect = userAns === q.answer;
            const isUnanswered = userAns === null;

            let bg = APP_CONFIG.COLORS.SUCCESS;
            if (isUnanswered) bg = APP_CONFIG.COLORS.NEUTRAL_GRAY;
            else if (!isCorrect) bg = APP_CONFIG.COLORS.DANGER;

            return `
            <div style="
              margin:6px 0;
              padding:8px;
              border-radius:6px;
              background:${bg};
              color:white;
            ">
              <strong>Q${i + 1}:</strong> ${q.question}<br>
              Your Answer: <b>${userAns ?? "No Answer"}</b><br>
              Correct Answer: <b>${q.answer}</b>
              ${isCorrect ? " ✔" : !isUnanswered ? " ❌" : ""}
            </div>
          `;
          })
          .join("")}
      </div>
    `,
      )
      .join("")}
  `;
}

// Show other users' answers
async function showOtherUsersAnswers() {
  try {
    content.innerHTML =
      "<h2>👥 Other Users Responses</h2><p>Loading users...</p>";

    // Fetch all users
    const response = await fetch(`${API_URL}/all-users`);
    const allUsers = await response.json();

    if (!allUsers || allUsers.length === 0) {
      content.innerHTML =
        "<h2>👥 Other Users Responses</h2><p>No users found</p>";
      return;
    }

    // Display user list
    content.innerHTML = `
      <h2>👥 Other Users - Quiz Responses</h2>
      <p>Click on a user to view their quiz answers:</p>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${allUsers
          .map(
            (user) => `
          <button onclick="viewUserAnswers(${user.id}, '${user.name}')" style="
            padding:12px;
            text-align:left;
            border:2px solid #ccc;
            border-radius:8px;
            background:#f9f9f9;
            cursor:pointer;
            font-weight:bold;
          ">
            👤 ${user.name} (${user.email})
          </button>
        `,
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error:", error);
    content.innerHTML =
      "<h2>👥 Other Users Responses</h2><p>Error loading users</p>";
  }
}

// View specific user's answers
async function viewUserAnswers(userId, userName) {
  try {
    content.innerHTML = `<h2>📋 ${userName}'s Quiz Answers</h2><p>Loading...</p>`;

    const response = await fetch(`${API_URL}/user-history/${userId}`);
    const data = await response.json();

    if (!data.scores || data.scores.length === 0) {
      content.innerHTML = `<h2>📋 ${userName}'s Quiz Answers</h2><p>No quizzes taken yet</p>
        <button onclick="showOtherUsersAnswers()" style="margin-top:15px; padding:8px 15px; background:${APP_CONFIG.COLORS.SECONDARY}; color:white; border:none; border-radius:6px; cursor:pointer;">
          ⬅ Back to Users List
        </button>`;
      return;
    }

    // Display user's scores
    content.innerHTML = `
      <h2>📋 ${userName}'s Quiz History</h2>
      <button onclick="showOtherUsersAnswers()" style="margin-bottom:15px; padding:8px 15px; background:${APP_CONFIG.COLORS.SECONDARY}; color:white; border:none; border-radius:6px; cursor:pointer;">
        ⬅ Back to Users List
      </button>
      
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${data.scores
          .map(
            (score, i) => `
          <div style="
            padding:12px;
            border-radius:8px;
            border:2px solid ${APP_CONFIG.COLORS.PRIMARY};
            background:#f9f9f9;
          ">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>Quiz #${i + 1}</strong>
                <p style="margin:5px 0; color:#666;">Score: <strong>${score.score}/${score.total_questions}</strong> | Date: ${new Date(score.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div style="
              margin-top:8px;
              height:20px;
              border-radius:6px;
              background:#ddd;
              overflow:hidden;
            ">
              <div style="
                width:${(score.score / score.total_questions) * 100}%;
                height:100%;
                background:linear-gradient(to right, ${APP_CONFIG.COLORS.PRIMARY}, ${APP_CONFIG.COLORS.PRIMARY_LIGHT});
                border-radius:6px;
              "></div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error:", error);
    content.innerHTML = "<h2>Error</h2><p>Failed to load user answers</p>";
  }
}

function showProgress() {
  const user = getUser();
  if (!user || !user.history || user.history.length === 0) {
    content.innerHTML = `
      <h2>Question Progress</h2>
      <p>No quiz taken yet.</p>
    `;
    return;
  }

  // dito ma rerecord yung last quiz
  const lastGame = user.history.at(-1);
  const answers = lastGame.answers || [];

  // Fixed colors, theme-independent
  const answeredColor = "#4CAF50";
  const unansweredColor = "#9E9E9E";
  const textColor = "#ffffff";

  let html = `
    <h2>Question Progress</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
  `;

  for (let i = 0; i < answers.length; i++) {
    const bg = answers[i] !== null ? answeredColor : unansweredColor;

    html += `
      <div
        onclick="goToQuestion(${i})"
        style="
          width:35px;
          height:35px;
          background:${bg};
          color:${textColor};
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
        ">
        ${i + 1}
      </div>
    `;
  }

  html += `</div>`;

  // dito naman yung button dun na pwede mo iback para makita mo kung mahalaga kapa ba
  if (answers.length > 0) {
    html += `<button onclick="backToProgress()" style="margin-top:12px;">⬅ Back to Progress</button>`;
  }

  content.innerHTML = html;
}

function goToQuestion(index) {
  cameFromProgress = true;
  currentIndex = index;
  renderQuestion();
}

function showLiveProgress() {
  if (!userAnswers || userAnswers.length === 0) {
    content.innerHTML = `
      <h2>Question Progress</h2>
      <p>No active quiz.</p>
    `;
    return;
  }

  const answeredColor = "#4CAF50"; // Green
  const unansweredColor = "#9E9E9E"; // Gray
  const textColor = "#ffffff";

  let html = `
    <h2>Question Progress</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
  `;

  for (let i = 0; i < userAnswers.length; i++) {
    const bg = userAnswers[i] !== null ? answeredColor : unansweredColor;

    html += `
      <div
        onclick="goToQuestion(${i})"
        style="
          width:35px;
          height:35px;
          background:${bg};
          color:${textColor};
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
        ">
        ${i + 1}
      </div>
    `;
  }

  html += `</div>`;
  content.innerHTML = html;
}

function showUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  content.innerHTML = users
    .map(
      (u, i) => `
    ${u.name} (${u.email})
    <button onclick="removeUser(${i})">Remove</button>
  `,
    )
    .join("<br>");
}

function removeUser(i) {
  let users = JSON.parse(localStorage.getItem("users"));
  users.splice(i, 1);
  localStorage.setItem("users", JSON.stringify(users));
  showUsers();
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
}

// Show all users' statistics from database
async function showAllUsersStats() {
  try {
    content.innerHTML = "<h2>📊 All Users Stats</h2><p>Loading...</p>";

    // Fetch all users from database
    const response = await fetch(`${API_URL}/all-users`);
    const allUsers = await response.json();

    if (!allUsers || allUsers.length === 0) {
      content.innerHTML =
        "<h2>📊 All Users Stats</h2><p>No users registered yet</p>";
      return;
    }

    // Fetch all scores
    const scoresResponse = await fetch(`${API_URL}/all-scores`);
    const allScores = await scoresResponse.json();

    // Calculate stats per user
    const userStats = {};

    allUsers.forEach((user) => {
      userStats[user.id] = {
        id: user.id,
        name: user.name,
        email: user.email,
        scores: [],
        totalQuizzes: 0,
      };
    });

    allScores.forEach((score) => {
      if (userStats[score.user_id]) {
        userStats[score.user_id].scores.push(score.score);
        userStats[score.user_id].totalQuizzes++;
      }
    });

    // Calculate averages and best scores
    const stats = Object.values(userStats).map((user) => ({
      ...user,
      bestScore: user.scores.length > 0 ? Math.max(...user.scores) : 0,
      averageScore:
        user.scores.length > 0
          ? (
              user.scores.reduce((a, b) => a + b, 0) / user.scores.length
            ).toFixed(1)
          : 0,
    }));

    // Sort by best score
    stats.sort((a, b) => b.bestScore - a.bestScore);

    // Display
    content.innerHTML = `
      <h2>📊 All Users Quiz Statistics</h2>
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="padding:10px; background:#f0f0f0; border-radius:8px; font-weight:bold;">
          Total Users: ${stats.length} | Total Quizzes: ${allScores.length}
        </div>
        ${stats
          .map(
            (user, i) => `
          <div style="
            padding:12px;
            border-radius:8px;
            border:2px solid ${i === 0 ? APP_CONFIG.COLORS.PRIMARY : "#ccc"};
            background:#f9f9f9;
          ">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>${i + 1}. ${user.name}</strong>
                <p style="margin:3px 0; color:#666; font-size:12px;">${user.email}</p>
              </div>
            </div>
            <div style="margin-top:8px; display:flex; gap:15px; font-size:14px;">
              <span>📝 Quizzes: <strong>${user.totalQuizzes}</strong></span>
              <span>🏆 Best: <strong>${user.bestScore}/10</strong></span>
              <span>📊 Avg: <strong>${user.averageScore}/10</strong></span>
            </div>
            <div style="
              margin-top:8px;
              height:16px;
              border-radius:6px;
              background:#ddd;
              overflow:hidden;
            ">
              <div style="
                width:${(user.bestScore / 10) * 100}%;
                height:100%;
                background:linear-gradient(to right, ${APP_CONFIG.COLORS.PRIMARY}, ${APP_CONFIG.COLORS.PRIMARY_LIGHT});
                border-radius:6px;
              "></div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    console.error("Error loading all users stats:", error);
    content.innerHTML =
      "<h2>📊 All Users Stats</h2><p>Error loading statistics</p>";
  }
}

// nilagyan ko lang ng mga delete button ambilis mapuno pag marami nagsagot
function deleteRecord(index, refreshFn) {
  let user = getUser();
  if (!user || !user.history) return;

  if (!confirm("Delete this record?")) return;

  user.history.splice(index, 1);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map((u) => (u.email === user.email ? user : u));

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Refresh the current dashboard view
  refreshFn();
}

function deleteAllRecords() {
  if (!confirm("Delete ALL quiz records?")) return;

  let user = getUser();
  user.history = [];

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map((u) => (u.email === user.email ? user : u));

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));

  showScores();
}
