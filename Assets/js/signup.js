// ===== OAE Signup Form Script =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const msg = document.getElementById("signup-msg");

  function showMsg(text, success = false) {
    msg.textContent = text;
    msg.style.color = success ? "#007b3e" : "#b00020";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "";

    const data = new FormData(form);
    const name = (data.get("name") || "").trim();
    const email = (data.get("email") || "").trim();
    const password = data.get("password") || "";
    const confirm = data.get("confirm") || "";

    // --- Validation Checks ---
    if (!name || !email || !password || !confirm) {
      showMsg("⚠️ Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      showMsg("⚠️ Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      showMsg("⚠️ Passwords do not match.");
      return;
    }
    // --- Real Mock Registration ---
    
    // Strict Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMsg("⚠️ Please enter a valid email address format.");
        return;
    }

    // Strict Name Validation (Reject 'Tee')
    if (name.toLowerCase().includes("tee")) {
        showMsg("⚠️ Please enter your real name. 'Tee' is not allowed.");
        return;
    }

    // Prevent using placeholder email
    if (email.toLowerCase() === "oae@example.com") {
        showMsg("⚠️ Please enter your real email, not the placeholder example.");
        return;
    }

    // 1. Get existing users
    let users = [];
    const existingUsers = localStorage.getItem('oae_registered_users');
    if (existingUsers) {
        users = JSON.parse(existingUsers);
    }
    
    // 2. Check if email already exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        showMsg("⚠️ An account with this email already exists. Please log in.");
        return;
    }
    
    // 3. Register user
    users.push({ name: name, email: email, password: password });
    localStorage.setItem('oae_registered_users', JSON.stringify(users));

    // 4. Log them in instantly
    showMsg("✅ Account created successfully. Redirecting to your Dashboard...", true);
    localStorage.setItem('oae_user', JSON.stringify({ name: name, email: email }));

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  });
});
