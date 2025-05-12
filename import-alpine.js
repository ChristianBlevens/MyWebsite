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
        console.log('Form submitted:', this.formData);
        
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reset form after successful submission
        this.formData = { name: '', email: '', message: '' };
        
        // Show success message
        this.formSubmitted = true;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.formSubmitted = false;
        }, 5000);
      } catch (error) {
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
    
    open(project) {
      try {
        // Generate new unique ID to force iframe reload
        this.uniqueId = Date.now();
        
        // Reset state before setting new project
        this.iframeLoaded = false;
        this.currentProject = project;
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Create iframe with a slight delay to ensure DOM is ready
        setTimeout(() => {
          if (this.hasDemo()) {
            this.createNewIframe();
          } else {
            this.iframeLoaded = true;
          }
          
          // Reset scroll position
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
        
        // Set isOpen to false to start closing animation
        this.isOpen = false;
        document.body.style.overflow = 'auto';
        
        // IMPORTANT: Clear currentProject immediately to avoid DOM errors
        // This fixes the "Cannot read properties of null" error
        this.currentProject = null;
        this.iframeLoaded = false;
      } catch (error) {
        console.error('Error closing project modal:', error);
        document.body.style.overflow = 'auto';
      }
    },
    
    // Create a completely new iframe element
    createNewIframe() {
      try {
        // First, clean up any existing iframe
        this.removeCurrentIframe();
        
        // Reset the iframe loaded state
        this.iframeLoaded = false;
        
        // Get the container
        const container = this.$refs.iframeContainer;
        if (!container) {
          console.error('Iframe container not found');
          this.iframeLoaded = true;
          return;
        }
        
        // Create a new iframe element
        const iframe = document.createElement('iframe');
        
        // Set the source
        iframe.src = this.getIframeSrc();
        
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
        iframe.addEventListener('load', () => this.onIframeLoad());
        iframe.addEventListener('error', () => this.iframeLoaded = true);
        
        // Store reference and add to DOM
        this.iframeElement = iframe;
        container.appendChild(iframe);
        
        // Fallback timeout
        setTimeout(() => {
          if (!this.iframeLoaded) this.iframeLoaded = true;
        }, 10000);
      } catch (error) {
        console.error('Error creating iframe:', error);
        this.iframeLoaded = true;
      }
    },
    
    // Remove the current iframe completely
    removeCurrentIframe() {
      try {
        if (this.iframeElement) {
          if (this.iframeElement.parentNode) {
            this.iframeElement.parentNode.removeChild(this.iframeElement);
          }
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
        return `${this.currentProject.demoPath}?v=${this.uniqueId}`;
      } else if (this.currentProject.demoType === 'local') {
        return `projects/${this.currentProject.id}/index.html?v=${this.uniqueId}`;
      } else {
        return 'about:blank';
      }
    },
    
    // Handle iframe load event
    onIframeLoad() {
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
      return this.hasDemo() && !this.iframeLoaded;
    }
  };
}

// Gallery modal function
function galleryModal() {
  return {
    isOpen: false,
    currentImage: '',
    imageTitle: '',
    imageIndex: 0,
    
    open(data) {
      try {
        // Now receiving more data (image, title, index) from the dispatch
        this.currentImage = data.image || '';
        this.imageTitle = data.title || '';
        this.imageIndex = data.index || 0;
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

// Global helper functions
window.openProjectModal = function(project) {
  window.dispatchEvent(new CustomEvent('open-project-modal', { detail: project }));
};

window.openGalleryImage = function(imageData) {
  window.dispatchEvent(new CustomEvent('open-gallery-modal', { detail: imageData }));
};