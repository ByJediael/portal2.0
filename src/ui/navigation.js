import { SCROLL_EASING } from '../lib/scroll-easing.js';

export function initSmoothScroll(lenis) {
  const navLinks = document.querySelectorAll(
    '.nav-link, .mobile-link, .hero-actions a, .brand-logo, .footer-links a'
  );

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId?.startsWith('#')) return;

      if (targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
        if (link.classList.contains('nav-link')) {
          link.classList.add('active');
        }

        lenis.scrollTo(targetElement, {
          offset: -80,
          duration: 1.5,
          easing: SCROLL_EASING,
        });
      } else if (targetId === '#') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.5, easing: SCROLL_EASING });
      }
    });
  });
}
