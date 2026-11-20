/* The two copies in each belt meet at the same position when the loop repeats. */
window.pctInitPlacements = function () {
  'use strict';
  const root = document.querySelector('[data-place]');
  if (!root || root.dataset.placementsReady) return;
  root.dataset.placementsReady = '1';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width:700px)');
  const brands = root.querySelector('[data-pl-brands]');
  const originalList = root.querySelector('[data-pl-logos]');
  const logos = [...originalList.children];
  let rows;
  let belts = [];
  let nearby = false;
  let frame = 0;

  function positionRows() {
    frame = 0;
    if (!nearby || document.hidden) return;
    const travel = (innerHeight * .65 - brands.getBoundingClientRect().top) * 1.4;
    const widths = belts.map(({track}) => track.getBoundingClientRect().width);
    belts.forEach(({belt}, index) => {
      const width = widths[index];
      if (!width) return;
      const distance = travel * (index % 2 ? -1 : 1) + width * (.12 + index * .17);
      const offset = ((distance % width) + width) % width;
      belt.style.transform = `translate3d(${-offset}px, 0, 0)`;
    });
  }

  function queuePosition() {
    if (rows && nearby && !frame && !document.hidden) frame = requestAnimationFrame(positionRows);
  }

  function formRows() {
    rows?.remove();
    const count = compact.matches ? 3 : 2;
    const groups = Array.from({length: count}, () => ({logos: [], width: 0}));
    const scale = Number(getComputedStyle(brands).getPropertyValue('--pl-scale')) || 1;
    const gap = parseFloat(getComputedStyle(brands).getPropertyValue('--pl-gap')) || 0;
    const maxPerRow = Math.ceil(logos.length / count);
    const weighted = logos.map((logo, index) => ({
      logo, index, width: parseFloat(getComputedStyle(logo).getPropertyValue('--pl-slot')) * scale + gap,
    })).sort((a, b) => b.width - a.width);

    for (const entry of weighted) {
      const group = groups.filter(item => item.logos.length < maxPerRow)
        .reduce((shortest, item) => shortest.width <= item.width ? shortest : item);
      group.logos.push(entry);
      group.width += entry.width;
    }

    rows = document.createElement('div');
    rows.className = 'pl-rows';
    belts = [];
    groups.forEach((group, index) => {
      const row = document.createElement('div');
      row.className = 'pl-row';
      const belt = document.createElement('div');
      belt.className = 'pl-belt';
      const track = document.createElement('ul');
      track.className = 'pl-track';
      track.setAttribute('role', 'list');
      track.setAttribute('aria-label', 'Employers, row ' + (index + 1));
      group.logos.sort((a,b) => a.index - b.index).forEach(({logo}) => track.append(logo));
      const copy = track.cloneNode(true);
      copy.removeAttribute('aria-label');
      copy.setAttribute('aria-hidden', 'true');
      belt.append(track, copy);
      row.append(belt);
      rows.append(row);
      belts.push({belt, track});
    });
    originalList.hidden = true;
    brands.append(rows);
    if (nearby) loadRowImages();
    queuePosition();
  }

  function loadRowImages() {
    rows?.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
  }

  function syncPreference() {
    if (!reduce.matches) {
      if (!rows) formRows();
      return;
    }
    rows?.remove();
    rows = null;
    belts = [];
    originalList.append(...logos);
    originalList.hidden = false;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) loadRowImages();
      queuePosition();
    }, {rootMargin: '160px 0px'});
    observer.observe(brands);
    compact.addEventListener('change', () => { if (rows) formRows(); });
    reduce.addEventListener('change', syncPreference);
    window.addEventListener('scroll', queuePosition, {passive: true});
    window.addEventListener('resize', queuePosition, {passive: true});
    document.addEventListener('visibilitychange', queuePosition);
    if ('ResizeObserver' in window) {
      new ResizeObserver(queuePosition).observe(brands);
    }
    syncPreference();
  }

  const stats = [...root.querySelectorAll('[data-pl-count]')].map(digits => ({
    digits,
    trigger: digits.closest('.pl-n'),
    target: Number(digits.dataset.plCount),
    format: value => value.toFixed(Number(digits.dataset.plDecimals || 0)),
  }));
  window.pctCountStats(stats);
};
