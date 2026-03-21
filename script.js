/* ============================================
   RANJIT SHINE - 3D PORTFOLIO SCRIPTS
   Three.js + GSAP + Custom Interactions
   ============================================ */

// ====== CINEMATIC PHOTO BACKGROUND ======
class CinematicBackground {
    constructor() {
        this.slides = document.querySelectorAll('.photo-bg-slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.interval = null;
        this.transitionEffects = ['slide-in-zoom', 'slide-in-pan'];
        this.isTransitioning = false;

        if (this.slides.length === 0) return;
        this.init();
    }

    init() {
        // Preload all images for smooth transitions
        this.slides.forEach(slide => {
            const bg = slide.style.backgroundImage;
            const url = bg.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
            const img = new Image();
            img.src = url;
        });

        // Start auto-cycling
        this.startAutoPlay();

        // Parallax on mouse move — subtle background shift
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            this.slides.forEach(slide => {
                if (slide.classList.contains('active')) {
                    slide.style.backgroundPosition = `calc(50% + ${x * 8}px) calc(25% + ${y * 8}px)`;
                }
            });
        });

        // Change slide faster when scrolling through sections
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const delta = Math.abs(window.scrollY - lastScrollY);
            if (delta > 300) {
                this.nextSlide();
                lastScrollY = window.scrollY;
            }
        });
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const current = this.slides[this.currentSlide];
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        const next = this.slides[nextIndex];

        // Pick a random transition effect
        const effect = this.transitionEffects[Math.floor(Math.random() * this.transitionEffects.length)];

        // Fade out current
        current.classList.remove('active');
        current.classList.add('slide-out-fade');

        // Bring in next with effect
        next.classList.add(effect);
        next.classList.add('active');

        // Cleanup after transition
        setTimeout(() => {
            current.classList.remove('slide-out-fade');
            next.classList.remove(effect);
            this.currentSlide = nextIndex;
            this.isTransitioning = false;
        }, 2200);
    }

    startAutoPlay() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}


// ====== CUSTOM CURSOR ======
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        this.ring = document.querySelector('.cursor-ring');
        if (!this.dot || !this.ring) return;
        
        this.pos = { x: 0, y: 0 };
        this.ringPos = { x: 0, y: 0 };
        this.isHovering = false;

        document.addEventListener('mousemove', (e) => {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
        });

        // Add hover effect to interactive elements
        const hoverElements = document.querySelectorAll('a, button, .nav-toggle, .skill-card, .project-card, .contact-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.ring.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.ring.classList.remove('hover');
            });
        });

        this.animate();
    }

    animate() {
        this.ringPos.x += (this.pos.x - this.ringPos.x) * 0.15;
        this.ringPos.y += (this.pos.y - this.ringPos.y) * 0.15;

        this.dot.style.left = `${this.pos.x}px`;
        this.dot.style.top = `${this.pos.y}px`;
        this.ring.style.left = `${this.ringPos.x}px`;
        this.ring.style.top = `${this.ringPos.y}px`;

        requestAnimationFrame(() => this.animate());
    }
}


// ====== TYPED TEXT EFFECT ======
class TypedEffect {
    constructor(element, strings, typeSpeed = 80, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.strings = strings;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.currentString = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.strings[this.currentString];

        if (this.isDeleting) {
            this.currentChar--;
            this.element.textContent = current.substring(0, this.currentChar);
        } else {
            this.currentChar++;
            this.element.textContent = current.substring(0, this.currentChar);
        }

        let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentChar === current.length) {
            delay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentString = (this.currentString + 1) % this.strings.length;
            delay = 500;
        }

        setTimeout(() => this.type(), delay);
    }
}


// ====== COUNTER ANIMATION ======
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}


