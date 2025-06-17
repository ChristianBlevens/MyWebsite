document.addEventListener('alpine:init', () => {
  
  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  // Debounce function to limit rapid event firing
  function debounce(func, wait = 20) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // Universal iframe resizing handler
  function setupIframeResize(iframe, frameId, options = {}) {
    if (!iframe) return null;
    
    const {
      origin = null,
      isCommentIframe = false,
      minHeight = 300,
      maxHeight = 1200
    } = options;
    
    let resizeInterval = null;
    let messageHandler = null;
    
    // Setup message listener for comment iframes
    const setupMessageListener = () => {
      if (!isCommentIframe) return;
      
      messageHandler = (event) => {
        // Skip if origin doesn't match
        if (origin && event.origin !== origin) return;
        
        // Handle resize messages from comment iframes
        if (event.data && event.data.type === 'resize' && event.data.height) {
          // Check frameId matches or no frameId specified
          if (!event.data.frameId || event.data.frameId === frameId) {
            iframe.style.height = `${Math.min(maxHeight, Math.max(minHeight, event.data.height))}px`;
          }
        }
      };
      
      window.addEventListener('message', messageHandler);
    };
    
    // Function to handle iframe resizing
    const resizeIframe = () => {
      if (isCommentIframe) {
        // Comment iframes: send message to request height
        try {
          iframe.contentWindow?.postMessage({ type: 'getHeight', frameId: frameId }, origin || '*');
        } catch (e) {
          console.log('Cannot communicate with comment iframe');
        }
      } else {
        // Project iframes: try multiple height detection methods
        try {
          // Try direct access first
          const doc = iframe.contentWindow?.document;
          if (doc) {
            // Try multiple height detection methods
            const heights = [
              doc.body?.scrollHeight,
              doc.body?.offsetHeight,
              doc.documentElement?.scrollHeight,
              doc.documentElement?.offsetHeight,
              doc.body?.clientHeight,
              doc.documentElement?.clientHeight
            ].filter(h => h > 0);
            
            if (heights.length > 0) {
              const detectedHeight = Math.max(...heights);
              iframe.style.height = `${Math.min(maxHeight, Math.max(minHeight, detectedHeight))}px`;
              return;
            }
          }
        } catch (e) {
          // Cross-origin, continue with fallback
        }
        
        // Fallback: gradually increase height if content seems cut off
        const currentHeight = parseInt(iframe.style.height) || minHeight;
        if (currentHeight < maxHeight) {
          iframe.style.height = `${currentHeight + 100}px`;
        }
      }
    };
    
    // Setup message listener for comment iframes
    if (isCommentIframe) {
      setupMessageListener();
    }
    
    // Start periodic resizing
    const startResize = () => {
      // Initial resize after delay
      setTimeout(resizeIframe, 500);
      
      // For comment iframes, keep checking periodically
      if (isCommentIframe) {
        resizeInterval = setInterval(resizeIframe, 250);
      } else {
        // For project iframes, check less frequently and stop after a few attempts
        let attempts = 0;
        resizeInterval = setInterval(() => {
          resizeIframe();
          attempts++;
          // Stop trying after 10 attempts (2.5 seconds) for project iframes
          if (attempts >= 10) {
            clearInterval(resizeInterval);
            resizeInterval = null;
          }
        }, 250);
      }
    };
    
    // Handle iframe load event
    iframe.addEventListener('load', startResize);
    
    // If iframe already loaded, start immediately
    if (iframe.contentDocument?.readyState === 'complete') {
      startResize();
    }
    
    // Return cleanup function
    return {
      stop: () => {
        if (resizeInterval) {
          clearInterval(resizeInterval);
          resizeInterval = null;
        }
        if (messageHandler) {
          window.removeEventListener('message', messageHandler);
          messageHandler = null;
        }
      }
    };
  }

  // ========================================
  // GLOBAL STORE
  // ========================================
  
  Alpine.store('portfolio', {
    selectedProject: null
  });
  
  // ========================================
  // MAIN APPLICATION COMPONENT
  // ========================================
  
  Alpine.data('portfolioApp', () => ({
    // Component State
    mobileMenuOpen: false,
    projects: window.projects || [],
    navElement: null,
    mainCommentResizer: null,
    
    init() {
      this.cacheElements();
      this.setupSmoothScrolling();
      this.setupGlobalListeners();
      this.setupMainCommentIframeResize();
    },
    
    destroy() {
      // Cleanup on component destruction
      if (this.mainCommentResizer) {
        this.mainCommentResizer.stop();
        this.mainCommentResizer = null;
      }
    },
    
    // Cache frequently accessed DOM elements
    cacheElements() {
      this.navElement = document.querySelector('nav');
    },
    
    // Setup smooth scrolling for anchor navigation
    setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
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
    
    // Setup global event listeners
    setupGlobalListeners() {
      window.addEventListener('alpine:initialized', () => {
        console.log('Alpine initialized, components ready');
      });
    },
    
    // Open project modal with given project data
    openProject(project) {
      console.log('Opening project:', project.title);
      Alpine.store('portfolio').selectedProject = project;
      this.$dispatch('open-project', { project });
    },
    
    // Setup main comment iframe resize functionality
    setupMainCommentIframeResize() {
      const mainIframe = document.getElementById('mainCommentIframe');
      if (!mainIframe) return;
      
      // Use the universal resize handler for comment iframe
      this.mainCommentResizer = setupIframeResize(
        mainIframe, 
        'ChristianBlevens', 
        {
          origin: 'https://mycomments.duckdns.org',
          isCommentIframe: true,
          minHeight: 500,
          maxHeight: 1200
        }
      );
    }
  }));
  
  // ========================================
  // SCROLL-BASED COMPONENTS
  // ========================================
  
  Alpine.data('scrollFadeSection', () => ({
    // Opacity States
    videoOpacity: 0.3,
    contentOpacity: 1,
    
    // Cached Elements
    navHeight: 0,
    profilePic: null,
    aboutSection: null,
    videoContainer: null,
    
    init() {
      this.cacheElements();
      this.setupScrollHandling();
      this.performInitialUpdate();
    },
    
    // Cache DOM elements for performance
    cacheElements() {
      this.navHeight = document.querySelector('nav').offsetHeight || 0;
      this.profilePic = document.getElementById('profile-pic');
      this.aboutSection = document.getElementById('about');
      this.videoContainer = this.aboutSection?.querySelector('.video-container');
    },
    
    // Setup scroll event handling with debouncing
    setupScrollHandling() {
      const debouncedUpdateOpacity = debounce(() => this.updateOpacity());
      
      window.addEventListener('scroll', () => this.updateOpacity());
      window.addEventListener('resize', debouncedUpdateOpacity);
    },
    
    // Perform initial opacity calculation
    performInitialUpdate() {
      this.updateOpacity();
      setTimeout(() => this.updateOpacity(), 100);
    },
    
    // Calculate and update opacity values based on scroll position
    updateOpacity() {
      if (!this.profilePic || !this.aboutSection || !this.videoContainer) return;
      
      const profileRect = this.profilePic.getBoundingClientRect();
      const distanceFromTop = profileRect.top - this.navHeight;
      const triggerThreshold = 400;
      
      // Calculate fade progress (0 to 1)
      const fadeProgress = distanceFromTop >= triggerThreshold ? 0 : (1 - (distanceFromTop / triggerThreshold)) * 1.25;
      const clampedProgress = Math.max(0, Math.min(1, fadeProgress));
      
      // Update opacity values
      this.videoOpacity = Math.max(0.3, 1 - clampedProgress);
      this.contentOpacity = Math.min(1, clampedProgress * 1.5);
    }
  }));
  
  // ========================================
  // PROJECT FILTERING COMPONENTS
  // ========================================
  
  Alpine.data('projectFilters', () => ({
    // Filter State
    activeFilter: 'all',
    moreDropdownOpen: false,
    
    // Filter Configuration
    filterOptions: [
      { id: 'all', label: 'All Projects' },
      { id: 'Webdev', label: 'Webdev' },
      { id: 'Unity', label: 'Unity' },
      { id: 'AI', label: 'AI' },
      { id: 'Data Visualization', label: 'Data Visualization' },
      { id: 'OOP', label: 'OOP' },
      { id: 'Pathfinding', label: 'Pathfinding' }
    ],
    
    // Dynamic Filter Arrays
    visibleFilters: [],
    overflowFilters: [],
    
    init() {
      this.setupResponsiveFilters();
    },
    
    // Setup responsive filter button handling
    setupResponsiveFilters() {
      this.calculateVisibleFilters();
      
      const debouncedRecalculate = debounce(() => this.calculateVisibleFilters(), 200);
      window.addEventListener('resize', debouncedRecalculate);
      window.addEventListener('load', () => this.calculateVisibleFilters());
    },
    
    // Calculate which filter buttons can be displayed vs overflow
    calculateVisibleFilters() {
      const containerWidth = this.$refs.filterContainer.clientWidth;
      
      // Create test element for width measurements
      const testBtn = this.createTestButton();
      const moreButtonWidth = this.getMeasuredWidth(testBtn, 'More <i class="fas fa-chevron-down ml-2 text-xs"></i>') + 16;
      
      // Reset arrays
      this.visibleFilters = [];
      this.overflowFilters = [];
      
      let usedWidth = 0;
      
      // Process each filter option
      for (let i = 0; i < this.filterOptions.length; i++) {
        const option = this.filterOptions[i];
        const buttonWidth = this.getMeasuredWidth(testBtn, option.label) + 16;
        const remainingOptions = this.filterOptions.length - i - 1;
        const needsMoreButton = remainingOptions > 0;
        const availableWidth = containerWidth - (needsMoreButton ? moreButtonWidth : 0);
        
        if (usedWidth + buttonWidth <= availableWidth) {
          this.visibleFilters.push(option);
          usedWidth += buttonWidth;
        } else {
          this.overflowFilters = this.filterOptions.slice(i);
          break;
        }
      }
      
      this.cleanupTestButton(testBtn);
    },
    
    // Create test button element for width measurements
    createTestButton() {
      const testBtn = document.createElement('button');
      testBtn.className = 'filter-button px-4 py-2 rounded-md text-sm font-medium invisible';
      testBtn.style.position = 'absolute';
      document.body.appendChild(testBtn);
      return testBtn;
    },
    
    // Get measured width of text in test button
    getMeasuredWidth(testBtn, text) {
      testBtn.innerHTML = text;
      return testBtn.offsetWidth;
    },
    
    // Clean up test button element
    cleanupTestButton(testBtn) {
      document.body.removeChild(testBtn);
    },
    
    // Set active filter and close dropdown
    setFilter(filterId) {
      this.activeFilter = filterId;
      this.moreDropdownOpen = false;
    }
  }));
  
  Alpine.data('dynamicSkillTags', (skills) => ({
    // Configuration
    allSkills: skills || [],
    maxRows: 2,
    
    // State
    containerWidth: 0,
    visibleSkills: [],
    remainingCount: 0,
    
    init() {
      this.$nextTick(() => {
        this.measureAndUpdate();
        this.setupResizeHandling();
      });
    },
    
    // Setup resize event handling
    setupResizeHandling() {
      const debouncedResize = debounce(() => this.measureAndUpdate(), 100);
      window.addEventListener('resize', debouncedResize);
    },
    
    // Measure container and update visible skills
    measureAndUpdate() {
      this.containerWidth = this.$el.clientWidth;
      this.calculateVisibleSkills();
    },
    
    // Calculate which skills to display with multi-row support
    calculateVisibleSkills() {
      if (!this.allSkills || this.allSkills.length === 0) {
        this.resetSkillDisplay();
        return;
      }
      
      const testEl = this.createTestElement();
      const gap = 8;
      const rows = [];
      let currentRow = [];
      let currentRowWidth = 0;
      let currentRowIndex = 0;
      
      // Validate minimum space requirement
      if (!this.validateMinimumSpace(testEl)) {
        this.handleInsufficientSpace(testEl);
        return;
      }
      
      // Process each skill for multi-row layout
      for (let i = 0; i < this.allSkills.length; i++) {
        const skill = this.allSkills[i];
        const skillWidth = this.measureSkillWidth(testEl, skill);
        
        if (this.skillFitsInCurrentRow(currentRowWidth, skillWidth)) {
          this.addSkillToCurrentRow(currentRow, skill, skillWidth, gap);
          currentRowWidth += skillWidth + gap;
        } else if (this.canStartNewRow(currentRowIndex)) {
          this.startNewRow(rows, currentRow, skill, skillWidth, gap);
          currentRow = [skill];
          currentRowWidth = skillWidth + gap;
          currentRowIndex++;
        } else {
          this.handleRowOverflow(testEl, currentRow, i);
          break;
        }
      }
      
      this.finalizeSkillLayout(rows, currentRow, testEl);
    },
    
    // Reset skill display to empty state
    resetSkillDisplay() {
      this.visibleSkills = [];
      this.remainingCount = 0;
    },
    
    // Create test element for measurements
    createTestElement() {
      const testEl = document.createElement('span');
      testEl.className = 'skill-tag';
      testEl.style.position = 'absolute';
      testEl.style.visibility = 'hidden';
      testEl.style.whiteSpace = 'nowrap';
      document.body.appendChild(testEl);
      return testEl;
    },
    
    // Validate minimum space requirements
    validateMinimumSpace(testEl) {
      if (this.allSkills.length === 0) return true;
      
      testEl.textContent = this.allSkills[0];
      const firstSkillWidth = testEl.offsetWidth;
      return firstSkillWidth <= this.containerWidth;
    },
    
    // Handle insufficient space scenario
    handleInsufficientSpace(testEl) {
      this.visibleSkills = [];
      this.remainingCount = this.allSkills.length;
      document.body.removeChild(testEl);
    },
    
    // Measure width of a skill tag
    measureSkillWidth(testEl, skill) {
      testEl.textContent = skill;
      return testEl.offsetWidth;
    },
    
    // Check if skill fits in current row
    skillFitsInCurrentRow(currentRowWidth, skillWidth) {
      return currentRowWidth + skillWidth <= this.containerWidth;
    },
    
    // Add skill to current row (utility method for clarity)
    addSkillToCurrentRow(currentRow, skill, skillWidth, gap) {
      currentRow.push(skill);
    },
    
    // Check if we can start a new row
    canStartNewRow(currentRowIndex) {
      return currentRowIndex < this.maxRows - 1;
    },
    
    // Start a new row
    startNewRow(rows, currentRow, skill, skillWidth, gap) {
      rows.push([...currentRow]);
    },
    
    // Handle overflow when max rows reached
    handleRowOverflow(testEl, currentRow, startIndex) {
      const remainingCount = this.allSkills.length - startIndex;
      testEl.textContent = `+${remainingCount}`;
      const currentPlusTagWidth = testEl.offsetWidth;
      
      if (this.plusTagFitsInRow(currentRow, currentPlusTagWidth)) {
        this.remainingCount = remainingCount;
      } else {
        this.adjustForPlusTag(currentRow, remainingCount);
      }
    },
    
    // Check if plus tag fits in current row
    plusTagFitsInRow(currentRow, plusTagWidth) {
      // Simplified check - in real implementation, would measure current row width
      return true; // Placeholder for actual width calculation
    },
    
    // Adjust row to accommodate plus tag
    adjustForPlusTag(currentRow, remainingCount) {
      if (currentRow.length > 0) {
        currentRow.pop();
        this.remainingCount = remainingCount + 1;
      } else {
        this.remainingCount = remainingCount;
      }
    },
    
    // Finalize skill layout and cleanup
    finalizeSkillLayout(rows, currentRow, testEl) {
      if (currentRow.length > 0 && rows.length < this.maxRows) {
        rows.push([...currentRow]);
      }
      
      document.body.removeChild(testEl);
      
      this.visibleSkills = rows.flat();
      
      if (this.visibleSkills.length === this.allSkills.length) {
        this.remainingCount = 0;
      } else if (this.remainingCount === 0) {
        this.remainingCount = this.allSkills.length - this.visibleSkills.length;
      }
    }
  }));
  
  // ========================================
  // FORM COMPONENTS
  // ========================================
  
  Alpine.data('contactForm', () => ({
    // Form State
    formData: {
      name: '',
      email: '',
      message: ''
    },
    formSubmitted: false,
    submitting: false,
    errorMessage: null,
    
    init() {
      this.initializeEmailJS();
    },
    
    // Initialize EmailJS service
    initializeEmailJS() {
      if (window.emailjs && !window.emailjsInitialized) {
        emailjs.init(window.config.emailjs.publicKey);
        window.emailjsInitialized = true;
      }
    },
    
    // Handle form submission
    async handleSubmit() {
      this.submitting = true;
      this.errorMessage = null;
      
      try {
        this.validateForm();
        await this.sendEmail();
        this.resetForm();
      } catch (error) {
        this.handleSubmissionError(error);
      } finally {
        this.submitting = false;
      }
    },
    
    // Validate form data
    validateForm() {
      if (!this.formData.name || !this.formData.email || !this.formData.message) {
        throw new Error("Please fill out all fields");
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        throw new Error("Please enter a valid email address");
      }
    },
    
    // Send email via EmailJS
    async sendEmail() {
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
    },
    
    // Handle submission errors
    handleSubmissionError(error) {
      console.error("Form submission error:", error);
      this.errorMessage = error.message || 'There was an error submitting the form. Please try again.';
    },
    
    // Reset form after successful submission
    resetForm() {
      this.formData = { name: '', email: '', message: '' };
      this.formSubmitted = true;
      
      setTimeout(() => {
        this.formSubmitted = false;
      }, 5000);
    },
    
    // Handle keyboard shortcuts
    handleKeydown(event) {
      if (event.key === 'Enter' && event.target.tagName.toLowerCase() !== 'textarea') {
        event.preventDefault();
        this.handleSubmit();
      }
    }
  }));
  
  // ========================================
  // MODAL COMPONENTS
  // ========================================
  
  Alpine.data('projectModal', () => ({
    // Modal State
    isOpen: false,
    project: null,
    iframeLoaded: false,
    iframeHeight: 600,
    uniqueId: 1,
    markdownContent: '',
    loadingMarkdown: false,
    projectResizer: null,
    commentResizer: null,
    
    init() {
      this.setupEventListeners();
      this.setupStoreWatcher();
    },
    
    // Setup event listeners for modal opening
    setupEventListeners() {
      window.addEventListener('open-project', (event) => {
        console.log('Project modal received open event', event.detail);
        if (event.detail && event.detail.project) {
          this.openProjectModal(event.detail.project);
        }
      });
    },
    
    // Setup store watcher as backup
    setupStoreWatcher() {
      this.$watch('$store.portfolio.selectedProject', (project) => {
        if (project && !this.isOpen) {
          console.log('Opening project from store:', project.title);
          this.openProjectModal(project);
        }
      });
    },
    
    // Open project modal with given project
    async openProjectModal(project) {
      console.log('Modal opening project:', project.title);
      
      this.initializeModalState(project);
      this.resetModalPosition();
      
      await this.loadProjectDescription(project);
      
      if (this.project && this.project.demoType) {
        setTimeout(() => this.createIframe(), 50);
      } else {
        this.iframeLoaded = true;
      }
      
      // Setup comment iframe resizing after modal opens
      setTimeout(() => this.resizeCommentIframe(), 100);
    },
    
    // Initialize modal state
    initializeModalState(project) {
      this.project = project;
      this.isOpen = true;
      this.iframeLoaded = false;
      this.uniqueId = Date.now();
      this.iframeHeight = 600;
      document.body.style.overflow = 'hidden';
    },
    
    // Reset modal scroll position
    resetModalPosition() {
      setTimeout(() => {
        const modalContainer = document.querySelector('#projectDetails > div');
        if (modalContainer) {
          modalContainer.scrollTop = 0;
        }
      }, 50);
    },
    
    // Load project description (markdown or direct text)
    async loadProjectDescription(project) {
      const description = typeof project.description === 'string' ? project.description : '';
      console.log('Loading description for project:', project.title, 'Description:', description, 'Type:', typeof project.description);
      
      if (description && description.endsWith('.md')) {
        await this.loadMarkdownFile(description);
      } else {
        this.markdownContent = description || '';
        this.loadingMarkdown = false;
      }
    },
    
    // Load markdown file from server
    async loadMarkdownFile(filename) {
      this.loadingMarkdown = true;
      try {
        const fetchUrl = `markdown/${filename}`;
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
    },
    
    // Parse markdown text to HTML
    parseMarkdown(text) {
      if (!text || typeof window.markdownit === 'undefined') return text || '';
      
      try {
        const md = this.initializeMarkdownParser();
        const processedText = this.preprocessMarkdown(text);
        return md.render(processedText);
      } catch (error) {
        console.error('Markdown parsing error:', error);
        return text || '';
      }
    },
    
    // Initialize markdown parser with configuration
    initializeMarkdownParser() {
      const md = window.markdownit({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true
      });
      
      // Custom image renderer
      md.renderer.rules.image = this.createImageRenderer();
      
      return md;
    },
    
    // Create custom image renderer for markdown
    createImageRenderer() {
      return function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const srcIndex = token.attrIndex('src');
        const altIndex = token.attrIndex('alt');
        const titleIndex = token.attrIndex('title');
        
        if (srcIndex < 0) return '';
        
        const src = token.attrs[srcIndex][1];
        const alt = altIndex >= 0 ? token.attrs[altIndex][1] : '';
        const title = titleIndex >= 0 ? token.attrs[titleIndex][1] : '';
        
        console.log('Image rendering:', { src, alt, title });
        
        return `<a href="${src}" target="_blank" rel="noopener noreferrer" class="inline-block markdown-image-link">
                  <img src="${src}" alt="${alt}" title="${title}" 
                       class="max-w-full h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity markdown-image" 
                       style="max-height: 400px; object-fit: contain; display: block; margin: 1rem 0;" />
                </a>`;
      };
    },
    
    // Preprocess markdown text for custom video syntax
    preprocessMarkdown(text) {
      const videoRegex = /!video\[(.*?)\]\((.*?)\)(?:{(.*?)})?/g;
      
      return text.replace(videoRegex, (match, alt, url, attributes) => {
        const youtubeId = this.getYoutubeId(url);
        const vimeoId = this.getVimeoId(url);
        const imgurId = this.getImgurId(url);
        
        if (youtubeId) {
          return this.createYouTubeEmbed(youtubeId);
        } else if (vimeoId) {
          return this.createVimeoEmbed(vimeoId);
        } else if (imgurId) {
          return this.createImgurVideoEmbed(url);
        }
        
        return match;
      });
    },
    
    // Extract YouTube video ID from URL
    getYoutubeId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    },
    
    // Extract Vimeo video ID from URL
    getVimeoId(url) {
      const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
      const match = url.match(regExp);
      return (match && match[5]) ? match[5] : null;
    },
    
    // Extract Imgur video ID from URL
    getImgurId(url) {
      const regExp = /^.*i\.imgur\.com\/([a-zA-Z0-9]+)\.(mp4|webm)$/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    },
    
    // Create YouTube embed HTML
    createYouTubeEmbed(videoId) {
      return `<div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" width="640" height="390" 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" allowfullscreen></iframe>
              </div>`;
    },
    
    // Create Vimeo embed HTML
    createVimeoEmbed(videoId) {
      return `<div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" width="640" height="360" 
                        src="https://player.vimeo.com/video/${videoId}" 
                        frameborder="0" allowfullscreen></iframe>
              </div>`;
    },
    
    // Create Imgur video embed HTML
    createImgurVideoEmbed(url) {
      return `<div class="embed-responsive embed-responsive-16by9">
                <video class="embed-responsive-item" width="640" height="360" 
                       controls loop muted preload="metadata">
                  <source src="${url}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>`;
    },
    
    // Close modal and cleanup
    close() {
      // Stop all resize handlers
      if (this.projectResizer) {
        this.projectResizer.stop();
        this.projectResizer = null;
      }
      if (this.commentResizer) {
        this.commentResizer.stop();
        this.commentResizer = null;
      }
      this.removeIframe();
      this.isOpen = false;
      document.body.style.overflow = 'auto';
      Alpine.store('portfolio').selectedProject = null;
    },
    
    // Create iframe for project demo
    createIframe() {
      this.removeIframe();
      
      const container = this.$refs.iframeContainer;
      if (!container) return;
      
      const demoTypeConfigs = this.getDemoTypeConfigs();
      const createElementFn = demoTypeConfigs[this.project.demoType];
      
      if (!createElementFn) return;
      
      const element = createElementFn();
      container.appendChild(element);
      
      this.setupIframeHandlers(element);
    },
    
    // Setup iframe event handlers
    setupIframeHandlers(element) {
      if (this.project.demoType !== "external") {
        // Setup resize handler
        const setupResizer = () => {
          this.iframeLoaded = true;
          // Start resizing for project iframe
          this.projectResizer = setupIframeResize(
            element, 
            `project-${this.project.id || this.uniqueId}`,
            {
              origin: null,
              isCommentIframe: false,
              minHeight: 300,
              maxHeight: 1000
            }
          );
        };
        
        element.addEventListener('load', setupResizer);
        element.addEventListener('error', () => this.iframeLoaded = true);
        
        // If iframe is already loaded, setup immediately
        if (element.contentDocument?.readyState === 'complete') {
          setupResizer();
        }
      } else {
        this.iframeLoaded = true;
      }
      
      // Failsafe timeout
      setTimeout(() => {
        this.iframeLoaded = true;
      }, 8000);
    },
    
    // Remove existing iframe
    removeIframe() {
      const container = this.$refs.iframeContainer;
      if (container) {
        while (container.firstChild) {
          container.firstChild.remove();
        }
      }
    },
    
    // Get demo type configuration functions
    getDemoTypeConfigs() {
      return {
        "external": () => this.createExternalDemo(),
        "online": () => this.createOnlineIframe(),
      };
    },
    
    // Create external demo container
    createExternalDemo() {
      const container = document.createElement('div');
      container.className = 'external-demo-container';
      
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
      
      container.appendChild(img);
      container.appendChild(linkButton);
      return container;
    },
    
    // Create online iframe
    createOnlineIframe() {
      const iframe = this.createBaseIframe();
      iframe.frameBorder = '0';
      iframe.allowFullscreen = true;
      iframe.style.backgroundColor = 'transparent';
      return iframe;
    },

    // Create base iframe with common properties
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
    
    // Get iframe source URL
    getIframeSrc() {
		if (!this.project) return '';
		
		if (this.project.demoType === 'online') {
			return `${this.project.demoPath}?v=${this.uniqueId}`;
		}
		
		return 'about:blank';
	},
    
    
    // Utility Methods
    hasDemo() {
      return this.project && this.project.demoType;
    },
    
    hasGithub() {
      return this.project && this.project.githubUrl;
    },
    
    getGithubUrl() {
      return this.project && this.project.githubUrl ? this.project.githubUrl : null;
    },
    
    // Manual iframe height controls
    increaseHeight() {
      this.iframeHeight += 100;
      // Stop automatic resizing when manual control is used
      if (this.projectResizer) {
        this.projectResizer.stop();
        this.projectResizer = null;
      }
      // Update iframe element height
      this.updateIframeElementHeight();
    },
    
    decreaseHeight() {
      const minHeight = 300;
      if (this.iframeHeight > minHeight) {
        this.iframeHeight -= 100;
      }
      // Stop automatic resizing when manual control is used
      if (this.projectResizer) {
        this.projectResizer.stop();
        this.projectResizer = null;
      }
      // Update iframe element height
      this.updateIframeElementHeight();
    },
    
    // Update the actual iframe element height
    updateIframeElementHeight() {
      const container = this.$refs.iframeContainer;
      if (!container) return;
      
      const iframe = container.querySelector('iframe');
      if (iframe) {
        iframe.style.height = this.iframeHeight + 'px';
      }
    },
    
    // Resize comment iframe to fit content
    resizeCommentIframe() {
      const iframe = this.$refs.commentIframe;
      if (!iframe) return;
      
      // Use the universal resize handler for comment iframe
      this.commentResizer = setupIframeResize(
        iframe, 
        `comment-${this.project?.id || this.uniqueId}`,
        {
          origin: 'https://mycomments.duckdns.org',
          isCommentIframe: true,
          minHeight: 400,
          maxHeight: 1200
        }
      );
    }
  }));
  
  Alpine.data('galleryModal', () => ({
    // Modal State
    isOpen: false,
    image: '',
    title: '',
    index: 0,
    
    init() {
      this.setupEventListeners();
    },
    
    // Setup event listeners for gallery modal
    setupEventListeners() {
      window.addEventListener('open-gallery', (event) => {
        if (event.detail) {
          this.open(event.detail.image, event.detail.title, event.detail.index);
        }
      });
    },
    
    // Open gallery modal
    open(image, title, index) {
      this.image = image;
      this.title = title;
      this.index = index;
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    },
    
    // Close gallery modal
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    }
  }));
  
  Alpine.data('resumeModal', () => ({
    // Modal State
    isOpen: false,
    resumeLoaded: false,
    isInitialized: false,
    
    // Configuration
    resumeUrl: 'https://docs.google.com/document/d/1purg7IyVGjn9Mu3oNINaXV6l9QY-MBYi_blIqYnCzNM',
    
    init() {
      this.setupEventListeners();
    },
    
    // Setup event listeners for resume modal
    setupEventListeners() {
      window.addEventListener('open-resume', () => {
        this.open();
      });
    },
    
    // Open resume modal
    open() {
      this.isOpen = true;
      this.resumeLoaded = false;
      document.body.style.overflow = 'hidden';
      
      this.performInitialSetup();
      this.loadResumeIframe();
    },
    
    // Perform initial setup when first opened
    performInitialSetup() {
      if (!this.isInitialized) {
        this.isInitialized = true;
        // Additional initialization can go here
      }
    },
    
    // Load resume iframe with preview URL
    loadResumeIframe() {
      if (this.$refs.resumeFrame) {
        this.$refs.resumeFrame.src = this.resumeUrl + "/preview";
      }
    },
    
    // Close resume modal
    close() {
      this.isOpen = false;
      document.body.style.overflow = 'auto';
    },
    
    // Download resume as PDF
    downloadResume() {
      const exportFormat = 'pdf';
      const downloadUrl = `${this.resumeUrl}/export?format=${exportFormat}`;
      
      const tempLink = this.createDownloadLink(downloadUrl);
      this.triggerDownload(tempLink);
    },
    
    // Create temporary download link
    createDownloadLink(downloadUrl) {
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.setAttribute('download', 'Christian_Blevens_Resume.pdf');
      tempLink.setAttribute('target', '_blank');
      return tempLink;
    },
    
    // Trigger download and cleanup
    triggerDownload(tempLink) {
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
  }));
});