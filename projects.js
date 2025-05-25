// Project data for the portfolio
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
      "Intuitive and comprehensive digital christmas light demo designed to encourage sales",
      [
        "Easy to use",
        "Beautiful result",
      ],
      "christmas-lights-ai.md",
      ["Webdev", "AI", "Google Cloud Run", "Cloud Compute", "API Usage", "Javascript"],
      [
        "https://i.imgur.com/9p8linJ.png",
        "https://i.imgur.com/SMNiBJf.jpeg",
        "https://i.imgur.com/m0Wfsrh.png"
      ],
      "online",
      "https://christianblevens.github.io/FullWebAddSplineToPictureThenAI/",
      "https://github.com/ChristianBlevens/FullWebAddSplineToPictureThenAI"
    ),
	
	createProject(
      "Daily Schedule Web App",
      "",
      "A simple to use schedule app for people with dynamic wake periods",
      [
        "Intuitive usage",
        "Robust implementation",
      ],
      "",
      ["Webdev", "Javascript", "Reactive", "User Storage"],
      [
        
      ],
      "online",
      "https://christianblevens.github.io/DailyScheduleWebApp/",
      "https://github.com/ChristianBlevens/DailyScheduleWebApp"
    ),
    
    createProject(
      "Roof Area Calculator",
      "https://i.imgur.com/ldkbu25.png",
      "Simple web app to calculate the area of a roof",
      [
        "Basic tech demo",
        "Simple file structure"
      ],
      "test.md",
      ["Webdev", "API Usage", "Map Tile API", "Javascript"],
      [
        "https://i.imgur.com/ldkbu25.png"
      ],
      "online",
      "https://christianblevens.github.io/RoofAreaCalculator/",
      "https://github.com/ChristianBlevens/RoofAreaCalculator"
    ),
    
    createProject(
      "This Website",
      "https://i.imgur.com/WYd2iPv.png",
      "A full display of what I can do using Alpine.js, Tailwind.css, and custom js/css",
      [
        "Wide ranging usage of iframe to showcase previous projects",
        "Comprehensive usage of Alpine.js and Tailwind.css",
        "Complex website presented in a simple package"
      ],
      "README.md",
      ["Webdev", "Alpine.js", "Tailwind.css", "API Usage", "Iframes", "Javascript"],
      [
        "https://i.imgur.com/WYd2iPv.png",
      ],
      "",
      "",
      "https://github.com/ChristianBlevens/MyWebsite"
    ),
    
    createProject(
      "Impact Based Descructible Environment",
      "https://i.imgur.com/I7ZkATK.gif",
      "Muliplayer game with an intuitive and reactive desctructible environment",
      [
        "Performant terain destruction",
        "Basic dumb fun gameplay"
      ],
      "",
      ["Unity", "C#", "Fish Networking", "Data Oriented Design", "OOP"],
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
      ["Unity", "C#", "Probuilder", "Javascript Plugins"],
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
      ["Webdev", "C#", "Database", "Python", "Data Visualization", "Unity"],
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
      ["Unity", "C#", "Fish Networking", "Data Oriented Design", "OOP"],
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
      ["Webdev", "Wix"],
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
      ["Webdev", "Squarespace"],
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