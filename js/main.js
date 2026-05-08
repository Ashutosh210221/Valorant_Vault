document.querySelectorAll('.bundle-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    window.location.href = 'pages/builder.html';
  });
});

/* Mobile nav toggle — hamburger opens/closes the nav-links panel. */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function close() {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function open() {
    links.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  toggle.addEventListener('click', () => {
    if (links.classList.contains('open')) close(); else open();
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && links.classList.contains('open')) close();
  });
})();

/* Builder mobile: mirror the portfolio skin-count into the
   sticky bottom CTA so users always know what's selected. */
(function () {
  const source = document.getElementById('pcCount');
  const target = document.getElementById('mobileCtaCount');
  if (!source || !target) return;

  function sync() { target.textContent = source.textContent || '0 skins'; }
  sync();

  const observer = new MutationObserver(sync);
  observer.observe(source, { childList: true, characterData: true, subtree: true });
})();
