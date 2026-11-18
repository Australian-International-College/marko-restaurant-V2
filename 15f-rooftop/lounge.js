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
  const dialog = document.getElementById('gallery-dialog');
  const items = [...document.querySelectorAll('.gallery-item')];
  const image = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-count');
  let index = 0;
  let lastTrigger;
  const show = next => {
    index = (next + items.length) % items.length;
    const source = items[index].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    caption.textContent = items[index].dataset.caption;
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${items.length}`;
  };
  items.forEach((item, i) => item.addEventListener('click', () => {
    lastTrigger = item;
    show(i);
    dialog.showModal();
    document.body.classList.add('lightbox-open');
  }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    lastTrigger?.focus({ preventScroll: true });
  });
  updateEstimate();
})();
