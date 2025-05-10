/**
 * Projects data for Christian Blevens Portfolio
 * Compatible with both vanilla JS and Alpine.js implementations
 */

// Define projects data globally for Alpine.js to access
window.projects = [
  {
    id: 1,
    title: "Voxel Collision Destruction",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Innovative voxel-based collision and destruction system",
    features: [
      "Innovative voxel collision destruction",
      "Modular, scalable architecture",
      "Unique communication class design"
    ],
    details: "A sophisticated voxel-based destruction system that allows for realistic and dynamic object destruction based on collision points and forces. The architecture is designed to be highly modular and scalable, supporting complex scenes with numerous destructible objects.",
    skills: ["C++", "Physics", "Optimization", "Voxel Technology"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/1/index.html"
  },
  {
    id: 2,
    title: "Object-Oriented Framework",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Advanced OOP framework for game systems",
    features: [
      "Each system is an object",
      "Data-oriented communication",
      "Compatible with all OOP frameworks"
    ],
    details: "Developed a robust object-oriented programming framework that allows for clean separation of concerns across game systems. The framework promotes maintainability and extensibility while ensuring efficient data-oriented communication between components.",
    skills: ["C++", "Object-Oriented Design", "Data-Oriented Design", "Systems Architecture"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/2/index.html"
  },
  {
    id: 3,
    title: "Modular Ability System",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Flexible ability system for game characters",
    features: [
      "Fully modular abilities",
      "Mod-safe framework",
      "Innovative main menu"
    ],
    details: "Created a highly flexible ability system that allows for modular composition of character skills and powers. The system is designed to be mod-safe, enabling easy expansion and customization without compromising the core functionality.",
    skills: ["C#", "Unity", "Game Design", "UI/UX"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/3/index.html"
  },
  {
    id: 4,
    title: "Environment Tools",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Probuilder environment creation tools",
    features: [
      "Probuilder environments",
      "Wide ranging actions",
      "Business project"
    ],
    details: "Developed a suite of tools for rapid environment creation using Probuilder. These tools enable designers to quickly prototype and iterate on level designs with a wide range of functionality for terrain manipulation, object placement, and scene optimization.",
    skills: ["Unity", "Probuilder", "Level Design", "Tool Development"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/4/index.html"
  },
  {
    id: 5,
    title: "Advanced Physics System",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Octree-based physics and surface detection",
    features: [
      "Octree physics checks for surface detection",
      "Visual representation of navmesh as a graph",
      "Voxel based navigation"
    ],
    details: "Implemented an efficient physics system using octree data structures for optimized collision detection and surface analysis. The system includes visual debugging tools for navmesh visualization and supports voxel-based navigation for AI entities.",
    skills: ["C++", "Physics Programming", "Octree", "Navigation Systems"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/5/index.html"
  },
  {
    id: 6,
    title: "Behavior Simulation",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Complex behavior simulation system",
    features: [
      "Simulated complex behavior",
      "Emergent behaviors amplified",
      "Simple but complete control of simulation"
    ],
    details: "Designed and implemented a sophisticated behavior simulation system that models complex interactions between entities. The system produces emergent behaviors that evolve over time while providing intuitive controls for adjusting simulation parameters.",
    skills: ["AI", "Behavior Trees", "Simulation", "Game AI"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png",
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/6/index.html"
  },
  {
    id: 7,
    title: "Source-Inspired Mechanics",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Mechanics inspired by Source engine games",
    features: [
      "Finely emulated source behavior",
      "Unique implementation of abilities",
      "Local Multiplayer"
    ],
    details: "Recreated and refined gameplay mechanics inspired by Source engine games, with a focus on precise movement and physics interactions. The project includes a unique ability system and supports local multiplayer gameplay.",
    skills: ["C#", "Unity", "Physics Programming", "Multiplayer"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/7/index.html"
  },
  {
    id: 8,
    title: "2D Physics Platformer",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "2D platformer with custom physics",
    features: [
      "2D physics simulation",
      "Variable resolution levels",
      "Simple yet robust solution"
    ],
    details: "Developed a 2D platformer game with a custom physics system that supports variable resolution levels. The solution is designed to be simple to understand while providing robust physics interactions for platforming mechanics.",
    skills: ["C#", "2D Physics", "Game Design", "Unity"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/8/index.html"
  },
  {
    id: 9,
    title: "NPC Navigation System",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Efficient navigation for grouped NPCs",
    features: [
      "Efficient navigation of grouped NPCs",
      "Obstacle, NPC, and sight line visualization",
      "Dynamic NPC clustering"
    ],
    details: "Created an advanced navigation system for efficiently managing groups of NPCs. The system includes visualization tools for obstacles, sight lines, and dynamic clustering of characters to optimize pathfinding and movement behaviors.",
    skills: ["AI", "Pathfinding", "Optimization", "Game AI"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/9/index.html"
  },
  {
    id: 10,
    title: "Natural Selection Simulation",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "AI-driven natural selection simulation",
    features: [
      "Natural selection simulation",
      "Efficient search function",
      "Database management"
    ],
    details: "Implemented a simulation of natural selection processes with AI-driven entities that evolve over time. The project includes efficient search functionality for analyzing simulation data and a database system for tracking evolutionary changes.",
    skills: ["AI", "Simulation", "Database", "Algorithms"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/10/index.html"
  },
  {
    id: 11,
    title: "Math Visualization Tool",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Tool for validating math through visualization",
    features: [
      "Math validation through visualization",
      "Built with no constraints in mind",
      "UI for camera controls"
    ],
    details: "Developed a tool for validating mathematical concepts through interactive visualizations. The tool provides flexible camera controls and was built without arbitrary constraints to enable exploration of a wide range of mathematical ideas.",
    skills: ["Mathematics", "Visualization", "UI Design", "Tool Development"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/11/index.html"
  },
  {
    id: 12,
    title: "Financial Simulation",
    image: "https://i.imgur.com/pb87Imr.png",
    description: "Real-world financial simulation project",
    features: [
      "Real-world financial project",
      "Long-term extensive planning",
      "Cooperation based leadership"
    ],
    details: "Created a financial simulation model for a real-world business project. The development involved extensive long-term planning and required cooperation-based leadership to coordinate between technical and business stakeholders.",
    skills: ["Financial Modeling", "Simulation", "Project Management", "Business Analytics"],
    gallery: [
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png", 
      "https://i.imgur.com/pb87Imr.png"
    ],
    demoPath: "projects/12/index.html"
  }
];