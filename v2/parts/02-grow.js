/* Button activation changes the chapter detail. Focus and page scroll stay put. */
window.pctInitGrow = function () {
  var root = document.querySelector('[data-grow]');
  if (!root || root.dataset.growReady) return;
  var stage = root.querySelector('[data-grow-stage]');
  var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-grow-btn]'));
  if (!stage || !buttons.length) return;
  var items = buttons.map(function (button) {
    return {
      button:button,
      row:button.closest('.grow__row'),
      panel:document.getElementById(button.getAttribute('aria-controls')),
      figure:document.getElementById(button.getAttribute('data-grow-figure'))
    };
  });
  if (!items.every(function (item) { return item.row && item.panel && item.figure; })) return;
  root.dataset.growReady = '1';
  items.forEach(function (item) {
    /* The image remains described after it moves into the common photo stage. */
    stage.appendChild(item.figure);
  });
  function select(index) {
    items.forEach(function (item,i) {
      var active = i === index;
      item.row.classList.toggle('is-open', active);
      item.button.setAttribute('aria-expanded', String(active));
      item.panel.hidden = !active;
      item.figure.hidden = !active;
    });
  }
  select(0);
  root.classList.add('grow--js');
  items.forEach(function (item,i) {
    item.button.addEventListener('click', function () { select(i); });
    item.button.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowDown') next = (i + 1) % items.length;
      else if (event.key === 'ArrowUp') next = (i + items.length - 1) % items.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = items.length - 1;
      else return;
      event.preventDefault();
      items[next].button.focus();
    });
  });
};
