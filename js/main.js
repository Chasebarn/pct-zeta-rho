/* Phi Chi Theta — Zeta Rho · interactions */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Header: light bar once past the hero ---------- */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
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
    };
    if (reduced) lift();
    else if (document.readyState === "complete") setTimeout(lift, 250);
    else {
      window.addEventListener("load", function () { setTimeout(lift, 250); });
      setTimeout(lift, 2200); /* never hold the page hostage */
    }
    /* curtain drops before navigating to another page of the site */
    document.addEventListener("click", function (e) {
      if (reduced) return;
      var a = e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || a.target === "_blank" || href.charAt(0) === "#" || /^https?:/i.test(href)) return;
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
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var plain = el.hasAttribute("data-plain");
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1800;
    var start = null;
    function fmt(n) {
      if (decimals) return n.toFixed(decimals);
      n = Math.round(n);
      return plain ? String(n) : n.toLocaleString("en-US");
    }
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    if (reduced) {
      el.textContent = prefix + fmt(target) + suffix;
    } else {
      requestAnimationFrame(frame);
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

  /* ---------- Hero canvas: flowing silk threads ---------- */
  var heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas && !reduced) {
    var hctx = heroCanvas.getContext("2d");
    var hw, hh, ht = 0, hmx = 0.5, hmy = 0.5, heroVisible = true;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var sizeCanvas = function () {
      hw = heroCanvas.width = heroCanvas.offsetWidth * dpr;
      hh = heroCanvas.height = heroCanvas.offsetHeight * dpr;
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    heroCanvas.parentElement.addEventListener("mousemove", function (e) {
      var r = heroCanvas.getBoundingClientRect();
      hmx = (e.clientX - r.left) / r.width;
      hmy = (e.clientY - r.top) / r.height;
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }).observe(heroCanvas);
    }
    var LINES = 24;
    (function drawThreads() {
      requestAnimationFrame(drawThreads);
      if (!heroVisible) return;
      hctx.clearRect(0, 0, hw, hh);
      var step = Math.max(8 * dpr, hw / 150);
      for (var i = 0; i < LINES; i++) {
        var p = i / LINES;
        var yBase = hh * (0.18 + p * 0.74);
        var amp = hh * 0.05 * (0.35 + p) * (0.7 + 0.6 * hmy);
        hctx.beginPath();
        for (var x = 0; x <= hw + step; x += step) {
          var wave =
            Math.sin(x * 0.0016 / dpr + ht * 0.7 + i * 0.42) *
            Math.cos(x * 0.0006 / dpr - ht * 0.32 + i * 1.7);
          var y = yBase + wave * amp * (0.6 + 0.8 * hmx) + Math.sin(ht * 0.4 + i * 2.1) * 6 * dpr;
          if (x === 0) hctx.moveTo(x, y); else hctx.lineTo(x, y);
        }
        var gold = i % 4 === 0;
        hctx.strokeStyle = gold
          ? "rgba(201,162,39," + (0.06 + 0.11 * p).toFixed(3) + ")"
          : "rgba(150,118,215," + (0.04 + 0.08 * p).toFixed(3) + ")";
        hctx.lineWidth = (gold ? 1.2 : 0.8) * dpr;
        hctx.stroke();
      }
      ht += 0.008;
    })();
  }

  /* ---------- Pinned horizontal Numbers scene ---------- */
  var numScene = document.querySelector(".numscene");
  if (numScene && !reduced) {
    var numTrack = numScene.querySelector(".numscene-track");
    var numBar = numScene.querySelector(".numscene-progress span");
    var numTarget = 0, numCurrent = 0, numActive = false;
    var numLoop = function () {
      numCurrent += (numTarget - numCurrent) * 0.18; /* tight enough to feel responsive */
      if (Math.abs(numTarget - numCurrent) < 0.0004) numCurrent = numTarget;
      var travel = numTrack.scrollWidth - window.innerWidth;
      numTrack.style.transform = "translate3d(" + (-numCurrent * travel).toFixed(1) + "px,0,0)";
      if (numBar) numBar.style.transform = "scaleX(" + numCurrent.toFixed(4) + ")";
      if (numActive || Math.abs(numTarget - numCurrent) > 0.0004) requestAnimationFrame(numLoop);
    };
    var numOnScroll = function () {
      var r = numScene.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var raw = total > 0 ? -r.top / total : 0;
      numTarget = Math.max(0, Math.min(1, raw));
      var near = r.bottom > -200 && r.top < window.innerHeight + 200;
      if (near && !numActive) { numActive = true; requestAnimationFrame(numLoop); }
      if (!near) numActive = false;
    };
    window.addEventListener("scroll", numOnScroll, { passive: true });
    numOnScroll();
  }

  /* ---------- Hero letters scroll drift ---------- */
  var heroLetters = document.querySelector(".hero-letters");
  if (heroLetters && !reduced) {
    var lettersTick = false;
    var driftLetters = function () {
      var y = Math.min(window.scrollY, window.innerHeight * 1.5);
      heroLetters.style.transform =
        "translate(" + (y * -0.06).toFixed(1) + "px," + (y * 0.24).toFixed(1) + "px)";
      lettersTick = false;
    };
    window.addEventListener("scroll", function () {
      if (!lettersTick) { requestAnimationFrame(driftLetters); lettersTick = true; }
    }, { passive: true });
    driftLetters();
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
    function tick() {
      var near = measure();
      var settled = true;
      rows.forEach(function (row, i) {
        if (currents[i] === null) currents[i] = targets[i];
        currents[i] += (targets[i] - currents[i]) * 0.07; /* gentle glide */
        if (Math.abs(targets[i] - currents[i]) > 0.4) settled = false;
        row.style.transform = "translate3d(" + currents[i].toFixed(1) + "px,0,0)";
      });
      if (near || !settled) requestAnimationFrame(tick);
      else running = false;
    }
    function wake() {
      if (!running) { running = true; requestAnimationFrame(tick); }
    }
    window.addEventListener("scroll", wake, { passive: true });
    wake();
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

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
