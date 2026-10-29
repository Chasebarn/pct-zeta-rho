/* Figures and company marks stay still. Native details makes additional marks
   optional on phones; without JavaScript it starts fully open. */
window.pctInitPlacements = function () {
  'use strict';
  var root = document.querySelector('[data-place]');
  if (!root || root.dataset.placementsReady) return;
  var more = root.querySelector('[data-pl-more]');
  var primary = root.querySelector('[data-pl-primary]');
  var extra = root.querySelector('[data-pl-extra]');
  if (!more || !primary || !extra || !window.matchMedia) return;
  root.dataset.placementsReady = '1';
  var phone = window.matchMedia('(max-width: 600px)');
  var expandedOnPhone = false;
  /* Move the same two nodes, rather than duplicating logos or hiding them.
     Desktop shows two rows of ten; phones show two rows of four plus details. */
  var overflow = Array.prototype.slice.call(primary.children, 8);
  function sync() {
    if (phone.matches) {
      for (var i = overflow.length - 1; i >= 0; i--) {
        if (overflow[i].parentNode !== extra) extra.insertBefore(overflow[i], extra.firstChild);
      }
    } else {
      overflow.forEach(function (item) {
        if (item.parentNode !== primary) primary.appendChild(item);
      });
    }
    more.open = !phone.matches || expandedOnPhone;
  }
  more.addEventListener('toggle', function () {
    if (phone.matches) expandedOnPhone = more.open;
  });
  if (phone.addEventListener) phone.addEventListener('change', sync);
  else if (phone.addListener) phone.addListener(sync);
  sync();
};
