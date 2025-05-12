document.addEventListener('alpine:init', () => {
  // Create a global store for shared data
  Alpine.store('portfolio', {
    selectedProject: null
  });
  
  // Main application
  Alpine.data('portfolioApp', () => ({
    mobileMenuOpen: false,
    projects: window.projects || [],
    
    init() {
      // Setup smooth scrolling for navigation
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
      
      // Preload critical images
      if (this.projects && this.projects.length > 0) {
        this.projects.slice(0, 3).forEach(project => {
          if (project.image) {
            new Image().src = project.image;
          }
        });
      }
      
      // Add global event listener for project opening
      window.addEventListener('alpine:initialized', () => {
        console.log('Alpine initialized, components ready');
      });
    },
    
    openProject(project) {
      console.log('Opening project:', project.title);
      // Store the selected project globally
      Alpine.store('portfolio').selectedProject = project;
      // Dispatch global event with project data
      this.$dispatch('open-project', { project });
    }
  }));
  
  // Contact form component
  Alpine.data('contactForm', () => ({
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
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reset form after successful submission
        this.formData = { name: '', email: '', message: '' };
        this.formSubmitted = true;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.formSubmitted = false;
        }, 5000);
      } catch (error) {
        this.errorMessage = 'There was an error submitting the form. Please try again.';
      } finally {
        this.submitting = false;
      }
    }
  }));
  
  // Project modal component
  Alpine.data('projectModal', () => ({
    isOpen: false,
    project: null,
    iframeLoaded: false,
    iframeHeight: 600,
    uniqueId: 1,
    
    init() {
      // Listen for global open-project event
      this.$root.addEventListener('open-project', (event) => {
        console.log('Project modal received open event');
        if (event.detail && event.detail.project) {
          this.openProjectModal(event.detail.project);
        }
      });
      
      // Add a backup using global store
      this.$watch('$store.portfolio.selectedProject', (project) => {
        if (project && !this.isOpen) {
          console.log('Opening project from store:', project.title);
          this.openProjectModal(project);
        }
      });
    },
    
    openProjectModal(project) {
      console.log('Modal opening project:', project.title);
      this.project = project;
      this.isOpen = true;
      this.iframeLoaded = false;
      this.uniqueId = Date.now();
      document.body.style.overflow = 'hidden';
      
      // Reset iframe height to default
      this.iframeHeight = 600;
      
      // Reset modal scroll position
      setTimeout(() => {
        const modalContainer = document.querySelector('#projectDetails > div');
        if (modalContainer) {
          modalContainer.scrollTop = 0;
        }
      }, 50);
      
      if (this.project && this.project.demoType) {
        setTimeout(() => this.createIframe(), 50);
      } else {
        this.iframeLoaded = true;
      }
    },
    
    close() {
      this.removeIframe();
      this.isOpen = false;
      document.body.style.overflow = 'auto';
      // Clear selected project from store
      Alpine.store('portfolio').selectedProject = null;
    },
    
    createIframe() {
      this.removeIframe();
      
      const container = this.$refs.iframeContainer;
      if (!container) return;
      
      const iframe = document.createElement('iframe');
      iframe.src = this.getIframeSrc();
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.loading = 'lazy';
      
      if (this.project.demoType === 'itch') {
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.backgroundColor = 'transparent';
      } else {
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock';
        iframe.style.backgroundColor = 'white';
      }
      
      iframe.addEventListener('load', () => this.iframeLoaded = true);
      iframe.addEventListener('error', () => this.iframeLoaded = true);
      
      container.appendChild(iframe);
      
      // Failsafe for iframe loading
      setTimeout(() => this.iframeLoaded = true, 8000);
    },
    
    removeIframe() {
      const container = this.$refs.iframeContainer;
      if (container) {
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.parentNode.removeChild(iframe));
      }
    },
    
    getIframeSrc() {
      if (!this.project) return '';
      
      if (this.project.demoType === 'itch') {
        return `${this.project.demoPath}?v=${this.uniqueId}`;
      } else if (this.project.demoType === 'local') {
        return `projects/${this.project.id}/index.html?v=${this.uniqueId}`;
      }
      
      return 'about:blank';
    },
    
    increaseHeight() {
      this.iframeHeight += 100;
    },
    
    decreaseHeight() {
      if (this.iframeHeight > 300) {
        this.iframeHeight -= 100;
      }
    },
    
    hasDemo() {
      return this.project && this.project.demoType;
    }
  }));
  
  // Gallery modal component
  Alpine.data('galleryModal', () => ({
    isOpen: false,
    image: '',
    title: '',
    index: 0,
    
    init() {
      // Listen for open-gallery events
      window.addEventListener('open-gallery', (event) => {
        if (event.detail) {
          this.open(event.detail.image, event.detail.title, event.detail.index);
        }
      });
    },
    
    open(image, title, index) {
      this.image = image;
      this.title = title;
      this.index = index;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    },
    
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    }
  }));
});

// Handle additional image preloading
window.addEventListener('load', () => {
  if (window.projects) {
    window.projects.forEach(project => {
      if (project.gallery && project.gallery.length > 0) {
        new Image().src = project.gallery[0];
      }
    });
  }
});