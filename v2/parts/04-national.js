/* Geography supports the national account. The native selector and local pin
   highlights use the same complete, statically generated campus data. */
window.pctInitNational = function () {
  'use strict';
  try {
    var root = document.querySelector('[data-national]');
    if (!root || root.dataset.mapReady) return;
    var pins = Array.prototype.slice.call(root.querySelectorAll('[data-chapter-pin]'));
    var select = root.querySelector('[data-map-select]');
    var controls = root.querySelector('[data-map-controls]');
    var location = root.querySelector('[data-map-location]');
    if (!pins.length || !select || !controls || !location) return;
    var byId = new Map();
    var currentId = null;
    pins.forEach(function (pin) { byId.set(pin.dataset.chapterPin, pin); });

    function choose(id) {
      var pin = byId.get(id);
      if (!pin) return;
      var dot = pin.querySelector('.v2nat-pin-dot');
      if (dot && dot.getAnimations) dot.getAnimations().forEach(function (animation) { animation.cancel(); });
      pins.forEach(function (item) { item.classList.toggle('is-selected', item === pin); });
      select.value = id;
      select.title = pin.dataset.school;
      if (currentId !== id) {
        location.textContent = pin.dataset.chapter + ' · ' + pin.dataset.city + ', ' + pin.dataset.state;
        currentId = id;
      }
    }
    select.addEventListener('change', function () { choose(select.value); });
    pins.forEach(function (pin) {
      pin.addEventListener('pointerenter', function (event) {
        if (event.pointerType === 'mouse') choose(pin.dataset.chapterPin);
      });
      pin.addEventListener('click', function () { choose(pin.dataset.chapterPin); });
    });
    choose(select.value);
    controls.hidden = false;
    root.dataset.mapReady = '1';
  } catch (error) {
    if (window.console && console.warn) console.warn('pctInitNational:', error);
  }
};
