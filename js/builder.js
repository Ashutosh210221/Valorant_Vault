let currentWeapon = 'all';
let currentTier = 'all';
let selectedSkins = {};
let searchQuery = '';
let selectedRankBase = '';

const RARITY_OPTIONS = [
  { tier: 'standard', label: 'Standard', color: '#8A8F98' },
  { tier: 'select', label: 'Select Edition', color: '#4DA6FF' },
  { tier: 'deluxe', label: 'Deluxe Edition', color: '#2EFF7B' },
  { tier: 'premium', label: 'Premium Edition', color: '#FF4FD8' },
  { tier: 'exclusive', label: 'Exclusive Edition', color: '#FF8C00' },
  { tier: 'ultra', label: 'Ultra Edition', color: '#FFE15A' },
];

const VP_BY_TIER = {
  standard: 0,
  select: 875,
  deluxe: 1275,
  premium: 1775,
  exclusive: 2175,
  ultra: 2475
};

const RANK_OPTIONS = [
  'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum',
  'Diamond', 'Ascendant', 'Immortal', 'Radiant'
];

const RANKS_WITH_DIVISIONS = new Set([
  'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant'
]);

const RANKS_WITH_RR = new Set(['Immortal', 'Radiant']);

const RANK_ICON_BASE = 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04';

const RANK_ICON_TIERS = {
  Iron: 3,
  Bronze: 6,
  Silver: 9,
  Gold: 12,
  Platinum: 15,
  Diamond: 18,
  Ascendant: 21,
  Immortal: 24,
  Radiant: 27
};

const WEAPON_ICONS = {
  classic: 'https://media.valorant-api.com/weapons/29a0cfab-485b-f5d5-779a-b59f85e204a8/displayicon.png',
  shorty: 'https://media.valorant-api.com/weapons/42da8ccc-40d5-affc-beec-15aa47b42eda/displayicon.png',
  frenzy: 'https://media.valorant-api.com/weapons/44d4e95c-4157-0037-81b2-17841bf2e8e3/displayicon.png',
  ghost: 'https://media.valorant-api.com/weapons/1baa85b4-4c70-1284-64bb-6481dfc3bb4e/displayicon.png',
  sheriff: 'https://media.valorant-api.com/weapons/e336c6b8-418d-9340-d77f-7a9e4cfe0702/displayicon.png',
  bandit: 'https://media.valorant-api.com/weapons/410b2e0b-4ceb-1321-1727-20858f7f3477/displayicon.png',
  stinger: 'https://media.valorant-api.com/weapons/f7e1b454-4ad4-1063-ec0a-159e56b58941/displayicon.png',
  spectre: 'https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png',
  bucky: 'https://media.valorant-api.com/weapons/910be174-449b-c412-ab22-d0873436b21b/displayicon.png',
  judge: 'https://media.valorant-api.com/weapons/ec845bf4-4f79-ddda-a3da-0db3774b2794/displayicon.png',
  bulldog: 'https://media.valorant-api.com/weapons/ae3de142-4d85-2547-dd26-4e90bed35cf7/displayicon.png',
  guardian: 'https://media.valorant-api.com/weapons/4ade7faa-4cf1-8376-95ef-39884480959b/displayicon.png',
  phantom: 'https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a/displayicon.png',
  vandal: 'https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cf872/displayicon.png',
  marshal: 'https://media.valorant-api.com/weapons/c4883e50-4494-202c-3ec3-6b8a9284f00b/displayicon.png',
  outlaw: 'https://media.valorant-api.com/weapons/5f0aaf7a-4289-3998-d5ff-eb9a5cf7ef5c/displayicon.png',
  operator: 'https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94bbfba1dfc7/displayicon.png',
  ares: 'https://media.valorant-api.com/weapons/55d8a0f4-4274-ca67-fe2c-06ab45efdf58/displayicon.png',
  odin: 'https://media.valorant-api.com/weapons/63e6c2b6-4a8e-869c-3d4c-e38355226584/displayicon.png',
  knife: 'https://media.valorant-api.com/weapons/2f59173c-4bed-b6c3-2191-dea9b58be9c7/displayicon.png',
};

const WEAPON_ORDER = [
  'classic', 'shorty', 'frenzy', 'ghost', 'bandit', 'sheriff',
  'stinger', 'spectre', 'bucky', 'judge', 'bulldog', 'guardian',
  'phantom', 'vandal', 'marshal', 'outlaw', 'operator', 'ares',
  'odin', 'knife'
];

const WEAPON_CATEGORIES = [
  { title: 'Pistols', weapons: ['classic', 'shorty', 'frenzy', 'ghost', 'bandit', 'sheriff'] },
  { title: 'SMG', weapons: ['stinger', 'spectre'] },
  { title: 'Shotgun', weapons: ['bucky', 'judge'] },
  { title: 'Rifles', weapons: ['bulldog', 'guardian', 'phantom', 'vandal'] },
  { title: 'Sniper Rifle', weapons: ['marshal', 'outlaw', 'operator'] },
  { title: 'Machine Gun', weapons: ['ares', 'odin'] },
  { title: 'Knife', weapons: ['knife'] }
];

const WEAPON_RANK = WEAPON_ORDER.reduce((acc, w, i) => (acc[w] = i, acc), {});

