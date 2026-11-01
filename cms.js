/* Arvenor CMS bridge.
   Reads Pages CMS JSON files from the deployed site. Content remains gracefully
   fall-backed to the approved HTML if the JSON cannot be loaded. */
(() => {
  const SITE = '/content/site.json';
  const PROJECTS_API = 'https://api.github.com/repos/arvenorlimited-cloud/Arvenor-Limited/contents/content/projects';
  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && typeof value === 'string' && value.trim()) el.textContent = value;
  };
  const setRichText = (selector, value) => {
    const el = document.querySelector(selector);
    if (!el || typeof value !== 'string' || !value.trim()) return;
    // CMS rich text is treated as text, not executable HTML.
    el.textContent = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };
  const setImage = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && typeof value === 'string' && value.trim()) {
      const path = value.startsWith('http') ? value : `/media/${value.replace(/^\/?media\//, '')}`;
      el.style.backgroundImage = `url("${path.replace(/"/g, '%22')}")`;
    }
  };
  const updateEmail = email => {
    if (!email) return;
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.href = `mailto:${email}`;
      if (a.textContent.includes('@')) a.textContent = email;
    });
  };
  const renderServices = items => {
    if (!Array.isArray(items) || !items.length) return;
    const page = location.pathname.split('/').pop() || 'index.html';
    const containers = page === 'index.html' ? document.querySelectorAll('.cap-list') : document.querySelectorAll('.service-grid');
    containers.forEach(container => {
      const isHome = container.classList.contains('cap-list');
      container.innerHTML = '';
      items.forEach((item, index) => {
        const article = document.createElement('article');
        article.className = `${isHome ? 'cap-item' : 'service-card'} reveal is-visible`;
        const title = document.createElement('h3'); title.textContent = item.title || '';
        const desc = document.createElement('p'); desc.textContent = item.description || '';
        if (isHome) {
          const number = document.createElement('span'); number.className = 'cap-number';
          number.textContent = String(index + 1).padStart(2, '0');
          const body = document.createElement('div'); body.append(title, desc);
          const arrow = document.createElement('span'); arrow.className = 'cap-arrow';
          article.append(number, body, arrow);
        } else article.append(title, desc);
        if (item.image) {
          const path = item.image.startsWith('http') ? item.image : `/media/${item.image.replace(/^\/?media\//, '')}`;
          article.style.backgroundImage = `linear-gradient(transparent,rgba(11,31,54,.08)),url("${path}")`;
        }
        container.append(article);
      });
    });
  };
  const renderProjects = async () => {
    const target = document.querySelector('[data-cms-projects]');
    if (!target) return;
    try {
      const response = await fetch(PROJECTS_API);
      if (!response.ok) return;
      const files = await response.json();
      const entries = await Promise.all(files.filter(f => f.name.endsWith('.json')).map(async f => {
        const r = await fetch(f.download_url); return r.ok ? r.json() : null;
      }));
      const published = entries.filter(p => p && p.publish);
      if (!published.length) return;
      target.innerHTML = '';
      published.forEach(p => {
        const card = document.createElement('article'); card.className = 'service-card';
        const h = document.createElement('h3'); h.textContent = p.title || '';
        const meta = document.createElement('p'); meta.textContent = [p.status, p.location].filter(Boolean).join(' · ');
        const summary = document.createElement('p'); summary.textContent = (p.summary || '').replace(/<[^>]*>/g, ' ').trim();
        card.append(h, meta, summary);
        if (p.cover) {
          const img = document.createElement('img');
          img.src = p.cover.startsWith('http') ? p.cover : `/media/${p.cover.replace(/^\/?media\//, '')}`;
          img.alt = p.title || 'Arvenor project'; img.loading = 'lazy'; img.style.cssText = 'width:100%;height:auto;object-fit:cover';
          card.prepend(img);
        }
        target.append(card);
      });
    } catch (_) { /* Keep approved empty-state copy. */ }
  };
  fetch(SITE).then(r => { if (!r.ok) throw new Error('CMS content unavailable'); return r.json(); })
    .then(data => {
      const brand = data.brand || {}, home = data.home || {}, about = data.about || {};
      const services = data.services || {}, partnerships = data.partnerships || {}, contact = data.contact || {};
      updateEmail(brand.email || contact.email);
      const page = location.pathname.split('/').pop() || 'index.html';
      if (page === 'index.html') {
        setText('.hero-content h1', home.hero_title);
        setText('.hero-copy', home.hero_description);
        setText('.intro-grid h2', home.introduction_heading);
        setRichText('.intro-body .lead', home.introduction_text);
        setImage('.hero-image', home.hero_image);
        if (Array.isArray(services.items)) renderServices(services.items);
        setText('.partnerships-content h2', partnerships.heading);
        setRichText('.partnerships-content > p:not(.eyebrow)', partnerships.body);
      }
      if (page === 'about.html') {
        setText('.inner-hero-content h1', about.heading);
        setRichText('.inner-copy .lead', about.body);
        setImage('.inner-hero-image', about.image);
      }
      if (page === 'services.html') {
        setRichText('.inner-copy .lead', services.introduction);
        if (Array.isArray(services.items)) renderServices(services.items);
      }
      if (page === 'partnerships.html') {
        setText('.inner-copy h2', partnerships.heading);
        setRichText('.inner-copy .lead', partnerships.body);
        setImage('.inner-hero-image', partnerships.image);
      }
      if (page === 'contact.html') {
        setText('.contact-page-details > p', contact.introduction);
      }
    }).catch(() => {});
  renderProjects();
})();