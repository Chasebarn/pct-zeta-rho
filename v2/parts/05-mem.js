window.pctInitPhotoArc = function () {
  const band = document.querySelector('.mem');
  if (!band || !window.IntersectionObserver) return;
  const list = band.querySelector('.mem-wheel');
  const cards = [...list.children];
  if (cards.length < 3) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let nearby = false;
  let frame = 0;
  let previousTime;
  let phase = 1.3;
  let geometry;

  function measure() {
    const width = list.clientWidth;
    const cardWidth = cards[0].offsetWidth;
    const cardHeight = cards[0].offsetHeight;
    const sideInset = Math.max(8, width * .018);
    const pitch = cardWidth + Math.min(24, Math.max(10, width * .02));
    geometry = {
      center: width / 2, cardWidth, cardHeight, pitch,
      edge: Math.min(width / 2 - sideInset, pitch * (cards.length / 2 - .2)),
      room: list.clientHeight - cardHeight,
      tilt: width < 600 ? 9 : 13,
      fade: Math.min(32, Math.max(14, width * .035)),
    };
  }

  function paint() {
    const {center, cardWidth, cardHeight, pitch, edge, room, tilt, fade} = geometry;
    if (edge <= 0) return;
    const full = cards.length;
    cards.forEach((card, index) => {
      const column = ((index - phase + full * 2.5) % full) - full / 2;
      const x = column * pitch;
      const progress = Math.max(-1, Math.min(1, x / edge));
      const angle = progress * tilt;
      const radians = Math.abs(angle) * Math.PI / 180;
      const halfWidth = (cardWidth * Math.cos(radians) + cardHeight * Math.sin(radians)) / 2;
      const tiltDepth = Math.max(0, (cardHeight * (Math.cos(radians) - 1) + cardWidth * Math.sin(radians)) / 2);
      const y = room * (.19 + .59 * progress * progress) - tiltDepth * progress * progress;
      // A photo is already transparent by the time its rotated edge can leave the stage.
      const opacity = Math.max(0, Math.min(1, (edge - Math.abs(x) - halfWidth) / fade));
      card.style.transform = `translate3d(${center + x - cardWidth / 2}px, ${y}px, 0) rotate(${angle}deg)`;
      card.style.opacity = opacity;
    });
  }

  function tick(time) {
    if (previousTime !== undefined) phase = (phase + Math.min(75, time - previousTime) / 8000) % cards.length;
    previousTime = time;
    paint();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const enhanced = !motion.matches;
    band.classList.toggle('is-enhanced', enhanced);
    if (enhanced) {
      list.removeAttribute('tabindex');
      list.scrollLeft = 0;
      measure();
      paint();
    } else {
      list.setAttribute('tabindex', '0');
      cards.forEach(card => {
        card.style.removeProperty('transform');
        card.style.removeProperty('opacity');
      });
    }

    const running = enhanced && nearby && !document.hidden;
    if (running && !frame) {
      previousTime = undefined;
      frame = requestAnimationFrame(tick);
    } else if (!running && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  const images = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    list.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
    images.disconnect();
  }, {rootMargin: '680px 0px'});
  images.observe(band);

  new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    sync();
  }, {rootMargin: '150px 0px'}).observe(band);
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(list);
  else window.addEventListener('resize', sync, {passive: true});
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
};
