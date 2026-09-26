# Design Spec: Asymmetric Magazine Spread for Blog & Articles (Option B)

- **Date:** 2026-09-26
- **Status:** Approved by User (Option B chosen)
- **Scope:** Redesign `frontend/src/components/organisms/BlogSection.tsx` into an Asymmetric Magazine Spread (1 Lead Story + 2 Stacked Cards) based on the visual mockup.

---

## 1. Problem & Motivation
- Standard 3-column cards feel repetitive alongside the project showcases.
- Option B introduces an asymmetric editorial hierarchy (*The Verge / Medium Featured style*):
  - 1 Lead Flagship Article with cinematic visual impact.
  - 2 Compact Stacked Stories for rapid scanning.

---

## 2. Visual Architecture & Component Breakdown

### 2.1 Section Header
- Left: `SectionHeader` with eyebrow `— Insights & Writing`, title `Latest Articles` (Articles in sunset coral `#FF462E`), description.
- Right: `Button` linking to `/blog` with `variant="outline"` and `ArrowUpRight` icon.

### 2.2 Asymmetric 12-Column Grid
- `grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch`

### 2.3 Lead Article (Left Column: 7 Cols)
- **Container**: `lg:col-span-7 group relative bg-[#0F0F11] text-white rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[440px] sm:min-h-[500px] flex flex-col justify-end`.
- **Cinematic Cover**:
  - Full-bleed background image with subtle brightness/contrast treatment.
  - Smooth multi-stop dark gradient overlay (`from-[#0F0F11] via-[#0F0F11]/60 to-transparent`).
- **Overlaid Content**:
  - Top: Tag pill badge in sunset coral `#FF462E` (`blog.tags[0]` or "Featured").
  - Title: Large bold headline (`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover:text-[#FF462E] transition-colors`).
  - Excerpt: Concise 2-line snippet in `text-neutral-300`.
  - Bottom Meta: Date, read time, and frosted circular arrow action button.

### 2.4 Secondary Stacked Articles (Right Column: 5 Cols)
- **Container**: `lg:col-span-5 flex flex-col gap-4 sm:gap-6 justify-between`.
- **Secondary Cards** (`blogs.slice(1, 3)`):
  - Card: `bg-white/90 backdrop-blur-sm border border-[#ECE8DF] hover:border-[#FF462E]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 flex-1`.
  - Thumbnail: Modern rounded image frame (`w-full sm:w-36 h-36 sm:h-28 rounded-xl sm:rounded-2xl shrink-0 overflow-hidden`).
  - Meta: Tag badge, date, bold title with hover coral transition, and read time.

---

## 3. Responsive Adaptations
- **Mobile (< 1024px)**: Single column stack, Lead story displays first as an engaging poster, followed by clean compact cards.
- **Desktop (1024px+)**: 7:5 asymmetric split with matched height and strong visual anchor.
