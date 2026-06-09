export function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  if (document.querySelector('.hero-parallax-bg') && document.querySelector('.hero-section')) {
    gsap.to('.hero-parallax-bg', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      scale: 1.18,
      yPercent: 12,
      ease: 'none',
    });
  }

  if (document.querySelector('.hero-content') && document.querySelector('.hero-section')) {
    gsap.to('.hero-content', {
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom 30%',
        scrub: true,
      },
      opacity: 0,
      yPercent: -15,
      ease: 'none',
    });
  }

  gsap.from('.animate-text-stagger', {
    opacity: 0,
    y: 35,
    duration: 1.25,
    ease: 'power4.out',
    delay: 0.15,
  });

  gsap.from('.animate-fade-up', {
    opacity: 0,
    y: 25,
    duration: 1.0,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.4,
  });

  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      onEnter: () => el.classList.add('active'),
      once: true,
    });
  });

  if (document.querySelector('.segments-grid')) {
    gsap.from('.segment-card', {
      scrollTrigger: {
        trigger: '.segments-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1.0,
      stagger: 0.18,
      ease: 'power3.out',
    });
  }

  if (document.querySelector('.differentials-list')) {
    gsap.from('.differentials-list li', {
      scrollTrigger: {
        trigger: '.differentials-list',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }

  if (document.querySelector('.structure-gallery')) {
    gsap.from('.structure-gallery .structure-card', {
      scrollTrigger: {
        trigger: '.structure-gallery',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.2,
      ease: 'power3.out',
    });
  }

  if (document.querySelector('.blog-grid')) {
    gsap.from('.blog-grid .blog-card', {
      scrollTrigger: {
        trigger: '.blog-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1.0,
      stagger: 0.18,
      ease: 'power3.out',
    });
  }

  if (document.querySelector('.testimonials-grid')) {
    gsap.from('.testimonial-card-new', {
      scrollTrigger: {
        trigger: '.testimonials-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.2,
      ease: 'power3.out',
    });
  }

  if (document.querySelector('.events-list')) {
    gsap.from('.events-list .event-item', {
      scrollTrigger: {
        trigger: '.events-list',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }

  document.querySelectorAll('.stat-number, .home-aprov-num').forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 88%',
      onEnter: () => {
        let count = 0;
        const duration = 1500;
        const frameRate = 1000 / 60;
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
      once: true,
    });
  });

  initTempleAnimations();
  initInstitutionalHero();
  initTimeTunnel();
  initJourneyTimeline();
  initAmbientGlows();
}

function initTempleAnimations() {
  if (document.querySelector('.temple-interactive-section')) {
    gsap.set('.temple-column', { opacity: 0.6, scaleY: 1 });

    const templeEntranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.temple-interactive-section',
        start: 'top 75%',
        toggleActions: 'play none none none',
        onLeaveBack: () => {
          gsap.set('.temple-column', { opacity: 0.6, scaleY: 1 });
        },
      },
    });

    templeEntranceTl.fromTo(
      '.temple-base',
      { scaleX: 0.1, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.85, ease: 'power3.out' }
    );

    templeEntranceTl.fromTo(
      '.temple-column',
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1,
        opacity: 0.6,
        duration: 1.1,
        stagger: 0.18,
        ease: 'back.out(1.3)',
        transformOrigin: 'bottom center',
        clearProps: 'scaleY',
      },
      '-=0.45'
    );

    templeEntranceTl.fromTo(
      '.temple-architrave',
      { y: -35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.55'
    );

    templeEntranceTl.fromTo(
      '.temple-roof',
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'bounce.out' },
      '-=0.35'
    );
  }

  const templeTabs = document.querySelectorAll('.temple-tab');
  const templeColumns = document.querySelectorAll('.temple-column');
  const templeContentCards = document.querySelectorAll('.temple-content-card');

  const switchTemplePillar = (pillarId) => {
    templeTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('data-pillar') === pillarId);
    });

    templeColumns.forEach((col) => {
      const isCurrent = col.getAttribute('data-pillar') === pillarId;
      gsap.killTweensOf(col);
      if (isCurrent) {
        col.classList.add('active');
        gsap.to(col, { scale: 1.08, opacity: 1, duration: 0.45, ease: 'power2.out' });
      } else {
        col.classList.remove('active');
        gsap.to(col, { scale: 1.0, opacity: 0.6, duration: 0.45, ease: 'power2.out' });
      }
    });

    templeContentCards.forEach((card) => {
      const isCurrent = card.id === `pillar-content-${pillarId}`;
      if (isCurrent) {
        card.style.display = 'block';
        gsap.fromTo(
          card,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        );
      } else {
        card.style.display = 'none';
      }
    });
  };

  templeTabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTemplePillar(tab.getAttribute('data-pillar')));
  });

  templeColumns.forEach((col) => {
    col.addEventListener('click', () => switchTemplePillar(col.getAttribute('data-pillar')));
  });

  if (templeTabs.length || templeColumns.length) {
    switchTemplePillar('1');
  }
}

function initInstitutionalHero() {
  if (document.querySelector('.inst-hero-parallax-bg') && document.querySelector('.inst-hero-section')) {
    gsap.to('.inst-hero-parallax-bg', {
      scrollTrigger: {
        trigger: '.inst-hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      scale: 1.18,
      yPercent: 12,
      ease: 'none',
    });
  }
}

function initTimeTunnel() {
  if (!document.querySelector('.timeline-container')) return;

  gsap.to('.timeline-progress', {
    scrollTrigger: {
      trigger: '.timeline-container',
      start: 'top 35%',
      end: 'bottom 60%',
      scrub: 0.1,
    },
    height: '100%',
    ease: 'none',
  });

  document.querySelectorAll('.timeline-node').forEach((node) => {
    ScrollTrigger.create({
      trigger: node,
      start: 'top 68%',
      onEnter: () => node.classList.add('timeline-active'),
      onLeaveBack: () => node.classList.remove('timeline-active'),
    });
  });
}

function initJourneyTimeline() {
  const timelineTabBtns = document.querySelectorAll('.timeline-tab-btn');
  const timelineSteps = document.querySelectorAll('.timeline-step');
  if (!timelineTabBtns.length && !timelineSteps.length) return;

  const switchTimelineStep = (stepNumber) => {
    timelineTabBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-step') === stepNumber);
    });

    timelineSteps.forEach((step) => {
      const isCurrent = step.getAttribute('data-step') === stepNumber;

      if (isCurrent) {
        step.classList.add('active');
        gsap.killTweensOf(step);
        gsap.fromTo(
          step,
          { x: -8, opacity: 0.8 },
          { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
        );

        const dot = step.querySelector('.step-dot');
        if (dot) {
          gsap.fromTo(dot, { scale: 1 }, { scale: 1.5, duration: 0.35, ease: 'back.out(2)' });
        }
      } else {
        step.classList.remove('active');
        const dot = step.querySelector('.step-dot');
        if (dot) gsap.set(dot, { scale: 1 });
      }
    });
  };

  timelineTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => switchTimelineStep(btn.getAttribute('data-step')));
  });

  timelineSteps.forEach((step) => {
    step.addEventListener('click', () => switchTimelineStep(step.getAttribute('data-step')));
  });
}

function initAmbientGlows() {
  gsap.to('.glow-1', {
    x: 'random(-150, 150)',
    y: 'random(-150, 150)',
    duration: 18,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.glow-2', {
    x: 'random(-120, 120)',
    y: 'random(-120, 120)',
    duration: 22,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.glow-3', {
    x: 'random(-180, 180)',
    y: 'random(-180, 180)',
    duration: 25,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}
