/**
 * ── Client-Side Rate Limiter ─────────────────────────────────────────────────
 * Stores attempt timestamps in localStorage under a namespaced key.
 * Limits each action to MAX_ATTEMPTS within WINDOW_MS milliseconds.
 *
 * Usage:
 *   import { checkRateLimit, recordAttempt, getRemainingTime } from './rateLimiter.js';
 *
 *   const result = checkRateLimit('login_email');
 *   if (!result.allowed) { showToast(result.message, '', 'error'); return; }
 *   // ... perform action ...
 *   recordAttempt('login_email');
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY  = 'lt_rl_'; // LushaiTrips Rate Limit prefix

/**
 * Returns the array of attempt timestamps for a given action key,
 * pruned to only those within the current window.
 * @param {string} action
 * @returns {number[]}
 */
function getAttempts(action) {
  try {
    const raw   = localStorage.getItem(STORAGE_KEY + action);
    const all   = raw ? JSON.parse(raw) : [];
    const now   = Date.now();
    // Keep only timestamps within the rolling 15-min window
    return all.filter(ts => now - ts < WINDOW_MS);
  } catch {
    return [];
  }
}

/**
 * Persists the pruned attempt list back to localStorage.
 * @param {string} action
 * @param {number[]} attempts
 */
function saveAttempts(action, attempts) {
  try {
    localStorage.setItem(STORAGE_KEY + action, JSON.stringify(attempts));
  } catch { /* quota exceeded — silently ignore */ }
}

/**
 * Records a new attempt for the given action.
 * Call this AFTER a real auth request fires (success or failure).
 * @param {string} action  e.g. 'login_email', 'login_otp_send', 'signup_email'
 */
export function recordAttempt(action) {
  const attempts = getAttempts(action);
  attempts.push(Date.now());
  saveAttempts(action, attempts);
}

/**
 * Returns how many seconds remain until the oldest attempt leaves the window.
 * @param {string} action
 * @returns {number} seconds remaining (0 if not limited)
 */
export function getRemainingTime(action) {
  const attempts = getAttempts(action);
  if (attempts.length < MAX_ATTEMPTS) return 0;
  const oldestInWindow = Math.min(...attempts);
  const msTillExpiry   = WINDOW_MS - (Date.now() - oldestInWindow);
  return Math.max(0, Math.ceil(msTillExpiry / 1000));
}

/**
 * Checks whether a new attempt is allowed for the given action.
 * Returns { allowed: true } or { allowed: false, message: string, secondsLeft: number }.
 * Does NOT record an attempt — call recordAttempt() separately.
 *
 * @param {string} action
 * @returns {{ allowed: boolean, message?: string, secondsLeft?: number }}
 */
export function checkRateLimit(action) {
  const attempts = getAttempts(action);
  if (attempts.length < MAX_ATTEMPTS) {
    return { allowed: true };
  }

  const secondsLeft = getRemainingTime(action);
  const mins = Math.ceil(secondsLeft / 60);
  const message =
    `Too many attempts. Please wait ${mins} minute${mins !== 1 ? 's' : ''} before trying again.`;

  return { allowed: false, message, secondsLeft };
}

/**
 * Clears all recorded attempts for a given action (e.g. after successful login).
 * @param {string} action
 */
export function clearAttempts(action) {
  try {
    localStorage.removeItem(STORAGE_KEY + action);
  } catch { /* ignore */ }
}

// ── Action key constants — import these to avoid typos ───────────────────────
export const RL = {
  LOGIN_EMAIL:     'login_email',
  LOGIN_OTP_SEND:  'login_otp_send',
  LOGIN_OTP_VERIFY:'login_otp_verify',
  FORGOT_PASSWORD: 'forgot_password',
  SIGNUP_EMAIL:    'signup_email',
  SIGNUP_OTP_SEND: 'signup_otp_send',
};
