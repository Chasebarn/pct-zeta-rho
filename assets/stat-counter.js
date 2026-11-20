(function () {
  'use strict';

  window.pctCountStats = function (stats, rootMargin = '0px') {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!stats.length || reduceMotion.matches || document.hidden || !('IntersectionObserver' in window)) return;

    const threshold = .6;
    const duration = 900;
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

    function update(now) {
      frame = 0;
      for (const count of active) {
        count.began ??= now;
        const progress = Math.min(1, (now - count.began) / duration);
        const eased = 1 - (1 - progress) ** 3;
        const text = progress === 1 ? count.final : count.format(1 + (count.target - 1) * eased);
        if (count.digits.textContent !== text) count.digits.textContent = text;
        if (progress === 1) active.delete(count);
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
