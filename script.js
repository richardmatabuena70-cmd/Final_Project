// Login at Register logic
// Purpose: Handle form switching at user authentication

// Wait para sa DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get form elements
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const formTitle = document.getElementById("formTitle");

  // Get login inputs
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  // Get register inputs
  const regName = document.getElementById("regName");
  const regEmail = document.getElementById("regEmail");
  const regPassword = document.getElementById("regPassword");
  const regConfirm = document.getElementById("regConfirm");

  // Show register form
  window.showRegister = function () {
    loginForm.classList.add("hidden"); // Hide login
    registerForm.classList.remove("hidden"); // Show register
    formTitle.textContent = "Register";
  };

  // Show login form
  window.showLogin = function () {
    registerForm.classList.add("hidden"); // Hide register
    loginForm.classList.remove("hidden"); // Show login
    formTitle.textContent = "Login";
  };

  // Register form submit
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Don't reload page

    // Check kung match ang passwords
    if (regPassword.value !== regConfirm.value) {
      alert("Passwords do not match");
      return;
    }

    // Call register API
    const result = await registerUser(regName.value, regEmail.value, regPassword.value);

    if (result.status === "success") {
      alert("Account created! Please login.");
      showLogin(); // Switch to login
      registerForm.reset(); // Clear inputs
    } else {
      alert(result.message);
    }
  });

  // Login form submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Don't reload page

    // Call login API
    const result = await loginUser(loginEmail.value, loginPassword.value);

    if (result.status === "success") {
      window.location.href = "dashboard.html"; // Go to dashboard
    } else {
      alert(result.message);
    }
  });
});
