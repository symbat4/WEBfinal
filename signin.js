document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signinForm");
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");
  const message = document.getElementById("loginMessage");
  const error = (input, text) => { input.classList.add("is-invalid"); input.parentElement.querySelector(".invalid-feedback").textContent = text; };
  [email, password].forEach(el => el.addEventListener("input", () => el.classList.remove("is-invalid")));
  form.addEventListener("submit", event => {
    event.preventDefault(); message.textContent = "";
    [email, password].forEach(el => el.classList.remove("is-invalid"));
    const address = email.value.trim().toLowerCase();
    let valid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { error(email, "Enter a valid email address."); valid = false; }
    if (!password.value) { error(password, "Enter your password."); valid = false; }
    if (!valid) return;
    try {
      const users = JSON.parse(localStorage.getItem("medasymUsers") || "[]");
      const user = Array.isArray(users) && users.find(u => u.email === address && u.password === password.value);
      if (!user) { message.textContent = "Incorrect email or password. Please try again."; message.className = "text-danger mt-3 text-center"; return; }
      localStorage.setItem("medasymCurrentUser", address);
      window.location.href = "profile.html";
    } catch (_) { message.textContent = "Unable to access saved accounts in this browser."; message.className = "text-danger mt-3 text-center"; }
  });
});
