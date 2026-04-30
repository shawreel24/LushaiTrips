import { insertStay } from '../lib/supabase.js';
import { refreshUserCache, showToast } from '../utils.js';

// ── Constants ──────────────────────────────────────────────────
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const UPLOAD_TIMEOUT_MS = 30000;

// ── Module-level state ────────────────────────────────────────
let currentStep = 1;
const totalSteps = 6;
const formData = {};

// Property-level photos (Step 5)
let uploadedImages = [];
let uploadedFiles  = [];
let pendingPhotoTasks = 0;

// Room types (Step 4) — each element: { name, count, price, maxGuests, files: [], images: [], pending: 0 }
let roomTypes = [];

const stepLabels = ['Basic Info', 'Property', 'Stay Details', 'Room Types', 'Photos', 'Rules & Submit'];

// ── Direct-fetch helpers (same pattern as guide form) ─────────

function buildSupabaseHeaders(accessToken = '') {
  return accessToken
    ? { apikey: SUPABASE_ANON, Authorization: `Bearer ${accessToken}` }
    : { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };
}

async function parseSupabaseJson(response) {
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    throw new Error((data && (data.message || data.msg)) || 'Supabase request failed.');
  }
  return data;
}

function getSupabaseStorageKey() {
  const hostname = new URL(SUPABASE_URL).hostname;
  const projectRef = hostname.split('.')[0];
  return `sb-${projectRef}-auth-token`;
}

function getStoredSession() {
  try { return JSON.parse(localStorage.getItem(getSupabaseStorageKey())); } catch { return null; }
}

async function uploadFileToStorageDirect(file, bucket, accessToken) {
  const ext = file.type.includes('png') ? 'png' : 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      ...buildSupabaseHeaders(accessToken),
      'Content-Type': file.type,
      'x-upsert': 'true',
    },
    body: file,
  });
  await parseSupabaseJson(response);
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
}

// ── Image preparation ─────────────────────────────────────────

