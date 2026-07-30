/* ============================================
   VLearn Clone - Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Theme Toggle ---
  function initTheme() {
    const saved = localStorage.getItem('vlearn_app_theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
    syncThemeIcons();
  }

  function syncThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.icon-moon').forEach(function (el) {
      el.style.display = isDark ? 'none' : 'block';
    });
    document.querySelectorAll('.icon-sun').forEach(function (el) {
      el.style.display = isDark ? 'block' : 'none';
    });
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('vlearn_app_theme', isDark ? 'dark' : 'light');
    syncThemeIcons();
  }

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // --- Language Toggle (visual only) ---
  var langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = langToggle.textContent.trim();
      langToggle.textContent = current === 'VI' ? 'EN' : 'VI';
    });
  }

  // --- Active Nav Highlighting on Scroll ---
  function initScrollSpy() {
    var navLinks = document.querySelectorAll('.nav a');
    var sections = [];

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var section = document.querySelector(href);
        if (section) {
          sections.push({ el: section, link: link });
        }
      }
    });

    if (sections.length === 0) return;

    var ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.scrollY + 120;
          var activeLink = null;

          for (var i = sections.length - 1; i >= 0; i--) {
            if (sections[i].el.offsetTop <= scrollY) {
              activeLink = sections[i].link;
              break;
            }
          }

          navLinks.forEach(function (l) {
            l.classList.remove('active');
          });
          if (activeLink) {
            activeLink.classList.add('active');
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileNav = document.getElementById('mobile-nav');
    var closeBtn = document.getElementById('mobile-nav-close');

    if (!menuBtn || !mobileNav) return;

    function openMenu() {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openMenu);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close on backdrop click
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) {
        closeMenu();
      }
    });

    // Close on link click
    var mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Scroll Progress Bar Indicator ---
  function initScrollProgressBar() {
    var progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.width = '0%';
    progressBar.style.background = 'linear-gradient(90deg, #d6222f 0%, #124f8c 50%, #38bdf8 100%)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease-out';
    progressBar.style.boxShadow = '0 0 10px rgba(214, 34, 47, 0.6)';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // --- Animated Counter for Stats Banner ---
  function initCounterAnimation() {
    var statsSection = document.querySelector('.stats-banner');
    if (!statsSection || !('IntersectionObserver' in window)) return;

    var numElements = document.querySelectorAll('.stat-num');
    var animated = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          numElements.forEach(function (el) {
            var text = el.textContent.trim();
            var hasPlus = text.includes('+');
            var hasPercent = text.includes('%');
            var target = parseInt(text.replace(/[^0-9]/g, ''), 10);
            
            if (isNaN(target)) return;

            var count = 0;
            var duration = 1500;
            var stepTime = 30;
            var steps = duration / stepTime;
            var increment = target / steps;

            var timer = setInterval(function () {
              count += increment;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              var formatted = Math.floor(count).toLocaleString();
              if (hasPlus) formatted += '+';
              if (hasPercent) formatted += '%';
              if (text.includes('Ngày')) formatted += ' Ngày';
              if (text.includes('KC')) formatted += ' KC';
              if (text.includes('/')) formatted = text; // Keep 24/7 static
              el.textContent = formatted;
            }, stepTime);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // --- Animate Elements on Scroll (Intersection Observer) ---
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll(
      '.hero-copy, .hero-visual, .stat-item, .loop-card, .feature-card, .landing-course-card, .vision-grid, .instructor-grid, .insight-panel, .cta-section > .container'
    );

    if (!('IntersectionObserver' in window) || animatedElements.length === 0) return;

    // Add initial hidden state
    animatedElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(36px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = 0;
            var parent = entry.target.parentElement;
            if (parent) {
              var siblings = Array.from(parent.children);
              var index = siblings.indexOf(entry.target);
              delay = Math.min(index * 90, 400);
            }

            setTimeout(function () {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Progress Bar Animation ---
  function initProgressAnimation() {
    var progressBar = document.querySelector('.progress-track span');
    if (!progressBar || !('IntersectionObserver' in window)) return;

    progressBar.style.width = '0%';
    progressBar.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              progressBar.style.width = '68%';
            }, 300);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(progressBar.parentElement);
  }

  // --- Initialize ---
  initTheme();
  initScrollSpy();
  initMobileMenu();
  initSmoothScroll();
  initScrollProgressBar();
  initCounterAnimation();
  initScrollAnimations();
  initProgressAnimation();
})();
