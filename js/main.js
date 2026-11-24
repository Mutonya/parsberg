/* =========================================================
   PARSBERG — Main Script (Modernized)
   ========================================================= */
(function () {
    'use strict';

    /* ---------- Scroll progress + header state + back to top ---------- */
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgress');

    function onScroll() {
        const y = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;

        if (progressBar) progressBar.style.width = progress + '%';
        header.classList.toggle('scrolled', y > 40);
        if (backToTop) backToTop.classList.toggle('visible', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile nav ---------- */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

    function closeNav() {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach((link) => link.addEventListener('click', closeNav));

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            closeNav();
        }
    });

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );
        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('visible'));
    }

    /* ---------- Counter animation ---------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        statNumbers.forEach((el) => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            }
            requestAnimationFrame(tick);
        });
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !countersStarted) {
                        countersStarted = true;
                        animateCounters();
                        counterObserver.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) counterObserver.observe(statsSection);
    } else {
        animateCounters();
    }

    /* ---------- Active nav link on scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinkMap = {};

    document.querySelectorAll('.nav-link').forEach((link) => {
        const id = link.getAttribute('href').replace('#', '');
        if (id) navLinkMap[id] = link;
    });

    if ('IntersectionObserver' in window && sections.length) {
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
                        if (navLinkMap[id]) navLinkMap[id].classList.add('active');
                    }
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );
        sections.forEach((s) => navObserver.observe(s));
    }

    /* ---------- MRO filter ---------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const mroCards = document.querySelectorAll('.mro-card');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            mroCards.forEach((card) => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hide', !match);

                if (match) {
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = 'fadeInCard 0.4s ease';
                }
            });
        });
    });

    // Inject keyframe for card fade
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `@keyframes fadeInCard {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }`;
    document.head.appendChild(styleSheet);

    /* ---------- Contact form ---------- */
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                setStatus('Please complete the required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                setStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Placeholder — connect to your backend / Formspree / Netlify Forms.
            // See README.md for instructions.

            setStatus('Sending your inquiry...', '');
            setTimeout(() => {
                setStatus('Thank you — your inquiry has been received. We will respond within one business day.', 'success');
                form.reset();
            }, 700);
        });
    }

    function setStatus(text, type) {
        if (!formStatus) return;
        formStatus.textContent = text;
        formStatus.className = 'form-status' + (type ? ' ' + type : '');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* ---------- Back to top ---------- */
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Dynamic year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Escape key closes mobile nav ---------- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });
})();

/* ---------- SVG draw-on-scroll (blueprint paths) ---------- */
(function initSvgDraw() {
    const drawTargets = document.querySelectorAll(
        '.architecture-visual svg path, .architecture-visual svg line, .architecture-visual svg rect, .architecture-visual svg circle'
    );

    if (!drawTargets.length || !('IntersectionObserver' in window)) return;

    // Prepare initial state
    drawTargets.forEach((el) => {
        if (el.tagName === 'path' || el.tagName === 'line') {
            try {
                const len = el.getTotalLength ? el.getTotalLength() : 200;
                el.style.strokeDasharray = String(len);
                el.style.strokeDashoffset = String(len);
                el.style.transition = 'stroke-dashoffset 1.6s ease';
            } catch (_) {}
        } else {
            el.style.opacity = '0';
            el.style.transition = 'opacity 1.2s ease';
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                drawTargets.forEach((el, i) => {
                    const delay = i * 30 + 'ms';
                    setTimeout(() => {
                        if (el.style.strokeDashoffset) {
                            el.style.strokeDashoffset = '0';
                        } else {
                            el.style.opacity = '1';
                        }
                    }, parseInt(delay, 10));
                });
                observer.disconnect();
            });
        },
        { threshold: 0.2 }
    );

    const archSection = document.querySelector('.architecture-visual');
    if (archSection) observer.observe(archSection);
})();