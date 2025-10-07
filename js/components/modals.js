/**
 * MODAL COMPONENTS
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('projectModal', () => ({
    // Modal State
    isOpen: false,
    project: null,
    iframeLoaded: false,
    uniqueId: 1,
    markdownContent: '',
    loadingMarkdown: false,
    resizeHandler: null,

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

      // Load comment section after a delay to ensure modal is rendered
      setTimeout(() => this.loadCommentSection(), 100);
    },

    // Initialize modal state
    initializeModalState(project) {
      console.log(`[Modal] Initializing for project: ${project.title}`);
      this.project = project;
      this.isOpen = true;
      this.iframeLoaded = false;
      this.uniqueId = Date.now();
      document.body.style.overflow = 'hidden';

      // Reset iframe container height for fresh start
      this.$nextTick(() => {
        const container = this.$refs.iframeContainer;
        if (container) {
          console.log(`[Modal] Resetting container height (was: ${container.style.height})`);
          container.style.height = '';
        }
      });
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

    // Load comment section dynamically
    loadCommentSection() {
      const container = this.$refs.commentContainer;
      if (!container || !this.project) return;

      // Clear existing content
      container.innerHTML = '';

      // Create and append script element
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/ChristianBlevens/CommentSectionWebApp@main/embed.js';
      script.setAttribute('data-instance', 'https://mycomments.duckdns.org');
      script.setAttribute('data-page-id', this.project.title.replace(/\s/g,''));
      container.appendChild(script);
    },

    // Close modal and cleanup
    close() {
      this.removeIframe();
      this.isOpen = false;
      document.body.style.overflow = 'auto';
      Alpine.store('portfolio').selectedProject = null;
    },

    // Create iframe for project demo
    createIframe() {
      console.log(`[Modal] Creating iframe for: ${this.project.title}`);
      this.removeIframe();

      const container = this.$refs.iframeContainer;
      if (!container) {
        console.log('[Modal] No container found!');
        return;
      }

      // Ensure container height is reset before creating new iframe
      console.log(`[Modal] Resetting container before iframe creation (was: ${container.style.height})`);
      container.style.height = '';

      const demoTypeConfigs = this.getDemoTypeConfigs();
      const createElementFn = demoTypeConfigs[this.project.demoType];

      if (!createElementFn) {
        console.log(`[Modal] No demo type config for: ${this.project.demoType}`);
        return;
      }

      const element = createElementFn();
      container.appendChild(element);

      this.setupIframeHandlers(element);
    },

    // Setup iframe event handlers
    setupIframeHandlers(element) {
      const container = this.$refs.iframeContainer;

      // Track loading state
      element.addEventListener('load', () => {
        this.iframeLoaded = true;
      });

      element.addEventListener('error', () => {
        this.iframeLoaded = true;
      });

      // If iframe is already loaded, mark immediately
      if (element.contentDocument?.readyState === 'complete') {
        this.iframeLoaded = true;
      }

      // Failsafe timeout
      setTimeout(() => {
        this.iframeLoaded = true;
      }, 8000);

      // Setup automatic resizing
      if (container && typeof setupIframeResize === 'function') {
        this.resizeHandler = setupIframeResize(element, container, {
          minHeight: 300,
          maxHeight: null // No max height - let content dictate size
        });
      }
    },

    // Remove existing iframe
    removeIframe() {
      // Stop resize handler
      if (this.resizeHandler) {
        this.resizeHandler.stop();
        this.resizeHandler = null;
      }

      const container = this.$refs.iframeContainer;
      if (container) {
        // Remove all children
        while (container.firstChild) {
          container.firstChild.remove();
        }
        // Reset container height so next iframe starts fresh
        container.style.height = '';
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
