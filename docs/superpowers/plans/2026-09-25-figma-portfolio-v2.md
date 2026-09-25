# Figma Portfolio V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the personal portfolio frontend to match the Figma UI/UX reference design (Oliver/Jenny Scott style) for **Eriko Syah Putra** (Full-Stack Engineer & Web Developer) using Tailwind CSS, Iconsax, Framer Motion, and Atomic Design, while maintaining dynamic integration with the NestJS backend and Admin dashboard.

**Architecture:** We use Next.js 15 App Router with Atomic Design (`atoms`, `molecules`, `organisms`, `templates`). Styling is powered by Tailwind CSS with custom canvas tokens (`#FDFBF7`, `#FF462E`, `#0F0F11`, 1px blueprint grid). Data layer leverages server-side fetching from the NestJS API with a comprehensive dummy data fallback (`portfolioData.ts`) so offline/local preview works out of the box.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Iconsax (iconsax-react / SVG icons), Lucide React.

## Global Constraints
- Target Name: **Eriko Syah Putra**
- Role: **Full-Stack Engineer & Web Developer**
- Primary Accent: **Vibrant Coral / Sunset Red (`#FF462E`)**
- Canvas Background: **Warm Cream (`#FDFBF7`) with subtle 1px blueprint grid lines**
- Existing routes (`/admin`, `/blog`, `/projects/[id]`) and backend API endpoints must remain intact and functional.

---

### Task 1: Setup Tailwind CSS & Iconsax Dependencies

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/postcss.config.mjs`
- Create: `frontend/tailwind.config.ts`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**
- Produces: Tailwind utility classes and theme tokens (`bg-canvas-cream`, `text-coral-500`, `bg-charcoal-900`, `grid-canvas`).

- [ ] **Step 1: Install Tailwind CSS, PostCSS, Autoprefixer, and iconsax-react**
Run command in `frontend/`:
```bash
npm install -D tailwindcss@^3.4.17 postcss autoprefixer
npm install iconsax-react
```

- [ ] **Step 2: Create `frontend/postcss.config.mjs` and `frontend/tailwind.config.ts`**
Configure PostCSS and Tailwind content paths (`./src/**/*.{js,ts,jsx,tsx}`) and extend theme colors (`canvas-cream: #FDFBF7`, `coral-500: #FF462E`, `charcoal-900: #0F0F11`, etc.).

- [ ] **Step 3: Update `frontend/src/app/globals.css`**
Prepend `@tailwind base; @tailwind components; @tailwind utilities;` and define custom utility classes for the 1px blueprint grid background.

- [ ] **Step 4: Verify Tailwind build**
Run: `npm run build` in `frontend/`
Expected: Build succeeds without PostCSS or configuration errors.

- [ ] **Step 5: Commit**
```bash
git add frontend/package.json frontend/package-lock.json frontend/postcss.config.mjs frontend/tailwind.config.ts frontend/src/app/globals.css
git commit -m "chore(frontend): setup tailwind css and iconsax dependencies"
```

---

### Task 2: Portfolio Data Layer & Fallback Model

**Files:**
- Create: `frontend/src/data/portfolioData.ts`
- Create: `frontend/src/types/portfolio.ts`

**Interfaces:**
- Produces: Type definitions (`PortfolioProfile`, `PortfolioService`, `PortfolioReview`) and typed fallback data `defaultPortfolioData` containing Eriko Syah Putra's profile, services, ratings, skills, and projects.

- [ ] **Step 1: Define TypeScript interfaces in `frontend/src/types/portfolio.ts`**
Define types for:
- `PortfolioProfile`: name, title, bio, aboutMe, avatarUrl, location, email, socialLinks, stats
- `PortfolioService`: id, number, title, description, tags, previewImage
- `PortfolioReview`: clientName, role, rating, quote, avatar
- `PortfolioSkill`: label, category, isHighlighted

- [ ] **Step 2: Create `frontend/src/data/portfolioData.ts`**
Populate rich dummy data matching the Figma layout:
- Name: "Eriko Syah Putra"
- Title: "Full-Stack Engineer & Web Developer"
- Services: "01. Full-Stack Web App Development", "02. UI/UX Design & Systems", "03. API & Cloud Architecture", "04. Dashboard & Analytics Engineering", "05. DevOps & CI/CD Pipelines"
- Reviews: 150+ Reviews (4.9 of 5)
- Testimonial Quote: "Eriko's exceptional full-stack craftsmanship and attention to detail transformed our web platform."

