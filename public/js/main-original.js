(function () {
  "use strict";

  const toggleButton = document.querySelector('[data-js="navbar-toggle"]');
  const navLinks = document.querySelector('[data-js="navbar-links"]');
  const modeToggle = document.querySelector('[data-js="mode-toggle"]');

  function toggleMenu() {
    if (!navLinks) {
      return;
    }
    const isVisible = navLinks.classList.toggle('navbar__links--visible');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', String(isVisible));
    }
  }

  function setupSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        const targetId = anchor.getAttribute('href');
        if (!targetId) {
          return;
        }
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function setupModeToggle() {
    if (!modeToggle) {
      return;
    }
    modeToggle.addEventListener('click', function () {
      // TODO: implementar alternancia real de modo oscuro usando localStorage
      const storedMode = window.localStorage.getItem('preferred-mode') || 'light';
      const nextMode = storedMode === 'light' ? 'dark' : 'light';
      window.localStorage.setItem('preferred-mode', nextMode);
      console.info('Modo alternado (placeholder):', nextMode);
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleMenu);
  }

  setupSmoothScroll();
  setupModeToggle();
})();
