/* 03 — Numbers don’t lie.
   ONE interaction: each figure counts up once, the first time it is seen.
   Nothing pins, nothing hijacks scroll, nothing runs after the count lands.

   STATS mirrors the values written in 03-numbers.html. They are duplicated so
   the markup can be the finished state (readable with JS off); the check below
   warns in the console if the two ever drift apart. */
window.pctInitNumbers = function () {
  try {
    var STATS = [
      { to: 95,   decimals: 0 },
      { to: 3.6,  decimals: 2 },
      { to: 15,   decimals: 0 }
    ];

    var root = document.querySelector('[data-num]');
    if (!root || root.dataset.numReady === '1') return;

    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-num-p]'));
    if (!panels.length) return;
    root.dataset.numReady = '1';

    var reduced = (window.pctMotion && window.pctMotion.reduced) ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function fmt(v, d) {
      return d ? v.toFixed(d) : String(Math.round(v));
    }

    var targets = panels.map(function (p, i) {
      var el = p.querySelector('[data-num-n]');
      var spec = STATS[i];
      if (!el || !spec) return null;
      /* drift check against the value actually printed in the markup */
      var printed = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
      if (!isNaN(printed) && Math.abs(printed - spec.to) > 0.001 &&
          window.console && console.warn) {
        console.warn('pctInitNumbers: STATS[' + i + '] is ' + spec.to +
                     ' but the markup says ' + printed + '. Fix both.');
      }
      return { el: el, to: spec.to, decimals: spec.decimals, done: false };
    }).filter(Boolean);

    if (reduced || !('IntersectionObserver' in window)) return;   /* markup already reads right */

    var DUR = 1100;

    function run(t) {
      if (t.done) return;
      t.done = true;
      var start = 0;
      function step(ts) {
        if (!start) start = ts;
        var k = Math.min((ts - start) / DUR, 1);
        /* ease-out cubic: fast off the mark, arrives without a bounce */
        var e = 1 - Math.pow(1 - k, 3);
        t.el.textContent = fmt(t.to * e, t.decimals);
        if (k < 1) requestAnimationFrame(step);
        else t.el.textContent = fmt(t.to, t.decimals);   /* exact, never 94.9997 */
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = panels.indexOf(en.target);
        if (i > -1 && targets[i]) run(targets[i]);
        io.unobserve(en.target);
      });
    }, { threshold: 0.45 });

    panels.forEach(function (p) { io.observe(p); });

    if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
      window.pctMotion.onReduce(function () {
        io.disconnect();
        targets.forEach(function (t) { t.done = true; t.el.textContent = fmt(t.to, t.decimals); });
      });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitNumbers:', err);
  }
};
