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

// Project modal functions with security-compliant approach
function modalData() {
  return {
    isOpen: false,
    currentProject: null,
    iframeLoaded: false,
    uniqueId: 1, // Used to force iframe reload
    // Default height
    iframeHeight: 600,
    
    open(project) {
      // Generate new unique ID to force iframe reload
      this.uniqueId = Date.now();
      
      // Reset state before setting new project
      this.iframeLoaded = false;
      this.currentProject = project;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Set iframe height based on project type
      // You can customize heights for different project types if needed
      this.iframeHeight = 600;
      
      // Reset scroll position when opening a new project
      setTimeout(() => {
        const modalContent = document.querySelector('#projectDetails > div');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 100);
    },
    
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    },
    
    // Handle iframe load event
    onIframeLoad() {
      this.iframeLoaded = true;
      
      // Get references to the iframe and its container
      const iframe = this.$refs.projectIframe;
      const container = this.$refs.iframeContainer;
      
      if (iframe && container) {
        // Apply the height
        iframe.style.height = this.iframeHeight + 'px';
        container.style.height = this.iframeHeight + 'px';
      }
    },
    
    // Increase iframe height by 100px
    increaseHeight() {
      this.iframeHeight += 100;
      const iframe = this.$refs.projectIframe;
      const container = this.$refs.iframeContainer;
      
      if (iframe && container) {
        iframe.style.height = this.iframeHeight + 'px';
        container.style.height = this.iframeHeight + 'px';
      }
    },
    
    // Decrease iframe height by 100px, but not below 600px (1:1 minimum)
    decreaseHeight() {
      if (this.iframeHeight > 300) {
        this.iframeHeight -= 100;
        const iframe = this.$refs.projectIframe;
        const container = this.$refs.iframeContainer;
        
        if (iframe && container) {
          iframe.style.height = this.iframeHeight + 'px';
          container.style.height = this.iframeHeight + 'px';
        }
      }
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