- [ ] **Step 3: Verify TypeScript compilation**
Run: `npx tsc --noEmit` in `frontend/`
Expected: 0 errors.

- [ ] **Step 4: Commit**
```bash
git add frontend/src/types/portfolio.ts frontend/src/data/portfolioData.ts
git commit -m "feat(frontend): add portfolio types and rich dummy fallback data"
```

---

### Task 3: Atomic Design — Atoms

**Files:**
- Create: `frontend/src/components/atoms/Button.tsx`
- Create: `frontend/src/components/atoms/Badge.tsx`
- Create: `frontend/src/components/atoms/SpinningBadge.tsx`
- Create: `frontend/src/components/atoms/SectionHeader.tsx`
- Create: `frontend/src/components/atoms/IconWrapper.tsx`

**Interfaces:**
- Produces:
  - `Button`: reusable pill button with variants (`primary` coral, `dark`, `outline`, `white`) and optional arrow icon.
  - `Badge`: pill skill badges with subtle border and floating animation variants.
  - `SpinningBadge`: rotating SVG circular stamp (`HIRE ME ✦ HIRE ME ✦`) with center arrow.
  - `SectionHeader`: pre-title badge (`— My Specialization`) + bold title with colored text emphasis.
  - `IconWrapper`: normalized container for Iconsax or Lucide icons.

- [ ] **Step 1: Implement `Button.tsx` and `Badge.tsx`**
Pill-shaped CTA buttons with hover animations and responsive styling.

- [ ] **Step 2: Implement `SpinningBadge.tsx`**
SVG circular text rotating continuously with Framer Motion (`animate={{ rotate: 360 }}`) and center pointer arrow.

- [ ] **Step 3: Implement `SectionHeader.tsx` and `IconWrapper.tsx`**
Section heading component with eyebrow text and gradient/coral highlighted words.

- [ ] **Step 4: Verify build with atoms**
Run: `npm run build` in `frontend/`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add frontend/src/components/atoms/
git commit -m "feat(frontend): create atomic design atoms (Button, Badge, SpinningBadge, SectionHeader)"
```

---

### Task 4: Atomic Design — Molecules

**Files:**
- Create: `frontend/src/components/molecules/RatingBadge.tsx`
- Create: `frontend/src/components/molecules/QuoteCard.tsx`
- Create: `frontend/src/components/molecules/SocialMediaGroup.tsx`
- Create: `frontend/src/components/molecules/ServiceAccordionItem.tsx`
- Create: `frontend/src/components/molecules/NavLinks.tsx`

**Interfaces:**
- Consumes: Atoms (`Button`, `Badge`, `IconWrapper`).
- Produces:
  - `RatingBadge`: client avatar stack + star ratings + review count.
  - `QuoteCard`: floating testimonial with quotation mark and client testimonial text.
  - `SocialMediaGroup`: circular icon buttons linking to GitHub, LinkedIn, Email, etc.
  - `ServiceAccordionItem`: interactive expandable card with number badge, tags, description, and preview image.
  - `NavLinks`: navigation links with smooth scrolling anchors.

- [ ] **Step 1: Implement `RatingBadge.tsx` & `QuoteCard.tsx`**
Floating social proof elements as seen in Oliver Scott hero reference.

- [ ] **Step 2: Implement `SocialMediaGroup.tsx` & `NavLinks.tsx`**
Clean social links and navigation list with interactive hover states.

- [ ] **Step 3: Implement `ServiceAccordionItem.tsx`**
Accordion row with active dark background state, chamfered corner styling, tag badges, and smooth expand/collapse transition using Framer Motion.

- [ ] **Step 4: Verify build with molecules**
Run: `npm run build` in `frontend/`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add frontend/src/components/molecules/
git commit -m "feat(frontend): create atomic design molecules (RatingBadge, QuoteCard, ServiceAccordionItem)"
```

---

### Task 5: Atomic Design — Organisms

