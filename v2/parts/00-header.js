/* Shared scroll reveal.

   Sections arrive instead of being already there. One IntersectionObserver for
   the whole page, one class toggle, and the animation itself is a compositor-only
   opacity + translate. Nothing here reads layout, and nothing runs after an
   element has arrived: each target is unobserved the moment it fires.

   THE NO-JS AND REDUCED-MOTION CONTRACT: the hidden state is applied by THIS
   FILE, not by the stylesheet. If the script never runs, or the reader has asked
   for reduced motion, no element is ever hidden in the first place, so the page
   is simply the finished page. A stylesheet that ships opacity:0 and waits for a
   script is how content disappears when the script fails. */
window.pctInitReveal = function () {
  try {
    if (!('IntersectionObserver' in window)) return;

    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    /* One target per meaningful block. Deliberately coarse: revealing every
       paragraph individually is the tell of a page that animates because it can. */
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.grow__intro, .grow__rows, .grow__stage,' +
      '.pl-h, .pl-rows, .pl-nums,' +
      '.v2nat-crest, .v2nat-h, .v2nat-figs, .v2nat-tail,' +
      '.mem-h,' +
      '.join-h, .join-sub, .join-steps, .join-close, .join-more,' +
      '.act-title, .act-sub, .act-cd, .act-go'
    ));
    if (!targets.length) return;

    targets.forEach(function (el, i) {
      el.classList.add('pct-rv');
      /* a short stagger inside a group, capped so nothing ever waits long */
      el.style.transitionDelay = ((i % 4) * 70) + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('pct-rv-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });

    /* Anything already in view at load arrives immediately rather than waiting
       for a scroll that may never come. */
    requestAnimationFrame(function () {
      targets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('pct-rv-in');
          io.unobserve(el);
        }
      });
    });

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(function () {
        io.disconnect();
        targets.forEach(function (el) {
          el.classList.add('pct-rv-in');
          el.style.transitionDelay = '';
        });
      });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitReveal:', err);
  }
};

/* The header is transparent while the reader is still on the hero, so header and
   hero read as one dark field. Once the page has scrolled past a threshold the
   ground fades in and the bar becomes a real sticky header.

   A sentinel element rather than a scroll listener: one IntersectionObserver
   callback per crossing instead of a handler on every scroll frame, and no layout
   read at any point. */
window.pctInitStick = function () {
  try {
    var hd = document.querySelector('.v2hd');
    if (!hd) return;

    /* PUBLISH THE HEADER'S REAL HEIGHT.
       The hero pulls itself up under the transparent header by --v2hd-h, and that
       token used to be two hardcoded guesses. Measured, the header is 77px on
       desktop but 131px between 560 and 767 where the nav wraps to a second row,
       and 72px below 560 where the links drop entirely. So the guess was wrong at
       every mobile width and left a 66px band of the body's cream above the hero.
       Measuring it is the only thing that is right at every width. */
    var root = document.documentElement;
    function publishHeight() {
      var h = hd.getBoundingClientRect().height;
      if (h > 0) root.style.setProperty('--v2hd-h', h.toFixed(1) + 'px');
    }
    publishHeight();
    if ('ResizeObserver' in window) new ResizeObserver(publishHeight).observe(hd);
    else window.addEventListener('resize', publishHeight, { passive: true });
    /* the brand lockup uses a webfont, so the bar can grow after it swaps in */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(publishHeight);

    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    /* 120px down the page: far enough that the bar does not flicker solid on the
       tiniest scroll, close enough that it is opaque before it overlaps any
       cream section. */
    sentinel.style.cssText = 'position:absolute;top:120px;left:0;width:1px;height:1px;pointer-events:none';
    document.body.appendChild(sentinel);

    if (!('IntersectionObserver' in window)) { hd.classList.add('is-stuck'); return; }

    new IntersectionObserver(function (entries) {
      hd.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  } catch (err) {
    /* a header that never goes solid is survivable; one that throws is not */
    if (window.console && console.warn) console.warn('pctInitStick:', err);
  }
};
