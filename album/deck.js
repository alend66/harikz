/* HARIKZ Interactive Touch-Swipe 3D Polaroid Travel Deck */
(function () {
  const DECK_PHOTOS = [
    {
      file: 'harikz-travel-hub-poster.jpg',
      stop: 'STOP 01',
      km: 'KM 000',
      tag: 'AVITTATHUR · IRINJALAKUDA',
      title: 'Harikz',
      em: 'Travel Hub',
      caption: 'Explore · Travel · Repeat',
      desc: 'Safe, comfortable, and budget-friendly rides 24×7 — from 5-seater cars and 12–17 seater Tempo Travellers up to 49-seater luxury buses.',
      stamp: 'IRINJALAKUDA',
      stampSub: '24×7 HUB',
      plate: '5 – 49 SEATERS',
      teal: false,
      wa: 'Hello HARIKZ, I saw your Travel Album and want to book a trip!'
    },
    {
      file: 'forest-road-traveller.jpg',
      stop: 'STOP 02',
      km: 'KM 048',
      tag: 'FOREST CANOPY · WESTERN GHATS',
      title: 'Into the',
      em: 'Green Trails',
      caption: 'Under the green forest canopy',
      desc: 'Quiet forest highways, towering teak trees, and wide panoramic windows built for relaxed group journeys and waterfall escapes.',
      stamp: 'FOREST TRAIL',
      stampSub: 'NATURE ROUTE',
      plate: 'KL 52 G 5468',
      teal: true,
      wa: 'Hello HARIKZ, I would like to book Force Traveller KL 52 G 5468 for a group trip!'
    },
    {
      file: 'misty-hill-drive.jpg',
      stop: 'STOP 03',
      km: 'KM 112',
      tag: 'CLOUD LINE · MISTY GHATS',
      title: 'Above the',
      em: 'Morning Mist',
      caption: 'Chasing clouds up the ghats',
      desc: 'Early-morning fog rolling over hill-station hairpins — driven smoothly by experienced ghat-road drivers who know every bend.',
      stamp: 'MISTY HILLS',
      stampSub: 'ELEV. 1,600M',
      plate: 'KL 45 Z 9292',
      teal: false,
      wa: 'Hello HARIKZ, I want to plan a misty hill station trip!'
    },
    {
      file: 'mountain-highway-stop.jpg',
      stop: 'STOP 04',
      km: 'KM 176',
      tag: 'MOUNTAIN HIGHWAY · OPEN SKIES',
      title: 'Pit Stop at',
      em: 'the Summit',
      caption: 'Chai stop with a mountain view',
      desc: 'Sunny high-range roads, sweeping valley panoramas, and unhurried roadside stops whenever your crew wants photos or hot tea.',
      stamp: 'HIGH RANGE',
      stampSub: 'OPEN SKIES',
      plate: 'KL 45 Z 9292',
      teal: true,
      wa: 'Hello HARIKZ, I want to book KL 45 Z 9292 for a mountain trip!'
    },
    {
      file: 'monsoon-pitstop-force.jpg',
      stop: 'STOP 05',
      km: 'KM 230',
      tag: 'MONSOON DRIVE · ALL WEATHER',
      title: 'Monsoon',
      em: 'Miles Ahead',
      caption: 'Fuelled up & rain-ready',
      desc: 'Topped up, spotless, and rain-ready — whether it is a midnight airport pickup or a multi-day Kerala monsoon road trip.',
      stamp: 'MONSOON RUN',
      stampSub: 'ALL WEATHER',
      plate: 'KL 45 D 7718',
      teal: false,
      wa: 'Hello HARIKZ, I would like to book Force Traveller KL 45 D 7718!'
    },
    {
      file: 'fleet-duo-ready.jpg',
      stop: 'STOP 06',
      km: 'KM 295',
      tag: 'FLEET LINEUP · READY ON CALL',
      title: 'Your Fleet,',
      em: 'Your Pace',
      caption: 'Big group or quick ride — ready 24×7',
      desc: 'From nimble 5-seater WagonR city & airport runs to our flagship Force Traveller for family and friends — always clean and on time.',
      stamp: 'FLEET LINEUP',
      stampSub: 'READY TO ROLL',
      plate: 'KL 45 D 7718 · KL 45 AA 0924',
      teal: true,
      wa: 'Hello HARIKZ, I want to enquire about your 5 to 49 seater fleet!'
    }
  ];

  // Rest poses for stacked cards [offsetX, offsetY, rotateDeg, scale, opacity]
  const STACK_SLOTS = [
    { x: 0, y: 0, r: -1.5, s: 1.0, o: 1 },
    { x: 18, y: 12, r: 4.5, s: 0.945, o: 0.96 },
    { x: -16, y: 22, r: -5.5, s: 0.89, o: 0.9 },
    { x: 10, y: 30, r: 7.5, s: 0.835, o: 0.78 },
    { x: -8, y: 36, r: -7.0, s: 0.79, o: 0.45 },
    { x: 0, y: 40, r: 3.0, s: 0.75, o: 0 }
  ];

  window.HARIKZ_DECK_PHOTOS = DECK_PHOTOS;

  window.initHarikzDeck = function initHarikzDeck(opts) {
    const root = typeof opts.container === 'string' ? document.querySelector(opts.container) : opts.container;
    if (!root) return null;
    const basePath = opts.basePath || 'album/photos/';
    const showFullAlbumLink = opts.showFullAlbumLink !== false;
    const onOpenPhoto = typeof opts.onOpenPhoto === 'function' ? opts.onOpenPhoto : null;

    root.innerHTML = `
      <div class="tdeck-grid">
        <div class="tdeck-left">
          <div class="tdeck-hint" aria-hidden="true">
            <span class="tdeck-hand">👆</span>
            <span>Touch &amp; swipe photos</span>
          </div>
          <div class="tdeck-stage" role="region" aria-label="Interactive swipeable travel photo stack"></div>
          <div class="tdeck-controls">
            <button type="button" class="tdeck-arrow tdeck-prev" aria-label="Previous photo">‹</button>
            <div class="tdeck-counter"><b class="tdeck-cur">01</b><span> / 0${DECK_PHOTOS.length}</span></div>
            <button type="button" class="tdeck-arrow tdeck-next" aria-label="Next photo">›</button>
          </div>
        </div>
        <div class="tdeck-info">
          <div class="tdeck-badge-row">
            <span class="tdeck-km">KM 000 · STOP 01</span>
            <span class="tdeck-plate">5 – 49 SEATERS</span>
          </div>
          <span class="tdeck-tag">AVITTATHUR · IRINJALAKUDA</span>
          <h3 class="tdeck-title">Harikz <em>Travel Hub</em></h3>
          <p class="tdeck-desc"></p>
          <div class="tdeck-cta">
            <a class="btn tdeck-wa" href="https://wa.me/918137037555" target="_blank" rel="noopener">Book This Ride</a>
            ${showFullAlbumLink
              ? '<a class="btn alt tdeck-album-btn" href="album/">Full Route Album →</a>'
              : '<button type="button" class="btn alt tdeck-fs-btn">View Fullscreen ⤢</button>'}
          </div>
          <div class="tdeck-strip-wrap">
            <span class="tdeck-strip-label">All 6 road-trip photos — tap any to jump</span>
            <div class="tdeck-strip" role="tablist" aria-label="Choose a photo"></div>
          </div>
        </div>
      </div>
    `;

    const stage = root.querySelector('.tdeck-stage');
    const hint = root.querySelector('.tdeck-hint');
    const curEl = root.querySelector('.tdeck-cur');
    const kmEl = root.querySelector('.tdeck-km');
    const plateEl = root.querySelector('.tdeck-plate');
    const tagEl = root.querySelector('.tdeck-tag');
    const titleEl = root.querySelector('.tdeck-title');
    const descEl = root.querySelector('.tdeck-desc');
    const waEl = root.querySelector('.tdeck-wa');
    const fsBtn = root.querySelector('.tdeck-fs-btn');
    const strip = root.querySelector('.tdeck-strip');

    let active = 0;
    let animating = false;
    const cards = [];
    const thumbs = [];

    // Create all 6 cards + filmstrip thumbnails
    DECK_PHOTOS.forEach((p, idx) => {
      const card = document.createElement('figure');
      card.className = 'tdeck-card';
      card.dataset.idx = String(idx);
      card.innerHTML = `
        <span class="tdeck-tape" aria-hidden="true"></span>
        <div class="tdeck-img-wrap">
          <img src="${basePath}${p.file}?v=ai2" alt="${p.title} ${p.em} — ${p.caption}" draggable="false" loading="${idx < 2 ? 'eager' : 'lazy'}">
          <span class="tdeck-sheen" aria-hidden="true"></span>
          <span class="tdeck-swipe-stamp is-next" aria-hidden="true">NEXT STOP →</span>
          <span class="tdeck-swipe-stamp is-prev" aria-hidden="true">← PREV STOP</span>
        </div>
        <figcaption>
          <span class="tdeck-cap">${p.caption}</span>
          <span class="tdeck-mini-plate">${p.plate}</span>
        </figcaption>
        <div class="tdeck-stamp ${p.teal ? 'teal' : ''}" aria-hidden="true">
          <span>${p.stamp}</span>
          <small>${p.stampSub}</small>
        </div>
      `;
      stage.appendChild(card);
      cards.push(card);

      const th = document.createElement('button');
      th.type = 'button';
      th.className = 'tdeck-thumb';
      th.setAttribute('role', 'tab');
      th.setAttribute('aria-label', `Photo ${idx + 1}: ${p.title} ${p.em}`);
      th.innerHTML = `<img src="${basePath}${p.file}?v=ai2" alt="" loading="lazy"><span>0${idx + 1}</span>`;
      th.addEventListener('click', () => {
        dismissHint();
        goTo(idx);
      });
      strip.appendChild(th);
      thumbs.push(th);
    });

    function dismissHint() {
      if (hint && !hint.classList.contains('gone')) hint.classList.add('gone');
    }

    function slotOf(cardIdx) {
      return (cardIdx - active + DECK_PHOTOS.length) % DECK_PHOTOS.length;
    }

    function applyStack(dragProgress = 0, immediate = false) {
      cards.forEach((card, idx) => {
        const s = slotOf(idx);
        const curSlot = STACK_SLOTS[Math.min(s, STACK_SLOTS.length - 1)];
        const prevSlot = STACK_SLOTS[Math.max(0, s - 1)];

        card.style.zIndex = String(DECK_PHOTOS.length - s + (s === 0 ? 10 : 0));
        card.classList.toggle('is-top', s === 0);

        if (s === 0 && dragProgress > 0) return; // top card is driven by live drag

        const t = s > 0 ? dragProgress : 0;
        const x = curSlot.x + (prevSlot.x - curSlot.x) * t;
        const y = curSlot.y + (prevSlot.y - curSlot.y) * t;
        const r = curSlot.r + (prevSlot.r - curSlot.r) * t;
        const sc = curSlot.s + (prevSlot.s - curSlot.s) * t;
        const op = curSlot.o + (prevSlot.o - curSlot.o) * t;

        card.style.transition = immediate || dragProgress > 0
          ? 'none'
          : 'transform 0.55s cubic-bezier(0.22, 1.25, 0.36, 1), opacity 0.4s ease';
        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        card.style.opacity = op.toFixed(3);
        card.querySelectorAll('.tdeck-swipe-stamp').forEach(el => { el.style.opacity = '0'; });
      });
    }

    function syncInfo() {
      const p = DECK_PHOTOS[active];
      curEl.textContent = String(active + 1).padStart(2, '0');
      kmEl.textContent = `${p.km} · ${p.stop}`;
      plateEl.textContent = p.plate;
      tagEl.textContent = p.tag;
      titleEl.innerHTML = `${p.title} <em>${p.em}</em>`;
      descEl.textContent = p.desc;
      waEl.href = `https://wa.me/918137037555?text=${encodeURIComponent(p.wa)}`;

      thumbs.forEach((t, i) => {
        const on = i === active;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    function stepCard(dir) {
      if (animating) return;
      dismissHint();
      animating = true;
      const topCard = cards[active];
      const flyX = dir > 0 ? -Math.min(460, window.innerWidth * 0.95) : Math.min(460, window.innerWidth * 0.95);
      const flyR = dir > 0 ? -24 : 24;

      if (navigator.vibrate) navigator.vibrate(10);

      topCard.style.transition = 'transform 0.38s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.32s ease';
      topCard.style.transform = `translate3d(${flyX}px, -24px, 0) rotate(${flyR}deg) scale(0.94)`;
      topCard.style.opacity = '0';

      active = (active + (dir > 0 ? 1 : -1) + DECK_PHOTOS.length) % DECK_PHOTOS.length;
      syncInfo();

      // Immediately bring the next card forward
      cards.forEach((c, idx) => {
        if (c === topCard) return;
        const s = slotOf(idx);
        const slot = STACK_SLOTS[Math.min(s, STACK_SLOTS.length - 1)];
        c.style.zIndex = String(DECK_PHOTOS.length - s + (s === 0 ? 10 : 0));
        c.classList.toggle('is-top', s === 0);
        c.style.transition = 'transform 0.52s cubic-bezier(0.22, 1.25, 0.36, 1), opacity 0.4s ease';
        c.style.transform = `translate3d(${slot.x}px, ${slot.y}px, 0) rotate(${slot.r}deg) scale(${slot.s})`;
        c.style.opacity = String(slot.o);
      });

      setTimeout(() => {
        applyStack(0, true);
        animating = false;
      }, 360);
    }

    function goTo(targetIdx) {
      if (animating || targetIdx === active) return;
      active = (targetIdx + DECK_PHOTOS.length) % DECK_PHOTOS.length;
      syncInfo();
      applyStack(0, false);
    }

    /* ---------- Touch & Pointer 1:1 Swipe Gesture ---------- */
    let dragging = false;
    let locked = null; // 'h' | 'v' | null
    let startX = 0, startY = 0, lastX = 0, lastT = 0, vx = 0;
    let activeCard = null;
    let pointerId = null;

    stage.addEventListener('pointerdown', e => {
      if (animating || (e.pointerType === 'mouse' && e.button !== 0)) return;
      activeCard = cards[active];
      dragging = true;
      locked = null;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startY = e.clientY;
      lastT = performance.now();
      vx = 0;
      activeCard.classList.add('is-dragging');
      activeCard.style.transition = 'none';
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    });

    stage.addEventListener('pointermove', e => {
      if (!dragging || !activeCard) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Decide horizontal swipe vs vertical page scroll on touch
      if (locked === null) {
        if (Math.hypot(dx, dy) < 8) return;
        if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.15) {
          // User wants to scroll the page vertically
          dragging = false;
          activeCard.classList.remove('is-dragging');
          try { stage.releasePointerCapture(pointerId); } catch (_) {}
          applyStack(0, false);
          return;
        }
        locked = 'h';
        dismissHint();
      }

      if (locked === 'h') {
        const now = performance.now();
        const dt = Math.max(8, now - lastT) / 1000;
        vx = vx * 0.4 + ((e.clientX - lastX) / dt) * 0.6;
        lastX = e.clientX;
        lastT = now;

        const liftY = Math.max(-44, Math.min(36, dy * 0.35 - Math.abs(dx) * 0.06));
        const rot = dx * 0.068;
        const prog = Math.min(1, Math.abs(dx) / 145);

        activeCard.style.transform = `translate3d(${dx.toFixed(1)}px, ${liftY.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(1.02)`;

        // Sunbeam touch glare follows thumb/pointer
        const rect = activeCard.getBoundingClientRect();
        const gx = ((e.clientX - rect.left) / rect.width) * 100;
        const gy = ((e.clientY - rect.top) / rect.height) * 100;
        activeCard.style.setProperty('--gx', `${gx.toFixed(1)}%`);
        activeCard.style.setProperty('--gy', `${gy.toFixed(1)}%`);

        // Show swipe stamp when dragging
        const nextSt = activeCard.querySelector('.tdeck-swipe-stamp.is-next');
        const prevSt = activeCard.querySelector('.tdeck-swipe-stamp.is-prev');
        if (dx < -22) {
          nextSt.style.opacity = String(Math.min(1, (-dx - 22) / 65));
          prevSt.style.opacity = '0';
        } else if (dx > 22) {
          prevSt.style.opacity = String(Math.min(1, (dx - 22) / 65));
          nextSt.style.opacity = '0';
        } else {
          nextSt.style.opacity = '0';
          prevSt.style.opacity = '0';
        }

        applyStack(prog, false);
      }
    });

    function finishDrag(e) {
      if (!dragging || !activeCard) return;
      dragging = false;
      activeCard.classList.remove('is-dragging');
      try { if (stage.hasPointerCapture(pointerId)) stage.releasePointerCapture(pointerId); } catch (_) {}

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const moved = Math.hypot(dx, dy);

      if (moved < 9) {
        // Quick tap opens fullscreen / photo detail
        applyStack(0, false);
        if (onOpenPhoto) onOpenPhoto(active);
        else if (showFullAlbumLink) window.location.href = `album/#photo-${active + 1}`;
        return;
      }

      const fastFlick = Math.abs(vx) > 420 && Math.abs(dx) > 24;
      if (Math.abs(dx) > 68 || fastFlick) {
        stepCard(dx < 0 ? 1 : -1);
      } else {
        // Spring back cleanly
        activeCard.querySelectorAll('.tdeck-swipe-stamp').forEach(el => { el.style.opacity = '0'; });
        applyStack(0, false);
      }
    }

    stage.addEventListener('pointerup', finishDrag);
    stage.addEventListener('pointercancel', finishDrag);

    // Buttons & keyboard
    root.querySelector('.tdeck-prev').addEventListener('click', () => stepCard(-1));
    root.querySelector('.tdeck-next').addEventListener('click', () => stepCard(1));
    if (fsBtn && onOpenPhoto) fsBtn.addEventListener('click', () => onOpenPhoto(active));

    syncInfo();
    applyStack(0, true);

    return { goTo, next: () => stepCard(1), prev: () => stepCard(-1), getActive: () => active };
  };
})();
