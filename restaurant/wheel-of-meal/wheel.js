(() => {
  'use strict';
  const dishes = [
    {name:'Boat Noodle Soup',label:['Boat Noodle','Soup'],image:'Boat-Noodle-Soup.jpg',group:'noodles',description:'Traditional Thai noodle soup in a dark broth with meatballs, pork liver, Chinese broccoli, bean sprouts, coriander and fried garlic.'},
    {name:'Marko’s Grilled Chicken',label:['Grilled','Chicken'],image:'Marko-Grilled-Chicken.jpg',group:'grilled',description:'Marko’s marinated chicken with Thai herbs and homemade sweet chilli sauce. A signature favourite for your table.'},
    {name:'King Prawn Pad Thai',label:['King Prawn','Pad Thai'],image:'King Pranws Pad Thai.jpg',group:'noodles',description:'A classic Thai favourite with noodles, prawns, lime, bean sprouts and crushed peanuts.'},
    {name:'Green Curry',label:['Green','Curry'],image:'Green Curry.jpg',group:'saucy',description:'In the mood for curry? Try Marko’s Green Curry. Ask our team about the available choices and spice level.'},
    {name:'Marko’s X.O. Fried Rice',label:['X.O.','Fried Rice'],image:'Marko’s X.O. Fried Rice.jpg',group:'rice',description:'Go for Marko’s X.O. Fried Rice. A comforting rice dish for your next visit—ask our team for the full dish details.'},
    {name:'Pla Sam Rod',label:['Pla Sam','Rod'],image:'Pla Sam Rod.jpg',group:'saucy',description:'A Thai fish favourite from Marko’s menu. Ask our team about today’s preparation and serving options.'},
    {name:'Green Mango & Barramundi Salad',label:['Mango & Fish','Salad'],image:'Green Mango Salad with Deep Fried Barramundi Fish Fillet.jpg',group:'fresh',description:'Green mango salad with deep-fried barramundi fish fillet. A lively combination for something fresh and crisp.'},
    {name:'Cashew Nut Stir-fry',label:['Cashew Nut','Stir-fry'],image:'Cashew Nut Sauce.jpg',group:'saucy',description:'Choose a cashew nut sauce favourite from Marko’s menu. Ask our team about the available protein options.'}
  ];
  const canvas = document.querySelector('#wheel');
  const ctx = canvas.getContext('2d');
  const spin = document.querySelector('#spin');
  const category = document.querySelector('#category');
  const result = document.querySelector('.result');
  const again = document.querySelector('#again');
  const note = document.querySelector('#wheel-note');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colours = ['#102446','#31599a','#b99250','#6382b2','#183861','#d7bc7f','#46689a','#8097b8'];
  let active = dishes.slice(), rotation = 0, spinning = false, pending = null, timer = null, previous = null;

  function randomIndex(length) {
    if (!window.crypto || !window.crypto.getRandomValues) return Math.floor(Math.random() * length);
    const range = 0x100000000;
    const limit = range - (range % length);
    const value = new Uint32Array(1);
    do { window.crypto.getRandomValues(value); } while (value[0] >= limit);
    return value[0] % length;
  }

  function draw() {
    const size = canvas.width, c = size / 2, radius = c - 2, step = Math.PI * 2 / active.length;
    ctx.clearRect(0, 0, size, size);
    active.forEach((dish, i) => {
      const start = -Math.PI / 2 + i * step;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, radius, start, start + step);
      ctx.closePath();
      ctx.fillStyle = colours[i % colours.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff65'; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.translate(c, c); ctx.rotate(start + step / 2);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = [2,5].includes(i % colours.length) ? '#102446' : '#ffffff';
      ctx.font = 'bold 27px Arial, sans-serif';
      dish.label.forEach((line, j) => ctx.fillText(line, radius * .63, (j - (dish.label.length - 1) / 2) * 35));
      ctx.restore();
    });
    note.textContent = active.length === 1 ? 'One dish in this category. Give it a spin!' : `${active.length} dishes. One delicious decision.`;
    const list = document.querySelector('#dish-list');
    list.replaceChildren(...active.map(dish => {
      const chip = document.createElement('span'); chip.className = 'dish-chip'; chip.textContent = dish.name; return chip;
    }));
  }

  function finish() {
    if (!spinning || !pending) return;
    clearTimeout(timer);
    const dish = pending;
    pending = null; spinning = false; previous = dish;
    document.querySelector('#dish-photo').src = '../images/' + encodeURIComponent(dish.image);
    document.querySelector('#dish-photo').alt = dish.name;
    document.querySelector('#result-heading').textContent = dish.name;
    document.querySelector('#dish-description').textContent = dish.description;
    document.querySelector('#result-kicker').textContent = 'THE WHEEL HAS SPOKEN';
    document.querySelector('#photo-tag').textContent = 'YOUR MEAL PICK';
    result.classList.remove('reveal');
    void result.offsetWidth;
    result.classList.add('reveal');
    result.setAttribute('aria-busy', 'false');
    spin.disabled = false; category.disabled = false; again.disabled = false;
    spin.innerHTML = 'Spin again <span aria-hidden="true">↻</span>';
    again.hidden = false;
    note.textContent = 'Sounds good? Ask our team—or give it another spin.';
  }

  function start() {
    if (spinning) return;
    spinning = true;
    spin.disabled = true; category.disabled = true; again.disabled = true;
    result.setAttribute('aria-busy', 'true');
    spin.textContent = 'Finding your next favourite…';
    note.textContent = 'Round it goes…';
    // Avoid repeating the last suggestion when more than one dish is available.
    const candidates = active.filter(dish => active.length === 1 || dish !== previous);
    pending = candidates[randomIndex(candidates.length)];
    const index = active.indexOf(pending), step = 360 / active.length;
    rotation = Math.ceil(rotation / 360) * 360 + 5 * 360 + (360 - (index + .5) * step);
    canvas.style.transform = `rotate(${rotation}deg)`;
    if (reducedMotion.matches) finish();
    else timer = setTimeout(finish, 5500);
  }

  canvas.addEventListener('transitionend', event => { if (event.propertyName === 'transform') finish(); });
  spin.addEventListener('click', start);
  again.addEventListener('click', () => { document.querySelector('.wheel-panel').scrollIntoView({behavior:reducedMotion.matches ? 'auto' : 'smooth',block:'center'}); start(); });
  category.addEventListener('change', () => {
    if (spinning) return;
    active = dishes.filter(dish => category.value === 'all' || dish.group === category.value);
    canvas.style.transition = 'none'; canvas.style.transform = 'rotate(0deg)'; rotation = 0;
    void canvas.offsetWidth; canvas.style.transition = '';
    draw();
  });
  draw();
})();
