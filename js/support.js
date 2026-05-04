(function () {
  const fab = document.getElementById('supportFab');
  const pop = document.getElementById('supportPop');
  if (!fab || !pop) return;

  const backdrop = pop.querySelector('.support-pop-backdrop');
  const closeBtn = pop.querySelector('.support-pop-close');

  function close() {
    pop.classList.add('hidden');
    pop.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function open() {
    pop.classList.remove('hidden');
    pop.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    pop.classList.contains('hidden') ? open() : close();
  });
  backdrop?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();
