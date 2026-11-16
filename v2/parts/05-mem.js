/* The photo arc moves only when requested by a button, key, or horizontal swipe. */
window.pctInitMem = function () {
  var section = document.querySelector('#life');
  if (!section || section.dataset.ready) return;
  var band = section.querySelector('[data-mem-band]');
  var wheel = section.querySelector('.mem-wheel');
  var controls = section.querySelector('.mem-controls');
  var status = section.querySelector('.mem-status');
  if (!band || !wheel || !controls || !status || wheel.children.length !== 6) return;
  section.dataset.ready = '1';
  var originals = Array.prototype.slice.call(wheel.children);
  var copies = document.createDocumentFragment();
  for (var slot = 0; slot < 30; slot++) {
    var card = slot < originals.length ? originals[slot] : originals[slot % originals.length].cloneNode(true);
    card.style.setProperty('--slot', slot);
    if (slot >= originals.length) {
      card.setAttribute('aria-hidden', 'true');
      card.querySelector('img').alt = '';
      copies.appendChild(card);
    }
  }
  wheel.appendChild(copies);
  section.classList.add('is-wheel');
  controls.hidden = false;
  var turn = 0;
  function move(amount) {
    turn += amount;
    wheel.style.setProperty('--turn', -turn * 12 + 'deg');
    var current = ((turn % originals.length) + originals.length) % originals.length;
    status.textContent = 'Photo ' + (current + 1) + ' of ' + originals.length + '. ' +
      originals[current].querySelector('img').alt;
  }
  controls.querySelector('.mem-prev').addEventListener('click', function () { move(-1); });
  controls.querySelector('.mem-next').addEventListener('click', function () { move(1); });
  controls.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  var touch = null;
  band.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'touch' || !event.isPrimary || event.target.closest('button')) return;
    touch = { id:event.pointerId, x:event.clientX, y:event.clientY };
  }, { passive:true });
  band.addEventListener('pointercancel', function () { touch = null; });
  band.addEventListener('pointerup', function (event) {
    if (!touch || touch.id !== event.pointerId) return;
    var dx = event.clientX - touch.x;
    var dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) >= 38 && Math.abs(dx) > Math.abs(dy) * 1.35) move(dx < 0 ? 1 : -1);
  }, { passive:true });
};
