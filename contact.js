
/* TASK 3: POPUP CONTACT FORM */

const openContactButton = document.getElementById('open-contact');
const closeContactButton = document.getElementById('close-contact');
const contactPopup = document.getElementById('contact-popup');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

// Open popup
openContactButton.addEventListener('click', function () {
    contactPopup.hidden = false;
    document.body.style.overflow = 'hidden';
    contactStatus.textContent = '';
    document.getElementById('contact-name').focus();
});

// Close popup
function closePopup() {
    contactPopup.hidden = true;
    document.body.style.overflow = '';
    openContactButton.focus();
}

// Close using X button
closeContactButton.addEventListener('click', closePopup);

// Close when clicking outside the form
contactPopup.addEventListener('click', function (event) {
    if (event.target === contactPopup) {
        closePopup();
    }
});

// Close using Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !contactPopup.hidden) {
        closePopup();
    }
});

// Handle form submission (demo only)
contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const fields = [
        { id: 'contact-name', message: 'Please enter your name (at least 2 characters).', valid: value => value.length >= 2 },
        { id: 'contact-email', message: 'Please enter a valid email address.', valid: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
        { id: 'contact-message', message: 'Please enter your message.', valid: value => value.length > 0 }
    ];
    let valid = true;
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const feedback = document.getElementById(field.id + '-error');
        const ok = field.valid(input.value.trim());
        input.setAttribute('aria-invalid', String(!ok));
        input.classList.toggle('is-invalid', !ok);
        feedback.textContent = ok ? '' : field.message;
        feedback.hidden = ok;
        if (!ok) valid = false;
    });
    if (!valid) {
        contactStatus.textContent = 'Please correct the highlighted fields.';
        contactStatus.style.color = 'crimson';
        return;
    }
    // TASK 6: spinner + disabled button while "server" responds
    contactStatus.textContent = '';
    runWithSpinner($(contactForm).find('button[type="submit"]'), function () {
        contactStatus.textContent = 'Form submitted successfully! (Demo only)';
        contactStatus.style.color = 'green';
        contactForm.reset();
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            input.classList.remove('is-invalid');
            input.removeAttribute('aria-invalid');
            document.getElementById(field.id + '-error').hidden = true;
        });
    });
});

// Clear individual errors as users correct their entries.
['contact-name', 'contact-email', 'contact-message'].forEach(id => {
    document.getElementById(id).addEventListener('input', event => {
        event.target.classList.remove('is-invalid');
        event.target.removeAttribute('aria-invalid');
        document.getElementById(id + '-error').hidden = true;
    });
});
