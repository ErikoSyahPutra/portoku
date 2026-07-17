# Auto-Translation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an automatic translation feature (ID <-> EN) that dynamically translates database-driven portofolio content using Google Translate (with SQLite DB caching) and handles static UI text using a local dictionary.

**Architecture:** A NestJS `TranslationService` in the backend uses `fetch` to translate dynamically fetched content and cache translations in SQLite via TypeORM. The Next.js frontend uses query params (`?lang=en` / `?lang=id`) in Server Components and updates the URL via an elegant Navbar toggle.

**Tech Stack:** NestJS, TypeScript, TypeORM, SQLite, Next.js (Server/Client components), React.

## Global Constraints
- Naming convention: backend modules use nestjs-style (singular), entities match database schema.
- Language support: default to Indonesian (`id`), target to English (`en`).
- Caching: translation requests must first check the `translation_cache` table.

---

### Task 1: Backend Translation Cache Entity and Setup
**Files:**
- Create: `backend/src/modules/translation/translation-cache.entity.ts`
- Create: `backend/src/modules/translation/translation.service.ts`
- Create: `backend/src/modules/translation/translation.module.ts`
- Modify: `backend/src/app.module.ts`

**Interfaces:**
- Produces: `TranslationService.translate(text: string, targetLang: string): Promise<string>`

- [ ] **Step 1: Create Translation Cache Entity**
  Create `backend/src/modules/translation/translation-cache.entity.ts`:
  ```typescript
  import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

  @Entity('translation_cache')
  export class TranslationCache {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'text' })
    sourceText: string;

    @Column({ length: 10 })
    targetLang: string;

    @Column({ type: 'text' })
    translatedText: string;
  }
  ```

