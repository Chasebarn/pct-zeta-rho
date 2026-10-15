/* 02 - the accordion. Moves each <figure> (the same node, so nothing downloads
   twice) into a persistent stage, then runs a single-open accordion: opening one
   row closes the other two. That is the whole interaction.

   Without this file the base CSS leaves all three rows open with their
   photographs in the flow, so nothing is ever hidden by a script that failed. */
window.pctInitGrow = function () {
  try {
    var root = document.querySelector('[data-grow]');
    if (!root || root.dataset.growReady === '1') return;

    var stage = root.querySelector('[data-grow-stage]');
    var btns = Array.prototype.slice.call(root.querySelectorAll('[data-grow-btn]'));
    if (!stage || btns.length < 2) return;

    var rows = [], figs = [], panels = [];
    var ok = btns.every(function (b) {
      var row = b.closest('.grow__row');
      var panel = document.getElementById(b.getAttribute('aria-controls'));
      var fig = document.getElementById(b.getAttribute('data-grow-figure'));
      if (!row || !panel || !fig) return false;
      rows.push(row); figs.push(fig); panels.push(panel);
      return true;
    });
    if (!ok) return;                 /* markup drifted: leave the no-JS state alone */

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
        figs[k].setAttribute('aria-hidden', on ? 'false' : 'true');
        panels[k].hidden = !on;
        btns[k].setAttribute('aria-expanded', on ? 'true' : 'false');
      }
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { open(i); });
      b.addEventListener('focus', function () { open(i); });
      b.addEventListener('keydown', function (e) {
        var next;
        if (e.key === 'ArrowDown') next = (i + 1) % btns.length;
        else if (e.key === 'ArrowUp') next = (i + btns.length - 1) % btns.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = btns.length - 1;
        else return;
        e.preventDefault();
        btns[next].focus();
      });
    });

    open(0);
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitGrow:', err);
  }
};
