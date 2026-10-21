(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
  }

  // Progressive scroll reveal. Content is visible unless the observer is successfully installed.
  // If anything fails, a failsafe reveals every target so the page can never stay blank.
  try {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canObserve = 'IntersectionObserver' in window;
    if (!reduceMotion && canObserve) {
      const revealSelector = [
        '.hero-copy', '.hero-visual', '.investment-image', '.investment-copy',
        '.section-heading', '.service-card', '.gallery-item', '.process-heading',
        '.process-step', '.review-card', '.contact-copy', '.contact-panel'
      ].join(',');
      const revealTargets = [...document.querySelectorAll(revealSelector)];
      if (revealTargets.length) {
        revealTargets.forEach((element, index) => {
          element.classList.add('reveal-on-scroll');
          // A small stagger adds rhythm without delaying content for long.
          element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 65}ms`);
        });
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { root: null, rootMargin: '0px 0px -7% 0px', threshold: 0.04 });
        revealTargets.forEach(element => revealObserver.observe(element));
        // Only now activate hidden-before-reveal styling: the observer is already listening.
        document.documentElement.classList.add('reveal-motion-enabled');
        // Fail-safe for unusual browsers, layout shifts, or observer delivery issues.
        window.setTimeout(() => {
          revealTargets.forEach(element => element.classList.add('is-revealed'));
          revealObserver.disconnect();
        }, 3200);
      }
    }
  } catch (error) {
    // Intentionally fail open: remove reveal state and keep all content visible.
    document.documentElement.classList.remove('reveal-motion-enabled');
    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
      element.classList.remove('reveal-on-scroll');
      element.classList.add('is-revealed');
    });
  }

  // Gallery category controls.
  const filterButtons = [...document.querySelectorAll('.filter-chip')];
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(candidate => {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      galleryItems.forEach(item => {
        const visible = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !visible);
        if (visible) item.classList.add('is-visible');
      });
    });
  });

  // Accessible image lightbox.
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
  const closeLightbox = () => {
    if (lightbox?.open) lightbox.close();
  };
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = item.dataset.full || item.querySelector('img')?.src || '';
      lightboxImage.alt = item.dataset.alt || item.querySelector('img')?.alt || 'Detailing photo';
      if (lightboxCaption) lightboxCaption.textContent = item.querySelector('.gallery-overlay b')?.textContent || '';
      lightbox.showModal();
    });
  });
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  lightbox?.addEventListener('close', () => { if (lightboxImage) lightboxImage.src = ''; });

  // Service links preselect the matching request form option.
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.querySelector('#service');
      if (select) {
        const requested = link.dataset.service;
        const options = [...select.options];
        const match = options.find(option => option.textContent.trim() === requested);
        if (match) select.value = match.value;
        else if (requested === 'Specialty or engine detailing') select.value = 'Specialty or engine detailing';
      }
    });
  });

  // Keep the form privacy-friendly: create a prefilled SMS, rather than sending to a server.
  const detailForm = document.querySelector('#detail-form');
  const feedback = document.querySelector('#form-feedback');
  detailForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!detailForm.reportValidity()) return;
    const data = new FormData(detailForm);
    const name = String(data.get('name') || '').trim();
    const vehicle = String(data.get('vehicle') || '').trim();
    const service = String(data.get('service') || '').trim();
    const details = String(data.get('details') || '').trim();
    const lines = [
      'Hi Cali Performance Detailing, I would like to ask about a detail.',
      `Name: ${name}`,
      `Vehicle: ${vehicle}`,
      `Service: ${service}`
    ];
    if (details) lines.push(`Details: ${details}`);
    const smsUrl = `sms:+14088295249?body=${encodeURIComponent(lines.join('\n'))}`;
    if (feedback) feedback.textContent = 'Opening your messaging app with the request filled in…';
    window.location.href = smsUrl;
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
