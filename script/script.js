/* =========================================================
   Kick & Color — Landing Page Script
   Vanilla JS only. Handles:
     1. Mobile nav toggle
     2. Smooth scroll + active link highlighting
     3. Scroll reveal animations
     4. "Back to top" button
     5. Footer year
   ========================================================= */

(function () {
  'use strict';

  // ---------- 1. Mobile navigation ----------
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.querySelector('.primary-nav');
  const navLinks  = document.querySelectorAll('.nav-list a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click (mobile)
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- 2. Smooth scroll for anchor links ----------
  // Native CSS smooth scroll handles most of this; we adjust offset for sticky header
  const HEADER_OFFSET = 78;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- 3. Active section highlight ----------
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const linkMap  = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) linkMap.set(href.slice(1), link);
  });

  function setActiveLink() {
    const scrollY = window.scrollY + HEADER_OFFSET + 80;
    let currentId = '';
    for (const section of sections) {
      if (section.offsetTop <= scrollY) currentId = section.id;
    }
    navLinks.forEach((l) => l.classList.remove('active'));
    if (currentId && linkMap.has(currentId)) linkMap.get(currentId).classList.add('active');
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ---------- 4. Scroll reveal (IntersectionObserver) ----------
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('in'));
  }

  // ---------- 5. Back-to-top button ----------
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 600) toTop.classList.add('visible');
        else toTop.classList.remove('visible');
      },
      { passive: true }
    );
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- 6. Subtle button click ripple ----------
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      btn.style.transform = 'scale(0.97)';
      setTimeout(() => { btn.style.transform = ''; }, 140);
    });
  });

  // ---------- 7. Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
