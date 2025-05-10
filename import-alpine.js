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
    iframeLoaded: false,
    
    open(project) {
      // Reset state before setting new project
      this.iframeLoaded = false;
      this.currentProject = project;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      
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
      
      // When closing, set a small timeout before resetting iframe state
      setTimeout(() => {
        this.iframeLoaded = false;
      }, 300);
    },
    
    adjustIframeHeight() {
      // Get references to the iframe and its container
      const iframe = this.$refs.projectIframe;
      const container = this.$refs.iframeContainer;
      
      if (!iframe || !container) return;
      
      // First ensure iframe width is set
      const containerWidth = container.offsetWidth;
      iframe.style.width = '100%';
      
      // Function to measure and set proper height
      const resizeIframe = () => {
        try {
          // Try to access iframe content
          let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          let iframeHeight = 0;
          
          // Wait for content to be fully loaded
          setTimeout(() => {
            try {
              // Get the scroll height of the iframe content
              const contentHeight = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.documentElement.scrollHeight
              );
              
              // Set a minimum height equal to width (1:1 ratio)
              iframeHeight = Math.max(containerWidth, contentHeight);
              
              // Apply the height
              iframe.style.height = iframeHeight + 'px';
              
              // Add resize observer for dynamic content changes
              if (!iframe._resizeObserver && iframeDoc.body) {
                iframe._resizeObserver = new ResizeObserver(() => {
                  this.adjustIframeHeight();
                });
                iframe._resizeObserver.observe(iframeDoc.body);
              }
            } catch (e) {
              console.log('Error measuring iframe content:', e);
              // Fallback to 1:1 ratio if can't measure content
              iframe.style.height = containerWidth + 'px';
            }
          }, 300);
        } catch (e) {
          console.log('Cannot access iframe content:', e);
          // Default to 1:1 aspect ratio if cross-origin issues
          iframe.style.height = containerWidth + 'px';
        }
      };
      
      // Initial resize
      resizeIframe();
      
      // Also listen for window resize events
      if (!window._iframeResizeListener) {
        window._iframeResizeListener = true;
        window.addEventListener('resize', () => {
          if (this.isOpen && this.iframeLoaded) {
            resizeIframe();
          }
        });
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