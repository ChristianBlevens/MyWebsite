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

  const iframeId = Math.random().toString(36).substring(7);
  console.log(`[${iframeId}] Setting up iframe resize handler`);

  const {
    minHeight = 300,
    maxHeight = null // No max height limit by default
  } = options;

  let resizeInterval = null;
  let lastHeight = -1; // Start at -1 to ensure first height is always applied
  let messageListener = null;
  let isActive = true; // Track if this handler is still active

  // Function to apply height
  const applyHeight = (height) => {
    if (!isActive) {
      console.log(`[${iframeId}] Handler inactive, ignoring height:`, height);
      return;
    }

    // Apply min/max constraints only if specified
    let finalHeight = height;
    if (minHeight) finalHeight = Math.max(minHeight, finalHeight);
    if (maxHeight) finalHeight = Math.min(maxHeight, finalHeight);

    // Always apply first height, then only if changed by more than 10px
    const shouldApply = lastHeight === -1 || Math.abs(finalHeight - lastHeight) > 10;

    if (shouldApply) {
      console.log(`[${iframeId}] Applying height: ${finalHeight}px (from: ${height}px)`);
      lastHeight = finalHeight;
      container.style.height = `${finalHeight}px`;
      iframe.style.height = `${finalHeight}px`;
    }
  };

  // Listen for postMessage from iframe (for cross-origin communication)
  messageListener = (event) => {
    // Validate message is from our iframe
    try {
      // Check if this handler is still active and message is for our iframe
      if (!isActive) {
        return; // This handler has been stopped
      }

      if (event.source === iframe.contentWindow) {
        // Check for height message
        if (event.data && typeof event.data === 'object') {
          if (event.data.type === 'iframe-height' && typeof event.data.height === 'number') {
            console.log(`[${iframeId}] Received height from iframe:`, event.data.height);
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
      console.log(`[${iframeId}] Error handling message:`, e);
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
          console.log('Direct DOM height detection:', detectedHeight);
          applyHeight(detectedHeight);
          return true; // Successfully detected height
        }
      }
    } catch (e) {
      // Cross-origin iframe - can't access content
      console.log('Cross-origin iframe - waiting for postMessage');
    }

    // Fallback for cross-origin iframes: use a sensible default
    // The iframe should send postMessage with actual height
    const defaultHeight = maxHeight ? Math.min(maxHeight, 800) : 800;
    if (lastHeight === -1) { // Only set default once (on first attempt)
      console.log('Setting default height:', defaultHeight);
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
      console.log(`[${iframeId}] Stopping resize handler`);
      isActive = false; // Mark handler as inactive

      if (resizeInterval) {
        clearInterval(resizeInterval);
        resizeInterval = null;
      }
      if (messageListener) {
        window.removeEventListener('message', messageListener);
        messageListener = null;
      }

      // Reset container height
      if (container) {
        container.style.height = '';
      }
    }
  };
}
