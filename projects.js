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
    demoType: "local", // Local file demo
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
    demoType: "local", // Local file demo
    demoPath: "projects/2/index.html"
  },
  {
    id: 3,
    title: "Ability Based Multiplayer Fighting Game With Destructible Terrain",
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
    demoType: "itch", // Itch.io embedded demo
    demoPath: "https://itch.io/embed-upload/8431679?color=333333",
    demoTitle: "Ability Based Multiplayer Fighting Game With Destructible Terrain", 
    demoHref: "https://christian-blevens.itch.io/ability-based-multiplayer-fighting-game-with-destructible-terrain"
  },
];