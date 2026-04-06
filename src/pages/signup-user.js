import { sendPhoneOtp, verifyPhoneOtp, signInGoogle } from '../lib/supabase.js';
import { refreshUserCache, showToast, appHref } from '../utils.js';

export function renderSignupUser() {
  return `
    <div class="auth-page">
      <div class="auth-card" style="max-width:520px">
        <div class="auth-logo">LushaiTrips</div>
        <h2 class="auth-title">Create your account</h2>
        <p class="auth-sub">Join thousands exploring Mizoram's hidden gems</p>

        <button class="social-btn" id="google-signup-btn">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Sign up with Google
        </button>

        <div class="divider"><span>or sign up with phone</span></div>

        <!-- ── Step 1: Name + Phone ── -->
        <div id="su-step-1" class="otp-step">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="su-name" placeholder="Jane Doe" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="phone-input-wrap">
              <span class="phone-prefix">+91</span>
              <input type="tel" class="form-input phone-input-field" id="su-phone"
                placeholder="98765 43210" maxlength="10" inputmode="numeric" />
            </div>
            <p class="otp-hint">We'll send a 6-digit OTP to verify your number</p>
          </div>

          <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:14px;margin-bottom:20px;font-size:0.8rem;color:var(--text-muted)">
            By signing up, you agree to our <a href="#" style="color:var(--emerald-400)">Terms of Service</a> and <a href="#" style="color:var(--emerald-400)">Privacy Policy</a>.
          </div>

          <button class="btn btn-primary w-full" id="su-send-otp-btn" style="justify-content:center;padding:14px">
            <span id="su-send-label">Send OTP 📲</span>
            <span id="su-send-spinner" style="display:none">⏳ Sending…</span>
          </button>
        </div>

        <!-- ── Step 2: OTP verification ── -->
        <div id="su-step-2" class="otp-step" style="display:none">
          <p class="otp-sent-msg">OTP sent to <strong id="su-phone-display"></strong></p>
          <div class="form-group">
            <label class="form-label">Enter 6-digit OTP</label>
            <div class="otp-boxes" id="su-otp-boxes">
              <input class="otp-box" maxlength="1" inputmode="numeric" data-idx="0" />
              <input class="otp-box" maxlength="1" inputmode="numeric" data-idx="1" />
              <input class="otp-box" maxlength="1" inputmode="numeric" data-idx="2" />
              <input class="otp-box" maxlength="1" inputmode="numeric" data-idx="3" />
              <input class="otp-box" maxlength="1" inputmode="numeric" data-idx="4" />
              <input class="otp-box" maxlength="1" inputmode="numeric" data-idx="5" />
            </div>
          </div>
          <button class="btn btn-primary w-full" id="su-verify-btn" style="justify-content:center;padding:14px">
            <span id="su-verify-label">Create Account 🎉</span>
            <span id="su-verify-spinner" style="display:none">⏳ Verifying…</span>
          </button>
          <div class="otp-resend-row">
            <span id="su-resend-timer" class="otp-timer"></span>
            <button id="su-resend-btn" class="otp-resend-btn" style="display:none">Resend OTP</button>
            <button id="su-change-phone-btn" class="otp-change-btn">Change number</button>
          </div>
        </div>

        <div class="auth-switch mt-16">Already have an account? <a href="${appHref('/login')}" data-link>Log in</a></div>
        <div class="auth-switch" style="margin-top:8px">Want to host? <a href="${appHref('/host-signup-stay')}" data-link>Register as Host →</a></div>
      </div>
    </div>
  `;
}

