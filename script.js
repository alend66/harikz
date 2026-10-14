const $ = s => document.querySelector(s);

/* ---------- stars ---------- */
const stars = $('#stars');
for (let i = 0; i < 90; i++) {
  const s = document.createElement('i');
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 70 + '%';
  s.style.animationDelay = Math.random() * 3 + 's';
  s.style.transform = `scale(${0.6 + Math.random() * 1.4})`;
  stars.appendChild(s);
}
const flies = $('#flies');
for (let i = 0; i < 28; i++) {
  const f = document.createElement('i');
  f.style.left = Math.random() * 100 + '%';
  f.style.top = 40 + Math.random() * 40 + '%';
  f.style.animationDelay = -Math.random() * 9 + 's';
  f.style.animationDuration = 6 + Math.random() * 6 + 's';
  flies.appendChild(f);
}
const flyers = $('#flyers'), prog = $('#progress'), vanEl = $('#van');
let lastY = scrollY;

/* ---------- time-of-day keyframes (dawn -> day -> sunset -> night) ---------- */
const KEYS = [
  { p: 0.00, sky1: '#f6b98a', sky2: '#ffe3b8', ink: '#2b1d14', h1: '#c9785a', h2: '#a85a45', h3: '#7a3f33' },
  { p: 0.30, sky1: '#6fb7e8', sky2: '#d6f0ff', ink: '#1d2b36', h1: '#86b6a0', h2: '#5f9a85', h3: '#3f7a68' },
  { p: 0.58, sky1: '#f08a4b', sky2: '#ffd08a', ink: '#2b1d14', h1: '#b0603f', h2: '#8a4733', h3: '#5e2f26' },
  { p: 0.80, sky1: '#1b2150', sky2: '#4a3a7a', ink: '#f6ead6', h1: '#2c2f63', h2: '#20244e', h3: '#151a3b' },
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
  ['sky1', 'sky2', 'ink', 'h1', 'h2', 'h3'].forEach(k => o[k] = mix(a[k], b[k], t));
  return o;
}

/* ---------- elements ---------- */
const root = document.documentElement.style;
const sun = $('#sun'), moon = $('#moon'), clouds = $('#clouds'), starsEl = $('#stars');
const l1 = $('#l1'), l2 = $('#l2'), l3 = $('#l3'), road = $('#road');
const w1 = $('#w1'), w2 = $('#w2'), beam = $('#beam');
const kmEl = $('#hud-km'), stopEl = $('#hud-stop');

function frame() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const y = scrollY, p = max > 0 ? clamp(y / max) : 0;

  // sky + hills colours
  const c = palette(p);
  Object.entries(c).forEach(([k, v]) => root.setProperty('--' + k, v));

  // sun arc (day) / moon arc (night)
  const ts = clamp(p / 0.72);
  sun.style.left = 8 + 84 * ts + '%';
  sun.style.top = 60 - Math.sin(Math.PI * ts) * 48 + '%';
  sun.style.opacity = 1 - clamp((p - 0.62) / 0.1);
  const low = 1 - Math.sin(Math.PI * ts);
  sun.style.filter = `hue-rotate(${-low * 25}deg) saturate(${1 + low})`;
  const tm = clamp((p - 0.72) / 0.28);
  moon.style.left = 18 + 64 * tm + '%';
  moon.style.top = 46 - Math.sin(Math.PI * tm) * 26 + '%';
  moon.style.opacity = clamp((p - 0.7) / 0.08);
  starsEl.style.opacity = clamp((p - 0.72) / 0.16);
  clouds.style.opacity = 1 - clamp((p - 0.68) / 0.2) * 0.85;

  // parallax: the world slides past the van
  [[l1, 0.10], [l2, 0.22], [l3, 0.42]].forEach(([el, k]) => {
    const tile = el.offsetWidth / 2;
    el.style.transform = `translateX(${-((y * k) % tile)}px)`;
  });
  root.setProperty('--rx', -(y * 0.9 % 80) + 'px');

  // wheels spin with scroll
  const deg = y * 0.9;
  w1.style.transform = w2.style.transform = `rotate(${deg}deg)`;

  // headlights at night
  beam.style.opacity = clamp((p - 0.74) / 0.1) * 0.9;

  // odometer
  kmEl.textContent = String(Math.round(p * 1240)).padStart(4, '0');

  // extras: progress bar, fireflies, day-only flyers, van tilt on speed
  prog.style.transform = `scaleX(${p})`;
  flies.style.opacity = clamp((p - 0.76) / 0.12);
  flyers.style.opacity = 1 - clamp((p - 0.62) / 0.15);
  const dy = y - lastY; lastY = y;
  vanEl.style.rotate = clamp(dy / 60, -1, 1) * -2.5 + 'deg';
  clearTimeout(frame.t); frame.t = setTimeout(() => { vanEl.style.rotate = '0deg'; }, 120);
}
let tick = false;
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { frame(); tick = false; }); } }, { passive: true });
addEventListener('resize', frame);
frame();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + 'ms'; io.observe(el); });

/* ---------- current stop on the HUD ---------- */
const so = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) stopEl.textContent = e.target.dataset.stop;
}), { rootMargin: '-40% 0px -50% 0px' });
document.querySelectorAll('[data-stop]').forEach(s => so.observe(s));

/* ---------- reservation -> WhatsApp ---------- */
$('#booking-form').addEventListener('submit', e => {
  e.preventDefault();
  const v = id => encodeURIComponent($(id).value);
  const msg = `Hello HARIKZ, I want to save a seat!%0APassenger: ${v('#b-name')}%0ARoute: ${v('#b-place')}%0ADate: ${v('#b-date')}%0AVehicle: ${v('#b-seat')}`;
  window.open('https://wa.me/918137037555?text=' + msg, '_blank');
});

/* ---------- crop Instagram embeds so likes / comment bar never show ---------- */
const FOOTER = 195;
addEventListener('message', e => {
  if (!/instagram\.com$/.test(new URL(e.origin).hostname)) return;
  let d = e.data; try { if (typeof d === 'string') d = JSON.parse(d); } catch (_) { return; }
  const h = d && d.details && d.details.height;
  if (!h || d.type !== 'MEASURE') return;
  document.querySelectorAll('.pcf iframe').forEach(f => {
    if (f.contentWindow === e.source) { f.style.height = h + 'px'; f.parentElement.style.height = Math.max(300, h - FOOTER) + 'px'; }
  });
});

/* ---------- real Traveller photo: cut the white backdrop out (flood-fill from edges) ---------- */
(function () {
  const cv = document.getElementById('vanimg'), img = new Image();
  img.onload = () => {
    const w = img.naturalWidth, h = img.naturalHeight, ctx = cv.getContext('2d', { willReadFrequently: true });
    cv.width = w; cv.height = h; ctx.drawImage(img, 0, 0);
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
    // soften the cut edge: pixels touching removed area get partial alpha
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!seen[i] && (seen[i - 1] || seen[i + 1] || seen[i - w] || seen[i + w])) d[i * 4 + 3] = 150;
    }
    ctx.putImageData(id, 0, 0);
  };
  img.src = 'traveller-side.jpg';
})();
