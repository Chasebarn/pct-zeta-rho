/* Keep the original arc moving only while its photographs are on screen. */
window.pctInitPhotoArc = function () {
  var band = document.querySelector('.mem-band');
  if (!band || !window.IntersectionObserver || band.dataset.arcReady) return;
  band.dataset.arcReady = '1';
  var visible = false;
  function update() {
    band.classList.toggle('is-resting', document.hidden || !visible);
  }
  update();
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    update();
  }).observe(band);
  document.addEventListener('visibilitychange', update);
};
