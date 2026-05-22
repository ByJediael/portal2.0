/* ==========================================================================
   INTERACTIVE LOGIC - COLÉGIO CCI PREMIUM
   Lenis Smooth Scroll + GSAP ScrollTrigger + Interactive Micro-animations
   ========================================================================== */

import './style.css';
import Lenis from 'lenis';

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. LENIS SMOOTH SCROLL INITIALIZATION ---
  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like smooth cubic easeout
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    smoothTouch: false,
    infinite: false,
  });

  // RAF loop for Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize Lenis scroll event with GSAP ScrollTrigger
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  // --- 2. HEADER SCROLL STATE CONTROLLER ---
  const header = document.querySelector("#main-header");

  const updateHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", updateHeaderState);
  updateHeaderState(); // Check immediately on mount


  // --- 3. DYNAMIC MOBILE NAVIGATION ---
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  mobileMenuToggle.addEventListener("click", () => {
    mobileNavOverlay.classList.add("active");
  });

  const closeMobileMenu = () => {
    mobileNavOverlay.classList.remove("active");
  };

  mobileMenuClose.addEventListener("click", closeMobileMenu);
  mobileNavOverlay.addEventListener("click", (e) => {
    if (e.target === mobileNavOverlay) {
      closeMobileMenu();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });


  // --- 4. CINEMATIC HERO PARALLAX & ZOOM (GSAP) ---
  gsap.registerPlugin(ScrollTrigger);

  // Background zoom on scroll
  if (document.querySelector(".hero-parallax-bg") && document.querySelector(".hero-section")) {
    gsap.to(".hero-parallax-bg", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      scale: 1.18,
      yPercent: 12,
      ease: "none"
    });
  }

  // Text fading out on scroll
  if (document.querySelector(".hero-content") && document.querySelector(".hero-section")) {
    gsap.to(".hero-content", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom 30%",
        scrub: true
      },
      opacity: 0,
      yPercent: -15,
      ease: "none"
    });
  }


  // --- 5. INITIAL LOAD ENTRANCE STAGGER (Apple style) ---
  gsap.from(".animate-text-stagger", {
    opacity: 0,
    y: 35,
    duration: 1.25,
    ease: "power4.out",
    delay: 0.15
  });

  gsap.from(".animate-fade-up", {
    opacity: 0,
    y: 25,
    duration: 1.0,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.4
  });


  // --- 6. FLOATING MOUSE-REACTIVE PERSPECTIVE CARDS ---
  const interactiveCards = document.querySelectorAll(".interactive-card");
  
  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Convert coordinates into subtle degrees (max rotation 6deg)
      const rotateX = -y * 0.05;
      const rotateY = x * 0.05;
      
      gsap.to(card, {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
        boxShadow: `0 30px 60px rgba(0, 0, 0, 0.4), 0 0 25px rgba(229, 179, 56, 0.06)`,
        duration: 0.35,
        ease: "power2.out"
      });
    });
    
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`,
        duration: 0.6,
        ease: "power3.out"
      });
    });
  });


  // --- 7. SCROLL-TRIGGERED SECTION REVEALS ---
  const revealElements = document.querySelectorAll(".scroll-reveal");
  
  revealElements.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      onEnter: () => {
        el.classList.add("active");
      },
      once: true
    });
  });

  // --- 7.5. GSAP STAGGERED ENTRY ANIMATIONS (Premium Scroll Reveal) ---
  
  // A. Segment Cards (Fade up with cascade effect)
  if (document.querySelector(".segments-grid")) {
    gsap.from(".segment-card", {
      scrollTrigger: {
        trigger: ".segments-grid",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 50,
      duration: 1.0,
      stagger: 0.18,
      ease: "power3.out"
    });
  }

  // B. Differentials List Items (Slide in from left sequentially)
  if (document.querySelector(".differentials-list")) {
    gsap.from(".differentials-list li", {
      scrollTrigger: {
        trigger: ".differentials-list",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      x: -30,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }

  // C. Infrastructure Gallery Cards (Scale-up fade)
  if (document.querySelector(".structure-gallery")) {
    gsap.from(".structure-gallery .structure-card", {
      scrollTrigger: {
        trigger: ".structure-gallery",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.2,
      ease: "power3.out"
    });
  }

  // D. Blog Grid Cards (Fade up cascade matching segments)
  if (document.querySelector(".blog-grid")) {
    gsap.from(".blog-grid .blog-card", {
      scrollTrigger: {
        trigger: ".blog-grid",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 50,
      duration: 1.0,
      stagger: 0.18,
      ease: "power3.out"
    });
  }

  // E. Events List Items (Fade in from right sequentially)
  if (document.querySelector(".events-list")) {
    gsap.from(".events-list .event-item", {
      scrollTrigger: {
        trigger: ".events-list",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      x: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });
  }


  // --- 8. STATS NUMERICAL COUNTER TIMELINE ---
  const statNumbers = document.querySelectorAll(".stat-number");
  
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"), 10);
    
    ScrollTrigger.create({
      trigger: stat,
      start: "top 88%",
      onEnter: () => {
        let count = 0;
        const duration = 1500; // Total counting time (ms)
        const frameRate = 1000 / 60; // 60 FPS
        const totalFrames = Math.round(duration / frameRate);
        const increment = target / totalFrames;
        
        let frame = 0;
        const updateCount = () => {
          frame++;
          count += increment;
          if (frame < totalFrames) {
            stat.innerText = Math.ceil(count);
            setTimeout(updateCount, frameRate);
          } else {
            stat.innerText = target;
          }
        };
        updateCount();
      },
      once: true
    });
  });


  // --- 9. INTER-SECTION ROUTING SMOOTH SCROLL ---
  const navLinks = document.querySelectorAll(".nav-link, .mobile-link, .hero-actions a, .brand-logo, .footer-links a");
  
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      
      if (targetId.startsWith("#")) {
        if (targetId.length > 1) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Adjust active state header link
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            if (link.classList.contains("nav-link")) {
              link.classList.add("active");
            }
            
            lenis.scrollTo(targetElement, {
              offset: -80,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        } else if (targetId === "#") {
          e.preventDefault();
          // Scroll smoothly to top of the page
          lenis.scrollTo(0, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    });
  });


  // --- 10. SUBMISSION FORM MICRO-INTERACTION ---
  const visitaForm = document.querySelector("#visita-form");
  
  if (visitaForm) {
    visitaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const btnSubmit = visitaForm.querySelector(".btn-submit");
      const originalText = btnSubmit.innerHTML;
      
      // Loading State
      btnSubmit.innerHTML = `<span>Processando solicitação...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      btnSubmit.style.pointerEvents = "none";
      btnSubmit.style.opacity = "0.8";
      
      setTimeout(() => {
        // Success State
        btnSubmit.innerHTML = `<span>Visita Agendada!</span> <i class="fa-solid fa-circle-check"></i>`;
        btnSubmit.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"; // Green
        btnSubmit.style.color = "#ffffff";
        btnSubmit.style.opacity = "1";
        
        visitaForm.reset();
        
        // Reset back to original style
        setTimeout(() => {
          btnSubmit.innerHTML = originalText;
          btnSubmit.style.background = "";
          btnSubmit.style.color = "";
          btnSubmit.style.pointerEvents = "auto";
        }, 3500);
      }, 1800);
    });
  }


  // --- 10.5. 3D METODOLOGY TEMPLE INTERACTIVITY & SCROLL TRIGGER ---
  
  // A. Entrance Animation Scroll Trigger
  if (document.querySelector(".temple-interactive-section")) {
    // Ensure columns are visible immediately (safety state before animation)
    gsap.set(".temple-column", { opacity: 0.6, scaleY: 1 });

    const templeEntranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".temple-interactive-section",
        start: "top 75%",
        toggleActions: "play none none none",
        onLeaveBack: () => {
          // When scrolling back up past section, keep columns visible
          gsap.set(".temple-column", { opacity: 0.6, scaleY: 1 });
        }
      }
    });

    // Base spreads
    templeEntranceTl.fromTo(".temple-base",
      { scaleX: 0.1, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.85, ease: "power3.out" }
    );

    // Columns grow from bottom (explicitly to final visible state)
    templeEntranceTl.fromTo(".temple-column",
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1,
        opacity: 0.6,
        duration: 1.1,
        stagger: 0.18,
        ease: "back.out(1.3)",
        transformOrigin: "bottom center",
        clearProps: "scaleY" // clear scaleY after done so CSS hover/active takes over
      },
      "-=0.45"
    );

    // Architrave drops
    templeEntranceTl.fromTo(".temple-architrave",
      { y: -35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
      "-=0.55"
    );

    // Roof lands
    templeEntranceTl.fromTo(".temple-roof",
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "bounce.out" },
      "-=0.35"
    );
  }


  // B. Columns and Tabs Synchronizer
  const templeTabs = document.querySelectorAll(".temple-tab");
  const templeColumns = document.querySelectorAll(".temple-column");
  const templeContentCards = document.querySelectorAll(".temple-content-card");

  const switchTemplePillar = (pillarId) => {
    // 1. Update Tabs Active State
    templeTabs.forEach(tab => {
      if (tab.getAttribute("data-pillar") === pillarId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // 2. Update Columns Active State & Micro-scaling
    templeColumns.forEach(col => {
      const isCurrent = col.getAttribute("data-pillar") === pillarId;
      gsap.killTweensOf(col); // stop any conflicting tweens
      if (isCurrent) {
        col.classList.add("active");
        gsap.to(col, {
          scale: 1.08,
          opacity: 1,
          duration: 0.45,
          ease: "power2.out"
        });
      } else {
        col.classList.remove("active");
        gsap.to(col, {
          scale: 1.0,
          opacity: 0.6,
          duration: 0.45,
          ease: "power2.out"
        });
      }
    });

    // 3. Crossfade Content Cards smoothly
    templeContentCards.forEach(card => {
      const isCurrent = card.id === `pillar-content-${pillarId}`;
      if (isCurrent) {
        card.style.display = "block";
        gsap.fromTo(card, 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );
      } else {
        card.style.display = "none";
      }
    });
  };

  // Click listeners for tabs
  templeTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const pillarId = tab.getAttribute("data-pillar");
      switchTemplePillar(pillarId);
    });
  });

  // Click listeners for columns
  templeColumns.forEach(col => {
    col.addEventListener("click", () => {
      const pillarId = col.getAttribute("data-pillar");
      switchTemplePillar(pillarId);
    });
  });

  // Initialize with pillar 1 active immediately on load
  // (ensures temple is never blank before user interaction)
  switchTemplePillar("1");

  // --- 10.6. INSTITUTIONAL HERO PARALLAX (GSAP) ---
  if (document.querySelector(".inst-hero-parallax-bg") && document.querySelector(".inst-hero-section")) {
    gsap.to(".inst-hero-parallax-bg", {
      scrollTrigger: {
        trigger: ".inst-hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      scale: 1.18,
      yPercent: 12,
      ease: "none"
    });
  }

  // --- 10.7. TIME TUNNEL (TÚNEL DO TEMPO) SCROLLTRIGGER & ACTIVE NODES ---
  if (document.querySelector(".timeline-container")) {
    gsap.to(".timeline-progress", {
      scrollTrigger: {
        trigger: ".timeline-container",
        start: "top 35%",
        end: "bottom 60%",
        scrub: 0.1
      },
      height: "100%",
      ease: "none"
    });

    const timelineNodes = document.querySelectorAll(".timeline-node");
    timelineNodes.forEach((node) => {
      ScrollTrigger.create({
        trigger: node,
        start: "top 68%",
        onEnter: () => {
          node.classList.add("timeline-active");
        },
        onLeaveBack: () => {
          node.classList.remove("timeline-active");
        }
      });
    });
  }


  // --- 11. FLOATING AMBIENT GLOWS ---
  gsap.to(".glow-1", {
    x: "random(-150, 150)",
    y: "random(-150, 150)",
    duration: 18,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
  
  gsap.to(".glow-2", {
    x: "random(-120, 120)",
    y: "random(-120, 120)",
    duration: 22,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.to(".glow-3", {
    x: "random(-180, 180)",
    y: "random(-180, 180)",
    duration: 25,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

});
