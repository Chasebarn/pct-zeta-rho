/* The same twenty logo nodes become finite rows linked to normal page scroll.
   No continuous loop runs: a visible scroll/resize schedules one frame. */
window.pctInitPlacements = function () {
  'use strict';
  var root = document.querySelector('[data-place]');
  if (!root || root.dataset.placementsReady) return;
  root.dataset.placementsReady = '1';
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var phone = window.matchMedia ? window.matchMedia('(max-width: 700px)') : null;
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
      if (!row.overflow) return;
      var progress = Math.max(0, Math.min((scroll - row.start) / row.distance, 1));
      var phase = index % 2 ? 1 - progress : progress;
      var offset = -row.overflow * phase;
      row.track.style.transform = 'translate3d(' + offset.toFixed(2) + 'px,0,0)';
      /* Fade the whole wordmark before the viewport can slice any letters. */
      row.marks.forEach(function (mark) {
        var clearance = Math.min(mark.left + offset, row.width - mark.right - offset);
        var opacity = Math.round(Math.max(0, Math.min(clearance / row.feather, 1)) * 100) / 100;
        if (opacity !== mark.opacity) {
          mark.node.style.opacity = opacity === 1 ? '' : String(opacity);
          mark.opacity = opacity;
        }
      });
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
    var safeTop = header ? header.getBoundingClientRect().height + 8 : 0;
    rows.forEach(function (row) {
      var box = row.element.getBoundingClientRect();
      var top = box.top + scroll;
      var overflow = row.track.scrollWidth - row.element.clientWidth;
      row.overflow = overflow > 1 ? overflow : 0;
      row.element.classList.toggle('is-drifting', !!row.overflow);
      row.width = row.element.clientWidth;
      row.feather = parseFloat(window.getComputedStyle(brands).getPropertyValue('--pl-edge')) || 16;
      var trackLeft = row.track.getBoundingClientRect().left;
      row.marks = Array.prototype.map.call(row.track.children, function (node) {
        var rect = node.getBoundingClientRect();
        if (!row.overflow) node.style.removeProperty('opacity');
        return { node:node, left:rect.left-trackLeft, right:rect.right-trackLeft, opacity:null };
      });
      if (!row.overflow) row.track.style.removeProperty('transform');
      /* Logo artwork sits inside the row, so use a little of its top/bottom
         whitespace as travel time. At either end the artwork is already clear
         of the viewport edge or sticky header, and there is no scroll pin. */
      var markInset = box.height * .12;
      row.start = top + box.height - markInset - viewport;
      row.distance = Math.max(1, viewport - box.height - safeTop + markInset * 2);
    });
    applyRows();
  }
  function balancedLogoGroups(count, scale) {
    var style = window.getComputedStyle(brands);
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
    var count = (phone ? phone.matches : window.innerWidth <= 700) ? 3 : 2;
    /* The three-row composition has its own optical sizes. For two rows,
       graduate continuously from narrow to wide layouts to avoid a sudden
       track jump when resizing or rotating the device. */
    var scale = count === 3 ? 1 : Math.max(.72, Math.min(1.075, .72 + (brands.clientWidth - 700) * .00043));
    brands.style.setProperty('--pl-scale', scale.toFixed(4));
    if (rows.length === count) { measureRows(); return; }
    var groups = balancedLogoGroups(count, scale);
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
      logos.forEach(function (logo) {
        logo.style.removeProperty('opacity');
        originalList.appendChild(logo);
      });
      originalList.hidden = false;
    }
    if (brands) brands.style.removeProperty('--pl-scale');
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
