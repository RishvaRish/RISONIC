document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // GLOBAL REVEALS (Fade-ups)
    // ==========================================
    const revealElements = gsap.utils.toArray('.section-editorial, .section-dark, .feature-card, .material-card, .testimonial-card, .ownership-item');
    
    revealElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15
        });
    });

    // ==========================================
    // HERO ANIMATIONS
    // ==========================================
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title, .hero-subtitle, .hero-actions", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15
    }).from(".hero-visual", {
        x: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.4");

    // ==========================================
    // LIFESTYLE HORIZONTAL SCROLL GALLERY
    // ==========================================
    const galleryContainer = document.getElementById("gallery-pin-container");
    if (galleryContainer && window.innerWidth > 1024) {
        const wrapper = document.querySelector(".gallery-wrapper");
        
        // Calculate the amount to scroll to the left
        // The wrapper width is 300vw, so we move it by -200vw to see the 3rd item
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
            y: "-=15",
            duration: 3,
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
});
