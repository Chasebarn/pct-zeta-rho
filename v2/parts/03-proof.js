/* ==========================================================================
   03 · PROOF — window.pctInitProof

   ONE signature move: the three numerals travel horizontally while the band
   is pinned, and release straight onto the placement belts, which have been
   running the whole time. Everything else in this section is CSS.

   This file only ever ADDS motion. The markup already ships in its finished
   state, so:
     · no script          -> a composed vertical sequence, belts running on CSS
     · reduced motion     -> the same sequence, belts wrapped into a static wall
     · narrow / short      -> no pin, no horizontal scroll, per-panel reveal
   ========================================================================== */

window.pctInitProof = function () {
  "use strict";

  try {
    var root = document.querySelector(".pf");
    if (!root || root.getAttribute("data-pf-init") === "1") return;

    var scene    = root.querySelector(".pf-scene");
    var pin      = root.querySelector(".pf-pin");
    var track    = root.querySelector(".pf-track");
    var railFill = root.querySelector(".pf-rail > span");
    var panels   = Array.prototype.slice.call(root.querySelectorAll(".pf-panel"));
    var belts    = root.querySelector(".pf-belts");
    var pause    = root.querySelector(".pf-pause");
    if (!scene || !pin || !track || !panels.length) return;

    root.setAttribute("data-pf-init", "1");

    var comps = panels.map(function (p) { return p.querySelector(".pf-comp"); });
    var last  = panels.length - 1;

    /* The pin needs real width AND real height. A landscape phone has neither,
       so it gets the same vertical choreography a portrait phone does. */
    var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    var pinMQ     = window.matchMedia("(min-width: 768px) and (min-height: 620px)");

    var mode = null;                       /* "pinned" | "flow" | "still" */
    var raf = null, resizeRaf = null, io = null;
    var target = 0, cur = 0, active = false;

    /* cached on load and on resize — never read inside the frame loop */
    var sceneTop = 0, travel = 0, vh = 0, depth = 0;

    /* ---------------------------------------------------------------- shared */

    function lightTo(i) {
      for (var k = 0; k <= i && k < panels.length; k++) {
        if (!panels[k].classList.contains("is-lit")) panels[k].classList.add("is-lit");
      }
    }

    function clearInline() {
      scene.style.height = "";
      track.style.transform = "";
      if (railFill) railFill.style.transform = "";
      for (var i = 0; i < comps.length; i++) {
        if (!comps[i]) continue;
        comps[i].style.transform = "";
        comps[i].style.opacity = "";
      }
    }

    /* ---------------------------------------------------- pinned (desktop) */

    function measure() {
      vh = window.innerHeight;
      /* pin.clientWidth, not innerWidth: it already excludes the scrollbar */
      travel = Math.max(0, track.scrollWidth - pin.clientWidth);
      /* The scroll distance IS the horizontal travel, so the pin releases on
         the exact frame the last numeral finishes centring. No dead tail
         between the numbers and the belts. */
      scene.style.height = (vh + travel) + "px";
      sceneTop = scene.getBoundingClientRect().top + (window.pageYOffset || 0);
      /* how far a panel's contents lag its own frame — the ribbon reads as
         depth rather than as a stack of slides */
      depth = Math.round(pin.clientWidth * 0.085);
    }

    function frame() {
      raf = null;

      cur += (target - cur) * 0.16;
      if (Math.abs(target - cur) < 0.0004) cur = target;

      track.style.transform = "translate3d(" + (-cur * travel).toFixed(1) + "px,0,0)";
      if (railFill) railFill.style.transform = "scaleX(" + cur.toFixed(4) + ")";

      for (var i = 0; i < comps.length; i++) {
        var c = comps[i];
        if (!c) continue;
        var d = last > 0 ? cur * last - i : 0;   /* 0 when this panel is centred */
        if (d > 1.4) d = 1.4; else if (d < -1.4) d = -1.4;
        c.style.transform = "translate3d(" + (d * depth).toFixed(1) + "px,0,0)";
        c.style.opacity = (1 - Math.min(0.6, Math.abs(d) * 0.55)).toFixed(3);
      }

      if (active || Math.abs(target - cur) > 0.0004) raf = requestAnimationFrame(frame);
    }

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var p = travel > 0 ? (y - sceneTop) / travel : 0;
      target = p < 0 ? 0 : (p > 1 ? 1 : p);

      /* light every panel up to the nearest one, so a fast flick never skips a
         composition. Lighting is one-way: once composed, it stays composed. */
      lightTo(Math.round(target * last));

      var near = (y + vh * 1.4) > sceneTop && y < (sceneTop + travel + vh * 1.4);
      if (near) {
        if (!active) { active = true; if (raf === null) raf = requestAnimationFrame(frame); }
      } else {
        active = false;
      }
    }

    function onResize() {
      if (resizeRaf !== null) return;
      resizeRaf = requestAnimationFrame(function () {
        resizeRaf = null;
        try {
          if (mode !== "pinned") return;
          measure();
          onScroll();
        } catch (e) { /* never take the page down over a resize */ }
      });
    }

    function startPinned() {
      root.classList.add("is-pinned");
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      onScroll();
      cur = target;                       /* land where the reader already is */
      if (raf === null) raf = requestAnimationFrame(frame);
    }

    function stopPinned() {
      active = false;
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      if (resizeRaf !== null) { cancelAnimationFrame(resizeRaf); resizeRaf = null; }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.classList.remove("is-pinned");
      clearInline();                      /* a stale translate would shove the
                                             un-pinned column off-screen */
      cur = target = 0;
    }

    /* ------------------------------------------------------ flow (phones) */

    function startFlow() {
      if (!("IntersectionObserver" in window)) { lightTo(last); return; }
      io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          entries[i].target.classList.add("is-lit");
          io.unobserve(entries[i].target);   /* compose once, then leave it alone */
        }
      }, { threshold: 0.3, rootMargin: "0px 0px -10% 0px" });
      for (var i = 0; i < panels.length; i++) io.observe(panels[i]);
    }

    function stopFlow() {
      if (io) { io.disconnect(); io = null; }
    }

    /* ------------------------------------------------------------ wiring */

    function apply() {
      var want = reducedMQ.matches ? "still" : (pinMQ.matches ? "pinned" : "flow");
      if (want === mode) return;

      if (mode === "pinned") stopPinned();
      else if (mode === "flow") stopFlow();
      mode = want;

      if (want === "still") {
        root.classList.remove("is-live");   /* base CSS is already the finish */
        lightTo(last);
        return;
      }
      root.classList.add("is-live");
      if (want === "pinned") startPinned();
      else startFlow();
    }

    /* The shared hook, so reduced-motion can stop this mid-session. */
    function hardStop() {
      try {
        if (mode === "pinned") stopPinned();
        else if (mode === "flow") stopFlow();
        mode = "still";
        root.classList.remove("is-live");
        root.classList.remove("is-pinned");
        clearInline();
        lightTo(last);
        if (belts) belts.classList.remove("is-paused");
        if (pause) pause.textContent = "Pause the belts";
      } catch (e) { /* a teardown must never be the thing that throws */ }
    }
    if (window.pctMotion && typeof window.pctMotion.onReduce === "function") {
      window.pctMotion.onReduce(hardStop);
    }

    function onMQ() { try { apply(); } catch (e) {} }
    if (reducedMQ.addEventListener) {
      reducedMQ.addEventListener("change", onMQ);
      pinMQ.addEventListener("change", onMQ);
    } else if (reducedMQ.addListener) {          /* Safari < 14 */
      reducedMQ.addListener(onMQ);
      pinMQ.addListener(onMQ);
    }

    /* Band B: the belts pause on hover and on focus-within in CSS. This is the
       explicit control (WCAG 2.2.2) — it only exists once script can run it. */
    if (pause && belts) {
      pause.addEventListener("click", function () {
        var paused = belts.classList.toggle("is-paused");
        pause.textContent = paused ? "Play the belts" : "Pause the belts";
      });
    }

    apply();
  } catch (e) {
    /* One section must never be able to kill the page. Whatever happened, the
       markup is still the finished state — the reader loses motion, not copy. */
  }
};
