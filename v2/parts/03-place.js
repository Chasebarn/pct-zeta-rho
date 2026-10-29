/* Company logos form a manual native scroll rail. Outcomes count once, while
   finished source and accessible values remain stable throughout. */
window.pctInitPlacements = function () {
  'use strict';
  var root = document.querySelector('[data-place]');
  if (!root || root.dataset.placementsReady) return;
  root.dataset.placementsReady = '1';
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var rail = root.querySelector('[data-pl-rail]');
  var railWrap = root.querySelector('[data-pl-rail-wrap]');
  if (rail && railWrap) {
    var maximum = 0;
    var keyStep = 160;
    function updateEdges() {
      var left = Math.max(0, rail.scrollLeft);
      railWrap.classList.toggle('has-scroll-back', left > 2);
      railWrap.classList.toggle('is-at-end', maximum <= 2 || left >= maximum - 2);
    }
    function measureRail() {
      maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
      keyStep = Math.max(140, rail.clientWidth * .55);
      updateEdges();
    }
    rail.addEventListener('scroll', updateEdges, { passive:true });
    rail.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      var destination;
      if (event.key === 'ArrowRight') destination = rail.scrollLeft + keyStep;
      else if (event.key === 'ArrowLeft') destination = rail.scrollLeft - keyStep;
      else if (event.key === 'Home') destination = 0;
      else if (event.key === 'End') destination = maximum;
      else return;
      event.preventDefault();
      rail.scrollTo({
        left:Math.max(0, Math.min(maximum, destination)),
        behavior:reduce && reduce.matches ? 'auto' : 'smooth'
      });
    });
    measureRail();
    if ('ResizeObserver' in window) new ResizeObserver(measureRail).observe(rail);
    else window.addEventListener('resize', measureRail, { passive:true });
  }

  var digits = Array.prototype.slice.call(root.querySelectorAll('[data-pl-count]'));
  var numbers = root.querySelector('.pl-nums');
  if (!numbers || !digits.length || (reduce && reduce.matches) ||
      !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;

  var values = digits.map(function (element) {
    return {
      element:element,
      target:Number(element.getAttribute('data-pl-count')),
      decimals:Number(element.getAttribute('data-pl-decimals') || 0),
      final:element.textContent
    };
  });
  if (values.some(function (item) { return !isFinite(item.target); })) return;

  var observer = null;
  var frame = null;
  var stopped = false;
  var started = false;
  var began = null;

  function unlisten() {
    document.removeEventListener('visibilitychange', onVisibility);
    if (reduce && reduce.removeEventListener) reduce.removeEventListener('change', onReduce);
    else if (reduce && reduce.removeListener) reduce.removeListener(onReduce);
  }
  function finish() {
    if (stopped) return;
    stopped = true;
    if (observer) observer.disconnect();
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    values.forEach(function (item) { item.element.textContent = item.final; });
    root.classList.remove('pl-stats-ready');
    root.classList.add('pl-stats-visible');
    unlisten();
  }
  function onReduce(event) {
    if (event.matches) finish();
  }
  function onVisibility() {
    if (document.hidden && started) finish();
  }
  function step(now) {
    if (stopped) return;
    if (began === null) began = now;
    var complete = true;
    values.forEach(function (item, index) {
      var progress = Math.max(0, Math.min((now - began - index * 110) / 1100, 1));
      var eased = 1 - Math.pow(1 - progress, 4);
      item.element.textContent = (item.target * eased).toFixed(item.decimals);
      if (progress < 1) complete = false;
    });
    if (complete) finish();
    else frame = window.requestAnimationFrame(step);
  }
  try {
    observer = new IntersectionObserver(function (entries) {
      if (started || stopped || !entries.some(function (entry) { return entry.isIntersecting; })) return;
      started = true;
      observer.disconnect();
      root.classList.add('pl-stats-visible');
      frame = window.requestAnimationFrame(step);
    }, { threshold:.35 });
    root.classList.add('pl-stats-ready');
    observer.observe(numbers);
    document.addEventListener('visibilitychange', onVisibility);
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', onReduce);
    else if (reduce && reduce.addListener) reduce.addListener(onReduce);
    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(finish);
    }
  } catch (error) {
    finish();
  }
};
