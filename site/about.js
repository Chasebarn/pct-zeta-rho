const rail = document.querySelector('.honor-rail');
const controls = document.querySelector('.honor-controls');

if (rail && controls) {
  const stories = Array.from(rail.querySelectorAll('.honor-story'));
  const position = controls.querySelector('.honor-position');
  const previous = controls.querySelector('[data-honor-step="-1"]');
  const next = controls.querySelector('[data-honor-step="1"]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let frame;

  function update() {
    frame = undefined;
    const left = rail.getBoundingClientRect().left;
    selected = stories.reduce((current, story, index) => {
      const closest = stories[current].getBoundingClientRect().left;
      return Math.abs(story.getBoundingClientRect().left - left) < Math.abs(closest - left) ? index : current;
    }, 0);
    const label = `${selected + 1} of ${stories.length}`;
    if (position.textContent !== label) position.textContent = label;
    previous.setAttribute('aria-disabled', String(selected === 0));
    next.setAttribute('aria-disabled', String(selected === stories.length - 1));
  }

  function step(direction) {
    const target = stories[selected + direction];
    if (!target) return;
    const distance = target.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    rail.scrollTo({
      left: rail.scrollLeft + distance,
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  function scheduleUpdate() {
    if (frame === undefined) frame = requestAnimationFrame(update);
  }

  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  rail.addEventListener('scroll', scheduleUpdate, { passive: true });
  rail.addEventListener('keydown', (event) => {
    if (event.target !== rail || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  });
  rail.addEventListener('focusin', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  rail.dataset.enhanced = '';
  update();
  controls.hidden = false;
}
