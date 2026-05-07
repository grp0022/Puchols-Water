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
    const langToggles = document.querySelectorAll('.lang-toggle');
    const translatableElements = document.querySelectorAll('[data-en]');

    langToggles.forEach(langToggle => {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'es' : 'en';

            // Update all toggle buttons
            langToggles.forEach(toggle => {
                const spans = toggle.querySelectorAll('span');
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
            });

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
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const phone = document.getElementById('formPhone').value;
            const message = document.getElementById('formMessage').value;

            const subject = currentLang === 'es' ? `Consulta Web - ${name}` : `Website Inquiry - ${name}`;

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // Show loading state
            btn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: '4e7b02a2-4168-496b-9a26-42407e067747',
                        subject: subject,
                        from_name: name,
                        email: email,
                        phone: phone,
                        message: message,
                        replyto: email
                    })
                });

                const result = await response.json();

                if (response.status === 200) {
                    // Success
                    btn.textContent = currentLang === 'es' ? '¡Mensaje Enviado!' : 'Message Sent!';
                    btn.style.background = '#25D366';
                    btn.style.borderColor = '#25D366';
                    contactForm.reset();
                } else {
                    // API Error
                    btn.textContent = currentLang === 'es' ? 'Error al enviar' : 'Error sending';
                    btn.style.background = '#ff3333';
                    btn.style.borderColor = '#ff3333';
                    console.error('Form submission error:', result);
                }
            } catch (error) {
                // Network Error
                console.error('Error submitting form:', error);
                btn.textContent = currentLang === 'es' ? 'Error de conexión' : 'Connection Error';
                btn.style.background = '#ff3333';
                btn.style.borderColor = '#ff3333';
            }

            // Restore button after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.disabled = false;
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
