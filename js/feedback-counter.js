/* ============================================================
   Public feedback counter widget — small thumbs up/down chip in
   the footer. Shows the icons normally; click to reveal the
   live totals from Supabase (falls back to localStorage).
   ============================================================ */
(function () {
  const widget = document.getElementById('feedbackCounter');
  if (!widget) return;

  const STORAGE_KEY = 'ashuvalz.feedbackCounts';
  const upBtn = widget.querySelector('[data-counter-side="up"]');
  const downBtn = widget.querySelector('[data-counter-side="down"]');
  const upCountEl = widget.querySelector('[data-counter-count="up"]');
  const downCountEl = widget.querySelector('[data-counter-count="down"]');
  const labelEl = widget.querySelector('.feedback-counter-label');

  let revealed = false;
  let loading = false;

  function readLocal() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { up: Number(saved.up) || 0, down: Number(saved.down) || 0 };
    } catch {
      return { up: 0, down: 0 };
    }
  }

  function writeLocal(counts) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(counts)); } catch {}
  }

  async function fetchRemote() {
    const auth = window.AshuAuth;
    if (!auth || !auth.client) return null;
    try {
      const { data, error } = await auth.client.rpc('get_feedback_totals');
      if (error || !data || !data.length) return null;
      return {
        up: Number(data[0].up_count) || 0,
        down: Number(data[0].down_count) || 0
      };
    } catch {
      return null;
    }
  }

  function paint(counts) {
    upCountEl.textContent = counts.up.toLocaleString();
    downCountEl.textContent = counts.down.toLocaleString();
  }

  async function reveal() {
    if (loading) return;
    loading = true;
    if (labelEl) labelEl.textContent = 'Loading...';
    widget.classList.add('revealing');

    let counts = readLocal();
    paint(counts);

    const remote = await fetchRemote();
    if (remote) {
      counts = remote;
      writeLocal(counts);
      paint(counts);
    }

    revealed = true;
    loading = false;
    widget.classList.remove('revealing');
    widget.classList.add('revealed');
    if (labelEl) labelEl.textContent = 'Live tally';
  }

  function collapse() {
    revealed = false;
    widget.classList.remove('revealed');
    if (labelEl) labelEl.textContent = 'Tap to see';
  }

  function toggle() {
    if (revealed) collapse(); else reveal();
  }

  upBtn?.addEventListener('click', toggle);
  downBtn?.addEventListener('click', toggle);

  // If a vote is cast somewhere on the page (e.g. download gate), refresh.
  window.addEventListener('ashuvalz:vote-cast', () => {
    if (revealed) reveal();
  });
})();
