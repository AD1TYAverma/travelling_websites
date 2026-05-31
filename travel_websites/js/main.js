/* ============================================================
   WANDERLUST — Main JavaScript
   ============================================================ */

'use strict';

/* ── Theme ─────────────────────────────────────────────────── */
const ThemeManager = (() => {
  const KEY = 'wl-theme';
  const html = document.documentElement;

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    const pref = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(pref);

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        apply(current === 'dark' ? 'light' : 'dark');
      });
    });
  }

  return { init };
})();

/* ── Loader ────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1200);
  });
}

/* ── Navbar scroll ─────────────────────────────────────────── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
  const links = document.querySelectorAll('.nav-link[data-page]');
  const page = document.body.dataset.page;
  links.forEach(l => l.classList.toggle('active', l.dataset.page === page));
}

/* ── Scroll Reveal ─────────────────────────────────────────── */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => io.observe(t));
}

/* ── Hero word animation ───────────────────────────────────── */
function initHeroWords() {
  const el = document.querySelector('.hero-title');
  if (!el) return;
  const words = el.querySelectorAll('.word');
  words.forEach((w, i) => {
    w.style.animationDelay = `${0.3 + i * 0.12}s`;
  });
}

/* ── Counter animation ─────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ── Filter pills ──────────────────────────────────────────── */
function initFilters() {
  const pillGroups = document.querySelectorAll('[data-filter-group]');
  pillGroups.forEach(group => {
    const pills = group.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.dataset.filter;
        filterCards(filter);
      });
    });
  });
}

function filterCards(filter) {
  const cards = document.querySelectorAll('[data-category]');
  cards.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    if (show) {
      card.style.opacity = '1';
      card.style.transform = '';
      card.closest('.col')?.style.setProperty('display', '');
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (card.style.opacity === '0') {
          card.closest('.col')?.style.setProperty('display', 'none');
        }
      }, 300);
    }
  });
}

/* ── Gallery lightbox ──────────────────────────────────────── */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!items.length || !lightbox) return;

  const img = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (!src) return;
      img.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ── Sticky CTA ────────────────────────────────────────────── */
function initStickyCTA() {
  const cta = document.querySelector('.sticky-cta');
  if (!cta) return;
  window.addEventListener('scroll', () => {
    cta.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
}

/* ── Smooth scroll for anchor links ───────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Newsletter form ───────────────────────────────────────── */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (!input?.value) return;

      const original = btn.textContent;
      btn.textContent = 'Subscribed! ✓';
      btn.disabled = true;
      btn.style.background = '#22c55e';
      input.value = '';

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    });
  });
}

/* ── Contact form ──────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent! ✓';
    btn.disabled = true;
    btn.style.background = '#22c55e';
    btn.style.borderColor = '#22c55e';
    form.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 4000);
  });
}

/* ── Booking form ──────────────────────────────────────────── */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Date min = today
  const dateInputs = form.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(d => d.min = today);

  // Guest count update
  const adultsInput = form.querySelector('#adults');
  const childrenInput = form.querySelector('#children');
  const totalEl = form.querySelector('#guestTotal');

  function updateTotal() {
    if (!totalEl) return;
    const a = parseInt(adultsInput?.value) || 0;
    const c = parseInt(childrenInput?.value) || 0;
    totalEl.textContent = a + c;
  }
  adultsInput?.addEventListener('change', updateTotal);
  childrenInput?.addEventListener('change', updateTotal);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Booking Confirmed! ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 4000);
  });
}

/* ── Parallax hero ─────────────────────────────────────────── */
function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroImg.style.transform = `translateY(${y * 0.3}px) scale(1.05)`;
    }
  }, { passive: true });
}

/* ── Mobile nav toggler custom icon ───────────────────────── */
function initMobileNav() {
  const toggler = document.querySelector('.navbar-toggler');
  const icon = toggler?.querySelector('.navbar-toggler-icon');
  if (!icon) return;

  // Replace with hamburger spans
  icon.innerHTML = `<span style="display:block;width:100%;height:2px;background:var(--text-primary);border-radius:2px;transition:all 0.3s"></span>
    <span style="display:block;width:75%;height:2px;background:var(--text-primary);border-radius:2px;transition:all 0.3s"></span>
    <span style="display:block;width:100%;height:2px;background:var(--text-primary);border-radius:2px;transition:all 0.3s"></span>`;
}

/* ── Init all ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initLoader();
  initNavbar();
  initReveal();
  initHeroWords();
  initCounters();
  initFilters();
  initGallery();
  initStickyCTA();
  initSmoothScroll();
  initNewsletter();
  initContactForm();
  initBookingForm();
  initParallax();
  initMobileNav();
});