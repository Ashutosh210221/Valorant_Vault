/* ============================================================
   Text Art gallery — filter, search, sort, copy-to-clipboard.
   Tracks per-piece copy counts in localStorage so the badge
   reflects real usage on this device.
   ============================================================ */
(function () {
  const CATEGORIES = [
    { id: 'all',       label: 'All' },
    { id: 'cartoon',   label: 'Cartoon' },
    { id: 'gg',        label: 'GG / WP' },
    { id: 'hype',      label: 'Hype' },
    { id: 'wholesome', label: 'Wholesome' },
    { id: 'trash',     label: 'Trash Talk' },
    { id: 'meme',      label: 'Memes' },
    { id: 'valorant',  label: 'Valorant' }
  ];

  const STORAGE_KEY = 'ashuvalz.textartCopyCounts';
  let copyCounts = loadCounts();

  let activeCategory = 'all';
  let searchQuery = '';
  let sortMode = 'latest'; // 'latest' | 'copied'

  function loadCounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function saveCounts() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(copyCounts)); } catch {}
  }

  function getCount(id) {
    return copyCounts[id] || 0;
  }

  function bumpCount(id) {
    copyCounts[id] = (copyCounts[id] || 0) + 1;
    saveCounts();
  }

  function formatCount(n) {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return String(n);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
  }

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

  function filtered() {
    const q = searchQuery.trim().toLowerCase();
    let items = TEXTART_DATA.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (!q) return true;
      const hay = (item.title + ' ' + item.tags.join(' ') + ' ' + item.art).toLowerCase();
      return hay.includes(q);
    });

    if (sortMode === 'copied') {
      items = items.slice().sort((a, b) => getCount(b.id) - getCount(a.id));
    }
    // 'latest' = original order (newest at top of data array)
    return items;
  }

  function categoryLabel(catId) {
    return (CATEGORIES.find(c => c.id === catId) || { label: catId }).label;
  }

  function renderGrid() {
    const grid = document.getElementById('textartGrid');
    const countEl = document.getElementById('textartCount');
    if (!grid) return;
    const items = filtered();
    if (countEl) countEl.textContent = `${items.length} piece${items.length !== 1 ? 's' : ''}`;

    if (items.length === 0) {
      grid.innerHTML = '<div class="ta-empty">No text art matches your search.</div>';
      return;
    }

    grid.innerHTML = items.map(item => {
      const isCartoon = item.category === 'cartoon';
      const count = getCount(item.id);
      const catLabel = categoryLabel(item.category);
      return `
      <article class="ta-card${isCartoon ? ' ta-card--big' : ''}" data-id="${item.id}" data-art="${encodeURIComponent(item.art)}" tabindex="0" role="button" aria-label="Copy ${escapeHtml(item.title)}">
        <div class="ta-art-wrap">
          <pre class="ta-art${isCartoon ? ' ta-art--big' : ''}">${escapeHtml(item.art)}</pre>
          <span class="ta-count-badge" data-count-id="${item.id}">${formatCount(count)}</span>
          <span class="ta-copy-flash">Copied ✓</span>
        </div>
        <div class="ta-meta">
          <span class="ta-cat-tag">${escapeHtml(catLabel)}</span>
          <span class="ta-cat-sep">|</span>
          <span class="ta-tags">${item.tags.slice(0, 3).map(t => `#${escapeHtml(t)}`).join(' ')}</span>
        </div>
        <div class="ta-title">${escapeHtml(item.title)}</div>
      </article>`;
    }).join('');

    grid.querySelectorAll('.ta-card').forEach(card => {
      card.addEventListener('click', () => copyCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          copyCard(card);
        }
      });
    });
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  async function copyCard(card) {
    const art = decodeURIComponent(card.dataset.art);
    const id = card.dataset.id;
    await copyToClipboard(art);
    bumpCount(id);
    const badge = card.querySelector('.ta-count-badge');
    if (badge) badge.textContent = formatCount(getCount(id));
    card.classList.add('copied');
    clearTimeout(card._t);
    card._t = setTimeout(() => card.classList.remove('copied'), 1100);
  }

  function bindSearch() {
    const input = document.getElementById('textartSearch');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value;
      renderGrid();
    });
  }

  function bindSort() {
    const sel = document.getElementById('textartSort');
    if (!sel) return;
    sel.addEventListener('change', () => {
      sortMode = sel.value;
      renderGrid();
    });
  }

  function init() {
    renderChips();
    bindSearch();
    bindSort();
    renderGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