// ====== SCROLL ANIMATIONS WITH GSAP ======
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar scroll effect
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top -80px',
        onEnter: () => document.getElementById('navbar').classList.add('scrolled'),
        onLeaveBack: () => document.getElementById('navbar').classList.remove('scrolled'),
    });

    // Active nav link based on scroll position
    document.querySelectorAll('.section').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveNav(section.id),
            onEnterBack: () => setActiveNav(section.id),
        });
    });

    // Journey nodes animation
    document.querySelectorAll('.journey-node').forEach((node, i) => {
        ScrollTrigger.create({
            trigger: node,
            start: 'top 80%',
            onEnter: () => {
                node.classList.add('visible');
            },
        });
    });

    // Timeline line fill
    ScrollTrigger.create({
        trigger: '.journey-timeline',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
            const fill = document.getElementById('timeline-fill');
            if (fill) {
                fill.style.height = `${self.progress * 100}%`;
            }
        },
    });

    // Skill bars animation
    document.querySelectorAll('.skill-card').forEach(card => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                card.querySelectorAll('.skill-fill').forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = `${width}%`;
                });
            },
        });
    });

    // Reveal animations for sections
    gsap.utils.toArray('.section-header, .about-grid, .skills-grid, .projects-grid, .contact-grid').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 95%',
                toggleActions: 'play none none none',
                once: true,
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
        });
    });

    // Project cards stagger
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 95%',
            once: true,
        },
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
    });

    // Skill cards stagger
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 95%',
            once: true,
        },
        opacity: 0,
        y: 40,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
    });

    // Contact cards stagger
    gsap.from('.contact-card', {
        scrollTrigger: {
            trigger: '.contact-info-cards',
            start: 'top 95%',
            once: true,
        },
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power3.out',
    });
}


// ====== MOBILE VISIBILITY FALLBACK ======
// Ensure all content is visible on mobile even if ScrollTrigger doesn't fire
setTimeout(() => {
    document.querySelectorAll('.section-header, .about-grid, .skills-grid, .projects-grid, .contact-grid, .project-card, .skill-card, .contact-card, .journey-node').forEach(el => {
        if (getComputedStyle(el).opacity === '0' || parseFloat(getComputedStyle(el).opacity) < 0.1) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
}, 3000);


// ====== NAVIGATION ======
function setActiveNav(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}


// ====== 3D CARD TILT EFFECT ======
function initCardTilt() {
    // About card 3D tilt
    const aboutCard = document.getElementById('about-card');
    if (aboutCard) {
        aboutCard.addEventListener('mousemove', (e) => {
            const rect = aboutCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            aboutCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        aboutCard.addEventListener('mouseleave', () => {
            aboutCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // Skill cards tilt
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });
}


// ====== CONTACT FORM ======
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('.btn-submit span');
            const originalText = btn.textContent;
            btn.textContent = 'Message Sent!';
            form.querySelector('.btn-submit').style.background = 'linear-gradient(135deg, #00e676, #00c853)';

            setTimeout(() => {
                btn.textContent = originalText;
                form.querySelector('.btn-submit').style.background = '';
                form.reset();
            }, 3000);
        });
    }
}


// ====== LOADING SCREEN ======
function hideLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger hero animations & counters after loader
        animateCounters();
    }, 2200);
}


// ====== INITIALIZE EVERYTHING ======
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    hideLoader();

    // Init cinematic photo background
    const cinematicBg = new CinematicBackground();

    // Init custom cursor
    new CustomCursor();

    // Init typed effect
    const typedOutput = document.getElementById('typed-output');
    if (typedOutput) {
        new TypedEffect(typedOutput, [
            'SAP BTP & AI Solutions',
            'SAP CAP Applications',
            'SAP Build Process Automation',
            'SAPUI5 Interfaces',
            'Intelligent Enterprise Systems',
            'Cloud-Native Architecture',
        ]);
    }

    // Init navigation
    initNavigation();

    // Init scroll animations (after a small delay for DOM)
    setTimeout(() => {
        initScrollAnimations();
        // Refresh ScrollTrigger after images/fonts load for correct positions on mobile
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    }, 100);

    // Init 3D card tilt effects
    initCardTilt();

    // Init contact form
    initContactForm();
});
