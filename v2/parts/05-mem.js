/* 05 - the arc.
 *
 * Cards sit on a circle whose centre is far below the section. One scalar `pos`
 * advances with time and every card's angle is its slot minus pos, wrapped, so
 * the strip is endless with no clone and no loop point.
 *
 * THE ONE THING THAT MAKES THIS LOOK RIGHT: the rotation is DAMPED. A card at
 * angle a sits at x = R sin a, y = R (1 - cos a), but it is rotated by only
 * a * TILT. At this radius the edge card is 39 degrees around the circle while
 * the reference tilts its edge cards about 20, so TILT is 0.51.
 *
 * That damping is also why this cannot be a CSS keyframe on a rotating hub: a hub
 * rotation applies the FULL angle to every child, and a fixed per-card
 * counter-rotation cannot track a hub that is itself turning.
 *
 * Geometry is measured on load and resize only. The loop writes transforms and
 * reads nothing.
 */
window.pctInitArc = function () {
  try {
    var band = document.querySelector('[data-mem-band]');
    var arc = band && band.querySelector('[data-mem-arc]');
    if (!band || !arc || band.dataset.on) return;

    var items = Array.prototype.slice.call(arc.children);
    var N = items.length;
    if (N < 6) return;

    var reduced = (window.pctMotion && window.pctMotion.reduced) ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    var TILT = 0.51;      /* fraction of the angular position applied as rotation */
    /* Arc spacing equal to the card width. Projected to the screen as x = R sin a,
       that means neighbours just meet at the apex and overlap progressively harder
       toward the edges, which is the reference's behaviour. A constant 13% overlap
       in ARC space compounded into roughly 45% on screen at the edges and the row
       turned into a stack. */
    var OVERLAP = 0;
    var SPEED = 0.052;    /* slots per second. one card passes about every 19s */

    /* --- geometry, measured on load and resize only ---------------------
       JS owns the card width and writes it back to CSS, rather than reading it
       back out of the stylesheet. Reading it back was the bug: --cardW is
       authored in vw, getPropertyValue returns the unresolved "28.8vw", and the
       offsetWidth fallback was measured before layout had settled. R and the
       angular step were both computed off a wrong width, which is why the arc
       came out shallow and lopsided with a hole on one side. */
    var CARD_FRAC_WIDE = 0.288;   /* measured off the reference */
    var CARD_FRAC_NARROW = 0.52;
    var R = 0, STEP = 0, W = 0, halfVW = 0;
    function measure() {
      var bw = band.clientWidth || 1;
      W = Math.round(bw * (bw < 768 ? CARD_FRAC_NARROW : CARD_FRAC_WIDE));
      band.style.setProperty('--cardW', W + 'px');
      halfVW = bw / 2;
      /* R solves drop = R(1 - cos(halfVW / R)) with drop = 2 * wedge.
         Bisection rather than a closed form: the equation has no elementary
         inverse and this runs twice in the life of the page. */
      /* d(R) = R(1 - cos(halfVW/R)) is NOT monotonic: below halfVW/(PI/2) the
         argument clamps and d rises with R, above it d falls. Bisecting the whole
         range can therefore land on the wrong branch. Search only the falling
         branch, which is the one that gives a wide shallow arc rather than a
         tight one. */
      var target = 2.4 * (0.33 * W);
      var lo = halfVW / (Math.PI / 2) + 1, hi = 40000, mid = lo, d;
      for (var k = 0; k < 60; k++) {
        mid = (lo + hi) / 2;
        d = mid * (1 - Math.cos(halfVW / mid));
        if (d > target) lo = mid; else hi = mid;
      }
      R = mid;
      STEP = (W * (1 - OVERLAP)) / R;   /* arc spacing between card centres */
    }

    /* --- paint ---------------------------------------------------------- */
    var pos = 0;
    function paint() {
      for (var i = 0; i < N; i++) {
        var a = (i - pos) * STEP;
        /* wrap into -PI..PI so cards recycle around the back of the circle */
        a = ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
        var el = items[i];
        if (Math.abs(a) > 1.35) { el.style.visibility = 'hidden'; continue; }
        var x = R * Math.sin(a);
        if (Math.abs(x) > halfVW + W) { el.style.visibility = 'hidden'; continue; }
        var y = R * (1 - Math.cos(a));
        el.style.visibility = 'visible';
        el.style.transform =
          'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' +
          (a * TILT * 180 / Math.PI).toFixed(2) + 'deg)';
        /* nearer the apex paints on top, so the overlap reads as a fan */
        el.style.zIndex = String(100 - Math.round(Math.abs(a) * 40));
      }
    }

    /* --- loop ----------------------------------------------------------- */
    var raf = null, last = 0, visible = true;
    function frame(ts) {
      raf = requestAnimationFrame(frame);
      var dt = last ? Math.min((ts - last) / 1000, 0.05) : 1 / 60;
      last = ts;
      pos += dt * SPEED;
      paint();
    }
    function start() { if (raf === null && !reduced && visible) { last = 0; raf = requestAnimationFrame(frame); } }
    function stop() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { measure(); paint(); }, 140);
    }, { passive: true });

    measure();
    band.dataset.on = '1';
    paint();

    if (reduced) return;   /* laid out and still */

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) start(); else stop();
      }, { rootMargin: '150px' }).observe(band);
    } else start();

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(function () { reduced = true; stop(); });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitArc:', err);
  }
};
