// Main portfolio application state
document.addEventListener('alpine:init', () => {
  Alpine.data('portfolioApp', () => ({
    // Application state
    mobileMenuOpen: false,
    
    // Initialize application
    init() {
      console.log('Alpine.js Portfolio initialized');
      this.setupSmoothScrolling();
      this.preloadCriticalImages();
    },
    
    // Setup smooth scrolling
    setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const portfolioApp = document.querySelector('[x-data="portfolioApp"]').__x.$data;
            if (portfolioApp.mobileMenuOpen) {
              portfolioApp.mobileMenuOpen = false;
            }
          }
        });
      });
    },
    
    // Preload critical images
    preloadCriticalImages() {
      if (window.projects) {
        // Only preload the first few project images for performance
        window.projects.slice(0, 3).forEach(project => {
          if (project.image) {
            const img = new Image();
            img.src = project.image;
          }
        });
      }
    },
    
    // Toggle mobile menu
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    }
  }));
});

// Handle errors globally
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  // You could add more sophisticated error handling here
});

// Preload additional project images once the page has fully loaded
window.addEventListener('load', () => {
  if (window.projects) {
    // Preload remaining project images and first gallery image for each
    window.projects.forEach(project => {
      if (project.gallery && project.gallery.length > 0) {
        const img = new Image();
        img.src = project.gallery[0];
      }
    });
  }
});