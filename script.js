document.addEventListener('DOMContentLoaded', function() {

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0; // Get header height, default to 0 if not found
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // -20px extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.querySelector('.hamburger');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // --- Hamburger Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open
        });
    }

    // --- Highlight Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('section');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('.header');

    // Root margin adjusted for fixed header height
    const observerOptions = {
        root: null, // viewport
        rootMargin: `-${header.offsetHeight + 10}px 0px -50% 0px`, // Adjust top margin by header height + some buffer
        threshold: 0.0 // As soon as any part of the section enters view, consider it
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navAnchors.forEach(link => link.classList.remove('active'));

                // Add active class to the link corresponding to the intersecting section
                const targetId = `#${entry.target.id}`;
                const activeLink = document.querySelector(`.nav-links a[href="${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Section Fade-In Animation on Scroll (General Section Animator) ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // --- Project Card Specific Animation (Staggered) ---
    const projectCards = document.querySelectorAll('.project-card.animate-scale-in');

    const projectObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the project card is visible
    };

    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the index of the card to apply a staggered delay
                const index = Array.from(projectCards).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`; // 0.1s delay per card
                entry.target.classList.add('is-visible'); // Add a class for animation, if needed
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, projectObserverOptions);

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });


    // --- Dynamic Copyright Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

});