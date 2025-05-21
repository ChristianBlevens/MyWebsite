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
    markdownContent: '',
    loadingMarkdown: false,
    
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
    
    async openProjectModal(project) {
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
      
      // Load markdown description
      await this.loadProjectDescription(project);
      
      if (this.project && this.project.demoType) {
        setTimeout(() => this.createIframe(), 50);
      } else {
        this.iframeLoaded = true;
      }
    },
    
    async loadProjectDescription(project) {
      // Ensure description is a string
      const description = typeof project.description === 'string' ? project.description : '';
      
      console.log('Loading description for project:', project.title, 'Description:', description, 'Type:', typeof project.description);
      
      // Check if description is a markdown filename
      if (description && description.endsWith('.md')) {
        this.loadingMarkdown = true;
        try {
          const fetchUrl = `markdown/${description}`;
          console.log('Fetching markdown from:', fetchUrl);
          const response = await fetch(fetchUrl);
          if (response.ok) {
            this.markdownContent = await response.text();
          } else {
            console.error('Failed to fetch markdown:', response.status, response.statusText);
            this.markdownContent = 'Description not available.';
          }
        } catch (error) {
          console.error('Error loading markdown:', error);
          this.markdownContent = 'Error loading description.';
        }
        this.loadingMarkdown = false;
      } else {
        // Use the description directly (for backwards compatibility)
        this.markdownContent = description || '';
        this.loadingMarkdown = false;
      }
    },
    
    parseMarkdown(text) {
	  if (!text || typeof window.markdownit === 'undefined') return text || '';
	  
	  try {
		// Initialize markdown-it with options
		const md = window.markdownit({
		  html: true,        // Enable HTML tags in source
		  breaks: true,      // Convert '\n' in paragraphs into <br>
		  linkify: true,     // Autoconvert URL-like text to links
		  typographer: true  // Enable some language-neutral replacement + quotes beautification
		});
		
		// YouTube URL parser - extracts video ID from various YouTube URL formats
		function getYoutubeId(url) {
		  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		  const match = url.match(regExp);
		  return (match && match[2].length === 11) ? match[2] : null;
		}

		// Vimeo URL parser - extracts video ID from Vimeo URLs
		function getVimeoId(url) {
		  const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
		  const match = url.match(regExp);
		  return (match && match[5]) ? match[5] : null;
		}
		
		// Custom rule for video links
		// This will create responsive embeds for YouTube and Vimeo links that are on their own line
		const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
		  return self.renderToken(tokens, idx, options);
		};
		
		// Track if we're inside a potential video link
		let videoUrl = null;
		
		// Override link_open renderer
		md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
		  const token = tokens[idx];
		  const hrefIndex = token.attrIndex('href');
		  
		  if (hrefIndex >= 0) {
			const href = token.attrs[hrefIndex][1];
			
			// Check if it's a YouTube or Vimeo URL
			const youtubeId = getYoutubeId(href);
			const vimeoId = getVimeoId(href);
			
			if (youtubeId || vimeoId) {
			  // Store the URL for the text renderer
			  videoUrl = {
				url: href,
				type: youtubeId ? 'youtube' : 'vimeo',
				id: youtubeId || vimeoId
			  };
			  
			  // Add a class to identify this as a video link
			  token.attrPush(['class', 'video-link']);
			}
		  }
		  
		  // Use the default renderer
		  return defaultRender(tokens, idx, options, env, self);
		};
		
		// Override link_close renderer to check if we need to convert to an embed
		const defaultLinkCloseRender = md.renderer.rules.link_close || function(tokens, idx, options, env, self) {
		  return self.renderToken(tokens, idx, options);
		};
		
		md.renderer.rules.link_close = function(tokens, idx, options, env, self) {
		  // If we have a stored video URL and this is the matching close tag
		  if (videoUrl) {
			// Get the full link with text
			const linkTextToken = tokens[idx - 1];
			
			// Check if link text is just the URL or looks like an embed indicator
			const isVideoEmbed = linkTextToken && 
								(linkTextToken.content === videoUrl.url || 
								 linkTextToken.content.match(/^\s*(video|youtube|vimeo|watch|embed)\s*$/i));
			
			// Check if the link is alone in a paragraph (own line)
			const isAloneInParagraph = (idx >= 2 && 
									   tokens[idx - 2].type === 'paragraph_open' && 
									   idx + 1 < tokens.length && 
									   tokens[idx + 1].type === 'paragraph_close');
			
			// If it's likely meant to be an embed, replace with an iframe
			if (isVideoEmbed || isAloneInParagraph) {
			  // Generate embed HTML based on video type
			  let embedHtml = '';
			  if (videoUrl.type === 'youtube') {
				embedHtml = `<div class="embed-responsive embed-responsive-16by9">
							  <iframe class="embed-responsive-item" width="640" height="390" 
									  src="https://www.youtube.com/embed/${videoUrl.id}" 
									  frameborder="0" allowfullscreen></iframe>
							</div>`;
			  } else if (videoUrl.type === 'vimeo') {
				embedHtml = `<div class="embed-responsive embed-responsive-16by9">
							  <iframe class="embed-responsive-item" width="640" height="360" 
									  src="https://player.vimeo.com/video/${videoUrl.id}" 
									  frameborder="0" allowfullscreen></iframe>
							</div>`;
			  }
			  
			  // Clear stored video URL
			  videoUrl = null;
			  
			  // Return the embed HTML instead of link close tag
			  return embedHtml;
			}
			
			// Clear stored video URL if not used
			videoUrl = null;
		  }
		  
		  // Use the default renderer
		  return defaultLinkCloseRender(tokens, idx, options, env, self);
		};

		// Also support a more explicit video embedding syntax: !video[optional text](url)
		// Similar to !image[alt](src) syntax
		const videoRegex = /!video\[(.*?)\]\((.*?)\)(?:{(.*?)})?/g;
		text = text.replace(videoRegex, (match, alt, url, attributes) => {
		  const youtubeId = getYoutubeId(url);
		  const vimeoId = getVimeoId(url);
		  
		  if (youtubeId) {
			return `<div class="embed-responsive embed-responsive-16by9">
					  <iframe class="embed-responsive-item" width="640" height="390" 
							  src="https://www.youtube.com/embed/${youtubeId}" 
							  frameborder="0" allowfullscreen></iframe>
					</div>`;
		  } else if (vimeoId) {
			return `<div class="embed-responsive embed-responsive-16by9">
					  <iframe class="embed-responsive-item" width="640" height="360" 
							  src="https://player.vimeo.com/video/${vimeoId}" 
							  frameborder="0" allowfullscreen></iframe>
					</div>`;
		  }
		  
		  // If not recognized as a video, return the original text
		  return match;
		});
		
		// Custom image renderer for better handling
		md.renderer.rules.image = function(tokens, idx, options, env, self) {
		  const token = tokens[idx];
		  const srcIndex = token.attrIndex('src');
		  const altIndex = token.attrIndex('alt');
		  const titleIndex = token.attrIndex('title');
		  
		  if (srcIndex < 0) return ''; // No source, no image
		  
		  const src = token.attrs[srcIndex][1];
		  const alt = altIndex >= 0 ? token.attrs[altIndex][1] : '';
		  const title = titleIndex >= 0 ? token.attrs[titleIndex][1] : '';
		  
		  console.log('Image rendering:', { src, alt, title });
		  
		  // Create a wrapper for the image with improved styling
		  return `<a href="${src}" target="_blank" rel="noopener noreferrer" class="inline-block markdown-image-link">
					<img src="${src}" alt="${alt}" title="${title}" 
						 class="max-w-full h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity markdown-image" 
						 style="max-height: 400px; object-fit: contain; display: block; margin: 1rem 0;" />
				  </a>`;
		};
		
		// Render the markdown content
		return md.render(text);
	  } catch (error) {
		console.error('Markdown parsing error:', error);
		return text || '';
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