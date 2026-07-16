// ============================================
// ADDS Bookkeeping Solutions Co. — Main JS
// ============================================

(function () {
  'use strict';

  // ── Navbar scroll effect ──────────────────
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ── Hamburger menu ────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Back to top button ────────────────────
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Smooth scroll for anchor links ────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ── Fade-up scroll animations ─────────────
  function addFadeUp() {
    const selectors = [
      '.service-card',
      '.why-card',
      '.about-card-main',
      '.contact-item',
      '.section-header',
      '.about-text',
      '.contact-form-wrapper',
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('fade-up');
      });
    });
  }

  function observeFadeUp() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  addFadeUp();
  observeFadeUp();

  // ── Stagger card animations ───────────────
  document.querySelectorAll('.services-grid .service-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
  document.querySelectorAll('.why-grid .why-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.07) + 's';
  });

  // ── Contact form handler ──────────────────
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#CC1F1F';
          valid = false;
        }
      });

      if (!valid) {
        const firstInvalid = form.querySelector('[required]:invalid, [style*="CC1F1F"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Email format check
      const emailField = form.querySelector('[type="email"]');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField && !emailPattern.test(emailField.value.trim())) {
        emailField.style.borderColor = '#CC1F1F';
        emailField.focus();
        return;
      }

      // Simulate send (replace with real backend / EmailJS / Formspree)
      const submitBtn = form.querySelector('[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      btnText.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.reset();
        successMsg.style.display = 'block';
        btnText.textContent = 'Send Message';
        submitBtn.disabled = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success after 6 seconds
        setTimeout(function () {
          successMsg.style.display = 'none';
        }, 6000);
      }, 1200);
    });

    // Clear red border on input
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }

  // ── Animated counter for hero stats ───────
  function animateCounter(el, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = el.textContent.replace(/[0-9]/g, '').replace('+', '').replace('%', '');
    const hasPct = el.textContent.includes('%');
    const hasPlus = el.textContent.includes('+');

    const timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(start) + (hasPct ? '%' : '') + (hasPlus ? '+' : '');
    }, 16);
  }

  const heroSection = document.querySelector('.hero');
  let countersStarted = false;

  if (heroSection) {
    const counterObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll('.stat-number').forEach(function (el) {
          const raw = el.textContent;
          const num = parseInt(raw.replace(/\D/g, ''), 10);
          if (!isNaN(num)) animateCounter(el, num, 1500);
        });
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });
    counterObserver.observe(heroSection);
  }

  // ── Active nav link on scroll ─────────────
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 20;
    sections.forEach(function (sec) {
      const link = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
      if (!link) return;
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-links a').forEach(function (a) {
          a.style.color = '';
        });
        link.style.color = 'var(--red)';
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
