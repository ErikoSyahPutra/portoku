import { PortfolioData } from "@/types/portfolio";

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "Eriko Syah Putra",
    title: "Full-Stack Engineer & Web Developer",
    bio: "Product Engineer based in Indonesia, specializing in high-performance web systems and intuitive user experiences.",
    aboutMe:
      "Hello! I am Eriko Syah Putra, a passionate Full-Stack Engineer and Web Developer with over 3 years of hands-on experience building resilient web applications, interactive dashboards, and design systems.\n\nMy journey spans developing mission-critical SaaS platforms, point-of-sale systems, and real-time platforms using Next.js, NestJS, TypeScript, and modern database solutions. I bridge the gap between robust backend engineering and pixel-perfect UI/UX design to deliver digital products that scale smoothly and delight users.\n\nBeyond coding, I actively lead cross-functional research teams, collaborate in agile scrums, and explore cutting-edge cloud architectures.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    location: "Indonesia",
    email: "erikosyahputra@gmail.com",
    githubUrl: "https://github.com/ErikoSyahPutra",
    linkedinUrl: "https://linkedin.com/in/erikosyahputra",
    websiteUrl: "https://erikosyah.my.id",
    availableBadge: "Available for New Opportunities",
    ratingScore: "4.9 of 5",
    reviewsCount: "150+ Reviews",
    reviewsLabel: "Reviews from Valued Clients",
    quote:
      "Oliver/Eriko's remarkable full-stack engineering and UI craftsmanship transformed our product — Highly Recommended!",
    stats: {
      projects: 20,
      yearsExp: 3,
      awards: 4,
      articles: 8,
      organizations: 5,
    },
  },
  services: [
    {
      id: "service-01",
      number: "01",
      title: "Full-Stack Web Development",
      description:
        "Architecting and delivering end-to-end web applications with Next.js, React, NestJS, and TypeScript. Focused on scalable architectures, database optimization, and high availability.",
      tags: ["Next.js", "React", "NestJS", "TypeScript", "PostgreSQL"],
      previewImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "service-02",
      number: "02",
      title: "UI/UX & Design Systems",
      description:
        "Transforming Figma wireframes and prototypes into pixel-perfect, responsive component libraries with Tailwind CSS, ensuring accessibility and fluid micro-interactions.",
      tags: ["Figma to Code", "Tailwind CSS", "Responsive Design", "Component Libraries"],
      previewImage:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "service-03",
      number: "03",
      title: "API & Microservices Architecture",
      description:
        "Designing resilient RESTful and real-time WebSocket backends with comprehensive documentation, JWT authentication, caching strategies, and message queuing.",
      tags: ["RESTful API", "WebSockets", "Supabase", "Redis"],
      previewImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "service-04",
      number: "04",
      title: "Dashboard & Analytics Engineering",
      description:
        "Engineering rich administrative panels featuring granular role-based access control (RBAC), real-time telemetry, and high-performance interactive charting.",
      tags: ["Role-Based Access", "Real-Time Metrics", "Interactive Charts"],
      previewImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "service-05",
      number: "05",
      title: "Cloud Deployment & DevOps",
      description:
        "Streamlining automated CI/CD deployment pipelines using GitHub Actions, Docker containerization, PM2 process management, and robust reverse proxy configurations.",
      tags: ["VPS", "Docker", "PM2", "GitHub Actions CI/CD"],
      previewImage:
        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop",
    },
  ],
  heroSkills: [
    { label: "Prototype", position: "left", color: "purple" },
    { label: "Dashboard", position: "right", color: "blue" },
    { label: "Web App", position: "bottom", color: "emerald" },
    { label: "API Design", position: "left", color: "amber" },
    { label: "Design System", position: "right", color: "pink" },
  ],
  marqueeItems: [
    "Website Design",
    "Full-Stack Engineering",
    "API Architecture",
    "Dashboard UI",
    "Cloud CI/CD",
    "UI/UX Design",
  ],
  projects: [
    {
      id: 1,
      title: "Laundry POS System",
      description:
        "A complete Point-of-Sale (POS) system for laundry businesses with order tracking, billing, queue status, and WhatsApp gateway notifications.",
      category: "Full-Stack Web",
      tags: ["Next.js", "Express", "Prisma ORM", "MySQL", "WhatsApp Gateway"],
      imageUrl:
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://laundry.erikosyah.my.id",
      githubUrl: "https://github.com/ErikoSyahPutra/KasirLaundry",
      featured: true,
    },
    {
      id: 2,
      title: "Restaurant Scan-to-Order System",
      description:
        "A full-stack restaurant self-ordering platform with table QR scanning, instant QRIS payments via Midtrans, real-time kitchen displays via Socket.io, and automated receipts.",
      category: "Full-Stack Web",
      tags: ["Next.js", "Express", "PostgreSQL", "Socket.io", "Midtrans"],
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://order.erikosyah.my.id",
      githubUrl: "https://github.com/ErikoSyahPutra/Self-Ordering-System",
      featured: true,
    },
    {
      id: 3,
      title: "ArenaHub (Venue Rental Platform)",
      description:
        "A web platform for renting spaces and booking venues. Features booking calendars, availability checks, and secure payment processing via Xendit.",
      category: "Full-Stack Web",
      tags: ["Next.js", "Express", "Prisma ORM", "MySQL", "Xendit", "Recharts"],
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://arenahub.erikosyah.my.id",
      githubUrl: "https://github.com/ErikoSyahPutra/arenahub",
      featured: true,
    },
    {
      id: 4,
      title: "TicketHub (Event Ticketing Platform)",
      description:
        "Full-stack event ticketing platform with multi-tier pricing, dynamic QR code e-tickets, ticket scanner, promoter analytics, and role-based access control.",
      category: "Web Application",
      tags: ["Next.js", "Prisma ORM", "SQLite", "TypeScript", "QR Code"],
      imageUrl:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://tickethub.erikosyah.my.id",
      githubUrl: "https://github.com/ErikoSyahPutra/web-ticketing",
      featured: true,
    },
    {
      id: 5,
      title: "PayFlex Mobile Banking App",
      description:
        "End-to-end UI/UX design & interactive prototype for a modern mobile banking application focusing on seamless P2P transfers, expense analytics, and micro-interactions.",
      category: "UI/UX Design",
      tags: ["Figma", "Design System", "User Research", "Wireframing", "Prototype"],
      imageUrl:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://www.figma.com/proto/sample-banking-app",
      githubUrl: "https://github.com/ErikoSyahPutra",
      featured: true,
    },
    {
      id: 6,
      title: "FitPulse Health & Workout Tracker",
      description:
        "Cross-platform mobile application for tracking workouts, daily caloric intake, and body metrics with real-time analytics and custom workout plans.",
      category: "Mobile App",
      tags: ["React Native", "TypeScript", "Tailwind CSS", "HealthKit"],
      imageUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://fitpulse.erikosyah.my.id",
      githubUrl: "https://github.com/ErikoSyahPutra/fitpulse-tracker",
      featured: false,
    },
  ],
};
