import { signInEmail } from '../lib/supabase.js';
import { refreshUserCache, showToast, appHref } from '../utils.js';
import { checkRateLimit, recordAttempt, clearAttempts, RL } from '../lib/rateLimiter.js';

export function renderLogin() {
  return `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">LushaiTrips</div>
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-sub">Log in to manage your bookings and trips</p>



        <!-- ── Email / Password Form ── -->
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="login-email" placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="login-password" placeholder="••••••••" />
        </div>

        <div style="text-align:right;margin-bottom:20px">
          <a href="#" id="forgot-link" style="font-size:0.85rem;color:var(--emerald-400)">Forgot password?</a>
        </div>

        <button class="btn btn-primary w-full" id="login-btn" style="justify-content:center;padding:14px">
          <span id="login-label">Log In</span>
          <span id="login-spinner" style="display:none">⏳ Logging in…</span>
        </button>

        <div class="auth-switch mt-16">Don't have an account? <a href="${appHref('/signup-user')}" data-link>Sign up</a></div>
        <div class="auth-switch" style="margin-top:8px">Are you a host? <a href="${appHref('/host-signup-stay')}" data-link>Register your property →</a></div>
      </div>
    </div>
  `;
}

export function initLogin() {

  // ── Email / Password login ────────────────────────────────────
  const btn     = document.getElementById('login-btn');
  const label   = document.getElementById('login-label');
  const spinner = document.getElementById('login-spinner');

  const setLoading = (on) => {
    btn.disabled = on;
    label.style.display  = on ? 'none' : '';
    spinner.style.display = on ? '' : 'none';
  };

  btn?.addEventListener('click', async () => {
    const email    = document.getElementById('login-email')?.value?.trim();
    const password = document.getElementById('login-password')?.value;
    if (!email || !password) { showToast('Please fill all fields', '', 'error'); return; }

    // ── Rate limit check ──
    const rl = checkRateLimit(RL.LOGIN_EMAIL);
    if (!rl.allowed) { showToast('Too many attempts 🔒', rl.message, 'error'); return; }

    setLoading(true);
    try {
      await signInEmail({ email, password });
      clearAttempts(RL.LOGIN_EMAIL); // reset on success
      await refreshUserCache();
      showToast('Welcome back! 👋');
      setTimeout(() => window.router.navigate('/'), 500);
    } catch (e) {
      recordAttempt(RL.LOGIN_EMAIL); // count failed attempts only
      showToast(e.message || 'Login failed', '', 'error');
    } finally {
      setLoading(false);
    }
  });

  document.getElementById('login-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn?.click();
  });

  // ── Forgot password ───────────────────────────────────────────
  document.getElementById('forgot-link')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value?.trim();
    if (!email) { showToast('Enter your email above first', '', 'error'); return; }

    // ── Rate limit check ──
    const rl = checkRateLimit(RL.FORGOT_PASSWORD);
    if (!rl.allowed) { showToast('Too many attempts 🔒', rl.message, 'error'); return; }

    try {
      const { supabase } = await import('../lib/supabase.js');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + appHref('/'),
      });
      if (error) throw error;
      recordAttempt(RL.FORGOT_PASSWORD);
      showToast('Password reset email sent! ✉️', 'Check your inbox.');
    } catch (e) {
      recordAttempt(RL.FORGOT_PASSWORD);
      showToast(e.message || 'Failed to send reset email', '', 'error');
    }
  });
}
