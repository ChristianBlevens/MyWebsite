/**
 * UTILITY FUNCTIONS
 */

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

// Automatic iframe resizing handler that uses postMessage for cross-origin iframes
function setupIframeResize(iframe, container, options = {}) {
  if (!iframe) return null;

  const {
    minHeight = 400,
    maxHeight = window.innerHeight * 0.8 // 80% of viewport height
  } = options;

  let resizeInterval = null;
  let lastHeight = minHeight;
  let messageListener = null;

  // Function to apply height
  const applyHeight = (height) => {
    const finalHeight = Math.min(maxHeight, Math.max(minHeight, height));

    if (Math.abs(finalHeight - lastHeight) > 10) {
      lastHeight = finalHeight;
      container.style.height = `${finalHeight}px`;
      iframe.style.height = `${finalHeight}px`;
    }
  };

  // Listen for postMessage from iframe (for cross-origin communication)
  messageListener = (event) => {
    // Validate message is from our iframe
    try {
      if (event.source === iframe.contentWindow) {
        // Check for height message
        if (event.data && typeof event.data === 'object') {
          if (event.data.type === 'iframe-height' && typeof event.data.height === 'number') {
            console.log('Received height from iframe:', event.data.height);
            applyHeight(event.data.height);

            // Stop polling once we receive postMessage
            if (resizeInterval) {
              clearInterval(resizeInterval);
              resizeInterval = null;
            }
          }
        }
      }
    } catch (e) {
      // Ignore invalid messages
    }
  };

  window.addEventListener('message', messageListener);

  // Function to handle iframe resizing via direct DOM access
  const resizeIframe = () => {
    try {
      // Try to access iframe content (works for same-origin)
      const doc = iframe.contentWindow?.document;
      if (doc && doc.body) {
        const heights = [
          doc.body.scrollHeight,
          doc.body.offsetHeight,
          doc.documentElement?.scrollHeight,
          doc.documentElement?.offsetHeight
        ].filter(h => h > 0);

        if (heights.length > 0) {
          const detectedHeight = Math.max(...heights);
          applyHeight(detectedHeight);
          return true; // Successfully detected height
        }
      }
    } catch (e) {
      // Cross-origin iframe - can't access content
    }

    // Fallback for cross-origin iframes: use a sensible default
    // The iframe should send postMessage with actual height
    const defaultHeight = Math.min(maxHeight, 800);
    if (lastHeight === minHeight) { // Only set default once
      applyHeight(defaultHeight);
    }
    return false; // Could not detect exact height
  };

  // Request height from iframe via postMessage
  const requestHeight = () => {
    try {
      iframe.contentWindow?.postMessage({ type: 'request-height' }, '*');
    } catch (e) {
      // Ignore if can't post message
    }
  };

  // Continuous monitoring for dynamic content changes
  const startContinuousResize = () => {
    // Initial resize
    setTimeout(() => {
      resizeIframe();
      requestHeight(); // Ask iframe for its height
    }, 100);

    // Check periodically for the first 5 seconds (content loading)
    let attempts = 0;
    resizeInterval = setInterval(() => {
      resizeIframe();
      requestHeight();
      attempts++;

      // After 20 attempts (5 seconds), reduce frequency
      if (attempts >= 20) {
        clearInterval(resizeInterval);
        // Continue checking but less frequently (every 3 seconds)
        resizeInterval = setInterval(() => {
          resizeIframe();
          requestHeight();
        }, 3000);
      }
    }, 250);
  };

  // Handle iframe load event
  iframe.addEventListener('load', () => {
    startContinuousResize();
  });

  // Start immediately if already loaded
  if (iframe.contentDocument?.readyState === 'complete') {
    startContinuousResize();
  }

  // Also start on first call
  startContinuousResize();

  // Return cleanup function
  return {
    stop: () => {
      if (resizeInterval) {
        clearInterval(resizeInterval);
        resizeInterval = null;
      }
      if (messageListener) {
        window.removeEventListener('message', messageListener);
        messageListener = null;
      }
    }
  };
}
