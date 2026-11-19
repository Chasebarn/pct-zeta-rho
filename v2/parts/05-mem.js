window.pctInitPhotoRail = function () {
  const section = document.querySelector('.mem');
  if (!section || !window.IntersectionObserver) return;
  const band = section.querySelector('.mem-band');
  const track = band.querySelector('.mem-track');
  const photos = track.querySelector('.mem-strip');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  function configure() {
    section.classList.toggle('is-enhanced', !motion.matches);
    if (motion.matches) {
      band.removeAttribute('aria-describedby');
    } else {
      band.setAttribute('aria-describedby', 'mem-motion-keys');
      band.scrollLeft = 0;
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    section.classList.toggle('is-in-range', entry.isIntersecting);
    if (!entry.isIntersecting || track.children.length > 1) return;

    // Repeat the same strip and trailing gap enough to span even a short, wide screen.
    for (let repeat = 0; repeat < 3; repeat += 1) {
      const copy = photos.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.append(copy);
    }
    track.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    configure();
  }, {rootMargin: '360px 0px'});
  observer.observe(section);

  function togglePlayback() {
    if (section.classList.contains('is-enhanced')) section.classList.toggle('is-paused');
  }

  band.addEventListener('click', togglePlayback);
  band.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key) || !section.classList.contains('is-enhanced')) return;
    event.preventDefault();
    if (!event.repeat) togglePlayback();
  });
  motion.addEventListener('change', () => {
    if (track.children.length > 1) configure();
  });
};
