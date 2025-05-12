// Project data for the portfolio
window.projects = [
  {
    id: 1,
    title: "Voxel Collision Destruction",
    image: "https://i.imgur.com/vWGYYSF.jpg",
    description: "Innovative voxel-based collision and destruction system",
    features: [
      "Real-time voxel-based destruction physics",
      "Optimized collision detection algorithm",
      "Memory-efficient object pooling system",
      "Configurable destruction parameters"
    ],
    details: "A sophisticated voxel-based destruction system that allows for realistic and dynamic object destruction based on collision points and forces. The architecture is designed to be highly modular and scalable, supporting complex scenes with numerous destructible objects without sacrificing performance. The system uses spatial partitioning to efficiently handle collision detection and custom memory management to minimize garbage collection overhead.",
    skills: ["C++", "Physics", "Optimization", "Voxel Technology"],
    gallery: [
      "https://i.imgur.com/vWGYYSF.jpg",
      "https://i.imgur.com/TFwXuRk.jpg",
      "https://i.imgur.com/DjfPpaL.jpg"
    ],
    demoType: "local", // Local file demo
    demoPath: "projects/1/index.html"
  },
  {
    id: 2,
    title: "Object-Oriented Framework",
    image: "https://i.imgur.com/qs8Yw6v.jpg",
    description: "Advanced OOP framework for game systems",
    features: [
      "Decoupled system architecture",
      "Event-driven communication pattern",
      "Automated dependency resolution",
      "Comprehensive unit test coverage"
    ],
    details: "Developed a robust object-oriented programming framework that allows for clean separation of concerns across game systems. The framework promotes maintainability and extensibility while ensuring efficient data-oriented communication between components. It includes a custom reflection system to facilitate serialization and editor integration.",
    skills: ["C++", "Object-Oriented Design", "Data-Oriented Design", "Systems Architecture"],
    gallery: [
      "https://i.imgur.com/qs8Yw6v.jpg",
      "https://i.imgur.com/qsZ37mS.jpg",
      "https://i.imgur.com/2vRBtqq.jpg"
    ],
    demoType: "local", // Local file demo
    demoPath: "projects/2/index.html"
  },
  {
    id: 3,
    title: "Multiplayer Fighting Game With Destructible Terrain",
    image: "https://i.imgur.com/gM5SuRE.jpg",
    description: "Ability-based fighter with real-time terrain destruction",
    features: [
      "Component-based ability system",
      "Networked multiplayer with rollback",
      "Procedurally generated arenas",
      "Dynamic terrain deformation"
    ],
    details: "Created a highly flexible ability system that allows for modular composition of character skills and powers. The system is designed to be mod-safe, enabling easy expansion and customization without compromising the core functionality. The game features real-time terrain destruction that affects gameplay, creating dynamic battlefields that evolve during matches.",
    skills: ["C#", "Unity", "Game Design", "UI/UX", "Networking"],
    gallery: [
      "https://i.imgur.com/gM5SuRE.jpg",
      "https://i.imgur.com/8QFx1PD.jpg",
      "https://i.imgur.com/FGCnMbR.jpg"
    ],
    demoType: "itch", // Itch.io embedded demo
    demoPath: "https://itch.io/embed-upload/8431679?color=333333"
  }
];