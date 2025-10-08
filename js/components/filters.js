/**
 * PROJECT FILTERING COMPONENTS
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('projectFilters', () => ({
    // Filter State
    activeFilter: 'all',
    moreDropdownOpen: false,

    // View Mode State
    viewMode: 'carousel', // 'carousel' or 'grid'

    // Carousel State
    currentIndex: 0,
    maxVisibleCards: 7, // Maximum cards visible at once (center + sides)

    // Filter Configuration (dynamically generated from projects)
    filterOptions: [],

    // Dynamic Filter Arrays
    visibleFilters: [],
    overflowFilters: [],

    // Computed: Get filtered projects based on active filter
    get filteredProjects() {
      if (!window.projects) return [];
      if (this.activeFilter === 'all') return window.projects;
      return window.projects.filter(project =>
        project.skills && project.skills.includes(this.activeFilter)
      );
    },

    init() {
      this.generateFilterOptions();
      this.setupResponsiveFilters();
      this.setupCarouselEventListeners();
      this.setupSwipeNavigation();

      // Initialize carousel on next tick
      this.$nextTick(() => {
        this.updateCarousel();
      });
    },

    // Generate filter options dynamically from all project skills
    generateFilterOptions() {
      const skillsSet = new Set();

      // Collect all unique skills from projects
      if (window.projects && Array.isArray(window.projects)) {
        window.projects.forEach(project => {
          if (project.skills && Array.isArray(project.skills)) {
            project.skills.forEach(skill => {
              skillsSet.add(skill);
            });
          }
        });
      }

      // Convert to sorted array and create filter options
      const uniqueSkills = Array.from(skillsSet).sort();

      // Always start with "All Projects"
      this.filterOptions = [{ id: 'all', label: 'All Projects' }];

      // Add each unique skill as a filter option
      uniqueSkills.forEach(skill => {
        this.filterOptions.push({ id: skill, label: skill });
      });
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

      // Reset carousel to first project when filter changes
      if (this.viewMode === 'carousel') {
        this.currentIndex = 0;
        this.$nextTick(() => {
          this.updateCarousel();
        });
      }
    },

    // Carousel Navigation Methods
    nextProject() {
      if (this.filteredProjects.length === 0) return;

      // Loop to start when at end
      this.currentIndex = (this.currentIndex + 1) % this.filteredProjects.length;
      this.updateCarousel();
    },

    previousProject() {
      if (this.filteredProjects.length === 0) return;

      // Loop to end when at start
      this.currentIndex = (this.currentIndex - 1 + this.filteredProjects.length) % this.filteredProjects.length;
      this.updateCarousel();
    },

    goToProject(index) {
      if (index === this.currentIndex) {
        // If clicking center card, open project modal
        this.$dispatch('open-project', { project: this.filteredProjects[index] });
        return;
      }
      this.currentIndex = index;
      this.updateCarousel();
    },

    // Update carousel card positions with GSAP
    updateCarousel() {
      if (this.viewMode !== 'carousel' || !this.$refs.carouselWrapper) return;

      const cards = this.$refs.carouselWrapper.querySelectorAll('.carousel-card');
      const totalCards = this.filteredProjects.length;

      if (totalCards === 0) return;

      // Calculate how many cards to show on each side
      const visibleCards = Math.min(this.maxVisibleCards, totalCards);
      const sideCards = Math.ceil((visibleCards - 1) / 2); // Cards on each side of center

      cards.forEach((card, index) => {
        const relativePos = this.getRelativePosition(index, this.currentIndex, totalCards);
        const position = this.getCardPosition(relativePos, sideCards);

        // Set data attribute for CSS fallback
        card.setAttribute('data-position', position);

        // Animate with GSAP
        const config = this.getCardConfig(position, relativePos);

        if (window.gsap) {
          gsap.to(card, {
            x: config.x,
            y: config.y,
            scale: config.scale,
            rotateY: config.rotateY,
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

    // Determine card position label based on relative position and max side cards
    getCardPosition(relativePos, sideCards) {
      if (relativePos === 0) return 'center';

      const absPos = Math.abs(relativePos);
      const side = relativePos > 0 ? 'right' : 'left';

      // If within visible range, return position (e.g., 'left-1', 'right-2')
      if (absPos <= sideCards) {
        return `${side}-${absPos}`;
      }

      // Otherwise hide
      return 'hidden';
    },

    // Get card animation configuration dynamically
    getCardConfig(position, relativePos) {
      // Center card
      if (position === 'center') {
        return { x: 0, y: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 10 };
      }

      // Hidden cards
      if (position === 'hidden') {
        return { x: 0, y: 0, scale: 0.5, rotateY: 0, opacity: 0, zIndex: 1 };
      }

      // Parse position (e.g., 'left-1', 'right-2')
      const [side, distanceStr] = position.split('-');
      const distance = parseInt(distanceStr);
      const isLeft = side === 'left';

      // Calculate properties based on distance from center
      const baseOffset = 380; // Base horizontal offset
      const offsetIncrement = 300; // Additional offset per card
      const baseScale = 0.85; // Scale for first side card
      const scaleDecrement = 0.15; // Scale reduction per card
      const baseRotation = 15; // Rotation for first side card
      const rotationIncrement = 10; // Additional rotation per card
      const baseOpacity = 0.85; // Opacity for first side card
      const opacityDecrement = 0.25; // Opacity reduction per card

      const x = (baseOffset + (distance - 1) * offsetIncrement) * (isLeft ? -1 : 1);
      const scale = Math.max(0.5, baseScale - (distance - 1) * scaleDecrement);
      const rotateY = (baseRotation + (distance - 1) * rotationIncrement) * (isLeft ? 1 : -1);
      const opacity = Math.max(0.3, baseOpacity - (distance - 1) * opacityDecrement);
      const zIndex = 10 - distance;

      return { x, y: 0, scale, rotateY, opacity, zIndex };
    },

    // Setup carousel event listeners
    setupCarouselEventListeners() {
      // Keyboard navigation
      const handleKeydown = (e) => {
        if (this.viewMode !== 'carousel') return;

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

    // Setup swipe/drag navigation (works for both mouse and touch)
    setupSwipeNavigation() {
      this.$nextTick(() => {
        const wrapper = this.$refs.carouselWrapper;
        if (!wrapper) return;

        let startX = 0;
        let isDragging = false;
        const swipeThreshold = 50; // Minimum distance for swipe

        // Unified start handler (mouse + touch)
        const handleStart = (e) => {
          if (this.viewMode !== 'carousel') return;

          isDragging = true;
          startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
          wrapper.style.cursor = 'grabbing';
        };

        // Unified end handler (mouse + touch)
        const handleEnd = (e) => {
          if (!isDragging || this.viewMode !== 'carousel') return;

          const endX = e.type.includes('mouse')
            ? e.clientX
            : (e.changedTouches ? e.changedTouches[0].clientX : startX);

          const deltaX = endX - startX;

          // Swipe left (next) - loops to start
          if (deltaX < -swipeThreshold) {
            this.nextProject();
          }
          // Swipe right (previous) - loops to end
          else if (deltaX > swipeThreshold) {
            this.previousProject();
          }

          isDragging = false;
          wrapper.style.cursor = 'grab';
        };

        // Mouse events
        wrapper.addEventListener('mousedown', handleStart);
        window.addEventListener('mouseup', handleEnd);

        // Touch events
        wrapper.addEventListener('touchstart', handleStart, { passive: true });
        window.addEventListener('touchend', handleEnd, { passive: true });

        // Set initial cursor
        wrapper.style.cursor = 'grab';
      });
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
});
