export function initHeader() {
  const header = document.querySelector('#main-header');

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', updateHeaderState);
  updateHeaderState();
}

export function initMobileNav() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!mobileMenuToggle || !mobileMenuClose || !mobileNavOverlay) return;

  const closeMobileMenu = () => {
    mobileNavOverlay.classList.remove('active');
  };

  mobileMenuToggle.addEventListener('click', () => {
    mobileNavOverlay.classList.add('active');
  });

  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileNavOverlay.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) closeMobileMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}
