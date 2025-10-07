/**
 * SCROLL-BASED COMPONENTS
 */

document.addEventListener('alpine:init', () => {
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
});