function sortByWeaponOrder(skins) {
  return [...skins].sort((a, b) => {
    const ra = WEAPON_RANK[a.weapon] ?? 999;
    const rb = WEAPON_RANK[b.weapon] ?? 999;
    return ra - rb;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  updateWeaponTabsForTier();
  renderSkins();
});

function bindEvents() {
  document.querySelectorAll('.weapon-tab').forEach(btn => {
    btn.dataset.label = btn.textContent.trim();
    btn.addEventListener('click', () => {
      const clicked = btn.dataset.weapon;
      // Click the same tab again to deselect (back to "All").
      currentWeapon = (currentWeapon === clicked && clicked !== 'all') ? 'all' : clicked;
      syncActiveWeaponButton();
      updateCurrentWeaponLabel();
      renderSkins();
    });
  });

  document.getElementById('tierSelect')?.addEventListener('change', (e) => {
    currentTier = e.target.value;
    updateWeaponTabsForTier();
    updateCurrentWeaponForTier();
    syncActiveWeaponButton();
    updateCurrentWeaponLabel();
    renderSkins();
  });

  document.getElementById('rarityClose')?.addEventListener('click', closeRarityModal);
  document.getElementById('rarityBackdrop')?.addEventListener('click', closeRarityModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRarityModal();
      closeRankModal();
      closeFeedbackGate();
    }
  });

  document.getElementById('skinSearch').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderSkins();
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    selectedSkins = {};
    renderSkins();
    updateLoadout();
    updatePreviewCard();
    updateSelectedTabBadge();
  });

  document.getElementById('playerName').addEventListener('input', updatePreviewCard);
  document.getElementById('playerRank').addEventListener('click', openRankModal);
  document.getElementById('rankClose')?.addEventListener('click', closeRankModal);
  document.getElementById('rankBackdrop')?.addEventListener('click', closeRankModal);

  document.getElementById('downloadPortfolioBtn')?.addEventListener('click', requestExport);
  document.getElementById('savePortfolioBtn')?.addEventListener('click', savePortfolio);
  document.getElementById('loadPortfolioBtn')?.addEventListener('click', loadPortfolio);

  initFeedbackGate();
  initAccountActions();
}

function initAccountActions() {
  const refresh = () => {
    const loggedIn = Boolean(window.AshuAuth && window.AshuAuth.user);
    const saveBtn = document.getElementById('savePortfolioBtn');
    const loadBtn = document.getElementById('loadPortfolioBtn');
    [saveBtn, loadBtn].forEach(btn => {
      if (!btn) return;
      btn.title = loggedIn ? '' : 'Login to use this';
    });
  };

  refresh();
  window.AshuAuth?.onChange?.(refresh);
}

async function savePortfolio() {
  const auth = window.AshuAuth;
  if (!auth || !auth.user || !auth.client) {
    alert('Please login first to save your portfolio.');
    return;
  }
  const skins = Object.values(selectedSkins);
  if (skins.length === 0) {
    alert('Pick at least one skin before saving.');
    return;
  }

  const ign = document.getElementById('playerName')?.value || '';
  const rank = document.getElementById('playerRank')?.value || '';
  const btn = document.getElementById('savePortfolioBtn');
  const original = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

  try {
    const { error } = await auth.client
      .from('portfolios')
      .upsert({
        user_id: auth.user.id,
        name: 'My Loadout',
        data: { skins: Object.keys(selectedSkins), ign, rank },
        updated_at: new Date().toISOString()
      });
    if (error) throw error;
    if (btn) btn.textContent = 'Saved!';
    setTimeout(() => { if (btn) btn.textContent = original; }, 1500);
  } catch (err) {
    alert('Save failed: ' + (err.message || 'Unknown error'));
    if (btn) btn.textContent = original;
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function loadPortfolio() {
  const auth = window.AshuAuth;
  if (!auth || !auth.user || !auth.client) {
    alert('Please login first to load your saved portfolio.');
    return;
  }
  const btn = document.getElementById('loadPortfolioBtn');
  const original = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = 'Loading...'; }

  try {
    const { data, error } = await auth.client
      .from('portfolios')
      .select('*')
      .eq('user_id', auth.user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      alert('No saved portfolio yet. Pick some skins and hit Save first.');
      return;
    }

    const skinIds = (data.data && data.data.skins) || [];
    const ign = (data.data && data.data.ign) || '';
    const rank = (data.data && data.data.rank) || '';

    selectedSkins = {};
    skinIds.forEach(id => {
      const skin = findSkinById(id);
      if (skin) selectedSkins[skin.id] = skin;
    });

    const playerNameEl = document.getElementById('playerName');
    const playerRankEl = document.getElementById('playerRank');
    if (playerNameEl) playerNameEl.value = ign;
    if (playerRankEl) playerRankEl.value = rank;
    if (rank) updateSelectedRankIcon(rank);

    renderSkins();
    updateLoadout();
    updatePreviewCard();
    updateSelectedTabBadge();

    if (btn) btn.textContent = 'Loaded!';
    setTimeout(() => { if (btn) btn.textContent = original; }, 1500);
  } catch (err) {
    alert('Load failed: ' + (err.message || 'Unknown error'));
    if (btn) btn.textContent = original;
  } finally {
    if (btn) btn.disabled = false;
  }
}

function findSkinById(id) {
  for (const weapon of WEAPON_ORDER) {
    const list = SKINS_DATA[weapon] || [];
    const found = list.find(s => s.id === id);
    if (found) return { ...found, weapon: found.weapon || weapon };
  }
  return null;
}

function recordDownloadEvent(skins, ign, rank) {
  const auth = window.AshuAuth;
  if (!auth || !auth.user || !auth.client) return;
  auth.client
    .from('download_events')
    .insert({
      user_id: auth.user.id,
      skin_count: skins.length,
      ign: ign || null,
      rank: rank || null
    })
    .then(({ error }) => {
      if (error) console.warn('Download log failed:', error.message);
    });
}

const FEEDBACK_COUNTS_STORAGE_KEY = 'ashuvalz.feedbackCounts';
const FEEDBACK_VOTED_STORAGE_KEY = 'ashuvalz.feedbackVoted';
let pendingExportEvent = null;
let feedbackVoteSubmitted = false;

function hasAlreadyVoted() {
  try { return Boolean(localStorage.getItem(FEEDBACK_VOTED_STORAGE_KEY)); }
  catch { return false; }
}

function markVoted(vote) {
  try { localStorage.setItem(FEEDBACK_VOTED_STORAGE_KEY, vote); } catch {}
  window.dispatchEvent(new CustomEvent('ashuvalz:vote-cast'));
}

function requestExport(e) {
  const skins = Object.values(selectedSkins);
  if (skins.length === 0) {
    alert('Select at least one skin before exporting!');
    return;
  }

  // One vote per browser. Returning users skip the gate and download directly.
  if (hasAlreadyVoted()) {
    exportCard(e);
    return;
  }

  pendingExportEvent = { currentTarget: e?.currentTarget || null };
  openFeedbackGate();
}

function initFeedbackGate() {
  const closeBtn = document.getElementById('feedbackGateClose');
  const backdrop = document.getElementById('feedbackGateBackdrop');
  const downloadBtn = document.getElementById('feedbackDownloadBtn');

  closeBtn?.addEventListener('click', closeFeedbackGate);
  backdrop?.addEventListener('click', closeFeedbackGate);

  document.querySelectorAll('[data-feedback-vote]').forEach(btn => {
    btn.addEventListener('click', () => handleFeedbackVote(btn.dataset.feedbackVote));
  });

  downloadBtn?.addEventListener('click', () => {
    if (!pendingExportEvent) return;
    const evt = pendingExportEvent;
    pendingExportEvent = null;
    closeFeedbackGate();
    exportCard(evt);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFeedbackGate();
  });
}

function openFeedbackGate() {
  const gate = document.getElementById('feedbackGate');
  if (!gate) return;

  gate.classList.remove('hidden');
  gate.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  feedbackVoteSubmitted = false;
  renderFeedbackCounts(false);
  resetFeedbackReaction();
}

async function fetchRemoteFeedbackTotals() {
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

function closeFeedbackGate() {
  const gate = document.getElementById('feedbackGate');
  if (!gate) return;

  gate.classList.add('hidden');
  gate.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  pendingExportEvent = null;
}

async function handleFeedbackVote(vote) {
  if (feedbackVoteSubmitted || !['up', 'down'].includes(vote)) return;

  feedbackVoteSubmitted = true;

  // Optimistic local bump so the UI feels instant even if the network is slow.
  const counts = getFeedbackCounts();
  counts[vote] += 1;
  saveFeedbackCounts(counts);

  // Server-side increment via the public RPC — works for anonymous users too.
  const auth = window.AshuAuth;
  if (auth && auth.client) {
    try {
      const { data, error } = await auth.client.rpc('cast_feedback_vote', { p_vote: vote });
      if (!error && data && data.length) {
        saveFeedbackCounts({
          up: Number(data[0].up_count) || 0,
          down: Number(data[0].down_count) || 0
        });
      }
    } catch (err) {
      console.warn('Vote save failed:', err);
    }
  }

  markVoted(vote);
  await renderFeedbackCounts(true);
  showFeedbackReaction(vote);
}

function getFeedbackCounts() {
  try {
    const saved = JSON.parse(localStorage.getItem(FEEDBACK_COUNTS_STORAGE_KEY) || '{}');
    return {
      up: Number(saved.up) || 0,
      down: Number(saved.down) || 0
    };
  } catch {
    return { up: 0, down: 0 };
  }
}

function saveFeedbackCounts(counts) {
  try {
    localStorage.setItem(FEEDBACK_COUNTS_STORAGE_KEY, JSON.stringify(counts));
  } catch {}
}

async function renderFeedbackCounts(reveal) {
  let counts = getFeedbackCounts();
  const remote = await fetchRemoteFeedbackTotals();
  if (remote) counts = remote;

  const upCount = document.getElementById('feedbackUpCount');
  const downCount = document.getElementById('feedbackDownCount');

  if (upCount) {
    upCount.textContent = counts.up;
    upCount.classList.toggle('hidden', !reveal);
  }
  if (downCount) {
    downCount.textContent = counts.down;
    downCount.classList.toggle('hidden', !reveal);
  }
}

function resetFeedbackReaction() {
  document.getElementById('feedbackReaction')?.classList.add('hidden');
  document.querySelectorAll('[data-feedback-vote]').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected');
  });
}

