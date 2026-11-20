(function () {
  'use strict';

  window.pctCountStats = function (stats, { topInset = 0, bottomInset = 0, threshold = .6 } = {}) {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!stats.length || reduceMotion.matches || document.hidden || !('IntersectionObserver' in window)) return;

    const counts = stats.map(stat => ({ ...stat, final: stat.digits.textContent, began: null }));
    const waiting = new Map(counts.map(count => [count.trigger, count]));
    const active = new Set();
    let frame = 0;
    let visibilityFrame = 0;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio >= threshold) startCount(entry.target);
      }
    }, { threshold, rootMargin: `-${topInset}px 0px -${bottomInset}px` });

    function startCount(trigger) {
      const count = waiting.get(trigger);
      if (!count) return;
      waiting.delete(trigger);
      observer.unobserve(trigger);
      active.add(count);
      if (!frame) frame = requestAnimationFrame(update);
    }

    function queueVisibilityCheck() {
      if (waiting.size && !visibilityFrame) visibilityFrame = requestAnimationFrame(checkVisibility);
    }

    function checkVisibility() {
      visibilityFrame = 0;
      const bottom = window.innerHeight - bottomInset;
      for (const trigger of waiting.keys()) {
        const bounds = trigger.getBoundingClientRect();
        const visible = Math.min(bounds.bottom, bottom) - Math.max(bounds.top, topInset);
        if (bounds.height > 0 && visible >= bounds.height * threshold) startCount(trigger);
      }
    }

    function finish() {
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(visibilityFrame);
      active.clear();
      waiting.clear();
      counts.forEach(({ digits, final }) => { digits.textContent = final; });
      reduceMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('scroll', queueVisibilityCheck);
      window.removeEventListener('resize', queueVisibilityCheck);
      window.removeEventListener('pageshow', queueVisibilityCheck);
    }

    function onMotionChange(event) {
      if (event.matches) finish();
    }

    function onVisibilityChange() {
      if (document.hidden) finish();
    }

    function countValue(count, now) {
      const elapsed = now - count.began;
      const delays = count.finishDelays;
      const duration = delays ? 415 : 900;
      const firstFinalStep = delays ? count.target - delays.length : count.target;
      if (!delays || elapsed < duration) {
        if (elapsed >= duration) return count.target;
        const openingTarget = delays ? firstFinalStep - 1 : count.target;
        const fraction = elapsed / duration;
        const progress = delays ? fraction ** 2 * (3 - 2 * fraction) : 1 - (1 - fraction) ** 3;
        return 1 + (openingTarget - 1) * progress;
      }

      // Time each final dollar from the frame that displayed it so none are skipped.
      if (count.nextStepAt === undefined) count.step = 0;
      else if (now < count.nextStepAt) return firstFinalStep + count.step;
      else count.step += 1;
      if (count.step === delays.length) return count.target;
      count.nextStepAt = now + delays[count.step];
      return firstFinalStep + count.step;
    }

    function update(now) {
      frame = 0;
      for (const count of active) {
        count.began ??= now;
        const value = countValue(count, now);
        const done = value >= count.target;
        const text = done ? count.final : count.format(value);
        if (count.digits.textContent !== text) count.digits.textContent = text;
        if (done) active.delete(count);
      }
      if (active.size) frame = requestAnimationFrame(update);
      else if (!waiting.size) finish();
    }

    reduceMotion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    for (const count of counts) {
      count.digits.textContent = count.format(1);
      observer.observe(count.trigger);
    }
    if (topInset || bottomInset) {
      // Safari can miss an observer entry around a restored scroll position.
      window.addEventListener('scroll', queueVisibilityCheck, { passive: true });
      window.addEventListener('resize', queueVisibilityCheck, { passive: true });
      window.addEventListener('pageshow', queueVisibilityCheck);
      queueVisibilityCheck();
    }
  };
}());
