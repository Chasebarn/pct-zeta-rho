/* 05 — the photography band.
   Clones the photo list once so the loop point falls exactly where the second
   copy starts, then sets the keyframe's end transform to minus the width of one
   copy. The result reads as an endless strip with no visible seam and no
   snapping. There is no hover-pause: a strip that stops under the cursor
   punishes the reader for looking at it.

   The animation itself is CSS, so it runs on the compositor. This file only
   measures, clones, and toggles play-state when the band leaves the screen. */
window.pctInitLife = function () {
  try {
    var band = document.querySelector('[data-mem-band]');
    if (!band || band.dataset.on) return;

    var track = band.querySelector('[data-mem-track]');
    if (!track) return;

    var items = Array.prototype.slice.call(track.children);
    if (items.length < 3) return;

    var reduced = (window.pctMotion && window.pctMotion.reduced) ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduced) return;                 /* CSS already shows a scrollable strip */

    /* the second copy is decorative duplication: hide it from assistive tech */
    items.forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      var img = c.querySelector('img');
      if (img) img.setAttribute('alt', '');
      track.appendChild(c);
    });

    /* px per second. At the desktop card width (~460px) one photograph passes
       every ~6 seconds: clearly in motion, but slow enough to look at. 34 px/s,
       the first value tried, took 126 seconds to complete a loop and read as a
       still image. */
    var SPEED = 75;

    function measure() {
      /* width of one copy = half the track, minus half of one gap that the
         flex gap adds between the two copies */
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var full = track.scrollWidth;
      var one = (full + gap) / 2;
      if (!one || !isFinite(one)) return;
      track.style.setProperty('--mem-shift', (-one) + 'px');
      track.style.setProperty('--mem-dur', (one / SPEED).toFixed(1) + 's');
    }

    /* images may still be loading when we first measure; remeasure once they land */
    measure();
    if (document.readyState !== 'complete') {
      window.addEventListener('load', measure, { once: true });
    }
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(measure);
      ro.observe(band);
    } else {
      window.addEventListener('resize', measure);
    }

    band.dataset.on = '1';

    /* stop paying for frames the reader cannot see */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) band.removeAttribute('data-paused');
        else band.setAttribute('data-paused', '');
      }, { rootMargin: '160px' }).observe(band);
    }

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(function () {
        band.removeAttribute('data-on');
        track.style.removeProperty('--mem-shift');
        track.style.removeProperty('--mem-dur');
      });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitLife:', err);
  }
};
