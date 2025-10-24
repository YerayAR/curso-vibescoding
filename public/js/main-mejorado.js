/**
 * CATÁLOGO Y ALQUILER - SCRIPT PRINCIPAL
 * Curso Vibescoding - Desarrollo Web con IA
 * 
 * Este archivo maneja toda la interactividad del sitio:
 * - Navegación responsive (menú hamburguesa)
 * - Scroll suave en enlaces internos
 * - Modo oscuro/claro con persistencia
 * - Validación básica de formularios
 * - Animaciones al scroll (opcional)
 * 
 * Principios aplicados:
 * - Sin dependencias externas (JavaScript vanilla)
 * - Patrón de módulo (IIFE) para evitar contaminación global
 * - Progresive Enhancement: funciona sin JavaScript
 * - Accesibilidad: manejo de atributos ARIA
 */

(function() {
  'use strict'; // Modo estricto: previene errores comunes

  /* ==========================================================================
     CONSTANTES Y CONFIGURACIÓN
     ========================================================================== */
  
  const CONFIG = {
    // Claves para localStorage
    STORAGE_KEYS: {
      THEME: 'preferred-theme', // Almacena: 'light' o 'dark'
      MENU_STATE: 'menu-state'   // Estado del menú (opcional)
    },
    
    // Selectores CSS para elementos del DOM
    SELECTORS: {
      NAVBAR_TOGGLE: '[data-js="navbar-toggle"]',
      NAVBAR_LINKS: '[data-js="navbar-links"]',
      MODE_TOGGLE: '[data-js="mode-toggle"]',
      CONTACT_FORM: '[data-js="contact-form"]',
      INTERNAL_LINKS: 'a[href^="#"]', // Enlaces que empiezan con #
    },
    
    // Clases CSS para estados
    CLASSES: {
      MENU_VISIBLE: 'navbar__links--visible',
      DARK_THEME: 'dark',
      ANIMATE_IN: 'animate-in'
    },
    
    // Configuración de animaciones
    ANIMATION: {
      SCROLL_DURATION: 800, // ms
      INTERSECTION_THRESHOLD: 0.1 // 10% visible para activar animación
    }
  };

  /* ==========================================================================
     UTILIDADES GENERALES
     Funciones helper reutilizables
     ========================================================================== */

  /**
   * Obtiene un elemento del DOM de forma segura
   * @param {string} selector - Selector CSS del elemento
   * @returns {Element|null} - Elemento encontrado o null
   */
  function getElement(selector) {
    return document.querySelector(selector);
  }

  /**
   * Obtiene múltiples elementos del DOM
   * @param {string} selector - Selector CSS de los elementos
   * @returns {NodeList} - Lista de elementos encontrados
   */
  function getAllElements(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Guarda un valor en localStorage de forma segura
   * @param {string} key - Clave del almacenamiento
   * @param {string} value - Valor a guardar
   */
  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('No se pudo guardar en localStorage:', error);
    }
  }

  /**
   * Recupera un valor de localStorage de forma segura
   * @param {string} key - Clave del almacenamiento
   * @param {string} defaultValue - Valor por defecto si no existe
   * @returns {string} - Valor recuperado o valor por defecto
   */
  function getFromStorage(key, defaultValue = '') {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.warn('No se pudo leer de localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Registra un evento de forma segura con manejo de errores
   * @param {Element} element - Elemento al que agregar el listener
   * @param {string} event - Tipo de evento ('click', 'submit', etc.)
   * @param {Function} handler - Función manejadora del evento
   */
  function addEventListenerSafe(element, event, handler) {
    if (!element) {
      console.warn(`Elemento no encontrado para el evento ${event}`);
      return;
    }
    element.addEventListener(event, handler);
  }

  /* ==========================================================================
     MÓDULO: NAVEGACIÓN
     Maneja el menú responsive y la navegación principal
     ========================================================================== */

  const Navigation = {
    /**
     * Inicializa el módulo de navegación
     */
    init() {
      this.toggleButton = getElement(CONFIG.SELECTORS.NAVBAR_TOGGLE);
      this.navLinks = getElement(CONFIG.SELECTORS.NAVBAR_LINKS);
      
      // Si no existen los elementos, salimos temprano
      if (!this.toggleButton || !this.navLinks) {
        console.warn('Elementos de navegación no encontrados');
        return;
      }
      
      // Registrar evento del botón hamburguesa
      addEventListenerSafe(this.toggleButton, 'click', () => this.toggleMenu());
      
      // Cerrar menú al hacer clic en un enlace (UX en móvil)
      const links = this.navLinks.querySelectorAll('a');
      links.forEach(link => {
        addEventListenerSafe(link, 'click', () => this.closeMenu());
      });
      
      // Cerrar menú al hacer clic fuera (UX mejorada)
      document.addEventListener('click', (event) => {
        this.handleOutsideClick(event);
      });
      
      console.log('✅ Navegación inicializada');
    },

    /**
     * Alterna la visibilidad del menú móvil
     */
    toggleMenu() {
      const isVisible = this.navLinks.classList.toggle(CONFIG.CLASSES.MENU_VISIBLE);
      
      // Actualizar atributo ARIA para accesibilidad
      this.toggleButton.setAttribute('aria-expanded', String(isVisible));
      
      // Opcional: guardar estado en localStorage
      saveToStorage(CONFIG.STORAGE_KEYS.MENU_STATE, String(isVisible));
    },

    /**
     * Cierra el menú móvil
     */
    closeMenu() {
      this.navLinks.classList.remove(CONFIG.CLASSES.MENU_VISIBLE);
      this.toggleButton.setAttribute('aria-expanded', 'false');
    },

    /**
     * Maneja clics fuera del menú para cerrarlo
     * @param {Event} event - Evento de clic
     */
    handleOutsideClick(event) {
      const isMenuVisible = this.navLinks.classList.contains(CONFIG.CLASSES.MENU_VISIBLE);
      const clickedInsideMenu = this.navLinks.contains(event.target);
      const clickedToggleButton = this.toggleButton.contains(event.target);
      
      // Si el menú está visible y el clic fue fuera, cerrarlo
      if (isMenuVisible && !clickedInsideMenu && !clickedToggleButton) {
        this.closeMenu();
      }
    }
  };

  /* ==========================================================================
     MÓDULO: SCROLL SUAVE
     Implementa navegación suave a secciones internas
     ========================================================================== */

  const SmoothScroll = {
    /**
     * Inicializa el scroll suave para enlaces internos
     */
    init() {
      const internalLinks = getAllElements(CONFIG.SELECTORS.INTERNAL_LINKS);
      
      // Agregar evento a cada enlace interno
      internalLinks.forEach(link => {
        addEventListenerSafe(link, 'click', (event) => {
          this.handleClick(event, link);
        });
      });
      
      console.log(`✅ Scroll suave configurado para ${internalLinks.length} enlaces`);
    },

    /**
     * Maneja el clic en un enlace interno
     * @param {Event} event - Evento de clic
     * @param {Element} link - Elemento del enlace
     */
    handleClick(event, link) {
      const targetId = link.getAttribute('href');
      
      // Verificar que el href es válido
      if (!targetId || targetId === '#') {
        return;
      }
      
      const targetElement = getElement(targetId);
      
      // Si el elemento objetivo existe, hacer scroll suave
      if (targetElement) {
        event.preventDefault();
        
        // Opción 1: Scroll nativo (más simple)
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Actualizar URL sin hacer scroll adicional
        // (para que funcione el botón "atrás" del navegador)
        history.pushState(null, '', targetId);
        
        // Dar foco al elemento para accesibilidad con teclado
        // (después de un pequeño delay para que termine el scroll)
        setTimeout(() => {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }, CONFIG.ANIMATION.SCROLL_DURATION);
      }
    }
  };

  /* ==========================================================================
     MÓDULO: TEMA (MODO OSCURO/CLARO)
     Gestiona la alternancia entre modo claro y oscuro
     ========================================================================== */

  const ThemeManager = {
    /**
     * Inicializa el gestor de temas
     */
    init() {
      this.toggleButton = getElement(CONFIG.SELECTORS.MODE_TOGGLE);
      
      if (!this.toggleButton) {
        console.warn('Botón de tema no encontrado');
        return;
      }
      
      // Cargar tema guardado o detectar preferencia del sistema
      this.currentTheme = this.loadTheme();
      this.applyTheme(this.currentTheme);
      
      // Registrar evento del botón
      addEventListenerSafe(this.toggleButton, 'click', () => this.toggleTheme());
      
      // Escuchar cambios en la preferencia del sistema (opcional)
      this.watchSystemTheme();
      
      console.log(`✅ Tema inicializado: ${this.currentTheme}`);
    },

    /**
     * Carga el tema guardado o detecta el del sistema
     * @returns {string} - 'light' o 'dark'
     */
    loadTheme() {
      // Primero intentar cargar de localStorage
      const savedTheme = getFromStorage(CONFIG.STORAGE_KEYS.THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      
      // Si no hay tema guardado, detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    },

    /**
     * Aplica el tema al documento
     * @param {string} theme - 'light' o 'dark'
     */
    applyTheme(theme) {
      const root = document.documentElement;
      const icon = this.toggleButton.querySelector('.mode-toggle__icon');
      const text = this.toggleButton.querySelector('.mode-toggle__text');
      
      if (theme === 'dark') {
        // Aplicar modo oscuro
        root.setAttribute('data-theme', 'dark');
        if (icon) icon.textContent = '☀️'; // Icono de sol
        if (text) text.textContent = 'Modo claro';
      } else {
        // Aplicar modo claro
        root.removeAttribute('data-theme');
        if (icon) icon.textContent = '🌙'; // Icono de luna
        if (text) text.textContent = 'Modo oscuro';
      }
      
      // Actualizar atributo aria
      this.toggleButton.setAttribute('aria-label', 
        `Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`
      );
    },

    /**
     * Alterna entre modo claro y oscuro
     */
    toggleTheme() {
      // Cambiar al tema contrario
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      
      // Aplicar el nuevo tema
      this.applyTheme(this.currentTheme);
      
      // Guardar preferencia
      saveToStorage(CONFIG.STORAGE_KEYS.THEME, this.currentTheme);
      
      console.log(`🎨 Tema cambiado a: ${this.currentTheme}`);
    },

    /**
     * Observa cambios en la preferencia del sistema (opcional)
     * Actualiza el tema solo si el usuario no ha establecido una preferencia
     */
    watchSystemTheme() {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Listener para cambios en la preferencia del sistema
      darkModeQuery.addEventListener('change', (event) => {
        // Solo cambiar si no hay preferencia guardada
        const hasUserPreference = getFromStorage(CONFIG.STORAGE_KEYS.THEME);
        if (!hasUserPreference) {
          this.currentTheme = event.matches ? 'dark' : 'light';
          this.applyTheme(this.currentTheme);
          console.log('🔄 Tema actualizado según preferencia del sistema');
        }
      });
    }
  };

  /* ==========================================================================
     MÓDULO: FORMULARIO DE CONTACTO
     Valida y maneja el envío del formulario
     ========================================================================== */

  const ContactForm = {
    /**
     * Inicializa el módulo del formulario
     */
    init() {
      this.form = getElement(CONFIG.SELECTORS.CONTACT_FORM);
      
      if (!this.form) {
        console.warn('Formulario de contacto no encontrado');
        return;
      }
      
      // Registrar evento de envío
      addEventListenerSafe(this.form, 'submit', (event) => {
        this.handleSubmit(event);
      });
      
      console.log('✅ Formulario de contacto inicializado');
    },

    /**
     * Maneja el envío del formulario
     * @param {Event} event - Evento de submit
     */
    handleSubmit(event) {
      event.preventDefault(); // Prevenir envío tradicional
      
      // Obtener datos del formulario
      const formData = new FormData(this.form);
      const data = {
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        mensaje: formData.get('mensaje')
      };
      
      // Validar datos
      const errors = this.validateForm(data);
      
      if (errors.length > 0) {
        // Mostrar errores al usuario
        this.showErrors(errors);
        return;
      }
      
      // Si la validación pasa, "enviar" el formulario
      this.submitForm(data);
    },

    /**
     * Valida los datos del formulario
     * @param {Object} data - Datos del formulario
     * @returns {Array} - Array de errores (vacío si no hay errores)
     */
    validateForm(data) {
      const errors = [];
      
      // Validar nombre (mínimo 3 caracteres)
      if (!data.nombre || data.nombre.trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres');
      }
      
      // Validar email (regex simple)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.correo || !emailRegex.test(data.correo)) {
        errors.push('El correo electrónico no es válido');
      }
      
      // Validar mensaje (mínimo 10 caracteres)
      if (!data.mensaje || data.mensaje.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
      }
      
      return errors;
    },

    /**
     * Muestra errores al usuario
     * @param {Array} errors - Array de mensajes de error
     */
    showErrors(errors) {
      // Crear mensaje concatenado
      const errorMessage = 'Por favor corrige los siguientes errores:\n\n' + 
                          errors.map((err, i) => `${i + 1}. ${err}`).join('\n');
      
      // Mostrar con alert (básico, puede mejorarse con UI personalizada)
      alert(errorMessage);
      
      console.warn('⚠️ Errores de validación:', errors);
    },

    /**
     * Envía el formulario (simulado)
     * @param {Object} data - Datos validados del formulario
     */
    submitForm(data) {
      console.log('📧 Datos del formulario:', data);
      
      // TODO: Integrar con API real (Módulo 5)
      // Por ahora, solo mostramos un mensaje de éxito
      
      alert('✅ ¡Mensaje enviado con éxito!\n\nTe contactaremos pronto.');
      
      // Limpiar el formulario
      this.form.reset();
    }
  };

  /* ==========================================================================
     MÓDULO: ANIMACIONES AL SCROLL (OPCIONAL)
     Anima elementos cuando entran en el viewport
     ========================================================================== */

  const ScrollAnimations = {
    /**
     * Inicializa las animaciones al scroll
     */
    init() {
      // Verificar soporte de Intersection Observer
      if (!('IntersectionObserver' in window)) {
        console.warn('Intersection Observer no soportado');
        return;
      }
      
      // Seleccionar elementos a animar
      const elementsToAnimate = getAllElements('.benefit-card, .service-card, .testimonial-card');
      
      if (elementsToAnimate.length === 0) {
        return;
      }
      
      // Crear observador
      const observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          threshold: CONFIG.ANIMATION.INTERSECTION_THRESHOLD,
          rootMargin: '0px 0px -50px 0px' // Activar un poco antes de que sea visible
        }
      );
      
      // Observar cada elemento
      elementsToAnimate.forEach(element => {
        observer.observe(element);
      });
      
      console.log(`✅ Animaciones configuradas para ${elementsToAnimate.length} elementos`);
    },

    /**
     * Maneja la intersección de elementos con el viewport
     * @param {Array} entries - Entradas del IntersectionObserver
     */
    handleIntersection(entries) {
      entries.forEach(entry => {
        // Si el elemento está visible
        if (entry.isIntersecting) {
          // Agregar clase de animación
          entry.target.classList.add(CONFIG.CLASSES.ANIMATE_IN);
          
          // Dejar de observar este elemento (animación una sola vez)
          // Si quieres que se anime cada vez, comenta la siguiente línea
          // observer.unobserve(entry.target);
        }
      });
    }
  };

  /* ==========================================================================
     MÓDULO: ANALÍTICAS (OPCIONAL)
     Tracking básico de eventos para analizar comportamiento
     ========================================================================== */

  const Analytics = {
    /**
     * Inicializa el tracking de eventos
     */
    init() {
      // Rastrear clics en CTAs
      this.trackButtonClicks();
      
      // Rastrear navegación
      this.trackNavigation();
      
      console.log('✅ Analíticas básicas inicializadas');
    },

    /**
     * Registra clics en botones importantes
     */
    trackButtonClicks() {
      const buttons = getAllElements('.btn');
      
      buttons.forEach(button => {
        addEventListenerSafe(button, 'click', () => {
          const buttonText = button.textContent.trim();
          this.logEvent('button_click', { button: buttonText });
        });
      });
    },

    /**
     * Registra navegación entre secciones
     */
    trackNavigation() {
      const navLinks = getAllElements('nav a');
      
      navLinks.forEach(link => {
        addEventListenerSafe(link, 'click', () => {
          const section = link.getAttribute('href');
          this.logEvent('navigation', { section });
        });
      });
    },

    /**
     * Registra un evento (por ahora solo en consola)
     * @param {string} eventName - Nombre del evento
     * @param {Object} data - Datos adicionales del evento
     */
    logEvent(eventName, data = {}) {
      console.log(`📊 Evento: ${eventName}`, data);
      
      // TODO: Integrar con Google Analytics, Plausible, etc.
      // Ejemplo: gtag('event', eventName, data);
    }
  };

  /* ==========================================================================
     INICIALIZACIÓN PRINCIPAL
     Punto de entrada cuando el DOM está listo
     ========================================================================== */

  /**
   * Inicializa todos los módulos de la aplicación
   */
  function initializeApp() {
    console.log('🚀 Inicializando aplicación...');
    
    // Inicializar cada módulo
    Navigation.init();
    SmoothScroll.init();
    ThemeManager.init();
    ContactForm.init();
    ScrollAnimations.init();
    Analytics.init();
    
    console.log('✨ Aplicación lista');
  }

  /* ==========================================================================
     ENTRADA PRINCIPAL
     Ejecutar cuando el DOM esté completamente cargado
     ========================================================================== */

  // Verificar si el DOM ya está cargado
  if (document.readyState === 'loading') {
    // DOM aún cargando, esperar al evento DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM ya cargado, ejecutar inmediatamente
    initializeApp();
  }

})(); // Fin de la IIFE (función autoejecutada)

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURAS (TODOs):
 * 
 * 1. Integración con API (Módulo 5):
 *    - Reemplazar alert() en ContactForm.submitForm() por fetch() a endpoint real
 *    - Agregar manejo de estados de carga (spinner)
 *    - Implementar reintentos en caso de error de red
 * 
 * 2. Mejoras de UX:
 *    - Agregar notificaciones toast en lugar de alerts
 *    - Implementar validación en tiempo real (mientras el usuario escribe)
 *    - Agregar indicadores de progreso para formulario largo
 * 
 * 3. Performance:
 *    - Lazy loading de imágenes (si se agregan)
 *    - Debounce en eventos de scroll/resize si es necesario
 *    - Service Worker para funcionalidad offline (PWA)
 * 
 * 4. Accesibilidad avanzada:
 *    - Anuncios via aria-live para acciones importantes
 *    - Manejo de foco al abrir/cerrar modales
 *    - Atajos de teclado para power users
 * 
 * 5. Testing:
 *    - Tests unitarios con Jest o similar
 *    - Tests E2E con Playwright o Cypress
 *    - Tests de accesibilidad con axe-core
 */