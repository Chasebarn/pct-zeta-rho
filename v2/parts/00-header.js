/* The opaque header is the safe base. JavaScript makes it transparent only
   while the reader is over the top of the hero. Page content stays visible. */
window.pctInitStick = function () {
  try {
    var hd = document.querySelector('.v2hd');
    if (!hd || hd.dataset.headerReady === '1') return;
    hd.dataset.headerReady = '1';

    function publishHeight() {
      var height = hd.getBoundingClientRect().height;
      if (height > 0) document.documentElement.style.setProperty('--v2hd-h', height.toFixed(1) + 'px');
    }
    publishHeight();
    if ('ResizeObserver' in window) new ResizeObserver(publishHeight).observe(hd);
    else window.addEventListener('resize', publishHeight, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(publishHeight);

    if ('IntersectionObserver' in window) {
      var sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:120px;left:0;width:1px;height:1px;pointer-events:none';
      document.body.appendChild(sentinel);
      hd.classList.toggle('is-over-hero', window.scrollY < 120);
      new IntersectionObserver(function (entries) {
        hd.classList.toggle('is-over-hero', entries[0].isIntersecting);
      }).observe(sentinel);
    }

    var menu = hd.querySelector('details');
    if (menu) {
      hd.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menu.open) {
          menu.open = false;
          menu.querySelector('summary').focus();
        }
      });
      document.addEventListener('click', function (event) {
        if (!menu.contains(event.target)) menu.open = false;
      });
    }
  } catch (err) {
    if (window.console && console.warn) console.warn('pctInitStick:', err);
  }
};

/* One entrance language for the page. Base styles never hide content: Web
   Animations supplies temporary starting states only when a block enters view. */
