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

    /* Fraction of the angular position applied as rotation. At this radius the
       edge card is 47 degrees around the circle; the reference tilts about 20. */
    var TILT = 0.45;
    var SPEED = 0.040;    /* slots per second. one card passes about every 19s */

    /* --- geometry, measured on load and resize only ---------------------
       Derived directly, with no solver. An earlier version bisected for R against
       d(R) = R(1 - cos(h/R)), which is NOT monotonic, so it could land on the
       tight-arc branch. And it read the card width back out of the stylesheet,
       where --cardW is authored in vw and comes back as the unresolved string.
       JS now owns the width and writes it INTO the CSS.

       SLOTS is a whole circle, so STEP closes exactly and there is no seam.
       Setting the arc spacing equal to the card width means neighbours TOUCH at
       the apex rather than pile up. That also removes the glitching: with no
       overlap in the middle there is no z-order for the eye to catch changing.
       Toward the edges the projection compresses (x = R sin a) so they do overlap
       there, which is the fan. */
    var SLOTS = 15;                          /* matches the 15 <li> in the markup */
    var STEP = 2 * Math.PI / SLOTS;          /* 24 degrees */
    var CARD_FRAC_WIDE = 0.288;              /* measured off the reference */
    var CARD_FRAC_NARROW = 0.52;
    var R = 0, W = 0, halfVW = 0;
    function measure() {
      var bw = band.clientWidth || 1;
      W = Math.round(bw * (bw < 768 ? CARD_FRAC_NARROW : CARD_FRAC_WIDE));
      band.style.setProperty('--cardW', W + 'px');
      halfVW = bw / 2;
      /* arc spacing == card width  =>  R = W / STEP. At 15 slots that is 68.8vw,
         which drops 250px across a 1440 viewport: about twice the curvature of
         the 32-slot version, which read as flat. */
      R = W / STEP;
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
