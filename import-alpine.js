// Contact form function
function contactForm() {
  return {
    formData: {
      name: '',
      email: '',
      message: ''
    },
    formSubmitted: false,
    submitting: false,
    errorMessage: null,
    
    async handleSubmit() {
      this.submitting = true;
      this.errorMessage = null;
      
      try {
        // In a real implementation, you would send this data to a server
        // For demo purposes, we're simulating API behavior with a delay
        console.log('Form submitted:', this.formData);
        
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reset form after successful submission
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
      } catch (error) {
        // Handle submission error
        console.error('Form submission error:', error);
        this.errorMessage = 'There was an error submitting the form. Please try again.';
      } finally {
        this.submitting = false;
      }
    }
  };
}

// Project modal functions
function modalData() {
  return {
    isOpen: false,
    currentProject: null,
    iframeLoaded: false,
    uniqueId: 1, // Used to force iframe reload
    iframeHeight: 600, // Default height
    iframeElement: null, // Track the iframe element
    iframeCreationAttempted: false, // Track if we've attempted to create an iframe
    
    open(project) {
      try {
        // Generate new unique ID to force iframe reload
        this.uniqueId = Date.now();
        
        // Reset state before setting new project
        this.iframeLoaded = false;
        this.iframeCreationAttempted = false;
        this.currentProject = project;
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Force a complete DOM refresh for the iframe container
        setTimeout(() => {
          this.createOrRemoveIframe();
          
          // Reset scroll position when opening a new project
          const modalContent = document.querySelector('#projectDetails > div');
          if (modalContent) {
            modalContent.scrollTop = 0;
          }
        }, 50);
      } catch (error) {
        console.error('Error opening project modal:', error);
      }
    },
    
    close() {
      try {
        // First, remove the iframe to prevent memory leaks
        this.removeCurrentIframe();
        
        // Important: Create a local copy of currentProject for reference in the template
        // during the transition
        const projectRef = this.currentProject;
        
        // Set isOpen to false to start closing animation
        this.isOpen = false;
        document.body.style.overflow = 'auto';
        
        // Keep currentProject until the modal is fully closed to prevent template errors
        // Only nullify it after the closing transition is complete
        setTimeout(() => {
          // Only set currentProject to null if it's still the same project
          // This prevents issues if user opened another project during the timeout
          if (this.currentProject === projectRef) {
            this.currentProject = null;
            // Reset iframe state when modal is fully closed
            this.iframeLoaded = false;
            this.iframeCreationAttempted = false;
          }
        }, 300); // Delay matches the transition duration
      } catch (error) {
        console.error('Error closing project modal:', error);
        // Ensure body overflow is restored even if there's an error
        document.body.style.overflow = 'auto';
      }
    },
    
    // Decide whether to create or remove iframe based on current project
    createOrRemoveIframe() {
      // Mark that we've attempted to handle the iframe
      this.iframeCreationAttempted = true;
      
      // Check if the current project has a demo
      if (this.hasDemo()) {
        console.log('Project has demo, creating iframe');
        // If it has a demo, create or update the iframe
        this.createNewIframe();
      } else {
        console.log('Project has no demo, removing iframe');
        // If it doesn't have a demo, ensure any previous iframe is removed
        this.removeCurrentIframe();
        // Also force iframeLoaded to true to hide loading indicator if visible
        this.iframeLoaded = true;
      }
    },
    
    // Create a completely new iframe element
    createNewIframe() {
      try {
        console.log('Creating new iframe');
        // First, clean up any existing iframe
        this.removeCurrentIframe();
        
        // Reset the iframe loaded state
        this.iframeLoaded = false;
        
        // Get the container
        const container = this.$refs.iframeContainer;
        if (!container) {
          console.error('Iframe container not found');
          this.iframeLoaded = true; // Force loaded state to hide loader
          return;
        }
        
        // Create a new iframe element
        const iframe = document.createElement('iframe');
        
        // Set the source
        const src = this.getIframeSrc();
        console.log('Setting iframe src to:', src);
        iframe.src = src;
        
        // Set common attributes
        iframe.style.width = '100%';
        iframe.style.height = '100%'; 
        iframe.style.border = '0';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.loading = 'lazy';
        
        // Set specific attributes based on demo type
        if (this.currentProject && this.currentProject.demoType === 'itch') {
          iframe.frameBorder = '0';
          iframe.allowFullscreen = true;
          iframe.style.backgroundColor = 'transparent';
        } else {
          iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock';
          iframe.style.backgroundColor = 'white';
        }
        
        // Add event listeners
        iframe.addEventListener('load', () => {
          console.log('Iframe loaded event fired');
          this.onIframeLoad();
        });
        
        // Add error event listener
        iframe.addEventListener('error', (e) => {
          console.error('Iframe load error:', e);
          this.iframeLoaded = true; // Force loaded state to hide loader on error
        });
        
        // Store reference to the iframe
        this.iframeElement = iframe;
        
        // Add to DOM
        container.appendChild(iframe);
        
        // Set a fallback timeout to hide the loader if the load event never fires
        setTimeout(() => {
          if (!this.iframeLoaded) {
            console.log('Fallback timeout fired - force setting iframe as loaded');
            this.iframeLoaded = true;
          }
        }, 10000); // 10 seconds timeout
      } catch (error) {
        console.error('Error creating iframe:', error);
        this.iframeLoaded = true; // Set to true so loading indicator disappears
      }
    },
    
    // Remove the current iframe completely
    removeCurrentIframe() {
      try {
        console.log('Removing current iframe');
        if (this.iframeElement) {
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
      } catch (error) {
        console.error('Error removing iframe:', error);
      }
    },
    
    // Get the appropriate iframe src based on the demo type
    getIframeSrc() {
      if (!this.currentProject) return '';
      
      if (this.currentProject.demoType === 'itch') {
        // For itch.io embeds, add a cache-busting parameter
        return `${this.currentProject.demoPath}?v=${this.uniqueId}`;
      } else if (this.currentProject.demoType === 'local') {
        // For local demos, build the path with the uniqueId to force refresh
        return `projects/${this.currentProject.id}/index.html?v=${this.uniqueId}`;
      } else {
        // Default case
        return 'about:blank';
      }
    },
    
    // Handle iframe load event
    onIframeLoad() {
      console.log('Setting iframe as loaded');
      this.iframeLoaded = true;
      
      // Apply sizing to the iframe container
      const container = this.$refs.iframeContainer;
      if (container) {
        container.style.height = this.iframeHeight + 'px';
      }
    },
    
    // Increase iframe height by 100px
    increaseHeight() {
      this.iframeHeight += 100;
      
      const container = this.$refs.iframeContainer;
      if (container) {
        container.style.height = this.iframeHeight + 'px';
      }
    },
    
    // Decrease iframe height by 100px, but not below 300px minimum
    decreaseHeight() {
      if (this.iframeHeight > 300) {
        this.iframeHeight -= 100;
        
        const container = this.$refs.iframeContainer;
        if (container) {
          container.style.height = this.iframeHeight + 'px';
        }
      }
    },
    
    // Check if the current project has a demo
    hasDemo() {
      return this.currentProject && this.currentProject.demoType;
    },
    
    // Check if we should show the loading overlay
    showLoadingOverlay() {
      return this.hasDemo() && !this.iframeLoaded && this.iframeCreationAttempted;
    }
  };
}

// Gallery modal function
function galleryModal() {
  return {
    isOpen: false,
    currentImage: '',
    
    open(image) {
      try {
        this.currentImage = image;
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
      } catch (error) {
        console.error('Error opening gallery modal:', error);
      }
    },
    
    close() {
      try {
        this.isOpen = false;
        document.body.style.overflow = 'auto';
      } catch (error) {
        console.error('Error closing gallery modal:', error);
        // Ensure body overflow is restored even if there's an error
        document.body.style.overflow = 'auto';
      }
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