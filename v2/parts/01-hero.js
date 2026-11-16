/* 01 · HERO — the silk field.
 *
 * This is atmosphere, not an event. The threads sway CONTINUOUSLY, slowly, and
 * they never resolve to a dead straight line. An earlier build eased the motion
 * envelope to zero over ~6s and cancelled the loop; the field then hung
 * perfectly parallel and stopped responding to anything, which read as broken
 * rather than as arrival. That behaviour is gone.
 *
 * MOUSE: the pointer's position over the hero eases two scalars (mx, my) that
 * bend the wave. It is a lean, not a chase — the threads never snap toward the
 * cursor. Touch does nothing; a tap must not make the page jump.
 *
 * COST CONTROL: the loop is gated on IntersectionObserver, so it stops dead the
 * moment the hero leaves the viewport. prefers-reduced-motion paints one static
 * frame and never starts. Nothing here reads layout inside rAF.
 */
window.pctInitHero = function () {
  try {
    var root = document.querySelector('.v2hero');
    if (!root || root.dataset.heroReady === '1') return;

    var canvas = root.querySelector('[data-hero-canvas]');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    root.dataset.heroReady = '1';

    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var mqSmall = window.matchMedia('(max-width: 767px)');
    var reduced = mqReduce.matches;

    /* ---- geometry, measured on load + resize only, never inside the loop ---- */
    var W = 0, H = 0, dpr = 1, LINES = 26;

    function measure() {
      var small = mqSmall.matches;
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      LINES = small ? 14 : 26;
      W = canvas.width = Math.max(1, Math.round(canvas.offsetWidth * dpr));
      H = canvas.height = Math.max(1, Math.round(canvas.offsetHeight * dpr));
    }

    /* pointer lean: target is set by the event, current eases toward it in the
       loop, so a fast flick across the hero produces a swell, not a snap */
    var mxT = 0.5, myT = 0.5, mx = 0.5, my = 0.5;

    var t = 0;

    function paint() {
      ctx.clearRect(0, 0, W, H);
      var step = Math.max(8 * dpr, W / 150);
      var i, x, u;

      for (i = 0; i < LINES; i++) {
        var p = i / LINES;
        var yBase = H * (0.16 + p * 0.76);
        /* amplitude grows toward the bottom of the field and leans with my */
        var amp = H * 0.052 * (0.35 + p) * (0.72 + 0.56 * my);
        var lateral = Math.sin(t * 0.4 + i * 2.1) * 6 * dpr;

        ctx.beginPath();
        for (x = 0; x <= W + step; x += step) {
          u = x / dpr;
          var wave =
            Math.sin(u * 0.0016 + t * 0.7 + i * 0.42) *
            Math.cos(u * 0.0006 - t * 0.32 + i * 1.7);
          var y = yBase + wave * amp * (0.62 + 0.76 * mx) + lateral;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }

        var gold = i % 4 === 0;
        ctx.strokeStyle = gold
          ? 'rgba(201,162,39,' + (0.06 + 0.11 * p).toFixed(3) + ')'
          : 'rgba(150,118,215,' + (0.04 + 0.08 * p).toFixed(3) + ')';
        ctx.lineWidth = (gold ? 1.2 : 0.8) * dpr;
        ctx.stroke();
      }
    }

    /* ---- loop ----
       Everything advances on ELAPSED TIME, not on frame count. A per-frame
       increment makes the sway run at the refresh rate: the same page drifts
       twice as fast on a 120Hz laptop as on a 60Hz monitor. dt is clamped so a
       backgrounded tab returning after ten seconds resumes rather than jumping. */
    var raf = null, visible = true, last = 0;
    /* 0.48 rad/s is exactly the live site's drift (js/main.js ran ht += 0.008 a
       frame at 60Hz), which is the pace the owner signed off on. One full pass
       of the wave across the hero takes about 19 seconds. */
    var RATE = 0.48;
    var LEAN = 2.8;    /* pointer lean convergence, per second */

    function frame(ts) {
      raf = requestAnimationFrame(frame);
      var dt = last ? Math.min((ts - last) / 1000, 0.05) : 1 / 60;
      last = ts;

      t += dt * RATE;
      var k = Math.min(1, dt * LEAN);
      mx += (mxT - mx) * k;
      my += (myT - my) * k;
      paint();
    }

    function start() {
      if (raf !== null || reduced || !visible) return;
      last = 0;                   /* resume without a jump */
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    }

    /* ---- teardown for a mid-session reduce toggle ---- */
    function teardown() {
      reduced = true;
      stop();
      mx = my = 0.5;
      paint();   /* one still frame, still a wave, just not moving */
    }

    /* ---- events ---- */
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measure();               /* resizing the backing store clears it */
        paint();
      }, 120);
    }, { passive: true });

    root.addEventListener('pointermove', function (e) {
      if (reduced || !mqFine.matches) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      /* clientX/Y against a rect cached per event, not per frame */
      var r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      mxT = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      myT = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }).observe(canvas);
    }

    /* ---- go ---- */
    measure();

    if (reduced) {
      paint();
    } else {
      start();
      if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
        window.pctMotion.onReduce(teardown);
      }
      var onMq = function () { if (mqReduce.matches) teardown(); };
      if (mqReduce.addEventListener) mqReduce.addEventListener('change', onMq);
      else if (mqReduce.addListener) mqReduce.addListener(onMq);
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitHero:', err);
  }
};
