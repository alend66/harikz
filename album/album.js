const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ---------- All 6 AI-World Travel Photos ---------- */
const PHOTOS = [
  'photos/harikz-travel-hub-poster.jpg?v=ai2',
  'photos/forest-road-traveller.jpg?v=ai3',
  'photos/misty-hill-drive.jpg?v=ai2',
  'photos/mountain-highway-stop.jpg?v=ai2',
  'photos/monsoon-pitstop-force.jpg?v=ai2',
  'photos/fleet-duo-ready.jpg?v=ai2'
];

const SLOTS = [
  { x: 0, y: 0, r: -1.4, s: 1.0, o: 1 },
  { x: 18, y: 12, r: 4.2, s: 0.945, o: 0.96 },
  { x: -16, y: 22, r: -5.2, s: 0.89, o: 0.9 },
  { x: 10, y: 30, r: 7.0, s: 0.84, o: 0.78 },
  { x: -8, y: 36, r: -6.5, s: 0.79, o: 0.45 },
  { x: 0, y: 40, r: 2.5, s: 0.75, o: 0 }
];

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Living Sky & Driving Road Scene ---------- */
const stars = $('#stars');
const small = innerWidth < 700;
for (let i = 0; i < (small ? 28 : 50); i++) {
  const s = document.createElement('i');
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 70 + '%';
  s.style.animationDelay = Math.random() * 3 + 's';
  s.style.transform = `scale(${0.6 + Math.random() * 1.4})`;
  stars.appendChild(s);
}
const flies = $('#flies');
for (let i = 0; i < (small ? 8 : 14); i++) {
  const f = document.createElement('i');
  f.style.left = Math.random() * 100 + '%';
  f.style.top = 40 + Math.random() * 40 + '%';
  f.style.animationDelay = -Math.random() * 9 + 's';
  f.style.animationDuration = 6 + Math.random() * 6 + 's';
  flies.appendChild(f);
}

const KEYS = [
  { p: 0.00, sky1: '#f6b98a', sky2: '#ffe3b8', ink: '#2b1d14', h1: '#c9785a', h2: '#a85a45', h3: '#7a3f33' },
  { p: 0.32, sky1: '#6fb7e8', sky2: '#d6f0ff', ink: '#1d2b36', h1: '#86b6a0', h2: '#5f9a85', h3: '#3f7a68' },
  { p: 0.64, sky1: '#f08a4b', sky2: '#ffd08a', ink: '#2b1d14', h1: '#b0603f', h2: '#8a4733', h3: '#5e2f26' },
  { p: 0.86, sky1: '#1b2150', sky2: '#4a3a7a', ink: '#f6ead6', h1: '#2c2f63', h2: '#20244e', h3: '#151a3b' },
  { p: 1.00, sky1: '#0b0f2b', sky2: '#26214f', ink: '#f6ead6', h1: '#1a1d45', h2: '#12163a', h3: '#0b0e26' }
];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function palette(p) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i], b = KEYS[i + 1], t = clamp((p - a.p) / (b.p - a.p));
  const o = {};
  ['sky1', 'sky2', 'ink', 'h1', 'h2', 'h3'].forEach(k => { o[k] = mix(a[k], b[k], t); });
  return o;
}

const root = document.documentElement.style;
const skyEl = $('#sky'), sceneEl = $('.scene');
const sun = $('#sun'), moon = $('#moon'), clouds = $('#clouds'), starsEl = $('#stars');
const l1 = $('#l1'), l2 = $('#l2'), l3 = $('#l3'), road = $('#road');
const w1 = $('#w1'), w2 = $('#w2'), beam = $('#beam'), lamp = $('#lamp'), roadLight = $('#roadlight');
const prog = $('#progress'), vanEl = $('#van');

let MAX = 1, VW = innerWidth, VH = innerHeight, tiles = [0, 0, 0], lastQ = -1, lastY = scrollY;
function measure() {
  VW = innerWidth;
  VH = innerHeight;
  MAX = Math.max(1, document.documentElement.scrollHeight - VH);
  tiles = [l1, l2, l3].map(el => el.offsetWidth / 2 || 600);
}
const setT = (el, v) => { if (el && el._t !== v) { el._t = v; el.style.transform = v; } };

