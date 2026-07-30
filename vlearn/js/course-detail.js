function toggleDay(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.classList.toggle('open');
  }
}

// Start Reading button handler
document.addEventListener('DOMContentLoaded', function() {
  const btnStart = document.getElementById('btn-start-reading');
  if (btnStart) {
    btnStart.addEventListener('click', function() {
      window.location.href = 'slide-viewer.html';
    });
  }

  // Mobile Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (sidebarToggle && sidebar && overlay) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('open');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
});
