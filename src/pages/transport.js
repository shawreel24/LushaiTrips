import { transport as fallbackTransport } from '../data/services.js';
import { fetchTransport, fetchTransportById } from '../lib/supabase.js';
import { starsHTML, appHref, storage } from '../utils.js';

const transportCache = new Map();
const TRANSPORT_PLACEHOLDER = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80';
const TRANSPORT_FETCH_TIMEOUT_MS = 6000;
const RECENT_TRANSPORT_STORAGE_KEY = 'lt_recent_transport';
const HIDDEN_TRANSPORT_IDS = new Set(['transport-raj', 'transport-zara', 'transport-lal']);

function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function normalizeVehicle(vehicle) {
  return {
    name: vehicle?.name || 'Vehicle',
    capacity: Number(vehicle?.capacity || 1),
    price: Number(vehicle?.price || 0),
    priceUnit: vehicle?.price_unit || vehicle?.priceUnit || 'per day',
    category: vehicle?.category || vehicle?.service || 'Tour',
  };
}

function normalizeTransport(item) {
  const images = Array.isArray(item?.images) ? item.images.filter(Boolean) : [];
  const coverImage =
    item?.cover_image ||
    item?.coverImage ||
    images[0] ||
    TRANSPORT_PLACEHOLDER;

  const vehicles = Array.isArray(item?.vehicles)
    ? item.vehicles.map(normalizeVehicle).filter(vehicle => vehicle.name)
    : [];

  return {
    id: item?.id,
    name: item?.name || 'Transport Service',
    owner: item?.owner_name || item?.owner || 'Transport Partner',
    type: item?.type || 'Transport',
    vehicles,
    rating: Number(item?.rating || 0),
    reviews: Number(item?.reviews_count || item?.reviews || 0),
    phone: item?.phone || '',
    email: item?.email || '',
    location: item?.location || 'Mizoram',
    coverImage,
    images: images.length ? images : [coverImage],
    description: item?.description || 'Transport details will be added soon.',
    features: Array.isArray(item?.features) ? item.features : [],
    verified: item?.verified !== false,
    available: item?.available !== false,
  };
}

function isVisibleTransport(item) {
  if (!item?.id) return false;
  if (HIDDEN_TRANSPORT_IDS.has(item.id)) return false;
  return true;
}

function sanitizeRecentTransport(items) {
  if (!Array.isArray(items)) return [];
  const filtered = items.filter(isVisibleTransport);
  if (filtered.length !== items.length) {
    storage.set(RECENT_TRANSPORT_STORAGE_KEY, filtered);
  }
  return filtered;
}

function rememberTransport(list) {
  transportCache.clear();
  list.forEach(item => transportCache.set(item.id, item));
  return list;
}

function getRecentTransport() {
  const recentTransport = sanitizeRecentTransport(storage.get(RECENT_TRANSPORT_STORAGE_KEY));
  return recentTransport.map(normalizeTransport).filter(isVisibleTransport);
}

function mergeTransportLists(primary, secondary = []) {
  const merged = new Map();
  [...primary, ...secondary].forEach(item => {
    if (!isVisibleTransport(item) || merged.has(item.id)) return;
    merged.set(item.id, item);
  });
  return [...merged.values()];
}

function getFallbackTransport(id) {
  if (HIDDEN_TRANSPORT_IDS.has(id)) return null;
  return fallbackTransport.find(item => item.id === id) || null;
}

