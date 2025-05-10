/**
 * Sample Project JavaScript for Voxel Collision Destruction Demo
 * 
 * This is a placeholder script that simulates some interactions.
 * Replace with your actual project code when available.
 */

// Simulate FPS counter
let fpsCounter = document.getElementById('fps');
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

function updateFPS() {
    const now = performance.now();
    const delta = now - lastTime;
    
    if (delta > 1000) {
        fps = Math.round((frameCount * 1000) / delta);
        fpsCounter.textContent = fps;
        frameCount = 0;
        lastTime = now;
    }
    
    frameCount++;
    requestAnimationFrame(updateFPS);
}

// Start the FPS counter
updateFPS();

// Get the buttons
const generateButton = document.querySelector('button:nth-of-type(1)');
const forceButton = document.querySelector('button:nth-of-type(2)');
const resetButton = document.querySelector('button:nth-of-type(3)');

// Canvas placeholder
const canvasPlaceholder = document.querySelector('.w-full.h-64');

// Add event listeners to buttons
if (generateButton) {
    generateButton.addEventListener('click', () => {
        // Simulate generating voxels
        canvasPlaceholder.innerHTML = `
            <div class="grid grid-cols-5 grid-rows-5 gap-1 p-2">
                ${Array(25).fill(0).map(() => `
                    <div class="w-12 h-12 bg-blue-${Math.floor(Math.random() * 5) + 5}00 rounded-sm"></div>
                `).join('')}
            </div>
        `;
        console.log('Generated voxels');
    });
}

if (forceButton) {
    forceButton.addEventListener('click', () => {
        // Simulate applying force
        const voxels = document.querySelectorAll('.w-12.h-12');
        voxels.forEach(voxel => {
            // Add random transformation
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const rotate = (Math.random() - 0.5) * 90;
            voxel.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
            voxel.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        console.log('Applied force to voxels');
    });
}

if (resetButton) {
    resetButton.addEventListener('click', () => {
        // Reset the canvas
        canvasPlaceholder.innerHTML = '<p>3D Canvas Placeholder</p>';
        console.log('Reset demo');
    });
}

// Communication with parent window (the portfolio)
window.addEventListener('message', (event) => {
    // Make sure the message is from your portfolio domain
    if (event.origin !== window.origin) {
        return;
    }
    
    // Handle messages from the parent window
    if (event.data.type === 'init') {
        console.log('Received init message from portfolio');
        // Respond to confirm initialization
        window.parent.postMessage({ type: 'ready', projectId: 1 }, '*');
    }
});

// Notify parent when this project is fully loaded
window.addEventListener('load', () => {
    // Send a message to the parent window that this project is loaded
    try {
        window.parent.postMessage({ type: 'projectLoaded', projectId: 1 }, '*');
        console.log('Sent load notification to parent');
    } catch (e) {
        console.error('Error sending message to parent:', e);
    }
});

// Handle potential resize events from the parent
function handleResize() {
    // Update any size-dependent logic here
    console.log('Window resized');
}

window.addEventListener('resize', handleResize);

// Log when the iframe is visible to the user
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Demo is visible to user');
                // Potentially start animations or processing when visible
            } else {
                console.log('Demo is not visible to user');
                // Potentially pause animations or processing when not visible
            }
        });
    },
    { threshold: 0.1 } // Trigger when at least 10% of the element is visible
);

// Observe the body element to detect visibility
observer.observe(document.body);

/**
 * Placeholder for voxel engine simulation
 * This would be replaced with your actual game engine code
 */
class VoxelEngine {
    constructor(canvasElement) {
        this.canvas = canvasElement || document.createElement('canvas');
        this.isRunning = false;
        this.voxels = [];
        
        // Initialize with empty state
        this.init();
    }
    
    init() {
        console.log('Voxel engine initialized');
        this.voxels = [];
        this.isRunning = false;
        
        // In a real implementation, you would set up WebGL context, 
        // load resources, etc.
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('Voxel engine started');
        
        // Start animation loop
        this.update();
    }
    
    stop() {
        this.isRunning = false;
        console.log('Voxel engine stopped');
    }
    
    update() {
        if (!this.isRunning) return;
        
        // Simulate physics, update voxel positions, etc.
        
        // Request next frame
        requestAnimationFrame(() => this.update());
    }
    
    generateVoxels(count = 100) {
        this.voxels = Array(count).fill(0).map(() => ({
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            z: Math.random() * 100 - 50,
            size: Math.random() * 2 + 0.5,
            color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
        }));
        
        console.log(`Generated ${count} voxels`);
    }
    
    applyForce(magnitude = 10) {
        this.voxels.forEach(voxel => {
            // Apply random force vector
            const forceX = (Math.random() * 2 - 1) * magnitude;
            const forceY = (Math.random() * 2 - 1) * magnitude;
            const forceZ = (Math.random() * 2 - 1) * magnitude;
            
            // In a real implementation, you would apply physics calculations
            voxel.x += forceX;
            voxel.y += forceY;
            voxel.z += forceZ;
        });
        
        console.log(`Applied force with magnitude ${magnitude}`);
    }
}

// Create instance of the engine for future implementation
const voxelEngine = new VoxelEngine();

// Export to global scope for debugging
window.voxelEngine = voxelEngine;