function showFeedbackReaction(vote) {
  const reaction = document.getElementById('feedbackReaction');
  const sticker = document.getElementById('feedbackSticker');
  const title = document.getElementById('feedbackReactionTitle');
  const message = document.getElementById('feedbackReactionMessage');

  document.querySelectorAll('[data-feedback-vote]').forEach(btn => {
    btn.disabled = true;
    btn.classList.toggle('selected', btn.dataset.feedbackVote === vote);
  });

  if (vote === 'up') {
    if (sticker) sticker.textContent = '🥰';
    if (title) title.textContent = 'Thank you!';
    if (message) message.textContent = 'Love from Ashu';
  } else {
    if (sticker) sticker.textContent = '💔';
    if (title) title.textContent = 'Aww, we will do better';
    if (message) message.textContent = 'Still love from Ashu';
  }

  reaction?.classList.remove('hidden');
  reaction?.classList.remove('up', 'down');
  reaction?.classList.add(vote);
}

function openRarityModal(weapon) {
  const modal = document.getElementById('rarityModal');
  const weaponIcon = document.getElementById('rarityWeaponIcon');
  const title = document.getElementById('rarityTitle');
  const rarityGrid = document.getElementById('rarityGrid');

  title.textContent = getWeaponLabel(weapon).toUpperCase();
  weaponIcon.src = WEAPON_ICONS[weapon] || '';
  weaponIcon.alt = `${getWeaponLabel(weapon)} icon`;

  rarityGrid.innerHTML = RARITY_OPTIONS.map(option => {
    const count = getWeaponSkins(weapon).filter(skin => skin.tier === option.tier).length;

    return `
      <button class="rarity-card" type="button" data-tier="${option.tier}" style="--rarity:${option.color}">
        <div class="rarity-card-icon-wrap">
          <img class="rarity-card-icon" src="${WEAPON_ICONS[weapon] || ''}" alt="${getWeaponLabel(weapon)}"/>
        </div>
        <div class="rarity-card-name">${option.label}</div>
        <div class="rarity-card-count">${count} skin${count !== 1 ? 's' : ''}</div>
      </button>
    `;
  }).join('');

  rarityGrid.querySelectorAll('.rarity-card').forEach(card => {
    card.addEventListener('click', () => selectWeaponRarity(weapon, card.dataset.tier));
  });

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function selectWeaponRarity(weapon, tier) {
  currentWeapon = weapon;
  currentTier = tier;
  syncActiveWeaponButton();
  syncActiveTierButton();
  updateCurrentWeaponLabel();
  renderSkins();
  closeRarityModal();
}

function closeRarityModal() {
  const modal = document.getElementById('rarityModal');
  modal?.classList.add('hidden');
  modal?.setAttribute('aria-hidden', 'true');
}

function openRankModal() {
  const modal = document.getElementById('rankModal');
  const rankGrid = document.getElementById('rankGrid');
  const rankDetail = document.getElementById('rankDetail');

  rankDetail.classList.add('hidden');
  rankDetail.innerHTML = '';
  rankGrid.innerHTML = RANK_OPTIONS.map(rank => `
    <button class="rank-card" type="button" data-rank="${rank}">
      <img class="rank-card-icon" src="${getRankIcon(rank)}" alt="${rank} rank"/>
      <span>${rank}</span>
    </button>
  `).join('');

  rankGrid.querySelectorAll('.rank-card').forEach(btn => {
    btn.addEventListener('click', () => chooseRankBase(btn.dataset.rank));
  });

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function chooseRankBase(rank) {
  selectedRankBase = rank;
  const rankDetail = document.getElementById('rankDetail');
  rankDetail.classList.remove('hidden');

  if (RANKS_WITH_DIVISIONS.has(rank)) {
    rankDetail.innerHTML = `
      <div class="rank-detail-title">${rank} Division</div>
      <div class="rank-choice-row">
        <button class="rank-choice" type="button" data-rank-value="${rank} 1">
          <img class="rank-choice-icon" src="${getRankIcon(rank, 1)}" alt="${rank} 1 rank"/>
          <span>1</span>
        </button>
        <button class="rank-choice" type="button" data-rank-value="${rank} 2">
          <img class="rank-choice-icon" src="${getRankIcon(rank, 2)}" alt="${rank} 2 rank"/>
          <span>2</span>
        </button>
        <button class="rank-choice" type="button" data-rank-value="${rank} 3">
          <img class="rank-choice-icon" src="${getRankIcon(rank, 3)}" alt="${rank} 3 rank"/>
          <span>3</span>
        </button>
      </div>
    `;
  } else if (RANKS_WITH_RR.has(rank)) {
    rankDetail.innerHTML = `
      <div class="rank-detail-title">Immortal / Radiant RR</div>
      <input class="rank-rr-input" id="rankRrInput" type="text" inputmode="numeric" maxlength="4" placeholder="Enter RR"/>
      <div class="rank-error hidden" id="rankRrError">Enter a number from 0 to 2000.</div>
      <button class="rank-confirm" id="rankRrConfirm" type="button">Use RR</button>
    `;

    const rrInput = document.getElementById('rankRrInput');
    rrInput.addEventListener('input', () => {
      rrInput.value = rrInput.value.replace(/\D/g, '');
    });
    rrInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyImmortalRadiantRr();
    });
    document.getElementById('rankRrConfirm').addEventListener('click', () => {
      applyImmortalRadiantRr();
    });
  }

  rankDetail.querySelectorAll('[data-rank-value]').forEach(btn => {
    btn.addEventListener('click', () => setRankValue(btn.dataset.rankValue));
  });
}

