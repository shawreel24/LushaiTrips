import { getCurrentUser, storage, showToast } from '../utils.js';

export function renderHostDashboard() {
  const user = getCurrentUser();
  if (!user) return `<div class="page-hero container"><h1>Please <a href="/login" data-link style="color:var(--emerald-400)">log in</a></h1></div>`;
  if (user.role !== 'host') return `<div class="page-hero container"><h1>Host access only. <a href="/host-signup-stay" data-link style="color:var(--emerald-400)">Become a Host →</a></h1></div>`;

  const listings = (storage.get('lt_listings') || []).filter(l => l.hostId === user.id);
  const bookings = (storage.get('lt_bookings') || []).filter(b => listings.some(l => l.id === b.listingId));
  const totalEarnings = bookings.reduce((s, b) => s + (b.total || 0) * 0.9, 0);

  return `
    <section class="page-hero" style="padding-bottom:40px">
      <div class="container">
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--emerald-500),var(--emerald-800));display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800">${user.avatar}</div>
          <div>
            <h1 style="font-size:clamp(1.5rem,3vw,2rem);margin-bottom:4px">Host Dashboard</h1>
            <div style="color:var(--text-muted)">Welcome back, ${user.name} · <span class="${user.status === 'pending' ? 'badge badge-pending' : 'badge badge-approved'}">${user.status === 'pending' ? '⏳ Pending Approval' : '✅ Active Host'}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section style="padding-bottom:80px">
      <div class="container">
        ${user.status === 'pending' ? `
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:24px;margin-bottom:32px">
            <div style="font-weight:700;font-size:1.1rem;margin-bottom:8px">⏳ Your listing is under review</div>
            <div style="color:var(--text-muted);font-size:0.9rem">Our team reviews new listings within 24–48 hours. You'll receive an email once approved. In the meantime, you can preview your listing below.</div>
          </div>
        ` : ''}

        <!-- Stats -->
        <div class="grid-4" style="margin-bottom:40px">
          ${[
            { icon:'🏠', label:'Active Listings', value: listings.length },
            { icon:'📅', label:'Total Bookings', value: bookings.length },
            { icon:'💰', label:'Total Earnings', value: `₹${Math.round(totalEarnings).toLocaleString()}` },
            { icon:'⭐', label:'Avg Rating', value: '4.8' },
          ].map(s => `
            <div class="card card-body text-center">
              <div style="font-size:2rem;margin-bottom:8px">${s.icon}</div>
              <div style="font-family:var(--font-head);font-size:1.8rem;font-weight:800;color:var(--text);margin-bottom:4px">${s.value}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <div class="tabs" id="host-tabs">
          <button class="tab-btn active" data-tab="listings">🏠 Listings</button>
          <button class="tab-btn" data-tab="bookings">📅 Bookings</button>
          <button class="tab-btn" data-tab="add">+ Add New</button>
        </div>

        <!-- Listings tab -->
        <div id="tab-listings">
          ${listings.length ? listings.map(l => `
            <div class="card card-body" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
              <div style="flex:1;min-width:200px">
                <div style="font-weight:700;margin-bottom:4px">${l.name || l.listing?.name || 'Unnamed Listing'}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">📍 ${l.district || l.listing?.location || '—'}</div>
                <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Price: ₹${l.price || l.listing?.price || '—'}/night</div>
              </div>
              <span class="${l.status === 'pending' ? 'badge badge-pending' : 'badge badge-approved'}">${l.status === 'pending' ? '⏳ Under Review' : '✅ Live'}</span>
            </div>
          `).join('') : `
            <div style="text-align:center;padding:60px;color:var(--text-muted)">
              <div style="font-size:4rem;margin-bottom:16px">🏠</div>
              <h3 style="margin-bottom:12px">No listings yet</h3>
              <p style="margin-bottom:24px">Add your first property, guide service, or transport below.</p>
            </div>
          `}
        </div>

        <!-- Bookings tab -->
        <div id="tab-bookings" class="hidden">
          ${bookings.length ? bookings.map(b => `
            <div class="card card-body" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
              <div style="flex:1">
                <div style="font-weight:700;margin-bottom:4px">${b.listingName}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">👤 ${b.guestName} · 📞 ${b.guestPhone}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">📅 ${b.checkin || 'N/A'} → ${b.checkout || 'N/A'} · 👥 ${b.guests || '—'} guests</div>
                <div style="font-size:0.75rem;color:var(--text-dim);margin-top:4px">Ref: ${b.id}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;color:var(--emerald-400)">₹${Math.round((b.total||0)*0.9).toLocaleString()} <span style="font-size:0.75rem;color:var(--text-dim)">(your share)</span></div>
                <span class="badge badge-approved">✅ Confirmed</span>
              </div>
            </div>
          `).join('') : `
            <div style="text-align:center;padding:60px;color:var(--text-muted)">
              <div style="font-size:4rem;margin-bottom:16px">📅</div>
              <h3 style="margin-bottom:12px">No bookings yet</h3>
              <p>Bookings will appear here once guests book your listing.</p>
            </div>
          `}
        </div>

        <!-- Add listing tab -->
        <div id="tab-add" class="hidden">
          <div class="grid-3">
            ${[
              { icon:'🏡', title:'Add Stay', desc:'List a homestay, hotel, lodge, or camping site', href:'/host-signup-stay' },
              { icon:'🧭', title:'Register as Guide', desc:'Offer trekking, wildlife, or cultural tour services', href:'/host-signup-guide' },
              { icon:'🚗', title:'List Transport', desc:'Cars, bikes, SUVs, shared Sumo or vans', href:'/host-signup-transport' },
            ].map(item => `
              <a href="${item.href}" class="card card-body text-center" data-link style="cursor:pointer">
                <div style="font-size:3rem;margin-bottom:16px">${item.icon}</div>
                <h4 style="margin-bottom:8px">${item.title}</h4>
                <p style="font-size:0.9rem;margin-bottom:20px">${item.desc}</p>
                <span class="btn btn-primary btn-sm" style="margin:0 auto">Get Started →</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initHostDashboard() {
  const tabs = document.querySelectorAll('.tab-btn[data-tab]');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.add('hidden'));
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.remove('hidden');
    });
  });
  document.querySelectorAll('[data-link]').forEach(el => el.addEventListener('click', (e) => { e.preventDefault(); window.router.navigate(el.getAttribute('href')); }));
}
