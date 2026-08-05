# SEO Optimization Design Specification

**Date**: 2026-08-05  
**Target Domain**: `https://erikosyah.my.id`  
**Application**: Next.js App Router Portfolio (`frontend`)  

---

## 1. Executive Summary

This document specifies the technical, structured data, and on-page SEO overhaul for the portfolio application (`web-porto`). The goal is to maximize search engine indexing, search visibility, rich snippets (Google Rich Results), social media sharing previews (OpenGraph & Twitter cards), and multilingual indexing (`id`/`en`).

---

## 2. Scope of Changes

### 2.1 Global Metadata & Root Layout (`frontend/src/app/layout.tsx`)
- Set `metadataBase` to `new URL('https://erikosyah.my.id')`.
- Upgrade `export const metadata: Metadata`:
  - `title`: Template formatting `"Eriko Syah Putra Friyadi | Full Stack Developer Portfolio"`.
  - `description`: Comprehensive developer bio targeting key skills (Full Stack Developer, React, Next.js, Node.js, Web Development).
  - `keywords`: Array/string of target SEO keywords.
  - `alternates`: Add `languages` (`id-ID`, `en-US`) canonical and alternate URLs for i18n support.
  - `robots`: Enforce `"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"`.
- Upgrade JSON-LD `Person` Schema:
  - Properties: `@context`, `@type`, `name`, `url`, `jobTitle`, `description`, `image`, `sameAs` (GitHub, LinkedIn), and `knowsAbout` array of core skill keywords.

### 2.2 Web App Manifest (`frontend/src/app/manifest.ts`)
- Create `manifest.ts` using Next.js Metadata Route.
- Returns Web App Manifest JSON with site name, short name, start URL, theme color, background color, display mode (`standalone`), and icons.

### 2.3 Dynamic Sitemap (`frontend/src/app/sitemap.ts`)
- Remove anchor fragment URLs (`/#projects`, `/#experience`, `/#education`) since search engine crawlers ignore `#` hash fragments.
- Add canonical main routes: `/`, `/blog`, `/projects`.
- Dynamically fetch all blog posts via API and map to `/blog/[slug]` with post `createdAt` timestamp as `lastModified`.
- Dynamically fetch all projects via API and map to `/projects/[id]`.

### 2.4 Dynamic Metadata & Structured Data for Blog Posts (`frontend/src/app/blog/[slug]/page.tsx`)
- Enhance `generateMetadata`:
  - Ensure OpenGraph and Twitter card image URLs use absolute production domain paths (handling fallback for relative `/uploads/...` paths).
  - Add canonical alternate URLs per post.
- Enhance JSON-LD `BlogPosting` Schema:
  - Add `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` (`Person`), `publisher` (`Person`), and `mainEntityOfPage`.

### 2.5 Dynamic Metadata & Structured Data for Projects (`frontend/src/app/projects/[id]/page.tsx`)
- Enhance `generateMetadata`:
  - Ensure OpenGraph and Twitter card image URLs use absolute production domain paths.
  - Add canonical alternate URLs per project detail.
- Add JSON-LD `SoftwareApplication` / `CreativeWork` Schema:
  - Add `@type: "SoftwareApplication"`, `name`, `description`, `image`, `url`, `author`, `applicationCategory`.

### 2.6 On-Page Semantics & Image Optimization
- Verify single `<h1>` tag per page for clean heading hierarchy (`h1` -> `h2` -> `h3`).
- Ensure all images have descriptive `alt` tags and `title` attributes where applicable.

---

## 3. Verification Criteria
- Build check (`npm run build` inside `frontend`) must complete with 0 errors.
- Sitemap (`sitemap.xml`) generation must be valid XML with no fragment `#` URLs.
- JSON-LD structured data scripts must parse as valid JSON without syntax errors.
