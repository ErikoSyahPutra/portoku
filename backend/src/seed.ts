import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { Project } from './modules/project/project.entity';
import { Academic } from './modules/academic/academic.entity';
import { Experience } from './modules/experience/experience.entity';
import { Blog } from './modules/blog/blog.entity';
import { Award } from './modules/award/award.entity';
import { Profile } from './modules/profile/profile.entity';

async function seed() {
  const ds = new DataSource(
    process.env.DATABASE_URL
      ? {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [Project, Academic, Experience, Blog, Award, Profile],
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {
          type: 'sqlite',
          database: join(__dirname, '..', 'database.sqlite'),
          entities: [Project, Academic, Experience, Blog, Award, Profile],
          synchronize: true,
        }
  );

  await ds.initialize();
  console.log('📦 Database connected. Seeding...');

  // Profile
  const profileRepo = ds.getRepository(Profile);
  const existingProfile = await profileRepo.find();
  if (existingProfile.length === 0) {
    await profileRepo.save({
      name: 'Mahesa',
      title: 'Full Stack Developer',
      bio: 'Crafting digital experiences with modern technologies. Passionate about clean code, elegant design, and building products that make a difference.',
      aboutMe: 'I am a Full Stack Developer with a deep passion for creating beautiful, performant web applications. With expertise spanning from pixel-perfect frontends to robust backend architectures, I bring ideas to life through code.\n\nMy journey in tech started with curiosity and has evolved into a career dedicated to pushing the boundaries of what\'s possible on the web. I believe in writing clean, maintainable code and creating experiences that users love.\n\nWhen I\'m not coding, you can find me exploring new technologies, contributing to open source, or sharing knowledge through my blog.',
      email: 'hello@mahesa.dev',
      location: 'Indonesia',
      githubUrl: 'https://github.com/mahesa',
      linkedinUrl: 'https://linkedin.com/in/mahesa',
      showProjects: true,
      showExperiences: true,
      showAcademics: true,
      showBlog: true,
      showAwards: true,
    });
  }

  // Projects
  const projectRepo = ds.getRepository(Project);
  const existingProjects = await projectRepo.find();
  if (existingProjects.length === 0) {
    await projectRepo.save([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with real-time inventory, payment integration, and admin dashboard. Built with Next.js and NestJS.',
        imageUrl: '/uploads/ecommerce.png',
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/example',
        technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Stripe', 'Redis'],
        featured: true,
        order: 1,
      },
      {
        title: 'Project Management Tool',
        description: 'Collaborative project management application with kanban boards, real-time updates, and team analytics.',
        imageUrl: '/uploads/project_management.png',
        liveUrl: 'https://example.com',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
        featured: true,
        order: 2,
      },
      {
        title: 'Healthcare Dashboard',
        description: 'Interactive analytics dashboard for healthcare providers with patient data visualization and reporting tools.',
        imageUrl: '/uploads/healthcare.png',
        technologies: ['Vue.js', 'D3.js', 'Express', 'PostgreSQL'],
        featured: true,
        order: 3,
      },
      {
        title: 'Social Media Analytics',
        description: 'Platform for tracking and analyzing social media performance across multiple channels with AI-powered insights.',
        technologies: ['Next.js', 'Python', 'TensorFlow', 'AWS'],
        featured: false,
        order: 4,
      },
      {
        title: 'Restaurant POS System',
        description: 'Point-of-sale system for restaurants with order management, kitchen display, and customer-facing menu.',
        liveUrl: 'https://example.com',
        technologies: ['React', 'NestJS', 'MySQL', 'WebSocket'],
        featured: false,
        order: 5,
      },
      {
        title: 'Learning Management System',
        description: 'Online learning platform with video courses, quizzes, progress tracking, and certification.',
        technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'AWS S3'],
        featured: false,
        order: 6,
      },
    ]);
  }

  // Academics
  const academicRepo = ds.getRepository(Academic);
  const existingAcademics = await academicRepo.find();
  if (existingAcademics.length === 0) {
    await academicRepo.save([
      {
        institution: 'Universitas Indonesia',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startYear: 2019,
        endYear: 2023,
        gpa: '3.85',
        description: 'Focused on Software Engineering, Data Structures, and Web Technologies. Active in coding competitions and tech community.',
        order: 1,
      },
      {
        institution: 'SMA Negeri 1 Jakarta',
        degree: 'High School Diploma',
        field: 'Science (IPA)',
        startYear: 2016,
        endYear: 2019,
        description: 'Graduated with honors. Active member of the computer science club.',
        order: 2,
      },
    ]);
  }

  // Experiences
  const experienceRepo = ds.getRepository(Experience);
  const existingExperiences = await experienceRepo.find();
  if (existingExperiences.length === 0) {
    await experienceRepo.save([
      {
        company: 'Tech Startup Inc.',
        position: 'Senior Full Stack Developer',
        location: 'Jakarta, Indonesia',
        startDate: '2024-01',
        current: true,
        description: 'Leading frontend architecture and building scalable backend services. Mentoring junior developers and establishing best practices across the team.',
        skills: ['Next.js', 'NestJS', 'TypeScript', 'AWS', 'Docker'],
        order: 1,
      },
      {
        company: 'Digital Agency Co.',
        position: 'Full Stack Developer',
        location: 'Jakarta, Indonesia',
        startDate: '2023-03',
        endDate: '2024-01',
        current: false,
        description: 'Developed and maintained multiple client projects. Implemented CI/CD pipelines and improved application performance by 40%.',
        skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL'],
        order: 2,
      },
      {
        company: 'Freelance',
        position: 'Web Developer',
        location: 'Remote',
        startDate: '2021-06',
        endDate: '2023-03',
        current: false,
        description: 'Built custom websites and web applications for various clients. Specialized in e-commerce and business management solutions.',
        skills: ['JavaScript', 'PHP', 'Laravel', 'MySQL', 'WordPress'],
        order: 3,
      },
    ]);
  }

  // Blogs
  const blogRepo = ds.getRepository(Blog);
  const existingBlogs = await blogRepo.find();
  if (existingBlogs.length === 0) {
    await blogRepo.save([
      {
        title: 'Building Scalable APIs with NestJS',
        slug: 'building-scalable-apis-nestjs',
        excerpt: 'Learn how to architect and build production-ready APIs using NestJS framework with TypeScript.',
        content: '# Building Scalable APIs with NestJS\n\nNestJS has become one of the most popular frameworks for building server-side applications with Node.js. In this comprehensive guide, we\'ll explore best practices for building scalable, maintainable APIs.\n\n## Why NestJS?\n\nNestJS provides a robust architectural pattern inspired by Angular, making it easy to build well-structured applications. Its dependency injection system, modular architecture, and TypeScript support make it an excellent choice for enterprise applications.\n\n## Key Concepts\n\n### Modules\nModules are the fundamental building blocks of NestJS applications. They help organize code into cohesive blocks of functionality.\n\n### Controllers\nControllers handle incoming requests and return responses. They define routes and handle HTTP methods.\n\n### Services\nServices contain business logic and can be injected into controllers or other services.\n\n## Best Practices\n\n1. **Use DTOs for validation** - Always validate incoming data\n2. **Implement proper error handling** - Use exception filters\n3. **Write comprehensive tests** - Unit and e2e tests\n4. **Use environment variables** - Never hardcode sensitive data\n\nBy following these patterns, you can build APIs that are easy to maintain and scale as your application grows.',
        tags: ['NestJS', 'TypeScript', 'API', 'Backend'],
        published: true,
        readTime: 5,
      },
      {
        title: 'Modern CSS Techniques for 2024',
        slug: 'modern-css-techniques-2024',
        excerpt: 'Explore the latest CSS features and techniques that are transforming web design in 2024.',
        content: '# Modern CSS Techniques for 2024\n\nCSS continues to evolve rapidly, bringing powerful new features that simplify complex layouts and animations. Let\'s explore what\'s new.\n\n## Container Queries\n\nContainer queries allow you to style elements based on the size of their container rather than the viewport. This is a game-changer for component-based architectures.\n\n## CSS Nesting\n\nNative CSS nesting is finally here, reducing the need for preprocessors like SASS for basic nesting functionality.\n\n## The :has() Selector\n\nOften called the "parent selector," :has() enables selecting parent elements based on their children, opening up entirely new styling possibilities.\n\n## View Transitions API\n\nSmooth page transitions are now possible without JavaScript frameworks, creating app-like experiences in regular web pages.\n\n## Conclusion\n\nThese features represent a significant leap forward in CSS capabilities, making it easier than ever to create beautiful, responsive web experiences.',
        tags: ['CSS', 'Frontend', 'Web Design'],
        published: true,
        readTime: 4,
      },
      {
        title: 'Getting Started with TypeScript in 2024',
        slug: 'getting-started-typescript-2024',
        excerpt: 'A beginner-friendly guide to TypeScript and why it should be your go-to language for web development.',
        content: '# Getting Started with TypeScript\n\nTypeScript has become the standard for modern web development. This guide will help you get started with confidence.\n\n## What is TypeScript?\n\nTypeScript is a superset of JavaScript that adds static typing. It compiles to plain JavaScript and works everywhere JavaScript does.\n\n## Why TypeScript?\n\n- **Type Safety**: Catch errors at compile time\n- **Better IDE Support**: Autocomplete and refactoring\n- **Self-Documenting**: Types serve as documentation\n- **Enterprise Ready**: Perfect for large codebases\n\n## Getting Started\n\n```typescript\ninterface User {\n  name: string;\n  email: string;\n  age: number;\n}\n\nfunction greetUser(user: User): string {\n  return `Hello, ${user.name}!`;\n}\n```\n\nStart your TypeScript journey today and never look back!',
        tags: ['TypeScript', 'JavaScript', 'Programming'],
        published: true,
        readTime: 3,
      },
    ]);
  }

  // Awards
  const awardRepo = ds.getRepository(Award);
  const existingAwards = await awardRepo.find();
  if (existingAwards.length === 0) {
    await awardRepo.save([
      {
        title: '1st Place - National Hackathon',
        issuer: 'TechFest Indonesia',
        year: 2023,
        description: 'Won first place in the national hackathon competition for developing an innovative healthcare solution.',
        order: 1,
      },
      {
        title: 'Best Web Application Award',
        issuer: 'Google Developer Student Club',
        year: 2022,
        description: 'Recognized for building the best web application in the university developer community showcase.',
        order: 2,
      },
      {
        title: 'Dean\'s List',
        issuer: 'Universitas Indonesia',
        year: 2022,
        description: 'Achieved Dean\'s List recognition for outstanding academic performance in Computer Science program.',
        order: 3,
      },
      {
        title: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: 2023,
        description: 'Certified AWS Cloud Practitioner demonstrating foundational understanding of AWS Cloud services.',
        credentialUrl: 'https://aws.amazon.com/certification',
        order: 4,
      },
    ]);
  }

  console.log('✅ Seeding complete!');
  await ds.destroy();
}

seed().catch(console.error);