function renderTransportCard(item) {
  const displayRating = item.rating > 0 ? item.rating.toFixed(1) : 'New';
  const displayReviews = item.reviews || 0;

  return `
    <a href="${appHref(`/transport/${item.id}`)}" class="card" data-link style="cursor:pointer;display:block;color:inherit;text-decoration:none">
      <div class="card-img-wrap">
        <img src="${item.coverImage}" alt="${item.name}" loading="lazy" />
        <div class="card-badge">${item.type.toUpperCase()}</div>
        <div class="card-rating">${starsHTML(item.rating)} <span>${displayRating} (${displayReviews})</span></div>
      </div>
      <div class="card-body">
        <h4 class="card-title">${item.name}</h4>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:10px">Owner: ${item.owner} &nbsp;|&nbsp; Location: ${item.location}</div>
        <div style="margin-bottom:14px">
          ${item.vehicles.slice(0, 2).map(vehicle => `
            <div style="display:flex;justify-content:space-between;font-size:0.85rem;padding:6px 0;border-bottom:1px solid var(--glass-border)">
              <span style="color:var(--text-muted)">${vehicle.name}</span>
              <span style="color:var(--emerald-400);font-weight:600">Rs ${vehicle.price.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
          ${item.features.slice(0, 3).map(feature => `<span class="tag" style="font-size:0.72rem">${feature}</span>`).join('')}
        </div>
        <span class="btn btn-outline btn-sm w-full" style="justify-content:center">View & Book</span>
      </div>
    </a>
  `;
}

function renderTransportDetailContent(item) {
  const serviceCategories = [...new Set((item.vehicles || []).map(v => v.category).filter(Boolean))];
  const defaultCategory = serviceCategories[0] || 'Tour';
  const defaultVehicles = (item.vehicles || []).filter(v => v.category === defaultCategory);

  return `
    <div style="padding-top:76px">
      <div class="container" style="margin-top:24px">
        <div class="detail-layout">
          <div>
            <div style="margin-bottom:24px">
              <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
                <h1 style="font-size:clamp(1.5rem,3vw,2rem)">${item.name}</h1>
                ${item.verified ? `<span style="color:var(--emerald-400);font-size:0.85rem">Verified Provider</span>` : ''}
              </div>
              <div style="display:flex;gap:4px;align-items:center;margin-bottom:8px">${starsHTML(item.rating)} <strong>${item.rating > 0 ? item.rating.toFixed(1) : 'New'}</strong> <span style="color:var(--text-muted)">(${item.reviews} reviews)</span></div>
              <div style="font-size:0.9rem;color:var(--text-muted)">Location: ${item.location} &nbsp;|&nbsp; Owner: ${item.owner}</div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px;border-radius:var(--radius);overflow:hidden">
              ${item.images.map((img, index) => `<img src="${img}" alt="${item.name}" style="width:100%;height:180px;object-fit:cover;${index === 0 ? 'grid-column:1/3;height:260px' : ''}" loading="lazy" />`).join('')}
            </div>

            <h3 style="margin-bottom:12px">About this Service</h3>
            <p style="margin-bottom:28px">${item.description}</p>

            <h3 style="margin-bottom:16px">Available Vehicles</h3>
            <div style="margin-bottom:32px">
              ${item.vehicles.length
                ? item.vehicles.map(vehicle => `
                  <div class="card card-body" style="margin-bottom:12px;padding:20px">
                    <div class="flex-between">
                      <div>
                        <div style="font-weight:700;margin-bottom:4px">${vehicle.name}</div>
                        <div style="font-size:0.85rem;color:var(--text-muted)">Up to ${vehicle.capacity} passengers</div>
                      </div>
                      <div style="text-align:right">
                        <div class="price" style="font-size:1.1rem">Rs ${vehicle.price.toLocaleString()}</div>
                        <div style="font-size:0.8rem;color:var(--text-muted)">${vehicle.priceUnit}</div>
                      </div>
                    </div>
                  </div>
                `).join('')
                : `<div style="font-size:0.9rem;color:var(--text-muted)">Vehicle details will appear here shortly.</div>`}
            </div>

            <h3 style="margin-bottom:16px">Features</h3>
            <div class="amenities-grid">
              ${item.features.map(feature => `<div class="amenity-item"><span class="amenity-icon">OK</span><span class="amenity-label">${feature}</span></div>`).join('')}
            </div>
          </div>
          <div>
            <div class="booking-widget">
              <div style="font-family:var(--font-head);font-size:1.1rem;font-weight:700;margin-bottom:4px">Book Transport</div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:20px">Choose service, vehicle and dates</div>
              <div class="form-group">
                <label class="form-label">Service Type</label>
                <select class="form-select" id="service-select">
                  ${serviceCategories.map(cat => `<option value="${cat}" ${cat === defaultCategory ? 'selected' : ''}>${cat}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Vehicle</label>
                <select class="form-select" id="vehicle-select">
                  ${defaultVehicles.map(vehicle => `<option value="${vehicle.price}" data-price-unit="${vehicle.priceUnit}">${vehicle.name} - Rs ${vehicle.price.toLocaleString()} ${vehicle.priceUnit}</option>`).join('')}
                </select>
              </div>
              <div class="form-group"><label class="form-label">Pickup Date</label><input type="date" class="form-input" id="pickup-date" /></div>
              <div class="form-group" id="dropoff-wrap"><label class="form-label">Drop-off Date</label><input type="date" class="form-input" id="dropoff-date" /></div>
              <div class="form-group"><label class="form-label">Pickup Location</label><input type="text" class="form-input" id="pickup-loc" placeholder="e.g. Aizawl Airport" /></div>
              <div id="transport-total" style="background:var(--glass);border-radius:var(--radius-sm);padding:14px;margin-bottom:16px;font-size:0.9rem;color:var(--text-muted)">Select vehicle and dates to see total</div>
              <button class="btn btn-primary w-full" id="book-transport-btn" style="justify-content:center;padding:16px;margin-bottom:12px">Book Now -></button>
              <p style="text-align:center;font-size:0.8rem;color:var(--text-muted)">Secure booking</p>
              <div class="divider-h"></div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:6px">Phone: ${item.phone || 'Available after booking'}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">Email: ${item.email || 'Available after booking'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachTransportCardLinks(grid) {
  grid.querySelectorAll('[data-link]').forEach(el => {
    if (el.dataset.transportBound === 'true') return;
    el.dataset.transportBound = 'true';
    el.addEventListener('click', event => {
      event.preventDefault();
      window.router.navigate(el.getAttribute('href'));
    });
  });
}

export function renderTransport() {
  const H = appHref;
  const previewTransport = mergeTransportLists(
    getRecentTransport(),
    fallbackTransport.map(normalizeTransport)
  );
  return `
    <section class="page-hero">
      <div class="container">
        <div class="section-label">Get Around Mizoram</div>
        <h1>Book Transport</h1>
        <p style="max-width:600px;margin-bottom:32px">From airport pickups to multi-day SUV hire and Royal Enfield adventures - we've got every journey covered.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid-3" id="transport-grid">
          ${previewTransport.map(renderTransportCard).join('')}
        </div>
        <div style="margin-top:60px;background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(245,158,11,0.05));border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xl);padding:48px;text-align:center">
          <div style="font-size:2.5rem;margin-bottom:16px">Transport</div>
          <h2 style="margin-bottom:12px">Have a Vehicle to List?</h2>
          <p style="max-width:480px;margin:0 auto 28px">Join our transport network and earn by connecting travellers with reliable rides across Mizoram.</p>
          <a href="${H('/host-signup-transport')}" class="btn btn-primary btn-lg" data-link>List Your Transport</a>
        </div>
      </div>
    </section>
  `;
}

export async function initTransport() {
  const grid = document.getElementById('transport-grid');
  if (!grid) return;

  const recentTransport = getRecentTransport();
  let normalizedTransport = [];
  try {
    const rows = await withTimeout(
      fetchTransport(),
      TRANSPORT_FETCH_TIMEOUT_MS,
      'Transport list request timed out.'
    );
    normalizedTransport = rememberTransport(
      mergeTransportLists(
        rows.map(normalizeTransport),
        recentTransport
      )
    );
  } catch (error) {
    console.warn('[transport] falling back to static data:', error.message);
  }

  if (!normalizedTransport.length) {
    normalizedTransport = rememberTransport(
      mergeTransportLists(
        recentTransport,
        fallbackTransport.map(normalizeTransport)
      )
    );
  }

  if (!normalizedTransport.length) {
    grid.innerHTML = `<div class="page-loader" style="grid-column:1/-1"><div style="color:var(--text-muted)">No transport listings available yet.</div></div>`;
    return;
  }

  grid.innerHTML = normalizedTransport.map(renderTransportCard).join('');
  attachTransportCardLinks(grid);
}

export function renderTransportDetail(id) {
  return `
    <div id="transport-detail-root" data-transport-id="${id}" style="padding-top:76px">
      <div class="page-loader">
        <div class="loading-spinner"></div>
        <div style="color:var(--text-muted)">Loading transport details...</div>
      </div>
    </div>
  `;
}

export async function initTransportDetail(id) {
  const root = document.getElementById('transport-detail-root');
  if (!root) return;

  let item = transportCache.get(id) || null;

  if (!item) {
    try {
      const row = await withTimeout(
        fetchTransportById(id),
        TRANSPORT_FETCH_TIMEOUT_MS,
        'Transport profile request timed out.'
      );
      item = normalizeTransport(row);
    } catch (error) {
      console.warn('[transport-detail] falling back to static data:', error.message);
    }
  }

  if (!item) {
    item = getRecentTransport().find(entry => entry.id === id) || null;
  }

  if (!item) {
    const fallback = getFallbackTransport(id);
    if (fallback) item = normalizeTransport(fallback);
  }

  if (!item) {
    root.innerHTML = `<div class="page-hero container"><h1>Transport listing not found</h1></div>`;
    return;
  }

  transportCache.set(item.id, item);
  root.outerHTML = renderTransportDetailContent(item);

  const serviceEl = document.getElementById('service-select');
  const vehicleEl = document.getElementById('vehicle-select');
  const dropoffWrap = document.getElementById('dropoff-wrap');

  const formatLocalISO = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const pickupEl = document.getElementById('pickup-date');
  const dropoffEl = document.getElementById('dropoff-date');

  const allVehicles = Array.isArray(item?.vehicles) ? item.vehicles : [];
  const getActiveCategory = () => serviceEl?.value || allVehicles[0]?.category || 'Tour';
  const getVehiclesForCategory = (category) => allVehicles.filter(v => (v.category || 'Tour') === category);
  const refreshVehicleOptions = () => {
    if (!vehicleEl) return;
    const category = getActiveCategory();
    const options = getVehiclesForCategory(category);
    vehicleEl.innerHTML = options.length
      ? options.map(v => `<option value="${v.price}" data-price-unit="${v.priceUnit}">${v.name} - Rs ${Number(v.price || 0).toLocaleString()} ${v.priceUnit}</option>`).join('')
      : `<option value="0">No vehicles available</option>`;
  };

  const updateServiceUi = () => {
    const category = getActiveCategory();
    const isTour = category.toLowerCase() === 'tour';
    if (dropoffWrap) dropoffWrap.style.display = isTour ? '' : 'none';
    if (!isTour && pickupEl && dropoffEl) {
      dropoffEl.value = pickupEl.value;
    }
  };

  serviceEl?.addEventListener('change', () => {
    refreshVehicleOptions();
    updateServiceUi();
    clampDates();
    updateTotal();
  });

  if (pickupEl) {
    pickupEl.min = formatLocalISO(tomorrow);
    pickupEl.value = formatLocalISO(tomorrow);
  }
  if (dropoffEl) {
    dropoffEl.min = formatLocalISO(dayAfterTomorrow);
    dropoffEl.value = formatLocalISO(dayAfterTomorrow);
  }

  const clampDates = () => {
    if (!pickupEl || !dropoffEl) return;

    const pickup = new Date(pickupEl.value || formatLocalISO(tomorrow));
    const minPickup = new Date(tomorrow);
    if (pickup < minPickup) pickupEl.value = formatLocalISO(tomorrow);

    const category = getActiveCategory();
    const isTour = category.toLowerCase() === 'tour';
    if (!isTour) {
      dropoffEl.value = pickupEl.value;
      dropoffEl.min = pickupEl.value;
      return;
    }

    const minDropoff = new Date(pickupEl.value);
    minDropoff.setDate(minDropoff.getDate() + 1);
    dropoffEl.min = formatLocalISO(minDropoff);

    const dropoff = new Date(dropoffEl.value || formatLocalISO(minDropoff));
    if (dropoff < minDropoff) dropoffEl.value = formatLocalISO(minDropoff);
  };
  clampDates();
  refreshVehicleOptions();
  updateServiceUi();

  const updateTotal = () => {
    const price = parseInt(vehicleEl?.value || 0, 10);
    const pickup = new Date(document.getElementById('pickup-date')?.value);
    const dropoff = new Date(document.getElementById('dropoff-date')?.value);
    const category = getActiveCategory();
    const isTour = category.toLowerCase() === 'tour';
    const days = isTour ? Math.max(1, Math.round((dropoff - pickup) / 86400000)) : 1;
    const total = price * days;
    const el = document.getElementById('transport-total');
    if (el) {
      const unitLabel = isTour ? `day${days > 1 ? 's' : ''}` : 'trip';
      el.innerHTML = `<div class="flex-between"><span>Rs ${price.toLocaleString()} x ${days} ${unitLabel}</span><strong style="color:var(--text)">Rs ${total.toLocaleString()}</strong></div>`;
    }
    return total;
  };

  updateTotal();
  ['vehicle-select', 'pickup-date', 'dropoff-date'].forEach(fieldId => {
    document.getElementById(fieldId)?.addEventListener('change', () => {
      updateServiceUi();
      clampDates();
      updateTotal();
    });
  });

  document.getElementById('book-transport-btn')?.addEventListener('click', () => {
    const pickupDate = pickupEl?.value || '';
    const minAllowed = formatLocalISO(tomorrow);
    if (!pickupDate || pickupDate < minAllowed) {
      clampDates();
      updateTotal();
      return;
    }
    const total = updateTotal();
    const image = encodeURIComponent(item.coverImage || item.cover_image || '');
    const service = encodeURIComponent(getActiveCategory());
    const pickupLoc = encodeURIComponent(document.getElementById('pickup-loc')?.value?.trim() || '');
    const checkin = pickupEl?.value || '';
    const checkout = dropoffEl?.value || checkin;
    window.router.navigate(`/book/${id}?checkin=${checkin}&checkout=${checkout}&total=${total}&type=transport&service=${service}&pickup=${pickupLoc}&name=${encodeURIComponent(item.name)}&image=${image}`);
  });
}
