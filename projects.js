// Project data for the portfolio
(function() {
  // Project factory function to reduce redundancy
  function createProject(id, title, image, description, features, details, skills, gallery, demoType = null, demoPath = null, githubUrl = null) {
    return {
      id,
      title,
      image,
      description,
      features,
      details,
      skills,
      gallery,
      ...(demoType && { demoType }),
      ...(demoPath && { demoPath }),
      ...(githubUrl && { githubUrl })
    };
  }

  // Projects data using the factory function
  window.projects = [
    createProject(
      1,
      "Voxel Collision Destruction",
      "https://i.imgur.com/vWGYYSF.jpg",
      "Innovative voxel-based collision and destruction system",
      [
        "Real-time voxel-based destruction physics",
        "Optimized collision detection algorithm",
        "Memory-efficient object pooling system",
        "Configurable destruction parameters"
      ],
      "A sophisticated voxel-based destruction system that allows for realistic and dynamic object destruction based on collision points and forces. The architecture is designed to be highly modular and scalable, supporting complex scenes with numerous destructible objects without sacrificing performance. The system uses spatial partitioning to efficiently handle collision detection and custom memory management to minimize garbage collection overhead.",
      ["C++", "Physics", "Optimization", "Voxel Technology"],
      [
        "https://i.imgur.com/vWGYYSF.jpg",
        "https://i.imgur.com/TFwXuRk.jpg",
        "https://i.imgur.com/DjfPpaL.jpg"
      ],
      "local",
      "projects/1/index.html",
      "https://github.com/christianblevens/voxel-destruction"
    ),
    
    createProject(
      2,
      "Object-Oriented Framework",
      "https://i.imgur.com/qs8Yw6v.jpg",
      "Advanced OOP framework for game systems",
      [
        "Decoupled system architecture",
        "Event-driven communication pattern",
        "Automated dependency resolution",
        "Comprehensive unit test coverage"
      ],
      "Developed a robust object-oriented programming framework that allows for clean separation of concerns across game systems. The framework promotes maintainability and extensibility while ensuring efficient data-oriented communication between components. It includes a custom reflection system to facilitate serialization and editor integration.",
      ["C++", "Object-Oriented Design", "Data-Oriented Design", "Systems Architecture"],
      [
        "https://i.imgur.com/qs8Yw6v.jpg",
        "https://i.imgur.com/qsZ37mS.jpg",
        "https://i.imgur.com/2vRBtqq.jpg"
      ],
      "local",
      "projects/2/index.html"
    ),
    
    createProject(
      3,
      "Multiplayer Fighting Game With Destructible Terrain",
      "https://i.imgur.com/gM5SuRE.jpg",
      "Ability-based fighter with real-time terrain destruction",
      [
        "Component-based ability system",
        "Networked multiplayer with rollback",
        "Procedurally generated arenas",
        "Dynamic terrain deformation"
      ],
      "Created a highly flexible ability system that allows for modular composition of character skills and powers. The system is designed to be mod-safe, enabling easy expansion and customization without compromising the core functionality. The game features real-time terrain destruction that affects gameplay, creating dynamic battlefields that evolve during matches.",
      ["C#", "Unity", "Game Design", "UI/UX", "Networking"],
      [
        "https://i.imgur.com/gM5SuRE.jpg",
        "https://i.imgur.com/8QFx1PD.jpg",
        "https://i.imgur.com/FGCnMbR.jpg"
      ],
      "itch",
      "https://itch.io/embed-upload/8431679?color=333333",
      "https://github.com/christianblevens/terrain-fighter"
    ),
    
    createProject(
      4,
      "AI-Driven NPC Behavior System",
      "https://i.imgur.com/pb87Imr.png",
      "Advanced AI system for realistic NPC interactions",
      [
        "Emergent behavior through goal-oriented action planning",
        "Dynamic personality traits affecting decision making",
        "Memory system with emotional weighting",
        "Procedural dialogue generation"
      ],
      "This project demonstrates advanced artificial intelligence techniques for creating believable non-player characters in open-world games. The system combines utility-based decision making with influence maps and behavior trees to create NPCs that respond realistically to player actions and environmental changes. The architecture supports scalability across hundreds of NPCs with minimal performance impact.",
      ["C++", "AI", "Behavior Trees", "Machine Learning"],
      [
        "https://i.imgur.com/pb87Imr.png",
        "https://i.imgur.com/UzHfGtQ.jpg",
        "https://i.imgur.com/pb87Imr.png"
      ],
      "external",
      "https://aibehaviordemo.example.com"
    ),
    
    createProject(
      5,
      "AI-Driven NPC Behavior System",
      "https://i.imgur.com/Lz9R7jS.jpg",
      "Advanced AI system for realistic NPC interactions",
      [
        "Emergent behavior through goal-oriented action planning",
        "Dynamic personality traits affecting decision making",
        "Memory system with emotional weighting",
        "Procedural dialogue generation"
      ],
      "This project demonstrates advanced artificial intelligence techniques for creating believable non-player characters in open-world games. The system combines utility-based decision making with influence maps and behavior trees to create NPCs that respond realistically to player actions and environmental changes. The architecture supports scalability across hundreds of NPCs with minimal performance impact.",
      ["C++", "AI", "Behavior Trees", "Machine Learning"],
      [
        "https://i.imgur.com/Lz9R7jS.jpg",
        "https://i.imgur.com/UzHfGtQ.jpg",
        "https://i.imgur.com/R3ZvMpL.jpg"
      ]
    )
  ];
  
  // Preload all project main images after page load
  window.addEventListener('load', function() {
    window.projects.forEach(function(project) {
      // Preload main image
      if (project.image) {
        const img = new Image();
        img.src = project.image;
      }
      
      // Preload first gallery image if exists
      if (project.gallery && project.gallery.length > 0) {
        const galleryImg = new Image();
        galleryImg.src = project.gallery[0];
      }
    });
  });
})();