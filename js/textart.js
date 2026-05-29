/* ============================================================
   Text Art gallery — filter, search, copy-to-clipboard.
   ============================================================ */
(function () {
  const CATEGORIES = [
    { id: 'all',       label: 'All' },
    { id: 'big',       label: 'Block Art' },
    { id: 'gg',        label: 'GG / WP' },
    { id: 'hype',      label: 'Hype' },
    { id: 'wholesome', label: 'Wholesome' },
    { id: 'trash',     label: 'Trash Talk' },
    { id: 'meme',      label: 'Memes' },
    { id: 'valorant',  label: 'Valorant' }
  ];

  let activeCategory = 'all';
  let searchQuery = '';

  function renderChips() {
    const wrap = document.getElementById('textartCats');
    if (!wrap) return;
    wrap.innerHTML = CATEGORIES.map(c => {
      const count = c.id === 'all'
        ? TEXTART_DATA.length
        : TEXTART_DATA.filter(t => t.category === c.id).length;
      return `<button class="ta-chip${c.id === activeCategory ? ' active' : ''}" data-cat="${c.id}" type="button">
        ${c.label}<span class="ta-chip-count">${count}</span>
      </button>`;
    }).join('');
    wrap.querySelectorAll('.ta-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        renderChips();
        renderGrid();
      });
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
  }

  function filtered() {
    const q = searchQuery.trim().toLowerCase();
    return TEXTART_DATA.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (!q) return true;
      const hay = (item.title + ' ' + item.tags.join(' ') + ' ' + item.art).toLowerCase();
      return hay.includes(q);
    });
  }

  function renderGrid() {
    const grid = document.getElementById('textartGrid');
    const countEl = document.getElementById('textartCount');
    if (!grid) return;
    const items = filtered();
    countEl.textContent = `${items.length} piece${items.length !== 1 ? 's' : ''}`;

    if (items.length === 0) {
      grid.innerHTML = '<div class="ta-empty">No text art matches your search.</div>';
      return;
    }

    grid.innerHTML = items.map(item => {
      const isBig = item.category === 'big';
      return `
      <article class="ta-card${isBig ? ' ta-card--big' : ''}" data-id="${item.id}">
        <pre class="ta-art${isBig ? ' ta-art--big' : ''}">${escapeHtml(item.art)}</pre>
        <div class="ta-meta">
          <div class="ta-meta-info">
            <div class="ta-title">${escapeHtml(item.title)}</div>
            <div class="ta-tags">${item.tags.map(t => `#${escapeHtml(t)}`).join(' ')}</div>
          </div>
          <button class="ta-copy" type="button" data-art="${encodeURIComponent(item.art)}" aria-label="Copy ${escapeHtml(item.title)}">
            <span class="ta-copy-default">Copy</span>
            <span class="ta-copy-done">Copied ✓</span>
          </button>
        </div>
      </article>`;
    }).join('');

    grid.querySelectorAll('.ta-copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const art = decodeURIComponent(btn.dataset.art);
        try {
          await navigator.clipboard.writeText(art);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = art;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        btn.classList.add('copied');
        clearTimeout(btn._t);
        btn._t = setTimeout(() => btn.classList.remove('copied'), 1400);
      });
    });
  }

  function bindSearch() {
    const input = document.getElementById('textartSearch');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value;
      renderGrid();
    });
  }

  function init() {
    renderChips();
    bindSearch();
    renderGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
