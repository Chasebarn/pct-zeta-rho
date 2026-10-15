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
        if (!menu.contains(event.target)) menu.open = false;
      });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitStick:', err);
  }
};
