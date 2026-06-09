export function initVisitaForm() {
  const visitaForm = document.querySelector('#visita-form');
  if (!visitaForm) return;

  visitaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btnSubmit = visitaForm.querySelector('.btn-submit');
    const originalText = btnSubmit.innerHTML;

    btnSubmit.innerHTML = '<span>Processando solicitação...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btnSubmit.style.pointerEvents = 'none';
    btnSubmit.style.opacity = '0.8';

    setTimeout(() => {
      btnSubmit.innerHTML = '<span>Visita Agendada!</span> <i class="fa-solid fa-circle-check"></i>';
      btnSubmit.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      btnSubmit.style.color = '#ffffff';
      btnSubmit.style.opacity = '1';

      visitaForm.reset();

      setTimeout(() => {
        btnSubmit.innerHTML = originalText;
        btnSubmit.style.background = '';
        btnSubmit.style.color = '';
        btnSubmit.style.pointerEvents = 'auto';
      }, 3500);
    }, 1800);
  });
}
