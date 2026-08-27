/* ==========================================================================
   05-act.js
   1. window.pctMotion  — the shared motion hook every section registers with.
                          Defined at load time, outside any init, so it exists
                          before the lead calls the first section init.
                          (Load this file before the other section scripts.)
   2. window.pctInitAct — wires the global chapter progress rail. The CTA
                          itself is pure CSS and needs no JS at all.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. SHARED MOTION HOOK
       window.pctMotion.reduced          live boolean
       window.pctMotion.onReduce(fn)     fn runs when the user turns reduce ON
   Turning reduce OFF again does not restart anything; a reload does.
   If reduce is already ON when a section registers, its teardown runs at once,
   so teardowns must be safe to call even if the section never started.
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  /* If this file is loaded twice, keep the live object and its registrations. */
  if (window.pctMotion && window.pctMotion.__pct) return;

  var QUERY = '(prefers-reduced-motion: reduce)';
  var mql = typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null;
  var teardowns = [];

  function run(fn) {
    /* One bad teardown must never strand the ones behind it. */
    try { fn(); } catch (err) {}
  }

  function fireAll() {
    var list = teardowns;
    teardowns = [];
    for (var i = 0; i < list.length; i++) run(list[i]);
  }

  var motion = {
    __pct: true,
    reduced: !!(mql && mql.matches),
    onReduce: function (fn) {
      if (typeof fn !== 'function') return;
      if (motion.reduced) { run(fn); return; }
      teardowns.push(fn);
    }
  };

  function onChange(evt) {
    var on = evt && typeof evt.matches === 'boolean' ? evt.matches : !!(mql && mql.matches);
    motion.reduced = on;
    if (on) fireAll();
  }

  if (mql) {
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(onChange);            /* legacy Safari */
    }
  }

  window.pctMotion = motion;
}());


/* --------------------------------------------------------------------------
   2. SECTION INIT — chapter progress rail
   One IntersectionObserver, no scroll handler, no layout reads in a loop.
   The rail is decorative and aria-hidden, so if anything here fails to
   resolve, it simply stays hidden and the page is unchanged.
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  var STAGES = 5;

  /* Keyword -> stage, checked against a section's data-pct-stage, id and class.
     The lead can override any of it with data-pct-stage="intro|grow|proof|
     experience|rush" (or "01".."05"). */
  var HINTS = [
    ['intro', 'hero', 'open', 'arrive'],
    ['grow', 'graduate', 'confident', 'develop', 'pillar'],
    ['proof', 'number', 'stat', 'placement', 'company', 'network', 'result'],
    ['experience', 'life', 'moment', 'brotherhood', 'photo', 'year'],
    ['act', 'rush', 'cta', 'join', 'apply']
  ];

  var started = false;

  function topLevelSections() {
    var all = document.querySelectorAll('section');
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var parent = all[i].parentNode;
      var nested = parent && typeof parent.closest === 'function' && parent.closest('section');
      if (!nested) out.push(all[i]);
    }
    return out;
  }

  function stageFor(el) {
    var declared = el.getAttribute('data-pct-stage');
    if (declared) {
      var n = parseInt(declared, 10);
      if (!isNaN(n) && n >= 1 && n <= STAGES) return n - 1;
    }
    var hay = ((declared || '') + ' ' + (el.id || '') + ' ' +
      (typeof el.className === 'string' ? el.className : '')).toLowerCase();
    for (var s = 0; s < HINTS.length; s++) {
      for (var k = 0; k < HINTS[s].length; k++) {
        if (hay.indexOf(HINTS[s][k]) !== -1) return s;
      }
    }
    return -1;
  }

  /* Returns [{el, stage}] in document order. */
  function resolveStages() {
    var secs = topLevelSections();
    if (!secs.length) return [];

    var pairs = [];
    var matched = 0;
    var last = -1;
    var i;

    for (i = 0; i < secs.length; i++) {
      var stage = stageFor(secs[i]);
      if (stage < 0) {
        stage = last;                    /* unnamed block = still the last stage */
      } else {
        matched++;
        last = stage;
      }
      if (stage >= 0) pairs.push({ el: secs[i], stage: stage });
    }

    /* Heuristic came up empty — fall back to position on the page. */
    if (matched < 2) {
      pairs = [];
      for (i = 0; i < secs.length; i++) {
        pairs.push({
          el: secs[i],
          stage: Math.min(STAGES - 1, Math.floor(i * STAGES / secs.length))
        });
      }
      pairs[pairs.length - 1].stage = STAGES - 1;
    }
    return pairs;
  }

  /* Read once per section, on first activation, never inside a frame loop. */
  function groundIsDark(el) {
    if (el.classList && el.classList.contains('on-dark')) return true;
    if (typeof el.closest === 'function' && el.closest('.on-dark')) return true;
    var bg = '';
    try { bg = window.getComputedStyle(el).backgroundColor || ''; } catch (err) { return false; }
    var m = /rgba?\(([^)]+)\)/.exec(bg);
    if (!m) return false;
    var p = m[1].split(',');
    var alpha = p.length > 3 ? parseFloat(p[3]) : 1;
    if (!(alpha > 0.5)) return false;              /* transparent = page ground */
    var lum = 0.2126 * parseFloat(p[0]) + 0.7152 * parseFloat(p[1]) + 0.0722 * parseFloat(p[2]);
    return lum < 130;
  }

  window.pctInitAct = function () {
    try {
      if (started) return;

      var rail = document.querySelector('[data-pct-rail]');
      if (!rail) return;
      if (typeof window.IntersectionObserver !== 'function') return;

      var pairs = resolveStages();
      if (pairs.length < 2) return;

      var labels = rail.querySelectorAll('[data-stage-label]');
      var ticks = rail.querySelectorAll('[data-stage-tick]');
      if (!labels.length || !ticks.length) return;

      var els = [];
      var stages = [];
      var dark = [];
      var live = [];
      var i;
      for (i = 0; i < pairs.length; i++) {
        els.push(pairs[i].el);
        stages.push(pairs[i].stage);
        dark.push(null);
        live.push(0);
      }

      var current = -1;

      function setActive(idx) {
        var stage = stages[idx];
        if (dark[idx] === null) dark[idx] = groundIsDark(els[idx]);
        rail.classList.toggle('is-dark', dark[idx]);
        if (stage === current) return;
        current = stage;
        for (var j = 0; j < labels.length; j++) {
          labels[j].classList.toggle('is-on', j === stage);
        }
        for (var t = 0; t < ticks.length; t++) {
          ticks[t].classList.toggle('is-on', t === stage);
        }
      }

      function onCross(entries) {
        for (var e = 0; e < entries.length; e++) {
          var idx = els.indexOf(entries[e].target);
          if (idx > -1) live[idx] = entries[e].isIntersecting ? 1 : 0;
        }
        var best = -1;
        for (var j = 0; j < live.length; j++) if (live[j]) best = j;
        if (best < 0) return;              /* between sections: hold the last stage */
        setActive(best);
      }

      /* A thin band across the middle of the viewport: whatever the reader is
         actually looking at is the active stage. No scroll listener. */
      var io = new window.IntersectionObserver(onCross, {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0
      });
      for (i = 0; i < els.length; i++) io.observe(els[i]);

      started = true;
      rail.classList.add('is-live');

      if (window.pctMotion && typeof window.pctMotion.onReduce === 'function') {
        window.pctMotion.onReduce(function () {
          /* The rail is information, not motion: it keeps working, it just
             stops easing between stages. */
          rail.classList.add('is-still');
        });
      }
    } catch (err) {
      /* Never take the page down over decorative chrome. */
    }
  };
}());


