window.pctInitPhotoArc = function () {
  const band = document.querySelector('.mem');
  if (!band || !window.IntersectionObserver) return;
  const list = band.querySelector('.mem-wheel');
  let cards = [...list.children];
  const track = [];
  let ready = false;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let startedAt;
  let geometry;

  function measure() {
    const width = list.clientWidth;
    const cardWidth = cards[0].offsetWidth;
    const cardHeight = cards[0].offsetHeight;
    const sideInset = Math.max(8, width * .018);
    const pitch = cardWidth + Math.min(24, Math.max(10, width * .02));
    // Wrap cards only after their entire rotated bounds are outside the stage.
    const runway = width + cardWidth + cardHeight;
    while (track.length * pitch < runway) {
      const copies = cards.map(card => {
        const copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        return copy;
      });
      track.push(...copies);
      list.append(...copies);
    }
    geometry = {
      center: width / 2, cardWidth, cardHeight, pitch,
      edge: width / 2 - sideInset,
      room: list.clientHeight - cardHeight,
      tilt: width < 600 ? 9 : 13,
    };
  }

  function paint(time) {
    const {center, cardWidth, cardHeight, pitch, edge, room, tilt} = geometry;
    if (edge <= 0) return;
    const full = track.length;
    const phase = ((time - startedAt) / 8000) % full;
    track.forEach((card, index) => {
      const column = ((index - phase + full * 2.5) % full) - full / 2;
      const x = column * pitch;
      const progress = Math.max(-1, Math.min(1, x / edge));
      const angle = progress * tilt;
      const radians = Math.abs(angle) * Math.PI / 180;
      const tiltDepth = Math.max(0, (cardHeight * (Math.cos(radians) - 1) + cardWidth * Math.sin(radians)) / 2);
      const y = room * (.19 + .59 * progress * progress) - tiltDepth * progress * progress;
      card.style.transform = `translate3d(${center + x - cardWidth / 2}px, ${y}px, 0) rotate(${angle}deg)`;
    });
  }

  function tick(time) {
    paint(time);
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const enhanced = ready && cards.length >= 3 && !motion.matches;
    band.classList.toggle('is-enhanced', enhanced);
    if (enhanced) {
      list.removeAttribute('tabindex');
      list.scrollLeft = 0;
      measure();
      const now = performance.now();
      startedAt ??= now;
      paint(now);
      if (!frame) frame = requestAnimationFrame(tick);
    } else {
      list.setAttribute('tabindex', '0');
      track.forEach(card => card.style.removeProperty('transform'));
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }
  }

  const images = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    images.disconnect();
    const loaded = await Promise.all(cards.map(async card => {
      const image = card.querySelector('img');
      image.loading = 'eager';
      try {
        await image.decode();
        return true;
      } catch {
        card.hidden = true;
        return false;
      }
    }));
    cards = cards.filter((_, index) => loaded[index]);
    track.push(...cards);
    ready = true;
    sync();
  }, {rootMargin: '680px 0px'});
  images.observe(band);

  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(list);
  else window.addEventListener('resize', sync, {passive: true});
  motion.addEventListener('change', sync);
};
