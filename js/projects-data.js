/**
 * Christian Blevens Portfolio
 * Projects Data Module
 * 
 * This file defines all project data used throughout the portfolio.
 * It follows a consistent schema for each project object.
 */

/**
 * Projects data schema:
 * 
 * id: Unique identifier
 * title: Project name
 * image: Main thumbnail image URL
 * description: Short project description
 * details: Detailed project description
 * features: Array of feature bullet points
 * skills: Array of skills/technologies used
 * gallery: Array of additional image URLs
 * demoType: 'local' or 'itch' - determines how demo is loaded
 * demoPath: Path to demo (local folder or itch.io URL)
 * demoTitle: Optional title for the demo
 * demoHref: Optional URL for "View Demo" link
 * githubUrl: Optional URL to GitHub repository
 */
window.projects = [
  {
    id: 1,
    title: "Voxel Collision Destruction",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Innovative voxel-based collision and destruction system",
    details: "A sophisticated voxel-based destruction system that allows for realistic and dynamic object destruction based on collision points and forces. The architecture is designed to be highly modular and scalable, supporting complex scenes with numerous destructible objects.",
    features: [
      "Innovative voxel collision destruction",
      "Modular, scalable architecture",
      "Unique communication class design",
      "Performance-optimized algorithms",
      "Dynamic LOD system for voxel rendering"
    ],
    skills: ["C++", "Physics", "Optimization", "Voxel Technology"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoType: "local",
    demoPath: "projects/1/index.html",
    githubUrl: "https://github.com"
  },
  {
    id: 2,
    title: "Object-Oriented Framework",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Advanced OOP framework for game systems",
    details: "Developed a robust object-oriented programming framework that allows for clean separation of concerns across game systems. The framework promotes maintainability and extensibility while ensuring efficient data-oriented communication between components.",
    features: [
      "Each system is an object",
      "Data-oriented communication",
      "Compatible with all OOP frameworks",
      "Memory-efficient component design",
      "Simplified debugging and profiling tools"
    ],
    skills: ["C++", "Object-Oriented Design", "Data-Oriented Design", "Systems Architecture"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoType: "local",
    demoPath: "projects/2/index.html",
    githubUrl: "https://github.com"
  },
  {
    id: 3,
    title: "Ability Based Multiplayer Fighting Game With Destructible Terrain",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Flexible ability system for game characters",
    details: "Created a highly flexible ability system that allows for modular composition of character skills and powers. The system is designed to be mod-safe, enabling easy expansion and customization without compromising the core functionality.",
    features: [
      "Fully modular abilities",
      "Mod-safe framework",
      "Innovative main menu",
      "Destructible terrain mechanics",
      "Real-time multiplayer networking"
    ],
    skills: ["C#", "Unity", "Game Design", "UI/UX", "Networking"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoType: "itch",
    demoPath: "https://itch.io/embed-upload/8431679?color=333333",
    demoTitle: "Ability Based Multiplayer Fighting Game With Destructible Terrain", 
    demoHref: "https://christian-blevens.itch.io/ability-based-multiplayer-fighting-game-with-destructible-terrain",
    githubUrl: "https://github.com"
  },
  {
    id: 4,
    title: "AI-Driven NPC Behavior System",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Intelligent NPC behavior system with machine learning",
    details: "Developed a sophisticated AI-driven behavior system for non-player characters that adapts to player actions and environmental conditions. The system utilizes a hybrid approach combining behavior trees, utility AI, and reinforcement learning techniques.",
    features: [
      "Dynamic behavior adaptation",
      "Emotion and memory simulation",
      "Reinforcement learning integration",
      "Realistic environment awareness",
      "Performance-optimized decision making"
    ],
    skills: ["C++", "AI", "Machine Learning", "Behavior Trees", "Python"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoType: "local",
    demoPath: "projects/4/index.html",
    githubUrl: "https://github.com"
  }
];

/**
 * Helper function to get a project by ID
 * @param {number} id - The project ID to find
 * @returns {Object|null} The project object or null if not found
 */
window.getProjectById = function(id) {
  return window.projects.find(project => project.id === id) || null;
};

/**
 * Helper function to filter projects by skill
 * @param {string} skill - The skill to filter by
 * @returns {Array} Filtered array of projects
 */
window.getProjectsBySkill = function(skill) {
  return window.projects.filter(project => project.skills.includes(skill));
};

/**
 * Helper function to get featured projects (first 3)
 * @returns {Array} Array of featured projects
 */
window.getFeaturedProjects = function() {
  return window.projects.slice(0, 3);
};