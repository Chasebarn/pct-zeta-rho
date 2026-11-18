/* Keep the accordion and its photograph connected at every width. Desktop
   shares a photo stage; mobile returns each figure to its own content panel. */
window.pctInitGrow = function () {
  try {
    var root = document.querySelector('[data-grow]');
    if (!root || root.dataset.growReady === '1') return;
    var stage = root.querySelector('[data-grow-stage]');
    var btns = Array.prototype.slice.call(root.querySelectorAll('[data-grow-btn]'));
    if (!stage || btns.length < 2) return;

    var rows = [], figs = [], panels = [];
    var valid = btns.every(function (button) {
      var row = button.closest('.grow__row');
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      var figure = document.getElementById(button.getAttribute('data-grow-figure'));
      if (!row || !panel || !figure) return false;
      rows.push(row); panels.push(panel); figs.push(figure);
      return true;
    });
    if (!valid) return;

    var breakpoint = window.matchMedia ? window.matchMedia('(min-width:900px)') : null;
    var current = 0;
    var wide = false;
    var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var exitTimer = null;
    function clearLeaving() {
      if (exitTimer !== null) { clearTimeout(exitTimer); exitTimer = null; }
      figs.forEach(function (figure) { figure.classList.remove('is-leaving'); });
    }
    function sync() {
      for (var i = 0; i < rows.length; i++) {
        var active = i === current;
        rows[i].classList.toggle('is-open', active);
        panels[i].hidden = !active;
        if (active) btns[i].setAttribute('aria-disabled', 'true');
        else btns[i].removeAttribute('aria-disabled');
        btns[i].setAttribute('aria-expanded', active ? 'true' : 'false');
        figs[i].classList.toggle('is-active', active);
        figs[i].setAttribute('aria-hidden', wide && !active ? 'true' : 'false');
      }
    }
    function open(index) {
      if (index === current) return;
      // A preceding mobile panel can be a full photograph tall. Keep the row
      // under the pointer when closing it would otherwise move the tapped title.
      var topBefore = !wide && index > current
        ? btns[index].getBoundingClientRect().top : null;
      clearLeaving();
      if (wide && !(reduce && reduce.matches)) {
        figs[current].classList.add('is-leaving');
        exitTimer = setTimeout(clearLeaving, 260);
      }
      current = index;
      sync();
      if (topBefore !== null) {
        var shift = btns[index].getBoundingClientRect().top - topBefore;
        if (Math.abs(shift) > 1) window.scrollBy({top:shift, behavior:'instant'});
      }
      if (!wide && !(reduce && reduce.matches) && panels[index].animate) {
        panels[index].animate([
          { opacity:0, transform:'translateY(6px)' },
          { opacity:1, transform:'translateY(0)' }
        ], { duration:220, easing:'ease-out' });
      }
    }
    function layout() {
      clearLeaving();
      wide = breakpoint ? breakpoint.matches : window.innerWidth >= 900;
      root.classList.toggle('grow--desktop', wide);
      figs.forEach(function (figure, i) {
        var destination = wide ? stage : panels[i];
        if (figure.parentNode !== destination) {
          if (wide) destination.appendChild(figure);
          else destination.insertBefore(figure, destination.firstChild);
        }
      });
      sync();
    }

    root.classList.add('grow--js');
    layout();
    btns.forEach(function (button, i) {
      button.disabled = false;
      button.addEventListener('click', function () { open(i); });
      button.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowDown') next = (i + 1) % btns.length;
        else if (event.key === 'ArrowUp') next = (i + btns.length - 1) % btns.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = btns.length - 1;
        else return;
        event.preventDefault();
        btns[next].focus();
      });
    });
    if (breakpoint && breakpoint.addEventListener) breakpoint.addEventListener('change', layout);
    else if (breakpoint && breakpoint.addListener) breakpoint.addListener(layout);
    else window.addEventListener('resize', layout, { passive:true });
    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') window.pctMotion.onReduce(clearLeaving);
    if (reduce && reduce.addEventListener) reduce.addEventListener('change', function (event) { if (event.matches) clearLeaving(); });
    root.dataset.growReady = '1';
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitGrow:', err);
  }
};
