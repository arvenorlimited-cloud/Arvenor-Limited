(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.page-progress span');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu-panel');
  const menuLinks = menu ? menu.querySelectorAll('a') : [];
  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.setAttribute('aria-hidden', String(!open));
  };
  if (menuButton && menu) menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menuLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();

  const BUSINESS_EMAIL = 'connect@arvenorlimited.com.ng';
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Website enquiry — ${data.get('interest')}`);
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterest: ${data.get('interest')}\n\n${data.get('message')}`);
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
    if (note) note.textContent = 'Your email app should open with the enquiry prepared. Please review and send it. This website does not store submissions.';
  });
})();
