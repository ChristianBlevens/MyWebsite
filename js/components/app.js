/**
 * MAIN APPLICATION COMPONENT
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('portfolioApp', () => ({
    // Component State
    mobileMenuOpen: false,
    projects: window.projects || [],
    navElement: null,

    init() {
      this.cacheElements();
      this.setupSmoothScrolling();
      this.setupGlobalListeners();
    },

    destroy() {
      // Cleanup on component destruction
    },

    // Cache frequently accessed DOM elements
    cacheElements() {
      this.navElement = document.querySelector('nav');
    },

    // Setup smooth scrolling for anchor navigation
    setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            const navHeight = this.navElement.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    },

    // Setup global event listeners
    setupGlobalListeners() {
      window.addEventListener('alpine:initialized', () => {
        console.log('Alpine initialized, components ready');
      });
    },

    // Open project modal with given project data
    openProject(project) {
      console.log('Opening project:', project.title);
      Alpine.store('portfolio').selectedProject = project;
      this.$dispatch('open-project', { project });
    },
  }));
});