function frame() {
  const y = scrollY, p = clamp(y / MAX);
  const q = Math.round(p * 80);
  if (q !== lastQ) {
    lastQ = q;
    const c = palette(q / 80);
    skyEl.style.setProperty('--sky1', c.sky1);
    skyEl.style.setProperty('--sky2', c.sky2);
    sceneEl.style.setProperty('--h1', c.h1);
    sceneEl.style.setProperty('--h2', c.h2);
    sceneEl.style.setProperty('--h3', c.h3);
    root.setProperty('--ink', c.ink);
  }
  const ts = clamp(p / 0.72);
  setT(sun, `translate3d(${(0.08 + 0.84 * ts) * VW}px,${(0.60 - Math.sin(Math.PI * ts) * 0.48) * VH}px,0) translate(-50%,-50%)`);
  sun.style.opacity = (1 - clamp((p - 0.62) / 0.1)).toFixed(2);
  const tm = clamp((p - 0.72) / 0.28);
  setT(moon, `translate3d(${(0.18 + 0.64 * tm) * VW}px,${(0.46 - Math.sin(Math.PI * tm) * 0.26) * VH}px,0) translate(-50%,-50%)`);
  moon.style.opacity = clamp((p - 0.7) / 0.08).toFixed(2);
  starsEl.style.opacity = clamp((p - 0.72) / 0.16).toFixed(2);
  clouds.style.opacity = (1 - clamp((p - 0.68) / 0.2) * 0.85).toFixed(2);

  [[l1, 0.10], [l2, 0.22], [l3, 0.42]].forEach(([el, k], i) => {
    setT(el, `translate3d(${-((y * k) % tiles[i])}px,0,0)`);
  });
  road.style.setProperty('--rx', -(y * 0.9 % 80) + 'px');

  const rot = `rotate(${(y * 0.9) % 360}deg)`;
  setT(w1, rot);
  setT(w2, rot);

  const beamOp = (clamp((p - 0.74) / 0.1) * 0.95).toFixed(2);
  beam.style.opacity = beamOp;
  if (lamp) lamp.style.opacity = beamOp;
  if (roadLight) roadLight.style.opacity = beamOp;

  setT(prog, `scaleX(${p.toFixed(4)})`);
  const fo = clamp((p - 0.76) / 0.12);
  flies.style.opacity = fo.toFixed(2);
  flies.style.visibility = fo > 0 ? 'visible' : 'hidden';

  const dy = y - lastY;
  lastY = y;
  vanEl.style.rotate = clamp(dy / 60, -1, 1) * -2.5 + 'deg';
  clearTimeout(frame.t);
  frame.t = setTimeout(() => { vanEl.style.rotate = '0deg'; }, 120);
}

let tick = false;
addEventListener('scroll', () => {
  if (!tick) { tick = true; requestAnimationFrame(() => { frame(); tick = false; }); }
}, { passive: true });
addEventListener('resize', () => { measure(); frame(); });
addEventListener('load', () => { measure(); frame(); });
measure();
frame();

/* ---------- Pure Touch-Swipe Photo Stack ---------- */
const stage = $('#stack-stage');
const countEl = $('#s-count');
let active = 0;
let animating = false;
const cards = [];

PHOTOS.forEach((src, i) => {
  const c = document.createElement('div');
  c.className = 'p-card';
  c.innerHTML = `<div class="p-card-img"><img src="${src}" alt="HARIKZ photo ${i + 1}" draggable="false" loading="${i < 2 ? 'eager' : 'lazy'}"><span class="p-sheen" aria-hidden="true"></span></div>`;
  stage.appendChild(c);
  cards.push(c);
});

const slotOf = i => (i - active + PHOTOS.length) % PHOTOS.length;

