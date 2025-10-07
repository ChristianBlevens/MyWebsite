/**
 * PROJECT FILTERING COMPONENTS
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('projectFilters', () => ({
    // Filter State
    activeFilter: 'all',
    moreDropdownOpen: false,

    // Filter Configuration (dynamically generated from projects)
    filterOptions: [],

    // Dynamic Filter Arrays
    visibleFilters: [],
    overflowFilters: [],

    init() {
      this.generateFilterOptions();
      this.setupResponsiveFilters();
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
