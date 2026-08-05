# SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comprehensive technical, metadata, structured data (JSON-LD), sitemap, and on-page SEO overhaul for the portfolio website (`https://erikosyah.my.id`).

**Architecture:** Utilize Next.js 15 App Router built-in SEO capabilities (`Metadata`, `metadataBase`, `manifest.ts`, `sitemap.ts`) alongside Schema.org JSON-LD scripts for Rich Snippets.

**Tech Stack:** Next.js 15, TypeScript, Schema.org JSON-LD, Web App Manifest.

## Global Constraints

- Primary domain: `https://erikosyah.my.id`
- Canonical URLs must always use absolute paths with `https://erikosyah.my.id`
- Multi-language support must include `hreflang` for `id` and `en`
- No fragment `#` URLs inside `sitemap.ts`

---

### Task 1: Root Layout Metadata & Person Schema

**Files:**
- Modify: `frontend/src/app/layout.tsx`

**Interfaces:**
- Consumes: Next.js `Metadata` type
- Produces: Root metadata object, `metadataBase`, OpenGraph, Twitter Cards, `hreflang` alternates, and `Person` JSON-LD schema.

- [ ] **Step 1: Update metadata object and Person JSON-LD schema in `frontend/src/app/layout.tsx`**

Replace `export const metadata` and `<head>` JSON-LD in `frontend/src/app/layout.tsx` with:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://erikosyah.my.id"),
  title: {
    default: "Eriko Syah Putra Friyadi | Full Stack Developer",
    template: "%s | Eriko Syah Putra",
  },
  description: "Full Stack Developer specializing in Web Development, Next.js, React, Node.js, and modern cloud technologies. View my portfolio, experience, and articles.",
  keywords: [
    "Eriko Syah Putra Friyadi",
    "Eriko Syah Putra",
    "Full Stack Developer",
    "Web Developer Indonesia",
    "React Developer",
    "Next.js Portfolio",
    "Software Engineer",
  ],
  authors: [{ name: "Eriko Syah Putra Friyadi", url: "https://erikosyah.my.id" }],
  creator: "Eriko Syah Putra Friyadi",
  publisher: "Eriko Syah Putra Friyadi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Eriko Syah Putra Friyadi | Full Stack Developer",
    description: "Full Stack Developer — Crafting digital experiences with modern web technologies.",
    url: "https://erikosyah.my.id",
    siteName: "Eriko Syah Putra Portfolio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eriko Syah Putra Friyadi | Full Stack Developer",
    description: "Full Stack Developer — Crafting digital experiences with modern web technologies.",
    creator: "@erikosyah",
  },
  alternates: {
    canonical: "https://erikosyah.my.id",
    languages: {
      "id-ID": "https://erikosyah.my.id?lang=id",
      "en-US": "https://erikosyah.my.id?lang=en",
    },
  },
};
```

And update the Person Schema JSON-LD script inside `RootLayout`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Eriko Syah Putra Friyadi",
  "alternateName": "Eriko Syah Putra",
  "url": "https://erikosyah.my.id",
  "jobTitle": "Full Stack Developer",
  "description": "Full Stack Developer crafting high-performance digital experiences with Next.js, React, Node.js, and modern technologies.",
  "sameAs": [
    "https://github.com",
    "https://linkedin.com"
  ],
  "knowsAbout": [
    "Web Development",
    "Full Stack Development",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "REST API",
    "UI/UX Design"
  ]
}
```

- [ ] **Step 2: Commit changes**

```bash
git add frontend/src/app/layout.tsx
git commit -m "feat(seo): enhance root layout metadata, alternates, and Person schema"
```

---

### Task 2: Create Web App Manifest

**Files:**
- Create: `frontend/src/app/manifest.ts`

- [ ] **Step 1: Create `frontend/src/app/manifest.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eriko Syah Putra Friyadi | Full Stack Developer',
    short_name: 'Eriko Portfolio',
    description: 'Full Stack Developer Portfolio showcasing projects, experience, and web development articles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090d16',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

- [ ] **Step 2: Commit changes**

```bash
git add frontend/src/app/manifest.ts
git commit -m "feat(seo): add web app manifest route"
```

---

### Task 3: Overhaul Sitemap Generation

**Files:**
- Modify: `frontend/src/app/sitemap.ts`

- [ ] **Step 1: Rewrite `frontend/src/app/sitemap.ts` to include clean canonical pages and dynamic project & blog detail URLs**

```typescript
import type { MetadataRoute } from 'next'
import { api } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://erikosyah.my.id'

  // Main pages (clean URLs without fragment hashes)
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // Dynamic Blog Posts
  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const blogs = await api.getBlogs('en')
    if (Array.isArray(blogs)) {
      blogUrls = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.createdAt ? new Date(blog.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    console.error('Failed to fetch blogs for sitemap')
  }

  // Dynamic Projects
  let projectUrls: MetadataRoute.Sitemap = []
  try {
    const projects = await api.getProjects('en')
    if (Array.isArray(projects)) {
      projectUrls = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    console.error('Failed to fetch projects for sitemap')
  }

  return [...mainPages, ...blogUrls, ...projectUrls]
}
```

- [ ] **Step 2: Commit changes**

```bash
git add frontend/src/app/sitemap.ts
git commit -m "feat(seo): optimize sitemap with dynamic project routes and clean URLs"
```

---

### Task 4: Blog Detail Metadata & BlogPosting Schema

**Files:**
- Modify: `frontend/src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Update `generateMetadata` and `BlogPosting` JSON-LD in `frontend/src/app/blog/[slug]/page.tsx`**

Ensure `coverImageUrl` is resolved to an absolute URL (`https://erikosyah.my.id/...` or external image), fix OpenGraph image structure, add canonical alternates, and enrich JSON-LD schema with `publisher` and `mainEntityOfPage`.

```typescript
function getAbsoluteImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://erikosyah.my.id${url.startsWith("/") ? "" : "/"}${url}`;
}
```

In `generateMetadata`:
```typescript
const ogImage = getAbsoluteImageUrl(blog.coverImageUrl);

