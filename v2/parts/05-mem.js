window.pctInitPhotoArc = function () {
  const wheel = document.querySelector('.mem-wheel');
  if (!wheel || !window.IntersectionObserver) return;
  const finish = wheel.closest('.chapter-finish');
  let inView = false;
  let frame = 0;

  function draw() {
    frame = 0;
    const section = finish.getBoundingClientRect();
    const travel = innerHeight + section.height;
    const progress = Math.max(0, Math.min(1, (innerHeight - section.top) / travel));
    wheel.style.setProperty('--arc-travel', (-78 * progress).toFixed(2) + 'deg');
  }

  function schedule() {
    if (inView && !document.hidden && !frame) frame = requestAnimationFrame(draw);
  }

  const images = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    wheel.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
    images.disconnect();
  }, {rootMargin: '680px 0px'});
  images.observe(finish);
  if (window.pctMotion?.reduced) return;

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) schedule();
  });
  observer.observe(finish);
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  window.pctMotion?.onReduce(() => {
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (frame) cancelAnimationFrame(frame);
    wheel.style.removeProperty('--arc-travel');
  });
};
