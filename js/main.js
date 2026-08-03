/* Phi Chi Theta — Zeta Rho · interactions */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointerMQ = window.matchMedia("(pointer: fine)");
  var reduced = reducedMQ.matches;
  var finePointer = finePointerMQ.matches;

  /* ---------- Live prefers-reduced-motion ----------
     Every motion block below registers a teardown here. Reading the query once
     at load meant a reader who reaches for the OS setting mid-session — the
     exact moment they need it — got nothing until a reload. Flipping it to
     "reduce" now stops every rAF loop on the spot and leaves each one in its
     FINISHED state, never its start state.
     The reverse is deliberately asymmetric: turning motion back ON does not
     restart the loops, because re-arming observers and rebuilt DOM mid-session
     is far more failure-prone than a reload, and nobody is harmed by ending up
     with less motion than they asked for. A reload restores it. */
  var motionOff = [];
  var stopAllMotion = function () {
    if (!reducedMQ.matches) return; /* this switch only ever tightens — see above */
    reduced = true;
    while (motionOff.length) {
      /* one throwing teardown must not strand the rest */
      try { motionOff.shift()(); } catch (err) {}
    }
  };
  /* legacy Safari (<=13.1) exposes only addListener; an unguarded call would throw and kill the rest of this file */
  if (reducedMQ.addEventListener) reducedMQ.addEventListener("change", stopAllMotion);
  else if (reducedMQ.addListener) reducedMQ.addListener(stopAllMotion);

  /* ---------- Header: light bar once past the hero ---------- */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  if (toggle) {
    var mobileNav = window.matchMedia("(max-width: 860px)");
    var menu = document.querySelector(".nav-links");
    var behindMenu = document.querySelectorAll("#main, .site-footer, .site-header .brand, .skip-link");
    /* the overlay transitions `visibility`, so it is still computed hidden —
       and therefore unfocusable — on the frame the class lands. Retry until
       it takes, and give up if the menu closed again in the meantime. */
    var focusFirstLink = function () {
      var f = menu.querySelector("a");
      if (!f) return;
      var tries = 0;
      var grab = function () {
        if (!document.body.classList.contains("nav-open")) return;
        f.focus();
        if (document.activeElement !== f && ++tries < 30) requestAnimationFrame(grab);
      };
      grab();
    };
    var setNav = function (open, restoreFocus) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var off = open && mobileNav.matches;
      behindMenu.forEach(function (el) { el.inert = off; });
      if (open) { focusFirstLink(); }
      else if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"), true);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false, false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) setNav(false, true);
    });
    /* legacy Safari (<=13.1) exposes only addListener; an unguarded call would throw and kill the rest of this file */
    var onNavMQ = function () { if (!mobileNav.matches) setNav(false, false); };
    if (mobileNav.addEventListener) mobileNav.addEventListener("change", onNavMQ);
    else if (mobileNav.addListener) mobileNav.addListener(onNavMQ);
  }

  /* ---------- Page-entry loader + page transitions ---------- */
  var loader = document.querySelector(".loader");
  /* hero content holds until the curtain lifts, then cascades in */
  var heroHold = [];
  if (loader && !reduced) {
    heroHold = Array.prototype.slice.call(
      document.querySelectorAll(".hero [data-split], .hero .reveal, .subhero [data-split], .subhero .reveal")
    );
  }
  if (loader) {
    var lifted = false;
    var lift = function () {
      if (lifted) return;
      lifted = true;
      loader.classList.add("done");
      heroHold.forEach(function (el, i) {
        setTimeout(function () { el.classList.add("in"); }, 360 + i * 150);
      });
      /* the hero canvas restamps its settle off this, so the arrival plays in
         view rather than behind the curtain */
      document.dispatchEvent(new CustomEvent("pct:curtain-up"));
    };
    if (reduced) lift();
    else if (document.readyState === "complete") setTimeout(lift, 250);
    else {
      window.addEventListener("load", function () { setTimeout(lift, 250); });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { setTimeout(lift, 250); });
      }
      setTimeout(lift, 1600); /* never hold the page hostage */
    }
    /* curtain drops before navigating to another page of the site */
    document.addEventListener("click", function (e) {
      if (reduced) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest("a");
      if (!a) return;
      if (a.hasAttribute("download")) return;
      var href = a.getAttribute("href");
      if (!href || a.target === "_blank" || href.charAt(0) === "#" || /^[a-z][a-z0-9+.-]*:/i.test(href)) return;
      e.preventDefault();
      loader.classList.add("closing");
      setTimeout(function () { window.location.href = href; }, 560);
    });
    /* restored from back-forward cache: make sure the curtain is up */
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        loader.classList.remove("closing");
        loader.classList.add("done");
      }
    });
  }

  /* ---------- Word-split headline reveal ---------- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var label = el.textContent.replace(/\s+/g, " ").trim();
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.textContent = "";
    el.setAttribute("aria-label", label);
    var wordCount = 0;
    function addWord(content) {
      var w = document.createElement("span");
      w.className = "w";
      w.setAttribute("aria-hidden", "true");
      var wi = document.createElement("span");
      wi.className = "wi";
      wi.style.setProperty("--wd", (wordCount++ * 0.055).toFixed(3) + "s");
      if (typeof content === "string") {
        wi.textContent = content;
      } else {
        wi.appendChild(content);
      }
      w.appendChild(wi);
      el.appendChild(w);
      el.appendChild(document.createTextNode(" "));
    }
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/\s+/).forEach(function (word) {
          if (word) addWord(word);
        });
      } else if (node.nodeType === 1) {
        /* split the element's text word-by-word too, cloning the wrapper
           per word so a multi-word <em> can wrap across lines */
        var words = node.textContent.split(/\s+/).filter(Boolean);
        words.forEach(function (word) {
          var clone = node.cloneNode(false);
          clone.textContent = word;
          addWord(clone);
        });
      }
    });
  });

  /* ---------- Scroll reveal (covers [data-split] and .reveal) ---------- */
  var revealEls = document.querySelectorAll(".reveal, [data-split]");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      if (heroHold.indexOf(el) !== -1) return; /* sequenced after the loader instead */
      if (el.classList.contains("reveal")) {
        var siblings = el.parentElement
          ? Array.prototype.filter.call(el.parentElement.children, function (c) {
              return c.classList.contains("reveal");
            })
          : [el];
        var idx = siblings.indexOf(el);
        el.style.setProperty("--d", Math.min(idx * 0.1, 0.5) + "s");
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ----------
     Markup carries the real value as fallback text; the script only
     replaces it while animating, so no-JS still shows correct numbers. */
  var counters = document.querySelectorAll("[data-count]");
  var countStops = []; /* one canceller per count that actually started */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var plain = el.hasAttribute("data-plain");
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1800;
    var start = null;
    var countRaf = null;
    function fmt(n) {
      if (decimals) return n.toFixed(decimals);
      n = Math.round(n);
      return plain ? String(n) : n.toLocaleString("en-US");
    }
    function final() { el.textContent = prefix + fmt(target) + suffix; }
    function frame(ts) {
      countRaf = null;
      if (reduced) { final(); return; } /* belt and braces if a frame outruns the teardown */
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + fmt(target * eased) + suffix;
      if (p < 1) countRaf = requestAnimationFrame(frame);
    }
    if (reduced) {
      final();
    } else {
      countRaf = requestAnimationFrame(frame);
      countStops.push(function () {
        if (countRaf !== null) { cancelAnimationFrame(countRaf); countRaf = null; }
        final(); /* the number it was counting to, not the number it stopped on */
      });
    }
  }
  if ("IntersectionObserver" in window && !reduced) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
    motionOff.push(function () {
      cio.disconnect();
      /* a count caught mid-flight lands on its number instead of freezing
         part-way; counters that never started still carry the real value in
         the markup, so there is nothing to do for those */
      while (countStops.length) countStops.shift()();
    });
  }
  /* no-IO / reduced-motion: markup text already shows the real values */

  /* ---------- Rush countdown ---------- */
  var countdowns = document.querySelectorAll("[data-countdown]");
  if (countdowns.length) {
    var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
    var tickCd = function () {
      countdowns.forEach(function (cd) {
        var target = new Date(cd.getAttribute("data-countdown")).getTime();
        var diff = target - Date.now();
        if (diff <= 0) {
          var lab = cd.querySelector(".cd-label");
          if (lab) lab.textContent = "Fall Rush is underway — see you there.";
          var units = cd.querySelector(".cd-units");
          if (units) units.style.display = "none";
          return;
        }
        var d = Math.floor(diff / 86400000);
        var h = Math.floor(diff / 3600000) % 24;
        var m = Math.floor(diff / 60000) % 60;
        var s = Math.floor(diff / 1000) % 60;
        cd.querySelector('[data-cd="d"]').textContent = d;
        cd.querySelector('[data-cd="h"]').textContent = pad2(h);
        cd.querySelector('[data-cd="m"]').textContent = pad2(m);
        cd.querySelector('[data-cd="s"]').textContent = pad2(s);
      });
    };
    tickCd();
    setInterval(tickCd, 1000);
  }

  /* ---------- Hero canvas: flowing silk threads ----------
     WCAG 2.2.2 (Pause, Stop, Hide): automatic motion that starts on load,
     lasts more than five seconds and runs beside other content must be
     stoppable. Rather than bolt a visible control onto the hero, the threads
     SETTLE: the motion envelope eases to zero over ~4.5s and the rAF loop is
     then cancelled outright — the animation genuinely ends, it does not idle
     in the background. The threads come to rest pulled straight and still,
     which reads as an arrival rather than as something switching off.
     A fine pointer moving over the hero wakes it; when the pointer stops, the
     same easing runs again. Touch never wakes it. */
  var heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas) {
    var hctx = heroCanvas.getContext("2d");
    var hw, hh, ht = 0, hmx = 0.5, hmy = 0.5, heroVisible = true;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var LINES = 24;
    var HERO_SETTLE = 4500; /* ms from first paint — or from the last pointer move — to rest */
    var HERO_WAKE_GAP = 140; /* ms of pointer stillness that counts as "the pointer stopped" */
    var heroRaf = null;
    var heroRunning = false;
    var heroEnv = 1;      /* motion envelope: 1 = full sway, 0 = fully at rest */
    var heroEnvFrom = 1;  /* envelope value the current settle started from */
    var heroSettleAt = 0; /* timestamp the current settle began */
    var heroLastMove = -1e9;

    var sizeCanvas = function () {
      hw = heroCanvas.width = heroCanvas.offsetWidth * dpr;
      hh = heroCanvas.height = heroCanvas.offsetHeight * dpr;
    };
    sizeCanvas();

    /* One frame. Thread count, colours, spacing and wave geometry are exactly
       as before; `env` is the only addition — it scales both motion terms, so
       env 1 is the original animation and env 0 draws the threads at rest. */
    var paintThreads = function (env) {
      hctx.clearRect(0, 0, hw, hh);
      var step = Math.max(8 * dpr, hw / 150);
      for (var i = 0; i < LINES; i++) {
        var p = i / LINES;
        var yBase = hh * (0.18 + p * 0.74);
        var amp = hh * 0.05 * (0.35 + p) * (0.7 + 0.6 * hmy) * env;
        hctx.beginPath();
        for (var x = 0; x <= hw + step; x += step) {
          var wave =
            Math.sin(x * 0.0016 / dpr + ht * 0.7 + i * 0.42) *
            Math.cos(x * 0.0006 / dpr - ht * 0.32 + i * 1.7);
          var y = yBase + wave * amp * (0.6 + 0.8 * hmx) + Math.sin(ht * 0.4 + i * 2.1) * 6 * dpr * env;
          if (x === 0) hctx.moveTo(x, y); else hctx.lineTo(x, y);
        }
        var gold = i % 4 === 0;
        hctx.strokeStyle = gold
          ? "rgba(201,162,39," + (0.06 + 0.11 * p).toFixed(3) + ")"
          : "rgba(150,118,215," + (0.04 + 0.08 * p).toFixed(3) + ")";
        hctx.lineWidth = (gold ? 1.2 : 0.8) * dpr;
        hctx.stroke();
      }
    };

    var stopHero = function (env) {
      heroRunning = false;
      if (heroRaf !== null) { cancelAnimationFrame(heroRaf); heroRaf = null; }
      heroEnv = env;
      /* paint the resting frame even when off-screen, so the hero is never
         left frozen mid-sway for whoever scrolls back up to it */
      paintThreads(heroEnv);
    };

    var heroFrame = function (ts) {
      heroRaf = requestAnimationFrame(heroFrame);
      if (ts - heroLastMove < HERO_WAKE_GAP) {
        /* pointer is still moving: lift the envelope back toward full and hold
           the settle clock at "now", so when it does stop the ease-out starts
           from wherever the envelope currently is — never a jump to full sway */
        heroEnv += (1 - heroEnv) * 0.12;
        if (heroEnv > 0.999) heroEnv = 1;
        heroEnvFrom = heroEnv;
        heroSettleAt = ts;
      } else {
        var t = Math.min((ts - heroSettleAt) / HERO_SETTLE, 1);
        /* eased out, not clamped: leaves full sway without a jerk and reaches
           stillness with zero velocity, so the last moment of motion is
           imperceptible and the cancel below is never seen */
        heroEnv = heroEnvFrom * (1 - t * t * (3 - 2 * t));
        if (t >= 1) { stopHero(0); return; }
      }
      if (!heroVisible) return; /* off-screen: the envelope still runs down, nothing is drawn */
      paintThreads(heroEnv);
      ht += 0.008 * heroEnv; /* time slows with the envelope, so the drift decelerates too */
    };

    var startHero = function (ts) {
      if (heroRunning || reduced) return;
      heroRunning = true;
      heroEnvFrom = heroEnv;
      heroSettleAt = ts;
      heroRaf = requestAnimationFrame(heroFrame);
    };

    window.addEventListener("resize", function () {
      sizeCanvas(); /* resizing the backing store clears it */
      if (!heroRunning) paintThreads(heroEnv);
    });

    heroCanvas.parentElement.addEventListener("mousemove", function (e) {
      var r = heroCanvas.getBoundingClientRect();
      hmx = (e.clientX - r.left) / r.width;
      hmy = (e.clientY - r.top) / r.height;
      /* fine pointers only — a tap synthesises a mousemove, and touch must
         never restart motion the reader did not ask for */
      if (reduced || !finePointerMQ.matches) return;
      heroLastMove = performance.now();
      startHero(heroLastMove);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }).observe(heroCanvas);
    }

    if (reduced) {
      stopHero(0); /* one static frame; the loop never starts */
    } else {
      startHero(performance.now());
      motionOff.push(function () { stopHero(0); });
      /* The settle is the hero's arrival, so it has to be seen. Starting it at
         parse time meant most of the ease played behind the opaque loader
         curtain — on the slow path the reader caught under half of it. Restamp
         the envelope when the curtain actually lifts so the full ease runs in
         view. `pct:curtain-up` is dispatched by the loader block above. */
      document.addEventListener("pct:curtain-up", function () {
        if (reduced || !heroRunning) return;
        heroEnvFrom = heroEnv;
        heroSettleAt = performance.now();
      }, { once: true });
    }
  }

  /* ---------- Pinned horizontal Numbers scene ---------- */
  var numScene = document.querySelector(".numscene");
  /* css/polish.css un-pins this scene on phones and on short landscape
     viewports; without the same gate here the rAF loop keeps running and
     writing an inline transform to a stack that no longer scrolls sideways. */
  var numPinnedMQ = window.matchMedia("(min-width: 768px) and (min-height: 501px)");
  if (numScene && !reduced && numPinnedMQ.matches) {
    var numTrack = numScene.querySelector(".numscene-track");
    var numBar = numScene.querySelector(".numscene-progress span");
    var numTarget = 0, numCurrent = 0, numActive = false, numRaf = null;
    var numLoop = function () {
      numRaf = null;
      numCurrent += (numTarget - numCurrent) * 0.18; /* tight enough to feel responsive */
      if (Math.abs(numTarget - numCurrent) < 0.0004) numCurrent = numTarget;
      var travel = numTrack.scrollWidth - window.innerWidth;
      numTrack.style.transform = "translate3d(" + (-numCurrent * travel).toFixed(1) + "px,0,0)";
      if (numBar) numBar.style.transform = "scaleX(" + numCurrent.toFixed(4) + ")";
      if (numActive || Math.abs(numTarget - numCurrent) > 0.0004) numRaf = requestAnimationFrame(numLoop);
    };
    var numOnScroll = function () {
      var r = numScene.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var raw = total > 0 ? -r.top / total : 0;
      numTarget = Math.max(0, Math.min(1, raw));
      var near = r.bottom > -200 && r.top < window.innerHeight + 200;
      /* one loop at a time, so the handle we hold is always the live one */
      if (near && !numActive) { numActive = true; if (numRaf === null) numRaf = requestAnimationFrame(numLoop); }
      if (!near) numActive = false;
    };
    window.addEventListener("scroll", numOnScroll, { passive: true });
    numOnScroll();
    motionOff.push(function () {
      numActive = false;
      if (numRaf !== null) { cancelAnimationFrame(numRaf); numRaf = null; }
      window.removeEventListener("scroll", numOnScroll);
      /* the reduced-motion stylesheet un-pins this scene and stacks the panels
         into a column; an inline horizontal translate left over from the
         pinned layout would shove that column off-screen, so it has to go */
      numTrack.style.transform = "";
      if (numBar) numBar.style.transform = "scaleX(1)"; /* finished, not the scaleX(0) start */
    });
  }

  /* ---------- Hero letters scroll drift ---------- */
  var heroLetters = document.querySelector(".hero-letters");
  if (heroLetters && !reduced) {
    var lettersTick = false;
    var lettersRaf = null;
    var driftLetters = function () {
      lettersRaf = null;
      var y = Math.min(window.scrollY, window.innerHeight * 1.5);
      heroLetters.style.transform =
        "translate(" + (y * -0.06).toFixed(1) + "px," + (y * 0.24).toFixed(1) + "px)";
      lettersTick = false;
    };
    var onLettersScroll = function () {
      if (!lettersTick) { lettersRaf = requestAnimationFrame(driftLetters); lettersTick = true; }
    };
    window.addEventListener("scroll", onLettersScroll, { passive: true });
    driftLetters();
    motionOff.push(function () {
      if (lettersRaf !== null) { cancelAnimationFrame(lettersRaf); lettersRaf = null; }
      lettersTick = false;
      window.removeEventListener("scroll", onLettersScroll);
      /* leave the letters where this scroll position puts them — snapping back
         to the top-of-page offset would be a jump, i.e. more motion, not less */
      driftLetters();
    });
  }

  /* ---------- Placement rows: eased horizontal motion, 3 rows on mobile ---------- */
  document.querySelectorAll(".placerows").forEach(function (wrap) {
    if (reduced) return;
    var spans = Array.prototype.slice.call(wrap.querySelectorAll(".placerow span"));
    if (!spans.length) return;
    var rows = [], targets = [], currents = [], layout = 0, running = false;

    function build() {
      var parts = window.innerWidth < 700 ? 3 : 2;
      if (layout === parts) return;
      layout = parts;
      wrap.innerHTML = "";
      rows = []; targets = []; currents = [];
      var per = Math.ceil(spans.length / parts);
      for (var i = 0; i < parts; i++) {
        var row = document.createElement("div");
        row.className = "placerow";
        row.setAttribute("data-dir", i % 2 ? "1" : "-1");
        spans.slice(i * per, (i + 1) * per).forEach(function (s) { row.appendChild(s); });
        wrap.appendChild(row);
        rows.push(row); targets.push(0); currents.push(null);
      }
    }
    build();
    window.addEventListener("resize", build);

    function measure() {
      var r = wrap.getBoundingClientRect();
      var progress = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      rows.forEach(function (row, i) {
        var travel = row.scrollWidth - wrap.clientWidth;
        if (travel <= 0) { targets[i] = 0; return; }
        targets[i] = row.getAttribute("data-dir") === "1"
          ? -(1 - progress) * travel
          : -progress * travel;
      });
      return r.bottom > -120 && r.top < window.innerHeight + 120;
    }
    var rowRaf = null;
    function tick() {
      rowRaf = null;
      var near = measure();
      var settled = true;
      rows.forEach(function (row, i) {
        if (currents[i] === null) currents[i] = targets[i];
        currents[i] += (targets[i] - currents[i]) * 0.07; /* gentle glide */
        if (Math.abs(targets[i] - currents[i]) > 0.4) settled = false;
        row.style.transform = "translate3d(" + currents[i].toFixed(1) + "px,0,0)";
      });
      if (near || !settled) rowRaf = requestAnimationFrame(tick);
      else running = false;
    }
    function wake() {
      if (!running) { running = true; rowRaf = requestAnimationFrame(tick); }
    }
    window.addEventListener("scroll", wake, { passive: true });
    wake();
    motionOff.push(function () {
      running = false;
      if (rowRaf !== null) { cancelAnimationFrame(rowRaf); rowRaf = null; }
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", build);
      /* land on the finished offsets for this scroll position, not the start
         ones — the reduced-motion stylesheet then re-flows the rows to
         `transform: none !important` on top of this */
      measure();
      rows.forEach(function (row, i) {
        currents[i] = targets[i];
        row.style.transform = "translate3d(" + targets[i].toFixed(1) + "px,0,0)";
      });
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform =
          "translate(" + x * 0.18 + "px," + y * 0.3 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Expanding pillar panels (accessible disclosure) ---------- */
  document.querySelectorAll(".xpanels").forEach(function (group) {
    var panels = Array.prototype.slice.call(group.querySelectorAll(".xpanel"));
    function activate(panel) {
      panels.forEach(function (p) {
        var on = p === panel;
        p.classList.toggle("active", on);
        var btn = p.querySelector(".xpanel-btn");
        if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
      });
    }
    panels.forEach(function (panel) {
      var btn = panel.querySelector(".xpanel-btn");
      if (btn) {
        btn.addEventListener("click", function () { activate(panel); });
      }
      /* click/tap only — hover activation re-fires as panels resize
         under the pointer and silently churns state */
    });
  });

  /* ---------- Tabs (accessible tablist) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var bar = root.querySelector(".tabbar");
    if (!bar) return;
    var buttons = Array.prototype.slice.call(bar.querySelectorAll("button"));
    var pill = bar.querySelector(".tab-pill");
    var panels = root.querySelectorAll(".tab-panel");
    if (!buttons.length || !pill) return;
    function movePill(btn) {
      pill.style.left = btn.offsetLeft + "px";
      pill.style.width = btn.offsetWidth + "px";
    }
    function select(btn, focus) {
      buttons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (p) {
        p.classList.toggle("active", p.id === btn.getAttribute("aria-controls"));
      });
      movePill(btn);
      if (focus) btn.focus();
    }
    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { select(btn); });
    });
    bar.addEventListener("keydown", function (e) {
      var current = buttons.indexOf(document.activeElement);
      if (current === -1) return;
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % buttons.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + buttons.length) % buttons.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = buttons.length - 1;
      if (next !== null) {
        e.preventDefault();
        select(buttons[next], true);
      }
    });
    var active = bar.querySelector("button.active") || buttons[0];
    select(active);
    window.addEventListener("resize", function () {
      movePill(bar.querySelector("button.active"));
    });
    /* re-measure once webfonts settle — offsetWidth changes when Inter loads */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        movePill(bar.querySelector("button.active"));
      });
    }
  });

  /* ---------- 3D tilt cards ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var inner = card.querySelector(".product-media") || card;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform =
          "perspective(700px) rotateY(" + (x * 9).toFixed(2) + "deg) rotateX(" + (-y * 9).toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        inner.style.transform = "";
      });
    });
  }

  /* ---------- Share with a friend ---------- */
  var SHARE_URL = "https://chasebarn.github.io/pct-zeta-rho/fallrush.html";
  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var payload = {
        title: "Fall Rush · Phi Chi Theta — USF",
        text: "Business major? You should look at Phi Chi Theta’s Fall Rush.",
        url: SHARE_URL
      };
      if (navigator.share) {
        navigator.share(payload).catch(function () {});
        return;
      }
      /* no share sheet: copy the link and confirm on the button */
      var old = btn.textContent;
      btn.textContent = "Link copied ✓";
      setTimeout(function () { btn.textContent = old; }, 2200);
      var legacyCopy = function () {
        var ta = document.createElement("textarea");
        ta.value = SHARE_URL;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_URL).catch(legacyCopy);
      } else {
        legacyCopy();
      }
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
