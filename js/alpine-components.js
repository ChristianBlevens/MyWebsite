/**
 * Christian Blevens Portfolio
 * Alpine.js Component Definitions
 * 
 * This file contains all Alpine.js component definitions used throughout the portfolio.
 * Each component is defined as a function that returns an object with state and methods.
 */

// Main portfolio application
document.addEventListener('alpine:init', () => {
  /**
   * Main Portfolio Application
   * Handles global state and actions
   */
  Alpine.data('portfolioApp', () => ({
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com', icon: 'github' },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' }
    ],
    
    /**
     * Initialize the application
     */
    init() {
      console.log('Portfolio initialized');
      this.setupSmoothScrolling();
    },
    
    /**
     * Set up smooth scrolling for anchor links
     */
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
    
    /**
     * Close all modals
     * Used as a global escape method
     */
    closeAllModals() {
      window.dispatchEvent(new CustomEvent('close-all-modals'));
    }
  }));

  /**
   * Navigation Component
   * Handles responsive navigation menu
   */
  Alpine.data('navigationComponent', () => ({
    isOpen: false,
    navItems: [
      { label: 'Projects', href: '#projects' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' }
    ],
    
    /**
     * Toggle mobile menu open/closed
     */
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }
  }));

  /**
   * Project Filters Component
   * Handles filtering of projects by category
   */
  Alpine.data('projectFilters', () => ({
    activeFilter: 'all',
    filters: [
      { label: 'All Projects', value: 'all' },
      { label: 'C++', value: 'C++' },
      { label: 'Unity', value: 'Unity' },
      { label: 'AI & Simulation', value: 'AI' }
    ],
    
    /**
     * Set the active filter
     * @param {string} filter - The filter value to set active
     */
    setFilter(filter) {
      this.activeFilter = filter;
      
      // Emit event so other components can react to filter changes
      window.dispatchEvent(new CustomEvent('filter-changed', { 
        detail: { filter } 
      }));
    },
    
    /**
     * Check if a filter is currently active
     * @param {string} filter - The filter to check
     * @returns {boolean} True if the filter is active
     */
    isActive(filter) {
      return this.activeFilter === filter;
    }
  }));

  /**
   * Projects Grid Component
   * Handles the display and filtering of project cards
   */
  Alpine.data('projectsGrid', () => ({
    activeFilter: 'all',
    
    init() {
      // Listen for filter changes from the filter component
      window.addEventListener('filter-changed', (event) => {
        this.activeFilter = event.detail.filter;
      });
    },
    
    /**
     * Get projects filtered by the active filter
     * @returns {Array} Filtered projects array
     */
    filteredProjects() {
      if (!window.projects) return [];
      
      return this.activeFilter === 'all'
        ? window.projects
        : window.projects.filter(project => project.skills.includes(this.activeFilter));
    }
  }));

  /**
   * Contact Form Component
   * Handles contact form submission and validation
   */
  Alpine.data('contactForm', () => ({
    formData: {
      name: '',
      email: '',
      message: ''
    },
    isSubmitting: false,
    formStatus: {
      show: false,
      success: false,
      message: ''
    },
    
    /**
     * Submit the contact form
     */
    async submitForm() {
      this.isSubmitting = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you would send data to a server here
        console.log('Form submitted:', this.formData);
        
        // Show success message
        this.formStatus = {
          show: true,
          success: true,
          message: 'Your message has been sent successfully!'
        };
        
        // Reset form
        this.resetForm();
      } catch (error) {
        // Show error message
        this.formStatus = {
          show: true,
          success: false,
          message: 'There was an error sending your message. Please try again.'
        };
        
        console.error('Form submission error:', error);
      } finally {
        this.isSubmitting = false;
        
        // Hide status message after delay
        setTimeout(() => {
          this.formStatus.show = false;
        }, 5000);
      }
    },
    
    /**
     * Reset form fields
     */
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        message: ''
      };
    }
  }));

  /**
   * Gallery Modal Component
   * Handles lightbox display of project images
   */
  Alpine.data('galleryModal', () => ({
    isOpen: false,
    currentImage: '',
    
    init() {
      // Listen for close all modals event
      window.addEventListener('close-all-modals', () => {
        if (this.isOpen) this.close();
      });
    },
    
    /**
     * Open the gallery modal with the given image
     * @param {string} image - The image URL to display
     */
    open(image) {
      this.currentImage = image;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    },
    
    /**
     * Close the gallery modal
     */
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    }
  }));

  /**
   * Project Modal Component
   * Handles project detail modal and demo iframe
   */
  Alpine.data('projectModal', () => ({
    isOpen: false,
    project: null,
    iframeLoaded: false,
    iframeHeight: 600,
    uniqueId: 1,
    iframeElement: null,
    
    init() {
      // Listen for close all modals event
      window.addEventListener('close-all-modals', () => {
        if (this.isOpen) this.close();
      });
    },
    
    /**
     * Open the project modal with the given project
     * @param {Object} project - The project to display
     */
    open(project) {
      // Generate new ID for cache busting
      this.uniqueId = Date.now();
      
      // Reset state
      this.iframeLoaded = false;
      this.project = project;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Reset iframe height
      this.iframeHeight = 600;
      
      // Create iframe after a short delay to ensure DOM is ready
      setTimeout(() => {
        this.createIframe();
        
        // Reset scroll position
        const modalContent = document.querySelector('#projectModal .modal-content');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 50);
    },
    
    /**
     * Close the project modal
     */
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
      
      // Clean up iframe
      this.removeIframe();
      
      // Delay nullifying project to prevent template errors during transition
      setTimeout(() => {
        this.project = null;
      }, 300);
    },
    
    /**
     * Create the iframe for the project demo
     */
    createIframe() {
      // Remove any existing iframe
      this.removeIframe();
      
      // Get container
      const container = this.$refs.iframeContainer;
      if (!container) return;
      
      // Create iframe
      const iframe = document.createElement('iframe');
      
      // Set attributes
      iframe.src = this.getIframeSrc();
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.loading = 'lazy';
      
      // Set specific attributes based on demo type
      if (this.project && this.project.demoType === 'itch') {
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.backgroundColor = 'transparent';
      } else {
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock';
        iframe.style.backgroundColor = 'white';
      }
      
      // Add load event listener
      iframe.addEventListener('load', () => this.onIframeLoad());
      
      // Store reference
      this.iframeElement = iframe;
      
      // Add to DOM
      container.appendChild(iframe);
    },
    
    /**
     * Remove the iframe from the DOM
     */
    removeIframe() {
      if (this.iframeElement && this.iframeElement.parentNode) {
        this.iframeElement.parentNode.removeChild(this.iframeElement);
      }
      
      // Clear other iframes in container
      const container = this.$refs.iframeContainer;
      if (container) {
        container.querySelectorAll('iframe').forEach(iframe => {
          iframe.parentNode.removeChild(iframe);
        });
      }
      
      this.iframeElement = null;
    },
    
    /**
     * Get the source URL for the iframe
     * @returns {string} The iframe source URL
     */
    getIframeSrc() {
      if (!this.project) return '';
      
      if (this.project.demoType === 'itch') {
        // For itch.io embeds
        return `${this.project.demoPath}?v=${this.uniqueId}`;
      } else {
        // For local demos
        return `projects/${this.project.id}/index.html?v=${this.uniqueId}`;
      }
    },
    
    /**
     * Handle iframe load event
     */
    onIframeLoad() {
      this.iframeLoaded = true;
      
      // Apply sizing to container
      const container = this.$refs.iframeContainer;
      if (container) {
        container.style.height = `${this.iframeHeight}px`;
      }
    },
    
    /**
     * Increase iframe height
     */
    increaseHeight() {
      this.iframeHeight += 100;
      this.updateIframeHeight();
    },
    
    /**
     * Decrease iframe height
     */
    decreaseHeight() {
      if (this.iframeHeight > 300) {
        this.iframeHeight -= 100;
        this.updateIframeHeight();
      }
    },
    
    /**
     * Update iframe container height
     */
    updateIframeHeight() {
      const container = this.$refs.iframeContainer;
      if (container) {
        container.style.height = `${this.iframeHeight}px`;
      }
    },
    
    /**
     * Open gallery modal with the given image
     */
    openGallery(image) {
      window.dispatchEvent(new CustomEvent('open-gallery-modal', { 
        detail: image 
      }));
    }
  }));
});

// Expose any global helper functions
window.openProjectModal = function(project) {
  window.dispatchEvent(new CustomEvent('open-project-modal', { 
    detail: project 
  }));
};

window.openGalleryImage = function(image) {
  window.dispatchEvent(new CustomEvent('open-gallery-modal', { 
    detail: image 
  }));
};