export function initSignupUser() {
  // ── Google OAuth ───────────────────────────────────────────────
  document.getElementById('google-signup-btn')?.addEventListener('click', async () => {
    try { await signInGoogle(); }
    catch (e) { showToast(e.message || 'Google sign up failed', '', 'error'); }
  });

  // ── Shared state ──────────────────────────────────────────────
  let activePhone = '';
  let activeName  = '';
  let resendInterval = null;

  // ── Step 1: send OTP ──────────────────────────────────────────
  const sendBtn     = document.getElementById('su-send-otp-btn');
  const sendLabel   = document.getElementById('su-send-label');
  const sendSpinner = document.getElementById('su-send-spinner');

  const setSendLoading = (on) => {
    sendBtn.disabled = on;
    sendLabel.style.display  = on ? 'none' : '';
    sendSpinner.style.display = on ? '' : 'none';
  };

  sendBtn?.addEventListener('click', async () => {
    activeName = document.getElementById('su-name')?.value?.trim();
    const raw  = document.getElementById('su-phone')?.value?.replace(/\D/g, '');
    if (!activeName) { showToast('Please enter your full name', '', 'error'); return; }
    if (!raw || raw.length < 10) { showToast('Enter a valid 10-digit number', '', 'error'); return; }
    activePhone = '+91' + raw;
    setSendLoading(true);
    try {
      await sendPhoneOtp(activePhone);
      showToast('OTP sent! 📲', 'Check your messages.');
      goToStep2();
    } catch (e) {
      showToast(e.message || 'Failed to send OTP', '', 'error');
    } finally {
      setSendLoading(false);
    }
  });

  // ── Step 2 helpers ─────────────────────────────────────────────
  function goToStep2() {
    document.getElementById('su-step-1').style.display = 'none';
    const step2 = document.getElementById('su-step-2');
    step2.style.display = '';
    step2.classList.add('otp-step-enter');
    setTimeout(() => step2.classList.remove('otp-step-enter'), 400);
    document.getElementById('su-phone-display').textContent = activePhone;
    focusOtpBox(0);
    startResendTimer();
  }

  function goToStep1() {
    document.getElementById('su-step-2').style.display = 'none';
    document.getElementById('su-step-1').style.display = '';
    clearInterval(resendInterval);
    clearOtpBoxes();
  }

  document.getElementById('su-change-phone-btn')?.addEventListener('click', goToStep1);

  // ── OTP box navigation ─────────────────────────────────────────
  const boxes = document.querySelectorAll('#su-otp-boxes .otp-box');

  boxes.forEach((box, i) => {
    box.addEventListener('input', () => {
      box.value = box.value.replace(/\D/g, '').slice(-1);
      if (box.value && i < 5) focusOtpBox(i + 1);
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && i > 0) focusOtpBox(i - 1);
    });
    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      [...paste].slice(0, 6).forEach((ch, j) => { if (boxes[j]) boxes[j].value = ch; });
      focusOtpBox(Math.min(paste.length, 5));
    });
  });

  function focusOtpBox(idx) { boxes[idx]?.focus(); }
  function clearOtpBoxes()  { boxes.forEach(b => b.value = ''); }
  function getOtpValue()    { return [...boxes].map(b => b.value).join(''); }

  // ── Verify OTP ─────────────────────────────────────────────────
  const verifyBtn     = document.getElementById('su-verify-btn');
  const verifyLabel   = document.getElementById('su-verify-label');
  const verifySpinner = document.getElementById('su-verify-spinner');

  const setVerifyLoading = (on) => {
    verifyBtn.disabled = on;
    verifyLabel.style.display  = on ? 'none' : '';
    verifySpinner.style.display = on ? '' : 'none';
  };

  verifyBtn?.addEventListener('click', async () => {
    const token = getOtpValue();
    if (token.length < 6) { showToast('Enter the full 6-digit OTP', '', 'error'); return; }
    setVerifyLoading(true);
    try {
      await verifyPhoneOtp(activePhone, token, { full_name: activeName });
      await refreshUserCache();
      showToast('Account created! Welcome 🎉', 'You are now logged in.');
      clearInterval(resendInterval);
      setTimeout(() => window.router.navigate('/discover'), 800);
    } catch (e) {
      showToast(e.message || 'Invalid OTP', '', 'error');
      clearOtpBoxes();
      focusOtpBox(0);
    } finally {
      setVerifyLoading(false);
    }
  });

  // ── Resend timer ───────────────────────────────────────────────
  function startResendTimer() {
    const timerEl  = document.getElementById('su-resend-timer');
    const resendEl = document.getElementById('su-resend-btn');
    let seconds = 60;
    resendEl.style.display = 'none';
    timerEl.textContent = `Resend in 0:${String(seconds).padStart(2, '0')}`;
    clearInterval(resendInterval);
    resendInterval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(resendInterval);
        timerEl.textContent = '';
        resendEl.style.display = '';
      } else {
        timerEl.textContent = `Resend in 0:${String(seconds).padStart(2, '0')}`;
      }
    }, 1000);
  }

  document.getElementById('su-resend-btn')?.addEventListener('click', async () => {
    if (!activePhone) return;
    try {
      await sendPhoneOtp(activePhone);
      showToast('OTP resent! 📲');
      clearOtpBoxes();
      focusOtpBox(0);
      startResendTimer();
      document.getElementById('su-resend-btn').style.display = 'none';
    } catch (e) {
      showToast(e.message || 'Failed to resend OTP', '', 'error');
    }
  });
}
