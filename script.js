/*
  SRI Company & Collaboration Pte. Ltd. scripts
  Replace logo at assets/logo.png. Adjust brand colors in styles.css variables.
*/

// Helpers
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// Current year in footer
qs('#year').textContent = new Date().getFullYear();

// Navbar shrink and active link handling
const nav = qs('#primaryNav');
const setNavScrolled = () => {
  if (window.scrollY > 24) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
setNavScrolled();
window.addEventListener('scroll', setNavScrolled, { passive: true });

// Smooth scroll for internal links (native behavior supported by data attribute; here ensure older browsers)
qsa('a.nav-link[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = qs(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// IntersectionObserver for active nav
const sections = qsa('section, header.hero');
const navLinks = new Map(qsa('#primaryNav .nav-link').map((a) => [a.getAttribute('href'), a]));
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = '#' + (entry.target.id || 'home');
      const active = navLinks.get(id);
      if (!active) return;
      qsa('#primaryNav .nav-link').forEach((a) => a.classList.remove('active'));
      active.classList.add('active');
    });
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
);
sections.forEach((s) => io.observe(s));

// Form validation (Bootstrap)
(() => {
  const forms = qsa('.needs-validation');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
})();

// Counters
const animateCounters = () => {
  qsa('[data-counter]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const start = 0;
    const duration = 1.2;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(target);
      return;
    }
    if (window.gsap) {
      gsap.fromTo(
        el,
        { innerText: start },
        {
          innerText: target,
          duration,
          ease: 'power2.out',
          snap: { innerText: 1 },
        }
      );
    } else {
      el.textContent = String(target);
    }
  });
};

// GSAP Animations
window.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduce) {
    animateCounters();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero title animation: tracking to normal, fade up
  const title = qs('#heroTitle');
  const sub = qs('#heroSub');
  gsap.set([title, sub], { opacity: 0, y: 20 });
  gsap.to(title, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.1 });
  gsap.fromTo(
    title,
    { letterSpacing: '0.12em' },
    { letterSpacing: 'normal', duration: 1.2, ease: 'power2.out', delay: 0.1 }
  );
  gsap.to(sub, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.25 });

  // Background parallax
  const hero = qs('.hero');
  gsap.to(hero, {
    backgroundPosition: '50% 60%',
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  const heroVisual = qs('.hero-visual img');
  if (heroVisual) {
    gsap.fromTo(
      heroVisual,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.15 }
    );
    gsap.to(heroVisual, {
      y: -30,
      scrollTrigger: { trigger: hero, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  // Entrance animations per section
  qsa('section').forEach((section) => {
    const items = qsa('h2, h3, .glassy-card, .service-card, .feature-mini, .chip, .metric-card, p, ul', section);
    gsap.from(items, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  });

  // Counters when intro enters
  ScrollTrigger.create({
    trigger: '#intro',
    start: 'top 70%',
    once: true,
    onEnter: animateCounters,
  });
});

