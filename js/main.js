/* ========================================
   PUCHOLS WATER TECHNOLOGIES
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- CURRENT YEAR ----------
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // ---------- NAVBAR SCROLL ----------
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    function handleScroll() {
        // Toggle scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---------- MOBILE MENU ----------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---------- HERO PARTICLES ----------
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 60; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 8 + 5) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            const size = (Math.random() * 6 + 2) + 'px';
            particle.style.width = size;
            particle.style.height = size;
            particlesContainer.appendChild(particle);
        }
    }

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll(
        '.section-header, .about-text, .stat-card, .service-card, .product-card, .contact-item, .contact-form, .products-cta'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- LANGUAGE SWITCHER ----------
    let currentLang = 'en';
    const langToggle = document.getElementById('langToggle');
    const translatableElements = document.querySelectorAll('[data-en]');

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';

        // Update toggle button
        const spans = langToggle.querySelectorAll('span');
        if (currentLang === 'es') {
            spans[0].classList.remove('lang-active');
            spans[0].classList.add('lang-inactive');
            spans[1].classList.remove('lang-inactive');
            spans[1].classList.add('lang-active');
        } else {
            spans[0].classList.remove('lang-inactive');
            spans[0].classList.add('lang-active');
            spans[1].classList.remove('lang-active');
            spans[1].classList.add('lang-inactive');
        }

        // Update all translatable elements
        translatableElements.forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                el.textContent = text;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = currentLang;

        // Update form placeholders
        updateFormLabels();
    });

    function updateFormLabels() {
        const labels = document.querySelectorAll('.form-group label');
        labels.forEach(label => {
            const text = label.getAttribute(`data-${currentLang}`);
            if (text) {
                label.textContent = text;
            }
        });
    }

    // ---------- CONTACT FORM ----------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const phone = document.getElementById('formPhone').value;
            const message = document.getElementById('formMessage').value;

            // Build mailto link
            const subject = encodeURIComponent(
                currentLang === 'es'
                    ? `Consulta Web - ${name}`
                    : `Website Inquiry - ${name}`
            );
            const body = encodeURIComponent(
                `${currentLang === 'es' ? 'Nombre' : 'Name'}: ${name}\n` +
                `Email: ${email}\n` +
                `${currentLang === 'es' ? 'Teléfono' : 'Phone'}: ${phone}\n\n` +
                `${currentLang === 'es' ? 'Mensaje' : 'Message'}:\n${message}`
            );

            window.location.href = `mailto:sales@pucholswater.com?subject=${subject}&body=${body}`;

            // Show success feedback
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = currentLang === 'es' ? 'Mensaje Enviado!' : 'Message Sent!';
            btn.style.background = '#25D366';
            btn.style.borderColor = '#25D366';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ---------- SMOOTH SCROLL FOR ANCHORS ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

});
