window.pctInitPhotoArc = function () {
  const band = document.querySelector('.mem');
  if (!band || !window.IntersectionObserver) return;
  const control = band.querySelector('[data-mem-toggle]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let nearby = false;
  let paused = false;

  function sync() {
    control.hidden = motion.matches;
    band.classList.toggle('is-running', nearby && !paused && !motion.matches && !document.hidden);
  }

  const images = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    band.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
    images.disconnect();
  }, {rootMargin: '680px 0px'});
  images.observe(band);
  const observer = new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    sync();
  }, {rootMargin: '150px 0px'});
  observer.observe(band);
  control.addEventListener('click', () => {
    paused = !paused;
    control.textContent = paused ? 'Play photos' : 'Pause photos';
    sync();
  });
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
};
