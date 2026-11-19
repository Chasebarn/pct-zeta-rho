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
    const {halfWidth, cardWidth, pitch, wrapAt, crown, slopeWidth, depth, tilt} = geometry;
    const span = photos.length * pitch;
    photos.forEach((photo, index) => {
      const offset = (index - phase) * pitch + wrapAt;
      const x = ((offset % span) + span) % span - wrapAt;
      // Level the center and both ends so the silhouette stays steady at the edges.
      const progress = Math.max(0, Math.min(1, (Math.abs(x) - crown) / slopeWidth));
      const arc = progress * progress * (3 - 2 * progress);
      const y = depth * arc;
      const angle = Math.sign(x) * tilt * arc;
      photo.style.setProperty('--arc-position', `translate3d(${halfWidth + x - cardWidth / 2}px, ${y}px, 0) rotate(${angle}deg)`);
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
    const crown = pitch * .24;
    geometry = {
      halfWidth: width / 2, cardWidth, pitch, wrapAt,
      crown,
      slopeWidth: Math.max(1, width * .41 - crown),
      depth: Math.max(29, Math.min(72, width * .046)),
      tilt: width < 600 ? 8 : 13,
    };
    paint();
  }

  function tick(time) {
    if (previousTime !== undefined) {
      phase = (phase + Math.min(time - previousTime, 80) / 12000) % photos.length;
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
