/**
 * IFRAME HEIGHT MESSENGER
 * Add this script to embedded projects to communicate height to parent
 * Usage: <script src="https://yourdomain.com/js/iframe-height-messenger.js"></script>
 */

(function() {
  'use strict';

  // Only run if we're in an iframe
  if (window.self === window.top) {
    return; // Not in an iframe, no need to send messages
  }

  let lastHeight = 0;

  // Function to calculate and send current page height
  function sendHeight() {
    try {
      // Get the maximum height of the page content
      const heights = [
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ].filter(h => h > 0);

      const currentHeight = Math.max(...heights);

      // Only send if height has changed by more than 10px
      if (Math.abs(currentHeight - lastHeight) > 10) {
        lastHeight = currentHeight;

        // Send height to parent window
        window.parent.postMessage({
          type: 'iframe-height',
          height: currentHeight
        }, '*');

        console.log('Sent height to parent:', currentHeight);
      }
    } catch (e) {
      console.error('Error sending height:', e);
    }
  }

  // Listen for height requests from parent
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'request-height') {
      sendHeight();
    }
  });

  // Send height when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendHeight);
  } else {
    sendHeight();
  }

  // Send height after images and other resources load
  window.addEventListener('load', function() {
    setTimeout(sendHeight, 100);
    setTimeout(sendHeight, 500);
    setTimeout(sendHeight, 1000);
  });

  // Monitor for content changes
  // Use ResizeObserver if available (modern browsers)
  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(function() {
      sendHeight();
    });

    resizeObserver.observe(document.body);
  } else {
    // Fallback: poll for changes
    setInterval(sendHeight, 1000);
  }

  // Send height when window is resized
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(sendHeight, 100);
  });

  // Watch for dynamic content changes using MutationObserver
  if (typeof MutationObserver !== 'undefined') {
    const mutationObserver = new MutationObserver(function() {
      sendHeight();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }

})();