function applyStack(prog = 0, immediate = false) {
  countEl.textContent = `${String(active + 1).padStart(2, '0')} / 0${PHOTOS.length}`;
  cards.forEach((card, i) => {
    const s = slotOf(i);
    const cur = SLOTS[Math.min(s, SLOTS.length - 1)];
    const nxt = SLOTS[Math.max(0, s - 1)];
    card.style.zIndex = String(PHOTOS.length - s + (s === 0 ? 10 : 0));
    card.classList.toggle('is-top', s === 0);
    if (s === 0 && prog > 0) return;
    const t = s > 0 ? prog : 0;
    const x = cur.x + (nxt.x - cur.x) * t;
    const y = cur.y + (nxt.y - cur.y) * t;
    const r = cur.r + (nxt.r - cur.r) * t;
    const sc = cur.s + (nxt.s - cur.s) * t;
    const op = cur.o + (nxt.o - cur.o) * t;
    card.style.transition = immediate || prog > 0 ? 'none' : 'transform 0.52s cubic-bezier(0.22, 1.25, 0.36, 1), opacity 0.38s ease';
    card.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    card.style.opacity = op.toFixed(3);
  });
}

function stepCard(dir) {
  if (animating) return;
  animating = true;
  const top = cards[active];
  const flyX = dir > 0 ? -Math.min(460, innerWidth * 0.95) : Math.min(460, innerWidth * 0.95);
  if (navigator.vibrate) navigator.vibrate(10);
  top.style.transition = 'transform 0.36s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s ease';
  top.style.transform = `translate3d(${flyX}px,-20px,0) rotate(${dir > 0 ? -22 : 22}deg) scale(0.94)`;
  top.style.opacity = '0';

  active = (active + (dir > 0 ? 1 : -1) + PHOTOS.length) % PHOTOS.length;
  countEl.textContent = `${String(active + 1).padStart(2, '0')} / 0${PHOTOS.length}`;
  cards.forEach((c, i) => {
    if (c === top) return;
    const s = slotOf(i);
    const slot = SLOTS[Math.min(s, SLOTS.length - 1)];
    c.style.zIndex = String(PHOTOS.length - s + (s === 0 ? 10 : 0));
    c.classList.toggle('is-top', s === 0);
    c.style.transition = 'transform 0.5s cubic-bezier(0.22, 1.25, 0.36, 1), opacity 0.38s ease';
    c.style.transform = `translate3d(${slot.x}px,${slot.y}px,0) rotate(${slot.r}deg) scale(${slot.s})`;
    c.style.opacity = String(slot.o);
  });
  setTimeout(() => { applyStack(0, true); animating = false; }, 350);
}

let dragging = false, locked = null, sx = 0, sy = 0, lx = 0, lt = 0, vx = 0, pid = null, dragCard = null;
stage.addEventListener('pointerdown', e => {
  if (animating || (e.pointerType === 'mouse' && e.button !== 0)) return;
  dragCard = cards[active];
  dragging = true;
  locked = null;
  pid = e.pointerId;
  sx = lx = e.clientX;
  sy = e.clientY;
  lt = performance.now();
  vx = 0;
  dragCard.classList.add('is-dragging');
  dragCard.style.transition = 'none';
  try { stage.setPointerCapture(pid); } catch (_) {}
});

stage.addEventListener('pointermove', e => {
  if (!dragging || !dragCard) return;
  const dx = e.clientX - sx, dy = e.clientY - sy;
  if (locked === null) {
    if (Math.hypot(dx, dy) < 8) return;
    if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.15) {
      dragging = false;
      dragCard.classList.remove('is-dragging');
      try { stage.releasePointerCapture(pid); } catch (_) {}
      applyStack(0, false);
      return;
    }
    locked = 'h';
  }
  if (locked === 'h') {
    const now = performance.now();
    const dt = Math.max(8, now - lt) / 1000;
    vx = vx * 0.4 + ((e.clientX - lx) / dt) * 0.6;
    lx = e.clientX;
    lt = now;
    const liftY = Math.max(-40, Math.min(34, dy * 0.35 - Math.abs(dx) * 0.06));
    dragCard.style.transform = `translate3d(${dx.toFixed(1)}px,${liftY.toFixed(1)}px,0) rotate(${(dx * 0.068).toFixed(2)}deg) scale(1.02)`;
    const rect = dragCard.getBoundingClientRect();
    dragCard.style.setProperty('--gx', `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    dragCard.style.setProperty('--gy', `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
    applyStack(Math.min(1, Math.abs(dx) / 140), false);
  }
});

