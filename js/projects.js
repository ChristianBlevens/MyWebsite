/**
 * PROJECT DATA
 */
(function() {
  // Project factory function to reduce redundancy
  function createProject(title, image, summary, features, description, skills, gallery, demoType = null, demoPath = null, githubUrl = null) {
    return {
      title,
      image,
      summary,
      features,
      description,
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
      "Christmas Lights AI Demo",
      "https://i.imgur.com/m0Wfsrh.png",
      "Interactive image editor with AI-powered enhancement for visualizing Christmas light installations",
      [
        "Spline-based light placement with depth mapping",
        "Real-time AI image enhancement via cloud processing",
        "Camera integration and custom editing controls"
      ],
      "christmas-lights-ai.md",
      ["Web Development", "AI", "Google Cloud Run", "Image Processing", "Canvas API", "JavaScript"],
      [
        "https://i.imgur.com/9p8linJ.png",
        "https://i.imgur.com/SMNiBJf.jpeg",
        "https://i.imgur.com/m0Wfsrh.png"
      ],
      "online",
      "https://christianblevens.github.io/AddSplineToPictureThenAIWebApp/",
      "https://github.com/ChristianBlevens/AddSplineToPictureThenAIWebApp"
    ),
	
	createProject(
      "Daily Habit Tracker",
      "",
      "Habit tracking app with analytics for monitoring daily routines and productivity patterns",
      [
        "Streak tracking and performance metrics",
        "Activity logging with duration and tags",
        "Weekly comparison and trend analysis"
      ],
      "",
      ["Web Development", "JavaScript", "Local Storage", "Data Visualization", "Analytics"],
      [],
      "online",
      "https://christianblevens.github.io/DailyScheduleWebApp/",
      "https://github.com/ChristianBlevens/DailyScheduleWebApp"
    ),
    
    createProject(
      "Roof Area Calculator",
      "https://i.imgur.com/ldkbu25.png",
      "Interactive map-based tool using pixel detection algorithms to calculate roof dimensions",
      [
        "Geolocation and address search integration",
        "Canvas-based roof detection from satellite imagery",
        "Accurate area calculations accounting for zoom and curvature"
      ],
      "test.md",
      ["Web Development", "Leaflet.js", "OpenStreetMap", "Canvas API", "Geolocation API", "JavaScript"],
      [
        "https://i.imgur.com/ldkbu25.png"
      ],
      "online",
      "https://christianblevens.github.io/RoofAreaCalculatorWebApp/",
      "https://github.com/ChristianBlevens/RoofAreaCalculatorWebApp"
    ),

    createProject(
      "Sunlight Hours Tracker",
      "",
      "Real-time visualization of daylight phases, twilight transitions, and lunar cycles based on geolocation",
      [
        "Animated sun and moon positions with gradient backgrounds",
        "Countdown timers for twilight stages",
        "Integration with Open-Meteo and Farmsense APIs"
      ],
      "",
      ["Web Development", "JavaScript", "Geolocation API", "API Integration", "CSS Animations"],
      [],
      "online",
      "https://christianblevens.github.io/SunlightTrackerWebApp/",
      "https://github.com/ChristianBlevens/SunlightTrackerWebApp"
    ),

    createProject(
      "Global Time & Daylight Comparison",
      "",
      "Multi-location time zone visualizer with synchronized daylight progression bars",
      [
        "Add multiple global locations simultaneously",
        "Color-coded day/night gradients for each location",
        "Real-time sunrise/sunset markers"
      ],
      "",
      ["Web Development", "JavaScript", "API Integration", "Time Zone Handling"],
      [],
      "online",
      "https://christianblevens.github.io/TimeAndDayLightComparisonWebApp/",
      "https://github.com/ChristianBlevens/TimeAndDayLightComparisonWebApp"
    ),

    createProject(
      "Gravity Wars: Space Battle Game",
      "",
      "Browser-based arcade shooter with wave-based combat and roguelike ability system",
      [
        "WASD movement with mouse aim and dash mechanics",
        "Dynamic ability selection and combo tracking",
        "Enemy wave progression with score system"
      ],
      "",
      ["Web Development", "JavaScript", "Canvas API", "Game Development"],
      [],
      "online",
      "https://christianblevens.github.io/SpaceBattleGameWebApp/",
      "https://github.com/ChristianBlevens/SpaceBattleGameWebApp"
    ),

    createProject(
      "AI Video Editor",
      "",
      "Local video editor accelerating editing workflows with AI-powered audio processing and transcription",
      [
        "Automated pause removal, swear censoring, and filler word detection",
        "Word-level transcription with subtitle generation",
        "FastAPI backend with batched processing for 12.5x speedup",
        "GPU acceleration with direct FFmpeg processing"
      ],
      "",
      ["Web Development", "Python", "FastAPI", "Faster Whisper", "FFmpeg", "Docker", "WebSockets", "JavaScript", "AI"],
      [],
      "online",
      "https://christianblevens.github.io/VideoEditor/",
      "https://github.com/ChristianBlevens/VideoEditor"
    ),

    createProject(
      "Face Anonymization Pipeline",
      "",
      "Cloud-hosted face generation and application system for creating reusable anonymized identities",
      [
        "Multi-stage pipeline: detection, anonymization, enhancement, and face swapping",
        "RetinaFace detection with FARL-based anonymization",
        "CodeFormer enhancement and FaceFusion face application",
        "GPU-accelerated processing with unified Docker deployment"
      ],
      "",
      ["Python", "Flask", "PyTorch", "CUDA", "Docker", "FaceFusion", "AI"],
      [],
      null,
      null,
      null
    ),

    createProject(
      "YouTube Word Extractor",
      "",
      "Flask-based pipeline for extracting and compiling specific words from YouTube videos using AI transcription",
      [
        "6-stage processing: download, transcription, search, extraction, compilation",
        "GPU/CPU mode with Faster Whisper integration",
        "Cloud database for transcript storage and reuse"
      ],
      "",
      ["Python", "Flask", "Faster Whisper", "FFmpeg", "Docker", "yt-dlp", "SQLite"],
      [],
      null,
      null,
      "https://github.com/ChristianBlevens/FasterWhisperWebApp"
    ),

    createProject(
      "Production Comment System",
      "",
      "Self-hosted comment platform with Discord OAuth, AI content moderation, and embeddable widget",
      [
        "Discord authentication with user reputation system",
        "AI-powered spam detection and moderation",
        "Rich text support with auto-theme detection"
      ],
      "",
      ["JavaScript", "Node.js", "PostgreSQL", "Redis", "Discord OAuth", "Docker", "AI"],
      [],
      null,
      null,
      "https://github.com/ChristianBlevens/CommentSectionWebApp"
    ),

    createProject(
      "Portfolio Website",
      "https://i.imgur.com/WYd2iPv.png",
      "Modular single-page application showcasing projects through embedded iframes and dynamic modals",
      [
        "Alpine.js reactive components with organized file structure",
        "Responsive filter system with overflow handling",
        "PostMessage API for cross-origin iframe communication"
      ],
      "README.md",
      ["Web Development", "Alpine.js", "Tailwind.css", "API Integration", "JavaScript"],
      [
        "https://i.imgur.com/WYd2iPv.png",
      ],
      "",
      "",
      "https://github.com/ChristianBlevens/MyWebsite"
    ),
    
    createProject(
      "Impact Based Destructible Environment",
      "https://i.imgur.com/I7ZkATK.gif",
      "Multiplayer game with real-time terrain destruction and physics-based combat",
      [
        "Performant terrain destruction system",
        "Fish Networking multiplayer synchronization",
        "Data-oriented design for optimization"
      ],
      "",
      ["Unity", "C#", "Fish Networking", "Data Oriented Design", "Physics"],
      [
        "https://i.imgur.com/I7ZkATK.gif",
      ],
      "online",
      "https://itch.io/embed-upload/8431679?color=333333",
      "https://github.com/christianblevens/terrain-fighter"
    ),
    
    createProject(
      "Unity ECS MOBA",
      "https://i.imgur.com/rBJsZzW.gif",
      "Data oriented MOBA with custom ability creation",
      [
        "Full Unity DOTS with ECS",
        "Steam Networking based online"
      ],
      "",
      ["Unity", "C#", "Steam Networking", "Dynamic Ability System", "Data Oriented Design"],
      [
        "https://i.imgur.com/rBJsZzW.gif",
      ],
      "",
      "",
      "https://github.com/ChristianBlevens/UltimateMoba"
    ),
    
    createProject(
      "Van Home Design Presentation",
      "https://i.imgur.com/zW5XWYm.gif",
      "Simple home demo using interactive environments build with ProBuilder",
      [
        "Quickly built ProBuilder homes",
        "Modular interaction system",
        "Production ready website deployment"
      ],
      "",
      ["Unity", "C#", "ProBuilder"],
      [
        "https://i.imgur.com/zW5XWYm.gif",
      ],
      "online",
      "https://itch.io/embed-upload/12942892?color=333333"
    ),
    
    createProject(
      "Group Pathfinding",
      "https://i.imgur.com/9ff2MqU.gif",
      "Performant giant group pathfinding hybrid solution",
      [
        "Hybrid approach using clasic pathfinding and boids",
        "Descriptive visual representations"
      ],
      "",
      ["Unity", "C#", "Pathfinding", "Data Visualization"],
      [
        "https://i.imgur.com/9ff2MqU.gif",
      ],
    ),
    
    createProject(
      "Camera And Radar Collaboration",
      "https://i.imgur.com/klahjti.gif",
      "University capstone project to point a camera at targets detected from a radar",
      [
        "Capable of working with arbitrary placements and rotations",
        "Can be accessed remotely to use or iterate on software"
      ],
      "",
      ["Web Development", "C#", "Database", "Python", "Data Visualization", "Unity"],
      [
        "https://i.imgur.com/klahjti.gif",
      ],
    ),

    createProject(
      "Object-Oriented Networking ECS",
      "https://i.imgur.com/Rt6xMLu.gif",
      "Complex abstraction that enables ECS with popular OOP multiplayer frameworks by making systems objects",
      [
        "Dynamic system to entity communication",
        "Fully abstracted concept for easy implementation"
      ],
      "",
      ["Unity", "C#", "Fish Networking", "Data Oriented Design", "Object Oriented Programming"],
      [
        "https://i.imgur.com/Rt6xMLu.gif",
      ],
    ),
    
    createProject(
      "Walkable Surface Detection And 3d Pathfinding",
      "https://i.imgur.com/voSAMvC.gif",
      "Brute force 3d pathfinding with crude floor detection",
      [
        "Optimizes search time by combining nodes",
        "Visualizes nodes using gizmos"
      ],
      "",
      ["Unity", "C#", "Pathfinding", "Data Visualization"],
      [
        "https://i.imgur.com/voSAMvC.gif",
      ],
    ),
    
    createProject(
      "365 Holiday Lighting Website",
      "https://i.imgur.com/1llffvH.png",
      "A simple website that I built for 365 Holiday Lighting with Wix",
      [
        
      ],
      "",
      ["Web Development", "Wix"],
      [

      ],
      "external",
      "https://www.365holidaylighting.com/"
    ),
    
    createProject(
      "My Old Personal Website",
      "https://i.imgur.com/TsxhPjO.png",
      "My first personal website that I built with Squarespace",
      [
        
      ],
      "",
      ["Web Development", "Squarespace"],
      [

      ],
      "external",
      "https://www.christianblevens.me/"
    ),
    
    createProject(
      "Point Attraction",
      "https://i.imgur.com/Hjzf1Ua.gif",
      "Fun little demonstration of emergent behavior",
      [
        "Visual example of basic rules producing complex behavior",
        "Rough approximation of particle interactions"
      ],
      "",
      ["Unity", "C#", "Emergent Behavior"],
      [
        "https://i.imgur.com/Hjzf1Ua.gif",
      ],
    ),
    
    createProject(
      "TF2 Dodgeball Inspired Game",
      "https://i.imgur.com/UkeeOav.gif",
      "A recreation of my favorite TF2 gamemode, but with some added features I thought were fun",
      [
        "Basic player controller",
      ],
      "",
      ["Unity", "C#", "Player Controller"],
      [
        "https://i.imgur.com/UkeeOav.gif",
      ],
    ),
    
    createProject(
      "Line Physics",
      "https://i.imgur.com/EIKLGGE.gif",
      "Basic implementation of some 2d physics and canvas drawing",
      [
        "Basic 2d physics",
      ],
      "",
      ["Unity", "C#", "Data Visualization"],
      [
        "https://i.imgur.com/EIKLGGE.gif",
      ],
    ),
    
    createProject(
      "Life Simulation",
      "https://i.imgur.com/GyREhiS.gif",
      "Basic framework for some 2d life simulation",
      [
        "Basic interactions",
        "Extremely performant array access"
      ],
      "",
      ["Unity", "C#", "Performance Optimization", "Data Visualization"],
      [
        "https://i.imgur.com/GyREhiS.gif",
      ],
    ),
    
    createProject(
      "Van Home Build",
      "https://i.imgur.com/eXJvpxP.jpeg",
      "My build of a van home setup focused on optimizing space",
      [
        "Long-term extensive planning",
        "Cooperation based leadership"
      ],
      "",
      ["Project Planning"],
      [
        "https://i.imgur.com/9Ji5EVP.jpeg",
        "https://i.imgur.com/qfgWDI2.jpeg",
        "https://i.imgur.com/BZt7BnV.jpeg",
        "https://i.imgur.com/foM22NM.jpeg",
        "https://i.imgur.com/Ea8cxzh.jpeg",
        "https://i.imgur.com/PHWVpWO.jpeg",
        "https://i.imgur.com/dMpJQKg.jpeg",
        "https://i.imgur.com/pBnOhHv.jpeg",
        "https://i.imgur.com/MBz96x3.jpeg",
        "https://i.imgur.com/9CYflgR.jpeg",
        "https://i.imgur.com/oAyfHAf.jpeg",
        "https://i.imgur.com/GvjEwam.jpeg",
        "https://i.imgur.com/priYcgM.jpeg",
        "https://i.imgur.com/eXJvpxP.jpeg",
        "https://i.imgur.com/J68eZ37.jpeg",
        "https://i.imgur.com/8UCcSz5.jpeg",
        "https://i.imgur.com/riq73EK.jpeg"
      ],
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