/**
 * GLOBAL STORE
 */

document.addEventListener('alpine:init', () => {
  Alpine.store('portfolio', {
    selectedProject: null
  });
});