function endDrag(e) {
  if (!dragging || !dragCard) return;
  dragging = false;
  dragCard.classList.remove('is-dragging');
  try { if (stage.hasPointerCapture(pid)) stage.releasePointerCapture(pid); } catch (_) {}
  const dx = e.clientX - sx, dy = e.clientY - sy;
  if (Math.hypot(dx, dy) < 9) {
    applyStack(0, false);
    openLightbox(active, false);
    return;
  }
  if (Math.abs(dx) > 65 || (Math.abs(vx) > 420 && Math.abs(dx) > 22)) stepCard(dx < 0 ? 1 : -1);
  else applyStack(0, false);
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

$('#s-prev').addEventListener('click', () => stepCard(-1));
$('#s-next').addEventListener('click', () => stepCard(1));
$('#s-play').addEventListener('click', () => openLightbox(active, true));
applyStack(0, true);

/* ---------- Pure 6-Photo Gallery Grid ---------- */
const grid = $('#photo-grid');
const tilts = [-1.8, 1.4, -1.2, 1.6, -1.5, 1.2];
PHOTOS.forEach((src, i) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pg-tile';
  btn.style.setProperty('--r', `${tilts[i % tilts.length]}deg`);
  btn.setAttribute('aria-label', `Open photo ${i + 1}`);
  btn.innerHTML = `<div class="pg-frame"><img src="${src}" alt="HARIKZ photo ${i + 1}" loading="lazy"><span class="p-sheen" aria-hidden="true"></span></div>`;
  btn.addEventListener('click', () => openLightbox(i, false));
  if (!reduceMotion) {
    const baseR = `${tilts[i % tilts.length]}deg`;
    const tiltTo = e => {
      const r = btn.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / r.width);
      const py = clamp((e.clientY - r.top) / r.height);
      btn.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      btn.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      btn.style.transform = `perspective(800px) rotateX(${((0.5 - py) * 10).toFixed(2)}deg) rotateY(${((px - 0.5) * 12).toFixed(2)}deg) scale(1.03)`;
    };
    const reset = () => { btn.style.transform = `rotate(${baseR})`; };
    btn.addEventListener('pointerdown', tiltTo);
    btn.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons > 0) tiltTo(e); });
    btn.addEventListener('pointerup', reset);
    btn.addEventListener('pointercancel', reset);
    btn.addEventListener('pointerleave', reset);
  }
  grid.appendChild(btn);
});

/* ---------- Minimal Fullscreen Photo Lightbox ---------- */
const lb = $('#lightbox');
const lbImg = $('#lb-img');
const lbFrame = $('#lb-frame');
const lbCount = $('#lb-count');
const lbPlay = $('#lb-play');
const lbTimer = $('#lb-timer');
const lbStrip = $('#lb-strip');

let curIdx = 0, playing = false, autoRaf = 0, slideStart = 0;
const SLIDE_MS = 4800;

PHOTOS.forEach((src, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'lb-thumb';
  b.setAttribute('aria-label', `Photo ${i + 1}`);
  b.innerHTML = `<img src="${src}" alt="">`;
  b.addEventListener('click', () => showSlide(i));
  lbStrip.appendChild(b);
});

function showSlide(i) {
  curIdx = (i + PHOTOS.length) % PHOTOS.length;
  lbCount.textContent = `${String(curIdx + 1).padStart(2, '0')} / 0${PHOTOS.length}`;
  lbImg.classList.remove('kenburns');
  lbImg.src = PHOTOS[curIdx];
  void lbImg.offsetWidth;
  if (!reduceMotion) lbImg.classList.add('kenburns');
  $$('.lb-thumb').forEach((t, idx) => t.classList.toggle('active', idx === curIdx));
  slideStart = performance.now();
  if (!playing) lbTimer.style.width = `${((curIdx + 1) / PHOTOS.length) * 100}%`;
}

function stepAuto(now) {
  if (!playing) return;
  const pct = Math.min(1, (now - slideStart) / SLIDE_MS);
  lbTimer.style.width = `${(pct * 100).toFixed(1)}%`;
  if (pct >= 1) showSlide(curIdx + 1);
  autoRaf = requestAnimationFrame(stepAuto);
}

