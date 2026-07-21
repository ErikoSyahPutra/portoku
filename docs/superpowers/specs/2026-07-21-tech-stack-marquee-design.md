# Design Spec: Infinite Scrolling Tech Stack Marquee

## Overview
Add a sleek, responsive, pure CSS infinite scrolling Tech Stack section to the portfolio website right below the About section. The section features modern web technologies displayed in glassmorphic cards that move smoothly across the screen horizontally with left/right fade masks and hover-pause behavior.

## User Requirements & Choices
- **Layout**: 1-line horizontal infinite marquee track.
- **Content**: Preset list of modern technologies (React, Next.js, TypeScript, JavaScript, Node.js, Tailwind CSS, Python, PostgreSQL, MongoDB, Docker, Git, Figma, HTML5, CSS3, GraphQL, Redis).
- **Position**: Placed under the `#about` section in `frontend/src/app/page.tsx`.
- **Interactivity**: Pauses scrolling on mouse hover.
- **Performance**: Pure CSS `@keyframes` with GPU acceleration (`will-change: transform`).

## Architecture & Component Specs

### 1. New Component: `TechStackMarquee.tsx`
- **Location**: `frontend/src/components/TechStackMarquee.tsx`
- **Props**: `lang` (for internationalization/translations).
- **Tech Stack Items**: Array of items containing name, icon (from `react-icons/si` or `react-icons/tb` / `react-icons/fa6` / `react-icons/bi`), and color accent.
- **Structure**:
  - Section wrapper `<section className="section tech-stack-section" id="tech-stack">`
  - Container with section header (title, label).
  - Outer marquee container with CSS gradient mask overlay (`mask-image`).
  - Marquee track containing two identical sets of tech cards (`[...techs, ...techs]`) to guarantee seamless CSS looping without gaps.

### 2. Styling System: `globals.css`
- **Classes**:
  - `.tech-stack-section`: Padding and layout container.
  - `.marquee-container`: Overflow hidden, mask-image for subtle edge fading.
  - `.marquee-track`: Flexbox container, `animation: marquee-left 35s linear infinite;`.
  - `.marquee-track:hover`: `animation-play-state: paused;`.
  - `.tech-card`: Glassmorphism background (`var(--bg-secondary)`), border (`var(--border-color)`), hover glow, flex alignment for icon + label.
  - `@keyframes marquee-left`: `0% { transform: translateX(0); }` to `100% { transform: translateX(-50%); }`.

### 3. Page Integration: `page.tsx`
- Import `TechStackMarquee` into `frontend/src/app/page.tsx`.
- Add `<TechStackMarquee lang={lang} />` immediately after `<section className="section" id="about">...</section>`.
- Add translations for Tech Stack section title/label in `frontend/src/lib/translations.ts`.

## Edge Cases & Error Handling
- **Reduced Motion**: Respect `prefers-reduced-motion` media query by disabling continuous animation for users with motion sensitivity.
- **Screen Responsiveness**: Mobile screens scale card padding and font size smoothly without breaking horizontal overflow.

## Review Checklist
- [x] Preset items list defined.
- [x] Smooth 60fps pure CSS animation specified.
- [x] Edge fading mask defined.
- [x] Hover pause included.
- [x] Responsive layout & reduced motion considered.
