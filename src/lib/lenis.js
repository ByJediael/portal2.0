import Lenis from 'lenis';
import { SCROLL_EASING } from './scroll-easing.js';

export function initLenis() {
  const lenis = new Lenis({
    duration: 1.3,
    easing: SCROLL_EASING,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    smoothTouch: false,
    infinite: false,
  });

  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
