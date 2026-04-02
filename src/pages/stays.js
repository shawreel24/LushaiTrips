import { stays } from '../data/stays.js';
import { starsHTML } from '../utils.js';

export function renderStays() {
  return `
    <section class="page-hero">
      <div class="container">
        <div class="section-label">🏡 Where to Stay</div>
        <h1>Stays in Mizoram</h1>
        <p style="max-width:600px;margin-bottom:32px">Handpicked homestays, lodges, and camps. Every host is verified and every experience is authentic.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          ${['All','Homestay','Hotel','Lodge','Camping'].map((t,i) => `<div class="chip ${i===0?'active':''}" data-type="${t.toLowerCase()}">${t}</div>`).join('')}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid-3" id="stays-grid"></div>
      </div>
    </section>
  `;
}

export function initStays() {
  let activeType = 'all';
  
  const render = () => {
    const filtered = activeType === 'all' ? stays : stays.filter(s => s.type.toLowerCase() === activeType);
    document.getElementById('stays-grid').innerHTML = filtered.length ? filtered.map(stayCard).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">No stays found.</div>';
    document.querySelectorAll('[data-href]').forEach(el => el.addEventListener('click', () => window.router.navigate(el.dataset.href)));
  };
  render();
  document.querySelectorAll('.chip[data-type]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-type]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeType = chip.dataset.type;
      render();
    });
  });
}

function stayCard(s) {
  return `
    <div class="card stay-card" data-href="/stay/${s.id}">
      <div class="card-img-wrap">
        <img src="${s.coverImage}" alt="${s.name}" loading="lazy" />
        <div class="card-badge">${s.type.toUpperCase()}</div>
        ${s.topRated ? `<div style="position:absolute;top:12px;right:12px;background:rgba(245,158,11,0.9);backdrop-filter:blur(8px);padding:4px 10px;border-radius:50px;font-size:0.72rem;font-weight:700;color:#000">🔥 TOP RATED</div>` : ''}
        <div class="card-rating">${starsHTML(s.rating)} <span>${s.rating} (${s.reviews})</span></div>
      </div>
      <div class="card-body">
        <h4 class="card-title">${s.name}</h4>
        <div class="card-meta" style="margin-bottom:8px">📍 ${s.location}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          ${s.amenities.slice(0, 3).map(a => `<span class="tag" style="font-size:0.72rem">${a}</span>`).join('')}
          ${s.amenities.length > 3 ? `<span class="tag" style="font-size:0.72rem">+${s.amenities.length - 3} more</span>` : ''}
        </div>
        <div class="flex-between">
          <span class="price">₹${s.price.toLocaleString()}<span>/night</span></span>
          <span style="font-size:0.8rem;color:var(--text-muted)">👥 Max ${s.maxGuests}</span>
        </div>
      </div>
    </div>
  `;
}
