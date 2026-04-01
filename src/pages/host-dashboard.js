import { supabase } from '../lib/supabase.js';
import { getCurrentUser, showToast, appHref } from '../utils.js';

export function renderHostDashboard() {
  const H = appHref;
  const user = getCurrentUser();
  if (!user) return `<div class="page-hero container"><h1>Please <a href="${H('/login')}" data-link style="color:var(--emerald-400)">log in</a></h1></div>`;
  if (user.role !== 'host') return `<div class="page-hero container"><h1>Host access only. <a href="${H('/host-signup-stay')}" data-link style="color:var(--emerald-400)">Become a Host →</a></h1></div>`;

  return `<div id="host-dashboard-container" style="padding-top:76px;min-height:80vh;display:flex;align-items:center;justify-content:center"><div class="spinner" style="font-size:1.5rem">Loading Dashboard...</div></div>`;
}

export async function initHostDashboard() {
  const container = document.getElementById('host-dashboard-container');
  if (!container) return;

  const H = appHref;
  const user = getCurrentUser();
  
  if (!user || user.role !== 'host') return;

  // Fetch host's listings from all three tables
  let listings = [];
  try {
    const [staysRes, guidesRes, transportRes] = await Promise.all([
      supabase.from('stays').select('*').eq('host_id', user.id),
      supabase.from('guides').select('*').eq('host_id', user.id),
      supabase.from('transport').select('*').eq('host_id', user.id)
    ]);
    
    if (staysRes.data) listings.push(...staysRes.data.map(d => ({ ...d, tblType: 'Stay' })));
    if (guidesRes.data) listings.push(...guidesRes.data.map(d => ({ ...d, tblType: 'Guide' })));
    if (transportRes.data) listings.push(...transportRes.data.map(d => ({ ...d, tblType: 'Transport' })));
  } catch (e) {
    console.error('Error fetching listings:', e);
  }

  // Fetch bookings for these listings
  let bookings = [];
  try {
    const listingIds = listings.map(l => l.id);
    if (listingIds.length > 0) {
      const { data } = await supabase.from('bookings').select('*').in('listing_id', listingIds);
      if (data) bookings = data;
    }
  } catch (e) {
    console.error('Error fetching bookings:', e);
  }

  const totalEarnings = bookings.reduce((s, b) => s + (b.amount || 0) * 0.9, 0);

  container.innerHTML = `
    <section class="page-hero" style="padding-bottom:40px">
      <div class="container">
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--emerald-500),var(--emerald-800));display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800">
            ${user.avatar ? `<img src="${user.avatar}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover" onerror="this.style.display='none'" />` : '👤'}
          </div>
          <div>
            <h1 style="font-size:clamp(1.5rem,3vw,2rem);margin-bottom:4px">Host Dashboard</h1>
            <div style="color:var(--text-muted)">Welcome back, ${user.name || user.fullName} · <span class="badge badge-approved">✅ Active Host</span></div>
          </div>
        </div>
      </div>
    </section>

    <section style="padding-bottom:80px">
      <div class="container">
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
              <div style="width:80px;height:80px;border-radius:8px;overflow:hidden;flex-shrink:0">
                <img src="${l.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80'}" style="width:100%;height:100%;object-fit:cover" />
              </div>
              <div style="flex:1;min-width:200px">
                <div style="font-size:0.75rem;font-weight:700;color:var(--emerald-400);text-transform:uppercase;margin-bottom:2px">${l.tblType}</div>
                <div style="font-weight:700;margin-bottom:4px;font-size:1.1rem">${l.name || 'Unnamed Listing'}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">📍 ${l.location || '—'}</div>
                <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Price: ₹${l.price || '—'}/Unit</div>
              </div>
              <span class="${l.status === 'pending' ? 'badge badge-pending' : 'badge badge-approved'}">${(l.status||'live').toUpperCase()}</span>
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
          ${bookings.length ? bookings.map(b => {
             const cx = b.contact || {};
             return `
            <div class="card card-body" style="margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap">
              <div style="flex:1">
                <div style="font-weight:700;margin-bottom:4px">${b.listing_name}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">👤 ${cx.name || 'Guest'} · 📞 ${cx.phone || 'N/A'}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">📅 ${b.dates?.checkin || 'N/A'} → ${b.dates?.checkout || 'N/A'} · 👥 ${b.guests || '—'} guests</div>
                <div style="font-size:0.75rem;color:var(--text-dim);margin-top:4px">Ref: ${b.lt_booking_id || b.id}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;color:var(--emerald-400)">₹${Math.round((b.amount||0)*0.9).toLocaleString()} <span style="font-size:0.75rem;color:var(--text-dim)">(your share)</span></div>
                <span class="badge ${b.status === 'confirmed' ? 'badge-approved' : 'badge-pending'}">${b.status?.toUpperCase() || 'CONFIRMED'}</span>
              </div>
            </div>
          `}).join('') : `
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
              <a href="${H(item.href)}" class="card card-body text-center" data-link style="cursor:pointer">
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
  container.style.display = 'block';

  // Attach tab events
  const tabs = document.querySelectorAll('.tab-btn[data-tab]');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('[id^="tab-"]').forEach(t => t.classList.add('hidden'));
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.remove('hidden');
    });
  });

  document.querySelectorAll('[data-link]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    window.router.navigate(el.getAttribute('href'));
  }));
}
