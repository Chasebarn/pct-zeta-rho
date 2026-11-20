const section = document.querySelector('.chapter-history');
const rail = section.querySelector('.timeline-spread');
const stops = [...rail.querySelectorAll('.timeline-milestone')];
const pins = stops.map(stop => stop.querySelector('.timeline-pin'));
const traveler = rail.querySelector('.timeline-traveler');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let active = -1;
let frame;

function updateJourney() {
  frame = undefined;
  const viewportHeight = window.innerHeight;
  const railRect = rail.getBoundingClientRect();
  if (railRect.bottom < 0 || railRect.top > viewportHeight) return;

  const stopsInView = pins.map(pin => {
    const bounds = pin.getBoundingClientRect();
    return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
  });
  const focus = viewportHeight * .56;
  const reached = stopsInView.findLastIndex(stop => stop.y <= focus);
  if (reached !== active) {
    stops[active]?.classList.remove('is-current');
    stops[reached]?.classList.add('is-current');
    active = reached;
  }

  const from = stopsInView[active];
  const to = stopsInView[active + 1];
  traveler.hidden = reducedMotion.matches || !from || !to || focus - from.y < 12 || to.y - focus < 12;
  if (traveler.hidden) return;

  // The SVG's control points are a third and two-thirds down each segment.
  // That makes its horizontal position the smoothstep of vertical progress.
  const fraction = (focus - from.y) / (to.y - from.y);
  const horizontal = fraction * fraction * (3 - 2 * fraction);
  const x = from.x + (to.x - from.x) * horizontal - railRect.left;
  const y = focus - railRect.top;
  const proximity = Math.min(focus - from.y, to.y - focus);
  traveler.style.opacity = Math.min(1, (proximity - 12) / 38);
  traveler.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function scheduleJourney() {
  if (frame === undefined) frame = requestAnimationFrame(updateJourney);
}

if ('IntersectionObserver' in window) {
  const entries = section.querySelectorAll('.history-title, .timeline-media');
  const revealer = new IntersectionObserver((changes, observer) => {
    for (const entry of changes) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: .12 });

  section.dataset.motion = '';
  entries.forEach(entry => revealer.observe(entry));
}

window.addEventListener('scroll', scheduleJourney, { passive: true });
window.addEventListener('resize', scheduleJourney, { passive: true });
window.addEventListener('pageshow', scheduleJourney);
reducedMotion.addEventListener('change', scheduleJourney);
if ('ResizeObserver' in window) new ResizeObserver(scheduleJourney).observe(rail);
scheduleJourney();
