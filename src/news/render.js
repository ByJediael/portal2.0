export function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

export function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Data indisponível';
  }
}

export function createNewsCardHTML(post) {
  const imgUrl = escapeHtml(post.image_url || '/hero_bg.png');
  const postDate = formatDate(post.created_at);
  const title = escapeHtml(post.title);
  const category = escapeHtml(post.category);
  const excerpt = escapeHtml(post.excerpt);
  const postId = escapeHtml(post.id);

  return `
    <article class="glass-card blog-card interactive-card" data-post-id="${postId}">
      <div class="blog-image-wrapper">
        <span class="blog-category">${category}</span>
        <img src="${imgUrl}" alt="${title}" class="img-responsive" />
      </div>
      <div class="blog-body">
        <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${postDate}</span>
        <h4 class="blog-title"><a href="#" class="btn-read-news" data-post-id="${postId}">${title}</a></h4>
        <p class="blog-excerpt">${excerpt}</p>
        <a href="#" class="blog-read-more btn-read-news" data-post-id="${postId}">
          Ler Artigo Completo <i class="fa-solid fa-arrow-right-long"></i>
        </a>
      </div>
    </article>
  `;
}
