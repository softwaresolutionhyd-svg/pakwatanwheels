document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('header');

  // ─── Sticky Header ───
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── Mobile Nav ───
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  navToggle?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      navToggle?.classList.remove('active');
    });
  });

  // ─── Active Nav Link ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // ─── Staggered Scroll Reveal ───
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach((el, i) => {
    if (!el.dataset.delay) {
      const parent = el.closest('.features-grid, .services-grid, .routes-grid, .cars-grid');
      if (parent) el.dataset.delay = i % 4 * 100;
    }
    revealObserver.observe(el);
  });

  // ─── Hero Parallax Orbs ───
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translateY(${scroll * (0.08 + i * 0.04)}px)`;
    });
  }, { passive: true });

  // ─── FAQ Accordion ───
  document.addEventListener('click', e => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('active');
      faq.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  // ─── Booking Form → WhatsApp ───
  const bookingForm = document.getElementById('booking-form');
  bookingForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = bookingForm.querySelector('[type="submit"]');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 200);

    const fd = new FormData(bookingForm);
    const msg = [
      '🚗 *Pak Watan Wheels — Booking Request*',
      '',
      `Name: ${fd.get('name')}`,
      `Mobile: ${fd.get('mobile')}`,
      `CNIC: ${fd.get('cnic')}`,
      `Car: ${fd.get('car')}`,
      `Date: ${fd.get('date')}`,
      `Time: ${fd.get('time')}`,
      `City: ${fd.get('city') || 'Lahore'}`
    ].join('\n');

    window.open(`https://wa.me/923046666838?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let counted = false;

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach((counter, i) => {
          setTimeout(() => {
            const target = +counter.dataset.target;
            const duration = 2200;
            const start = performance.now();

            const tick = now => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 4);
              counter.childNodes[0].textContent = Math.floor(eased * target).toLocaleString();
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }, i * 150);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) counterObserver.observe(statsSection);

  // ─── Button Ripple ───
  document.querySelectorAll('.btn, .car-book-btn, .filter-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);
        width:10px;height:10px;pointer-events:none;
        left:${e.clientX - rect.left - 5}px;top:${e.clientY - rect.top - 5}px;
        animation:ripple 0.6s ease-out forwards;
      `;
      if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { width:200px;height:200px;opacity:0;margin-left:-95px;margin-top:-95px; } }`;
  document.head.appendChild(style);

});
