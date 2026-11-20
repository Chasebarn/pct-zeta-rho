const journey = document.querySelector('[data-rush-journey]');

if (journey) {
  const chapters = Array.from(journey.querySelectorAll('[data-rush-chapter]'));
  const links = Array.from(journey.querySelectorAll('.rush-journey-index a'));
  const indexNav = journey.querySelector('.rush-journey-index');
  const siteHeader = document.querySelector('.v2hd');
  const images = journey.querySelector('[data-rush-images]');
  const wideLayout = matchMedia('(min-width: 900px) and (min-height: 640px)');
  const compactLayout = matchMedia('(max-width: 899px)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const count = journey.querySelector('[data-rush-count]');
  let current = -1;
  let frames = [];
  let scheduled = false;

  function showChapter(index) {
    current = index;
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    frames.forEach((photo, i) => photo.classList.toggle('is-current', i === index));
  }

  function readScroll() {
    scheduled = false;
    const stickyHeight = siteHeader.offsetHeight + (compactLayout.matches ? indexNav.offsetHeight : 0);
    const readingLine = Math.min(window.innerHeight * .46, stickyHeight + 138);
    const active = chapters.reduce((selected, chapter, index) => {
      return chapter.getBoundingClientRect().top <= readingLine ? index : selected;
    }, 0);
    if (active !== current) showChapter(active);
  }

  function syncSoon() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(readScroll);
  }

  function fitLayout() {
    if (wideLayout.matches && !frames.length) {
      frames = chapters.map(chapter => chapter.querySelector('[data-rush-photo]').cloneNode(true));
      images.append(...frames);
      if (current >= 0) showChapter(current);
    }
    images.hidden = !wideLayout.matches;
    syncSoon();
  }

  journey.dataset.enhanced = '';
  readScroll();
  fitLayout();
  wideLayout.addEventListener('change', fitLayout);
  window.addEventListener('scroll', syncSoon, { passive: true });
  window.addEventListener('resize', syncSoon, { passive: true });
  window.addEventListener('pageshow', syncSoon);
  window.addEventListener('hashchange', syncSoon);
  journey.addEventListener('toggle', syncSoon, true);

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const total = Number(count.textContent);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();

      function tick(now) {
        const fraction = reduceMotion.matches ? 1 : Math.min((now - start) / 560, 1);
        count.textContent = String(Math.min(total, 1 + Math.floor(total * fraction)));
        if (fraction < 1) requestAnimationFrame(tick);
      }

      if (!reduceMotion.matches) requestAnimationFrame(tick);
    }, { threshold: .55 });
    observer.observe(count);
  }
}