- [ ] **Step 2: Create Translation Service**
  Create `backend/src/modules/translation/translation.service.ts`:
  ```typescript
  import { Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { TranslationCache } from './translation-cache.entity';

  @Injectable()
  export class TranslationService {
    constructor(
      @InjectRepository(TranslationCache)
      private readonly repo: Repository<TranslationCache>,
    ) {}

    async translate(text: string, targetLang: string): Promise<string> {
      if (!text || !text.trim() || targetLang === 'id') {
        return text;
      }
      const trimmed = text.trim();
      try {
        const cached = await this.repo.findOneBy({ sourceText: trimmed, targetLang });
        if (cached) {
          return cached.translatedText;
        }

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Google API status error: ${res.status}`);
        }
        const data = await res.json();
        
        let translatedText = '';
        if (data && data[0]) {
          translatedText = data[0].map((x: any) => x[0]).filter(Boolean).join('');
        }

        if (!translatedText) {
          return trimmed;
        }

        const newCache = this.repo.create({
          sourceText: trimmed,
          targetLang,
          translatedText,
        });
        await this.repo.save(newCache);

        return translatedText;
      } catch (err) {
        console.error('Translation error:', err);
        return trimmed;
      }
    }
  }
  ```

- [ ] **Step 3: Create Translation Module**
  Create `backend/src/modules/translation/translation.module.ts`:
  ```typescript
  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { TranslationCache } from './translation-cache.entity';
  import { TranslationService } from './translation.service';

  @Module({
    imports: [TypeOrmModule.forFeature([TranslationCache])],
    providers: [TranslationService],
    exports: [TranslationService],
  })
  export class TranslationModule {}
  ```

- [ ] **Step 4: Register TranslationModule in AppModule**
  Modify `backend/src/app.module.ts`:
  Import `TranslationModule` and `TranslationCache` and register them in TypeORM configuration:
  ```typescript
  // Add imports:
  import { TranslationModule } from './modules/translation/translation.module';
  import { TranslationCache } from './modules/translation/translation-cache.entity';

  // Add TranslationModule to imports array, and TranslationCache to the TypeOrm entities array:
  // entities: [..., TranslationCache]
  // imports: [..., TranslationModule]
  ```

- [ ] **Step 5: Run backend build to verify compilation**
  Run: `npm run build` inside `backend` folder.
  Expected: PASS compilation.

- [ ] **Step 6: Commit**
  ```bash
  git add backend/src/modules/translation/ backend/src/app.module.ts
  git commit -m "feat(backend): add TranslationModule with SQLite cache"
  ```

---

### Task 2: Implement Translation in Backend Services
**Files:**
- Modify: `backend/src/modules/profile/profile.module.ts`
- Modify: `backend/src/modules/profile/profile.service.ts`
- Modify: `backend/src/modules/profile/profile.controller.ts`
- Modify: `backend/src/modules/project/project.module.ts`
- Modify: `backend/src/modules/project/project.service.ts`
- Modify: `backend/src/modules/project/project.controller.ts`
- Modify: `backend/src/modules/experience/experience.module.ts`
- Modify: `backend/src/modules/experience/experience.service.ts`
- Modify: `backend/src/modules/experience/experience.controller.ts`
- Modify: `backend/src/modules/academic/academic.module.ts`
- Modify: `backend/src/modules/academic/academic.service.ts`
- Modify: `backend/src/modules/academic/academic.controller.ts`
- Modify: `backend/src/modules/award/award.module.ts`
- Modify: `backend/src/modules/award/award.service.ts`
- Modify: `backend/src/modules/award/award.controller.ts`
- Modify: `backend/src/modules/blog/blog.module.ts`
- Modify: `backend/src/modules/blog/blog.service.ts`
- Modify: `backend/src/modules/blog/blog.controller.ts`

**Interfaces:**
- Consumes: `TranslationService`

- [ ] **Step 1: Update Profile module & service**
  - In `profile.module.ts`, import `TranslationModule` and add to `imports`.
  - In `profile.controller.ts`, update `get` method to receive `@Query('lang') lang?: string`.
  - In `profile.service.ts`, inject `TranslationService` and translate `title`, `bio`, `aboutMe` if `lang === 'en'`.
  
  Code in `profile.service.ts`:
  ```typescript
  // Inject:
  // constructor(..., private readonly translationService: TranslationService) {}
  // Inside get():
  // const item = profiles[0];
  // if (lang === 'en') {
  //   item.title = await this.translationService.translate(item.title, 'en');
  //   item.bio = await this.translationService.translate(item.bio, 'en');
  //   item.aboutMe = await this.translationService.translate(item.aboutMe, 'en');
  // }
  ```

- [ ] **Step 2: Update Project module & service**
  - In `project.module.ts`, import `TranslationModule`.
  - In `project.controller.ts`, update endpoints to accept `@Query('lang') lang?: string` and pass to service.
  - In `project.service.ts`, translate `title` and `description` of returned list/single item.

- [ ] **Step 3: Update Experience module & service**
  - In `experience.module.ts`, import `TranslationModule`.
  - In `experience.controller.ts`, update endpoints to accept `@Query('lang') lang?: string`.
  - In `experience.service.ts`, translate `position`, `location`, and `description`.

- [ ] **Step 4: Update Academic module & service**
  - In `academic.module.ts`, import `TranslationModule`.
  - In `academic.controller.ts`, update endpoints to accept `@Query('lang') lang?: string`.
  - In `academic.service.ts`, translate `institution`, `degree`, `field`, and `description`.

- [ ] **Step 5: Update Award module & service**
  - In `award.module.ts`, import `TranslationModule`.
  - In `award.controller.ts`, update endpoints to accept `@Query('lang') lang?: string`.
  - In `award.service.ts`, translate `title` and `description`.

- [ ] **Step 6: Update Blog module & service**
  - In `blog.module.ts`, import `TranslationModule`.
  - In `blog.controller.ts`, update endpoints to accept `@Query('lang') lang?: string`.
  - In `blog.service.ts`, translate `title`, `excerpt`, and `content`.

- [ ] **Step 7: Verify compilation**
  Run: `npm run build` inside `backend` folder.
  Expected: PASS compilation.

- [ ] **Step 8: Commit**
  ```bash
  git add backend/src/modules/
  git commit -m "feat(backend): implement translation layer across all resource modules"
  ```

---

### Task 3: Frontend API Adaptation and Translations File
**Files:**
- Create: `frontend/src/lib/translations.ts`
- Modify: `frontend/src/lib/api.ts`

**Interfaces:**
- Produces: Local dictionary translation keys and lang parameter capability in API fetcher.

- [ ] **Step 1: Create translations dictionary**
  Create `frontend/src/lib/translations.ts`:
  ```typescript
  export const translations: Record<string, Record<string, string>> = {
    id: {
      availableForWork: "Tersedia untuk bekerja",
      viewWork: "Lihat Pekerjaan Saya",
      aboutMe: "Tentang Saya",
      littleAboutMe: "Sedikit tentang saya",
      location: "Lokasi",
      email: "Email",
      projects: "Proyek",
      yearsExp: "Tahun Pengalaman",
      awards: "Penghargaan",
      articles: "Artikel",
      featuredProjects: "Proyek Pilihan",
      workExperience: "Pengalaman Kerja",
      academicBackground: "Riwayat Pendidikan",
      latestArticles: "Artikel Terbaru",
      awardsAchievements: "Penghargaan & Prestasi",
      viewCredential: "Lihat Sertifikat",
      about: "Tentang",
      education: "Pendidikan",
      blog: "Blog",
      readTime: "menit baca",
      career: "Karir",
      recognition: "Pengakuan",
      portfolio: "Portofolio",
      projectsSubtitle: "Pilihan proyek yang telah saya bangun — dari aplikasi full-stack hingga sistem kompleks.",
      experienceSubtitle: "Perjalanan profesional saya di industri teknologi.",
      blogSubtitle: "Pemikiran tentang pengembangan web, desain, dan teknologi.",
      availableBadge: "Tersedia untuk bekerja",
    },
    en: {
      availableForWork: "Available for work",
      viewWork: "View My Work",
      aboutMe: "About Me",
      littleAboutMe: "A little about me",
      location: "Location",
      email: "Email",
      projects: "Projects",
      yearsExp: "Years Exp",
      awards: "Awards",
      articles: "Articles",
      featuredProjects: "Featured Projects",
      workExperience: "Work Experience",
      academicBackground: "Academic Background",
      latestArticles: "Latest Articles",
      awardsAchievements: "Awards & Achievements",
      viewCredential: "View Credential",
      about: "About",
      education: "Education",
      blog: "Blog",
      readTime: "min read",
      career: "Career",
      recognition: "Recognition",
      portfolio: "Portfolio",
      projectsSubtitle: "A selection of projects I've built — from full-stack applications to complex systems.",
      experienceSubtitle: "My professional journey in the tech industry.",
      blogSubtitle: "Thoughts on development, design, and technology.",
      availableBadge: "Available for work",
    }
  };
  ```

- [ ] **Step 2: Update frontend API client**
  Modify `frontend/src/lib/api.ts` to accept `lang?: string` and append to endpoint URL:
  ```typescript
  // Update fetcher:
  async function fetcher<T>(endpoint: string, lang?: string): Promise<T> {
    const query = lang ? `?lang=${lang}` : '';
    const res = await fetch(`${API}${endpoint}${query}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  // Update api object methods to accept lang and pass it:
  export const api = {
    getProfile: (lang?: string) => fetcher<Profile>("/profile", lang),
    getProjects: (lang?: string) => fetcher<Project[]>("/projects", lang),
    getAcademics: (lang?: string) => fetcher<Academic[]>("/academics", lang),
    getExperiences: (lang?: string) => fetcher<Experience[]>("/experiences", lang),
    getBlogs: (lang?: string) => fetcher<Blog[]>("/blogs", lang),
    getBlog: (slug: string, lang?: string) => fetcher<Blog>(`/blogs/slug/${slug}`, lang),
    getAwards: (lang?: string) => fetcher<Award[]>("/awards", lang),
  };
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add frontend/src/lib/translations.ts frontend/src/lib/api.ts
  git commit -m "feat(frontend): add local translation dict and update API client"
  ```

---

### Task 4: Frontend UI Pages and Language Toggle Navbar Integration
**Files:**
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/components/Navbar.tsx`

- [ ] **Step 1: Translate `page.tsx` static text & fetch dynamic content using parameter**
  Modify `frontend/src/app/page.tsx`:
  - Fetch query param `lang` in the Server Component using `searchParams`:
    ```typescript
    export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
      const { lang = "id" } = await searchParams;
      // ... pass lang to api calls ...
    ```
  - Replace static texts with their translated versions from `translations[lang]`.
  - For example, `<span className="dot" /> Available for work` becomes `<span className="dot" /> {t.availableBadge}`.

- [ ] **Step 2: Add Language Toggle to Navbar**
  Modify `frontend/src/components/Navbar.tsx`:
  - Fetch current lang from URL query parameter using `useSearchParams`.
  - Create a premium language switcher button (e.g. `ID | EN` toggle button) next to the theme toggle.
  - Implement language selection persistence with `localStorage`.
  - Sync the selection with page navigation:
    ```typescript
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentLang = searchParams.get("lang") || "id";

    const changeLanguage = (lang: string) => {
      localStorage.setItem("lang", lang);
      // Navigate to /?lang=lang
      window.location.search = `?lang=${lang}`;
    };
    ```

- [ ] **Step 3: Add CSS for language switcher**
  Add styles in `frontend/src/app/globals.css` or inside `Navbar.tsx` styling classes:
  Provide a stylish, glowing button toggle:
  ```css
  .lang-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .lang-toggle button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    color: var(--text-secondary);
    border-radius: 12px;
    transition: all 0.2s ease;
  }
  .lang-toggle button.active {
    background: var(--accent-primary);
    color: var(--bg-primary);
    box-shadow: 0 0 8px var(--accent-primary);
  }
  ```

- [ ] **Step 4: Verify full site integration**
  Start backend server, run frontend dev, toggle languages, and verify results.

- [ ] **Step 5: Commit**
  ```bash
  git add frontend/src/app/page.tsx frontend/src/components/Navbar.tsx
  git commit -m "feat(frontend): integrate language toggle and localize landing page"
  ```
