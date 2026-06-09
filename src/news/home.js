import { attachInteractiveCardListeners } from '../lib/interactive-cards.js';
import { createNewsCardHTML } from './render.js';

export function initHomeNews(dbClient) {
  const blogSectionGrid = document.querySelector('#blog .blog-grid');
  if (!blogSectionGrid) return;

  const renderHomeNews = async () => {
    try {
      const posts = await dbClient.getPosts();
      const latestPosts = posts.slice(0, 3);

      if (latestPosts.length === 0) return;

      blogSectionGrid.innerHTML = latestPosts.map(createNewsCardHTML).join('');

      const cards = blogSectionGrid.querySelectorAll('.blog-card');
      attachInteractiveCardListeners(cards);

      cards.forEach((card) => {
        card.querySelectorAll('.btn-read-news').forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `/portal-noticias.html?id=${card.getAttribute('data-post-id')}`;
          });
        });
      });
    } catch (err) {
      console.error('Error loading home page news:', err);
    }
  };

  renderHomeNews();
}
