// ===== Contact form: Bootstrap validation UX =====
(() => {
  'use strict';
  document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus({ preventScroll: true });
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// ===== Active nav link on scroll (IntersectionObserver) =====
(() => {
  const links = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
  const map = new Map();
  links.forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;

  const setActive = (link) => {
    links.forEach((a) => {
      const on = a === link;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(map.get(entry.target));
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  map.forEach((_, sec) => observer.observe(sec));
})();

// ===== Mobile menu: auto-close after choosing a link =====
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });
})();

// ===== Theme toggle (light / dark) =====
(() => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const icon = btn.querySelector('i');

  const sync = (theme) => {
    if (icon) icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  sync(root.getAttribute('data-bs-theme') || 'light');

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    sync(next);
  });
})();

// ===== Footer year =====
(() => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
