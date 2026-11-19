const serviceGallery = document.querySelector('.service-gallery');

if (serviceGallery) {
  const projects = [...serviceGallery.querySelectorAll('.service-project')];
  const buttons = projects.map((project) => project.querySelector('.service-select'));
  const controls = serviceGallery.querySelector('.service-controls');
  const status = serviceGallery.querySelector('[data-service-status]');
  const stage = serviceGallery.querySelector('.service-projects');
  const awardIndex = projects.findIndex((project) => project.hasAttribute('data-service-award'));
  let selected = 0;
  let swipe;
  let lastSwipe = -Infinity;

  function select(index, announce = true) {
    selected = (index + projects.length) % projects.length;
    projects.forEach((project, item) => {
      const relativeIndex = (item - selected + projects.length) % projects.length;
      project.dataset.servicePosition = ['selected', 'next', 'previous'][relativeIndex];
      buttons[item].setAttribute('aria-pressed', String(item === selected));
      project.querySelector('.service-caption').inert = item !== selected;
    });
    if (announce) {
      const title = projects[selected].querySelector('h3').textContent;
      status.textContent = `${title}, ${selected + 1} of ${projects.length}`;
    }
  }

  function showAward() {
    if (location.hash === '#awards' && awardIndex >= 0) select(awardIndex, false);
  }

  buttons.forEach((button, index) => {
    button.hidden = false;
    button.addEventListener('click', (event) => {
      if (event.detail && performance.now() - lastSwipe < 250) return;
      select(index);
    });
  });

  for (const button of controls.querySelectorAll('[data-service-step]')) {
    const direction = Number(button.dataset.serviceStep);
    button.addEventListener('click', () => select(selected + direction));
  }

  serviceGallery.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    select(selected + (event.key === 'ArrowRight' ? 1 : -1));
    if (buttons.includes(event.target)) buttons[selected].focus({ preventScroll: true });
  });

  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' && event.isPrimary) swipe = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { passive: true });
  stage.addEventListener('pointercancel', () => { swipe = undefined; }, { passive: true });
  stage.addEventListener('pointerup', (event) => {
    if (swipe?.id !== event.pointerId) return;
    const horizontal = event.clientX - swipe.x;
    const vertical = event.clientY - swipe.y;
    swipe = undefined;
    if (Math.abs(horizontal) < Math.max(38, Math.abs(vertical) * 1.35)) return;
    lastSwipe = performance.now();
    select(selected + (horizontal < 0 ? 1 : -1));
  }, { passive: true });

  select(selected, false);
  showAward();
  window.addEventListener('hashchange', showAward);
  serviceGallery.dataset.enhanced = '';
  controls.hidden = false;
}

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
