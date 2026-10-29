/* Native details keeps the secondary company marks compact on phones.
   Outcomes enter and count once; source and accessible values remain final. */
window.pctInitPlacements = function () {
  'use strict';
  var root = document.querySelector('[data-place]');
  if (!root || root.dataset.placementsReady) return;
  var more = root.querySelector('[data-pl-more]');
  var primary = root.querySelector('[data-pl-primary]');
  var extra = root.querySelector('[data-pl-extra]');
  if (!more || !primary || !extra || !window.matchMedia) return;
  root.dataset.placementsReady = '1';
  var phone = window.matchMedia('(max-width: 600px)');
  var expandedOnPhone = false;
  /* Move the same two nodes, rather than duplicating logos or hiding them.
     Desktop shows two rows of ten; phones show two rows of four plus details. */
  var overflow = Array.prototype.slice.call(primary.children, 8);
  function sync() {
    if (phone.matches) {
      for (var i = overflow.length - 1; i >= 0; i--) {
        if (overflow[i].parentNode !== extra) extra.insertBefore(overflow[i], extra.firstChild);
      }
    } else {
      overflow.forEach(function (item) {
        if (item.parentNode !== primary) primary.appendChild(item);
      });
    }
    more.open = !phone.matches || expandedOnPhone;
  }
  more.addEventListener('toggle', function () {
    if (phone.matches) expandedOnPhone = more.open;
  });
  if (phone.addEventListener) phone.addEventListener('change', sync);
  else if (phone.addListener) phone.addListener(sync);
  sync();


  var digits = Array.prototype.slice.call(root.querySelectorAll('[data-pl-count]'));
  var numbers = root.querySelector('.pl-nums');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!numbers || !digits.length || reduce.matches ||
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
    if (reduce.removeEventListener) reduce.removeEventListener('change', onReduce);
    else if (reduce.removeListener) reduce.removeListener(onReduce);
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
    if (reduce.addEventListener) reduce.addEventListener('change', onReduce);
    else if (reduce.addListener) reduce.addListener(onReduce);
    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(finish);
    }
  } catch (error) {
    finish();
  }
};
