/* Shared reduced-motion lifecycle. This must load before section inits. */
(function () {
  'use strict';

  /* If this file is loaded twice, keep the live object and its registrations. */
  if (window.pctMotion && window.pctMotion.__pct) return;

  var QUERY = '(prefers-reduced-motion: reduce)';
  var mql = typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null;
  var teardowns = [];

  function run(fn) {
    /* One bad teardown must never strand the ones behind it. */
    try { fn(); } catch (err) {}
  }

  function fireAll() {
    var list = teardowns;
    teardowns = [];
    for (var i = 0; i < list.length; i++) run(list[i]);
  }

  var motion = {
    __pct: true,
    reduced: !!(mql && mql.matches),
    onReduce: function (fn) {
      if (typeof fn !== 'function') return;
      if (motion.reduced) { run(fn); return; }
      teardowns.push(fn);
    }
  };

  function onChange(evt) {
    var on = evt && typeof evt.matches === 'boolean' ? evt.matches : !!(mql && mql.matches);
    motion.reduced = on;
    if (on) fireAll();
  }

  if (mql) {
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(onChange);            /* legacy Safari */
    }
  }

  window.pctMotion = motion;
}());

/* A single soft glow marks arrival at the invitation; the link is always visible. */
window.pctInitAct = function () {
  var section = document.querySelector('.act');
  if (!section || section.dataset.arrivalReady) return;
  section.dataset.arrivalReady = '1';
  var observer;
  function arrive() {
    section.classList.add('is-arrived');
    if (observer) observer.disconnect();
  }
  if (!window.IntersectionObserver || (window.pctMotion && window.pctMotion.reduced)) {
    arrive(); return;
  }
  observer = new IntersectionObserver(function (entries) {
    if (entries.some(function (entry) { return entry.isIntersecting; })) arrive();
  }, { threshold: .35 });
  observer.observe(section);
  if (window.pctMotion) window.pctMotion.onReduce(arrive);
};
