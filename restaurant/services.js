(() => {
  const navigation = document.getElementById('restaurant-navigation');
  const menuToggle = document.querySelector('.mk-nav-toggle');
  if (navigation && menuToggle) {
    const closeMenu = () => {
      navigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      navigation.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    window.matchMedia('(max-width: 900px)').addEventListener('change', closeMenu);
  }

  document.querySelectorAll('[data-slideshow]').forEach(carousel => {
    const slides = [...carousel.querySelectorAll('.event-slide')];
    const controls = carousel.querySelector('.event-controls');
    const dots = [...carousel.querySelectorAll('[data-slide]')];
    const pauseButton = carousel.querySelector('[data-pause]');
    const photoCount = carousel.querySelector('[data-slide-count]');
    const thumbnails = carousel.querySelector('.event-thumbnails');
    const liveRegion = carousel.querySelector('.event-slides');
    if (slides.length < 2 || !controls || !pauseButton) return;
    let index = 0;
    let timer;
    let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hovered = false;
    let focused = false;
    controls.hidden = false;
    const schedule = () => {
      window.clearTimeout(timer);
      if (playing && !hovered && !focused && !document.hidden) {
        timer = window.setTimeout(() => { show(index + 1); schedule(); }, 6000);
      }
    };
    const show = next => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== index; });
      dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
      if (photoCount) photoCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (thumbnails && dots[index]) {
        const active = dots[index];
        const left = active.getBoundingClientRect().left - thumbnails.getBoundingClientRect().left + thumbnails.scrollLeft;
        if (left < thumbnails.scrollLeft || left + active.offsetWidth > thumbnails.scrollLeft + thumbnails.clientWidth) {
          thumbnails.scrollLeft = left - (thumbnails.clientWidth - active.offsetWidth) / 2;
        }
      }
    };
    const updatePlayback = () => {
      pauseButton.textContent = playing ? 'Pause slides' : 'Play slides';
      pauseButton.setAttribute('aria-pressed', String(!playing));
      liveRegion.setAttribute('aria-live', playing ? 'off' : 'polite');
      schedule();
    };
    const choose = next => { playing = false; show(next); updatePlayback(); };
    carousel.querySelector('[data-previous]').addEventListener('click', () => choose(index - 1));
    carousel.querySelector('[data-next]').addEventListener('click', () => choose(index + 1));
    dots.forEach(dot => dot.addEventListener('click', () => choose(Number(dot.dataset.slide))));
    pauseButton.addEventListener('click', () => {
      playing = !playing;
      // Explicit playback can start while its control still has keyboard focus.
      focused = false;
      hovered = false;
      updatePlayback();
    });
    carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    carousel.addEventListener('focusin', () => { focused = true; schedule(); });
    carousel.addEventListener('focusout', event => { focused = carousel.contains(event.relatedTarget); schedule(); });
    document.addEventListener('visibilitychange', schedule);
    show(0);
    updatePlayback();
  });

  const form = document.querySelector('[data-enquiry]');
  if (!form) return;
  const today = new Date();
  const date = form.querySelector('[name="Date"]');
  if (date) date.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  document.querySelectorAll('[data-occasion]').forEach(link => {
    link.addEventListener('click', () => {
      const occasion = form.querySelector('[name="Occasion"]');
      if (occasion) occasion.value = link.dataset.occasion;
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const kind = form.dataset.enquiry;
    const entries = [...new FormData(form).entries()]
      .filter(([, value]) => String(value).trim())
      .map(([name, value]) => `${name}: ${String(value).trim()}`);
    if (kind === 'Group Tours') {
      entries.push('Sharing package: From A$45 per person — starter, sharing dishes, rice, fruit platter and drink.');
      entries.push('Please confirm the final dishes, selections, price and availability for our group.');
    }
    const body = `Hello Marko’s team,\n\nI’d like to enquire about ${kind.toLowerCase()}.\n\n${entries.join('\n')}\n\nPlease let me know availability and the next steps. Thank you.`;
    const subject = `Marko’s ${kind} Enquiry`;
    window.location.href = `mailto:arthawut.l@australian.co.th?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    let status = form.querySelector('.email-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'email-status';
      status.setAttribute('role', 'status');
      form.appendChild(status);
    }
    status.textContent = 'Your email app should open with your enquiry details. If it does not open, please use the email link beside this form.';
  });
})();
