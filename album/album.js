const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ---------- All 6 AI-World Travel Photos ---------- */
const PHOTOS = [
  'photos/harikz-travel-hub-poster.jpg?v=ai2',
  'photos/forest-road-traveller.jpg?v=ai4',
  'photos/misty-hill-drive.jpg?v=ai2',
  'photos/mountain-highway-stop.jpg?v=ai2',
  'photos/monsoon-pitstop-force.jpg?v=ai2',
  'photos/fleet-duo-ready.jpg?v=ai2'
];

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Living Sky, Flyers & Fireflies ---------- */
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
const flyers = $('#flyers'), prog = $('#progress'), vanEl = $('#van');

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
  if (flyers) {
    const fl = 1 - clamp((p - 0.62) / 0.15);
    flyers.style.opacity = fl.toFixed(2);
    flyers.style.visibility = fl > 0 ? 'visible' : 'hidden';
  }

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

/* ---------- Reveal Postcards on Scroll + Touch Sheen ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('on');
    io.unobserve(e.target);
  }
}), { threshold: 0.1 });
$$('.rv').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 90 + 'ms';
  io.observe(el);
});

$$('.album-pc').forEach(card => {
  const idx = Number(card.dataset.index);
  card.addEventListener('click', () => openLightbox(idx, false));

  const updateSheen = e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--gx', `${(clamp((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    card.style.setProperty('--gy', `${(clamp((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  card.addEventListener('pointerdown', e => { card.classList.add('touching'); updateSheen(e); });
  card.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons > 0) updateSheen(e); });
  const endTouch = () => card.classList.remove('touching');
  card.addEventListener('pointerup', endTouch);
  card.addEventListener('pointercancel', endTouch);
  card.addEventListener('pointerleave', endTouch);
});

/* ---------- Minimal Fullscreen Touch-Swipe Viewer ---------- */
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

// Live 1:1 finger swipe inside fullscreen lightbox
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
