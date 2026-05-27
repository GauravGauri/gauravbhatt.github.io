document.addEventListener('DOMContentLoaded', () => {

    // ── SCROLL PROGRESS INDICATOR ──
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
            const percentage = (window.pageYOffset / totalScroll) * 100;
            scrollProgress.style.width = percentage + '%';
        }
    });

    // ── CUSTOM CURSOR & BG BLOB PARALLAX ──
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    let isDesktop = window.innerWidth > 900;

    if (isDesktop && dot && ring) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';

            // Set mouse-x/y coordinates on root for CSS parallax transitions
            document.documentElement.style.setProperty('--mouse-x', (mouseX / window.innerWidth - 0.5).toFixed(3));
            document.documentElement.style.setProperty('--mouse-y', (mouseY / window.innerHeight - 0.5).toFixed(3));
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        };
        animateRing();

        // Add hover effects for interactive elements
        const hoverables = document.querySelectorAll('a, button, .skill-pill, .project-card, .edu-card, .contact-item, .scroll-dot, .nav-toggle');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ── MOBILE NAVIGATION MENU ──
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const menuLinks = document.querySelectorAll('.nav-links a');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            // Toggle hamburger animation
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when a link is clicked
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ── NAVBAR SCROLL COMPACTING ──
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ── FLOATING SCROLL DOTS ──
    const sections = ['hero', 'skills', 'experience', 'projects', 'education', 'contact'];
    const dots = document.querySelectorAll('#scroll-dots .scroll-dot');

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            const targetSection = document.getElementById(sections[idx]);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for highlighting scroll dots & active header links
    const navLinksArray = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = sections.indexOf(entry.target.id);
                if (idx !== -1) {
                    // Highlight Scroll Dot
                    dots.forEach(d => d.classList.remove('active'));
                    dots[idx].classList.add('active');

                    // Highlight Navbar Link
                    navLinksArray.forEach(link => link.classList.remove('active'));
                    const targetLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (targetLink) targetLink.classList.add('active');
                }
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    // ── SCROLL-REVEAL ENTRANCE ANIMATIONS ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Trigger animation only once
            }
        });
    }, { threshold: 0.1 });

    // Target elements for scroll reveal
    const animatedElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .edu-card');
    
    animatedElements.forEach((el, idx) => {
        // Staggered delay depending on index for visual rhythm
        const typeDelay = el.classList.contains('skill-category') ? 100 : 
                          el.classList.contains('project-card') ? 150 : 120;
        
        el.style.transitionDelay = `${(idx % 3) * typeDelay}ms`;
        revealObserver.observe(el);
    });

    // ── 3D TILT EFFECT ON PROJECT CARDS ──
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            if (window.innerWidth <= 900) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const angleX = (yc - y) / 16;
            const angleY = (x - xc) / 16;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
