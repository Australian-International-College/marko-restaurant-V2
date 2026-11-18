(() => {
  const packageInput = document.getElementById('estimate-package');
  const guestInput = document.getElementById('estimate-guests');
  const total = document.getElementById('estimate-total');
  const caption = document.getElementById('estimate-caption');
  const enquiry = document.getElementById('rooftop-enquiry');
  const packageField = document.getElementById('enquiry-package');
  const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', currencyDisplay: 'code', maximumFractionDigits: 0 });
  const money = value => currency.format(value).replace('AUD', 'A$').replace(/\s/g, '');
  const updateEstimate = () => {
    const guests = Number(guestInput.value);
    if (!Number.isSafeInteger(guests) || guests < 1) {
      total.textContent = '—';
      caption.textContent = 'Enter a whole guest count of 1 or more.';
      return;
    }
    const price = Number(packageInput.value);
    total.textContent = money(guests * price);
    caption.textContent = `${guests} ${guests === 1 ? 'guest' : 'guests'} × ${money(price)} per person`;
  };
  packageInput.addEventListener('change', updateEstimate);
  guestInput.addEventListener('input', updateEstimate);
  document.querySelectorAll('[data-package]').forEach(link => {
    link.addEventListener('click', () => {
      packageField.value = link.dataset.package;
      packageInput.value = link.dataset.price;
      const guests = Number(guestInput.value);
      if (Number.isSafeInteger(guests) && guests > 0) enquiry.elements.namedItem('Guests').value = guests;
      updateEstimate();
    });
  });
  updateEstimate();
})();
