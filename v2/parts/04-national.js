/* A single scattered wave introduces the real campus locations. Geographic
   translations belong to the outer groups and are never animated or changed. */
window.pctInitNational = function () {
  'use strict';
  var root = document.querySelector('[data-national]');
  if (!root || root.dataset.nationalMotionReady) return;
  var figure = root.querySelector('.v2nat-figure');
  var pins = Array.prototype.slice.call(root.querySelectorAll('[data-chapter-pin]'));
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!figure || !pins.length || (reduce && reduce.matches) ||
      !window.IntersectionObserver || !Element.prototype.animate) return;
  root.dataset.nationalMotionReady = '1';
  var observer = null;
  var animations = [];
  var stopped = false;
  var started = false;

  function finish() {
    root.classList.remove('is-map-pending');
    if (stopped) return;
    stopped = true;
    if (observer) observer.disconnect();
    animations.forEach(function (animation) { animation.cancel(); });
    animations = [];
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', onResize);
    if (reduce && reduce.removeEventListener) reduce.removeEventListener('change', onReduce);
    else if (reduce && reduce.removeListener) reduce.removeListener(onReduce);
  }
  function onVisibility() { if (document.hidden) finish(); }
  function onReduce(event) { if (event.matches) finish(); }
  function fitsEntryThreshold() {
    return !window.innerHeight || figure.getBoundingClientRect().height * .2 <= window.innerHeight;
  }
  function onResize() { if (!started && !fitsEntryThreshold()) finish(); }
  function reveal() {
    if (stopped || started) return;
    started = true;
    if (document.hidden) { finish(); return; }
    observer.disconnect();
    try {
      /* Start in Tampa. Recruiters can follow the same geographic network
         from nearby chapters to the opposite coast in one short wave. */
      function position(pin) {
        return pin.transform.baseVal.getItem(0).matrix;
      }
      var localPin = root.querySelector('.v2nat-pin.is-usf');
      if (!localPin) { finish(); return; }
      var origin = position(localPin);
      var locations = pins.filter(function (pin) { return pin !== localPin; }).map(function (pin) {
        var point = position(pin);
        return { pin:pin, distance:Math.hypot(point.e - origin.e, point.f - origin.f) };
      });
      var farthest = Math.max(1, ...locations.map(function (location) { return location.distance; }));
      locations.forEach(function (location) {
        var dot = location.pin.querySelector('.v2nat-pin-dot');
        var animation = dot.animate([
          { opacity:.3, transform:'scale(.75)' },
          { opacity:1, transform:'scale(1)' }
        ], {
          duration:260,
          delay:480 * location.distance / farthest,
          easing:'ease-out',
          fill:'both'
        });
        animations.push(animation);
      });
      root.classList.remove('is-map-pending');
      Promise.all(animations.map(function (animation) { return animation.finished.catch(function () {}); })).then(finish);
    } catch (error) { finish(); }
  }
  try {
    observer = new IntersectionObserver(function (entries) {
      if (!fitsEntryThreshold()) { finish(); return; }
      if (entries.some(function (entry) { return entry.isIntersecting && entry.intersectionRatio >= .2; })) reveal();
    }, { threshold:.2 });
    observer.observe(figure);
    root.classList.add('is-map-pending');
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize, { passive:true });
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', onReduce);
    else if (reduce && reduce.addListener) reduce.addListener(onReduce);
    if (window.pctMotion && window.pctMotion.onReduce) window.pctMotion.onReduce(finish);
  } catch (error) { finish(); }
};
