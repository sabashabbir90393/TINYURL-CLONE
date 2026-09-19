const API_URL = "https://tinybackend-production-fe37.up.railway.app";

const currentPage = window.location.pathname.split("/").pop() || "index.html";

// ==================== SIGNUP ====================

const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("signup-message");

    message.textContent = "";
    message.className = "auth-message";

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        message.textContent = data.message || "Signup failed";
        message.classList.add("error");
        return;
      }

      localStorage.setItem("tinyurl_token", data.token);
      localStorage.setItem("tinyurl_username", data.username);

      message.textContent = "Account created successfully!";
      message.classList.add("success");

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 800);

    } catch (error) {
      console.error("Signup Error:", error);

      message.textContent =
        "Unable to connect to server. Please try again.";

      message.classList.add("error");
    }
  });
}


// ==================== LOGIN ====================

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("login-message");

    message.textContent = "";
    message.className = "auth-message";

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        message.textContent =
          data.message || "Invalid username or password";

        message.classList.add("error");
        return;
      }

      localStorage.setItem("tinyurl_token", data.token);
      localStorage.setItem("tinyurl_username", data.username);

      message.textContent = "Login successful!";
      message.classList.add("success");

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 500);

    } catch (error) {
      console.error("Login Error:", error);

      message.textContent =
        "Unable to connect to server. Please try again.";

      message.classList.add("error");
    }
  });
}


// ==================== TOKEN VERIFICATION ====================

const token = localStorage.getItem("tinyurl_token");

async function verifyUserToken() {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      localStorage.removeItem("tinyurl_token");
      localStorage.removeItem("tinyurl_username");

      return false;
    }

    return true;

  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}


// ==================== PAGE ACCESS ====================

async function checkPageAccess() {

  // Landing, Login and Signup are public
  if (
    currentPage === "landing.html" ||
    currentPage === "login.html" ||
    currentPage === "signup.html"
  ) {
    return;
  }

  // Clone requires login
  if (!token) {
    window.location.href = "/landing.html";
    return;
  }

  const validToken = await verifyUserToken();

  if (!validToken) {
    window.location.href = "/landing.html";
  }
}

checkPageAccess();


// ==================== LOGOUT ====================

function logoutUser() {
  localStorage.removeItem("tinyurl_token");
  localStorage.removeItem("tinyurl_username");

  window.location.href = "/landing.html";
}
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}