function setRankValue(value) {
  document.getElementById('playerRank').value = value;
  updateSelectedRankIcon(value);
  updatePreviewCard();
  closeRankModal();
}

function applyImmortalRadiantRr() {
  const rrInput = document.getElementById('rankRrInput');
  const error = document.getElementById('rankRrError');
  const rrText = rrInput?.value.trim() || '';
  const rr = Number(rrText);

  if (!rrText || !Number.isInteger(rr) || rr < 0 || rr > 2000) {
    error?.classList.remove('hidden');
    return;
  }

  error?.classList.add('hidden');
  setRankValue(getRankValueFromRr(rr));
}

function getRankValueFromRr(rr) {
  if (rr <= 100) return `Immortal 1 ${rr} RR`;
  if (rr <= 200) return `Immortal 2 ${rr} RR`;
  if (rr <= 300) return `Immortal 3 ${rr} RR`;
  return `Radiant ${rr} RR`;
}

function updateSelectedRankIcon(value) {
  const icon = document.getElementById('rankSelectedIcon');
  const iconUrl = getRankIconFromValue(value);

  if (!icon || !iconUrl) return;

  icon.src = iconUrl;
  icon.alt = `${value} rank`;
  icon.classList.remove('hidden');
}

function getRankBaseFromValue(value) {
  return RANK_OPTIONS.find(rank => String(value || '').startsWith(rank)) || '';
}

function getRankIcon(rank, division = 1) {
  const baseTier = RANK_ICON_TIERS[rank];
  if (!baseTier) return '';

  const tier = RANKS_WITH_DIVISIONS.has(rank) || rank === 'Immortal'
    ? baseTier + Math.max(0, Math.min(2, Number(division) - 1))
    : baseTier;

  return `${RANK_ICON_BASE}/${tier}/largeicon.png`;
}

function getRankIconFromValue(value) {
  const rank = getRankBaseFromValue(value);
  const divisionMatch = String(value || '').match(/\b([123])\b/);
  const division = divisionMatch ? Number(divisionMatch[1]) : 1;
  return rank ? getRankIcon(rank, division) : '';
}

function closeRankModal() {
  const modal = document.getElementById('rankModal');
  modal?.classList.add('hidden');
  modal?.setAttribute('aria-hidden', 'true');
}

function getWeaponSkins(weapon) {
  if (weapon === 'all') {
    return WEAPON_ORDER.flatMap(key => getWeaponSkins(key));
  }

  if (weapon === 'selected') {
    const skins = Object.values(selectedSkins).map(skin => ({
      ...skin,
      weapon: skin.weapon || ''
    }));
    return sortByWeaponOrder(skins);
  }

  return (SKINS_DATA[weapon] || []).map(skin => ({
    ...skin,
    weapon: skin.weapon || weapon
  }));
}

function getWeaponLabel(weapon) {
  const activeTab = document.querySelector(`.weapon-tab[data-weapon="${weapon}"]`);
  return activeTab?.dataset.label || activeTab?.textContent || weapon;
}

function syncActiveTierButton() {
  const tierSelect = document.getElementById('tierSelect');
  if (tierSelect) tierSelect.value = currentTier;
}

function syncActiveWeaponButton() {
  document.querySelectorAll('.weapon-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.weapon === currentWeapon);
  });
}

