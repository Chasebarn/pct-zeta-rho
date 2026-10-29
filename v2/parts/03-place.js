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
  function groupRows() {
    if (!rowsEnabled) return;
    var count = window.innerWidth <= 700 ? 3 : 2;
    if (rows.length === count) { measureRows(); return; }
    if (rowContainer) rowContainer.remove();
    rowContainer = document.createElement('div');
    rowContainer.className = 'pl-rows';
    rows = [];
    var perRow = Math.ceil(logos.length / count);
    for (var index = 0; index < count; index++) {
      var element = document.createElement('div');
      var track = document.createElement('ul');
      element.className = 'pl-row';
      track.className = 'pl-track';
      track.setAttribute('role', 'list');
      track.setAttribute('aria-label', 'Companies where members have been placed, row ' + (index + 1) + ' of ' + count);
      logos.slice(index * perRow, (index + 1) * perRow).forEach(function (logo) { track.appendChild(logo); });
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
};
