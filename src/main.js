import './style.css';
import { initLenis } from './lib/lenis.js';
import { attachInteractiveCardListeners } from './lib/interactive-cards.js';
import { initAnimations } from './animations/index.js';
import { initHeader, initMobileNav } from './ui/header.js';
import { initSmoothScroll } from './ui/navigation.js';
import { initVisitaForm } from './ui/visita-form.js';
import { createDbClient } from './news/db-client.js';
import { initHomeNews } from './news/home.js';
import { initNewsPortal } from './news/portal.js';

document.addEventListener('DOMContentLoaded', () => {
  const lenis = initLenis();

  initHeader();
  initMobileNav();
  initAnimations();

  attachInteractiveCardListeners(document.querySelectorAll('.interactive-card'));

  initSmoothScroll(lenis);
  initVisitaForm();

  const dbClient = createDbClient();
  initHomeNews(dbClient);
  initNewsPortal(dbClient, lenis);
});
