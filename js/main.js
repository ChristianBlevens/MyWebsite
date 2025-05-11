/**
 * Christian Blevens Portfolio
 * Main JavaScript Initialization
 * 
 * This file handles initialization tasks and utility functions.
 */

// DOMContentLoaded event listener to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if Alpine.js is loaded and initialize if present
  if (window.Alpine) {
    console.log('Alpine.js detected, initializing portfolio...');
  } else {
    console.warn('Alpine.js not found! Loading fallback behavior...');
    setupFallbackBehavior();
  }
  
  // Register service worker for offline capabilities if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  }
});

/**
 * Fallback behavior if Alpine.js fails to load
 * Implements minimal functionality for core features
 */
function setupFallbackBehavior() {
  // Basic navigation toggle
  const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Project filtering
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectItems = document.querySelectorAll('[data-project]');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('bg-blue-600'));
      button.classList.add('bg-blue-600');
      
      // Filter projects
      projectItems.forEach(item => {
        const skills = item.getAttribute('data-skills').split(',');
        if (filter === 'all' || skills.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Utility function for error tracking
 * @param {Error} error - The error to log
 * @param {string} context - Context where the error occurred
 */
window.logError = function(error, context) {
  console.error(`Error in ${context}:`, error);
  
  // In production, you might want to send this to an error tracking service
  // Example: errorTrackingService.send(error, context);
};

/**
 * Utility function to safely parse JSON with error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback value
 */
window.safeParseJSON = function(jsonString, fallback = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return fallback;
  }
};

/**
 * Expose a global function to help manually initialize Alpine.js components
 * Useful for dynamic content or testing
 */
window.initPortfolio = function() {
  console.log('Manually initializing portfolio components...');
  
  // Force Alpine.js to re-evaluate components if needed
  if (window.Alpine && window.Alpine.initializeComponent) {
    document.querySelectorAll('[x-data]').forEach(el => {
      window.Alpine.initializeComponent(el);
    });
  }
};