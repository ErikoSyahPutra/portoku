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
  reviews: [
    {
      id: "rev-1",
      clientName: "Alex Rivera",
      role: "VP of Product, FinTech Asia",
      rating: 5,
      quote:
        "Eriko's remarkable full-stack engineering and UI craftsmanship transformed our product — Highly Recommended!",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "rev-2",
      clientName: "Sarah Chen",
      role: "CTO, SaaSFlow Global",
      rating: 5,
      quote:
        "Delivered pixel-perfect components and high-throughput APIs ahead of schedule. Truly exceptional attention to detail.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    },
  ],
  experiences: [
    {
      id: 1,
      position: "UI/UX Designer",
      company: "Eduwork",
      location: "Kota Yogyakarta, D.I. Yogyakarta",
      startDate: "2025-05",
      endDate: "2025-08",
      current: false,
      description:
        "Membantu memimpin tim riset UI/UX dengan 10–15 anggota. Memimpin daily scrum untuk memantau progres dan memastikan kolaborasi tim berjalan efektif. Mengatur pembagian tugas dan alur kerja riset untuk mendukung proses desain digital.",
      skills: ["UI/UX Design", "User Research", "Daily Scrum", "Team Leadership"],
      logoUrl: "/uploads/eduwork.png",
    },
    {
      id: 2,
      position: "Web Developer",
      company: "CV Serpihan Tech Solution",
      location: "Kab. Kendal, Jawa Tengah",
      startDate: "2025-02",
      endDate: "2025-07",
      current: false,
      description:
        "Mengembangkan dan memelihara 2+ aplikasi SaaS, termasuk platform Sekolahin dan sistem ILUNI FHUI. Menyelesaikan 20+ fitur baru dan perbaikan bug. Menangani operation & maintenance (OPHAR) untuk memastikan sistem tetap andal dan optimal.",
      skills: ["Web Development", "SaaS", "Feature Development", "OPHAR", "Troubleshooting"],
      logoUrl: "/uploads/serpihan_tech.png",
    },
    {
      id: 3,
      position: "UI/UX Designer",
      company: "PT Renjana Sinergi Indonesia",
      location: "Kab. Sleman, D.I. Yogyakarta",
      startDate: "2025-03",
      endDate: "2025-06",
      current: false,
      description:
        "Merancang dan mengembangkan landing page responsif menggunakan WordPress dengan pendekatan UI/UX yang optimal. Membuat wireframe, prototype interaktif, hingga implementasi langsung ke situs produksi.",
      skills: ["UI/UX Design", "WordPress", "Wireframing", "Prototyping"],
      logoUrl: "/uploads/renjana_sinergi.png",
    },
  ],
  academics: [
    {
      id: 1,
      institution: "Universitas Negeri Semarang",
      degree: "S1",
      field: "Teknik Informatika",
      startYear: 2022,
      endYear: 2026,
      gpa: "3.9 / 4.0",
      description:
        "Fokus studi pada rekayasa perangkat lunak, arsitektur basis data, algoritma, dan interaksi manusia-komputer. Mengembangkan berbagai proyek web full-stack berskala produksi dan riset UI/UX.",
      logoUrl: "/uploads/unnes_logo.png",
    },
    {
      id: 2,
      institution: "SMA Negeri 4 Pekalongan",
      degree: "SMA",
      field: "MIPA (Matematika dan Ilmu Pengetahuan Alam)",
      startYear: 2019,
      endYear: 2022,
      gpa: "92.56",
      description:
        "Juara 3 Lomba Poster Tingkat SMA/SMK/MA se-Indonesia Dalam Acara HIMASA National Accounting Competition (HACTION) 2021. Aktif dalam berbagai kompetisi desain dan sains.",
      logoUrl: "/uploads/sma4pekalongan_logo.png",
    },
  ],
  techStack: {
    row1: [
      { name: "Next.js 15", category: "Full-Stack", color: "#000000", iconName: "Next.js" },
      { name: "React", category: "UI Library", color: "#149ECA", iconName: "React" },
      { name: "TypeScript", category: "Language", color: "#3178C6", iconName: "TypeScript" },
      { name: "JavaScript", category: "Language", color: "#F7DF1E", iconName: "JavaScript" },
      { name: "Tailwind CSS", category: "Styling", color: "#06B6D4", iconName: "Tailwind CSS" },
      { name: "Framer Motion", category: "Animation", color: "#0055FF", iconName: "Framer Motion" },
      { name: "Redux / Zustand", category: "State Mgmt", color: "#764ABC", iconName: "Redux" },
      { name: "HTML5", category: "Structure", color: "#E34F26", iconName: "HTML5" },
      { name: "CSS3", category: "Styling", color: "#1572B6", iconName: "CSS3" },
    ],
    row2: [
      { name: "NestJS", category: "Backend Engine", color: "#E0234E", iconName: "NestJS" },
      { name: "Node.js", category: "Runtime", color: "#5FA04E", iconName: "Node.js" },
      { name: "Express.js", category: "REST API", color: "#121214", iconName: "Express" },
      { name: "PostgreSQL", category: "SQL Database", color: "#4169E1", iconName: "PostgreSQL" },
      { name: "MySQL", category: "SQL Database", color: "#4479A1", iconName: "MySQL" },
      { name: "Prisma ORM", category: "Data Access", color: "#2D3748", iconName: "Prisma" },
      { name: "Supabase", category: "BaaS & Auth", color: "#3ECF8E", iconName: "Supabase" },
      { name: "Redis", category: "In-Memory Cache", color: "#DC382D", iconName: "Redis" },
      { name: "Docker", category: "Containers", color: "#2496ED", iconName: "Docker" },
      { name: "Git & GitHub", category: "Version Control", color: "#F05032", iconName: "Git" },
      { name: "Figma", category: "UI/UX Design", color: "#F24E1E", iconName: "Figma" },
      { name: "Postman", category: "API Testing", color: "#FF6C37", iconName: "Postman" },
    ],
  },
  blogs: [
    {
      id: 4,
      title: "Mastering Full-Stack Next.js 15: Server Actions & Caching",
      slug: "mastering-fullstack-nextjs-15",
      excerpt:
        "Membedah arsitektur App Router Next.js 15, optimasi server-side rendering, streaming SSR, dan strategi caching modern untuk skalabilitas tinggi.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      tags: ["Next.js", "Full-Stack", "Performance"],
      readTime: 6,
      createdAt: "2024-04-10",
    },
    {
      id: 1,
      title: "Building Scalable APIs with NestJS",
      slug: "building-scalable-apis-nestjs",
      excerpt:
        "Panduan arsitektur enterprise untuk membangun RESTful API dan microservices berkinerja tinggi menggunakan NestJS, TypeScript, dan PostgreSQL.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
      tags: ["NestJS", "Backend", "Architecture"],
      readTime: 5,
      createdAt: "2024-03-15",
    },
    {
      id: 2,
      title: "Modern CSS Techniques for 2024",
      slug: "modern-css-techniques-2024",
      excerpt:
        "Eksplorasi teknik styling modern dengan Tailwind CSS, CSS Grid, container queries, dan micro-interactions untuk UI web responsif kelas dunia.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
      tags: ["CSS", "Frontend", "UI/UX"],
      readTime: 4,
      createdAt: "2024-02-28",
    },
    {
      id: 3,
      title: "Getting Started with TypeScript in 2024",
      slug: "getting-started-typescript-2024",
      excerpt:
        "Fundamental dan best practices TypeScript untuk developer modern, mulai dari strict type checking hingga integrasi ke ekosistem React.",
      coverImageUrl:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      tags: ["TypeScript", "Frontend", "JavaScript"],
      readTime: 3,
      createdAt: "2024-01-20",
    },
  ],
};

