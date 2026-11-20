(function () {
  'use strict';

  window.pctCountStats = function (stats, { rootMargin = '0px', threshold = .6 } = {}) {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!stats.length || reduceMotion.matches || document.hidden || !('IntersectionObserver' in window)) return;

    const counts = stats.map(stat => ({ ...stat, final: stat.digits.textContent, began: null }));
    const waiting = new Map(counts.map(count => [count.trigger, count]));
    const active = new Set();
    let frame = 0;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio < threshold) continue;
        const count = waiting.get(entry.target);
        if (!count) continue;
        waiting.delete(entry.target);
        observer.unobserve(entry.target);
        active.add(count);
      }
      if (active.size && !frame) frame = requestAnimationFrame(update);
    }, { threshold, rootMargin });

    function finish() {
      observer.disconnect();
      cancelAnimationFrame(frame);
      active.clear();
      waiting.clear();
      counts.forEach(({ digits, final }) => { digits.textContent = final; });
      reduceMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
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
  };
}());
