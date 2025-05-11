/**
 * Christian Blevens Portfolio
 * Utility Functions
 * 
 * This file contains reusable utility functions used throughout the portfolio.
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(fn, delay = 300) {
  let timeout;
  
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} fn - The function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(fn, limit = 300) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Get viewport dimensions
 * @returns {Object} Object with width and height properties
 */
function getViewportDimensions() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
}

/**
 * Check if an element is in viewport
 * @param {HTMLElement} element - The element to check
 * @param {number} offset - Offset in pixels
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element, offset = 0) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.bottom >= 0 - offset &&
    rect.right >= 0 - offset &&
    rect.top <= viewportHeight + offset &&
    rect.left <= viewportWidth + offset
  );
}

/**
 * Preload images to improve performance
 * @param {Array} imageUrls - Array of image URLs to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
function preloadImages(imageUrls = []) {
  const promises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
  });
  
  return Promise.all(promises);
}

/**
 * Format date to a readable string
 * @param {Date|string} date - Date object or date string
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date string
 */
function formatDate(date, locale = 'en-US') {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Safe JSON parsing with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback
 */
function safeParseJSON(jsonString, fallback = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return fallback;
  }
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
function generateUniqueId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Detect browser and device information
 * @returns {Object} Browser and device information
 */
function detectBrowser() {
  const userAgent = navigator.userAgent;
  const browsers = {
    chrome: /chrome/i.test(userAgent) && !/edge/i.test(userAgent),
    safari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
    firefox: /firefox/i.test(userAgent),
    edge: /edge/i.test(userAgent),
    ie: /msie|trident/i.test(userAgent),
    opera: /opera/i.test(userAgent)
  };
  
  const devices = {
    mobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    tablet: /ipad/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent)),
    desktop: !(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent))
  };
  
  return { browsers, devices };
}

// Export utilities to global scope for use throughout the site
window.utils = {
  debounce,
  throttle,
  getViewportDimensions,
  isInViewport,
  preloadImages,
  formatDate,
  safeParseJSON,
  generateUniqueId,
  detectBrowser
};