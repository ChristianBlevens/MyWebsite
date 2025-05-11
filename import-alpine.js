/**
 * Christian Blevens Portfolio
 * Alpine.js Component Functions
 * 
 * This file defines all the Alpine.js component functions used in the portfolio.
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
// Project modal functions with improved iframe handling
function modalData() {
  return {
    isOpen: false,
    currentProject: null,
    iframeLoaded: false,
    uniqueId: 1, // Used to force iframe reload
    // Default height
    iframeHeight: 600,
    iframeElement: null, // Track the iframe element
    
    open(project) {
      // Generate new unique ID to force iframe reload
      this.uniqueId = Date.now();
      
      // Reset state before setting new project
      this.iframeLoaded = false;
      this.currentProject = project;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Set iframe height based on project type
      this.iframeHeight = 600;
      
      // Force a complete DOM refresh for the iframe container
      setTimeout(() => {
        this.createNewIframe();
        
        // Reset scroll position when opening a new project
        const modalContent = document.querySelector('#projectDetails > div');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 50);
    },
    
    close() {
      // Clean up iframe to prevent memory leaks
      this.removeCurrentIframe();
      this.isOpen = false;
      document.body.style.overflow = 'auto';
      this.currentProject = null;
    },
    
    // Create a completely new iframe element
    createNewIframe() {
      // First, clean up any existing iframe
      this.removeCurrentIframe();
      
      // Get the container
      const container = this.$refs.iframeContainer;
      if (!container) return;
      
      // Create a new iframe element
      const iframe = document.createElement('iframe');
      
      // Set the source
      const src = this.getIframeSrc();
      iframe.src = src;
      
      // Set common attributes
      iframe.style.width = '100%';
      iframe.style.height = this.iframeHeight + 'px';
      iframe.style.border = '0';
      iframe.loading = 'lazy';
      
      // Set specific attributes based on demo type
      if (this.currentProject && this.currentProject.demoType === 'itch') {
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.backgroundColor = 'transparent';
        iframe.style.display = 'block';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
      } else {
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock';
        iframe.style.backgroundColor = 'white';
      }
      
      // Add event listeners
      iframe.addEventListener('load', () => this.onIframeLoad());
      
      // Store reference to the iframe
      this.iframeElement = iframe;
      
      // Add to DOM
      container.appendChild(iframe);
    },
    
    // Remove the current iframe completely
    removeCurrentIframe() {
      if (this.iframeElement) {
        // Remove event listeners
        this.iframeElement.removeEventListener('load', () => this.onIframeLoad());
        
        // Remove from DOM
        if (this.iframeElement.parentNode) {
          this.iframeElement.parentNode.removeChild(this.iframeElement);
        }
        
        // Clear reference
        this.iframeElement = null;
      }
      
      // Also clear any other iframes in the container
      const container = this.$refs.iframeContainer;
      if (container) {
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.parentNode.removeChild(iframe));
      }
    },
    
    // Get the appropriate iframe src based on the demo type
    getIframeSrc() {
      if (!this.currentProject) return '';
      
      if (this.currentProject.demoType === 'itch') {
        // For itch.io embeds, add a cache-busting parameter
        return `${this.currentProject.demoPath}?v=${this.uniqueId}`;
      } else {
        // For local demos, build the path with the uniqueId to force refresh
        return `projects/${this.currentProject.id}/index.html?v=${this.uniqueId}`;
      }
    },
    
    // Handle iframe load event
    onIframeLoad() {
      this.iframeLoaded = true;
      
      // Apply sizing to the iframe
      if (this.iframeElement) {
        this.iframeElement.style.height = this.iframeHeight + 'px';
      }
      
      const container = this.$refs.iframeContainer;
      if (container) {
        container.style.height = this.iframeHeight + 'px';
      }
      
      // If this is an itch.io project, inject CSS to make the content fill the iframe
      if (this.currentProject && this.currentProject.demoType === 'itch' && this.iframeElement) {
        try {
          // Add CSS to the iframe document if possible
          if (this.iframeElement.contentDocument) {
            const style = document.createElement('style');
            style.textContent = `
              html, body, canvas {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
              }
              .unity-canvas {
                width: 100% !important;
                height: 100% !important;
              }
            `;
            this.iframeElement.contentDocument.head.appendChild(style);
          }
        } catch (e) {
          console.warn('Could not inject CSS into iframe', e);
        }
      }
    },
    
    // Increase iframe height by 100px
    increaseHeight() {
      this.iframeHeight += 100;
      
      if (this.iframeElement) {
        this.iframeElement.style.height = this.iframeHeight + 'px';
      }
      
      const container = this.$refs.iframeContainer;
      if (container) {
        container.style.height = this.iframeHeight + 'px';
      }
    },
    
    // Decrease iframe height by 100px, but not below 300px minimum
    decreaseHeight() {
      if (this.iframeHeight > 300) {
        this.iframeHeight -= 100;
        
        if (this.iframeElement) {
          this.iframeElement.style.height = this.iframeHeight + 'px';
        }
        
        const container = this.$refs.iframeContainer;
        if (container) {
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