/* =========================================
   Sidebar navigation - single page sections
========================================= */
const navLinks = document.querySelectorAll('.aside .nav a');
const sectionLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('.main-content .section');
const aside = document.querySelector('.aside');
const navToggler = document.querySelector('.nav-toggler');

function showSection(targetId) {
    sections.forEach(section => {
        section.classList.toggle('active', '#' + section.id === targetId);
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === targetId);
    });
}

sectionLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    const matchesSection = [...sections].some(section => '#' + section.id === targetId);
    if (!matchesSection) return; // leave unrelated # links (if any) alone

    link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(targetId);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // close mobile sidebar after selecting a link
        if (window.innerWidth <= 991) {
            aside.classList.remove('open');
        }
    });
});

// Show the section matching the URL hash on load, default to home
window.addEventListener('DOMContentLoaded', () => {
    const initial = window.location.hash && document.querySelector(window.location.hash)
        ? window.location.hash
        : '#home';
    showSection(initial);
});

/* =========================================
   Mobile nav toggler
========================================= */
if (navToggler) {
    navToggler.addEventListener('click', () => {
        aside.classList.toggle('open');
    });
}

/* =========================================
   Typing effect
========================================= */
const typingEl = document.querySelector('.typing');
const roles = ['Web Developer', 'Full Stack Developer', 'Software Developer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingEl) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingEl.textContent = currentRole.substring(0, charIndex);

    let typeSpeed = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 1500; // pause at full word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 300;
    }

    setTimeout(typeEffect, typeSpeed);
}

typeEffect();

/* =========================================
   Dark mode toggle
========================================= */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    if (themeIcon) {
        themeIcon.classList.toggle('fa-moon', theme !== 'dark');
        themeIcon.classList.toggle('fa-sun', theme === 'dark');
    }
}

const savedTheme = localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* =========================================
   Contact form -> sends the message directly via EmailJS
   (client-side email delivery, no backend needed).

   SETUP (one-time, free, ~5 minutes):
   1. Create an account at https://www.emailjs.com
   2. Add an Email Service (e.g. connect your Gmail) -> copy its Service ID
   3. Create an Email Template with {{name}}, {{email}}, {{subject}},
      {{message}} variables -> copy its Template ID
   4. Account -> General -> copy your Public Key
   5. Paste all three values into EMAILJS_CONFIG below.

   Until those are filled in, the form automatically falls back to
   opening the visitor's own email app with the message pre-filled,
   so it never silently fails.
========================================= */
const EMAILJS_CONFIG = {
    publicKey: 'OR61nM_bQKq5q6Wjh',   // from EmailJS Account > General
    serviceId: 'service_vohwdkf',   // from EmailJS Email Services
    templateId: 'template_6fib58w'  // from EmailJS Email Templates
};
const OWNER_EMAIL = 'divyeshmanickam2006@gmail.com';

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function isEmailJsConfigured() {
    return window.emailjs
        && EMAILJS_CONFIG.publicKey.indexOf('YOUR_') !== 0
        && EMAILJS_CONFIG.serviceId.indexOf('YOUR_') !== 0
        && EMAILJS_CONFIG.templateId.indexOf('YOUR_') !== 0;
}

if (window.emailjs && EMAILJS_CONFIG.publicKey.indexOf('YOUR_') !== 0) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
}

function sendViaMailto(name, email, subject, message) {
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    formStatus.textContent = `Opening your email app… if nothing happens, email me directly at ${OWNER_EMAIL}.`;
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('[name="name"]').value.trim();
        const email = contactForm.querySelector('[name="email"]').value.trim();
        const subject = contactForm.querySelector('[name="subject"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();

        if (!name || !email || !subject || !message) {
            formStatus.textContent = 'Please fill in every field before sending.';
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');

        if (isEmailJsConfigured()) {
            if (submitBtn) submitBtn.disabled = true;
            formStatus.textContent = 'Sending…';

            emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
                name, email, subject, message, to_email: OWNER_EMAIL
            }).then(() => {
                formStatus.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
                contactForm.reset();
            }).catch((err) => {
                console.error('EmailJS error:', err);
                formStatus.textContent = 'Direct send failed — opening your email app instead.';
                sendViaMailto(name, email, subject, message);
            }).finally(() => {
                if (submitBtn) submitBtn.disabled = false;
            });
        } else {
            // EmailJS not set up yet: fall back to mailto so the form
            // still works end-to-end.
            sendViaMailto(name, email, subject, message);
        }
    });
}