function canvasToJpegFile(canvas, originalName = 'stay-photo.jpg') {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('Could not prepare the selected image.')); return; }
      const safeBase = originalName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'stay-photo';
      resolve(new File([blob], `${safeBase}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.78);
  });
}

async function prepareStayImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.onload = event => {
      const img = new Image();
      img.onerror = () => reject(new Error(`Could not process ${file.name}.`));
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
          else if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
          canvas.width = Math.max(1, Math.round(width));
          canvas.height = Math.max(1, Math.round(height));
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          const preview = canvas.toDataURL('image/jpeg', 0.72);
          const preparedFile = await canvasToJpegFile(canvas, file.name);
          resolve({ preview, preparedFile });
        } catch (err) { reject(err); }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Stepper / render ──────────────────────────────────────────

export function renderHostSignupStay() {
  return `
    <div style="min-height:100vh;padding:100px 24px 60px;background:linear-gradient(135deg,var(--bg) 0%,var(--bg2) 50%,var(--bg3) 100%)">
      <div style="max-width:700px;margin:0 auto">
        <div style="text-align:center;margin-bottom:40px">
          <div class="auth-logo" style="font-size:2rem;margin-bottom:8px">LushaiTrips</div>
          <h2 style="margin-bottom:8px">List Your Property</h2>
          <p style="color:var(--text-muted)">Join our trusted network of Mizoram hosts</p>
        </div>

        <!-- Stepper -->
        <div class="stepper" id="stepper">${buildStepper()}</div>

        <!-- Steps -->
        <div class="card card-body" style="padding:40px" id="step-container">
          ${buildStep(1)}
        </div>

        <!-- Navigation -->
        <div style="display:flex;justify-content:space-between;margin-top:24px">
          <button class="btn btn-secondary" id="prev-btn" style="${currentStep === 1 ? 'visibility:hidden' : ''}">← Back</button>
          <div style="color:var(--text-dim);font-size:0.85rem;align-self:center">Step ${currentStep} of ${totalSteps}</div>
          <button class="btn btn-primary" id="next-btn">${currentStep === totalSteps ? '🚀 Submit Listing' : 'Next →'}</button>
        </div>
      </div>
    </div>
  `;
}

function buildStepper() {
  return Array.from({ length: totalSteps }, (_, i) => {
    const n = i + 1;
    const cls = n < currentStep ? 'done' : n === currentStep ? 'active' : '';
    return `
      <div class="step ${cls}">
        <div class="step-wrapper">
          <div class="step-circle">${n < currentStep ? '✓' : n}</div>
          <div class="step-label">${stepLabels[i]}</div>
        </div>
      </div>
      ${n < totalSteps ? '<div class="step-line"></div>' : ''}
    `;
  }).join('');
}

function buildStep(step) {
  switch (step) {
    case 1: return `
      <h3 style="margin-bottom:24px">👤 Step 1: Basic Information</h3>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Your Full Name *</label><input type="text" class="form-input" id="h-name" placeholder="E.g. Liana Hnamte" value="${formData.name||''}" /></div>
        <div class="form-group"><label class="form-label">Phone Number *</label><input type="tel" class="form-input" id="h-phone" placeholder="+91 98765 43210" value="${formData.phone||''}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Email Address *</label><input type="email" class="form-input" id="h-email" placeholder="you@example.com" value="${formData.email||''}" /></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Password *</label><input type="password" class="form-input" id="h-password" placeholder="Min 8 characters" /></div>
        <div class="form-group"><label class="form-label">Confirm Password *</label><input type="password" class="form-input" id="h-confirm" placeholder="Repeat password" /></div>
      </div>
      </div>`;

    case 2: return `
      <h3 style="margin-bottom:24px">🏠 Step 2: Property Information</h3>
      <div class="form-group"><label class="form-label">Property Name *</label><input type="text" class="form-input" id="h-prop-name" placeholder="E.g. Bamboo Haven Homestay" value="${formData.propName||''}" /></div>
      <div class="form-group">
        <label class="form-label">Property Type *</label>
        <div class="check-group" id="prop-type-group">
          ${['Homestay','Hotel','Camping','Lodge','Farmstay','Guesthouse'].map(t => `
            <label class="chip" style="cursor:pointer;display:flex;align-items:center;gap:8px">
              <input type="radio" name="prop-type" value="${t}" ${formData.propType===t?'checked':''} style="accent-color:var(--emerald-500)" />
              ${t}
            </label>
          `).join('')}
        </div>
      </div>
      <div class="form-group"><label class="form-label">Full Address *</label><textarea class="form-textarea" id="h-address" placeholder="Village, District, PIN code" style="min-height:80px">${formData.address||''}</textarea></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">District *</label>
          <select class="form-select" id="h-district">
            <option value="">Select District</option>
            ${['Aizawl','Lunglei','Champhai','Kolasib','Lawngtlai','Mamit','Saiha','Serchhip','Saitual','Hnahthial','Khawzawl'].map(d => `<option ${formData.district===d?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Google Maps Link <span style="font-size:0.8rem;color:var(--text-dim)">(optional)</span></label><input type="url" class="form-input" id="h-maps" placeholder="https://maps.google.com/..." value="${formData.mapsLink||''}" /></div>
      </div>`;

    case 3: return `
      <h3 style="margin-bottom:24px">🛎️ Step 3: Stay Details</h3>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Check-in Time *</label><input type="time" class="form-input" id="h-checkin" value="${formData.checkIn||'14:00'}" /></div>
        <div class="form-group"><label class="form-label">Check-out Time *</label><input type="time" class="form-input" id="h-checkout" value="${formData.checkOut||'11:00'}" /></div>
      </div>
      <div class="form-group">
        <label class="form-label">Amenities</label>
        <div class="check-group" style="flex-wrap:wrap">
          ${['WiFi','Parking','Home-cooked Food','Breakfast Included','Hot Water','Valley View','Bonfire','AC','Private Bathroom','Kitchen Access','Laundry','Waterfall View','Farm Access','Stargazing'].map(a => `
            <label class="check-item">
              <input type="checkbox" name="amenity" value="${a}" ${(formData.amenities||[]).includes(a)?'checked':''} />
              <label>${a}</label>
            </label>
          `).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">About Your Place *</label>
        <textarea class="form-textarea" id="h-description" placeholder="Describe what makes your place special — views, atmosphere, what guests will love…" style="min-height:140px">${formData.description||''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Nearby Attractions</label>
        <input type="text" class="form-input" id="h-nearby" placeholder="e.g. Vantawng Falls (2 km), Thenzawl market" value="${formData.nearby||''}" />
      </div>`;

    case 4: return buildRoomTypesStep();

    case 5: return `
      <h3 style="margin-bottom:8px">📸 Step 5: Property Photos</h3>
      <p style="color:var(--text-muted);margin-bottom:24px;font-size:0.9rem">High-quality photos get 3× more bookings. Minimum 3 property photos required. First photo will be your cover image.</p>
      <div class="upload-zone" id="photo-upload-zone" onclick="document.getElementById('photo-input').click()">
        <div style="font-size:2.5rem;margin-bottom:12px">📷</div>
        <div style="font-weight:700;margin-bottom:6px">Upload Property Photos</div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">JPG or PNG • Max 5MB each • Minimum 3 required</div>
        <div style="font-size:0.8rem;color:var(--emerald-400)">💡 Include: exterior, common area, view, dining area</div>
        <input type="file" id="photo-input" multiple accept="image/*" style="display:none" />
      </div>
      <div class="upload-preview" id="photo-preview" style="margin-top:16px"></div>
      <div id="photo-count" style="margin-top:10px;font-size:0.85rem;color:var(--text-muted)">${uploadedImages.length > 0 ? uploadedImages.length + ' photo(s) uploaded' : 'No photos uploaded yet'}</div>`;

    case 6: return `
      <h3 style="margin-bottom:24px">📜 Step 6: Rules & Submission</h3>
      <div class="form-group">
        <label class="form-label">House Rules</label>
        <textarea class="form-textarea" id="h-rules" placeholder="e.g. No smoking inside&#10;Quiet hours after 10 PM&#10;No outside guests after 9 PM&#10;Pets on request" style="min-height:120px">${formData.rules||''}</textarea>
        <span class="form-hint">One rule per line</span>
      </div>
      <div class="form-group">
        <label class="form-label">Cancellation Policy</label>
        <select class="form-select" id="h-cancel">
          <option value="flexible" ${formData.cancellation==='flexible'?'selected':''}>Flexible — Full refund 24 hours before</option>
          <option value="moderate" ${formData.cancellation==='moderate'?'selected':''}>Moderate — Full refund 5 days before</option>
          <option value="strict" ${formData.cancellation==='strict'?'selected':''}>Strict — 50% refund up to 1 week before</option>
        </select>
      </div>
      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius);padding:24px;margin-bottom:20px">
        <div style="font-weight:700;margin-bottom:12px">✅ What happens after submission?</div>
        ${['Our team reviews your listing within 24–48 hours','We verify your ID and property photos','Once approved, your listing goes live on LushaiTrips','You receive 90% of every booking directly to your account'].map(s => `<div style="display:flex;gap:10px;margin-bottom:8px;font-size:0.9rem;color:var(--text-muted)"><span style="color:var(--emerald-400)">→</span>${s}</div>`).join('')}
      </div>
      <label class="check-item" style="margin-bottom:20px">
        <input type="checkbox" id="h-agree" />
        <label style="font-size:0.9rem">I agree to LushaiTrips <a href="#" style="color:var(--emerald-400)">Host Terms & Conditions</a> and confirm all information is accurate.</label>
      </label>`;
  }
}

// ── Room Types Step ───────────────────────────────────────────

function buildRoomTypesStep() {
  const cards = roomTypes.map((room, idx) => buildRoomCard(room, idx)).join('');
  return `
    <h3 style="margin-bottom:8px">🛏️ Step 4: Room Types</h3>
    <p style="color:var(--text-muted);margin-bottom:24px;font-size:0.9rem">Add at least one room type. Each type can have its own name, pricing, and photos.</p>
    <div id="room-cards-container">
      ${cards}
    </div>
    <button type="button" class="btn btn-secondary" id="add-room-btn" style="width:100%;justify-content:center;margin-top:12px">
      + Add Room Type
    </button>
  `;
}

function buildRoomCard(room, idx) {
  const previewHtml = (room.images || [])
    .filter(Boolean)
    .map(src => `<img src="${src}" style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--glass-border)" />`)
    .join('');

  return `
    <div class="card card-body" id="room-card-${idx}" style="margin-bottom:16px;padding:24px;position:relative">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-weight:700;font-size:1rem">Room Type ${idx + 1}</div>
        ${roomTypes.length > 1 ? `<button type="button" class="btn btn-secondary btn-sm" data-remove-room="${idx}" style="padding:4px 10px;font-size:0.8rem">✕ Remove</button>` : ''}
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Room Name *</label>
          <input type="text" class="form-input" id="room-name-${idx}" placeholder="e.g. Standard, Deluxe Suite" value="${room.name||''}" />
        </div>
        <div class="form-group">
          <label class="form-label">Number of Rooms *</label>
          <input type="number" class="form-input" id="room-count-${idx}" min="1" max="50" placeholder="e.g. 3" value="${room.count||''}" />
        </div>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Price per Night (₹) *</label>
          <input type="number" class="form-input" id="room-price-${idx}" min="500" placeholder="e.g. 2000" value="${room.price||''}" />
          <span class="form-hint">For stays, we take 8% commission.</span>
        </div>
        <div class="form-group">
          <label class="form-label">Max Guests *</label>
          <input type="number" class="form-input" id="room-guests-${idx}" min="1" max="20" placeholder="e.g. 2" value="${room.maxGuests||''}" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Room Photos <span style="font-size:0.8rem;color:var(--text-dim)">(optional)</span></label>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px" id="room-photo-preview-${idx}">
          ${previewHtml}
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <button type="button" class="btn btn-secondary btn-sm" data-room-photo-btn="${idx}">📷 Add Photos</button>
          <input type="file" id="room-photo-input-${idx}" multiple accept="image/*" style="display:none" />
          <span id="room-photo-count-${idx}" style="font-size:0.8rem;color:var(--text-muted)">${(room.files||[]).filter(Boolean).length} photo(s)</span>
        </div>
      </div>
    </div>
  `;
}

// ── Step collection ───────────────────────────────────────────

function collectStep(step) {
  switch (step) {
    case 1: {
      formData.name = document.getElementById('h-name')?.value?.trim();
      formData.email = document.getElementById('h-email')?.value?.trim();
      formData.phone = document.getElementById('h-phone')?.value?.trim();
      formData.password = document.getElementById('h-password')?.value;
      const confirm = document.getElementById('h-confirm')?.value;
      if (!formData.name || !formData.email || !formData.phone || !formData.password) { showToast('Please fill all required fields', '', 'error'); return false; }
      if (formData.password !== confirm) { showToast('Passwords do not match', '', 'error'); return false; }
      if (formData.password.length < 8) { showToast('Password must be 8+ characters', '', 'error'); return false; }
      return true;
    }
    case 2: {
      formData.propName = document.getElementById('h-prop-name')?.value?.trim();
      formData.propType = document.querySelector('input[name="prop-type"]:checked')?.value;
      formData.address = document.getElementById('h-address')?.value?.trim();
      formData.district = document.getElementById('h-district')?.value;
      formData.mapsLink = document.getElementById('h-maps')?.value?.trim();
      if (!formData.propName || !formData.propType || !formData.address || !formData.district) { showToast('Please fill all required fields', '', 'error'); return false; }
      return true;
    }
    case 3: {
      formData.checkIn = document.getElementById('h-checkin')?.value;
      formData.checkOut = document.getElementById('h-checkout')?.value;
      formData.amenities = [...document.querySelectorAll('input[name="amenity"]:checked')].map(el => el.value);
      formData.description = document.getElementById('h-description')?.value?.trim();
      formData.nearby = document.getElementById('h-nearby')?.value?.trim();
      if (!formData.description) { showToast('Please describe your place', '', 'error'); return false; }
      return true;
    }
    case 4: {
      // Collect current values from room cards
      let valid = true;
      roomTypes.forEach((room, idx) => {
        room.name = document.getElementById(`room-name-${idx}`)?.value?.trim();
        room.count = document.getElementById(`room-count-${idx}`)?.value;
        room.price = document.getElementById(`room-price-${idx}`)?.value;
        room.maxGuests = document.getElementById(`room-guests-${idx}`)?.value;
        if (!room.name || !room.count || !room.price || !room.maxGuests) valid = false;
      });
      if (!valid) { showToast('Please fill all room type fields', '', 'error'); return false; }
      if (roomTypes.length === 0) { showToast('Please add at least one room type', '', 'error'); return false; }
      // Check for any pending room photo tasks
      const anyPending = roomTypes.some(r => (r.pending || 0) > 0);
      if (anyPending) { showToast('Please wait for room photos to finish preparing', '', 'error'); return false; }
      return true;
    }
    case 5: {
      if (pendingPhotoTasks > 0) { showToast('Please wait for photos to finish preparing', '', 'error'); return false; }
      if (uploadedFiles.filter(Boolean).length < 3) { showToast('Please upload at least 3 property photos', '', 'error'); return false; }
      return true;
    }
    case 6: {
      formData.rules = document.getElementById('h-rules')?.value?.trim();
      formData.cancellation = document.getElementById('h-cancel')?.value;
      if (!document.getElementById('h-agree')?.checked) { showToast('Please agree to Terms & Conditions', '', 'error'); return false; }
      return true;
    }
  }
}

// ── Navigation ────────────────────────────────────────────────

function goToStep(step) {
  currentStep = step;
  document.getElementById('stepper').innerHTML = buildStepper();
  document.getElementById('step-container').innerHTML = buildStep(step);
  document.getElementById('prev-btn').style.visibility = step === 1 ? 'hidden' : 'visible';
  document.getElementById('next-btn').textContent = step === totalSteps ? '🚀 Submit Listing' : 'Next →';
  bindStepEvents(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Step-specific event binding ───────────────────────────────

function syncPhotoCount() {
  const selected = uploadedFiles.filter(Boolean).length;
  const count = document.getElementById('photo-count');
  if (!count) return;
  if (pendingPhotoTasks > 0) {
    count.textContent = `${selected} photo(s) ready, ${pendingPhotoTasks} still preparing…`;
  } else {
    count.textContent = selected > 0 ? `${selected} photo(s) ready to upload` : 'No photos uploaded yet';
  }
}

function syncRoomPhotoCount(idx) {
  const room = roomTypes[idx];
  if (!room) return;
  const el = document.getElementById(`room-photo-count-${idx}`);
  if (!el) return;
  const ready = (room.files || []).filter(Boolean).length;
  const pending = room.pending || 0;
  el.textContent = pending > 0 ? `${ready} ready, ${pending} preparing…` : `${ready} photo(s)`;
}

function bindRoomPhotoInput(idx) {
  const btn = document.querySelector(`[data-room-photo-btn="${idx}"]`);
  const input = document.getElementById(`room-photo-input-${idx}`);
  if (!btn || !input) return;

  btn.addEventListener('click', () => input.click());
  input.addEventListener('change', async e => {
    const incomingFiles = [...e.target.files];
    if (!incomingFiles.length) return;

    const room = roomTypes[idx];
    if (!room) return;

    const previewRoot = document.getElementById(`room-photo-preview-${idx}`);
    room.pending = (room.pending || 0) + incomingFiles.length;
    syncRoomPhotoCount(idx);

    incomingFiles.forEach(async file => {
      const fileIdx = (room.files || []).length;
      if (!room.files) room.files = [];
      if (!room.images) room.images = [];
      room.files.push(null);
      room.images[fileIdx] = null;

      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:72px;height:72px;border-radius:8px;border:1px solid var(--glass-border);background:rgba(255,255,255,0.03)';
      wrap.innerHTML = `<div class="loading-spinner" style="width:20px;height:20px;border-width:2px"></div>`;
      previewRoot?.appendChild(wrap);

      try {
        const { preview, preparedFile } = await prepareStayImage(file);
        room.images[fileIdx] = preview;
        room.files[fileIdx] = preparedFile;

        wrap.style.cssText = 'position:relative;width:72px;height:72px;border-radius:8px;overflow:hidden;border:1px solid var(--glass-border)';
        wrap.innerHTML = `<img src="${preview}" style="width:100%;height:100%;object-fit:cover" /><button type="button" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.6);color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:0.7rem;cursor:pointer;display:flex;align-items:center;justify-content:center" data-room-remove="${idx}-${fileIdx}">✕</button>`;
        wrap.querySelector(`[data-room-remove]`)?.addEventListener('click', () => {
          room.images[fileIdx] = null;
          room.files[fileIdx] = null;
          wrap.remove();
          syncRoomPhotoCount(idx);
        });
      } catch (err) {
        room.images[fileIdx] = null;
        room.files[fileIdx] = null;
        wrap.remove();
        showToast(err.message || `Could not prepare ${file.name}.`, '', 'error');
      } finally {
        room.pending = Math.max(0, (room.pending || 1) - 1);
        syncRoomPhotoCount(idx);
      }
    });
  });
}

function bindStepEvents(step) {
  if (step === 4) {
    // Bind "Add Room Type" button
    document.getElementById('add-room-btn')?.addEventListener('click', () => {
      roomTypes.push({ name: '', count: '', price: '', maxGuests: '', files: [], images: [], pending: 0 });
      const container = document.getElementById('room-cards-container');
      if (container) {
        container.innerHTML = roomTypes.map((r, i) => buildRoomCard(r, i)).join('');
        roomTypes.forEach((_, i) => bindRoomPhotoInput(i));
        // Re-bind remove buttons
        document.querySelectorAll('[data-remove-room]').forEach(btn => {
          btn.addEventListener('click', () => {
            const removeIdx = parseInt(btn.dataset.removeRoom);
            roomTypes.splice(removeIdx, 1);
            container.innerHTML = roomTypes.map((r, i) => buildRoomCard(r, i)).join('');
            roomTypes.forEach((_, i) => bindRoomPhotoInput(i));
            bindRemoveRoomButtons(container);
          });
        });
      }
    });

    // Bind photo inputs for existing rooms
    roomTypes.forEach((_, i) => bindRoomPhotoInput(i));

    // Bind remove buttons for existing rooms
    bindRemoveRoomButtons(document.getElementById('room-cards-container'));
  }

  if (step === 5) {
    document.getElementById('photo-input')?.addEventListener('change', async e => {
      const incomingFiles = [...e.target.files];
      if (!incomingFiles.length) return;

      const previewRoot = document.getElementById('photo-preview');
      pendingPhotoTasks += incomingFiles.length;
      syncPhotoCount();

      incomingFiles.forEach(async file => {
        const idx = uploadedFiles.length;
        uploadedFiles.push(null);
        uploadedImages[idx] = null;

        const wrap = document.createElement('div');
        wrap.className = 'upload-img-wrap';
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;background:rgba(255,255,255,0.03);border:1px solid var(--glass-border)';
        wrap.innerHTML = `<div class="loading-spinner" style="width:24px;height:24px;border-width:2px;margin-bottom:8px"></div><div style="font-size:0.68rem;color:var(--text-muted);text-align:center">${file.name}</div>`;
        previewRoot?.appendChild(wrap);

        try {
          const { preview, preparedFile } = await prepareStayImage(file);
          uploadedImages[idx] = preview;
          uploadedFiles[idx] = preparedFile;

          wrap.style.cssText = '';
          wrap.innerHTML = `<img src="${preview}" alt="upload" />${idx === 0 ? '<div style="position:absolute;bottom:4px;left:4px;background:rgba(16,185,129,0.9);color:#fff;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:700">COVER</div>' : ''}<button class="remove-img">✕</button>`;
          wrap.querySelector('.remove-img')?.addEventListener('click', () => {
            uploadedImages[idx] = null;
            uploadedFiles[idx] = null;
            wrap.remove();
            syncPhotoCount();
          });
        } catch (err) {
          uploadedImages[idx] = null;
          uploadedFiles[idx] = null;
          wrap.remove();
          showToast(err.message || `Could not prepare ${file.name}.`, '', 'error');
        } finally {
          pendingPhotoTasks = Math.max(0, pendingPhotoTasks - 1);
          syncPhotoCount();
        }
      });
    });
  }
}

function bindRemoveRoomButtons(container) {
  if (!container) return;
  document.querySelectorAll('[data-remove-room]').forEach(btn => {
    btn.addEventListener('click', () => {
      const removeIdx = parseInt(btn.dataset.removeRoom);
      roomTypes.splice(removeIdx, 1);
      container.innerHTML = roomTypes.map((r, i) => buildRoomCard(r, i)).join('');
      roomTypes.forEach((_, i) => bindRoomPhotoInput(i));
      bindRemoveRoomButtons(container);
    });
  });
}

// ── Init (called once on page mount) ─────────────────────────

export function initHostSignupStay() {
  uploadedImages = [];
  uploadedFiles  = [];
  pendingPhotoTasks = 0;
  roomTypes = [{ name: '', count: '', price: '', maxGuests: '', files: [], images: [], pending: 0 }];

  // Attach nav listeners ONCE — no recursive re-init
  document.getElementById('next-btn')?.addEventListener('click', () => {
    if (!collectStep(currentStep)) return;
    if (currentStep === totalSteps) {
      submitListing();
    } else {
      goToStep(currentStep + 1);
    }
  });

  document.getElementById('prev-btn')?.addEventListener('click', () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  });

  // Bind step 1 events (none currently needed, but keeping pattern consistent)
  bindStepEvents(1);
}

// ── Submit ────────────────────────────────────────────────────

async function submitListing() {
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) { nextBtn.disabled = true; nextBtn.textContent = '⏳ Submitting…'; }

  try {
    const { supabase } = await import('../lib/supabase.js');

    // ── 1. Auth: get or create session ────────────────────────
    // First try stored session (direct-fetch style, same as guide form)
    let accessToken = getStoredSession()?.access_token || null;

    if (!accessToken) {
      const { data: { session } } = await supabase.auth.getSession();
      accessToken = session?.access_token || null;
    }

    if (!accessToken) {
      // Sign up or sign in
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.name } },
      });
      if (error) throw error;

      const { data: newSessionData } = await supabase.auth.getSession();
      if (!newSessionData.session) {
        throw new Error('Email is already registered. Please log in first, or use a different email.');
      }
      accessToken = newSessionData.session.access_token;

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: formData.name,
          phone: formData.phone,
          role: 'user',
        });
      }
    }

    await refreshUserCache();

    // ── 2. Upload room type photos ────────────────────────────
    if (nextBtn) nextBtn.textContent = '⏳ Uploading room photos…';

    const processedRooms = [];
    for (const [roomIdx, room] of roomTypes.entries()) {
      const validRoomFiles = (room.files || []).filter(Boolean);
      let roomImageUrls = [];

      for (const [fileIdx, file] of validRoomFiles.entries()) {
        if (nextBtn) nextBtn.textContent = `⏳ Room ${roomIdx + 1} photo ${fileIdx + 1}/${validRoomFiles.length}…`;
        try {
          const url = await Promise.race([
            uploadFileToStorageDirect(file, 'stay-images', accessToken),
            new Promise((_, rej) => setTimeout(() => rej(new Error('upload timeout')), UPLOAD_TIMEOUT_MS)),
          ]);
          if (url) roomImageUrls.push(url);
        } catch (uploadErr) {
          console.warn('[Stay] room image upload failed (skipping):', uploadErr.message);
        }
      }

      processedRooms.push({
        name:       room.name,
        count:      parseInt(room.count),
        price:      parseInt(room.price),
        max_guests: parseInt(room.maxGuests),
        images:     roomImageUrls,
        cover:      roomImageUrls[0] || '',
      });
    }

    // ── 3. Upload property-level photos ───────────────────────
    const validFiles = uploadedFiles.filter(Boolean);
    let imageUrls = [];

    if (validFiles.length > 0) {
      if (nextBtn) nextBtn.textContent = '⏳ Uploading property photos…';
      for (const [index, file] of validFiles.entries()) {
        if (nextBtn) nextBtn.textContent = `⏳ Uploading ${index + 1}/${validFiles.length}…`;
        try {
          const url = await Promise.race([
            uploadFileToStorageDirect(file, 'stay-images', accessToken),
            new Promise((_, rej) => setTimeout(() => rej(new Error('upload timeout')), UPLOAD_TIMEOUT_MS)),
          ]);
          if (url) imageUrls.push(url);
        } catch (uploadErr) {
          console.warn('[Stay] property image upload failed (skipping):', uploadErr.message);
        }
      }
    }

    if (nextBtn) nextBtn.textContent = '⏳ Saving listing…';

    // ── 4. Derive cheapest room price ─────────────────────────
    const cheapestPrice = processedRooms.reduce((min, r) => Math.min(min, r.price), Infinity);
    const totalRooms    = processedRooms.reduce((sum, r) => sum + r.count, 0);
    const maxGuests     = processedRooms.reduce((max, r) => Math.max(max, r.max_guests), 0);

    // ── 5. Insert the stay listing ────────────────────────────
    await insertStay({
      name:        formData.propName,
      type:        formData.propType,
      location:    formData.address,
      district:    formData.district,
      price:       cheapestPrice === Infinity ? 0 : cheapestPrice,
      rooms:       totalRooms,
      max_guests:  maxGuests,
      amenities:   formData.amenities || [],
      description: formData.description,
      images:      imageUrls,
      cover_image: imageUrls[0] || '',
      check_in:    formData.checkIn,
      check_out:   formData.checkOut,
      rules:       formData.rules?.split('\n').filter(Boolean) || [],
      room_types:  processedRooms,
      verified:    true,
      top_rated:   false,
    });

    // Reset on success
    currentStep = 1;
    uploadedImages = [];
    uploadedFiles  = [];
    roomTypes = [];

    showToast('Listing live! 🎉', 'Your stay is now visible to travellers.');
    setTimeout(() => window.router.navigate('/host-dashboard'), 800);
  } catch (e) {
    showToast(e.message || 'Submission failed', '', 'error');
    if (nextBtn) { nextBtn.disabled = false; nextBtn.textContent = '🚀 Submit Listing'; }
  }
}
