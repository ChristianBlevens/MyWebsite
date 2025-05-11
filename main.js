/**
 * Christian Blevens Portfolio
 * Alpine.js Implementation
 */

// Define main data object for Alpine.js application state
document.addEventListener('alpine:init', () => {
  Alpine.data('portfolioApp', () => ({
    activeFilter: 'all',
    
    // Filter projects based on the selected filter
    filteredProjects() {
      return this.activeFilter === 'all' 
        ? window.projects 
        : window.projects.filter(project => project.skills.includes(this.activeFilter));
    },
    
    // Method to determine if a project should be shown based on the active filter
    shouldShowProject(project) {
      return this.activeFilter === 'all' || project.skills.includes(this.activeFilter);
    },
    
    // Initialize the application
    init() {
      console.log('Initializing portfolio with Alpine.js...');
      
      // Set up event listener for anchor links smooth scrolling
      this.setupSmoothScrolling();
      
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
    }
  }));
  
  // Project filtering component
  Alpine.data('projectFilters', () => ({
    activeFilter: 'all',
    
    setFilter(filter) {
      this.activeFilter = filter;
    }
  }));
  
  // Projects grid component
  Alpine.data('projectsGrid', () => ({
    filteredProjects() {
      return this.activeFilter === 'all' 
        ? window.projects 
        : window.projects.filter(project => project.skills.includes(this.activeFilter));
    }
  }));
});

// Expose a global function to help initialize Alpine.js components manually if needed
window.initAlpineApp = function() {
  console.log('Manually initializing Alpine.js application...');
  
  // This function can be called if components need to be initialized
  // after Alpine.js has already mounted to the DOM
};