return {
  title: `${blog.title} | Eriko's Blog`,
  description: blog.excerpt || blog.content.substring(0, 160),
  keywords: blog.tags?.join(", "),
  openGraph: {
    title: blog.title,
    description: blog.excerpt || blog.content.substring(0, 160),
    type: "article",
    url: `https://erikosyah.my.id/blog/${slug}`,
    images: ogImage ? [{ url: ogImage, alt: blog.title }] : [],
    publishedTime: new Date(blog.createdAt).toISOString(),
    authors: ["Eriko Syah Putra Friyadi"],
  },
  twitter: {
    card: "summary_large_image",
    title: blog.title,
    description: blog.excerpt || blog.content.substring(0, 160),
    images: ogImage ? [ogImage] : [],
  },
  alternates: {
    canonical: `https://erikosyah.my.id/blog/${slug}`,
    languages: {
      "id-ID": `https://erikosyah.my.id/blog/${slug}?lang=id`,
      "en-US": `https://erikosyah.my.id/blog/${slug}?lang=en`,
    },
  },
};
```

In `BlogPosting` Schema:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://erikosyah.my.id/blog/${slug}`
  },
  "headline": blog.title,
  "description": blog.excerpt || blog.content.substring(0, 160),
  "image": getAbsoluteImageUrl(blog.coverImageUrl),
  "datePublished": new Date(blog.createdAt).toISOString(),
  "dateModified": blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date(blog.createdAt).toISOString(),
  "author": {
    "@type": "Person",
    "name": "Eriko Syah Putra Friyadi",
    "url": "https://erikosyah.my.id"
  },
  "publisher": {
    "@type": "Person",
    "name": "Eriko Syah Putra Friyadi",
    "url": "https://erikosyah.my.id"
  },
  "keywords": blog.tags?.join(", ")
}
```

- [ ] **Step 2: Commit changes**

```bash
git add frontend/src/app/blog/\[slug\]/page.tsx
git commit -m "feat(seo): fix blog metadata image URLs, canonicals, and BlogPosting schema"
```

---

### Task 5: Project Detail Metadata & SoftwareApplication Schema

**Files:**
- Modify: `frontend/src/app/projects/[id]/page.tsx`

- [ ] **Step 1: Update `generateMetadata` and add `SoftwareApplication` JSON-LD in `frontend/src/app/projects/[id]/page.tsx`**

Ensure `imageUrl` is resolved to an absolute URL, update OpenGraph & Twitter tags, add canonical alternates, and insert `SoftwareApplication` / `CreativeWork` JSON-LD schema.

In `generateMetadata`:
```typescript
function getAbsoluteImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://erikosyah.my.id${url.startsWith("/") ? "" : "/"}${url}`;
}

const ogImage = getAbsoluteImageUrl(project.imageUrl);

return {
  title: `${project.title} | Projects`,
  description: project.description,
  keywords: project.technologies?.join(", "),
  openGraph: {
    title: project.title,
    description: project.description,
    type: "website",
    url: `https://erikosyah.my.id/projects/${id}`,
    images: ogImage ? [{ url: ogImage, alt: project.title }] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: project.title,
    description: project.description,
    images: ogImage ? [ogImage] : [],
  },
  alternates: {
    canonical: `https://erikosyah.my.id/projects/${id}`,
    languages: {
      "id-ID": `https://erikosyah.my.id/projects/${id}?lang=id`,
      "en-US": `https://erikosyah.my.id/projects/${id}?lang=en`,
    },
  },
};
```

In `ProjectDetail` component render, add JSON-LD script:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": project.title,
  "description": project.description,
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "image": getAbsoluteImageUrl(project.imageUrl),
  "url": `https://erikosyah.my.id/projects/${id}`,
  "author": {
    "@type": "Person",
    "name": "Eriko Syah Putra Friyadi",
    "url": "https://erikosyah.my.id"
  }
}
```

- [ ] **Step 2: Commit changes**

```bash
git add frontend/src/app/projects/\[id\]/page.tsx
git commit -m "feat(seo): add project detail metadata, image fallbacks, and SoftwareApplication schema"
```

---

### Task 6: On-Page Semantics & Image Alt Attributes Audit

**Files:**
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Check and update `page.tsx` to ensure `<h1>` heading exists and image tags have `alt` text**

Verify Hero section in `frontend/src/app/page.tsx` contains a single `<h1>` element for the main title (e.g. `<h1>{profile.name}</h1>`) and all dynamic `<img />` tags have non-empty `alt` attributes.

- [ ] **Step 2: Commit changes**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat(seo): ensure semantic h1 structure and alt attributes on homepage"
```

---

### Task 7: Build Verification & Validation

**Files:** None

- [ ] **Step 1: Run Next.js production build check to ensure zero TypeScript/lint errors**

Run: `npm run build` inside `frontend/` directory.
Expected: Build succeeds, output shows static and dynamic pages generated without error.

- [ ] **Step 2: Commit any build-related adjustments if required**
