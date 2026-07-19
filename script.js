document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // GLOBAL REVEALS (Fade-ups)
    // ==========================================
    const revealElements = gsap.utils.toArray('.section-editorial, .section-dark, .feature-card, .material-card, .testimonial-card, .faq-item');
    
    revealElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.2
        });
    });

    // ==========================================
    // HERO ANIMATIONS
    // ==========================================
    const heroTl = gsap.timeline();
    heroTl.from(".booxia-title, .booxia-subtitle, .booxia-actions", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
        delay: 0.2
    });

    // ==========================================
    // NAVBAR SCROLL LISTENER & SCROLL SPY
    // ==========================================
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // IntersectionObserver for robust Scroll Spy
    const observerOptions = {
        root: null,
        rootMargin: "-45% 0px -45% 0px", // Triggers when a section is occupying the middle of the viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + sectionId) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ==========================================
    // LIFESTYLE HORIZONTAL SCROLL GALLERY
    // ==========================================
    const galleryContainer = document.getElementById("gallery-pin-container");
    if (galleryContainer) {
        const wrapper = document.querySelector(".gallery-wrapper");
        
        let mm = gsap.matchMedia();
        mm.add("(min-width: 1025px)", () => {
            const scrollAmount = wrapper.scrollWidth - window.innerWidth;
            gsap.to(wrapper, {
                x: -scrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: galleryContainer,
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + scrollAmount
                }
            });
        });
    }

    // ==========================================
    // MOBILE MENU LOGIC
    // ==========================================
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenuOverlay = document.getElementById("mobileMenu");
    const mobileMenuClose = document.getElementById("mobileMenuClose");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (mobileMenuToggle && mobileMenuOverlay && mobileMenuClose) {
        mobileMenuToggle.addEventListener("click", () => {
            mobileMenuOverlay.classList.add("active");
            document.body.style.overflow = "hidden"; // lock scroll
        });

        mobileMenuClose.addEventListener("click", () => {
            mobileMenuOverlay.classList.remove("active");
            document.body.style.overflow = ""; // unlock scroll
        });

        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenuOverlay.classList.remove("active");
                document.body.style.overflow = ""; // unlock scroll
            });
        });
    }

    // ==========================================
    // MOUSE-FOLLOW MICRO-INTERACTIONS
    // ==========================================
    const parallaxElements = document.querySelectorAll('.parallax-mouse, .parallax-mouse-slow');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // Range -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // Range -1 to 1

        parallaxElements.forEach(el => {
            const isSlow = el.classList.contains('parallax-mouse-slow');
            const intensity = isSlow ? 15 : 30; // pixels to move
            const rotationIntensity = isSlow ? 2 : 5; // degrees to rotate

            gsap.to(el, {
                x: x * intensity,
                y: y * intensity,
                rotationX: -y * rotationIntensity,
                rotationY: x * rotationIntensity,
                duration: 0.8,
                ease: "power3.out"
            });
        });
    });

    // Continuous floating animation
    parallaxElements.forEach(el => {
        gsap.to(el, {
            y: "-=8",
            duration: 4.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
    });

    // ==========================================
    // PRODUCT SHOWCASE SELECTORS
    // ==========================================
    const mainImg = document.getElementById('showcase-main-img');
    const selectorBtns = document.querySelectorAll('.selector-btn');

    selectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            // Handle active class
            selectorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Crossfade
            const newSrc = btn.getAttribute('data-src');
            const isPlaceholder = btn.getAttribute('data-placeholder');

            gsap.to(mainImg, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => {
                    if (isPlaceholder) {
                        mainImg.style.display = "none"; // Or handle placeholder UI
                        mainImg.parentElement.classList.add('placeholder-active');
                    } else {
                        mainImg.style.display = "block";
                        mainImg.src = newSrc;
                        mainImg.parentElement.classList.remove('placeholder-active');
                    }
                    
                    gsap.to(mainImg, { opacity: 1, duration: 0.4, ease: "power2.inOut" });
                }
            });
        });
    });

    // ==========================================
    // FAQ ACCORDION LOGIC
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answerWrapper = item.querySelector('.faq-answer-wrapper');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other accordions
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer-wrapper').style.maxHeight = null;
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                answerWrapper.style.maxHeight = answerWrapper.scrollHeight + "px";
            }
        });
    });
});
