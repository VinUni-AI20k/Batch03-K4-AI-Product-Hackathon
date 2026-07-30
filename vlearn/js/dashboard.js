(function () {
  'use strict';

  // --- Dynamic Greeting ---
  var greetingEl = document.getElementById('greeting-text');
  if (greetingEl) {
    var hour = new Date().getHours();
    var greeting = 'Xin chào,';
    if (hour >= 5 && hour < 12) greeting = 'Chào buổi sáng,';
    else if (hour >= 12 && hour < 18) greeting = 'Chào buổi chiều,';
    else greeting = 'Chào buổi tối,';
    greetingEl.textContent = greeting;
  }

  // --- Count Up Animation ---
  var countEls = document.querySelectorAll('.count-up');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    var duration = 1200;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  // Observe count-up elements
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(function (el) {
      countObserver.observe(el);
    });
  } else {
    countEls.forEach(animateCount);
  }

  // --- Course Progress Bar Animation ---
  var progressFills = document.querySelectorAll('.course-progress-fill');
  if ('IntersectionObserver' in window) {
    var progObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var width = target.getAttribute('data-width');
          setTimeout(function () {
            target.style.width = width + '%';
            target.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
          }, 400);
          progObserver.unobserve(target);
        }
      });
    }, { threshold: 0.3 });

    progressFills.forEach(function (el) {
      progObserver.observe(el);
    });
  }

  // --- Sidebar Mobile Toggle ---
  var sidebarToggle = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('sidebar');
  var sidebarOverlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', openSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

})();
