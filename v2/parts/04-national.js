window.pctInitNational = function () {
  'use strict';
  const root = document.querySelector('[data-national]');
  if (!root || root.dataset.nationalReady) return;
  const map = root.querySelector('[data-chapter-map]');
  const pins = [...map.querySelectorAll('[data-chapter-pin]')];
  const home = pins.find(pin => pin.classList.contains('is-usf'));
  const caption = root.querySelector('.v2nat-caption');
  const school = root.querySelector('[data-map-school]');
  const detail = root.querySelector('[data-map-detail]');
  let selected = null;
  let visible = null;
  let tabStop = home;
  root.dataset.nationalReady = '1';
  map.setAttribute('role', 'group');
  map.setAttribute('aria-describedby', 'pct-map-keys');

  for (const pin of pins) {
    const {school: name, city, state} = pin.dataset;
    pin.setAttribute('role', 'button');
    pin.setAttribute('aria-label', name + ', ' + city + ', ' + state);
    pin.setAttribute('aria-pressed', 'false');
    pin.setAttribute('tabindex', pin === home ? '0' : '-1');
  }

  function show(pin) {
    if (pin === visible) return;
    visible?.classList.remove('is-selected');
    if (pin) {
      pin.classList.add('is-selected');
      school.textContent = pin.dataset.school;
      detail.textContent = pin.dataset.chapter + ' · ' + pin.dataset.city + ', ' + pin.dataset.state;
    }
    caption.hidden = !pin;
    visible = pin;
  }

  function setTabStop(pin) {
    tabStop.setAttribute('tabindex', '-1');
    pin.setAttribute('tabindex', '0');
    tabStop = pin;
  }

  function select(pin) {
    selected?.setAttribute('aria-pressed', 'false');
    pin?.setAttribute('aria-pressed', 'true');
    selected = pin;
    if (pin) setTabStop(pin);
    show(pin);
  }

  function nearestPin(event, hitRadius) {
    const matrix = map.getScreenCTM();
    if (!matrix) return null;
    let nearest = null;
    let bestDistance = hitRadius;
    for (const pin of pins) {
      const transform = pin.transform.baseVal.getItem(0).matrix;
      const point = new DOMPoint(transform.e, transform.f).matrixTransform(matrix);
      const distance = Math.hypot(event.clientX - point.x, event.clientY - point.y);
      if (distance < bestDistance) {
        nearest = pin;
        bestDistance = distance;
      }
    }
    return nearest;
  }

  map.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      const pin = nearestPin(event, 13);
      map.classList.toggle('is-over-pin', Boolean(pin));
      show(pin || selected);
    }
  });
  map.addEventListener('pointerleave', () => {
    map.classList.remove('is-over-pin');
    const focusedPin = map.contains(document.activeElement) && document.activeElement.closest('[data-chapter-pin]');
    show(focusedPin || selected);
  });
  map.addEventListener('click', event => {
    const pin = event.detail ? nearestPin(event, 23) : event.target.closest('[data-chapter-pin]');
    select(pin);
  });
  map.addEventListener('focusin', event => {
    const pin = event.target.closest('[data-chapter-pin]');
    if (pin) show(pin);
  });
  map.addEventListener('focusout', event => {
    if (!map.contains(event.relatedTarget)) show(selected);
  });
  map.addEventListener('keydown', event => {
    const pin = event.target.closest('[data-chapter-pin]');
    if (!pin) return;
    const index = pins.indexOf(pin);
    let next;
    switch (event.key) {
      case 'Enter':
      case ' ': select(pin); break;
      case 'Escape': select(null); break;
      case 'ArrowRight':
      case 'ArrowDown': next = pins[(index + 1) % pins.length]; break;
      case 'ArrowLeft':
      case 'ArrowUp': next = pins[(index + pins.length - 1) % pins.length]; break;
      case 'Home': next = pins[0]; break;
      case 'End': next = pins[pins.length - 1]; break;
      default: return;
    }
    event.preventDefault();
    if (next) {
      setTabStop(next);
      next.focus({preventScroll: true});
    }
  });

  if (!window.IntersectionObserver || window.pctMotion?.reduced) return;
  const position = pin => pin.transform.baseVal.getItem(0).matrix;
  const origin = position(home);
  const distances = pins.map(pin => Math.hypot(position(pin).e - origin.e, position(pin).f - origin.f));
  const maxDistance = Math.max(...distances);
  pins.forEach((pin, index) => pin.style.setProperty('--pin-delay', Math.round(350 * distances[index] / maxDistance) + 'ms'));

  let observer;
  function reveal() {
    root.classList.add('pins-arrived');
    observer?.disconnect();
  }
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) reveal();
  }, {rootMargin: '0px 0px -12% 0px'});
  observer.observe(map);
  map.addEventListener('focusin', reveal, {once: true});
  window.pctMotion?.onReduce(reveal);
};
