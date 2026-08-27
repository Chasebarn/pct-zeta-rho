/* 04 — the memory fan.
   One continuous scalar `pos` drives everything. Each photo's slot is its index
   minus pos, wrapped, so the composition reshuffles forever with no snapping and
   no clones. Drag adds to pos; autoplay resumes after a few idle seconds.
   Every geometry input is measured once (load + resize) and cached — the loop
   only writes transforms. */
window.pctInitLife = function () {
  try {
    var stage = document.querySelector('.mem-stage');
    if (!stage || stage.dataset.on) return;
    var items = Array.prototype.slice.call(stage.querySelectorAll('.mem-i'));
    if (items.length < 3) return;

    var reduced = (window.pctMotion && window.pctMotion.reduced) ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) return;                 /* CSS already shows the finished strip */

    stage.dataset.on = '1';

    var N = items.length, half = (N - 1) / 2;
    var pos = 0, target = 0, drag = null, idle = 0, raf = null, last = 0;
    var SPEED = 0.085;                   /* slots per second. deliberately slow */
    var IDLE_RESUME = 2600;              /* ms of stillness before drift returns */

    /* --- cached geometry ------------------------------------------------- */
    var W = 0, spacing = 0, arc = 0;
    function measure () {
      W = stage.clientWidth || 1;
      spacing = W * 0.235;               /* overlap: cards are wider than this */
      arc = Math.min(W * 0.075, 74);     /* shallow fan drop at the edges */
    }
    measure();
    var ro = null;
    if ('ResizeObserver' in window) { ro = new ResizeObserver(measure); ro.observe(stage); }
    else window.addEventListener('resize', measure);

    /* --- paint ------------------------------------------------------------ */
    function paint () {
      for (var i = 0; i < N; i++) {
        /* signed distance from centre, wrapped into -half..half */
        var d = i - pos;
        d = ((d % N) + N) % N;
        if (d > N / 2) d -= N;

        var a = Math.abs(d);
        var x = d * spacing;
        var y = arc * (d / (N / 2)) * (d / (N / 2));      /* parabola: edges sink */
        var rot = d * 3.6 + (i % 2 ? 1.4 : -1.6);         /* imperfect, not mechanical */
        var sc = 1 - Math.min(a / (N / 2), 1) * 0.3;      /* centre reads largest */
        var op = a > N / 2 - 0.6 ? 0 : 1;                 /* hide the seam only */

        var el = items[i];
        el.style.transform =
          'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) ' +
          'rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
        el.style.zIndex = String(100 - Math.round(a * 10));
        el.style.opacity = op;
        el.classList.toggle('is-mid', a < 0.5);
      }
    }

    /* --- loop ------------------------------------------------------------- */
    function frame (t) {
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (drag === null) {
        if (idle > 0) idle -= dt * 1000;
        if (idle <= 0) target += SPEED * dt;              /* free drift */
      }
      pos += (target - pos) * 0.12;                        /* always eased */
      paint();
      raf = requestAnimationFrame(frame);
    }
    function start () { if (raf === null) { last = 0; raf = requestAnimationFrame(frame); } }
    function stop () { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

    /* only run while on screen */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es[0].isIntersecting ? start() : stop();
      }, { rootMargin: '120px' }).observe(stage);
    } else start();

    /* --- drag ------------------------------------------------------------- */
    function down (e) {
      if (e.button != null && e.button !== 0) return;
      drag = { x: e.clientX, at: target };
      stage.classList.add('is-drag');
      if (stage.setPointerCapture && e.pointerId != null) stage.setPointerCapture(e.pointerId);
    }
    function move (e) {
      if (!drag) return;
      target = drag.at - (e.clientX - drag.x) / spacing;
      e.preventDefault();
    }
    function up () {
      if (!drag) return;
      drag = null; idle = IDLE_RESUME;                     /* autoplay comes back */
      stage.classList.remove('is-drag');
    }
    stage.addEventListener('pointerdown', down);
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    stage.addEventListener('pointerleave', up);

    /* keyboard: the stage is focusable, so it must be operable */
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { target += 1; idle = IDLE_RESUME; e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { target -= 1; idle = IDLE_RESUME; e.preventDefault(); }
    });

    paint();
    if (window.pctMotion && window.pctMotion.onReduce) {
      window.pctMotion.onReduce(function () {
        stop();
        if (ro) ro.disconnect();
        delete stage.dataset.on;
        items.forEach(function (el) {
          el.style.transform = ''; el.style.zIndex = ''; el.style.opacity = '';
        });
      });
    }
  } catch (err) { if (window.console) console.warn('life:', err); }
};