window.pctInitPageMotion = function () {
  'use strict';
  try {
    if (document.documentElement.dataset.pageMotionReady) return;
    document.documentElement.dataset.pageMotionReady = '1';
    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if ((mq && mq.matches) || !Element.prototype.animate || !window.IntersectionObserver) return;
    var reduced = false;
    var animations = new Set();
    var targets = new Map();
    var observer;
    var easing = 'cubic-bezier(.16,1,.3,1)';

    function play(element, frames, options) {
      if (reduced) return Promise.resolve();
      var animation = element.animate(frames, Object.assign({ duration:850, easing:easing, fill:'backwards' }, options || {}));
      animations.add(animation);
      return animation.finished.catch(function () {}).then(function () { animations.delete(animation); });
    }
    function watch(element, action) {
      if (!element) return;
      element.dataset.motionState = 'ready';
      targets.set(element, action);
      observer.observe(element);
    }
    function ownsFocus(element) {
      var focused = document.activeElement;
      return focused && focused !== document.body &&
        (element.contains(focused) || focused.contains(element));
    }
    function settle(element) {
      observer.unobserve(element);
      animations.forEach(function (animation) {
        var target = animation.effect && animation.effect.target;
        if (target && (target === element || element.contains(target))) animation.cancel();
      });
      element.dataset.motionState = 'done';
    }
    function onFocus() {
      targets.forEach(function (_, element) { if (ownsFocus(element)) settle(element); });
    }
    function wordMasks(element) {
      if (element.dataset.wordsReady) return Array.prototype.slice.call(element.querySelectorAll('.motion-word-inner'));
      var heading = /^H[1-6]$/.test(element.tagName);
      var label = element.textContent.replace(/\s+/g, ' ').trim();
      var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var fragment = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.appendChild(document.createTextNode(part)); return; }
          var mask = document.createElement('span');
          var inner = document.createElement('span');
          mask.className = 'motion-word';
          inner.className = 'motion-word-inner';
          inner.textContent = part;
          if (heading) mask.setAttribute('aria-hidden', 'true');
          mask.appendChild(inner);
          fragment.appendChild(mask);
        });
        node.parentNode.replaceChild(fragment, node);
      });
      if (heading && !element.hasAttribute('aria-label')) element.setAttribute('aria-label', label);
      element.dataset.wordsReady = '1';
      return Array.prototype.slice.call(element.querySelectorAll('.motion-word-inner'));
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var element = entry.target;
        if (element.dataset.motionState === 'done' || ownsFocus(element)) { settle(element); return; }
        observer.unobserve(element);
        element.dataset.motionState = 'running';
        var action = targets.get(element);
        try {
          Promise.resolve(action()).catch(function () {}).then(function () { element.dataset.motionState = 'done'; });
        } catch (error) { element.dataset.motionState = 'done'; }
      });
    /* Start below the viewport, before readable text crosses its edge. */
    }, { threshold:0, rootMargin:'0px 0px 120px 0px' });

    Array.prototype.forEach.call(document.querySelectorAll('[data-motion-words]'), function (element) {
      var words = wordMasks(element);
      var hero = element.closest('.v2hero');
      watch(element, function () {
        var base = Number(element.dataset.motionDelay || (hero ? 120 : 0));
        return Promise.all(words.map(function (word, index) {
          return play(word, [
            { transform:'translate3d(0,110%,0) rotate(2deg)', opacity:.12 },
            { transform:'translate3d(0,0,0) rotate(0deg)', opacity:1 }
          ], { duration:hero ? 1100 : 900, delay:base + Math.min(index * (hero ? 85 : 65), 480) });
        }));
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-motion-rise]'), function (element) {
      watch(element, function () {
        return play(element, [{ opacity:0, transform:'translate3d(0,18px,0)' }, { opacity:1, transform:'translate3d(0,0,0)' }], { duration:850, delay:Number(element.dataset.motionDelay || 0) });
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-motion-map]'), function (element) {
      watch(element, function () {
        var jobs = [];
        var outline = element.querySelector('.v2nat-coast');
        if (outline && outline.getTotalLength) {
          var length = outline.getTotalLength();
          jobs.push(play(outline, [
            { strokeDasharray:length + ' ' + length, strokeDashoffset:length, opacity:.3 },
            { strokeDasharray:length + ' ' + length, strokeDashoffset:0, opacity:1 }
          ], { duration:1900, delay:120, easing:'cubic-bezier(.45,0,.2,1)' }));
        }
        var pins = Array.prototype.slice.call(element.querySelectorAll('[data-chapter-pin]'));
        function horizontal(pin) { return Number((pin.getAttribute('transform').match(/translate\(([-\d.]+)/) || [0,0])[1]); }
        pins.sort(function (a,b) { return horizontal(a) - horizontal(b); });
        pins.forEach(function (pin, index) {
          var dot = pin.querySelector('.v2nat-pin-dot');
          /* The outer SVG group owns its geographic translation. Only the dot
             scales, so the real campus coordinate can never be displaced. */
          var selected = pin.classList.contains('is-selected');
          if (dot && !selected) jobs.push(play(dot, [
            { opacity:0, transform:'scale(.25)', transformOrigin:'0px 0px' },
            { opacity:1, transform:'scale(1)', transformOrigin:'0px 0px' }
          ], { duration:620, delay:400 + index * 19 }));
        });
        return Promise.all(jobs);
      });
    });

    document.addEventListener('focusin', onFocus);

    function finish() {
      reduced = true;
      observer.disconnect();
      animations.forEach(function (animation) { animation.cancel(); });
      animations.clear();
      document.removeEventListener('focusin', onFocus);
      targets.forEach(function (_, element) { element.dataset.motionState = 'done'; });
    }
    if (window.pctMotion && window.pctMotion.onReduce) window.pctMotion.onReduce(finish);
    else if (mq && mq.addEventListener) mq.addEventListener('change', function (event) { if (event.matches) finish(); });
  } catch (error) {
    if (window.console && console.warn) console.warn('pctInitPageMotion:', error);
  }
};
