/* One resilient disclosure for the sticky header. */
window.pctInitStick = function () {
  var header = document.querySelector('.v2hd');
  if (!header || header.dataset.ready) return;
  header.dataset.ready = '1';
  function measure() {
    document.documentElement.style.setProperty('--v2hd-h', header.offsetHeight + 'px');
  }
  measure();
  if (window.ResizeObserver) new ResizeObserver(measure).observe(header);
  else window.addEventListener('resize', measure);
  var menu = header.querySelector('details');
  if (!menu) return;
  var toggle = menu.querySelector('summary');
  header.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      toggle.focus();
    }
  });
  document.addEventListener('click', function (event) {
    if (menu.open && (!menu.contains(event.target) || event.target.closest('.v2hd-mobile a'))) {
      menu.open = false;
    }
  });
};
