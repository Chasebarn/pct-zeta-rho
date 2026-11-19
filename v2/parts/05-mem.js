window.pctInitPhotoRail = function () {
  const section = document.querySelector('.mem');
  if (!section || !window.IntersectionObserver) return;
  const band = section.querySelector('.mem-band');
  const strip = band.querySelector('.mem-strip');
  const originals = [...strip.children];
  const photos = [...originals];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let geometry;
  let nearby = false;
  let prepared = false;
  let paused = false;
  let phase = 0;
  let frame = 0;
  let previousTime;

  function paint() {
    const {halfWidth, cardWidth, pitch, wrapAt, depth, tilt} = geometry;
    const span = photos.length * pitch;
    photos.forEach((photo, index) => {
      const offset = (index - phase) * pitch + wrapAt;
      const x = ((offset % span) + span) % span - wrapAt;
      const position = Math.max(-1, Math.min(1, x / halfWidth));
      const y = depth * position * position;
      photo.style.setProperty('--arc-position', `translate3d(${halfWidth + x - cardWidth / 2}px, ${y}px, 0) rotate(${tilt * position}deg)`);
    });
  }

  function measure() {
    const width = band.clientWidth;
    const photoStyle = getComputedStyle(originals[0]);
    const cardWidth = parseFloat(photoStyle.width);
    const cardHeight = parseFloat(photoStyle.height);
    if (!width || !cardWidth || !cardHeight) return;
    const gap = parseFloat(getComputedStyle(strip).columnGap);
    const pitch = cardWidth + gap;
    const wrapAt = (width + Math.hypot(cardWidth, cardHeight)) / 2;

    // Recycle a frame beyond both sides of the horizon, including its tilted corners.
    while (photos.length * pitch < wrapAt * 2) {
      for (const original of originals) {
        const copy = original.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        photos.push(copy);
        strip.append(copy);
      }
    }
    geometry = {
      halfWidth: width / 2, cardWidth, pitch, wrapAt,
      depth: Math.max(22, Math.min(62, width * .048)),
      tilt: width < 600 ? 9 : 13,
    };
    paint();
  }

  function tick(time) {
    if (previousTime !== undefined) {
      phase = (phase + Math.min(time - previousTime, 80) / 9000) % photos.length;
    }
    previousTime = time;
    paint();
    frame = requestAnimationFrame(tick);
  }

  function syncPlayback() {
    const play = geometry && nearby && !paused && !motion.matches && !document.hidden;
    if (play && !frame) frame = requestAnimationFrame(tick);
    else if (!play && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = undefined;
    }
  }

  function configure() {
    const enhance = prepared && !motion.matches;
    if (enhance) band.scrollLeft = 0;
    section.classList.toggle('is-enhanced', enhance);
    if (enhance) {
      band.setAttribute('aria-describedby', 'mem-motion-keys');
      originals.forEach(photo => { photo.firstElementChild.loading = 'eager'; });
      measure();
    } else {
      band.removeAttribute('aria-describedby');
    }
    syncPlayback();
  }

  const observer = new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    if (nearby && !prepared) {
      prepared = true;
      configure();
    } else {
      syncPlayback();
    }
  }, {rootMargin: '480px 0px'});
  observer.observe(section);

  function togglePlayback() {
    if (!section.classList.contains('is-enhanced')) return;
    paused = !paused;
    syncPlayback();
  }

  band.addEventListener('click', togglePlayback);
  band.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key) || !section.classList.contains('is-enhanced')) return;
    event.preventDefault();
    if (!event.repeat) togglePlayback();
  });
  motion.addEventListener('change', configure);
  document.addEventListener('visibilitychange', syncPlayback);
  const resize = () => { if (section.classList.contains('is-enhanced')) measure(); };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(band);
  else window.addEventListener('resize', resize, {passive: true});
};
