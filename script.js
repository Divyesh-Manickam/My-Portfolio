/* =========================================
   Sidebar navigation - single page sections
========================================= */
const navLinks = document.querySelectorAll('.aside .nav a');
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

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
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
   Contact form (client-side only, mailto fallback)
========================================= */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', () => {
        formStatus.textContent = 'Opening your email client to send this message…';
    });
}