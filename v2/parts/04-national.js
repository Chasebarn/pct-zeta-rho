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
    return !window.innerHeight || figure.getBoundingClientRect().height * .6 <= window.innerHeight;
  }
  function onResize() { if (!started && !fitsEntryThreshold()) finish(); }
  function hash(pin) {
    var value = 2166136261;
    var id = pin.getAttribute('data-chapter-pin');
    for (var i = 0; i < id.length; i++) value = Math.imul(value ^ id.charCodeAt(i), 16777619);
    return value >>> 0;
  }
  function animate(element, frames, options) {
    if (!element) return;
    var animation = element.animate(frames, options);
    animations.push(animation);
    animation.finished.catch(function () {});
  }
  function reveal() {
    if (stopped || started) return;
    started = true;
    if (document.hidden) { finish(); return; }
    observer.disconnect();
    try {
      /* Stable ID hashes scatter the order across regions instead of sweeping
         west-to-east or moving pins away from their campus coordinates. */
      var order = pins.slice().sort(function (a,b) { return hash(a) - hash(b); });
      order.forEach(function (pin,index) {
        var delay = order.length > 1 ? index * 1300 / (order.length - 1) : 0;
        var options = { duration:650, delay:delay, easing:'cubic-bezier(.16,1,.3,1)', fill:'both' };
        animate(pin.querySelector('.v2nat-pin-dot'), [
          { opacity:0, transform:'scale(.2)', transformOrigin:'0px 0px' },
          { opacity:1, transform:'scale(1.3)', transformOrigin:'0px 0px', offset:.65 },
          { opacity:1, transform:'scale(1)', transformOrigin:'0px 0px' }
        ], options);
        var ring = pin.querySelector('.v2nat-pin-ring');
        var restingOpacity = ring ? window.getComputedStyle(ring).opacity : '0';
        animate(ring, [
          { opacity:0, transform:'scale(.35)', transformOrigin:'0px 0px' },
          { opacity:.65, transform:'scale(1.15)', transformOrigin:'0px 0px', offset:.5 },
          { opacity:restingOpacity, transform:'scale(1)', transformOrigin:'0px 0px' }
        ], options);
      });
      root.classList.remove('is-map-pending');
      Promise.all(animations.map(function (animation) { return animation.finished.catch(function () {}); })).then(finish);
    } catch (error) { finish(); }
  }
  try {
    observer = new IntersectionObserver(function (entries) {
      if (!fitsEntryThreshold()) { finish(); return; }
      if (entries.some(function (entry) { return entry.isIntersecting && entry.intersectionRatio >= .6; })) reveal();
    }, { threshold:.6 });
    observer.observe(figure);
    root.classList.add('is-map-pending');
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize, { passive:true });
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', onReduce);
    else if (reduce && reduce.addListener) reduce.addListener(onReduce);
    if (window.pctMotion && window.pctMotion.onReduce) window.pctMotion.onReduce(finish);
  } catch (error) { finish(); }
};
