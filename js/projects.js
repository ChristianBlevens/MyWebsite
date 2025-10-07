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
      "An interactive web application that transforms ordinary photos into festive Christmas light displays through creative AI enhancement. Users can capture or upload images, then draw custom light paths directly on the photo with full control over light density, animation speed, glow size, and color gradients. The application leverages server-side APIs for depth mapping and line detection to help place lights naturally along architectural features. Multiple interconnected light networks can be created with independent color schemes. The AI enhancement engine adds realistic lighting effects and bloom to create professional-quality results. Built with modular JavaScript architecture and HTML5 Canvas for real-time image manipulation, the application supports both touch and mouse interactions with comprehensive error handling for API failures.",
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
      "A comprehensive habit tracking and productivity monitoring application designed to help users build consistent daily routines. Users log their wake-up time and track activities throughout the day with detailed metadata including descriptions, timestamps, durations, tags, and sub-tasks. The application provides motivational analytics with streak tracking, weekly performance rates, and comparative metrics showing today versus yesterday and weekly averages. Activities support rich content through markdown and embedding capabilities. The interface dynamically tracks time relative to the user's wake-up time and celebrates completed days with encouraging messages. Firebase integration enables cloud storage and synchronization. The minimalist, goal-oriented design focuses on building habits through data-driven insights and positive reinforcement, making it ideal for productivity enthusiasts and habit formation.",
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
      "A sophisticated geospatial tool that estimates roof area from satellite and street map imagery using advanced pixel detection algorithms. Users can locate properties through device geolocation, manual address entry with geocoding, or direct coordinate input. The application uses Leaflet mapping library with satellite and street views, allowing zoom and pan interactions. When users click on a roof, the HTML5 Canvas-based detection engine analyzes pixel colors to identify connected roof surfaces, handling color variations and filling gaps intelligently. The area calculation system converts detected pixels to square meters or feet using precise geospatial mathematics that accounts for map zoom level, geographic location, and Earth's curvature. The responsive mobile-friendly interface includes clear status indicators and error handling for location acquisition failures. This tool is particularly useful for contractors, solar installers, and property assessors who need quick roof measurements without physical site visits.",
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
      "An astronomical visualization application that provides detailed solar and lunar information based on precise geolocation data. The app automatically detects user latitude and longitude, retrieves city and region names, and calculates exact times for sunset, civil twilight, nautical twilight, and astronomical twilight. Dynamic animations show real-time sun and moon positions with gradient backgrounds that smoothly transition to reflect the current time of day. Moon phase information includes illumination percentage and animated phase visualization that updates hourly. The application integrates data from Open-Meteo, Farmsense, and OpenStreetMap APIs to ensure astronomical accuracy. A debug mode with time slider allows exploration of solar and lunar cycles throughout the day. The responsive design adapts to various screen sizes while maintaining engaging visual representations. This tool is ideal for photographers planning golden hour shoots, astronomers tracking celestial events, and anyone interested in understanding local daylight patterns and lunar cycles.",
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
      "A sophisticated global time and daylight comparison tool that visualizes time zones and solar cycles across multiple locations simultaneously. Users input location names which are geocoded to retrieve timezone data and geographical coordinates. Each location displays a dynamic 24-hour time bar with a red marker showing current local time and hour markers that update in real-time. The standout feature is the color-gradient background representing daylight progression throughout the day, dynamically changing based on sunrise, sunset, and twilight transitions with smooth color interpolation reflecting morning, noon, evening, and night phases. The application prevents duplicate entries and displays location names with country identifiers. Using multiple APIs for geocoding and solar data, the system automatically updates all location bars every minute and handles complex timezone calculations with precision. The responsive design adapts to various screen sizes while maintaining visual clarity. This tool is invaluable for international teams coordinating across time zones, travelers planning trips, or anyone curious about how daylight varies globally at any given moment.",
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
      "An intense browser-based space combat game featuring wave-based survival gameplay with roguelike progression elements. Players control a spacecraft using WASD movement and mouse aiming, with spacebar dash mechanics for tactical repositioning. The game features a multi-ability system with four ability slots (keys 1-4) that players unlock and upgrade between waves, creating diverse strategic builds. Combat revolves around defeating increasingly difficult waves of enemies while building combo multipliers for higher scores. The interface includes enemy markers (toggled with C key), performance tracking showing waves completed, enemies defeated, and maximum combo achieved. Built with HTML5 Canvas for smooth rendering, the game offers responsive controls including pause (ESC) and debug features. The combination of fast-paced action, ability customization, and progressive difficulty creates an addictive arcade experience that rewards both reflexes and strategic planning. Ideal for fans of bullet hell shooters and roguelike progression systems.",
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
      "A professional-grade video editing application that combines traditional editing capabilities with advanced AI-powered audio processing. The multi-track timeline editor supports drag-and-drop media import, clip manipulation (split, delete, mute), speed adjustment (0.25x to 2x), volume and opacity controls, and background noise removal. The AI transcription system provides automatic transcription with filler word detection, profanity detection, pause detection, and intelligent silence removal or compression. Comprehensive subtitle tools offer custom styling with font selection, position and animation options, and automatic generation with the ability to burn subtitles directly into video. Export options include multiple quality presets (Web, HD, 4K), codec selection, partial or full timeline export, and estimated file size calculations. Additional professional features include a marker and comment system, waveform visualization, and recent project tracking. The FastAPI backend with batched processing achieves 12.5x speedup over real-time, while GPU acceleration and direct FFmpeg processing ensure efficient rendering. Recent projects tracking and clip properties management round out the feature set. This application is ideal for content creators, YouTubers, and video editors seeking to accelerate their workflow through AI-assisted editing.",
      ["Web Development", "Python", "FastAPI", "Faster Whisper", "FFmpeg", "Docker", "WebSockets", "JavaScript", "AI", "Cuda"],
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
      "A sophisticated multi-stage face processing pipeline designed to create and apply consistent anonymized identities across video content. The system operates in four distinct phases: face detection using RetinaFace for precise facial landmark identification, FARL-based face anonymization to generate synthetic faces while preserving facial structure, CodeFormer enhancement to improve the quality and realism of generated faces, and FaceFusion-based face application to swap the anonymized face into target videos. Built with Flask backend and PyTorch deep learning framework, the pipeline leverages CUDA GPU acceleration for efficient processing of high-resolution video. The entire system is containerized with Docker for consistent deployment across different environments. This allows users to generate a single anonymized identity and consistently apply it across multiple videos, maintaining visual continuity while protecting privacy. The pipeline is particularly valuable for content creators, privacy advocates, and researchers who need to anonymize faces in video content while maintaining consistent identity representation and high visual quality.",
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
      "An advanced web application that automatically finds and extracts specific words or phrases from YouTube videos, channels, or playlists, and compiles them into a single cohesive video. The six-stage processing pipeline includes video download via yt-dlp with aria2c acceleration, AI-powered transcription using Faster Whisper with CTranslate2 for word-level timestamps and confidence scores, intelligent word search with context and customizable padding, automated clip extraction with nearby segment merging, video normalization for consistent resolution and audio streams, and final compilation with FFmpeg. The cloud database saves transcriptions to prevent redundant processing and enables transcript sharing across users for faster results. The system supports multiple Whisper model sizes and operates in both GPU and CPU modes for flexible deployment. The vanilla JavaScript frontend provides a user-friendly interface for configuring searches, while the Python Flask backend handles all processing stages. Docker and Docker Compose enable easy containerized deployment. This tool is perfect for content creators making compilation videos, researchers analyzing speech patterns, or anyone wanting to create supercuts of specific words or phrases from YouTube content.",
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
      "A production-ready, self-hosted comment system designed for seamless web integration with enterprise-level features and robust security. Authentication uses Discord OAuth for password-free secure login, eliminating the need for custom user management. The AI-powered moderation system employs natural language processing to detect spam, toxicity, and inappropriate content automatically, supplemented by comprehensive manual moderation tools including user reporting and banning capabilities. Users can write comments with markdown support and rich media embedding, participate in voting systems, and build reputation scores over time. Technical features include Redis caching and PostgreSQL optimization for high performance, HTTPS enforcement with rate limiting, CSRF protection, and SQL injection prevention. The system integrates via a single JavaScript script tag and uses iframe-based embedding that automatically detects and adapts to the host website's design and color scheme. A Discord bot provides real-time notifications for new comments and moderation events. The responsive design works across static sites, WordPress installations, and various web platforms with page-specific comment threads via unique identifiers. An analytics dashboard provides insights into comment activity and user engagement. This system is ideal for bloggers, content creators, and website owners seeking a privacy-focused, customizable alternative to third-party comment platforms.",
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
      "A sophisticated single-page portfolio application built with modern web technologies and modular architecture. The site uses Alpine.js for reactive components organized into separate modules for app navigation, scroll effects, dynamic filters, forms, and modals. The project showcase system dynamically generates filter buttons based on project skills with scrollable overflow handling for long lists, allowing visitors to easily browse by technology or domain. Each project displays in a modal with embedded iframe support that automatically adjusts height using the PostMessage API for cross-origin communication, ensuring proper display of both local and external demos. The modular JavaScript architecture separates concerns across eight files (utils, store, app, scroll, filters, forms, modals, projects) for maintainability and scalability. Tailwind CSS provides responsive styling with custom components. Additional features include a contact form with EmailJS integration, image gallery with navigation, smooth scrolling animations, and comprehensive project metadata management. The codebase demonstrates professional development practices with JSDoc documentation, organized file structure, and clean separation of data and presentation layers. This portfolio represents both a showcase of projects and a demonstration of modern frontend development capabilities.",
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
      "An innovative multiplayer combat game featuring real-time voxel-based terrain destruction where player impacts dynamically alter the battlefield. The core destruction system uses collision detection to remove terrain chunks on impact, creating strategic opportunities as players carve paths and eliminate cover. Built with Fish Networking for robust multiplayer synchronization, the game maintains consistent destruction state across all clients in real-time. The architecture employs data-oriented design principles to optimize performance, allowing for complex destruction calculations without frame rate degradation. Physics-based combat mechanics mean projectiles and player movements interact naturally with the destructible environment. The modular system design uses a unique communication class approach that enables flexible entity-system interactions while maintaining network synchronization. The voxel collision system is both performant and scalable, supporting large playable areas with dynamic terrain modification. This project demonstrates advanced Unity development techniques including custom networking solutions, optimized physics calculations, and innovative gameplay mechanics that emerged from combining destructible environments with multiplayer combat. Ideal for players who enjoy tactical gameplay where environmental manipulation creates strategic depth.",
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
      "An ambitious multiplayer online battle arena (MOBA) game built entirely with Unity's Data-Oriented Technology Stack (DOTS) and Entity Component System (ECS) architecture. The project showcases advanced Unity development with a fully modular ability creation system that allows for dynamic skill combinations and unique champion builds. Unlike traditional object-oriented approaches, the entire game logic runs through ECS for maximum performance and scalability. The ability system is designed to be mod-safe, allowing for easy extension and customization without breaking core functionality. Steam Networking integration provides robust multiplayer functionality with matchmaking, lobby systems, and real-time synchronization of game state across clients. The innovative main menu system demonstrates creative UI solutions within the DOTS framework. Each system operates as an independent entity, enabling data-oriented communication patterns that maximize cache efficiency and parallel processing capabilities. This architecture allows for potentially hundreds of units on screen simultaneously without performance degradation. The project represents a significant technical achievement in adapting MOBA gameplay mechanics to Unity's modern high-performance architecture, proving that complex multiplayer games can benefit from data-oriented design principles while maintaining gameplay depth and flexibility.",
      ["Unity", "C#", "Steam Networking", "Dynamic Ability System", "Data Oriented Design"],
      [
        "https://i.imgur.com/rBJsZzW.gif",
      ],
      "",
      "",
      "https://github.com/ChristianBlevens/UltimateMoba"
    ),
    
    createProject(
      "Tiny Home Design Presentation",
      "https://i.imgur.com/zW5XWYm.gif",
      "Simple home demo using interactive environments build with ProBuilder",
      [
        "Quickly built ProBuilder homes",
        "Modular interaction system",
        "Production ready website deployment"
      ],
      "An interactive 3D presentation tool showcasing tiny home interior designs built with Unity's ProBuilder for rapid environment creation. The project features fully navigable van interior spaces where users can explore different layout configurations and design choices through first-person interaction. The modular interaction system allows visitors to open cabinets, toggle features, and examine design details in an immersive 3D environment. ProBuilder enabled quick iteration on home layouts and architectural elements without requiring external 3D modeling software, significantly accelerating the design presentation workflow. The application was deployed as a production-ready web application, demonstrating Unity's WebGL capabilities for business and client presentations. The project successfully bridges physical space planning with interactive digital visualization, allowing stakeholders to experience and understand van home designs before construction. This tool proved valuable for client presentations, design iteration feedback, and showcasing space optimization solutions. The clean interface and intuitive controls make the complex 3D space easily accessible to non-technical users, while the underlying modular system architecture allows for rapid creation of new home configurations and design variations.",
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
      "An innovative pathfinding solution designed for efficiently navigating large groups of NPCs through complex environments. The hybrid approach combines classic pathfinding algorithms for strategic route planning with boid-based flocking behavior for local obstacle avoidance and group cohesion. This two-tier system allows individual agents to follow computed paths while dynamically adjusting to nearby agents and obstacles, preventing congestion and creating natural-looking group movement. The visualization system provides comprehensive debug tools showing pathfinding nodes, NPC detection ranges, obstacle boundaries, and sight line calculations through Unity's Gizmo system. Dynamic NPC clustering algorithms group nearby agents to reduce individual pathfinding calculations, significantly improving performance when managing hundreds of units. The graph-based navigation mesh representation is optimized for both memory efficiency and pathfinding speed. Obstacle visualization helps developers understand how the system perceives the environment and makes routing decisions. This solution demonstrates advanced algorithmic thinking by recognizing that group pathfinding requires different approaches than single-agent navigation, combining the strengths of deliberate planning with emergent local behaviors to create believable and performant crowd simulation suitable for strategy games, crowd simulations, or any application requiring coordinated movement of multiple entities.",
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
      "A sophisticated embedded systems capstone project that integrates radar detection with automated camera tracking through complex coordinate transformation mathematics. The system detects targets using radar, then calculates the necessary pan-tilt adjustments to point a camera at the detected target's position, accounting for arbitrary placement angles and rotations between the radar and camera systems. The mathematical validation is visualized through custom Unity tools that demonstrate coordinate transformations and verify calculation accuracy before hardware deployment. The architecture was designed with no physical constraints in mind, allowing the radar and camera to be positioned and oriented independently while maintaining accurate target tracking. A web-based UI provides camera control and monitoring capabilities, enabling remote operation and real-time adjustment of system parameters. Database integration logs detection events and tracking history for analysis and system performance evaluation. Python scripts handle radar data processing and coordinate calculations, while C# components manage camera servo control and system integration. The remote access capability allowed continuous software iteration and testing without physical presence at the hardware installation. This project demonstrates proficiency in sensor fusion, coordinate geometry, embedded systems programming, and full-stack development, successfully bridging theoretical mathematics with practical hardware control systems for real-world target tracking applications.",
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
      "A groundbreaking architectural solution that bridges the gap between Entity Component System (ECS) design patterns and object-oriented programming (OOP) multiplayer networking frameworks like Fish Networking. Traditional ECS architecture conflicts with OOP networking libraries that expect objects to synchronize across networks, making multiplayer ECS games challenging to develop. This system solves the problem by treating each ECS system as a networked object, enabling data-oriented communication patterns while maintaining compatibility with OOP networking frameworks. The dynamic system-to-entity communication mechanism allows systems to process entities efficiently while being networked objects themselves, preserving ECS performance benefits. The abstraction is fully generalized, making it compatible with any OOP-based multiplayer framework without requiring framework-specific modifications. This allows developers to leverage popular, well-supported networking solutions while still benefiting from ECS's performance and architectural advantages. The implementation demonstrates deep understanding of both paradigms and creative problem-solving to reconcile fundamentally different design philosophies. This framework is particularly valuable for multiplayer game developers who want ECS performance without abandoning established networking libraries, opening up data-oriented design to projects that would otherwise require traditional OOP architecture due to networking constraints.",
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
      "A comprehensive 3D pathfinding solution that automatically detects walkable surfaces in complex three-dimensional environments without requiring manual navigation mesh creation. The system uses octree-based physics checks to sample the environment and identify surfaces suitable for character movement, building a dynamic navigation graph from discovered walkable areas. Unlike traditional 2D pathfinding or Unity's built-in NavMesh, this voxel-based approach handles multi-level environments, overhangs, platforms at different heights, and vertical navigation seamlessly. The node combination optimization reduces graph complexity by merging adjacent walkable voxels into larger nodes, significantly improving pathfinding performance without sacrificing accuracy. Visual representation through Unity's Gizmo system displays the navigation graph in the scene view, showing nodes, connections, and the relationship between detected surfaces and the environment geometry. This debug visualization is invaluable for understanding how the system perceives the environment and troubleshooting pathfinding issues. The brute-force surface detection approach, while computationally intensive during initial scanning, provides flexibility to work with any environment geometry without artist-created navigation data. This system is ideal for procedurally generated levels, destructible environments, or games with complex vertical movement where traditional navigation solutions fall short, demonstrating advanced spatial algorithms and optimization techniques for practical game AI.",
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
      "A professional business website created for 365 Holiday Lighting, a Christmas lighting installation company, using the Wix platform. The site showcases the company's services, portfolio of installations, and provides contact information for potential customers. Built with Wix's drag-and-drop interface, the website balances visual appeal with functional business needs including service descriptions, image galleries of completed projects, pricing information, and customer testimonials. The design emphasizes seasonal aesthetics appropriate for a holiday lighting business while maintaining year-round professionalism. Responsive design ensures the site displays correctly across desktop, tablet, and mobile devices, crucial for reaching customers browsing on various platforms. The project demonstrates the ability to work with no-code platforms to deliver business results quickly, understanding when custom development isn't necessary and leveraging existing tools effectively. SEO optimization and clear calls-to-action help drive customer inquiries. This project highlights practical web development skills beyond coding—including client communication, business requirements analysis, content organization, and selecting appropriate technology for project constraints and client technical capabilities.",
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
      "A personal portfolio website built with Squarespace to showcase projects, skills, and professional background during early career development. The site served as a digital resume and project gallery, featuring project descriptions, images, technical skills, and contact information presented in a clean, professional layout. Squarespace's template system provided a polished appearance without requiring extensive custom design work, allowing focus on content and presentation rather than technical implementation. The platform's built-in responsive design ensured accessibility across devices, while integrated SEO tools helped with discoverability. This project represents an important step in professional development—establishing an online presence and learning to present technical work to non-technical audiences. The experience with Squarespace informed later decisions about when to use platform solutions versus custom development, understanding trade-offs between convenience and customization. As skills evolved and project complexity increased, the limitations of template-based platforms became apparent, ultimately leading to the creation of a fully custom portfolio site with advanced features like dynamic filtering and iframe integration. This original site remains as both a portfolio piece and a milestone showing growth from platform-based solutions to sophisticated custom web applications.",
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
      "A mesmerizing simulation exploring emergent behavior through simple attraction and repulsion rules applied to particle systems. Individual particles follow basic physics rules—attraction to certain other particles, repulsion from others, and movement influenced by nearby particles—yet the collective behavior creates complex, organic-looking patterns and motion. The simulation demonstrates a fundamental concept in complex systems: that sophisticated, seemingly intelligent group behaviors can emerge from simple individual rules without centralized control. The visual representation provides an intuitive understanding of how particle interactions create swirling, flowing patterns reminiscent of fluid dynamics or biological systems like flocking birds or schooling fish. While simplified compared to true particle physics, the approximation captures essential interactive behaviors that produce compelling visual results. The system allows manipulation of attraction strengths, repulsion ranges, and particle counts to explore how parameter changes affect emergent patterns. This project serves both as an artistic piece and an educational tool demonstrating emergence, a concept applicable to game AI, procedural animation, crowd simulation, and understanding natural phenomena. The implementation showcases efficient particle system handling in Unity, spatial optimization for proximity checks, and creative exploration of algorithmic art where simple mathematics produces unexpected beauty and complexity.",
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
      "A love letter to Team Fortress 2's community-created Dodgeball game mode, faithfully recreating the frenetic gameplay while adding unique enhancements. The core mechanic involves players deflecting projectiles back and forth with precise timing, with each deflection increasing projectile speed, creating intense rallies reminiscent of competitive dodgeball. The player controller faithfully emulates Source engine movement characteristics including air strafing, rocket jumping, and momentum conservation, capturing the distinctive feel that makes TF2 movement so satisfying. Local multiplayer support enables competitive matches with friends on the same machine. Beyond faithful recreation, the project introduces unique abilities that expand tactical options while preserving the core deflection gameplay. The implementation required deep understanding of physics-based movement, projectile tracking systems, and timing-sensitive input handling to match the precision feel of the original mod. Special attention was paid to feedback—visual effects, sound cues, and screen shake—to create the same visceral satisfaction of successful deflections. This project demonstrates the ability to analyze and recreate established gameplay mechanics while understanding what makes them enjoyable, balancing faithful recreation with creative enhancement. It showcases game design thinking beyond pure implementation, considering player experience, skill expression, and the fine-tuning that separates functional mechanics from genuinely fun gameplay.",
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
      "A foundational physics simulation implementing core 2D physics principles with dynamic line-based visualization. The system models basic physics behaviors including gravity, velocity, acceleration, and collision detection for simple geometric shapes. Lines connecting points create visual representations of forces, constraints, and motion paths, making abstract physics concepts tangible and understandable through real-time visualization. The canvas drawing system renders physics calculations at variable resolution levels, allowing performance optimization by adjusting visual fidelity based on complexity requirements. Despite its simplicity, the implementation is robust enough to handle various physics scenarios including pendulums, springs, projectiles, and particle interactions. The project serves as both a learning tool for understanding physics simulation fundamentals and a foundation for more complex systems. The clear visual feedback makes it excellent for demonstrating physics principles to others or debugging physics behavior in development. This simple yet complete solution showcases understanding of core game physics concepts without relying on built-in physics engines, demonstrating the mathematical and algorithmic foundations underlying physics simulation. The variable resolution feature shows performance optimization thinking, balancing visual quality with computational efficiency. This type of fundamental implementation experience is valuable for understanding how physics engines work internally and troubleshooting physics-related issues in more complex projects.",
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
      "An artificial life simulation framework exploring evolutionary dynamics through agent-based modeling with natural selection mechanics. Individual agents possess traits that affect survival and reproduction, with successful strategies propagating through generations while unsuccessful ones die out. The simulation demonstrates emergent evolutionary behaviors arising from simple interaction rules—agents seeking resources, avoiding threats, and competing for survival. A highly optimized array access system enables tracking thousands of agents simultaneously without performance degradation, using spatial partitioning and efficient data structures for rapid proximity queries. The database management system records generational data, tracking trait distributions, population dynamics, and evolutionary trends over time. Visual representation shows agents, resources, and environmental factors in real-time, with color coding or size variations indicating different traits or fitness levels. The efficient search function allows querying specific agents or analyzing population subsets based on trait criteria. This project combines computational biology concepts with performance optimization, demonstrating how large-scale simulations can model complex adaptive systems. The framework is extensible, allowing experimentation with different selection pressures, environmental conditions, or trait systems to explore various evolutionary scenarios. It showcases both algorithmic efficiency—handling thousands of interacting entities—and biological systems modeling, making it valuable for educational demonstrations, research into artificial life, or as a foundation for evolution-based game mechanics.",
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
      "A comprehensive real-world project converting a cargo van into a fully functional mobile living space through meticulous planning and execution. The build prioritizes intelligent space optimization, transforming limited square footage into a comfortable home with sleeping quarters, kitchen facilities, storage solutions, and living area. Long-term extensive planning involved researching building codes, electrical systems, plumbing, insulation techniques, and material selection to ensure safety, durability, and functionality. Detailed CAD models and measurements guided construction to maximize every inch of available space while maintaining aesthetic appeal. The financial component required budgeting, cost estimation, supplier negotiations, and resource allocation across multiple build phases. Cooperation-based leadership coordinated volunteers and collaborators, managing diverse skill sets and schedules while maintaining project momentum and quality standards. Problem-solving was constant—adapting plans when obstacles arose, finding creative solutions to space constraints, and making trade-off decisions between features and practicality. The completed build represents successful project management at the intersection of engineering, design, construction, and leadership. Skills demonstrated include spatial reasoning, technical research, budget management, construction techniques, electrical and plumbing installation, team coordination, and perseverance through a multi-month complex project. This hands-on experience showcases the ability to plan and execute large-scale projects beyond software development, demonstrating versatility, practical problem-solving, and the determination to see ambitious projects through to completion.",
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