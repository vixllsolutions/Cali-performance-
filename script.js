(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  // Mobile navigation: simple in-flow dropdown, never a fixed-width side panel.
  const menuButton = doc.querySelector('.menu-toggle');
  const nav = doc.querySelector('#site-nav');
  const mobileQuery = window.matchMedia('(max-width: 760px)');

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open && mobileQuery.matches);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    doc.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    const onBreakpointChange = () => { closeMenu(); };
    if (typeof mobileQuery.addEventListener === 'function') mobileQuery.addEventListener('change', onBreakpointChange);
    else if (typeof mobileQuery.addListener === 'function') mobileQuery.addListener(onBreakpointChange);
  }

  // Progressive scroll reveal. Content is visible by default. We only apply hidden
  // start states after IntersectionObserver is ready, and fail open on any error.
  const revealTargets = [...doc.querySelectorAll('[data-reveal]')];
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (revealTargets.length && !reduceMotion && 'IntersectionObserver' in window) {
    let observer;
    try {
      observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            activeObserver.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.06 });

      // Observe targets before activating the reveal CSS; avoids a blank page if
      // initialization or observer setup fails in older mobile browsers.
      revealTargets.forEach((element, index) => {
        element.style.setProperty('--reveal-order', String(index % 4));
        observer.observe(element);
      });
      requestAnimationFrame(() => root.classList.add('reveal-ready'));

      // Safety net: if the browser never reports an intersection, restore visibility.
      window.setTimeout(() => {
        revealTargets.forEach(element => element.classList.add('is-revealed'));
        root.classList.remove('reveal-ready');
        if (observer) observer.disconnect();
      }, 2800);
    } catch (error) {
      root.classList.remove('reveal-ready');
      revealTargets.forEach(element => element.classList.add('is-revealed'));
      if (observer) observer.disconnect();
    }
  } else {
    revealTargets.forEach(element => element.classList.add('is-revealed'));
  }

  // Gallery filters.
  const filterButtons = [...doc.querySelectorAll('.filter-chip')];
  const galleryItems = [...doc.querySelectorAll('.gallery-item')];
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedFilter = button.dataset.filter || 'all';
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      galleryItems.forEach(item => {
        const show = selectedFilter === 'all' || item.dataset.category === selectedFilter;
        item.classList.toggle('is-filtered-out', !show);
      });
    });
  });

  // Lightweight accessible lightbox using a normal element, so unsupported dialog
  // implementations cannot break gallery interactions.
  const modal = doc.querySelector('#photo-modal');
  const modalImage = modal?.querySelector('img');
  const modalCaption = modal?.querySelector('figcaption');
  const modalClose = modal?.querySelector('.modal-close');
  let previousFocus = null;

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    if (modalImage) { modalImage.src = ''; modalImage.alt = ''; }
    if (modalCaption) modalCaption.textContent = '';
    previousFocus?.focus?.();
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!modal || !modalImage) return;
      const image = item.querySelector('img');
      const source = item.dataset.full || image?.getAttribute('src') || '';
      if (!source) return;
      previousFocus = item;
      modalImage.src = source;
      modalImage.alt = image?.alt || 'Detailing photo';
      if (modalCaption) modalCaption.textContent = item.dataset.caption || image?.alt || '';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      body.classList.add('modal-open');
      modalClose?.focus();
    });
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab' && modal?.classList.contains('is-open')) {
      // Keep keyboard focus inside the photo modal.
      const focusable = [modalClose].filter(Boolean);
      if (focusable.length && event.shiftKey && doc.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[0].focus();
      }
    }
  });

  // Selecting a service carries the visitor's choice into the enquiry form.
  doc.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const select = doc.querySelector('#service');
      if (!select) return;
      const wanted = link.dataset.service || '';
      const option = [...select.options].find(item => item.textContent.trim() === wanted);
      select.value = option ? option.value : wanted;
    });
  });

  // The form drafts an SMS; it does not send or store personal information.
  const form = doc.querySelector('#detail-form');
  const feedback = doc.querySelector('#form-feedback');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get('name') || '').trim();
    const vehicle = String(values.get('vehicle') || '').trim();
    const service = String(values.get('service') || '').trim();
    const details = String(values.get('details') || '').trim();
    const lines = [
      'Hi Cali Performance Detailing, I would like to ask about a detail.',
      `Name: ${name}`,
      `Vehicle: ${vehicle}`,
      `Service: ${service}`
    ];
    if (details) lines.push(`Details: ${details}`);
    const separator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? '&' : '?';
    const smsUrl = `sms:+14088295249${separator}body=${encodeURIComponent(lines.join('\n'))}`;
    if (feedback) feedback.textContent = 'Opening your messaging app with the request filled in…';
    window.location.href = smsUrl;
  });

  const year = doc.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
