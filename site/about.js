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

const serviceTotal = document.querySelector('[data-service-total]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (serviceTotal && !reducedMotion.matches && 'IntersectionObserver' in window) {
  const finalLabel = serviceTotal.textContent.trim();
  const target = Number(finalLabel.replace(/\D/g, ''));
  const formatter = new Intl.NumberFormat('en-US');
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    let start;

    function animate(now) {
      start ??= now;
      const progress = Math.min(1, (now - start) / 1050);
      if (progress === 1 || reducedMotion.matches) {
        serviceTotal.textContent = finalLabel;
        return;
      }
      const amount = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      serviceTotal.textContent = formatter.format(amount);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, { threshold: .12 });
  observer.observe(serviceTotal.closest('.service-impact'));
}

const honorFeature = document.querySelector('.honors-feature');

if (honorFeature) {
  const index = honorFeature.querySelector('.honor-index');
  const stories = [...honorFeature.querySelectorAll('.honor-story')];
  const compact = matchMedia('(max-width: 760px)');
  const buttons = stories.map((story) => {
    const button = document.createElement('button');
    const name = document.createElement('span');
    const year = story.querySelector('time').cloneNode(true);
    button.type = 'button';
    button.id = story.id + '-tab';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', story.id);
    name.textContent = story.querySelector('h3').textContent;
    year.setAttribute('aria-hidden', 'true');
    button.append(name, year);
    story.setAttribute('role', 'tabpanel');
    story.setAttribute('aria-labelledby', button.id);
    story.tabIndex = 0;
    index.append(button);
    return button;
  });
  let selected = 0;

  function select(position) {
    selected = (position + stories.length) % stories.length;
    stories.forEach((story, item) => {
      const active = item === selected;
      buttons[item].setAttribute('aria-selected', String(active));
      buttons[item].tabIndex = active ? 0 : -1;
      story.toggleAttribute('data-active', active);
      if (active) story.removeAttribute('aria-hidden');
      else story.setAttribute('aria-hidden', 'true');
      story.inert = !active;
    });
  }

  buttons.forEach((button, position) => {
    button.addEventListener('click', () => select(position));
  });

  function setOrientation() {
    index.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
  }

  index.addEventListener('keydown', (event) => {
    if (!buttons.includes(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
    const columns = getComputedStyle(index).gridTemplateColumns.split(' ').length;
    const positions = {
      ArrowLeft: selected - 1,
      ArrowRight: selected + 1,
      ArrowUp: selected - columns,
      ArrowDown: selected + columns,
      Home: 0,
      End: stories.length - 1,
    };
    if (!Object.hasOwn(positions, event.key)) return;
    event.preventDefault();
    select(positions[event.key]);
    buttons[selected].focus({ preventScroll: true });
  });

  select(selected);
  setOrientation();
  compact.addEventListener('change', setOrientation);
  honorFeature.dataset.enhanced = '';
  index.hidden = false;
}