/* ---- countdown -----------------------------------------------------------
   State aware. Before rush: ticking digits. During rush (between data-until and
   data-ends): a single line, no digits. After, or with the attributes removed:
   the block hides itself rather than showing a dead clock. ---------------- */
window.pctInitCountdown = function () {
  try {
    var cd = document.querySelector('.act-cd');
    if (!cd) return;
    var startAttr = cd.getAttribute('data-until');
    var endAttr = cd.getAttribute('data-ends');
    if (!startAttr) { cd.hidden = true; return; }
    var start = new Date(startAttr).getTime();
    var end = endAttr ? new Date(endAttr).getTime() : start;
    if (isNaN(start)) { cd.hidden = true; return; }

    var lab = cd.querySelector('.act-cd-lab');
    var out = {};
    ['d','h','m','s'].forEach(function (k) { out[k] = cd.querySelector('[data-cd="' + k + '"]'); });
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var timer = null;

    function tick () {
      var now = Date.now();
      if (now >= start && now <= end) {          /* rush is underway */
        cd.classList.add('is-live');
        if (lab) lab.textContent = 'Rush is underway.';
        return;
      }
      if (now > end) { cd.hidden = true; stop(); return; }   /* season over */
      var diff = start - now;
      if (out.d) out.d.textContent = Math.floor(diff / 86400000);
      if (out.h) out.h.textContent = pad(Math.floor(diff / 3600000) % 24);
      if (out.m) out.m.textContent = pad(Math.floor(diff / 60000) % 60);
      if (out.s) out.s.textContent = pad(Math.floor(diff / 1000) % 60);
    }
    function stop () { if (timer) { clearInterval(timer); timer = null; } }
    tick();
    timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (!timer && !cd.hidden) { tick(); timer = setInterval(tick, 1000); }
    });
  } catch (e) { if (window.console) console.warn('countdown:', e); }
};
