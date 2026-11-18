(() => {
  const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
  const price = document.getElementById('estimate-package');
  const guests = document.getElementById('estimate-guests');
  const total = document.getElementById('estimate-total');
  const updateEstimate = () => {
    const count = Number(guests.value);
    total.textContent = Number.isInteger(count) && count >= 1 && count <= 9999 ? `A${currency.format(count * Number(price.value))}` : 'Enter guests';
  };
  price.addEventListener('change', updateEstimate);
  guests.addEventListener('input', updateEstimate);
  document.querySelectorAll('[data-package]').forEach(link => link.addEventListener('click', () => {
    document.getElementById('enquiry-package').value = link.dataset.package;
    price.value = link.dataset.price;
    updateEstimate();
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  const carousel = document.querySelector('.rooftop-slideshow');
  const thumbs = [...carousel.querySelectorAll('[data-slide]')];
  const photo = document.getElementById('slide-image');
  const title = document.getElementById('slide-title');
  const caption = document.getElementById('slide-caption');
  const counter = document.getElementById('slide-count');
  const details = document.getElementById('slide-details');
  const stage = carousel.querySelector('.slide-stage');
  const play = carousel.querySelector('[data-slide-play]');
  let index = 0;
  let timer;
  let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false;
  let hovered = false;
  let focused = false;
  const show = next => {
    index = (next + thumbs.length) % thumbs.length;
    const thumb = thumbs[index];
    const source = thumb.querySelector('img');
    photo.src = source.src;
    photo.alt = source.alt;
    title.textContent = thumb.dataset.title;
    caption.textContent = thumb.dataset.caption;
    counter.innerHTML = `${String(index + 1).padStart(2, '0')} <span>/ ${thumbs.length}</span>`;
    stage.setAttribute('aria-label', `${index + 1} of ${thumbs.length}`);
    thumbs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  };
  const schedule = () => {
    window.clearTimeout(timer);
    if (playing && visible && !hovered && !focused && !document.hidden) {
      timer = window.setTimeout(() => { show(index + 1); schedule(); }, 6500);
    }
  };
  const updatePlayback = () => {
    play.textContent = playing ? 'Pause slides' : 'Play slides';
    play.setAttribute('aria-pressed', String(!playing));
    details.setAttribute('aria-live', playing ? 'off' : 'polite');
    schedule();
  };
  const choose = next => { playing = false; show(next); updatePlayback(); };
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => choose(i)));
  carousel.querySelector('[data-slide-prev]').addEventListener('click', () => choose(index - 1));
  carousel.querySelector('[data-slide-next]').addEventListener('click', () => choose(index + 1));
  play.addEventListener('click', () => {
    playing = !playing;
    focused = false;
    hovered = false;
    updatePlayback();
  });
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', () => { focused = true; schedule(); });
  carousel.addEventListener('focusout', event => { focused = carousel.contains(event.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: .15 }).observe(carousel);
  show(0);
  updatePlayback();
  updateEstimate();
})();
