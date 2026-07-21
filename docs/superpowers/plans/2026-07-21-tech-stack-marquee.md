# Tech Stack Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a modern, responsive, pure CSS infinite scrolling Tech Stack section to the portfolio website placed right below the `#about` section.

**Architecture:** Create a client/server compatible Next.js component (`TechStackMarquee.tsx`) rendering a track of technology cards duplicated for seamless CSS loop. Implement keyframe scrolling (`@keyframes marquee-left`), gradient mask overlays for side fading, and hover-pause behavior in `globals.css`.

**Tech Stack:** Next.js (App Router, TypeScript), React, `react-icons/si` (Simple Icons), CSS Modules/Vanilla CSS with HSL variables.

## Global Constraints
- Framework: Next.js 15 with React 19 in `frontend/`.
- Styling: Vanilla CSS with custom properties in `frontend/src/app/globals.css`.
- Accessibility: Respect `prefers-reduced-motion` media query.

---

### Task 1: Update Translations Data
**Files:**
- Modify: `frontend/src/lib/translations.ts:1-67`

**Interfaces:**
- Consumes: `translations` object in `frontend/src/lib/translations.ts`.
- Produces: `techStack` and `techStackSubtitle` keys in `id` and `en` dictionary objects.

- [ ] **Step 1: Add translation keys for tech stack section**

Edit `frontend/src/lib/translations.ts` to include:
`id`:
```ts
techStackLabel: "Tech Stack",
techStackTitle: "Teknologi & Tools Utama",
techStackSubtitle: "Teknologi modern yang biasa saya gunakan untuk membangun produk digital berkinerja tinggi.",
```
`en`:
```ts
techStackLabel: "Tech Stack",
techStackTitle: "Core Technologies & Tools",
techStackSubtitle: "Modern technologies I routinely use to build high-performance digital products.",
```

- [ ] **Step 2: Commit translations update**

```bash
git add frontend/src/lib/translations.ts
git commit -m "feat(translations): add translation keys for tech stack section"
```

---

### Task 2: Create TechStackMarquee Component
**Files:**
- Create: `frontend/src/components/TechStackMarquee.tsx`

**Interfaces:**
- Consumes: `translations` from `@/lib/translations`, icons from `react-icons/si`.
- Produces: `<TechStackMarquee lang={lang} />` React Component.

- [ ] **Step 1: Create `TechStackMarquee.tsx`**

Create `frontend/src/components/TechStackMarquee.tsx`:
```tsx
import React from "react";
import { translations } from "@/lib/translations";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiTailwindcss,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiFigma,
  SiHtml5,
  SiCss3,
  SiGraphql,
  SiRedis,
} from "react-icons/si";

interface TechItem {
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: SiCss3, color: "#1572B6" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  { name: "Redis", icon: SiRedis, color: "#DC382D" },
];

export default function TechStackMarquee({ lang }: { lang: string }) {
  const t = translations[lang] || translations.id;
  // Duplicate array 2x to ensure a seamless infinite CSS loop
  const displayItems = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <section className="section tech-stack-section" id="tech-stack">
      <div className="container">
        <div className="section-header text-center" style={{ marginBottom: "2.5rem" }}>
          <p className="section-label">{t.techStackLabel || "Tech Stack"}</p>
          <h2 className="section-title">{t.techStackTitle || "Teknologi & Tools"}</h2>
          <p className="section-desc">
            {t.techStackSubtitle || "Teknologi yang saya gunakan dalam pengembangan perangkat lunak."}
          </p>
        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {displayItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div className="tech-card" key={`${item.name}-${idx}`}>
                <div className="tech-icon-wrapper" style={{ color: item.color }}>
                  <Icon size={24} />
                </div>
                <span className="tech-name">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit `TechStackMarquee.tsx`**

```bash
git add frontend/src/components/TechStackMarquee.tsx
git commit -m "feat(components): create TechStackMarquee component with preset items"
```

---

### Task 3: Add CSS Styles & Animations to `globals.css`
**Files:**
- Modify: `frontend/src/app/globals.css`

**Interfaces:**
- Styles for `.tech-stack-section`, `.marquee-wrapper`, `.marquee-track`, `.tech-card`, `@keyframes marquee-left`.

- [ ] **Step 1: Add CSS rules in `frontend/src/app/globals.css`**

Append to `frontend/src/app/globals.css`:
```css
/* Tech Stack Marquee Section */
.tech-stack-section {
  position: relative;
  overflow: hidden;
  padding: 4rem 0;
}

.marquee-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 12%,
    rgba(0, 0, 0, 1) 88%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 12%,
    rgba(0, 0, 0, 1) 88%,
    rgba(0, 0, 0, 0) 100%
  );
  padding: 1rem 0;
}

.marquee-track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  animation: marquee-left 35s linear infinite;
  will-change: transform;
}

.marquee-wrapper:hover .marquee-track {
  animation-play-state: paused;
}

.tech-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.4rem;
  background: var(--bg-secondary, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 14px;
  backdrop-filter: blur(8px);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
  white-space: nowrap;
}

.tech-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-primary, #6366f1);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
}

.tech-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.tech-name {
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--text-primary, #f3f4f6);
}

@keyframes marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
  }
  .marquee-wrapper {
    mask-image: none;
    -webkit-mask-image: none;
  }
}
```

- [ ] **Step 2: Commit CSS styling**

```bash
git add frontend/src/app/globals.css
git commit -m "style: add styles and keyframes for tech stack marquee"
```

---

### Task 4: Integrate Component into Homepage
**Files:**
- Modify: `frontend/src/app/page.tsx:198-202`

**Interfaces:**
- Import `<TechStackMarquee />` and render below `<section className="section" id="about">`.

- [ ] **Step 1: Import and render `TechStackMarquee` in `frontend/src/app/page.tsx`**

1. Add import statement at top of `frontend/src/app/page.tsx`:
```tsx
import TechStackMarquee from "@/components/TechStackMarquee";
```
2. Insert `<TechStackMarquee lang={lang} />` immediately after the `#about` section ends (after line 198).

- [ ] **Step 2: Verify Next.js build / dev server**

Run in terminal:
```bash
cd frontend && npm run build
```
Expected output: Build completed successfully without TypeScript errors.

- [ ] **Step 3: Commit page integration**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat(page): integrate TechStackMarquee component under about section"
```
