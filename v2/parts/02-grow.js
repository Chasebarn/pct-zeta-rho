/* ============================================================
   02 — Graduate confident.  ONE interaction: the image accordion.
   The <figure>s authored inside the rows are MOVED (not cloned) into
   the persistent stage, so nothing downloads twice and the no-JS
   markup stays the source of truth.
   ============================================================ */
window.pctInitGrow = function () {
  'use strict';
  try {
    var root = document.querySelector('[data-grow]');
    if (!root || root.getAttribute('data-grow-ready') === '1') return;

    var rowsEl = root.querySelector('[data-grow-rows]');
    var stage  = root.querySelector('[data-grow-stage]');
    var fill   = root.querySelector('[data-grow-fill]');
    var btns   = Array.prototype.slice.call(root.querySelectorAll('[data-grow-btn]'));
    if (!rowsEl || !stage || !btns.length || !document.body.closest) return;

    var figs = [], rows = [], i, fig, row;
    for (i = 0; i < btns.length; i++) {
      fig = document.getElementById(btns[i].getAttribute('aria-controls') || '');
      row = btns[i].closest('.grow__row');
      if (!fig || !row) return;            /* markup not as expected: keep the plain list */
      figs.push(fig);
      rows.push(row);
    }

    for (i = 0; i < figs.length; i++) stage.appendChild(figs[i]);
    root.classList.add('grow--js');
    root.setAttribute('data-grow-ready', '1');

    var current = -1, tops = [], hts = [], railH = 1, leaveTimer = 0;

    /* measured on load / resize / font swap only — never inside a frame loop */
    function measure() {
      railH = rowsEl.clientHeight || 1;
      for (var k = 0; k < rows.length; k++) {
        tops[k] = rows[k].offsetTop;
        hts[k]  = rows[k].offsetHeight;
      }
    }

    function paintRail() {
      if (!fill || current < 0 || !hts.length) return;
      fill.style.transform =
        'translateY(' + tops[current] + 'px) scaleY(' + (hts[current] / railH) + ')';
    }

    function select(index) {
      if (index === current || index < 0 || index >= figs.length) return;
      current = index;

      for (var k = 0; k < btns.length; k++) {
        var on = (k === index), f = figs[k];
        btns[k].setAttribute('aria-expanded', on ? 'true' : 'false');
        rows[k].classList.toggle('is-open', on);

        if (on) {
          f.classList.remove('is-leaving');
          f.classList.add('is-prewipe');
          void f.offsetWidth;              /* restart the curtain; a click handler, never rAF */
          f.classList.remove('is-prewipe');
          f.classList.add('is-active');
          f.removeAttribute('aria-hidden');
        } else {
          if (f.classList.contains('is-active')) {
            f.classList.remove('is-active');
            f.classList.add('is-leaving');
          }
          f.setAttribute('aria-hidden', 'true');
        }
      }

      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(function () {
        for (var k = 0; k < figs.length; k++) figs[k].classList.remove('is-leaving');
      }, 760);

      paintRail();
    }

    for (i = 0; i < btns.length; i++) {
      (function (n) {
        btns[n].addEventListener('click', function () { select(n); });
      }(i));
    }

    rowsEl.addEventListener('keydown', function (e) {
      var at = btns.indexOf(document.activeElement), next = -1;
      if (at < 0 || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (at + 1) % btns.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (at - 1 + btns.length) % btns.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = btns.length - 1;
      if (next < 0) return;
      e.preventDefault();
      btns[next].focus();
    });

    function remeasure() { measure(); paintRail(); }

    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(remeasure).observe(rowsEl);
    } else {
      window.addEventListener('resize', remeasure);
    }
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(remeasure).catch(function () {});
    }

    /* reduced motion: settle everything on its finished state, mid-session too */
    function still(on) { root.classList.toggle('grow--still', on !== false); }
    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (mq && mq.matches) still(true);
    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(function (v) { still(v); });
    } else if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (e) { still(e.matches); });
    }

    measure();
    select(0);
  } catch (err) {
    /* one section must never take the page down */
    if (window.console && console.warn) console.warn('pctInitGrow:', err);
  }
};
