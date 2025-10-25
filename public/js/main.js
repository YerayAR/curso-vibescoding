(() => {
  const SELECTORS = {
    navToggle: '[data-js="nav-toggle"]',
    navLinks: '[data-js="nav-links"]',
    themeToggle: '[data-js="theme-toggle"]',
    programChips: '[data-js="program-chip"]'
  };

  const STORAGE_KEYS = {
    THEME: 'curso-vibescoding-theme'
  };

  const state = {
    theme: 'dark'
  };

  const dom = {
    get(selector) {
      return document.querySelector(selector);
    },
    getAll(selector) {
      return Array.from(document.querySelectorAll(selector));
    }
  };

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('No se pudo leer localStorage', error);
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('No se pudo guardar localStorage', error);
      }
    }
  };

  const Theme = {
    init() {
      const saved = storage.get(STORAGE_KEYS.THEME);
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved || (prefersDark ? 'dark' : 'light');
      this.apply(initial);

      const toggleButton = dom.get(SELECTORS.themeToggle);
      if (!toggleButton) return;

      toggleButton.addEventListener('click', () => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        this.apply(nextTheme);
      });
    },

    apply(mode) {
      state.theme = mode;
      document.documentElement.setAttribute('data-theme', mode);
      storage.set(STORAGE_KEYS.THEME, mode);
      this.updateButton();
    },

    updateButton() {
      const button = dom.get(SELECTORS.themeToggle);
      if (!button) return;

      const icon = button.querySelector('.nav__theme-icon');
      const text = button.querySelector('.nav__theme-text');
      const isDark = state.theme === 'dark';

      button.setAttribute('aria-pressed', String(isDark));
      if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
      }
      if (text) {
        text.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
      }
    }
  };

  const Navigation = {
    init() {
      this.toggleButton = dom.get(SELECTORS.navToggle);
      this.menu = dom.get(SELECTORS.navLinks);

      if (!this.toggleButton || !this.menu) return;

      this.toggleButton.addEventListener('click', () => this.toggle());
      this.menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
          this.close();
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.close();
        }
      });
    },

    toggle() {
      const isOpen = this.menu.classList.toggle('is-open');
      this.toggleButton.setAttribute('aria-expanded', String(isOpen));
    },

    close() {
      if (!this.menu || !this.toggleButton) return;
      this.menu.classList.remove('is-open');
      this.toggleButton.setAttribute('aria-expanded', 'false');
    }
  };

  const ProgramFilter = {
    init() {
      this.chips = dom.getAll(SELECTORS.programChips);
      this.cards = dom.getAll('.module-card');
      if (!this.chips.length || !this.cards.length) return;

      this.chips.forEach((chip) => {
        chip.addEventListener('click', () => {
          this.setActive(chip);
          this.applyFilter(chip.dataset.filter || 'all');
        });
      });

      // Estado inicial
      this.setActive(this.chips[0]);
      this.applyFilter('all');
    },

    setActive(targetChip) {
      this.chips.forEach((chip) => {
        chip.classList.toggle('is-active', chip === targetChip);
        chip.setAttribute('aria-pressed', chip === targetChip ? 'true' : 'false');
      });
    },

    applyFilter(filter) {
      this.cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.phase === filter;
        card.hidden = !matches;
      });
    }
  };

  const SmoothScroll = {
    init() {
      this.links = dom.getAll('a[href^="#"]');
      if (!this.links.length) return;

      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.links.forEach((link) => {
        link.addEventListener('click', (event) => {
          const hash = link.getAttribute('href');
          if (!hash || hash === '#') return;
          const target = document.querySelector(hash);
          if (!target) return;

          event.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        });
      });
    }
  };

  const ScrollReveal = {
    init() {
      const elements = dom.getAll('.feature-card, .module-card, .resource-grid article, .stats article');
      if (!elements.length || !('IntersectionObserver' in window)) return;

      elements.forEach((el) => el.setAttribute('data-reveal', ''));

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      elements.forEach((el) => observer.observe(el));
    }
  };

  const ParallaxEffect = {
    init() {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      this.hero = dom.get('.hero__media');
      if (!this.hero) return;

      let ticking = false;
      
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.update();
            ticking = false;
          });
          ticking = true;
        }
      });
    },

    update() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      
      if (this.hero) {
        this.hero.style.transform = `translateY(${rate}px)`;
      }
    }
  };

  function init() {
    Theme.init();
    Navigation.init();
    ProgramFilter.init();
    SmoothScroll.init();
    ScrollReveal.init();
    ParallaxEffect.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

