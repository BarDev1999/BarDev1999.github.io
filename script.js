// Bootstrap form validation + UX
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
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

// הדגשת קישור פעיל בניווט בעת גלילה
(function activeNavOnScroll(){
  const links = document.querySelectorAll('.navbar .nav-link[href^="#"]');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const onScroll = () => {
    const pos = window.scrollY + 120;
    let current = sections[0].id;
    for (const sec of sections) if (pos >= sec.offsetTop) current = sec.id;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);
})();
