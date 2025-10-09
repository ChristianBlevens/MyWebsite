/**
 * DECK CAROUSEL COMPONENT
 * 3D card deck with fan layout and navigation
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('deckCarousel', () => ({
    // Deck State
    currentIndex: 0,
    maxVisibleCards: 11, // Maximum cards visible at once (center + sides)
    shuffleKey: 0, // Increment to force re-render on shuffle
    deckProjects: [], // Separate shuffled array for deck (doesn't affect grid)
    parentActiveFilter: 'all', // Track parent's active filter

    // Get filtered projects - uses deckProjects for deck, respects parent's filter
    get filteredProjects() {
      if (this.parentActiveFilter === 'all') return this.deckProjects;
      return this.deckProjects.filter(project =>
        project.skills && project.skills.includes(this.parentActiveFilter)
      );
    },

    init() {
      // Initialize deck projects from global projects
      this.deckProjects = window.projects ? [...window.projects] : [];

      // Get reference to parent component's activeFilter
      const parentEl = this.$el.closest('[x-data*="projectFilters"]');
      if (parentEl && parentEl._x_dataStack) {
        const parentData = parentEl._x_dataStack[0];
        if (parentData) {
          // Sync with parent's activeFilter and trigger reset animation
          Alpine.effect(() => {
            const newFilter = parentData.activeFilter || 'all';
            if (this.parentActiveFilter !== newFilter) {
              this.parentActiveFilter = newFilter;
              // Use same reset animation as shuffle
              this.triggerDeckReset();
            }
          });
        }
      }

      this.setupEventListeners();
      this.setupSwipeNavigation();

      // Initialize deck on next tick
      this.$nextTick(() => {
        this.updateDeck();
      });
    },

    // Shuffle projects randomly (only affects deck, not grid)
    shuffleProjects() {
      if (!window.projects) return;

      // Fisher-Yates shuffle - only modify deck array, not global projects
      const shuffled = [...window.projects];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      this.deckProjects = shuffled;
      this.triggerDeckReset();
    },

    // Reset deck and trigger re-animation
    triggerDeckReset() {
      this.shuffleKey++;
      this.currentIndex = 0;

      this.$nextTick(() => {
        this.updateDeck();
      });
    },

    // Navigation Methods
    nextProject() {
      if (this.filteredProjects.length === 0) return;
      this.currentIndex = (this.currentIndex + 1) % this.filteredProjects.length;
      this.updateDeck();
    },

    previousProject() {
      if (this.filteredProjects.length === 0) return;
      this.currentIndex = (this.currentIndex - 1 + this.filteredProjects.length) % this.filteredProjects.length;
      this.updateDeck();
    },

    goToProject(index) {
      if (index === this.currentIndex) {
        // If clicking center card, open project modal
        this.$dispatch('open-project', { project: this.filteredProjects[index] });
        return;
      }
      this.currentIndex = index;
      this.updateDeck();
    },

    // Update deck card positions with GSAP
    updateDeck() {
      if (!this.$refs.deckWrapper) return;

      const cards = this.$refs.deckWrapper.querySelectorAll('.carousel-card');
      const totalCards = this.filteredProjects.length;

      if (totalCards === 0) return;

      // Calculate how many cards to show on each side
      const visibleCards = Math.min(this.maxVisibleCards, totalCards);
      const sideCards = Math.ceil((visibleCards - 1) / 2);

      cards.forEach((card, index) => {
        const relativePos = this.getRelativePosition(index, this.currentIndex, totalCards);
        const position = this.getCardPosition(relativePos, sideCards);

        card.setAttribute('data-position', position);

        const config = this.getCardConfig(position, relativePos);

        if (window.gsap) {
          gsap.to(card, {
            x: config.x,
            y: config.y,
            scale: config.scale,
            rotateY: config.rotateY,
            rotateZ: config.rotateZ,
            opacity: config.opacity,
            zIndex: config.zIndex,
            duration: 0.6,
            ease: 'power2.out'
          });
        }
      });
    },

    // Get relative position with wrapping
    getRelativePosition(index, currentIndex, totalCards) {
      let relativePos = index - currentIndex;

      // Wrap around for looping
      if (relativePos > totalCards / 2) {
        relativePos -= totalCards;
      } else if (relativePos < -totalCards / 2) {
        relativePos += totalCards;
      }

      return relativePos;
    },

    // Determine card position label
    getCardPosition(relativePos, sideCards) {
      if (relativePos === 0) return 'center';

      const absPos = Math.abs(relativePos);
      const side = relativePos > 0 ? 'right' : 'left';

      if (absPos <= sideCards) {
        return `${side}-${absPos}`;
      }

      return 'hidden';
    },

    // Get card animation configuration
    getCardConfig(position, relativePos) {
      if (position === 'center') {
        return { x: 0, y: 0, scale: 1, rotateY: 0, rotateZ: 0, opacity: 1, zIndex: 10 };
      }

      if (position === 'hidden') {
        return { x: 0, y: 0, scale: 0.5, rotateY: 0, rotateZ: 0, opacity: 0, zIndex: 1 };
      }

      const [side, distanceStr] = position.split('-');
      const distance = parseInt(distanceStr);
      const isLeft = side === 'left';

      // Card fan configuration
      const baseOffset = 120;
      const offsetIncrement = 80;
      const baseScale = 0.95;
      const scaleDecrement = 0.05;
      const baseRotation = 8;
      const rotationIncrement = 4;
      const baseOpacity = 0.95;
      const opacityDecrement = 0.1;

      // Create slight arc effect with Y offset
      const yOffset = Math.pow(distance, 1.5) * 15;

      const x = (baseOffset + (distance - 1) * offsetIncrement) * (isLeft ? -1 : 1);
      const y = yOffset;
      const scale = Math.max(0.7, baseScale - (distance - 1) * scaleDecrement);

      // 2D rotation for fan effect (Z-axis)
      const rotateZ = (baseRotation + (distance - 1) * rotationIncrement) * (isLeft ? -1 : 1);

      // 3D depth rotation (Y-axis)
      const rotateY = distance * 3 * (isLeft ? 1 : -1);

      const opacity = Math.max(0.5, baseOpacity - (distance - 1) * opacityDecrement);
      const zIndex = 10 - distance;

      return { x, y, scale, rotateY, rotateZ, opacity, zIndex };
    },

    // Setup event listeners
    setupEventListeners() {
      const handleKeydown = (e) => {
        // Only handle if deck view is active
        const parentEl = this.$el.closest('[x-data*="projectFilters"]');
        if (!parentEl || !parentEl._x_dataStack) return;

        const parentData = parentEl._x_dataStack[0];
        if (!parentData || parentData.viewMode !== 'carousel') return;

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.previousProject();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextProject();
        }
      };

      window.addEventListener('keydown', handleKeydown);
    },

    // Setup swipe/drag navigation
    setupSwipeNavigation() {
      this.$nextTick(() => {
        const wrapper = this.$refs.deckWrapper;
        if (!wrapper) return;

        let startX = 0;
        let isDragging = false;
        const swipeThreshold = 50;

        const handleStart = (e) => {
          const parentEl = this.$el.closest('[x-data*="projectFilters"]');
          if (!parentEl || !parentEl._x_dataStack) return;

          const parentData = parentEl._x_dataStack[0];
          if (!parentData || parentData.viewMode !== 'carousel') return;

          isDragging = true;
          startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
          wrapper.style.cursor = 'grabbing';
        };

        const handleEnd = (e) => {
          if (!isDragging) return;

          const parentEl = this.$el.closest('[x-data*="projectFilters"]');
          if (!parentEl || !parentEl._x_dataStack) return;

          const parentData = parentEl._x_dataStack[0];
          if (!parentData || parentData.viewMode !== 'carousel') return;

          const endX = e.type.includes('mouse')
            ? e.clientX
            : (e.changedTouches ? e.changedTouches[0].clientX : startX);

          const deltaX = endX - startX;

          if (deltaX < -swipeThreshold) {
            this.nextProject();
          } else if (deltaX > swipeThreshold) {
            this.previousProject();
          }

          isDragging = false;
          wrapper.style.cursor = 'grab';
        };

        wrapper.addEventListener('mousedown', handleStart);
        window.addEventListener('mouseup', handleEnd);
        wrapper.addEventListener('touchstart', handleStart, { passive: true });
        window.addEventListener('touchend', handleEnd, { passive: true });

        wrapper.style.cursor = 'grab';
      });
    }
  }));
});