**Files:**
- Create: `frontend/src/components/organisms/Navbar.tsx`
- Create: `frontend/src/components/organisms/HeroSection.tsx`
- Create: `frontend/src/components/organisms/MarqueeTicker.tsx`
- Create: `frontend/src/components/organisms/ServicesSection.tsx`
- Create: `frontend/src/components/organisms/AboutSection.tsx`
- Create: `frontend/src/components/organisms/ProjectsSection.tsx`
- Create: `frontend/src/components/organisms/ContactSection.tsx`

**Interfaces:**
- Consumes: Atoms and Molecules.
- Produces: Complete section organisms matching the Figma reference layout.

- [ ] **Step 1: Implement `Navbar.tsx`**
Sticky/floating header with "Eriko." logo, NavLinks, and "Contact Me" CTA button.

- [ ] **Step 2: Implement `HeroSection.tsx`**
Full hero section:
- Eyebrow badge: "— Hello There!"
- Headline: "I'm **Eriko Syah Putra**" with coral highlight and "Full-Stack Engineer based in Indonesia"
- Center portrait with coral geometric arch backdrop
- Left floating `RatingBadge`
- Right floating `QuoteCard` and skill tags (`Prototype`, `Dashboard`, `Web App`, `API Architecture`)
- Spinning "Hire Me" circular stamp
- Dual CTAs: "Portfolio ->" and "Hire Me"

- [ ] **Step 3: Implement `MarqueeTicker.tsx`**
High-contrast black full-width banner running continuously with keywords (`Website Design ✦ Full-Stack Development ✦ Dashboard ✦ API Architecture ✦ Cloud CI/CD`).

- [ ] **Step 4: Implement `ServicesSection.tsx`**
Interactive services accordion with single-expanded active state, tag pills, and project preview.

- [ ] **Step 5: Implement `AboutSection.tsx`, `ProjectsSection.tsx`, & `ContactSection.tsx`**
- About section: Dark contrast card with portrait cutout, signature, and CV download button.
- Projects section: Filterable card showcase of projects.
- Contact section: Clean form and footer matching editorial aesthetic.

- [ ] **Step 6: Verify build with organisms**
Run: `npm run build` in `frontend/`
Expected: PASS.

- [ ] **Step 7: Commit**
```bash
git add frontend/src/components/organisms/
git commit -m "feat(frontend): create atomic design organisms (Hero, Marquee, Services, About, Projects)"
```

---

### Task 6: Atomic Design — Template & Integration with App Page & Admin Data

**Files:**
- Create: `frontend/src/components/templates/PortfolioTemplate.tsx`
- Modify: `frontend/src/app/page.tsx`

**Interfaces:**
- Consumes: All organisms and data from API or dummy fallback.
- Produces: The primary page rendered on `/` seamlessly displaying live backend data (or fallback dummy data) in the new Figma aesthetic.

- [ ] **Step 1: Implement `PortfolioTemplate.tsx`**
Wraps all organisms inside the blueprint grid background canvas with smooth page layout.

- [ ] **Step 2: Update `frontend/src/app/page.tsx`**
Fetch data from `api.getProfile()`, `api.getProjects()`, etc. If API call returns null/fails, automatically merge with `defaultPortfolioData`. Pass merged data to `PortfolioTemplate`.

- [ ] **Step 3: Verify Admin Synchronization**
Confirm that when profile fields or projects are updated in `/admin`, the homepage re-renders the new data accurately.

- [ ] **Step 4: Verify Next.js Build**
Run: `npm run build` in `frontend/`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**
```bash
git add frontend/src/components/templates/PortfolioTemplate.tsx frontend/src/app/page.tsx
git commit -m "feat(frontend): integrate portfolio template with live api and fallback data"
```

---

### Task 7: Visual Polish & Responsive Verification

**Files:**
- Modify: Various component files as needed for micro-adjustments.

- [ ] **Step 1: Check mobile, tablet, and desktop responsiveness**
Ensure floating cards, hero elements, and marquee scale cleanly on smaller viewports.

- [ ] **Step 2: Fine-tune micro-interactions**
Check button hover states, spinning badge smooth rotation, and accordion transitions.

- [ ] **Step 3: Final production build & commit**
Run: `npm run build` in `frontend/`
```bash
git add -A
git commit -m "style(frontend): polish responsive layout and animations"
```