function updateCurrentWeaponLabel() {
  const tierText = currentTier === 'all' ? '' : `${TIER_LABELS[currentTier] || currentTier.toUpperCase()} `;
  const weaponText = currentWeapon === 'all' ? 'ALL'
    : currentWeapon === 'selected' ? 'YOUR SELECTED'
    : currentWeapon.toUpperCase();
  document.getElementById('currentWeaponLabel').textContent = `${weaponText} ${tierText}SKINS`;
}

function updateWeaponTabsForTier() {
  const container = document.getElementById('weaponTabs');
  if (!container) return;

  const tabs = Array.from(container.querySelectorAll('.weapon-tab'));
  const tabByWeapon = new Map(tabs.map(tab => [tab.dataset.weapon, tab]));

  // Remember which categories were already expanded so the rebuild
  // doesn't collapse the user's open section out from under them.
  const previouslyExpanded = new Set(
    Array.from(container.querySelectorAll('.weapon-category.expanded'))
      .map(el => el.dataset.category)
  );

  container.innerHTML = '';

  appendWeaponTab(container, tabByWeapon.get('all'));
  appendWeaponTab(container, tabByWeapon.get('selected'));

  WEAPON_CATEGORIES.forEach(category => {
    const group = document.createElement('div');
    group.className = 'weapon-category';
    group.dataset.category = category.title;

    // Auto-expand the category that contains the currently active weapon.
    const containsActive = category.weapons.includes(currentWeapon);
    if (containsActive || previouslyExpanded.has(category.title)) {
      group.classList.add('expanded');
    }

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'weapon-category-header';
    header.innerHTML = `
      <span class="weapon-category-name">${category.title}</span>
      <span class="weapon-category-chevron" aria-hidden="true">›</span>
    `;
    header.addEventListener('click', () => {
      group.classList.toggle('expanded');
    });
    group.appendChild(header);

    const list = document.createElement('div');
    list.className = 'weapon-category-list';
    category.weapons.forEach(weapon => {
      appendWeaponTab(list, tabByWeapon.get(weapon));
    });
    group.appendChild(list);

    container.appendChild(group);
  });
}

function updateCurrentWeaponForTier() {
  if (currentWeapon === 'all' || currentTier === 'all' || getWeaponTierCount(currentWeapon) > 0) return;

  const firstMatch = Array.from(document.querySelectorAll('.weapon-tab'))
    .find(tab => getWeaponTierCount(tab.dataset.weapon) > 0);

  if (firstMatch) currentWeapon = firstMatch.dataset.weapon;
}

function getWeaponTierCount(weapon) {
  const skins = getWeaponSkins(weapon);
  if (currentTier === 'all') return skins.length;
  return skins.filter(skin => skin.tier === currentTier).length;
}

function appendWeaponTab(container, tab) {
  if (!tab) return;

  const label = tab.dataset.label || tab.textContent.trim();
  const count = getWeaponTierCount(tab.dataset.weapon);
  tab.innerHTML = `
    <span class="weapon-tab-name">${label}</span>
    <span class="weapon-tab-count">${count}</span>
  `;
  tab.classList.toggle('is-empty', currentTier !== 'all' && count === 0);
  container.appendChild(tab);
}

function renderSkins() {
  const grid = document.getElementById('skinGrid');
  const skins = getWeaponSkins(currentWeapon);

  let filtered = skins;
  if (currentTier !== 'all') {
    filtered = filtered.filter(s => s.tier === currentTier);
  }
  if (searchQuery) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(searchQuery) ||
      s.bundle.toLowerCase().includes(searchQuery)
    );
  }

  document.getElementById('skinCount').textContent = `${filtered.length} skins found`;

  grid.innerHTML = '';
  if (filtered.length === 0) {
    const msg = currentWeapon === 'selected'
      ? 'No skins selected yet. Pick some from any weapon tab.'
      : 'No skins match your filters.';
    grid.innerHTML = `<div style="color:var(--grey);font-family:var(--font-mono);font-size:0.8rem;padding:40px 0;">${msg}</div>`;
    return;
  }

  filtered.forEach(skin => {
    const card = createSkinCard(skin);
    grid.appendChild(card);
  });
}

function createSkinCard(skin) {
  const card = document.createElement('div');
  card.className = 'skin-card' + (selectedSkins[skin.id] ? ' selected' : '');
  card.style.setProperty('--accent', skin.accent);

  const tierLabel = TIER_LABELS[skin.tier] || skin.tier.toUpperCase();
  const tierClass = `tier-${skin.tier}-badge`;

  const weaponIcon = WEAPON_ICONS[skin.weapon || currentWeapon] || '';

  let imageHTML = '';
  if (skin.img) {
    imageHTML = `
      <div class="skin-image-wrap">
        <img class="skin-img" src="${skin.img}" alt="${skin.name}"
          onerror="this.src='${weaponIcon}'; this.alt='${skin.weapon || currentWeapon} icon';"
          style="--accent:${skin.accent}"/>
      </div>`;
  } else {
    imageHTML = `
      <div class="skin-image-wrap">
        <div class="skin-placeholder">
          <img class="skin-placeholder-img" src="${weaponIcon}" alt="${skin.weapon || currentWeapon} icon"/>
          <div class="skin-placeholder-name">${skin.bundle}</div>
        </div>
      </div>`;
  }

  card.innerHTML = `
    ${imageHTML}
    <div class="skin-name">${cleanDisplayText(skin.name)}</div>
    <div class="skin-meta">
      <div class="skin-bundle">${cleanDisplayText(skin.bundle).toUpperCase()}</div>
      <div class="skin-tier-badge ${tierClass}">${tierLabel}</div>
    </div>
    <div class="skin-vp">${formatVp(getSkinVp(skin))} VP</div>
  `;

  card.addEventListener('click', () => toggleSkin(skin, card));
  return card;
}

function toggleSkin(skin, card) {
  if (selectedSkins[skin.id]) {
    delete selectedSkins[skin.id];
    card.classList.remove('selected');
  } else {
    selectedSkins[skin.id] = skin;
    card.classList.add('selected');
  }
  updateLoadout();
  updatePreviewCard();
  updateSelectedTabBadge();
  if (currentWeapon === 'selected') renderSkins();
}

