document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');

            // Close all other open items
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                
                if (otherQuestion !== question) {
                    otherQuestion.classList.remove('active');
                    otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                question.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Offset for fixed header
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. GSAP Cinematic Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- FLAGSHIP HERO ANIMATIONS ---

        // On Load: Centerpiece zoom out
        gsap.from('.hero-center-image', {
            scale: 1.15,
            duration: 2.5,
            ease: "power3.out"
        });

        // On Load: Staggered Typography Mask Reveal
        gsap.from('.mask-text', {
            y: "110%",
            duration: 1.5,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.2
        });

        // On Load: Glass Bar Fade In
        gsap.from('.hero-glass-bar', {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.6
        });

        // --- PINNED SCROLL ANIMATION ---
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#hero-pin-container",
                pin: true,
                start: "top top",
                end: "+=1500", // Controls the scroll distance of the pin
                scrub: 1,
            }
        });

        // Scale up the speaker massively and fade it out
        heroTl.to('.hero-center-image', {
            scale: 6,
            opacity: 0,
            ease: "power2.inOut"
        }, 0);

        // Parallax the text down and fade it out
        heroTl.to('.hero-typography-bg', {
            y: 150,
            opacity: 0,
            ease: "none"
        }, 0);

        // Fade out the glass bar and badge early
        heroTl.to('.hero-glass-bar, .product-badge', {
            opacity: 0,
            ease: "none",
            duration: 0.2 // Fades out in the first 20% of the scroll duration
        }, 0);

        // Cinematic Text Scroll Reveal
        gsap.fromTo('.line-left', 
            { x: '-30%', opacity: 0 },
            { 
                x: '0%', 
                opacity: 1, 
                scrollTrigger: { 
                    trigger: '.cinematic-text-section', 
                    start: 'top 80%', 
                    end: 'center center', 
                    scrub: 1 
                } 
            }
        );
        gsap.fromTo('.line-right', 
            { x: '30%', opacity: 0 },
            { 
                x: '0%', 
                opacity: 1, 
                scrollTrigger: { 
                    trigger: '.cinematic-text-section', 
                    start: 'top 80%', 
                    end: 'center center', 
                    scrub: 1 
                } 
            }
        );

        // 5. Additional Micro-Interactions

        // Alternating Feature Blocks Reveal
        gsap.utils.toArray('.showcase-row').forEach(row => {
            gsap.from(row, {
                scrollTrigger: {
                    trigger: row,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: "power3.out",
                clearProps: "all"
            });
        });

        // ==========================================
        // NEW SECTIONS ANIMATIONS & LOGIC
        // ==========================================

        // 1. Nature Section Animations
        const natureCards = gsap.utils.toArray('.nature-card-large, .nature-card-small');
        natureCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: "play none none reverse"
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: i * 0.15
            });
        });

        // 2. Story Section Reveal
        gsap.from('.story-image-col', {
            scrollTrigger: {
                trigger: '.story-section',
                start: 'top 80%',
                toggleActions: "play none none reverse"
            },
            x: -50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });

        gsap.from('.story-text-col', {
            scrollTrigger: {
                trigger: '.story-section',
                start: 'top 80%',
                toggleActions: "play none none reverse"
            },
            x: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.2
        });

        // 3. Experience Section Image Selector Logic
        const expButtons = document.querySelectorAll('.exp-btn');
        const mainImage = document.getElementById('exp-main-image');

        if (expButtons && mainImage) {
            expButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all
                    expButtons.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked
                    btn.classList.add('active');
                    
                    // Fade out, change source, fade in
                    mainImage.style.opacity = '0';
                    setTimeout(() => {
                        mainImage.src = btn.getAttribute('data-src');
                        mainImage.style.opacity = '1';
                    }, 400); // 0.4s matches the CSS transition
                });
            });
        }
    }
});