function setPlay(on) {
  playing = on;
  lbPlay.classList.toggle('playing', on);
  lbPlay.textContent = on ? '❚❚' : '▶';
  cancelAnimationFrame(autoRaf);
  if (on) {
    slideStart = performance.now();
    autoRaf = requestAnimationFrame(stepAuto);
  } else {
    lbTimer.style.width = `${((curIdx + 1) / PHOTOS.length) * 100}%`;
  }
}

function openLightbox(idx, auto = false) {
  lb.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  showSlide(idx);
  setPlay(auto);
  $('#lb-close').focus();
}

function closeLightbox() {
  setPlay(false);
  lb.hidden = true;
  document.documentElement.style.overflow = '';
}

$('#lb-close').addEventListener('click', closeLightbox);
$('#lb-backdrop').addEventListener('click', closeLightbox);
$('#lb-prev').addEventListener('click', () => showSlide(curIdx - 1));
$('#lb-next').addEventListener('click', () => showSlide(curIdx + 1));
lbPlay.addEventListener('click', () => setPlay(!playing));

addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') showSlide(curIdx + 1);
  else if (e.key === 'ArrowLeft') showSlide(curIdx - 1);
  else if (e.key === ' ') { e.preventDefault(); setPlay(!playing); }
});

// Live 1:1 finger swipe inside lightbox
let lbTouchX = 0, lbDragging = false;
$('#lb-stage').addEventListener('touchstart', e => {
  if (!e.touches.length) return;
  lbTouchX = e.touches[0].clientX;
  lbDragging = true;
  lbFrame.style.transition = 'none';
}, { passive: true });
$('#lb-stage').addEventListener('touchmove', e => {
  if (!lbDragging || !e.touches.length) return;
  const dx = e.touches[0].clientX - lbTouchX;
  lbFrame.style.transform = `translate3d(${(dx * 0.65).toFixed(1)}px,0,0) rotate(${(dx * 0.035).toFixed(2)}deg)`;
}, { passive: true });
$('#lb-stage').addEventListener('touchend', e => {
  if (!lbDragging) return;
  lbDragging = false;
  const dx = e.changedTouches[0].clientX - lbTouchX;
  lbFrame.style.transition = 'transform 0.3s cubic-bezier(0.22, 1.25, 0.36, 1)';
  lbFrame.style.transform = '';
  if (Math.abs(dx) > 45) showSlide(dx < 0 ? curIdx + 1 : curIdx - 1);
});

// Support #photo-N deep links from homepage
const hm = location.hash.match(/^#photo-(\d+)$/);
if (hm) {
  const idx = Math.max(0, Math.min(PHOTOS.length - 1, Number(hm[1]) - 1));
  active = idx;
  applyStack(0, true);
  openLightbox(idx, false);
}

/* ---------- Driving Force Traveller cutout ---------- */
(function () {
  const cv = document.getElementById('vanimg'), img = new Image();
  img.onload = () => {
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const sc = Math.min(1, 900 / img.naturalWidth);
    const w = Math.round(img.naturalWidth * sc), h = Math.round(img.naturalHeight * sc);
    cv.width = w; cv.height = h; ctx.drawImage(img, 0, 0, w, h);
    const id = ctx.getImageData(0, 0, w, h), d = id.data, seen = new Uint8Array(w * h), st = [];
    const bg = i => d[i * 4] > 238 && d[i * 4 + 1] > 238 && d[i * 4 + 2] > 238;
    const push = i => { if (!seen[i] && bg(i)) { seen[i] = 1; st.push(i); } };
    for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
    while (st.length) {
      const i = st.pop(), x = i % w, y = (i / w) | 0;
      d[i * 4 + 3] = 0;
      if (x > 0) push(i - 1); if (x < w - 1) push(i + 1); if (y > 0) push(i - w); if (y < h - 1) push(i + w);
    }
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!seen[i] && (seen[i - 1] || seen[i + 1] || seen[i - w] || seen[i + w])) d[i * 4 + 3] = 150;
    }
    ctx.putImageData(id, 0, 0);
  };
  img.src = '../traveller-side.jpg';
})();
