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

// ===== Tabs: shared by the skills finder, the job card, the work section and the case studies =====
const siteTabs = (() => {
  const ROOT = '[data-tabs],[data-walkthrough]';
  const ownTabs = (root) => Array.from(root.querySelectorAll('[role="tab"]')).filter((t) => t.closest(ROOT) === root);
  const panelOf = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

  const activate = (tab, focus) => {
    const root = tab.closest(ROOT);
    ownTabs(root).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = panelOf(t);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    root.dispatchEvent(new CustomEvent('tabs:change', { bubbles: true }));
  };

  document.querySelectorAll(ROOT).forEach((root) => {
    const tabs = ownTabs(root);
    if (!tabs.length) return;
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab, false));
      tab.addEventListener('keydown', (e) => {
        const moves = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in moves)) return;
        e.preventDefault();
        activate(tabs[(moves[e.key] + tabs.length) % tabs.length], true);
      });
    });
    activate(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false);
  });
  document.documentElement.classList.add('tabs-ready');

  return { activate };
})();

// ===== Links into tabs: open the right tab, then scroll to it =====
(() => {
  const ALIAS = { about: 'find', 'seed-labs': 'labs' };
  const resolve = (id) => document.getElementById(ALIAS[id] || id);
  const insideTabs = (target) => !!target.closest('[role="tabpanel"]');

  const reveal = (target, instant) => {
    const chain = [];
    for (let n = target; n; n = n.parentElement) {
      if (n.getAttribute && n.getAttribute('role') === 'tabpanel') chain.unshift(n);
    }
    chain.forEach((panel) => {
      const tab = document.querySelector(`[role="tab"][aria-controls="${panel.id}"]`);
      if (tab) siteTabs.activate(tab, false);
    });
    const details = target.closest('details');
    if (details) details.open = true;

    const isPanel = target.getAttribute('role') === 'tabpanel';
    const anchor = isPanel ? (target.closest('[data-scroll-anchor]') || target) : target;
    anchor.scrollIntoView(instant ? { behavior: 'instant', block: 'start' } : { block: 'start' });

    if (!isPanel) {
      target.classList.add('is-target');
      window.setTimeout(() => target.classList.remove('is-target'), 1800);
    }
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.classList.contains('skip-link')) return;
    const id = link.getAttribute('href').slice(1);
    const target = id && resolve(id);
    if (!target || !(insideTabs(target) || ALIAS[id])) return;
    e.preventDefault();
    window.history.pushState(null, '', `#${id}`);
    reveal(target, false);
  });

  const fromHash = (instant) => {
    const id = window.location.hash.slice(1);
    const target = id && resolve(id);
    if (target && (insideTabs(target) || ALIAS[id])) reveal(target, instant);
  };
  window.addEventListener('hashchange', () => fromHash(false));
  fromHash(true);
  window.addEventListener('load', () => fromHash(true), { once: true });
})();

// ===== Skills finder: type a skill, get the area and the proof =====
(() => {
  const input = document.getElementById('skill-search');
  if (!input) return;
  const box = document.getElementById('skill-results');
  const entries = [];

  document.querySelectorAll('#find [role="tabpanel"]').forEach((panel) => {
    const tab = document.querySelector(`[role="tab"][aria-controls="${panel.id}"]`);
    const area = panel.dataset.area;
    entries.push({ name: area, note: 'Area', terms: `${area} ${panel.dataset.aliases || ''}`.toLowerCase(), tab, panel, chip: null });
    panel.querySelectorAll('[data-skill]').forEach((chip) => {
      const group = chip.closest('.skill-group').querySelector('h4').textContent;
      entries.push({ name: chip.textContent, note: `${area}, ${group.toLowerCase()}`, terms: `${chip.textContent} ${chip.dataset.aliases || ''}`.toLowerCase(), tab, panel, chip });
    });
  });

  let hits = [];
  const clear = () => { hits = []; box.replaceChildren(); };

  const open = (entry) => {
    siteTabs.activate(entry.tab, false);
    clear();
    input.value = '';
    entry.panel.closest('[data-scroll-anchor]').scrollIntoView({ block: 'start' });
    if (entry.chip) {
      entry.chip.classList.add('is-hit');
      window.setTimeout(() => entry.chip.classList.remove('is-hit'), 2400);
    }
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { clear(); return; }
    hits = entries
      .filter((e) => e.terms.includes(q))
      .sort((a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q)))
      .slice(0, 6);

    if (!hits.length) {
      const none = document.createElement('p');
      none.className = 'finder-none';
      none.append('Not listed here. ');
      const ask = document.createElement('a');
      ask.href = '#contact';
      ask.textContent = 'Ask me directly';
      none.append(ask, ', I will give you a straight answer.');
      box.replaceChildren(none);
      return;
    }
    box.replaceChildren(...hits.map((entry) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'finder-hit';
      const name = document.createElement('strong');
      name.textContent = entry.name;
      const note = document.createElement('small');
      note.textContent = entry.note;
      btn.append(name, note);
      btn.addEventListener('click', () => open(entry));
      return btn;
    }));
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (hits[0]) open(hits[0]);
    }
    if (e.key === 'Escape') clear();
  });
  document.querySelectorAll('[data-try]').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.try;
      render();
      input.focus();
    });
  });
})();

// ===== Active nav link on scroll =====
(() => {
  const links = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('main > header[id], main > section[id]'));
  if (!links.length || !sections.length) return;

  let current = null;
  const paint = () => {
    if (!current) return;
    let id = current.id;
    if (id === 'work') {
      const selected = current.querySelector('.tab-list-lg [aria-selected="true"]');
      if (selected) id = selected.getAttribute('aria-controls');
    }
    links.forEach((a) => {
      const on = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        current = entry.target;
        paint();
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((sec) => observer.observe(sec));
  document.addEventListener('tabs:change', paint);
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
