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
  const control = root.querySelector('[data-pl-toggle]');
  const logos = [...originalList.children];
  let rows;
  let nearby = false;
  let paused = false;

  function setRunning() {
    brands.classList.toggle('is-running', nearby && !paused && !document.hidden);
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
    groups.forEach((group, index) => {
      const row = document.createElement('div');
      row.className = 'pl-row';
      const belt = document.createElement('div');
      belt.className = 'pl-belt';
      belt.style.setProperty('--pl-duration', Math.round(group.width / (compact.matches ? 23 : 29)) + 's');
      belt.style.setProperty('--pl-phase', -(3 + index * 4) + 's');
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
    });
    originalList.hidden = true;
    brands.append(rows);
    control.hidden = false;
    if (nearby) loadRowImages();
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
    originalList.append(...logos);
    originalList.hidden = false;
    control.hidden = true;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) loadRowImages();
      setRunning();
    }, {rootMargin: '160px 0px'});
    observer.observe(brands);
    control.addEventListener('click', () => {
      paused = !paused;
      control.textContent = paused ? 'Play logos' : 'Pause logos';
      setRunning();
    });
    compact.addEventListener('change', () => { if (rows) formRows(); });
    reduce.addEventListener('change', syncPreference);
    document.addEventListener('visibilitychange', setRunning);
    syncPreference();
  }

  /* Each result counts once when its own row enters. Final source values and
     accessible names remain unchanged; only overlaid aria-hidden digits move. */
  var digits = Array.prototype.slice.call(root.querySelectorAll('[data-pl-count]'));
  if (!digits.length || (reduce && reduce.matches) || !window.requestAnimationFrame ||
      !('IntersectionObserver' in window)) return;
  var values = digits.map(function (element) {
    return { element:element, row:element.closest('.pl-n'), target:Number(element.getAttribute('data-pl-count')),
      decimals:Number(element.getAttribute('data-pl-decimals') || 0), final:element.textContent,
      active:false, done:false, began:null };
  });
  var countFrame = null;
  var countsStopped = false;
  var countObserver;
  function finishCounts() {
    if (countsStopped) return;
    countsStopped = true;
    if (countObserver) countObserver.disconnect();
    if (countFrame !== null) window.cancelAnimationFrame(countFrame);
    countFrame = null;
    values.forEach(function (item) { item.element.textContent = item.final; item.active = false; });
    document.removeEventListener('visibilitychange', onCountVisibility);
    if (reduce && reduce.removeEventListener) reduce.removeEventListener('change', onCountReduce);
    else if (reduce && reduce.removeListener) reduce.removeListener(onCountReduce);
  }
  function onCountReduce(event) { if (event.matches) finishCounts(); }
  function onCountVisibility() { if (document.hidden) finishCounts(); }
  function countStep(now) {
    countFrame = null;
    if (countsStopped) return;
    var running = false;
    values.forEach(function (item) {
      if (!item.active) return;
      if (item.began === null) item.began = now;
      var progress = Math.max(0, Math.min((now - item.began) / 900, 1));
      var eased = 1 - Math.pow(1 - progress, 3);
      item.element.textContent = (1 + (item.target - 1) * eased).toFixed(item.decimals);
      if (progress === 1) {
        item.element.textContent = item.final;
        item.active = false;
        item.done = true;
      } else running = true;
    });
    if (running) countFrame = window.requestAnimationFrame(countStep);
    else if (values.every(function (item) { return item.done; })) finishCounts();
  }
  try {
    countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.intersectionRatio < .6) return;
        var item = values.find(function (value) { return value.row === entry.target; });
        if (!item || item.active || item.done) return;
        item.active = true;
        countObserver.unobserve(item.row);
      });
      if (values.some(function (item) { return item.active; }) && countFrame === null && !countsStopped) {
        countFrame = window.requestAnimationFrame(countStep);
      }
    }, { threshold:.6 });
    document.addEventListener('visibilitychange', onCountVisibility);
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', onCountReduce);
    else if (reduce && reduce.addListener) reduce.addListener(onCountReduce);
    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') window.pctMotion.onReduce(finishCounts);
    if (!countsStopped) {
      /* Arm visual digits before observation so entering rows never flash their
         final value and then jump back to one. Accessible finals stay intact. */
      values.forEach(function (item) { item.element.textContent = (1).toFixed(item.decimals); });
      values.forEach(function (item) { if (item.row && isFinite(item.target)) countObserver.observe(item.row); });
    }
  } catch (error) { finishCounts(); }
};
