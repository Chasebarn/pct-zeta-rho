/* Every campus is visible at rest. On entry, only the Tampa ring brightens
   briefly; the coordinates and the rest of the map stay still. */
window.pctInitNational = function () {
  'use strict';
  var root = document.querySelector('[data-national]');
  if (!root || root.dataset.nationalMotionReady || !window.IntersectionObserver) return;
  var map = root.querySelector('[data-chapter-map]');
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!map || (reduce && reduce.matches)) return;

  root.dataset.nationalMotionReady = '1';
  var threshold = .45;
  var observer = new IntersectionObserver(function (entries) {
    if (!entries.some(function (entry) { return entry.isIntersecting && entry.intersectionRatio >= threshold; })) return;
    observer.disconnect();
    if (!document.hidden && !(reduce && reduce.matches)) root.classList.add('is-map-focused');
  }, { threshold:threshold });
  observer.observe(map);
};
