/* Placement logos stay still. The chapter figures may count into view once;
   their complete values remain in the source and in the accessible labels. */
window.pctInitCount = function () {
  'use strict';
  var root = document.querySelector('[data-place]');
  if (!root || root.dataset.countReady) return;
  root.dataset.countReady = '1';
  var els = Array.prototype.slice.call(root.querySelectorAll('[data-count]'));
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!els.length || !('IntersectionObserver' in window) || (mq && mq.matches)) return;

  var frames = new Map();
  var settled = false;
  function value(el) {
    return Number(el.dataset.count).toFixed(Number(el.dataset.decimals || 0));
  }
  els.forEach(function (el) {
    el.style.minWidth = el.textContent.trim().length + 'ch';
    var line = el.closest('.pl-n-val');
    var accessible = document.createElement('span');
    accessible.className = 'pl-number-label';
    accessible.textContent = line.textContent.trim();
    Array.prototype.forEach.call(line.children, function (child) {
      child.setAttribute('aria-hidden', 'true');
    });
    line.appendChild(accessible);
  });
  function run(el) {
    var start = null;
    function step(now) {
      if (settled) return;
      if (start === null) start = now;
      var progress = Math.min((now - start) / 1100, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (Number(el.dataset.count) * eased).toFixed(Number(el.dataset.decimals || 0));
      if (progress < 1) frames.set(el, requestAnimationFrame(step));
      else { el.textContent = value(el); frames.delete(el); }
    }
    frames.set(el, requestAnimationFrame(step));
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      run(entry.target);
    });
  }, { threshold:0.6 });
  els.forEach(function (el) { observer.observe(el); });

  function settle() {
    settled = true;
    observer.disconnect();
    frames.forEach(function (frame) { cancelAnimationFrame(frame); });
    frames.clear();
    els.forEach(function (el) { el.textContent = value(el); });
  }
  if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') window.pctMotion.onReduce(settle);
  if (mq && mq.addEventListener) mq.addEventListener('change', function (event) { if (event.matches) settle(); });
};
