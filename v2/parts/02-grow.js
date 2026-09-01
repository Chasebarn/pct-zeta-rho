/* 02 — Graduate confident.
   Moves each <figure> (the same node, so nothing downloads twice) into a
   persistent stage, then runs a plain single-open accordion. Selecting a row
   cross-fades its photograph. That is the whole interaction.

   Everything the section shows without JS it also shows with JS. If this file
   never runs, the base CSS leaves all three rows open with their photographs
   in the flow. */
window.pctInitGrow = function () {
  try {
    var root = document.querySelector('[data-grow]');
    if (!root || root.dataset.growReady === '1') return;

    var stage = root.querySelector('[data-grow-stage]');
    var btns = Array.prototype.slice.call(root.querySelectorAll('[data-grow-btn]'));
    if (!stage || btns.length < 2) return;

    var rows = [], figs = [];
    var ok = btns.every(function (b) {
      var row = b.closest('.grow__row');
      var fig = document.getElementById(b.getAttribute('aria-controls'));
      if (!row || !fig) return false;
      rows.push(row); figs.push(fig);
      return true;
    });
    if (!ok) return;   /* markup drifted: leave the no-JS state alone */

    root.dataset.growReady = '1';
    root.classList.add('grow--js');
    figs.forEach(function (f) { stage.appendChild(f); });

    var current = -1;

    function open(i) {
      if (i === current) return;
      current = i;
      for (var k = 0; k < rows.length; k++) {
        var on = k === i;
        rows[k].classList.toggle('is-open', on);
        figs[k].classList.toggle('is-active', on);
        btns[k].setAttribute('aria-expanded', on ? 'true' : 'false');
      }
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { open(i); });
      /* hovering the row is a preview, not a commitment: it swaps the photograph
         the same way a click does, because there is no other state to lose */
      b.addEventListener('focus', function () { open(i); });
    });

    open(0);

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(function () { root.classList.add('grow--still'); });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitGrow:', err);
  }
};
