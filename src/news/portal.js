import { attachInteractiveCardListeners } from '../lib/interactive-cards.js';
import { createNewsCardHTML, formatDate } from './render.js';

export function initNewsPortal(dbClient, lenis) {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid) return;

  let allPostsCache = [];
  let activeCategory = 'all';
  let searchQuery = '';

  const loadingState = document.getElementById('news-loading');
  const emptyState = document.getElementById('news-empty');
  const newsDetailModal = document.getElementById('news-detail-modal');
  const adminLoginModal = document.getElementById('admin-login-modal');
  const adminDashboardModal = document.getElementById('admin-dashboard-modal');
  const searchInput = document.getElementById('news-search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const adminLoginForm = document.getElementById('admin-login-form');
  const newsEditorForm = document.getElementById('news-editor-form');

  const stopScroll = () => {
    document.body.style.overflow = 'hidden';
    lenis?.stop();
  };

  const resumeScroll = () => {
    document.body.style.overflow = '';
    lenis?.start();
  };

  const renderNewsPortal = () => {
    let filtered = allPostsCache;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query)
      );
    }

    if (loadingState) loadingState.style.display = 'none';

    if (filtered.length === 0) {
      newsGrid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    newsGrid.style.display = 'grid';
    newsGrid.innerHTML = filtered.map(createNewsCardHTML).join('');

    newsGrid.querySelectorAll('.btn-read-news').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openNewsDetail(btn.getAttribute('data-post-id'));
      });
    });

    attachInteractiveCardListeners(newsGrid.querySelectorAll('.blog-card'));
  };

  const openNewsDetail = (postId) => {
    const post = allPostsCache.find((p) => p.id === postId);
    if (!post) return;

    document.getElementById('modal-category').innerText = post.category;
    document.getElementById('modal-image').src = post.image_url || '/hero_bg.png';
    document.getElementById('modal-date').innerHTML = `<i class="fa-regular fa-calendar"></i> ${formatDate(post.created_at)}`;
    document.getElementById('modal-read-time').innerHTML = `<i class="fa-regular fa-clock"></i> ${post.read_time || '3 min de leitura'}`;
    document.getElementById('modal-title').innerText = post.title;
    document.getElementById('modal-excerpt').innerText = post.excerpt;
    document.getElementById('modal-content').innerHTML = post.content;

    newsDetailModal.style.display = 'flex';
    stopScroll();
  };

  const loadNewsFromDB = async () => {
    if (loadingState) loadingState.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    newsGrid.style.display = 'none';

    try {
      allPostsCache = await dbClient.getPosts();
      renderNewsPortal();

      const urlParams = new URLSearchParams(window.location.search);
      const autoOpenId = urlParams.get('id');
      if (autoOpenId) openNewsDetail(autoOpenId);
      if (urlParams.get('admin') === 'true') openAdminPanel();
    } catch (err) {
      console.error('Error rendering news portal:', err);
      if (loadingState) loadingState.style.display = 'none';
      newsGrid.innerHTML =
        '<p style="color: #ff859c; text-align: center; width: 100%;">Falha ao carregar as publicações. Por favor, tente novamente.</p>';
      newsGrid.style.display = 'block';
    }
  };

  document.getElementById('close-news-modal').addEventListener('click', () => {
    newsDetailModal.style.display = 'none';
    resumeScroll();
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
  });

  [newsDetailModal, adminLoginModal, adminDashboardModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        resumeScroll();
      }
    });
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderNewsPortal();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderNewsPortal();
    });
  }

  const adminTriggerBtn = document.getElementById('btn-admin-panel');
  const closeLoginBtn = document.getElementById('close-login-modal');
  const closeDashboardBtn = document.getElementById('close-dashboard-modal');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const loginErrorText = document.getElementById('login-error-text');
  const adminUserEmail = document.getElementById('admin-user-email');
  const adminPostsTbody = document.getElementById('admin-posts-tbody');
  const btnCreatePostTrigger = document.getElementById('btn-create-post-trigger');
  const postFormPanel = document.getElementById('post-form-panel');
  const btnCancelPostEdit = document.getElementById('btn-cancel-post-edit');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const editPostId = document.getElementById('edit-post-id');
  const formPanelTitle = document.getElementById('form-panel-title');
  const btnSubmitPost = document.getElementById('btn-submit-post');

  const showAlert = (isSuccess, text) => {
    const msgDiv = document.getElementById('db-msg');
    msgDiv.className = isSuccess ? 'alert-success' : 'alert-error';
    msgDiv.innerHTML = isSuccess
      ? `<i class="fa-solid fa-circle-check"></i> <span>${text}</span>`
      : `<i class="fa-solid fa-triangle-exclamation"></i> <span>${text}</span>`;
    msgDiv.style.display = 'flex';
    setTimeout(() => {
      msgDiv.style.display = 'none';
    }, 4000);
  };

  const renderAdminPostsTable = () => {
    if (allPostsCache.length === 0) {
      adminPostsTbody.innerHTML =
        '<tr><td colspan="4" style="text-align: center;">Nenhum post disponível. Crie um novo!</td></tr>';
      return;
    }

    adminPostsTbody.innerHTML = allPostsCache
      .map(
        (post) => `
        <tr>
          <td>${formatDate(post.created_at)}</td>
          <td style="font-weight: 600;">${post.title}</td>
          <td><span class="user-badge">${post.category}</span></td>
          <td>
            <div class="action-btns-group">
              <button class="action-btn btn-edit-action" data-post-id="${post.id}" title="Editar post">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="action-btn btn-delete-action" data-post-id="${post.id}" title="Excluir post">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `
      )
      .join('');

    adminPostsTbody.querySelectorAll('.btn-edit-action').forEach((btn) => {
      btn.addEventListener('click', () => openEditPostForm(btn.getAttribute('data-post-id')));
    });

    adminPostsTbody.querySelectorAll('.btn-delete-action').forEach((btn) => {
      btn.addEventListener('click', () => handleDeletePost(btn.getAttribute('data-post-id')));
    });
  };

  const openAdminPanel = async () => {
    const user = await dbClient.getCurrentUser();
    if (user) {
      if (adminUserEmail) adminUserEmail.innerText = user.email;
      renderAdminPostsTable();
      adminDashboardModal.style.display = 'flex';
      stopScroll();
    } else {
      if (loginErrorMsg) loginErrorMsg.style.display = 'none';
      adminLoginModal.style.display = 'flex';
      stopScroll();
    }
  };

  const openEditPostForm = (postId) => {
    const post = allPostsCache.find((p) => p.id === postId);
    if (!post) return;

    editPostId.value = post.id;
    formPanelTitle.innerText = 'Editar Publicação';
    btnSubmitPost.innerHTML = '<span>Salvar Alterações</span> <i class="fa-solid fa-floppy-disk"></i>';

    document.getElementById('post-title').value = post.title;
    document.getElementById('post-category').value = post.category;
    document.getElementById('post-read-time').value = post.read_time || '';
    document.getElementById('post-image-url').value = post.image_url || '';
    document.getElementById('post-excerpt').value = post.excerpt;
    document.getElementById('post-content').value = post.content;

    postFormPanel.style.display = 'block';
  };

  const handleDeletePost = async (postId) => {
    const post = allPostsCache.find((p) => p.id === postId);
    if (!post) return;

    if (confirm(`Tem certeza que deseja excluir o post "${post.title}"?`)) {
      try {
        await dbClient.deletePost(postId);
        showAlert(true, 'Notícia excluída com sucesso!');
        await loadNewsFromDB();
        renderAdminPostsTable();
      } catch (err) {
        console.error('Failed to delete post:', err);
        showAlert(false, `Erro ao excluir o post: ${err.message || ''}`);
      }
    }
  };

  adminTriggerBtn.addEventListener('click', openAdminPanel);
  closeLoginBtn.addEventListener('click', () => {
    adminLoginModal.style.display = 'none';
    resumeScroll();
  });
  closeDashboardBtn.addEventListener('click', () => {
    adminDashboardModal.style.display = 'none';
    resumeScroll();
  });

  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const btnSubmit = document.getElementById('btn-submit-login');
    const originalText = btnSubmit.innerHTML;

    btnSubmit.innerHTML = '<span>Entrando...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btnSubmit.style.pointerEvents = 'none';

    try {
      await dbClient.login(email, password);
      adminLoginModal.style.display = 'none';
      adminLoginForm.reset();
      await openAdminPanel();
    } catch (err) {
      console.error('Login failed:', err);
      if (loginErrorMsg) {
        loginErrorText.innerText = err.message || 'Erro desconhecido. Verifique as credenciais.';
        loginErrorMsg.style.display = 'flex';
      }
    } finally {
      btnSubmit.innerHTML = originalText;
      btnSubmit.style.pointerEvents = 'auto';
    }
  });

  btnAdminLogout.addEventListener('click', async () => {
    await dbClient.logout();
    adminDashboardModal.style.display = 'none';
    resumeScroll();
    postFormPanel.style.display = 'none';
    newsEditorForm.reset();
    editPostId.value = '';
  });

  btnCreatePostTrigger.addEventListener('click', () => {
    editPostId.value = '';
    newsEditorForm.reset();
    formPanelTitle.innerText = 'Nova Publicação';
    btnSubmitPost.innerHTML = '<span>Publicar Notícia</span> <i class="fa-solid fa-paper-plane"></i>';
    postFormPanel.style.display = 'block';
  });

  btnCancelPostEdit.addEventListener('click', () => {
    postFormPanel.style.display = 'none';
    newsEditorForm.reset();
    editPostId.value = '';
  });

  newsEditorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = editPostId.value;
    const postData = {
      title: document.getElementById('post-title').value,
      category: document.getElementById('post-category').value,
      read_time: document.getElementById('post-read-time').value,
      image_url: document.getElementById('post-image-url').value,
      excerpt: document.getElementById('post-excerpt').value,
      content: document.getElementById('post-content').value,
    };

    try {
      if (id) {
        await dbClient.updatePost(id, postData);
        showAlert(true, 'Publicação editada com sucesso!');
      } else {
        await dbClient.createPost(postData);
        showAlert(true, 'Publicação criada com sucesso!');
      }

      postFormPanel.style.display = 'none';
      newsEditorForm.reset();
      editPostId.value = '';

      await loadNewsFromDB();
      renderAdminPostsTable();
    } catch (err) {
      console.error('Editor error:', err);
      showAlert(false, `Falha ao gravar publicação: ${err.message || ''}`);
    }
  });

  loadNewsFromDB();
}
