/* script.js — СтройГрад */

// ===== NAVBAR SCROLL SHADOW =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== BURGER / MOBILE MENU =====
function toggleMenu() {
  const b = document.getElementById('burger');
  const m = document.getElementById('mobileMenu');
  if (!b || !m) return;
  b.classList.toggle('open');
  m.classList.toggle('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const b = document.getElementById('burger');
  const m = document.getElementById('mobileMenu');
  if (m && m.classList.contains('open')) {
    if (!m.contains(e.target) && !b.contains(e.target)) {
      b.classList.remove('open');
      m.classList.remove('open');
    }
  }
});

// ===== SCROLL REVEAL =====
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);

// ===== ANIMATED COUNTERS (index only) =====
function runCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = +el.dataset.target;
    const isPercent = el.dataset.suffix === '%';
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start) + (isPercent ? '%' : '+');
      if (start >= target) clearInterval(timer);
    }, 22);
  });
}

// Trigger counters when hero stats enter viewport
function initCounters() {
  const stats = document.querySelector('.hero-stats');
  if (!stats) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { runCounters(); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  obs.observe(stats);
}
document.addEventListener('DOMContentLoaded', initCounters);

// ===== MODALS (services page) =====
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOnOverlay(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ===== PRICE TABS (prices page) =====
function switchTab(name, btn) {
  document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.price-table-wrap').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById('tab-' + name);
  if (target) target.classList.add('active');
}

// ===== CONTACT FORM VALIDATION (contact page) =====
function validateField(id, groupId, check) {
  const el = document.getElementById(id);
  const gr = document.getElementById(groupId);
  if (!el || !gr) return true;
  const ok = check(el.value.trim());
  gr.classList.toggle('has-error', !ok);
  return ok;
}

function submitForm() {
  const n = validateField('f-name',    'fg-name',    v => v.length >= 2);
  const p = validateField('f-phone',   'fg-phone',   v => v.replace(/\D/g,'').length >= 10);
  const s = validateField('f-service', 'fg-service', v => v !== '');

  const emailEl = document.getElementById('f-email');
  let eOk = true;
  if (emailEl && emailEl.value.trim()) {
    eOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
    document.getElementById('fg-email').classList.toggle('has-error', !eOk);
  }

  if (n && p && eOk && s) {
    const content = document.getElementById('formContent');
    const success = document.getElementById('formSuccess');
    if (content) content.style.display = 'none';
    if (success) success.classList.add('show');
  }
}

function resetForm() {
  ['f-name','f-phone','f-email','f-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sel = document.getElementById('f-service');
  if (sel) sel.value = '';
  ['fg-name','fg-phone','fg-email','fg-service'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('has-error');
  });
  const content = document.getElementById('formContent');
  const success = document.getElementById('formSuccess');
  if (content) content.style.display = '';
  if (success) success.classList.remove('show');
}

// Phone input mask
document.addEventListener('DOMContentLoaded', () => {
  const phone = document.getElementById('f-phone');
  if (!phone) return;
  phone.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (!v) { this.value = ''; return; }
    let result = '+7';
    if (v.length > 1) result += ' (' + v.slice(1, 4);
    if (v.length >= 4) result += ') ' + v.slice(4, 7);
    if (v.length >= 7) result += '-' + v.slice(7, 9);
    if (v.length >= 9) result += '-' + v.slice(9, 11);
    this.value = result;
  });
});
