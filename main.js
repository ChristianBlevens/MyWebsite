document.addEventListener('alpine:init', () => {
  // Create a global store for shared data
  Alpine.store('portfolio', {
    selectedProject: null
  });
  
	// Scroll fade component for About section
	Alpine.data('scrollFadeSection', () => ({
	  videoOpacity: 0.3,
	  contentOpacity: 1,
	  
	  init() {
		// Set initial state based on current scroll position
		this.updateOpacity();
		
		// Add scroll event listener
		window.addEventListener('scroll', () => this.updateOpacity());
		
		// Force update after a small delay to ensure DOM is ready
		setTimeout(() => this.updateOpacity(), 100);
		
		// Also update on window resize as profile picture position might change
		window.addEventListener('resize', () => this.updateOpacity());
	  },
	  
	  updateOpacity() {
		// Get profile picture element
		const profilePic = document.getElementById('profile-pic');
		if (!profilePic) return; // Safety check
		
		const aboutSection = document.getElementById('about');
		if (!aboutSection) return; // Safety check
		
		const videoContainer = aboutSection.querySelector('.video-container');
		if (!videoContainer) return; // Safety check
		
		const navHeight = document.querySelector('nav').offsetHeight || 0;
		
		// Get profile picture position relative to the viewport
		const profileRect = profilePic.getBoundingClientRect();
		
		// Calculate distance from the top of the viewport to profile picture (accounting for nav)
		const distanceFromTop = profileRect.top - navHeight;
		
		// Set the trigger threshold to 200px from the top
		const triggerThreshold = 400;
		
		// Default states
		if (distanceFromTop >= triggerThreshold) {
		  // Profile picture is more than 200px from top - keep default state
		  this.videoOpacity = 1;
		  this.contentOpacity = 0;
		  return;
		}
		
		// Only start the fade when profile picture is within 200px from the top
		// Calculate progress: 0 when at threshold, 1 when at top
		const fadeProgress = 1 - ((distanceFromTop - 100) / triggerThreshold);
		
		// Ensure progress is between 0 and 1
		const clampedProgress = Math.max(0, Math.min(1, fadeProgress));
		
		// Update opacity values
		this.videoOpacity = Math.max(0.3, 1 - clampedProgress);
		this.contentOpacity = Math.min(1, clampedProgress * 1.5); // Fade in content faster
	  }
	}));
  
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
			// Adjust scroll position so nav doesn't cover the element
			const navHeight = document.querySelector('nav').offsetHeight;
			const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
			
			window.scrollTo({
			  top: targetPosition,
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
	  
	  init() {
		// Initialize EmailJS with your public key
		// We use the init function to make sure EmailJS is loaded only once
		if (window.emailjs && !window.emailjsInitialized) {
		  emailjs.init("8KsxmH3Rj7JplezyY");
		  window.emailjsInitialized = true;
		}
	  },
	  
	  async handleSubmit() {
			this.submitting = true;
			this.errorMessage = null;
			
			try {
			  // Simple validation
			  if (!this.formData.name || !this.formData.email || !this.formData.message) {
				throw new Error("Please fill out all fields");
			  }
			  
			  // Email format validation
			  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			  if (!emailRegex.test(this.formData.email)) {
				throw new Error("Please enter a valid email address");
			  }
			  
			  // Send the email using EmailJS
			  const templateParams = {
				from_name: this.formData.name,
				reply_to: this.formData.email,
				message: this.formData.message,
				to_email: 'christianblevensroot@gmail.com'
			  };
			  
			  await emailjs.send(
				'service_ml0hcx1',
				'template_kpvuafn',
				templateParams
			  );
			  
			  // Reset form after successful submission
			  this.formData = { name: '', email: '', message: '' };
			  this.formSubmitted = true;
			  
			  // Hide success message after 5 seconds
			  setTimeout(() => {
				this.formSubmitted = false;
			  }, 5000);
			} catch (error) {
			  console.error("Form submission error:", error);
			  this.errorMessage = error.message || 'There was an error submitting the form. Please try again.';
			} finally {
			  this.submitting = false;
			}
		  },
		  
		  // Add a keydown handler to support pressing Enter to submit
		  handleKeydown(event) {
			// Only trigger if the Enter key is pressed and not in a textarea (where Enter should create a new line)
			if (event.key === 'Enter' && event.target.tagName.toLowerCase() !== 'textarea') {
			  event.preventDefault();
			  this.handleSubmit();
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
  
  // Resume modal component
  Alpine.data('resumeModal', () => ({
    isOpen: false,
    resumeLoaded: false,
    resumeUrl: 'https://docs.google.com/document/d/1purg7IyVGjn9Mu3oNINaXV6l9QY-MBYi_blIqYnCzNM/preview',
    
    init() {
      // Listen for global open-resume event
      window.addEventListener('open-resume', () => {
        this.open();
      });
    },
    
    open() {
      this.isOpen = true;
      this.resumeLoaded = false;
      document.body.style.overflow = 'hidden';
      
      // Reset iframe load state
      if (this.$refs.resumeFrame) {
        this.$refs.resumeFrame.src = this.resumeUrl;
      }
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