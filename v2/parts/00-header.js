/* The opaque header is the safe base. JavaScript makes it transparent only
   while the reader is over the top of the hero. Page content stays visible. */
window.pctInitStick = function () {
  try {
    var hd = document.querySelector('.v2hd');
    if (!hd || hd.dataset.headerReady === '1') return;
    hd.dataset.headerReady = '1';

    function publishHeight() {
      var height = hd.getBoundingClientRect().height;
      if (height > 0) document.documentElement.style.setProperty('--v2hd-h', height.toFixed(1) + 'px');
    }
    publishHeight();
    if ('ResizeObserver' in window) new ResizeObserver(publishHeight).observe(hd);
    else window.addEventListener('resize', publishHeight, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(publishHeight);

    if ('IntersectionObserver' in window) {
      var sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:120px;left:0;width:1px;height:1px;pointer-events:none';
      document.body.appendChild(sentinel);
      hd.classList.toggle('is-over-hero', window.scrollY < 120);
      new IntersectionObserver(function (entries) {
        hd.classList.toggle('is-over-hero', entries[0].isIntersecting);
      }).observe(sentinel);
    }

    var menu = hd.querySelector('details');
    if (menu) {
      hd.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menu.open) {
          menu.open = false;
          menu.querySelector('summary').focus();
        }
      });
      document.addEventListener('click', function (event) {
        if (!menu.contains(event.target) || event.target.closest('a')) menu.open = false;
      });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitStick:', err);
  }
};

/* A single typographic entrance belongs to the hero. The rest of the page is
   readable immediately; the logo rows, photo selection and wheel own motion. */
window.pctInitPageMotion = function () {
  try {
    if (document.documentElement.dataset.pageMotionReady) return;
    document.documentElement.dataset.pageMotionReady = '1';
    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var stage = document.querySelector('.v2hero-stage');
    if (!stage || (mq && mq.matches) || !Element.prototype.animate || !window.IntersectionObserver) return;
    var animations = [];
    var stopped = false;
    var observer;
    function finish() {
      stopped = true;
      if (observer) observer.disconnect();
      animations.forEach(function (animation) { animation.cancel(); });
    }
    function reveal() {
      if (stopped) return;
      Array.prototype.forEach.call(stage.querySelectorAll('[data-motion-words]'), function (element, line) {
        var text = element.textContent.trim();
        var fragment = document.createDocumentFragment();
        text.split(/(\s+)/).forEach(function (word, index) {
          if (/^\s+$/.test(word)) { fragment.appendChild(document.createTextNode(word)); return; }
          var mask = document.createElement('span');
          var inner = document.createElement('span');
          mask.className = 'motion-word'; inner.className = 'motion-word-inner';
          inner.textContent = word; mask.appendChild(inner); fragment.appendChild(mask);
          animations.push(inner.animate([
            { transform:'translate3d(0,100%,0)' },
            { transform:'translate3d(0,0,0)' }
          ], { duration:720, delay:line * 100 + index * 28, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards' }));
        });
        element.textContent = ''; element.appendChild(fragment);
      });
    }
    observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      observer.disconnect(); reveal();
    });
    observer.observe(stage);
    stage.addEventListener('focusin', finish, { once:true });
    if (window.pctMotion && window.pctMotion.onReduce) window.pctMotion.onReduce(finish);
    else if (mq && mq.addEventListener) mq.addEventListener('change', function (event) { if (event.matches) finish(); });
  } catch (error) {
    if (window.console && console.warn) console.warn('pctInitPageMotion:', error);
  }
};
