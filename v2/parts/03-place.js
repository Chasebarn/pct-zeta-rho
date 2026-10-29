/* The same twenty logo nodes become finite rows linked to normal page scroll.
   No continuous loop runs: a visible scroll/resize schedules one frame. */
window.pctInitPlacements = function () {
  'use strict';
  var root = document.querySelector('[data-place]');
  if (!root || root.dataset.placementsReady) return;
  root.dataset.placementsReady = '1';
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var brands = root.querySelector('[data-pl-brands]');
  var originalList = root.querySelector('[data-pl-logos]');
  var logos = originalList ? Array.prototype.slice.call(originalList.children) : [];
  var rows = [];
  var rowContainer = null;
  var rowObserver = null;
  var resizeObserver = null;
  var rowFrame = null;
  var rowsEnabled = false;
  var rowsVisible = false;

  function cancelRowFrame() {
    if (rowFrame !== null) window.cancelAnimationFrame(rowFrame);
    rowFrame = null;
  }
  function applyRows() {
    var scroll = window.scrollY || window.pageYOffset || 0;
    rows.forEach(function (row, index) {
      var progress = Math.max(0, Math.min((scroll - row.start) / row.distance, 1));
      var phase = index % 2 ? 1 - progress : progress;
      row.track.style.transform = 'translate3d(' + (-row.overflow * phase).toFixed(2) + 'px,0,0)';
    });
  }
  function queueRows() {
    if (!rowsEnabled || !rowsVisible || document.hidden || rowFrame !== null) return;
    rowFrame = window.requestAnimationFrame(function () {
      rowFrame = null;
      if (rowsEnabled && rowsVisible && !document.hidden) applyRows();
    });
  }
  function measureRows() {
    if (!rowsEnabled) return;
    var scroll = window.scrollY || window.pageYOffset || 0;
    var viewport = Math.max(1, window.innerHeight);
    var header = document.querySelector('.v2hd');
    var safeTop = header ? header.getBoundingClientRect().height + 12 : 0;
    rows.forEach(function (row) {
      var box = row.element.getBoundingClientRect();
      var top = box.top + scroll;
      row.overflow = Math.max(0, row.track.scrollWidth - row.element.clientWidth);
      /* Hold endpoints while the full row is visible, finishing before the
         sticky header covers it. First/last marks each receive a complete view. */
      row.start = top + box.height - viewport;
      row.distance = Math.max(1, viewport - box.height - safeTop);
    });
    applyRows();
  }
  function balancedLogoGroups(count) {
    var style = window.getComputedStyle(brands);
    var scale = Number(style.getPropertyValue('--pl-scale')) || 1;
    var gap = parseFloat(style.getPropertyValue('--pl-gap')) || 0;
    var perRow = Math.ceil(logos.length / count);
    var groups = [], loads = [], capacities = [];
    for (var i = 0; i < count; i++) {
      groups.push([]);
      loads.push(0);
      capacities.push(Math.min(perRow, logos.length - i * perRow));
    }
    var weighted = logos.map(function (logo, index) {
      var width = parseFloat(window.getComputedStyle(logo).getPropertyValue('--pl-slot')) || 136;
      return { logo:logo, index:index, width:width * scale };
    }).sort(function (a, b) { return b.width - a.width || a.index - b.index; });
    weighted.forEach(function (item) {
      var best = -1;
      for (var row = 0; row < count; row++) {
        if (groups[row].length >= capacities[row]) continue;
        if (best === -1 || loads[row] < loads[best]) best = row;
      }
      if (groups[best].length) loads[best] += gap;
      groups[best].push(item);
      loads[best] += item.width;
    });
    return groups.map(function (group) {
      return group.sort(function (a, b) { return a.index - b.index; }).map(function (item) { return item.logo; });
    });
  }
  function groupRows() {
    if (!rowsEnabled) return;
    var count = window.innerWidth <= 700 ? 3 : 2;
    if (rows.length === count) { measureRows(); return; }
    var groups = balancedLogoGroups(count);
    if (rowContainer) rowContainer.remove();
    rowContainer = document.createElement('div');
    rowContainer.className = 'pl-rows';
    rows = [];
    for (var index = 0; index < count; index++) {
      var element = document.createElement('div');
      var track = document.createElement('ul');
      element.className = 'pl-row';
      track.className = 'pl-track';
      track.setAttribute('role', 'list');
      track.setAttribute('aria-label', 'Companies where members have been placed, row ' + (index + 1) + ' of ' + count);
      groups[index].forEach(function (logo) { track.appendChild(logo); });
      element.appendChild(track);
      rowContainer.appendChild(element);
      rows.push({ element:element, track:track, start:0, distance:1, overflow:0 });
    }
    originalList.hidden = true;
    brands.appendChild(rowContainer);
    measureRows();
  }
  function onRowResize() {
    if (!rowsEnabled) return;
    groupRows();
    queueRows();
  }
  function onRowVisibility() {
    if (document.hidden) cancelRowFrame();
    else queueRows();
  }
  function stopRows() {
    rowsEnabled = false;
    rowsVisible = false;
    cancelRowFrame();
    if (rowObserver) rowObserver.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    rowObserver = resizeObserver = null;
    window.removeEventListener('scroll', queueRows);
    window.removeEventListener('resize', onRowResize);
    document.removeEventListener('visibilitychange', onRowVisibility);
    if (originalList) {
      logos.forEach(function (logo) { originalList.appendChild(logo); });
      originalList.hidden = false;
    }
    if (rowContainer) rowContainer.remove();
    rowContainer = null;
    rows = [];
  }
  function startRows() {
    if (rowsEnabled || !brands || !originalList || !logos.length ||
        (reduce && reduce.matches) || !window.requestAnimationFrame ||
        !('IntersectionObserver' in window)) return;
    try {
      rowsEnabled = true;
      groupRows();
      rowObserver = new IntersectionObserver(function (entries) {
        rowsVisible = entries.some(function (entry) { return entry.isIntersecting; });
        if (rowsVisible) queueRows();
        else cancelRowFrame();
      });
      rowObserver.observe(brands);
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(measureRows);
        resizeObserver.observe(brands);
        if (document.body) resizeObserver.observe(document.body);
      }
      window.addEventListener('scroll', queueRows, { passive:true });
      window.addEventListener('resize', onRowResize, { passive:true });
      document.addEventListener('visibilitychange', onRowVisibility);
    } catch (error) {
      stopRows();
    }
  }
  function onRowReduce(event) {
    if (event.matches) stopRows();
    else startRows();
  }
  if (reduce && reduce.addEventListener) reduce.addEventListener('change', onRowReduce);
  else if (reduce && reduce.addListener) reduce.addListener(onRowReduce);
  if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') window.pctMotion.onReduce(stopRows);
  startRows();


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
      var progress = Math.max(0, Math.min((now - item.began) / 2000, 1));
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
        if (!entry.isIntersecting) return;
        var item = values.find(function (value) { return value.row === entry.target; });
        if (!item || item.active || item.done) return;
        item.active = true;
        item.element.textContent = (1).toFixed(item.decimals);
        countObserver.unobserve(item.row);
      });
      if (values.some(function (item) { return item.active; }) && countFrame === null && !countsStopped) {
        countFrame = window.requestAnimationFrame(countStep);
      }
    }, { threshold:.6 });
    values.forEach(function (item) { if (item.row && isFinite(item.target)) countObserver.observe(item.row); });
    document.addEventListener('visibilitychange', onCountVisibility);
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', onCountReduce);
    else if (reduce && reduce.addListener) reduce.addListener(onCountReduce);
    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') window.pctMotion.onReduce(finishCounts);
  } catch (error) { finishCounts(); }
};
