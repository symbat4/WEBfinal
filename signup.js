
const form = document.getElementById("signupForm");
const msg = document.getElementById("formMessage");
const pw = document.getElementById("password");
const cpw = document.getElementById("confirmPassword");
const toggle = document.getElementById("togglePassword");

const fields = {
    fullname: document.getElementById("fullname"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    password: pw,
    confirmPassword: cpw,
    terms: document.getElementById("terms")
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

function showError(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    const container = input.closest(".input-group") || input.parentElement;
    const feedback = container.querySelector(".invalid-feedback");

    if (feedback) {
        feedback.textContent = message;
        feedback.style.display = "block";
    }
}

function clearError(input) {
    input.classList.remove("is-invalid");

    const container = input.closest(".input-group") || input.parentElement;
    const feedback = container.querySelector(".invalid-feedback");

    if (feedback) {
        feedback.style.display = "";
    }
}

function validateForm() {
    let valid = true;

    Object.values(fields).forEach(clearError);

    if (fields.fullname.value.trim().length < 2) {
        showError(fields.fullname, "Enter your full name.");
        valid = false;
    }

    if (!emailRegex.test(fields.email.value.trim())) {
        showError(fields.email, "Enter a valid email address.");
        valid = false;
    }

    const phone = fields.phone.value.trim();
    const digits = phone.replace(/\D/g, "");
    if (!/^\+?[0-9 ()-]+$/.test(phone) || digits.length < 10 || digits.length > 15) {
        showError(fields.phone, "Enter a valid phone number (10–15 digits).");
        valid = false;
    }

    if (!passwordRegex.test(pw.value)) {
        showError(pw, "Use 8+ characters, uppercase, lowercase, number and symbol.");
        valid = false;
    }

    if (cpw.value !== pw.value || !cpw.value) {
        showError(cpw, "Passwords do not match.");
        valid = false;
    }

    if (!fields.terms.checked) {
        showError(fields.terms, "Please accept the Terms and Conditions.");
        valid = false;
    }

    return valid;
}

toggle.addEventListener("click", () => {
    const visible = pw.type === "password";
    pw.type = visible ? "text" : "password";
    toggle.textContent = visible ? "Hide" : "Show";
});

Object.values(fields).forEach(input => {
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
});

form.addEventListener("submit", event => {
    event.preventDefault();

    msg.textContent = "";
    msg.className = "form-message text-center mt-3 mb-0";

    if (!validateForm()) {
        msg.textContent = "Please correct the highlighted fields.";
        msg.classList.add("text-danger");
        return;
    }

    const email = fields.email.value.trim().toLowerCase();
    let users;

    try {
        users = JSON.parse(localStorage.getItem("medasymUsers") || "[]");

        if (!Array.isArray(users)) {
            throw new Error("Invalid stored data");
        }
    } catch {
        msg.textContent = "Unable to read saved accounts.";
        msg.classList.add("text-danger");
        return;
    }

    if (users.some(user => user.email === email)) {
        showError(fields.email, "This email is already registered.");
        msg.textContent = "Please use another email or sign in.";
        msg.classList.add("text-danger");
        return;
    }

    const user = {
        name: fields.fullname.value.trim(),
        email: email,
        password: pw.value,
        phone: fields.phone.value.trim(),
        orderType: form.querySelector('input[name="orderType"]:checked')?.value || "",
        newsletter: document.getElementById("newsletter").checked
    };

    users.push(user);

    try {
        localStorage.setItem("medasymUsers", JSON.stringify(users));
    } catch {
        msg.textContent = "Could not save your account.";
        msg.classList.add("text-danger");
        return;
    }

    form.reset();
    pw.type = "password";
    toggle.textContent = "Show";

    msg.textContent = "Account created! You can now sign in.";
    msg.classList.add("text-success");
});
