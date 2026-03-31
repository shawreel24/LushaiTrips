export function renderFooter() {
  const container = document.getElementById('footer-container');
  container.innerHTML = `
    <footer id="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">LushaiTrips</div>
            <p style="font-size:0.9rem;color:var(--text-dim);max-width:280px;margin-bottom:20px">Discover, plan, and randomly explore Mizoram's hidden gems. The Northeast's most exciting travel platform.</p>
            <div style="display:flex;gap:12px">
              <a href="#" style="width:38px;height:38px;background:var(--glass);border:1px solid var(--glass-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:var(--transition)" onmouseover="this.style.background='var(--emerald-800)'" onmouseout="this.style.background='var(--glass)'">📘</a>
              <a href="#" style="width:38px;height:38px;background:var(--glass);border:1px solid var(--glass-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:var(--transition)" onmouseover="this.style.background='var(--emerald-800)'" onmouseout="this.style.background='var(--glass)'">📸</a>
              <a href="#" style="width:38px;height:38px;background:var(--glass);border:1px solid var(--glass-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:var(--transition)" onmouseover="this.style.background='var(--emerald-800)'" onmouseout="this.style.background='var(--glass)'">🐦</a>
            </div>
          </div>
          <div>
            <div class="footer-heading">Explore</div>
            <a href="/discover" class="footer-link" data-link>All Destinations</a>
            <a href="/stays" class="footer-link" data-link>Homestays & Hotels</a>
            <a href="/guides" class="footer-link" data-link>Local Guides</a>
            <a href="/transport" class="footer-link" data-link>Transport</a>
            <a href="/surprise" class="footer-link" data-link>🎲 Surprise Me</a>
          </div>
          <div>
            <div class="footer-heading">Host</div>
            <a href="/host-signup-stay" class="footer-link" data-link>List Your Stay</a>
            <a href="/host-signup-guide" class="footer-link" data-link>Register as Guide</a>
            <a href="/host-signup-transport" class="footer-link" data-link>List Transport</a>
            <a href="/host-dashboard" class="footer-link" data-link>Host Dashboard</a>
          </div>
          <div>
            <div class="footer-heading">Company</div>
            <a href="#" class="footer-link">About Mizoram</a>
            <a href="#" class="footer-link">Travel Tips</a>
            <a href="#" class="footer-link">Safety Guide</a>
            <a href="#" class="footer-link">Contact Us</a>
            <a href="#" class="footer-link">Privacy Policy</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 LushaiTrips. Made with 💚 in Mizoram, India. | Payments secured by <strong>Razorpay</strong> | Maps by <strong>Leaflet</strong></p>
        </div>
      </div>
    </footer>
  `;
}
