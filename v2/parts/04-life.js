/* ============================================================
   04 · EXPERIENCE — 3D photo rail
   Lifts the base scroll-snap strip into a perspective depth field.
   Auto-drifts card to card until the visitor drags, flicks
   horizontally, presses an arrow key or picks a tick — at which
   point they own it and the drift never comes back.
   Writes only transform / opacity / filter / z-index.
   ============================================================ */
window.pctInitLife = function () {
  'use strict';

  try {
    var rail = document.querySelector('[data-life-rail]');
    if (!rail || rail.hasAttribute('data-mode')) return;

    var stage = rail.querySelector('[data-life-stage]');
    var track = rail.querySelector('[data-life-track]');
    if (!stage || !track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.life-card'));
    var ticks = Array.prototype.slice.call(rail.querySelectorAll('.life-tick'));
    var N = cards.length;
    if (N < 3) return;

    var figs = cards.map(function (c) {
      return c.querySelector('.life-figure') || c;
    });

    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mqSmall = window.matchMedia('(max-width: 767px)');
    if (mqReduce.matches) return; /* never enhance: the strip is already finished */

    /* ---- state ---- */
    var deck = mqSmall.matches;
    var cur = 0, to = 0, from = 0, t0 = 0, dur = 0;
    var raf = 0, autoTimer = 0, resizeTimer = 0;
    var visible = false, taken = false, dead = false;
    var dragging = false, pending = false, pid = null;
    var pressX = 0, pressY = 0, startCur = 0, lastX = 0, lastT = 0, vel = 0;
    var suppressClick = false, wheelLock = 0;
    var cardW = 320, spacing = 200, activeIdx = -1;
    var cache = cards.map(function () {
      return { tf: '', op: '', fl: '', z: 0 };
    });

    var TWEEN_AUTO = 1150;
    var TWEEN_KEY = 560;
    var TWEEN_SNAP = 520;

    function dwell() { return deck ? 4300 : 3400; }
    function now() { return window.performance ? performance.now() : Date.now(); }

    /* brand easing, cubic-bezier(.22,.61,.36,1), solved by bisection */
    function ease(p) {
      var x1 = 0.22, y1 = 0.61, x2 = 0.36, y2 = 1;
      var lo = 0, hi = 1, t = p, u, x, i;
      for (i = 0; i < 16; i++) {
        u = 1 - t;
        x = 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t;
        if (x < p) { lo = t; } else { hi = t; }
        t = (lo + hi) / 2;
      }
      u = 1 - t;
      return 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
    }

    /* ---- measurement (load + resize only, never inside rAF) ---- */
    function measure() {
      /* offsetWidth, not getBoundingClientRect: the cards are already
         rotated in depth and a client rect would report the projection */
      var w = cards[0].offsetWidth;
      if (w > 0) cardW = w;
      spacing = deck ? cardW * 1.02 : cardW * 0.62;
    }

    /* ---- geometry ---- */
    function delta(i) {
      var d = ((i - cur) % N + N) % N;
      return d > N / 2 ? d - N : d;
    }

    function write(i, tf, op, fl, z) {
      var c = cache[i];
      if (c.tf !== tf) { cards[i].style.transform = tf; c.tf = tf; }
      if (c.z !== z) { cards[i].style.zIndex = z; c.z = z; }
      if (c.op !== op) { figs[i].style.opacity = op; c.op = op; }
      if (c.fl !== fl) { figs[i].style.filter = fl; c.fl = fl; }
    }

    function render() {
      var act = ((Math.round(cur) % N) + N) % N;
      if (act !== activeIdx) setActive(act);

      for (var i = 0; i < N; i++) {
        var d = delta(i);
        var ad = Math.abs(d);
        var tf, op, fl, z;

        if (deck) {
          /* phone: a deck of prints. The top one flicks away left. */
          if (d <= 0) {
            var k = Math.max(d, -1.35);
            tf = 'translate(-50%,-50%) translate3d(' + (k * cardW * 1.02).toFixed(1) +
                 'px,0,0) rotate(' + (k * 5.5).toFixed(2) + 'deg)';
            op = Math.max(0, 1 + d * 1.25);
            fl = 'none';
            z = 700 + Math.round(d * 20);
          } else {
            var m = Math.min(d, 3);
            tf = 'translate(-50%,-50%) translate3d(' + (m * 11).toFixed(1) + 'px,' +
                 (-m * 8).toFixed(1) + 'px,0) scale(' + (1 - m * 0.055).toFixed(4) + ')';
            op = Math.max(0, 1 - m * 0.3);
            fl = op <= 0.02 ? 'none' : 'blur(' + Math.min(m * 1.1, 3).toFixed(2) + 'px)';
            z = 500 - Math.round(m * 100);
          }
        } else {
          /* desktop: a stream of photographs receding through depth */
          var x = d * spacing;
          var zz = -Math.min(ad, 4) * 190;
          var ry = -Math.max(-3, Math.min(3, d)) * 15;
          tf = 'translate(-50%,0) translate3d(' + x.toFixed(1) + 'px,0,' +
               zz.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg)';
          op = Math.max(0, 1 - ad * 0.29);
          fl = op <= 0.02
            ? 'none'
            : 'blur(' + Math.min(ad * 2.1, 5.5).toFixed(2) + 'px) saturate(' +
              (1 - Math.min(ad * 0.17, 0.5)).toFixed(3) + ')';
          z = 500 - Math.round(ad * 100);
        }

        write(i, tf, op.toFixed(3), fl, z);
      }
    }

    function setActive(a) {
      if (activeIdx > -1 && cards[activeIdx]) cards[activeIdx].classList.remove('is-active');
      activeIdx = a;
      if (cards[a]) cards[a].classList.add('is-active');
      for (var i = 0; i < ticks.length; i++) {
        if (i === a) ticks[i].setAttribute('aria-current', 'true');
        else ticks[i].removeAttribute('aria-current');
      }
    }

    /* ---- motion loop (runs only while something is actually moving) ---- */
    function frame() {
      raf = 0;
      if (dead) return;

      if (dur > 0) {
        var p = (now() - t0) / dur;
        if (p >= 1) {
          cur = to;
          dur = 0;
          normalize();
          render();
          scheduleAuto();
          return;
        }
        cur = from + (to - from) * ease(p);
      }
      render();
      if (dur > 0 || dragging) raf = requestAnimationFrame(frame);
    }

    function kick() {
      if (!raf && !dead) raf = requestAnimationFrame(frame);
    }

    function normalize() {
      var m = ((to % N) + N) % N;
      to = m;
      cur = m;
    }

    function tweenTo(target, ms) {
      from = cur;
      to = target;
      t0 = now();
      dur = ms;
      clearTimeout(autoTimer);
      kick();
    }

    function goTo(i, ms) {
      var d = ((i - (((to % N) + N) % N)) % N + N) % N;
      if (d > N / 2) d -= N;
      tweenTo(to + d, ms || 760);
    }

    function scheduleAuto() {
      clearTimeout(autoTimer);
      if (taken || dead || !visible || document.hidden) return;
      autoTimer = setTimeout(function () {
        if (taken || dead || !visible || document.hidden) return;
        tweenTo(Math.round(to) + 1, TWEEN_AUTO);
      }, dwell());
    }

    function takeControl() {
      if (taken) return;
      taken = true;
      clearTimeout(autoTimer);
      rail.classList.add('is-taken');
    }

    /* ---- pointer / touch drag ---- */
    function onDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest && e.target.closest('a,button')) return;
      pending = true;
      dragging = false;
      pid = e.pointerId;
      pressX = lastX = e.clientX;
      pressY = e.clientY;
      lastT = now();
      vel = 0;
      dur = 0;
      to = cur;
      startCur = cur;
    }

    function onMove(e) {
      if (!pending || e.pointerId !== pid) return;
      var dx = e.clientX - pressX;
      var dy = e.clientY - pressY;

      if (!dragging) {
        if (Math.abs(dx) < 6) {
          if (Math.abs(dy) > 12) pending = false; /* vertical: it's a page scroll */
          return;
        }
        if (Math.abs(dx) <= Math.abs(dy)) { pending = false; return; }
        dragging = true;
        takeControl();
        rail.classList.add('is-dragging');
        try { stage.setPointerCapture(pid); } catch (err) {}
      }

      var t = now();
      var dt = Math.max(t - lastT, 1);
      vel = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = t;

      cur = startCur - dx / spacing;
      if (e.cancelable) e.preventDefault();
      kick();
    }

    function onUp(e) {
      if (e.pointerId !== pid) return;
      pending = false;
      pid = null;
      if (!dragging) {
        /* a press that never became a drag still froze the tween: resettle */
        if (Math.abs(cur - Math.round(cur)) > 0.001) tweenTo(Math.round(cur), TWEEN_SNAP);
        else if (!taken) scheduleAuto();
        return;
      }
      dragging = false;
      suppressClick = true;
      rail.classList.remove('is-dragging');
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}

      /* short, critically damped: at most one card of carry */
      var near = Math.round(cur);
      var target = Math.round(cur - (vel * 75) / spacing);
      target = Math.max(near - 1, Math.min(near + 1, target));
      tweenTo(target, TWEEN_SNAP);
    }

    /* horizontal trackpad flick takes control; vertical is left to the page */
    function onWheel(e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      if (e.cancelable) e.preventDefault();
      takeControl();
      var t = now();
      if (t < wheelLock) return;
      wheelLock = t + 380;
      step(e.deltaX > 0 ? 1 : -1);
    }

    /* always step from a whole card, even if a press froze mid-tween */
    function step(dir) {
      tweenTo(Math.round(to) + dir, TWEEN_KEY);
    }

    function onKey(e) {
      var k = e.key;
      if (k === 'ArrowRight') { e.preventDefault(); takeControl(); step(1); }
      else if (k === 'ArrowLeft') { e.preventDefault(); takeControl(); step(-1); }
      else if (k === 'Home') { e.preventDefault(); takeControl(); goTo(0); }
      else if (k === 'End') { e.preventDefault(); takeControl(); goTo(N - 1); }
    }

    function onClick(e) {
      if (suppressClick) { suppressClick = false; e.preventDefault(); return; }
      var card = e.target.closest ? e.target.closest('.life-card') : null;
      if (!card) return;
      var i = cards.indexOf(card);
      if (i < 0 || i === activeIdx) return;
      takeControl();
      goTo(i);
    }

    function onTick(e) {
      e.preventDefault();
      var i = ticks.indexOf(e.currentTarget);
      if (i < 0) return;
      takeControl();
      goTo(i);
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (dead) return;
        var wasDeck = deck;
        deck = mqSmall.matches;
        if (wasDeck !== deck) rail.setAttribute('data-mode', deck ? 'deck' : 'rail');
        measure();
        for (var i = 0; i < N; i++) cache[i] = { tf: '', op: '', fl: '', z: 0 };
        render();
      }, 150);
    }

    function onVisibility() {
      if (document.hidden) clearTimeout(autoTimer);
      else scheduleAuto();
    }

    /* ---- teardown: back to the plain scroll-snap strip ---- */
    function destroy() {
      if (dead) return;
      dead = true;
      clearTimeout(autoTimer);
      clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;

      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('keydown', onKey);
      stage.removeEventListener('click', onClick);
      ticks.forEach(function (t) { t.removeEventListener('click', onTick); });
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (io) { try { io.disconnect(); } catch (err) {} }

      var landed = activeIdx > -1 ? activeIdx : 0;
      for (var i = 0; i < N; i++) {
        cards[i].style.transform = '';
        cards[i].style.zIndex = '';
        cards[i].classList.remove('is-active');
        figs[i].style.opacity = '';
        figs[i].style.filter = '';
      }
      ticks.forEach(function (t) { t.removeAttribute('aria-current'); });
      if (ticks[0]) ticks[0].setAttribute('aria-current', 'true');
      rail.classList.remove('is-taken', 'is-dragging');
      rail.removeAttribute('data-mode');

      /* keep the visitor where they were, in the strip */
      try {
        var c = cards[landed];
        stage.scrollLeft = c.offsetLeft - (stage.clientWidth - c.offsetWidth) / 2;
      } catch (err) {}
    }

    /* ---- go ---- */
    stage.scrollLeft = 0;
    rail.setAttribute('data-mode', deck ? 'deck' : 'rail');
    measure();
    setActive(0);
    render();

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove, { passive: false });
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('keydown', onKey);
    stage.addEventListener('click', onClick);
    ticks.forEach(function (t) { t.addEventListener('click', onTick); });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) scheduleAuto();
        else clearTimeout(autoTimer);
      }, { threshold: 0.2 });
      io.observe(rail);
    } else {
      visible = true;
      scheduleAuto();
    }

    /* reduced motion can arrive mid-session */
    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(destroy);
    }
    if (mqReduce.addEventListener) {
      mqReduce.addEventListener('change', function (e) { if (e.matches) destroy(); });
    } else if (mqReduce.addListener) {
      mqReduce.addListener(function (e) { if (e.matches) destroy(); });
    }
  } catch (err) {
    /* one section must never take the page down */
    if (window.console && console.warn) console.warn('pctInitLife:', err);
  }
};
