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

    // Filter Configuration
    filterOptions: [],
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
    },

    // Generate filter options dynamically from project skills
    generateFilterOptions() {
      const skillsSet = new Set();

      if (window.projects && Array.isArray(window.projects)) {
        window.projects.forEach(project => {
          if (project.skills && Array.isArray(project.skills)) {
            project.skills.forEach(skill => skillsSet.add(skill));
          }
        });
      }

      const uniqueSkills = Array.from(skillsSet);

      // Guaranteed order for first buttons (skip if they don't exist)
      const guaranteedOrder = ['AI', 'Web Development', 'Unity'];
      const guaranteedSkills = [];
      const remainingSkills = [];

      guaranteedOrder.forEach(skill => {
        if (uniqueSkills.includes(skill)) {
          guaranteedSkills.push(skill);
        }
      });

      uniqueSkills.forEach(skill => {
        if (!guaranteedOrder.includes(skill)) {
          remainingSkills.push(skill);
        }
      });

      // Fisher-Yates shuffle remaining skills
      for (let i = remainingSkills.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingSkills[i], remainingSkills[j]] = [remainingSkills[j], remainingSkills[i]];
      }

      // Combine: All Projects + guaranteed + randomized
      this.filterOptions = [{ id: 'all', label: 'All Projects' }];
      guaranteedSkills.forEach(skill => {
        this.filterOptions.push({ id: skill, label: skill });
      });
      remainingSkills.forEach(skill => {
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

      const testBtn = this.createTestButton();
      const moreButtonWidth = this.getMeasuredWidth(testBtn, 'More <i class="fas fa-chevron-down ml-2 text-xs"></i>') + 16;

      this.visibleFilters = [];
      this.overflowFilters = [];

      let usedWidth = 0;

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

    // Set active filter
    setFilter(filterId) {
      this.activeFilter = filterId;
      this.moreDropdownOpen = false;
    },

    // Utility: Create test button for width measurements
    createTestButton() {
      const testBtn = document.createElement('button');
      testBtn.className = 'filter-button px-4 py-2 rounded-md text-sm font-medium invisible';
      testBtn.style.position = 'absolute';
      document.body.appendChild(testBtn);
      return testBtn;
    },

    // Utility: Get measured width of text
    getMeasuredWidth(testBtn, text) {
      testBtn.innerHTML = text;
      return testBtn.offsetWidth;
    },

    // Utility: Clean up test button
    cleanupTestButton(testBtn) {
      document.body.removeChild(testBtn);
    }
  }));

  // Dynamic Skill Tags Component
  Alpine.data('dynamicSkillTags', (skills) => ({
    allSkills: skills || [],
    visibleSkills: [],
    remainingCount: 0,

    init() {
      this.$nextTick(() => {
        this.calculateVisibleSkills();
        this.setupResizeHandling();
      });
    },

    setupResizeHandling() {
      const debouncedResize = debounce(() => this.calculateVisibleSkills(), 100);
      window.addEventListener('resize', debouncedResize);
    },

    // Calculate which skills to display with multi-row support and +N overflow
    calculateVisibleSkills() {
      if (!this.allSkills || this.allSkills.length === 0) {
        this.visibleSkills = [];
        this.remainingCount = 0;
        return;
      }

      const containerWidth = this.$el.clientWidth;
      const testEl = document.createElement('span');
      testEl.className = 'skill-tag';
      testEl.style.position = 'absolute';
      testEl.style.visibility = 'hidden';
      testEl.style.whiteSpace = 'nowrap';
      document.body.appendChild(testEl);

      const gap = 8;
      const rows = [];
      let currentRow = [];
      let currentRowWidth = 0;

      // Build rows by adding skills until they wrap
      for (let i = 0; i < this.allSkills.length; i++) {
        const skill = this.allSkills[i];
        testEl.textContent = skill;
        const skillWidth = testEl.offsetWidth;
        const widthWithGap = currentRowWidth + skillWidth + (currentRow.length > 0 ? gap : 0);

        if (widthWithGap <= containerWidth) {
          currentRow.push(skill);
          currentRowWidth = widthWithGap;
        } else {
          if (currentRow.length > 0) {
            rows.push({ skills: [...currentRow], width: currentRowWidth });
          }
          currentRow = [skill];
          currentRowWidth = skillWidth;
        }
      }

      if (currentRow.length > 0) {
        rows.push({ skills: [...currentRow], width: currentRowWidth });
      }

      const allVisibleSkills = rows.flatMap(row => row.skills);
      const allSkillsShown = allVisibleSkills.length === this.allSkills.length;

      if (allSkillsShown) {
        this.visibleSkills = allVisibleSkills;
        this.remainingCount = 0;
      } else {
        // Add +N indicator
        const remainingCount = this.allSkills.length - allVisibleSkills.length;
        testEl.textContent = `+${remainingCount}`;
        const plusTagWidth = testEl.offsetWidth;

        const lastRow = rows[rows.length - 1];
        const plusTagTotalWidth = lastRow.width + plusTagWidth + gap;

        if (plusTagTotalWidth <= containerWidth) {
          this.visibleSkills = allVisibleSkills;
          this.remainingCount = remainingCount;
        } else {
          // Remove from last row to make room for +N
          let removedCount = 0;

          if (rows.length > 1) {
            while (lastRow.skills.length > 0) {
              lastRow.skills.pop();
              removedCount++;

              lastRow.width = 0;
              for (let j = 0; j < lastRow.skills.length; j++) {
                testEl.textContent = lastRow.skills[j];
                lastRow.width += testEl.offsetWidth + (j > 0 ? gap : 0);
              }

              const newRemainingCount = remainingCount + removedCount;
              testEl.textContent = `+${newRemainingCount}`;
              const newPlusTagWidth = testEl.offsetWidth;
              const newPlusTagTotalWidth = lastRow.width + newPlusTagWidth + (lastRow.skills.length > 0 ? gap : 0);

              if (newPlusTagTotalWidth <= containerWidth || lastRow.skills.length === 0) {
                this.remainingCount = newRemainingCount;
                break;
              }
            }

            if (lastRow.skills.length === 0) {
              rows.pop();
            }
          } else {
            // Only one row - keep entire first row
            this.remainingCount = 0;
          }

          this.visibleSkills = rows.flatMap(row => row.skills);
        }
      }

      document.body.removeChild(testEl);
    }
  }));
});
