import { getLastBooking, appHref } from '../utils.js';

export function renderBookingConfirmed() {
  const H = appHref;
  const b = getLastBooking();
  return `
    <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;padding:120px 24px 60px">
      <div style="max-width:600px;width:100%;text-align:center">
        <div style="font-size:5rem;margin-bottom:16px;animation:float 2s ease-in-out infinite">✅</div>
        <h1 style="font-size:2.5rem;margin-bottom:12px;background:linear-gradient(135deg,var(--emerald-400),var(--amber-400));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Booking Confirmed!</h1>
        <p style="font-size:1.1rem;color:var(--text-muted);margin-bottom:32px">Your Mizoram adventure is locked in. Get ready for an unforgettable experience. 🌄</p>

        ${b ? `
          <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-xl);padding:32px;margin-bottom:32px;text-align:left">
            <div style="font-size:0.75rem;font-weight:700;color:var(--emerald-400);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:16px">Booking Details</div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Booking ID</span><strong style="color:var(--emerald-400)">${b.id}</strong></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Property</span><strong>${b.listingName}</strong></div>
            ${b.checkin ? `<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Check-in</span><strong>${new Date(b.checkin+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'long'})}</strong></div>` : ''}
            ${b.checkout ? `<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Check-out</span><strong>${new Date(b.checkout+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'long'})}</strong></div>` : ''}
            ${b.guests ? `<div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem"><span style="color:var(--text-muted)">Guests</span><strong>${b.guests}</strong></div>` : ''}
            <div style="height:1px;background:var(--glass-border);margin:16px 0"></div>
            <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:800"><span>Total Paid</span><span style="color:var(--emerald-400)">₹${b.total?.toLocaleString()}</span></div>
          </div>
        ` : ''}

        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius);padding:20px;margin-bottom:32px;text-align:left">
          <div style="font-weight:700;margin-bottom:12px">📋 What happens next?</div>
          ${[
            '📧 Confirmation sent to your email',
            '📞 Host will contact you within 24 hours',
            '🗺️ Your itinerary is ready in My Bookings',
            '⭐ After your stay, leave a review to help others'
          ].map(s => `<div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:8px">${s}</div>`).join('')}
        </div>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="${H('/profile')}" class="btn btn-primary btn-lg" data-link>View My Bookings</a>
          <a href="${H('/discover')}" class="btn btn-secondary btn-lg" data-link>Explore More</a>
        </div>
      </div>
    </div>
  `;
}

export function initBookingConfirmed() {}
