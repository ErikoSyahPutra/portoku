import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import * as fs from 'fs';
import { Project } from './modules/project/project.entity';
import { Academic } from './modules/academic/academic.entity';
import { Experience } from './modules/experience/experience.entity';
import { Blog } from './modules/blog/blog.entity';
import { Award } from './modules/award/award.entity';
import { Profile } from './modules/profile/profile.entity';

// Helper to parse key-value structured Markdown files
function parseMarkdownFile(filePath: string): Record<string, string>[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Split by section header lines e.g. "## "
  const rawSections = content.split(/\n##\s+/);
  const items: Record<string, string>[] = [];
  
  for (const sec of rawSections) {
    if (!sec.trim() || sec.startsWith('#')) continue; // Skip title header
    
    const lines = sec.split('\n');
    const data: Record<string, string> = {};
    let currentKey = '';
    let currentValLines: string[] = [];
    let inCodeBlock = false;
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      // Match keys like: ### **POSITION** or - **Institution** or - **LogoUrl**
      const keyMatch = line.match(/^(?:###\s+\*\*|[-*]\s+\*\*|###\s+)([^*#()]+)/i);
      if (keyMatch) {
        if (currentKey) {
          data[currentKey] = currentValLines.join('\n').trim();
        }
        currentKey = keyMatch[1].trim().toUpperCase();
        currentValLines = [];
        inCodeBlock = false;
        
        // Match inline paths like "/uploads/..."
        const pathMatch = line.match(/\/uploads\/[^\s`")]+/);
        if (pathMatch) {
          currentValLines.push(pathMatch[0]);
        }
        continue;
      }
      
      if (currentKey) {
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            inCodeBlock = false;
            data[currentKey] = currentValLines.join('\n').trim();
            currentKey = '';
            currentValLines = [];
          } else {
            inCodeBlock = true;
          }
          continue;
        }
        
        if (inCodeBlock) {
          currentValLines.push(line);
        } else {
          // Check for inline fields outside code blocks
          const pathMatch = line.match(/\/uploads\/[^\s`")]+/);
          if (pathMatch) {
            currentValLines.push(pathMatch[0]);
          } else if (line.includes('Checked (True)') || line.includes('True')) {
            currentValLines.push('true');
          } else if (line.includes('Unchecked (False)') || line.includes('False')) {
            currentValLines.push('false');
          } else if (line.startsWith('-') || line.startsWith('*')) {
            currentValLines.push(line);
          }
        }
      }
    }
    
    if (currentKey && currentValLines.length > 0) {
      data[currentKey] = currentValLines.join('\n').trim();
    }
    
    if (Object.keys(data).length > 0) {
      items.push(data);
    }
  }
  return items;
}

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

  // Paths to source Markdown files
  const rootDir = join(__dirname, '..', '..');
  const projectsMdPath = join(rootDir, 'projects_data.md');
  const experiencesMdPath = join(rootDir, 'experiences_data.md');
  const academicsMdPath = join(rootDir, 'academics_data.md');

  // Seeding Profile
  const profileRepo = ds.getRepository(Profile);
  const existingProfile = await profileRepo.find();
  if (existingProfile.length === 0) {
    console.log('Seeding default Profile...');
    await profileRepo.save({
      name: 'Eriko Syah Putra Friyadi',
      title: 'Full Stack Developer',
      bio: 'Crafting digital experiences with modern technologies. Passionate about clean code, elegant design, and building products that make a difference.',
      aboutMe: 'I am a Full Stack Developer with a deep passion for creating beautiful, performant web applications. With expertise spanning from pixel-perfect frontends to robust backend architectures, I bring ideas to life through code.\n\nMy journey in tech started with curiosity and has evolved into a career dedicated to pushing the boundaries of what\'s possible on the web. I believe in writing clean, maintainable code and creating experiences that users love.\n\nWhen I\'m not coding, you can find me exploring new technologies, contributing to open source, or sharing knowledge through my blog.',
      email: 'erikosyahputraf@gmail.com',
      location: 'Indonesia',
      githubUrl: 'https://github.com/ErikoSyahPutra',
      linkedinUrl: 'https://linkedin.com/in/erikosyahputra',
      showProjects: true,
      showExperiences: true,
      showAcademics: true,
      showBlog: true,
      showAwards: true,
      showOrganizations: true,
    });
  }

  // Seeding Projects
  const projectRepo = ds.getRepository(Project);
  if (fs.existsSync(projectsMdPath)) {
    console.log('Auto-seeding Projects from projects_data.md...');
    const parsed = parseMarkdownFile(projectsMdPath);
    if (parsed.length > 0) {
      await projectRepo.clear();
      const projectsToSeed = parsed.map((item) => ({
        title: item['TITLE'] || '',
        description: item['DESCRIPTION'] || '',
        imageUrl: item['PROJECT IMAGE'] || '',
        category: (item['CATEGORY'] || 'web').toLowerCase(),
        liveUrl: item['LIVE URL'] || '',
        githubUrl: item['GITHUB URL'] || '',
        figmaUrl: item['FIGMA URL'] || '',
        behanceUrl: item['BEHANCE URL'] || '',
        technologies: (item['TECHNOLOGIES'] || '').split(',').map((t) => t.trim()).filter(Boolean),
        featured: (item['FEATURED'] || '').toLowerCase() === 'true',
        order: parseInt(item['SORT ORDER'] || '0') || 0,
      }));
      await projectRepo.save(projectsToSeed);
      console.log(`Successfully seeded ${projectsToSeed.length} Projects.`);
    }
  } else {
    const existingProjects = await projectRepo.find();
    if (existingProjects.length === 0) {
      console.log('Seeding mock Projects (fallback)...');
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
      ]);
    }
  }

  // Seeding Experiences
  const experienceRepo = ds.getRepository(Experience);
  if (fs.existsSync(experiencesMdPath)) {
    console.log('Auto-seeding Experiences from experiences_data.md...');
    const parsed = parseMarkdownFile(experiencesMdPath);
    if (parsed.length > 0) {
      await experienceRepo.clear();
      const experiencesToSeed = parsed.map((item) => ({
        position: item['POSITION'] || '',
        company: item['COMPANY'] || '',
        logoUrl: item['COMPANY LOGO'] || '',
        location: item['LOCATION'] || '',
        startDate: item['START DATE'] || '',
        endDate: item['END DATE'] || undefined,
        current: (item['CURRENTLY WORKING HERE'] || '').toLowerCase() === 'true',
        description: item['DESCRIPTION'] || '',
        skills: (item['SKILLS'] || '').split(',').map((s) => s.trim()).filter(Boolean),
        order: parseInt(item['SORT ORDER'] || '0') || 0,
      }));
      await experienceRepo.save(experiencesToSeed);
      console.log(`Successfully seeded ${experiencesToSeed.length} Experiences.`);
    }
  } else {
    const existingExperiences = await experienceRepo.find();
    if (existingExperiences.length === 0) {
      console.log('Seeding mock Experiences (fallback)...');
      await experienceRepo.save([
        {
          company: 'Tech Startup Inc.',
          position: 'Senior Full Stack Developer',
          location: 'Jakarta, Indonesia',
          startDate: '2024-01',
          current: true,
          description: 'Leading frontend architecture and building scalable backend services.',
          skills: ['Next.js', 'NestJS', 'TypeScript', 'AWS', 'Docker'],
          order: 1,
        },
      ]);
    }
  }

  // Seeding Academics
  const academicRepo = ds.getRepository(Academic);
  if (fs.existsSync(academicsMdPath)) {
    console.log('Auto-seeding Academics from academics_data.md...');
    const parsed = parseMarkdownFile(academicsMdPath);
    if (parsed.length > 0) {
      await academicRepo.clear();
      const academicsToSeed = parsed.map((item) => ({
        institution: item['INSTITUTION'] || '',
        logoUrl: item['LOGOURL'] || '',
        degree: item['DEGREE'] || '',
        field: item['FIELD'] || '',
        startYear: parseInt(item['STARTYEAR'] || '0') || 0,
        endYear: parseInt(item['ENDYEAR'] || '0') || undefined,
        gpa: item['GPA'] || '',
        description: item['DESCRIPTION'] || '',
        order: parseInt(item['ORDER'] || '0') || 0,
      }));
      await academicRepo.save(academicsToSeed);
      console.log(`Successfully seeded ${academicsToSeed.length} Academics.`);
    }
  } else {
    const existingAcademics = await academicRepo.find();
    if (existingAcademics.length === 0) {
      console.log('Seeding mock Academics (fallback)...');
      await academicRepo.save([
        {
          institution: 'Universitas Indonesia',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startYear: 2019,
          endYear: 2023,
          gpa: '3.85',
          description: 'Focused on Software Engineering and Web Technologies.',
          order: 1,
        },
      ]);
    }
  }

  // Seeding Blogs (fallback only, as blogs are manually written)
  const blogRepo = ds.getRepository(Blog);
  const existingBlogs = await blogRepo.find();
  if (existingBlogs.length === 0) {
    console.log('Seeding mock Blogs...');
    await blogRepo.save([
      {
        title: 'Building Scalable APIs with NestJS',
        slug: 'building-scalable-apis-nestjs',
        excerpt: 'Learn how to architect and build production-ready APIs using NestJS framework with TypeScript.',
        content: '# Building Scalable APIs with NestJS\n\nNestJS has become one of the most popular frameworks for building server-side applications with Node.js.',
        tags: ['NestJS', 'TypeScript', 'API', 'Backend'],
        published: true,
        readTime: 5,
      },
    ]);
  }

  // Seeding Awards (fallback only)
  const awardRepo = ds.getRepository(Award);
  const existingAwards = await awardRepo.find();
  if (existingAwards.length === 0) {
    console.log('Seeding mock Awards...');
    await awardRepo.save([
      {
        title: '1st Place - National Hackathon',
        issuer: 'TechFest Indonesia',
        year: 2023,
        description: 'Won first place in the national hackathon competition.',
        order: 1,
      },
    ]);
  }

  console.log('✅ Seeding complete!');
  await ds.destroy();
}

seed().catch(console.error);
