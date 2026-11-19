window.pctInitPhotoRail = function () {
  const section = document.querySelector('.mem');
  if (!section || !window.IntersectionObserver) return;
  const band = section.querySelector('.mem-band');
  const strip = band.querySelector('.mem-strip');
  const originals = [...strip.children];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let nearby = false;
  let prepared = false;

  function configure() {
    const enhance = nearby && !motion.matches;
    if (enhance && !prepared) {
      // Eight chapter photos repeat four times around the original 32-slot wheel.
      originals.forEach(photo => { photo.firstElementChild.loading = 'eager'; });
      for (let slot = 0; slot < 32; slot += 1) {
        const source = originals[slot % originals.length];
        const photo = slot < originals.length ? source : source.cloneNode(true);
        photo.style.setProperty('--wheel-slot', slot);
        if (slot >= originals.length) {
          photo.setAttribute('aria-hidden', 'true');
          photo.firstElementChild.alt = '';
          strip.append(photo);
        }
      }
      prepared = true;
    }
    if (enhance && !section.classList.contains('is-enhanced')) band.scrollLeft = 0;
    section.classList.toggle('is-enhanced', prepared && !motion.matches);
    section.classList.toggle('is-in-range', enhance && !document.hidden);
    if (prepared && !motion.matches) band.setAttribute('aria-describedby', 'mem-motion-keys');
    else band.removeAttribute('aria-describedby');
  }

  const observer = new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    configure();
  }, {rootMargin: '680px 0px'});
  observer.observe(section);
  motion.addEventListener('change', configure);
  document.addEventListener('visibilitychange', configure);

  function togglePlayback() {
    if (section.classList.contains('is-enhanced')) section.classList.toggle('is-paused');
  }

  band.addEventListener('click', togglePlayback);
  band.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key) || !section.classList.contains('is-enhanced')) return;
    event.preventDefault();
    if (!event.repeat) togglePlayback();
  });
};
