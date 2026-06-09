export function attachInteractiveCardListeners(cards) {
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -y * 0.05;
      const rotateY = x * 0.05;

      gsap.to(card, {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4), 0 0 25px rgba(229, 179, 56, 0.06)',
        duration: 0.35,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  });
}
