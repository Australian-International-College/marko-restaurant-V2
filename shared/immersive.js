(() => {
  const root = document.documentElement;
  const header = document.querySelector('.im-header');
  const menu = document.querySelector('.im-menu-toggle');
  const navigation = document.querySelector('.im-navigation');
  const updateHeader = () => root.classList.toggle('im-scrolled', window.scrollY > 64);
  window.addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();
  const closeMenu = () => {
    menu?.setAttribute('aria-expanded','false');
    header?.classList.remove('im-menu-open');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));
    header.classList.toggle('im-menu-open',open);
  });
  navigation?.addEventListener('click', event => {if(event.target.closest('a')) closeMenu();});
  document.addEventListener('keydown', event => {if(event.key==='Escape') closeMenu();});
  window.matchMedia('(min-width:1001px)').addEventListener('change',closeMenu);
  document.querySelectorAll('.im-footer #year').forEach(el => el.textContent = new Date().getFullYear());

  // Reveal is progressive: content remains visible without JavaScript or motion.
  if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('im-in-view');observer.unobserve(entry.target);}
    }),{threshold:.08});
    document.querySelectorAll('.im-experience-panel,.im-section-heading,.im-gather,.section-heading,.service-heading,.intro-copy,.story-copy,.events-copy').forEach(el => {
      el.classList.add('im-reveal');observer.observe(el);
    });
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'im-photo-dialog';
  dialog.innerHTML = '<div class="im-lightbox-toolbar"><p>Take a closer look</p><button type="button" class="im-lightbox-close">Close</button></div><img alt=""><p class="im-lightbox-caption"></p>';
  document.body.appendChild(dialog);
  const close = dialog.querySelector('button');
  let returnFocus;
  const closePhoto = () => {dialog.close();document.body.classList.remove('im-photo-open');returnFocus?.focus();};
  close.addEventListener('click',closePhoto);
  dialog.addEventListener('cancel',event=>{event.preventDefault();closePhoto();});
  dialog.addEventListener('click',event=>{if(event.target===dialog)closePhoto();});
  const photos = document.querySelectorAll('.gallery-item img,.events-photo img,.intro-image img,.view-inset img,.slide-stage img,.event-slide img,.map-art img,.attractions-map img,.routes-map img,.map-figure img,.map-preview img');
  photos.forEach(photo=>{
    if(photo.closest('a,button'))return;
    photo.tabIndex=0;
    photo.setAttribute('role','button');
    const updateLabel = () => photo.setAttribute('aria-label','Enlarge photo: '+photo.alt);
    updateLabel();
    new MutationObserver(updateLabel).observe(photo,{attributes:true,attributeFilter:['alt']});
    photo.classList.add('im-enlargeable');
    const openPhoto = () => {
      returnFocus=photo;
      const full=dialog.querySelector('img');
      full.src=photo.currentSrc||photo.src;full.alt=photo.alt;
      dialog.querySelector('.im-lightbox-caption').textContent=photo.alt;
      document.body.classList.add('im-photo-open');dialog.showModal();close.focus();
    };
    photo.addEventListener('click',openPhoto);
    photo.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openPhoto();}});
  });
})();
