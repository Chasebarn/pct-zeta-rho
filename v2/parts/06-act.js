/* ==========================================================================
   05-act.js
   1. window.pctMotion  — the shared motion hook every section registers with.
                          Defined at load time, outside any init, so it exists
                          before the lead calls the first section init.
                          (Load this file before the other section scripts.)
   2. window.pctInitCountdown — the state-aware rush clock. The CTA itself is
                          pure CSS and needs no JS at all.

   The chapter progress rail that used to live here (a fixed strip of stage
   labels and ticks in the right gutter) is deleted, markup, CSS and observer.
   It labelled the page at the reader rather than helping them, and on a site
   this short it was chrome for its own sake.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SHARED MOTION HOOK
       window.pctMotion.reduced          live boolean
       window.pctMotion.onReduce(fn)     fn runs when the user turns reduce ON
   Turning reduce OFF again does not restart anything; a reload does.
   If reduce is already ON when a section registers, its teardown runs at once,
   so teardowns must be safe to call even if the section never started.
   -------------------------------------------------------------------------- */
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




/* ---- countdown -----------------------------------------------------------
   State aware. Before rush: ticking digits. During rush (between data-until and
   data-ends): a single line, no digits. After, or with the attributes removed:
   the block hides itself rather than showing a dead clock. ---------------- */
window.pctInitCountdown = function () {
  try {
    var cd = document.querySelector('.act-cd');
    if (!cd) return;
    var startAttr = cd.getAttribute('data-until');
    var endAttr = cd.getAttribute('data-ends');
    if (!startAttr) { cd.hidden = true; return; }
    var start = new Date(startAttr).getTime();
    var end = endAttr ? new Date(endAttr).getTime() : start;
    if (isNaN(start)) { cd.hidden = true; return; }

    var lab = cd.querySelector('.act-cd-lab');
    var out = {};
    ['d','h','m','s'].forEach(function (k) { out[k] = cd.querySelector('[data-cd="' + k + '"]'); });
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var timer = null;

    function tick () {
      var now = Date.now();
      if (now >= start && now <= end) {          /* rush is underway */
        cd.classList.add('is-live');
        if (lab) lab.textContent = 'Rush is underway.';
        return;
      }
      if (now > end) { cd.hidden = true; stop(); return; }   /* season over */
      var diff = start - now;
      if (out.d) out.d.textContent = Math.floor(diff / 86400000);
      if (out.h) out.h.textContent = pad(Math.floor(diff / 3600000) % 24);
      if (out.m) out.m.textContent = pad(Math.floor(diff / 60000) % 60);
      if (out.s) out.s.textContent = pad(Math.floor(diff / 1000) % 60);
    }
    function stop () { if (timer) { clearInterval(timer); timer = null; } }
    tick();
    timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (!timer && !cd.hidden) { tick(); timer = setInterval(tick, 1000); }
    });
  } catch (e) { if (window.console) console.warn('countdown:', e); }
};
