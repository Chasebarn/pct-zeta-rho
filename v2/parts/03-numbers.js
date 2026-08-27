/* ============================================================
   03 — Numbers don’t lie.
   ONE signature interaction: the pinned horizontal scroll.

   The section is a tall .numscene wrapper holding a position:sticky pin.
   Vertical scroll inside that wrapper is mapped 1:1 onto a translateX of
   the track, so the statistics travel through the viewport while the
   heading holds still. Geometry (scene top, pin height, travel distance)
   is measured ONCE on enable, on resize and after the webfonts land; the
   frame loop only writes a transform.

   Under 768px, with JS off, or under prefers-reduced-motion, none of this
   runs and the CSS base state — a vertical sequence — is what renders.
   ============================================================ */

window.pctInitNumbers = function () {
  'use strict';

  /* ------------------------------------------------------------------
     THE STATS — the single place these values live.

     Only the first two are verified. Mirror any edit into
     03-numbers.html; that copy is what renders with JavaScript disabled,
     and this array overwrites it at runtime (warning in the console if
     the two have drifted apart).
     ------------------------------------------------------------------ */
  var STATS = [
    { value: '95',   unit: '%', label: 'Members placed in internships or full-time roles' },
    { value: '3.60', unit: '',  label: 'Chapter average GPA' },

    /* STAT 03 — NOT VERIFIED.
       this is a placeholder, the owner must supply a verified metric, do not
       publish invented data. Replace value/unit/label here and in the HTML. */
    { value: '—', unit: '', label: 'Verified metric to be confirmed' }
  ];

  /* pacing, as fractions of the pin height */
  var LEAD = 0.10;   /* held before the track starts to travel */
  var HOLD = 0.15;   /* held after it arrives, so the last number lands */
  var EASE = 0.18;   /* scroll → transform follow. 1 would be locked rigid */
  var MIN_TRAVEL = 60; /* below this there is nothing worth pinning for */

  try {
    var root = document.querySelector('[data-num]');
    if (!root || root.getAttribute('data-num-ready') === '1') return;

    var scene  = root.querySelector('[data-num-scene]');
    var pin    = root.querySelector('[data-num-pin]');
    var track  = root.querySelector('[data-num-track]');
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-num-p]'));
    if (!scene || !pin || !track || !panels.length) return;
    root.setAttribute('data-num-ready', '1');

    /* ---------------------------------------------------------------
       1. Content: STATS drives the DOM, the DOM is never empty first.
       --------------------------------------------------------------- */

    function setText(el, txt) {
      if (!el) return;
      var want = String(txt == null ? '' : txt);
      var now  = el.textContent || '';
      if (now.replace(/\s+/g, ' ').trim() === want.replace(/\s+/g, ' ').trim()) return;
      if (now.trim() && window.console && console.warn) {
        console.warn('pctInitNumbers: 03-numbers.html says "' + now.trim() +
          '" where STATS says "' + want.trim() +
          '". The HTML copy is what shows with JS off — update both.');
      }
      el.textContent = want;
    }

    for (var i = 0; i < panels.length; i++) {
      var s = STATS[i];
      if (!s) continue;
      setText(panels[i].querySelector('[data-num-n]'), s.value);
      setText(panels[i].querySelector('[data-num-u]'), s.unit || '');
      setText(panels[i].querySelector('[data-num-lab]'), s.label);
    }

    /* ---------------------------------------------------------------
       2. Mobile / unpinned: each statistic arrives as you reach it.
          .num--js is only added once there is an observer to undo it,
          so a statistic can never be left invisible.
       --------------------------------------------------------------- */

    var io = null;
    if (typeof window.IntersectionObserver === 'function') {
      root.classList.add('num--js');
      io = new window.IntersectionObserver(function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (!entries[k].isIntersecting) continue;
          entries[k].target.classList.add('is-in');
          if (io) io.unobserve(entries[k].target);
        }
      }, { rootMargin: '0px 0px -15% 0px', threshold: 0.12 });
      for (i = 0; i < panels.length; i++) io.observe(panels[i]);
    }

    /* ---------------------------------------------------------------
       3. The pin.
       --------------------------------------------------------------- */

    var mqWide = window.matchMedia ? window.matchMedia('(min-width: 768px)') : null;
    var mqRed  = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var reduced = !!((window.pctMotion && window.pctMotion.reduced) || (mqRed && mqRed.matches));

    var on = false, sy = 0, cur = 0, snap = true, raf = 0;
    var geo = { top: 0, lead: 0, travel: 0 };

    function scrollY() {
      return window.pageYOffset ||
        (document.documentElement && document.documentElement.scrollTop) || 0;
    }

    /* The only place layout is read — never from inside a frame.
       The track is the width of the pin and its panels overflow to the right.
       Travel is the distance from the first panel to the last, so every
       statistic comes to rest in exactly the same place: hard against the
       left gutter, under the heading. offsetLeft is immune to the transform
       already sitting on the track. */
    var first = panels[0], last = panels[panels.length - 1];

    function measure() {
      var pinH = pin.clientHeight || window.innerHeight || 1;
      var rect = scene.getBoundingClientRect();   /* transforms don't move it */
      geo.top    = rect.top + scrollY();
      geo.lead   = Math.round(pinH * LEAD);
      geo.travel = Math.max(0, Math.round(last.offsetLeft - first.offsetLeft));
      scene.style.height =
        (pinH + geo.lead + geo.travel + Math.round(pinH * HOLD)) + 'px';
      return pinH;
    }

    function wanted() {
      if (reduced) return false;
      return mqWide ? mqWide.matches : window.innerWidth >= 768;
    }

    function enable() {
      if (on) return;
      root.classList.add('num--pin');

      /* If the pinned stylesheet is not in force — an old browser without
         feature queries, or this part assembled without its CSS — sticky
         will not have taken. Back out and stay a vertical sequence. */
      var pos = '';
      try { pos = window.getComputedStyle(pin).position; } catch (e) {}
      if (pos !== 'sticky' && pos !== '-webkit-sticky') { root.classList.remove('num--pin'); return; }

      on = true;
      measure();
      if (geo.travel < MIN_TRAVEL) { disable(); return; }

      snap = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    function disable() {
      on = false;
      root.classList.remove('num--pin');
      scene.style.height = '';
      track.style.transform = '';
      cur = 0;
      snap = true;
      window.removeEventListener('scroll', onScroll);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    function onScroll() {
      sy = scrollY();
      if (!raf) raf = requestAnimationFrame(frame);
    }

    /* writes only. no measuring, no classList work, no layout reads. */
    function frame() {
      raf = 0;
      if (!on) return;

      var raw = sy - geo.top - geo.lead;
      var target = raw < 0 ? 0 : (raw > geo.travel ? geo.travel : raw);
      var d = target - cur;

      if (snap || (d < 0.4 && d > -0.4)) {
        if (!snap && d === 0) return;             /* nothing moved: don't paint */
        cur = target;
        snap = false;
      } else {
        cur += d * EASE;
        raf = requestAnimationFrame(frame);
      }

      track.style.transform = 'translate3d(' + (-cur).toFixed(2) + 'px,0,0)';
    }

    /* ---- resize / font swap: re-measure, then land without easing ---- */

    var rTimer = 0;
    function refresh() {
      clearTimeout(rTimer);
      rTimer = setTimeout(function () {
        try {
          if (!wanted()) { if (on) disable(); return; }
          if (!on) { enable(); return; }
          measure();
          if (geo.travel < MIN_TRAVEL) { disable(); return; }
          snap = true;
          onScroll();
        } catch (e) { disable(); }
      }, 140);
    }

    window.addEventListener('resize', refresh, { passive: true });

    /* A hidden tab stops firing frames, so a scroll made while away is painted
       on return. Land it flat instead of easing in from a stale position. */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && on) { snap = true; onScroll(); }
    });

    if (window.screen && window.screen.orientation && window.screen.orientation.addEventListener) {
      window.screen.orientation.addEventListener('change', refresh);
    }
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      /* the numerals set the track width, so it changes when the serif lands */
      document.fonts.ready.then(refresh).catch(function () {});
    }

    /* ---- reduced motion, including a change made mid-session ---- */

    function stop() {
      reduced = true;
      disable();
      root.classList.remove('num--js');
      if (io) { io.disconnect(); io = null; }
      for (var k = 0; k < panels.length; k++) panels[k].classList.add('is-in');
    }

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(stop);            /* fires at once if already on */
    } else if (mqRed && mqRed.addEventListener) {
      mqRed.addEventListener('change', function (e) { if (e.matches) stop(); });
    }

    if (wanted()) enable();

  } catch (err) {
    /* one section must never take the page down */
    if (window.console && console.warn) console.warn('pctInitNumbers:', err);
  }
};
