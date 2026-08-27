/* 01 · HERO — the silk field.
 *
 * ONE interaction: the thread field. It has three states and nothing else.
 *
 *   ARRIVAL   Over ~4.6s from first paint the motion envelope eases to zero and the
 *             rAF loop cancels itself outright. It does not idle in the background.
 *             (This is also WCAG 2.2.2 — motion that starts on load and runs beside
 *             other content has to be stoppable; ending is the strongest form of it.)
 *   COMPOSURE As the envelope decays, the per-thread phase offset decays FASTER
 *             (coh = env^2), so the field resolves from turbulent to parallel. The
 *             threads come to rest hanging in unison, a static drape, not a grid.
 *   PULL      Pointer over the Rush button (fine pointers only): the silk gathers
 *             toward the button's centre on a target/current lerp with a gaussian
 *             falloff. Release lerps back and the loop cancels itself again.
 *             The watermark's opacity lift is CSS (:has), not this file.
 *
 * A touch tap never restarts anything. Nothing here is read from layout inside rAF.
 */
window.pctInitHero = function () {
  try {
    var root = document.querySelector('.v2hero');
    if (!root || root.dataset.heroReady === '1') return;

    var canvas = root.querySelector('[data-hero-canvas]');
    var cta = root.querySelector('[data-hero-cta]');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    root.dataset.heroReady = '1';

    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var mqSmall = window.matchMedia('(max-width: 767px)');
    var reduced = mqReduce.matches;

    var SETTLE = 4600;   /* ms from first paint (or last pointer move) to stillness */
    var WAKE_GAP = 140;  /* ms of pointer stillness that counts as "the pointer stopped" */

    /* ---- geometry, measured on load + resize only, never inside the loop ---- */
    var W = 0, H = 0, dpr = 1, LINES = 24, PR = 1;
    var cx = 0, cy = 0;          /* CTA centre, canvas device px */
    var mx = 0.5, my = 0.5;      /* normalised pointer over the hero */

    function measure() {
      /* phones: fewer threads and a lower dpr cap. Same picture, a third of the fill. */
      var small = mqSmall.matches;
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      LINES = small ? 14 : 26;
      W = canvas.width = Math.max(1, Math.round(canvas.offsetWidth * dpr));
      H = canvas.height = Math.max(1, Math.round(canvas.offsetHeight * dpr));
      PR = Math.max(W, H) * 0.26;   /* pull falloff radius */
      measureCta();
    }

    function measureCta() {
      if (!cta) { cx = W * 0.5; cy = H * 0.5; return; }
      var c = canvas.getBoundingClientRect();
      var b = cta.getBoundingClientRect();
      cx = (b.left + b.width / 2 - c.left) * dpr;
      cy = (b.top + b.height / 2 - c.top) * dpr;
    }

    /* ---- one frame ---- */
    var t = 0;

    function paint(env, pull) {
      ctx.clearRect(0, 0, W, H);
      var step = Math.max(8 * dpr, W / 150);
      var coh = env * env;                 /* phase spread: decays faster than amplitude */
      var pulling = pull > 0.002;
      var i, x, u;

      for (i = 0; i < LINES; i++) {
        var p = i / LINES;
        var yBase = H * (0.16 + p * 0.76);
        var amp = H * 0.05 * (0.35 + p) * (0.7 + 0.6 * my) * env;
        var drape = H * 0.014 * (0.4 + p); /* time-independent: the resting hang */
        var lateral = Math.sin(t * 0.4 + i * 2.1 * coh) * 6 * dpr * env;

        ctx.beginPath();
        for (x = 0; x <= W + step; x += step) {
          u = x / dpr;
          var wave =
            Math.sin(u * 0.0016 + t * 0.7 + i * 0.42 * coh) *
            Math.cos(u * 0.0006 - t * 0.32 + i * 1.7 * coh);
          var y = yBase
                + Math.sin(u * 0.0011 + i * 0.30 * coh) * drape
                + wave * amp * (0.6 + 0.8 * mx)
                + lateral;

          if (pulling) {
            var ndx = (x - cx) / PR, ndy = (y - cy) / PR;
            var f = Math.exp(-(ndx * ndx + ndy * ndy));
            y += (cy - y) * f * pull * 0.32;
          }

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

    /* ---- loop lifecycle: runs only while something is actually changing ---- */
    var raf = null, running = false, visible = true;
    var env = 1, envFrom = 1, settleAt = 0, lastMove = -1e9;
    var pull = 0, pullTarget = 0;

    function stop() {
      running = false;
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      paint(env, pull);   /* never leave the field frozen mid-sway */
    }

    function frame(ts) {
      raf = requestAnimationFrame(frame);
      var busy = false;

      if (ts - lastMove < WAKE_GAP) {
        /* pointer still moving: lift the envelope and hold the settle clock at now,
           so the ease-out later starts from wherever we are — never a jump */
        env += (1 - env) * 0.12;
        if (env > 0.999) env = 1;
        envFrom = env; settleAt = ts; busy = true;
      } else if (env > 0) {
        var k = Math.min((ts - settleAt) / SETTLE, 1);
        /* smoothstep: leaves full sway without a jerk and arrives at stillness with
           zero velocity, so the final moment of motion — and the cancel — is unseen */
        env = envFrom * (1 - k * k * (3 - 2 * k));
        if (k >= 1) env = 0;
        if (env > 0) busy = true;
      }

      if (pull !== pullTarget) {
        pull += (pullTarget - pull) * 0.10;
        if (Math.abs(pullTarget - pull) < 0.002) pull = pullTarget;
        busy = true;
      }

      if (visible) paint(env, pull);
      t += 0.008 * env;   /* drift decelerates with the envelope */

      if (!busy) stop();
    }

    function ensure(ts) {
      if (running || reduced) return;
      running = true;
      envFrom = env;
      settleAt = ts || performance.now();
      raf = requestAnimationFrame(frame);
    }

    /* ---- teardown ---- */
    function teardown() {
      reduced = true;
      env = 0; pull = 0; pullTarget = 0;
      stop();   /* paints the composed resting frame */
    }

    /* ---- events ---- */
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measure();                        /* resizing the backing store clears it */
        if (!running) paint(env, pull);
      }, 120);
    }, { passive: true });

    window.addEventListener('scroll', function () {
      if (pullTarget > 0) measureCta();   /* only while a pull is live */
    }, { passive: true });

    root.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      /* fine pointers only — a tap synthesises a mousemove, and touch must never
         restart motion the reader did not ask for */
      if (reduced || !mqFine.matches) return;
      lastMove = performance.now();
      ensure(lastMove);
    }, { passive: true });

    if (cta) {
      var grab = function () {
        if (reduced || !mqFine.matches) return;
        measureCta();          /* layout read on the event, never in the loop */
        pullTarget = 1;
        ensure();
      };
      var release = function () {
        if (pullTarget === 0) return;
        pullTarget = 0;
        ensure();
      };
      cta.addEventListener('pointerenter', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        grab();
      });
      cta.addEventListener('pointerleave', release);
      cta.addEventListener('focus', grab);
      cta.addEventListener('blur', release);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(canvas);
    }

    /* ---- go ---- */
    measure();

    if (reduced) {
      env = 0;
      paint(0, 0);   /* one composed frame; the loop never starts */
    } else {
      ensure(performance.now());
      if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
        window.pctMotion.onReduce(teardown);
      }
      var onMq = function () { if (mqReduce.matches) teardown(); };
      if (mqReduce.addEventListener) mqReduce.addEventListener('change', onMq);
      else if (mqReduce.addListener) mqReduce.addListener(onMq);

      /* If the page runs an entrance curtain, restamp the envelope when it lifts so
         the whole arrival plays in view rather than behind an opaque panel. */
      document.addEventListener('pct:curtain-up', function () {
        if (reduced || !running) return;
        envFrom = env;
        settleAt = performance.now();
      }, { once: true });
    }
  } catch (err) {
    /* one section must never be able to kill the page */
    if (window.console && console.warn) console.warn('pctInitHero:', err);
  }
};
