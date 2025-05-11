// Define main data object for Alpine.js application state
document.addEventListener('alpine:init', () => {
  Alpine.data('portfolioApp', () => ({
    // Application state
    mobileMenuOpen: false,
    
    // Initialize the application
    init() {
      console.log('Initializing portfolio with Alpine.js...');
      
      // Set up event listener for anchor links smooth scrolling
      this.setupSmoothScrolling();
      
      // Set up lazy loading for images
      this.setupLazyLoading();
      
      console.log('Portfolio initialized successfully with Alpine.js!');
    },
    
    // Method to handle smooth scrolling for anchor links
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
          }
        });
      });
    },
    
    // Method to set up lazy loading for images
    setupLazyLoading() {
      // Check if browser supports IntersectionObserver
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
              }
              
              observer.unobserve(img);
            }
          });
        });
        
        // Get all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          imageObserver.observe(img);
        });
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
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
  
  // You could add more sophisticated error handling here,
  // such as sending errors to a logging service
  
  // Prevent the error from showing in the console
  // event.preventDefault();
});

// Initialize the portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
  
  // Add any additional initialization that should happen
  // after the DOM is fully loaded
});