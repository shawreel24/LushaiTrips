import { signUpEmail } from '../lib/supabase.js';
import { refreshUserCache, showToast, appHref } from '../utils.js';
import { checkRateLimit, recordAttempt, clearAttempts, RL } from '../lib/rateLimiter.js';

export function renderSignupUser() {
  return `
    <div class="auth-page">
      <div class="auth-card" style="max-width:520px">
        <div class="auth-logo">LushaiTrips</div>
        <h2 class="auth-title">Create your account</h2>
        <p class="auth-sub">Join thousands exploring Mizoram's hidden gems</p>



        <!-- ── Email / Password Form ── -->
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="su-name" placeholder="Jane Doe" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-input" id="su-phone" placeholder="+91 98765 43210" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="su-email" placeholder="you@example.com" />
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" id="su-password" placeholder="Min 8 characters" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" class="form-input" id="su-confirm" placeholder="Repeat password" />
          </div>
        </div>

        <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:14px;margin-bottom:20px;font-size:0.8rem;color:var(--text-muted)">
          By signing up, you agree to our <a href="#" style="color:var(--emerald-400)">Terms of Service</a> and <a href="#" style="color:var(--emerald-400)">Privacy Policy</a>.
        </div>

        <button class="btn btn-primary w-full" id="signup-btn" style="justify-content:center;padding:14px">
          <span id="signup-label">Create Account 🎉</span>
          <span id="signup-spinner" style="display:none">⏳ Creating account…</span>
        </button>
        <div class="auth-switch mt-16">Already have an account? <a href="${appHref('/login')}" data-link>Log in</a></div>
        <div class="auth-switch" style="margin-top:8px">Want to host? <a href="${appHref('/host-signup-stay')}" data-link>Register as Host →</a></div>
      </div>
    </div>
  `;
}

export function initSignupUser() {

  // ── Email / Password signup ────────────────────────────────────
  const btn     = document.getElementById('signup-btn');
  const label   = document.getElementById('signup-label');
  const spinner = document.getElementById('signup-spinner');

  const setLoading = (on) => {
    btn.disabled = on;
    label.style.display  = on ? 'none' : '';
    spinner.style.display = on ? '' : 'none';
  };

  btn?.addEventListener('click', async () => {
    const fullName = document.getElementById('su-name')?.value?.trim();
    const email    = document.getElementById('su-email')?.value?.trim();
    const phone    = document.getElementById('su-phone')?.value?.trim();
    const password = document.getElementById('su-password')?.value;
    const confirm  = document.getElementById('su-confirm')?.value;

    if (!fullName || !email || !phone || !password) { showToast('Please fill all fields', '', 'error'); return; }
    if (password !== confirm) { showToast('Passwords do not match', '', 'error'); return; }
    if (password.length < 8)  { showToast('Password must be at least 8 characters', '', 'error'); return; }

    // ── Rate limit check ──
    const rl = checkRateLimit(RL.SIGNUP_EMAIL);
    if (!rl.allowed) { showToast('Too many attempts 🔒', rl.message, 'error'); return; }

    setLoading(true);
    try {
      await signUpEmail({ email, password, fullName, phone });
      clearAttempts(RL.SIGNUP_EMAIL);
      await refreshUserCache();
      showToast('Account created! Welcome 🎉', 'Check your email to confirm your account.');
      setTimeout(() => window.router.navigate('/discover'), 800);
    } catch (e) {
      recordAttempt(RL.SIGNUP_EMAIL);
      showToast(e.message || 'Sign up failed', '', 'error');
    } finally {
      setLoading(false);
    }
  });
}
