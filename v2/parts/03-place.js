/* ==========================================================================
   04 — the placement belts.

   The section ships as two static wrapped lists. All this does is clone each
   list once — so a belt can translate by exactly -50% and land on itself —
   and then hand the drift to CSS. No rAF, no scroll handler: the browser runs
   the whole thing on the compositor.

   The only measurement is one width read per row, taken on load, on resize and
   after the webfont swaps, then cached. A belt's DURATION is derived from that
   width so both rows move at a fixed pixels-per-second no matter how wide the
   content is — which is what keeps the speed right the day real logo files
   replace the type-set wordmarks. Nothing is ever measured inside a frame.
   ========================================================================== */
window.pctInitPlace = function () {
  'use strict';
  try {
    var root = document.querySelector('[data-place]');
    if (!root) return;

    var rows = Array.prototype.slice.call(root.querySelectorAll('[data-pl-row]'));
    if (!rows.length) return;

    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var reduced = (window.pctMotion && window.pctMotion.reduced) || !!(mq && mq.matches);
    if (reduced) return;          /* the wrapped list already IS the finished state */

    /* pixels per second, [row one, row two]. Row two runs slower so the two
       belts never look mechanically twinned. Slow enough to read a name. */
    var SPEED_DESK  = [30, 24];
    var SPEED_PHONE = [20, 16];
    var phoneMq = window.matchMedia ? window.matchMedia('(max-width: 767px)') : null;

    /* ---- clone each list once ------------------------------------------ */
    var belts = [];
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      if (row.dataset.on) continue;                       /* already running */
      var track = row.querySelector('[data-pl-track]');
      if (!track || !track.children.length) continue;

      var cells = Array.prototype.slice.call(track.children);
      var frag = document.createDocumentFragment();
      for (var c = 0; c < cells.length; c++) {
        var copy = cells[c].cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');         /* names are read once */
        copy.setAttribute('data-pl-clone', '');
        frag.appendChild(copy);
      }
      track.appendChild(frag);
      row.dataset.on = '1';
      belts.push({ row: row, track: track, i: belts.length, w: 0 });
    }
    if (!belts.length) return;

    /* ---- timing --------------------------------------------------------- */
    function speed(i) {
      var set = (phoneMq && phoneMq.matches) ? SPEED_PHONE : SPEED_DESK;
      return set[i % set.length];
    }

    /* measure -> cache -> write a custom property. Never called from a loop. */
    function measure() {
      for (var k = 0; k < belts.length; k++) {
        var b = belts[k];
        var full = b.track.scrollWidth;                   /* both copies, untransformed */
        if (!full) continue;
        var one = full / 2;
        if (Math.abs(one - b.w) < 4) continue;            /* don't restart a belt for a rounding blip */
        b.w = one;
        b.track.style.setProperty('--pl-dur', (one / speed(b.i)).toFixed(2) + 's');
      }
    }
    function remeasure() {
      for (var k = 0; k < belts.length; k++) belts[k].w = 0;
      measure();
    }
    measure();

    /* Re-measure when the belt can actually have changed width: a resize, the
       webfont swapping in, real logo files finishing their download. Setting a
       duration cannot change a track's size, so observing it here cannot loop. */
    var ro = null;
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(measure);
      for (var o = 0; o < belts.length; o++) ro.observe(belts[o].track);
    }
    var timer = 0;
    function onResize() { clearTimeout(timer); timer = setTimeout(measure, 150); }
    window.addEventListener('resize', onResize);
    if (document.readyState !== 'complete') window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(measure).catch(function () {});
    }
    if (phoneMq && phoneMq.addEventListener) {
      phoneMq.addEventListener('change', remeasure);      /* phone speed differs */
    }

    /* ---- don't animate off screen --------------------------------------- */
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        for (var e = 0; e < entries.length; e++) {
          entries[e].target.classList.toggle('is-out', !entries[e].isIntersecting);
        }
      }, { rootMargin: '160px 0px' });
      for (var p = 0; p < belts.length; p++) io.observe(belts[p].row);
    }

    /* ---- reduced motion, mid-session: put the DOM back --------------------
       Removing the clones and the data-on flag drops every belt rule, which
       leaves the static wrapped lists the page ships without JS. Safe to run
       even if nothing ever started. */
    function settle() {
      try {
        if (ro) { ro.disconnect(); ro = null; }
        if (io) { io.disconnect(); io = null; }
        clearTimeout(timer);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('load', measure);
        for (var k = 0; k < belts.length; k++) {
          var b = belts[k];
          b.row.classList.remove('is-out');
          delete b.row.dataset.on;
          b.track.style.removeProperty('--pl-dur');
          var dead = b.track.querySelectorAll('[data-pl-clone]');
          for (var d = 0; d < dead.length; d++) {
            if (dead[d].parentNode) dead[d].parentNode.removeChild(dead[d]);
          }
        }
      } catch (e) {}
    }

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(settle);
    } else if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (e) { if (e.matches) settle(); });
    }
  } catch (err) {
    /* one section must never take the page down */
    if (window.console && console.warn) console.warn('pctInitPlace:', err);
  }
};

/* The count-up. The owner asked for it by name: "make every number load, pick a
   section and just have them come in", on this section.

   It runs ONCE, the first time the figures are scrolled into view, and each target
   is unobserved the moment it fires. The finished value is already printed in the
   markup, so this only ever replaces a correct number with the same correct number
   at the end. With JS off, under reduced motion, or if the observer never fires,
   the reader sees the real figure and nothing is missing. */
window.pctInitCount = function () {
  try {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (!els.length || !('IntersectionObserver' in window)) return;

    var reduced = (window.pctMotion && window.pctMotion.reduced) ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) return;

    var DUR = 1500;

    function run(el, i) {
      var to = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (isNaN(to)) return;
      /* a short stagger so the three read as one gesture rather than a drum roll */
      var delay = i * 130;
      var start = 0;
      el.textContent = dec ? (0).toFixed(dec) : '0';
      function step(ts) {
        if (!start) start = ts;
        var k = (ts - start - delay) / DUR;
        if (k < 0) { requestAnimationFrame(step); return; }
        if (k > 1) k = 1;
        /* ease-out cubic: quick off the mark, arrives without overshoot */
        var e = 1 - Math.pow(1 - k, 3);
        el.textContent = dec ? (to * e).toFixed(dec) : String(Math.round(to * e));
        if (k < 1) requestAnimationFrame(step);
        else el.textContent = dec ? to.toFixed(dec) : String(to);   /* exact, never 94.9997 */
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target, els.indexOf(en.target));
        io.unobserve(en.target);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { io.observe(el); });

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(function () {
        io.disconnect();
        els.forEach(function (el) {
          var d = parseInt(el.getAttribute('data-decimals') || '0', 10);
          var v = parseFloat(el.getAttribute('data-count'));
          if (!isNaN(v)) el.textContent = d ? v.toFixed(d) : String(v);
        });
      });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitCount:', err);
  }
};
