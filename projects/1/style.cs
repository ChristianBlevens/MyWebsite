/**
 * Styles for Voxel Collision Destruction Demo
 * 
 * These styles are specific to the project and work in conjunction
 * with Tailwind CSS for the basic layout.
 */

/* Base styles for the demo */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Custom button styles */
button {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

button:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

button:hover:after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* Canvas styles */
canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Voxel block animations */
.voxel-container {
  perspective: 1000px;
}

.voxel {
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.voxel:hover {
  transform: rotateY(45deg) rotateX(45deg);
}

/* FPS counter */
#fps {
  font-family: monospace;
  font-weight: bold;
}

/* Controls overlay */
.controls-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(17, 24, 39, 0.8);
  padding: 8px 16px;
  font-size: 12px;
  color: #9ca3af;
  backdrop-filter: blur(4px);
  z-index: 10;
  transition: transform 0.3s ease;
  transform: translateY(100%);
}

.controls-overlay.visible {
  transform: translateY(0);
}

.show-controls:hover + .controls-overlay,
.controls-overlay:hover {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .btn-container {
    flex-direction: column;
  }
  
  button {
    margin-bottom: 8px;
    width: 100%;
  }
}

/* Loading indicator */
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  border: 4px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Debug panel styles */
.debug-panel {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid #374151;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  font-family: monospace;
  color: #e5e7eb;
  max-width: 200px;
  z-index: 20;
  display: none; /* Hidden by default, enable for debugging */
}

.debug-panel.active {
  display: block;
}

/* Custom slider input */
.slider-container {
  width: 100%;
  margin: 8px 0;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;  
  background: #4b5563;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%; 
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}