function updateSelectedTabBadge() {
  const tab = document.querySelector('.weapon-tab[data-weapon="selected"]');
  if (!tab) return;
  const count = Object.keys(selectedSkins).length;
  tab.innerHTML = `<span class="weapon-tab-name">Selected</span><span class="weapon-tab-count">${count}</span>`;
  tab.classList.toggle('has-selected', count > 0);
}

function updateLoadout() {
  const container = document.getElementById('loadoutSummary');
  if (!container) return;
  const skins = Object.values(selectedSkins);

  if (skins.length === 0) {
    container.innerHTML = '<div class="loadout-empty">No skins selected yet.<br>Click a skin to add it.</div>';
    return;
  }

  container.innerHTML = skins.map(s => `
    <div class="loadout-item">
      <div>
        <div class="loadout-item-name">${s.name}</div>
        <div class="loadout-item-weapon">${cleanDisplayText(s.weapon || currentWeapon).toUpperCase()}</div>
      </div>
      <button class="loadout-remove" data-id="${s.id}" title="Remove">×</button>
    </div>
  `).join('');

  container.querySelectorAll('.loadout-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      delete selectedSkins[id];
      document.querySelectorAll('.skin-card.selected').forEach(c => {
        if (c.querySelector('.skin-name')?.textContent === selectedSkins[id]?.name) {
          c.classList.remove('selected');
        }
      });
      renderSkins();
      updateLoadout();
      updatePreviewCard();
    });
  });
}

function updatePreviewCard() {
  const skins = sortByWeaponOrder(Object.values(selectedSkins));
  const name = document.getElementById('playerName')?.value || 'YOUR IGN';
  const rank = document.getElementById('playerRank')?.value || 'Rank';

  document.getElementById('pcPlayer').textContent = name || 'YOUR IGN';
  document.getElementById('pcRank').textContent = rank || 'Rank';
  document.getElementById('pcCount').textContent = `${skins.length} skin${skins.length !== 1 ? 's' : ''}`;

  const pcSkins = document.getElementById('pcSkins');
  if (skins.length === 0) {
    pcSkins.innerHTML = '<div class="pc-empty">Select skins to preview your portfolio card</div>';
    return;
  }

  pcSkins.innerHTML = skins.map(s => `
    <div class="pc-skin-item">
      <div class="pc-skin-name">${cleanDisplayText(s.name)}</div>
      <div class="pc-skin-weapon">${cleanDisplayText(s.bundle)}</div>
    </div>
  `).join('');
}

