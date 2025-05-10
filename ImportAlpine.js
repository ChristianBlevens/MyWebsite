/**
 * Christian Blevens Portfolio
 * Alpine.js Component Functions
 * 
 * This file defines all the Alpine.js component functions used in the portfolio.
 * Alpine.js provides a lightweight JavaScript framework for reactivity and state management.
 */

// Contact form function
function contactForm() {
  return {
    formData: {
      name: '',
      email: '',
      message: ''
    },
    formSubmitted: false,
    handleSubmit() {
      console.log('Form submitted:', this.formData);
      
      // In a real implementation, you would send this data to a server
      // For this demo, we'll just simulate a successful submission
      
      // Reset form
      this.formData = {
        name: '',
        email: '',
        message: ''
      };
      
      // Show success message
      this.formSubmitted = true;
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.formSubmitted = false;
      }, 5000);
    }
  };
}

// Project modal functions
function modalData() {
  return {
    isOpen: false,
    currentProject: null,
    activeTab: 'info',
    demoLoaded: false,
    iframeLoaded: false,
    
    open(project) {
      this.currentProject = project;
      this.isOpen = true;
      this.activeTab = 'info';
      this.demoLoaded = false;
      this.iframeLoaded = false;
      document.body.style.overflow = 'hidden';
    },
    
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    },
    
    loadDemo() {
      this.demoLoaded = true;
    }
  };
}

// Gallery modal function
function galleryModal() {
  return {
    isOpen: false,
    currentImage: '',
    
    open(image) {
      this.currentImage = image;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    },
    
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    }
  };
}

// Projects filter component
function projectsFilter() {
  return {
    activeFilter: 'all',
    
    setFilter(filter) {
      this.activeFilter = filter;
    },
    
    isActive(filter) {
      return this.activeFilter === filter;
    }
  };
}

// Main portfolio application state
document.addEventListener('alpine:init', () => {
  Alpine.data('portfolioApp', () => ({
    // Application state
    mobileMenuOpen: false,
    
    // Initialize application
    init() {
      console.log('Alpine.js Portfolio initialized');
      
      // Set up smooth scrolling
      this.setupSmoothScrolling();
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
          }
        });
      });
    },
    
    // Toggle mobile menu
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    }
  }));
});

// Define global helper functions
window.openProjectModal = function(project) {
  // Dispatch event for the project modal to handle
  window.dispatchEvent(new CustomEvent('open-project-modal', { detail: project }));
};

window.openGalleryImage = function(image) {
  // Dispatch event for the gallery modal to handle
  window.dispatchEvent(new CustomEvent('open-gallery-modal', { detail: image }));
};