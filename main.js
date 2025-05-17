document.addEventListener('alpine:init', () => {
  // Utility function for debouncing events
  function debounce(func, wait = 20) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Create a global store for shared data
  Alpine.store('portfolio', {
    selectedProject: null
  });
  
  // Scroll fade component for About section
  Alpine.data('scrollFadeSection', () => ({
    videoOpacity: 0.3,
    contentOpacity: 1,
    navHeight: 0,
    profilePic: null,
    aboutSection: null,
    videoContainer: null,
    
    init() {
      // Cache DOM elements
      this.navHeight = document.querySelector('nav').offsetHeight || 0;
      this.profilePic = document.getElementById('profile-pic');
      this.aboutSection = document.getElementById('about');
      this.videoContainer = this.aboutSection?.querySelector('.video-container');
      
      // Set initial state based on current scroll position
      this.updateOpacity();
      
      // Add debounced scroll event listener
      const debouncedUpdateOpacity = debounce(() => this.updateOpacity());
      window.addEventListener('scroll', () => this.updateOpacity());//debouncedUpdateOpacity);
      
      // Force update after a small delay to ensure DOM is ready
      setTimeout(() => this.updateOpacity(), 100);
      
      // Also update on window resize as profile picture position might change
      window.addEventListener('resize', debouncedUpdateOpacity);
    },
    
    updateOpacity() {
      if (!this.profilePic || !this.aboutSection || !this.videoContainer) return;
      
      // Get profile picture position relative to the viewport
      const profileRect = this.profilePic.getBoundingClientRect();
      
      // Calculate distance from the top of the viewport to profile picture (accounting for nav)
      const distanceFromTop = profileRect.top - this.navHeight;
      
      // Set the trigger threshold to 400px from the top
      const triggerThreshold = 400;
      
      // Calculate progress: 0 when at threshold, 1 when at top
      const fadeProgress = distanceFromTop >= triggerThreshold ? 0 : (1 - (distanceFromTop / triggerThreshold)) * 1.25;
      
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
    navElement: null,
    
    init() {
      // Cache DOM elements
      this.navElement = document.querySelector('nav');
      
      // Setup smooth scrolling for navigation
      this.setupSmoothScrolling();
      
      // Add global event listener for project opening
      window.addEventListener('alpine:initialized', () => {
        console.log('Alpine initialized, components ready');
      });
    },
    
    setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Use cached nav element height
            const navHeight = this.navElement.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
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
  
  // New component for responsive filter buttons
  Alpine.data('projectFilters', () => ({
    activeFilter: 'all',
    filterOptions: [
      { id: 'all', label: 'All Projects' },
      { id: 'Webdev', label: 'Webdev' },
      { id: 'Unity', label: 'Unity' },
      { id: 'AI', label: 'AI' },
      { id: 'Data Visualization', label: 'Data Visualization' },
      { id: 'OOP', label: 'OOP' },
      { id: 'Pathfinding', label: 'Pathfinding' }
      // Add more filter options as needed
    ],
    visibleFilters: [],
    overflowFilters: [],
    moreDropdownOpen: false,
    
    init() {
      // Initial calculation of visible filters
      this.calculateVisibleFilters();
      
      // Recalculate on window resize
      const debouncedRecalculate = debounce(() => this.calculateVisibleFilters(), 200);
      window.addEventListener('resize', debouncedRecalculate);
      
      // Make sure we calculate after everything is fully loaded
      window.addEventListener('load', () => this.calculateVisibleFilters());
    },
    
    calculateVisibleFilters() {
      // Get container width
      const containerWidth = this.$refs.filterContainer.clientWidth;
      
      // Create a test element to measure button widths
      const testBtn = document.createElement('button');
      testBtn.className = 'filter-button px-4 py-2 rounded-md text-sm font-medium invisible';
      testBtn.style.position = 'absolute';
      document.body.appendChild(testBtn);
      
      // Estimate "More" dropdown button width
      testBtn.innerHTML = 'More <i class="fas fa-chevron-down ml-2 text-xs"></i>';
      const moreButtonWidth = testBtn.offsetWidth + 16; // Add margin
      
      // Start fresh
      this.visibleFilters = [];
      this.overflowFilters = [];
      
      // Track used width
      let usedWidth = 0;
      let needsMoreButton = false;
      
      // For each filter option
      for (let i = 0; i < this.filterOptions.length; i++) {
        const option = this.filterOptions[i];
        
        // Measure this option's button width
        testBtn.textContent = option.label;
        const buttonWidth = testBtn.offsetWidth + 16; // Add margin
        
        // See if we need a "More" button based on remaining options
        const remainingOptions = this.filterOptions.length - i - 1;
        needsMoreButton = remainingOptions > 0;
        
        // Available width (considering "More" button if needed)
        const availableWidth = containerWidth - (needsMoreButton ? moreButtonWidth : 0);
        
        // If this button fits
        if (usedWidth + buttonWidth <= availableWidth) {
          this.visibleFilters.push(option);
          usedWidth += buttonWidth;
        } else {
          // This and all remaining options go to overflow
          this.overflowFilters = this.filterOptions.slice(i);
          break;
        }
      }
      
      // Clean up
      document.body.removeChild(testBtn);
    },
    
    setFilter(filterId) {
      this.activeFilter = filterId;
      this.moreDropdownOpen = false;
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
        emailjs.init(window.config.emailjs.publicKey);
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
          window.config.emailjs.serviceId,
          window.config.emailjs.templateId,
          templateParams
        );
        
        this.resetForm();
      } catch (error) {
        console.error("Form submission error:", error);
        this.errorMessage = error.message || 'There was an error submitting the form. Please try again.';
      } finally {
        this.submitting = false;
      }
    },
    
    resetForm() {
      // Reset form after successful submission
      this.formData = { name: '', email: '', message: '' };
      this.formSubmitted = true;
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.formSubmitted = false;
      }, 5000);
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
      // Listen for events on window instead of $root
        window.addEventListener('open-project', (event) => {
            console.log('Project modal received open event', event.detail);
            if (event.detail && event.detail.project) {
                this.openProjectModal(event.detail.project);
            }
        });
        
        // Keep the store watcher as a backup
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
    
    // Create a base iframe with common properties
    createBaseIframe() {
      const iframe = document.createElement('iframe');
      iframe.src = this.getIframeSrc();
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.loading = 'lazy';
      return iframe;
    },
    
    // Demo type configuration objects
    getDemoTypeConfig() {
	  return {
		"external": () => {
		  const externalContainer = document.createElement('div');
		  externalContainer.className = 'external-demo-container';
		  
		  const img = document.createElement('img');
		  img.src = this.project.image;
		  img.className = 'external-demo-image';
		  img.alt = `${this.project.title} preview`;
		  
		  const linkButton = document.createElement('a');
		  linkButton.href = this.project.demoPath;
		  linkButton.target = '_blank';
		  linkButton.rel = 'noopener noreferrer';
		  linkButton.className = 'external-demo-button';
		  linkButton.textContent = 'Visit Site';
		  
		  externalContainer.appendChild(img);
		  externalContainer.appendChild(linkButton);
		  return externalContainer;
		},
		"itch": () => {
		  const iframe = this.createBaseIframe();
		  iframe.frameBorder = '0';
		  iframe.allowFullscreen = true;
		  iframe.style.backgroundColor = 'transparent';
		  return iframe;
		},
		"local": () => {
		  const iframe = this.createBaseIframe();
		  iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-pointer-lock';
		  iframe.style.backgroundColor = 'white';
		  return iframe;
		}
	  };
	},
    
    createIframe() {
      this.removeIframe();
      
      const container = this.$refs.iframeContainer;
      if (!container) return;
      
      const demoTypeConfigs = this.getDemoTypeConfig();
      const createElementFn = demoTypeConfigs[this.project.demoType];
      
      if (!createElementFn) return;
      
      const element = createElementFn();
      container.appendChild(element);
      
      // Common handling
      if (this.project.demoType !== "external") {
        element.addEventListener('load', () => this.iframeLoaded = true);
        element.addEventListener('error', () => this.iframeLoaded = true);
      } else {
        this.iframeLoaded = true;
      }
      
      // Failsafe for iframe loading
      setTimeout(() => this.iframeLoaded = true, 8000);
    },
    
    removeIframe() {
      const container = this.$refs.iframeContainer;
      if (container) {
        while (container.firstChild) {
          container.firstChild.remove();
        }
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
    },
    
    hasGithub() {
      return this.project && this.project.githubUrl;
    },
    
    getGithubUrl() {
      return this.project && this.project.githubUrl ? this.project.githubUrl : null;
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
    resumeUrl: 'https://docs.google.com/document/d/1purg7IyVGjn9Mu3oNINaXV6l9QY-MBYi_blIqYnCzNM',
    isInitialized: false,
    
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
      
      // Initialize only when first opened
      if (!this.isInitialized) {
        this.isInitialized = true;
        // Additional initialization can go here
      }
      
      // Reset iframe load state
      if (this.$refs.resumeFrame) {
        this.$refs.resumeFrame.src = this.resumeUrl + "/preview";
      }
    },
    
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    },
	
	downloadResume() {
		// Google Drive export formats: 
		// pdf, docx, txt, rtf, odt, epub, html, zip
		const exportFormat = 'pdf';
		const downloadUrl = `${this.resumeUrl}/export?format=${exportFormat}`;
		
		// Create a temporary anchor element to trigger the download
		const tempLink = document.createElement('a');
		tempLink.href = downloadUrl;
		tempLink.setAttribute('download', 'Christian_Blevens_Resume.pdf');
		tempLink.setAttribute('target', '_blank');
		
		// Append to body, click to trigger download, then remove
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
	  }
  }));
  
  Alpine.data('dynamicSkillTags', (skills) => ({
	  // Store the original skills array
	  allSkills: skills || [],
	  
	  // State variables
	  containerWidth: 0,
	  visibleSkills: [],
	  remainingCount: 0,
	  maxRows: 2, // Allow up to 2 rows of skills (can be adjusted)
	  
	  // Initialize measurements and calculations
	  init() {
		// Initial calculation after Alpine hydrates the DOM
		this.$nextTick(() => {
		  this.measureAndUpdate();
		  
		  // Create a debounced resize handler
		  const debouncedResize = debounce(() => this.measureAndUpdate(), 100);
		  window.addEventListener('resize', debouncedResize);
		});
	  },
	  
	  // Measure container and calculate visible skills
	  measureAndUpdate() {
		// Get current container width
		this.containerWidth = this.$el.clientWidth;
		
		// Calculate how many skills can fit
		this.calculateVisibleSkills();
	  },
	  
	  // Calculate which skills to show with multi-row support
	  calculateVisibleSkills() {
		// Guard against empty skills array
		if (!this.allSkills || this.allSkills.length === 0) {
		  this.visibleSkills = [];
		  this.remainingCount = 0;
		  return;
		}
		
		// Create a hidden test element to measure skill widths
		const testEl = document.createElement('span');
		testEl.className = 'skill-tag';
		testEl.style.position = 'absolute';
		testEl.style.visibility = 'hidden';
		testEl.style.whiteSpace = 'nowrap';
		document.body.appendChild(testEl);
		
		const gap = 8; // 8px gap between tags (as specified in the div's 'gap-2' class)
		const rows = [];
		let currentRow = [];
		let currentRowWidth = 0;
		let currentRowIndex = 0;
		
		// Measure the "+N" tag width (we'll need this later)
		const maxPlusNumber = this.allSkills.length;
		testEl.textContent = `+${maxPlusNumber}`;
		const plusTagWidth = testEl.offsetWidth;
		
		// First, ensure we can at least fit one skill
		if (this.allSkills.length > 0) {
		  // Measure first skill
		  testEl.textContent = this.allSkills[0];
		  const firstSkillWidth = testEl.offsetWidth;
		  
		  // If we can't even fit one skill, just show the count
		  if (firstSkillWidth > this.containerWidth) {
			this.visibleSkills = [];
			this.remainingCount = this.allSkills.length;
			document.body.removeChild(testEl);
			return;
		  }
		}
		
		// Process each skill to see if it fits in the multi-row layout
		for (let i = 0; i < this.allSkills.length; i++) {
		  const skill = this.allSkills[i];
		  
		  // Measure this skill's width
		  testEl.textContent = skill;
		  const skillWidth = testEl.offsetWidth;
		  
		  // Check if this skill fits in the current row
		  if (currentRowWidth + skillWidth <= this.containerWidth) {
			// This skill fits in the current row
			currentRow.push(skill);
			currentRowWidth += skillWidth + gap;
		  } else {
			// This skill doesn't fit in current row - start a new row if allowed
			if (currentRowIndex < this.maxRows - 1) {
			  // We can start a new row
			  rows.push([...currentRow]);
			  currentRow = [skill];
			  currentRowWidth = skillWidth + gap;
			  currentRowIndex++;
			} else {
			  // We've reached max rows, need to consider the "+N" tag
			  
			  // Check if we can fit the "+N" remainder tag in the current row
			  const remainingCount = this.allSkills.length - i;
			  testEl.textContent = `+${remainingCount}`;
			  const currentPlusTagWidth = testEl.offsetWidth;
			  
			  if (currentRowWidth + currentPlusTagWidth <= this.containerWidth) {
				// The "+N" tag fits in the current row
				this.remainingCount = remainingCount;
			  } else {
				// Need to replace the last skill with the "+N" tag
				if (currentRow.length > 0) {
				  // Remove the last skill to make room for the "+N" tag
				  currentRow.pop();
				  this.remainingCount = remainingCount + 1;
				} else {
				  // Edge case: empty row but still need to show remainder
				  this.remainingCount = remainingCount;
				}
			  }
			  
			  // We've reached our limit
			  break;
			}
		  }
		}
		
		// Add the last row if it has content and we haven't hit the break
		if (currentRow.length > 0 && rows.length < this.maxRows) {
		  rows.push([...currentRow]);
		}
		
		// Clean up test element
		document.body.removeChild(testEl);
		
		// Flatten the rows into a single array of visible skills
		this.visibleSkills = rows.flat();
		
		// If we've shown all skills, no remainder
		if (this.visibleSkills.length === this.allSkills.length) {
		  this.remainingCount = 0;
		} else if (this.remainingCount === 0) {
		  // If we haven't explicitly set a remainder but haven't shown all skills
		  this.remainingCount = this.allSkills.length - this.visibleSkills.length;
		}
	  }
	}));
});