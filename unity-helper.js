/**
 * Unity WebGL Helper Functions for iframes
 */

// Listen for messages from Unity
window.addEventListener('message', function(event) {
  // Check if the message is from a Unity iframe
  if (event.data && event.data.type === 'unityReady') {
    console.log('Unity WebGL build ready in iframe');
    // You can add code here to interact with the Unity instance
  }
});

// Function to send messages to Unity instances in iframes
window.sendUnityMessage = function(projectId, gameObject, functionName, parameter) {
  const iframe = document.querySelector(`iframe[data-project-id="${projectId}"]`);
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.postMessage({
        type: 'unityMessage',
        gameObject: gameObject,
        functionName: functionName,
        parameter: parameter
      }, '*');
    } catch (e) {
      console.error('Failed to send message to Unity iframe:', e);
    }
  }
};