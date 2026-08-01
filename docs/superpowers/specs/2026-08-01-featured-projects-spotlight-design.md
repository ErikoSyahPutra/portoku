# Featured Projects Spotlight Layout Design (Asymmetric Split Grid)

**Date**: 2026-08-01  
**Topic**: Featured Projects Section Redesign  
**Status**: Approved  

---

## 1. Goal & Context
Currently, the Featured Projects section on the portfolio homepage renders all projects in a uniform grid (`projects-grid`). When there are more than 3 projects, displaying them in a vertical stacked grid can make the homepage feel overly long and cluttered.

This spec defines **Gaya A: Asymmetric Split Grid (Spotlight Layout)**, which creates a strong visual hierarchy:
- **1 Hero Featured Project** (60% width on desktop) with large preview image, flagship badge, key tags, and primary CTAs.
- **Up to 3 Compact Mini Projects** (40% width on desktop) stacked vertically alongside the hero card.
- **"View All Projects" CTA Button** at the bottom of the list, directing users to the full portfolio page (`/projects`).

---

## 2. Architecture & Components

### 2.1 Component Structure (`frontend/src/app/page.tsx`)
In the `<section id="projects">` container:

1. **Header**: Section label, title, subtitle (retained).
2. **Spotlight Grid Container** (`.projects-spotlight-grid`):
   - **Hero Spotlight Card** (`.project-card-spotlight`):
     - Renders `projects[0]` (the top featured project).
     - Contains:
       - Badge: `⭐ Proyek Utama` / `⭐ Featured Project` (`.flagship-badge`)
       - Image container with hover zoom effect (`height: 240px`).
       - Title (`<h3>`), Description (`<p>`), Tech tags (`.project-techs`).
       - Action links: Live Demo, Source Code, and "Detail Proyek →" link.
   - **Mini Projects List** (`.projects-mini-list`):
     - Renders `projects.slice(1, 4)` (up to 3 secondary featured projects).
     - Each item (`.project-mini-card`):
       - Mini thumbnail icon / fallback image (`56px x 56px`).
       - Mini info: Title (`<h4>`), short description (`<p>` line-clamp 2), top 2-3 tech tags.
       - Arrow icon linking to project detail page.
     - **Footer CTA Card** (`.projects-view-all`):
       - Shown if total `projects.length > 1`.
       - Text: `"Lihat Semua Proyek ({total}) →"` / `"View All Projects ({total}) →"`.
       - Navigates to `/projects?lang={lang}`.

---

## 3. Styling & CSS System (`frontend/src/app/globals.css`)

### 3.1 CSS Grid Layout
```css
.projects-spotlight-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 992px) {
  .projects-spotlight-grid {
    grid-template-columns: 1fr;
  }
}
```

### 3.2 Hero Spotlight Card (`.project-card-spotlight`)
- Dark glassmorphic background with border glow (`var(--bg-card)`, `var(--border-color)`).
- Top gradient highlight line (`::before`).
- Accent badge `.flagship-badge` (pill shape with glowing accent color).
- Image wrapper height: `240px` with `object-fit: cover`.

### 3.3 Mini Project Card (`.project-mini-card`)
- Flex layout: `display: flex; gap: 16px; align-items: center; padding: 16px 20px;`.
- Border-radius: `var(--radius-lg)`.
- Subtle hover animation: slight translateX shift (`transform: translateX(4px)`).
- Line clamping on description to max 2 lines.

---

## 4. Internationalization & Translations (`frontend/src/lib/translations.ts`)

Add the following keys to `translations`:
- `id`:
  - `flagshipBadge`: "⭐ Proyek Utama"
  - `viewAllProjects`: "Lihat Semua Proyek ({count}) →"
  - `viewDetail`: "Detail Proyek"
- `en`:
  - `flagshipBadge`: "⭐ Featured Project"
  - `viewAllProjects`: "View All Projects ({count}) →"
  - `viewDetail`: "View Detail"

---

## 5. Edge Cases & Fallbacks
1. **`projects.length === 0`**: Section is hidden (existing behavior `profile.showProjects !== false`).
2. **`projects.length === 1`**: Spotlight Grid renders full width (Hero card only, mini list empty).
3. **`projects.length <= 4`**: Renders 1 Hero card + remaining items in mini list, "View All" CTA still links to `/projects`.
4. **`projects.length > 4`**: Renders 1 Hero card + top 3 mini cards + "View All Projects (X)" button linking to `/projects`.

---

## 6. Verification & Test Criteria
- Verify grid structure at Desktop (> 992px) and Mobile (<= 992px).
- Verify language switching (ID/EN) updates badges and CTA text.
- Run `npm run build` inside `frontend` to verify TypeScript compile & Next.js build.