async function exportCard(e) {
  const skins = Object.values(selectedSkins);
  const name = document.getElementById('playerName')?.value || 'AshuValz PLAYER';
  const rank = document.getElementById('playerRank')?.value || '';
  const format = e?.currentTarget?.dataset?.format || 'png';
  const btn = e?.currentTarget || document.getElementById('exportFullBtn') || document.getElementById('exportBtn');

  if (skins.length === 0) {
    alert('Select at least one skin before exporting!');
    return;
  }

  const originalText = btn?.textContent;
  if (btn) btn.textContent = 'Rendering...';

  try {
    const canvas = await createPortfolioImage(skins, name, rank, format);
    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const extension = format === 'jpg' ? 'jpg' : 'png';
    const quality = format === 'jpg' ? 0.92 : undefined;

    canvas.toBlob(blob => {
      if (!blob) {
        alert('Could not create the image. Try again with fewer skins.');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ashuvalz-${slugifyFilename(name)}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      recordDownloadEvent(skins, name, rank);

      if (btn) {
        btn.textContent = 'Downloaded!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1800);
      }
    }, mime, quality);
  } catch (err) {
    console.error(err);
    alert('Could not render the download image. Please try again.');
    if (btn) btn.textContent = originalText;
  }
}

async function createPortfolioImage(skins, name, rank, format) {
  const groupedSkins = groupSkinsByWeapon(skins);
  const cardWidth = 1080;
  const layout = getPhoneExportLayout(groupedSkins);
  const {
    columns,
    padding,
    gap,
    headerHeight,
    footerHeight,
    sectionHeaderHeight,
    sectionInnerGap,
    sectionPadding,
    sectionGap,
    tileHeight
  } = layout;
  const sectionWidth = cardWidth - padding * 2;
  const tileWidth = (sectionWidth - sectionPadding * 2 - gap * (columns - 1)) / columns;

  // Grow-to-fit: canvas height stretches to include every skin so nothing
  // is ever truncated. Floored at 720 so a 1-skin export isn't squashed.
  const groupedHeight = getGroupedExportHeight(
    groupedSkins, columns, tileHeight, gap, sectionHeaderHeight, sectionInnerGap, sectionPadding, sectionGap
  );
  const naturalHeight = padding + headerHeight + groupedHeight + footerHeight + padding;
  const cardHeight = Math.max(720, Math.round(naturalHeight));

  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = cardWidth * scale;
  canvas.height = cardHeight * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  drawExportBackground(ctx, cardWidth, cardHeight, format);

  const rankIconUrl = getRankIconFromValue(rank);
  const [rankIcon, images, weaponIcons] = await Promise.all([
    loadImage(rankIconUrl),
    Promise.all(skins.map(skin => loadImage(skin.img || WEAPON_ICONS[skin.weapon]))),
    Promise.all(groupedSkins.map(group => loadImage(WEAPON_ICONS[group.weapon])))
  ]);
  const imageById = new Map(skins.map((skin, index) => [skin.id, images[index]]));

  drawExportHeader(ctx, name, rank, rankIcon, skins, padding, cardWidth);
  let y = padding + headerHeight;

  groupedSkins.forEach((group, groupIndex) => {
    const groupHeight = getGroupExportHeight(group.skins.length, columns, tileHeight, gap, sectionHeaderHeight, sectionInnerGap, sectionPadding);

    drawWeaponGroupPanel(ctx, padding, y, sectionWidth, groupHeight);
    drawWeaponGroupHeader(ctx, group, weaponIcons[groupIndex], padding + sectionPadding, y + sectionPadding, sectionWidth - sectionPadding * 2, sectionHeaderHeight);
    const tileStartY = y + sectionPadding + sectionHeaderHeight + sectionInnerGap;

    group.skins.forEach((skin, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + sectionPadding + col * (tileWidth + gap);
      const tileY = tileStartY + row * (tileHeight + gap);
      drawSkinTile(ctx, skin, imageById.get(skin.id), x, tileY, tileWidth, tileHeight);
    });

    y += groupHeight + sectionGap;
  });

  drawExportFooter(ctx, cardWidth, cardHeight, padding);
  return canvas;
}

function drawExportBackground(ctx, width, height, format) {
  ctx.fillStyle = format === 'jpg' ? '#070A12' : '#070A12';
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(255, 70, 85, 0.22)');
  gradient.addColorStop(0.45, 'rgba(15, 25, 35, 0.94)');
  gradient.addColorStop(1, 'rgba(0, 200, 212, 0.16)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#FF4655';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);
}

function drawExportHeader(ctx, name, rank, rankIcon, skins, padding, width) {
  const total = skins.length;
  const totalVp = getTotalVp(skins);
  const displayName = (name && name.trim()) || 'AshuValz PLAYER';
  const displayRank = (rank && rank.trim()) || 'UNRANKED';

  const vpBoxWidth = 230;
  const vpBoxHeight = 86;
  const vpBoxX = width - padding - vpBoxWidth;
  const vpBoxY = padding + 34;

  // Brand
  ctx.fillStyle = '#FF4655';
  ctx.font = '700 42px Rajdhani, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('AshuValz', padding, padding + 42);

  // IGN — split off the #TAG so we can color it differently.
  const tagMatch = displayName.match(/^(.+?)(#\S+)\s*$/);
  const ignBase = tagMatch ? tagMatch[1].trim() : displayName;
  const ignTag = tagMatch ? tagMatch[2] : '';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 66px Rajdhani, Arial, sans-serif';
  const ignBaseWidth = ctx.measureText(ignBase).width;
  ctx.fillText(ignBase, padding, padding + 106);

  if (ignTag) {
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '600 38px Rajdhani, Arial, sans-serif';
    ctx.fillText(ignTag, padding + ignBaseWidth + 8, padding + 100);
  }

  // Rank pill — icon + rank label, sitting under the IGN.
  const pillY = padding + 134;
  const pillHeight = 64;
  const iconSize = 52;
  const pillPaddingX = 16;
  const labelGap = 14;

  ctx.font = '700 28px Rajdhani, Arial, sans-serif';
  const labelWidth = ctx.measureText(displayRank.toUpperCase()).width;
  const pillWidth = pillPaddingX + iconSize + labelGap + labelWidth + pillPaddingX;

  roundRect(ctx, padding, pillY, pillWidth, pillHeight, 14, 'rgba(255,70,85,0.12)', 'rgba(255,70,85,0.45)');

  if (rankIcon) {
    drawContainedImage(ctx, rankIcon, padding + pillPaddingX, pillY + (pillHeight - iconSize) / 2, iconSize, iconSize);
  } else {
    // Placeholder dot when no rank icon (Unranked).
    ctx.beginPath();
    ctx.arc(padding + pillPaddingX + iconSize / 2, pillY + pillHeight / 2, iconSize / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fill();
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 28px Rajdhani, Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayRank.toUpperCase(), padding + pillPaddingX + iconSize + labelGap, pillY + pillHeight / 2 + 1);
  ctx.textBaseline = 'alphabetic';

  // Skin count + VP summary line under the pill.
  ctx.fillStyle = '#A7B0BE';
  ctx.font = '500 22px Rajdhani, Arial, sans-serif';
  ctx.fillText(`${total} skin${total !== 1 ? 's' : ''} · ${formatVp(totalVp)} VP`, padding, pillY + pillHeight + 26);

  // VP box (right side, unchanged position).
  roundRect(ctx, vpBoxX, vpBoxY, vpBoxWidth, vpBoxHeight, 14, 'rgba(255,70,85,0.13)', 'rgba(255,70,85,0.55)');
  ctx.textAlign = 'center';
  ctx.fillStyle = '#A7B0BE';
  ctx.font = '700 15px monospace';
  ctx.fillText('TOTAL VP', vpBoxX + vpBoxWidth / 2, vpBoxY + 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 34px Rajdhani, Arial, sans-serif';
  ctx.fillText(formatVp(totalVp), vpBoxX + vpBoxWidth / 2, vpBoxY + 64);
  ctx.textAlign = 'left';

  // Divider under the whole header block.
  const dividerY = pillY + pillHeight + 50;
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, dividerY);
  ctx.lineTo(width - padding, dividerY);
  ctx.stroke();
}

function drawSkinTile(ctx, skin, image, x, y, width, height) {
  const accent = skin.accent || '#FF4655';
  const radius = Math.max(7, Math.min(14, height * 0.12));
  roundRect(ctx, x, y, width, height, radius, 'rgba(255,255,255,0.055)', 'rgba(255,255,255,0.12)');

  ctx.fillStyle = accent;
  ctx.fillRect(x, y, Math.max(3, width * 0.015), height);

  const imageBoxWidth = width * 0.44;
  const imageBoxHeight = height - Math.max(14, height * 0.18);
  if (image) {
    drawContainedImage(ctx, image, x + 10, y + 8, imageBoxWidth - 16, imageBoxHeight);
  }

  const textX = x + imageBoxWidth + 6;
  const textWidth = width - imageBoxWidth - 14;
  const nameFont = clamp(height * 0.17, 10, 22);
  const bundleFont = clamp(height * 0.115, 8, 15);
  const tierFont = clamp(height * 0.105, 7, 14);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${nameFont}px Rajdhani, Arial, sans-serif`;
  drawTruncatedText(ctx, cleanDisplayText(skin.name), textX, y + height * 0.33, textWidth);

  ctx.fillStyle = '#A7B0BE';
  ctx.font = `600 ${bundleFont}px Rajdhani, Arial, sans-serif`;
  drawTruncatedText(ctx, cleanDisplayText(skin.bundle), textX, y + height * 0.56, textWidth);

  ctx.fillStyle = accent;
  ctx.font = `700 ${tierFont}px monospace`;
  drawTruncatedText(ctx, `${TIER_LABELS[skin.tier] || skin.tier.toUpperCase()} · ${formatVp(getSkinVp(skin))} VP`, textX, y + height - height * 0.17, textWidth);
}

function drawWeaponGroupPanel(ctx, x, y, width, height) {
  roundRect(ctx, x, y, width, height, 18, 'rgba(0,0,0,0.18)', 'rgba(255,255,255,0.16)');
}

function drawWeaponGroupHeader(ctx, group, icon, x, y, width, height) {
  roundRect(ctx, x, y, width, height, Math.max(8, height * 0.18), 'rgba(255,70,85,0.10)', 'rgba(255,70,85,0.35)');

  const iconWidth = Math.min(104, width * 0.14);
  if (icon) {
    drawContainedImage(ctx, icon, x + 12, y + 6, iconWidth, height - 12);
  }

  const labelX = x + iconWidth + 28;
  const labelWidth = width - (labelX - x) - 12;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${clamp(height * 0.45, 15, 34)}px Rajdhani, Arial, sans-serif`;
  drawTruncatedText(ctx, `${getWeaponLabel(group.weapon).toUpperCase()} SKINS`, labelX, y + height * 0.48, labelWidth);

  ctx.fillStyle = '#A7B0BE';
  ctx.font = `700 ${clamp(height * 0.2, 9, 16)}px monospace`;
  drawTruncatedText(ctx, `${group.skins.length} skin${group.skins.length !== 1 ? 's' : ''} · ${formatVp(getTotalVp(group.skins))} VP`, labelX, y + height * 0.78, labelWidth);

  ctx.strokeStyle = '#FF4655';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + height + 4);
  ctx.lineTo(x + width, y + height + 4);
  ctx.stroke();
}

function drawOverflowNotice(ctx, hiddenSkins, x, y, width) {
  roundRect(ctx, x, y, width, 48, 12, 'rgba(255,70,85,0.14)', 'rgba(255,70,85,0.45)');
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 19px Rajdhani, Arial, sans-serif';
  ctx.fillText(`+${hiddenSkins} more skins not shown. Export fewer skins for a cleaner phone card.`, x + 18, y + 30);
}

function drawExportFooter(ctx, width, height, padding) {
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - 66);
  ctx.lineTo(width - padding, height - 66);
  ctx.stroke();

  ctx.fillStyle = '#A7B0BE';
  ctx.font = '700 18px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('Generated with AshuValz', width - padding, height - 30);
  ctx.textAlign = 'left';
}

function loadImage(src) {
  return new Promise(resolve => {
    if (!src) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawContainedImage(ctx, image, x, y, width, height) {
  const ratio = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawTruncatedText(ctx, text, x, y, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.fillText(text, x, y);
    return;
  }

  let output = text;
  while (output.length > 0 && ctx.measureText(`${output}...`).width > maxWidth) {
    output = output.slice(0, -1);
  }
  ctx.fillText(`${output}...`, x, y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function getExportColumnCount(count) {
  if (count > 240) return 6;
  if (count > 96) return 5;
  if (count > 36) return 4;
  if (count > 12) return 3;
  return 2;
}

function getPhoneExportLayout(groups) {
  const totalSkins = groups.reduce((total, group) => total + group.skins.length, 0);
  const availableHeight = 1920 - 34 - 150 - 56;
  const presets = [
    { columns: totalSkins > 12 ? 3 : 2, padding: 34, gap: 12, headerHeight: 260, footerHeight: 56, sectionHeaderHeight: 50, sectionInnerGap: 8, sectionPadding: 10, sectionGap: 10, tileHeight: 88 },
    { columns: 4, padding: 34, gap: 8, headerHeight: 260, footerHeight: 56, sectionHeaderHeight: 40, sectionInnerGap: 6, sectionPadding: 8, sectionGap: 8, tileHeight: 66 },
    { columns: 5, padding: 30, gap: 6, headerHeight: 260, footerHeight: 52, sectionHeaderHeight: 34, sectionInnerGap: 5, sectionPadding: 6, sectionGap: 6, tileHeight: 54 },
    { columns: 6, padding: 28, gap: 5, headerHeight: 260, footerHeight: 50, sectionHeaderHeight: 30, sectionInnerGap: 4, sectionPadding: 5, sectionGap: 5, tileHeight: 48 }
  ];

  return presets.find(preset => {
    const height = getGroupedExportHeight(
      groups,
      preset.columns,
      preset.tileHeight,
      preset.gap,
      preset.sectionHeaderHeight,
      preset.sectionInnerGap,
      preset.sectionPadding,
      preset.sectionGap
    );
    return height <= availableHeight;
  }) || presets[presets.length - 1];
}

function getGroupedExportHeight(groups, columns, tileHeight, gap, sectionHeaderHeight, sectionInnerGap, sectionPadding, sectionGap) {
  return groups.reduce((sum, group) => {
    return sum + getGroupExportHeight(group.skins.length, columns, tileHeight, gap, sectionHeaderHeight, sectionInnerGap, sectionPadding) + sectionGap;
  }, 0) - sectionGap;
}

function getGroupExportHeight(skinCount, columns, tileHeight, gap, sectionHeaderHeight, sectionInnerGap, sectionPadding) {
  const rows = Math.ceil(skinCount / columns);
  const tilesHeight = rows * tileHeight + Math.max(0, rows - 1) * gap;
  return sectionPadding * 2 + sectionHeaderHeight + sectionInnerGap + tilesHeight;
}

function groupSkinsByWeapon(skins) {
  const groups = new Map();

  skins.forEach(skin => {
    const weapon = skin.weapon || currentWeapon;
    if (!groups.has(weapon)) {
      groups.set(weapon, { weapon, skins: [] });
    }
    groups.get(weapon).skins.push(skin);
  });

  return Array.from(groups.values()).sort((a, b) => {
    return getWeaponSortIndex(a.weapon) - getWeaponSortIndex(b.weapon);
  });
}

function getWeaponSortIndex(weapon) {
  const index = WEAPON_ORDER.indexOf(weapon);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function getSkinVp(skin) {
  return VP_BY_TIER[skin.tier] ?? 0;
}

function getTotalVp(skins) {
  return skins.reduce((total, skin) => total + getSkinVp(skin), 0);
}

function formatVp(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function cleanDisplayText(value) {
  return String(value || '').replace(/\s*\/\/\s*/g, ' ').trim();
}

function slugifyFilename(value) {
  return String(value || 'player')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'player';
}

