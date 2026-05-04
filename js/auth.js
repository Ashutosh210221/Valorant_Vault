/* ============================================================
   AshuValz Auth — wires Supabase login/register/logout into the
   site. Loads gracefully if Supabase isn't configured yet.
   Exposes a global `window.AshuAuth` used by builder.js.
   ============================================================ */
(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const isConfigured = Boolean(
    cfg.url && cfg.anonKey && window.supabase && window.supabase.createClient
  );

  let client = null;
  let currentUser = null;
  const listeners = new Set();

  if (isConfigured) {
    try {
      client = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
    } catch (err) {
      console.warn('Supabase init failed:', err);
    }
  }

  const Auth = {
    isConfigured,
    get client() { return client; },
    get user() { return currentUser; },
    onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); },
    async login(email, password) {
      if (!client) throw new Error('Backend not configured.');
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    },
    async register(email, password, displayName) {
      if (!client) throw new Error('Backend not configured.');
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName || '' } }
      });
      if (error) throw error;
      return data.user;
    },
    async logout() {
      if (!client) return;
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
  };

  function emit() {
    listeners.forEach(fn => { try { fn(currentUser); } catch (e) { console.warn(e); } });
  }

  if (client) {
    client.auth.getSession().then(({ data }) => {
      currentUser = data?.session?.user || null;
      updateNavBtn();
      emit();
    });
    client.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      updateNavBtn();
      emit();
    });
  }

  function setError(msg) {
    const errEl = document.getElementById('authError');
    if (!errEl) return;
    errEl.textContent = msg || '';
    errEl.classList.toggle('hidden', !msg);
  }

  function setMode(mode) {
    const tabLogin = document.getElementById('authTabLogin');
    const tabRegister = document.getElementById('authTabRegister');
    const formLogin = document.getElementById('authFormLogin');
    const formRegister = document.getElementById('authFormRegister');
    if (!tabLogin || !tabRegister || !formLogin || !formRegister) return;
    tabLogin.classList.toggle('active', mode === 'login');
    tabRegister.classList.toggle('active', mode === 'register');
    formLogin.classList.toggle('hidden', mode !== 'login');
    formRegister.classList.toggle('hidden', mode !== 'register');
    setError('');
  }

  function openAuthModal() {
    if (currentUser) { showAccount(); return; }
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setMode('login');
    if (!isConfigured) {
      setError('Backend not connected yet. Ask the site owner to configure Supabase.');
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showAccount() {
    if (!currentUser) return;
    const name = currentUser.user_metadata?.display_name
      || currentUser.email?.split('@')[0]
      || 'Account';
    if (confirm(`Logged in as ${name} (${currentUser.email})\n\nLog out?`)) {
      Auth.logout().catch(err => alert(err.message || 'Logout failed.'));
    }
  }

  function updateNavBtn() {
    const btn = document.getElementById('navAccount');
    if (!btn) return;
    if (currentUser) {
      const name = currentUser.user_metadata?.display_name
        || currentUser.email?.split('@')[0]
        || 'Account';
      btn.textContent = 'Hi, ' + name;
      btn.dataset.state = 'in';
    } else {
      btn.textContent = 'Login';
      btn.dataset.state = 'out';
    }
  }

  function bindAuthModal() {
    const modal = document.getElementById('authModal');
    const navBtn = document.getElementById('navAccount');
    if (navBtn) navBtn.addEventListener('click', openAuthModal);
    if (!modal) return;

    document.getElementById('authClose')?.addEventListener('click', closeAuthModal);
    document.getElementById('authBackdrop')?.addEventListener('click', closeAuthModal);
    document.getElementById('authTabLogin')?.addEventListener('click', () => setMode('login'));
    document.getElementById('authTabRegister')?.addEventListener('click', () => setMode('register'));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeAuthModal();
    });

    const formLogin = document.getElementById('authFormLogin');
    formLogin?.addEventListener('submit', async (e) => {
      e.preventDefault();
      setError('');
      if (!isConfigured) { setError('Backend not connected yet.'); return; }
      const email = formLogin.querySelector('[name=email]').value.trim();
      const password = formLogin.querySelector('[name=password]').value;
      const submitBtn = formLogin.querySelector('button[type=submit]');
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Logging in...';
      try {
        await Auth.login(email, password);
        closeAuthModal();
      } catch (err) {
        setError(err.message || 'Login failed.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });

    const formRegister = document.getElementById('authFormRegister');
    formRegister?.addEventListener('submit', async (e) => {
      e.preventDefault();
      setError('');
      if (!isConfigured) { setError('Backend not connected yet.'); return; }
      const name = formRegister.querySelector('[name=name]').value.trim();
      const email = formRegister.querySelector('[name=email]').value.trim();
      const password = formRegister.querySelector('[name=password]').value;
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      const submitBtn = formRegister.querySelector('button[type=submit]');
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating account...';
      try {
        await Auth.register(email, password, name);
        setError('');
        alert('Account created! Check your email if confirmation is required, then log in.');
        setMode('login');
      } catch (err) {
        setError(err.message || 'Sign up failed.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  function init() {
    bindAuthModal();
    updateNavBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AshuAuth = Auth;
})();
