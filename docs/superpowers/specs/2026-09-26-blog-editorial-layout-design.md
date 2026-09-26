# Design Spec: Minimalist Editorial Magazine List for Blog & Articles (Option A)

- **Date:** 2026-09-26
- **Status:** Approved
- **Scope:** Redesign `frontend/src/components/organisms/BlogSection.tsx` from standard 3-column cards into a sleek, minimalist editorial magazine list matching Option A visual mockup.

---

## 1. Problem & Motivation
- The homepage currently showcases projects using browser mockup cards and magazine spreads.
- Displaying blog posts as 3 standard cards creates visual monotony and redundancy (*"card fatigue"*).
- An editorial list format provides a refreshing change in design rhythm, focusing on typography, intellectual clarity, and elegance.

---

## 2. Visual Architecture & Component Breakdown

### 2.1 Section Header
- Preserves the unified layout:
  - Left: `SectionHeader` with eyebrow `— Insights & Writing`, title `Latest Articles` (Articles in sunset coral `#FF462E`), description.
  - Right: `Button` linking to `/blog` with `variant="outline"` and `ArrowUpRight` icon.

### 2.2 Editorial Rows Container
- Replaces `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with a vertical stack: `flex flex-col divide-y divide-[#ECE8DF] border-y border-[#ECE8DF]`.

### 2.3 Individual Article Row (`<motion.article>`)
Each item features:
1. **Left Col (Index & Meta on desktop / compact on mobile)**:
   - Monospace index: `01`, `02`, `03` (`font-mono text-xs sm:text-sm font-semibold text-[#888899]`).
   - Publication date & read time badge: `Calendar` icon + formatted date, `Clock` icon + `5 min read`.
2. **Center Col (Story Headline & Excerpt)**:
   - Headline: `text-lg sm:text-xl md:text-2xl font-bold text-[#121214] group-hover:text-[#FF462E] transition-colors line-clamp-2`.
   - Excerpt: `text-xs sm:text-sm text-[#666672] line-clamp-2 mt-1.5 leading-relaxed`.
   - Tags: Minimal tag badges (`Badge variant="subtle"`).
3. **Right Col (Compact Thumbnail & Circular Action Arrow)**:
   - Compact Thumbnail: `w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-[#ECE8DF] bg-[#0F0F11]`.
     - Supports `blog.coverImageUrl` with hover zoom effect (`group-hover:scale-105 transition-transform duration-500`).
     - Elegant fallback graphic with `BookOpen` icon if cover image is empty.
   - Circular Arrow Action Button: `w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5F2EB] group-hover:bg-[#FF462E] text-[#121214] group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:translate-x-0.5`.
4. **Interactive Hover State**:
   - The entire row is wrapped in a clickable group link with smooth background highlight (`hover:bg-white/80 transition-colors duration-200 py-6 sm:py-8 px-3 sm:px-6 -mx-3 sm:-mx-6 rounded-2xl`).

---

## 3. Responsive Adaptations
- **Mobile (360px–640px)**:
  - Flex layout stacks smoothly: row displays index and date at top, followed by title and excerpt, with compact thumbnail and arrow row below or beside title. No horizontal overflow.
- **Tablet (768px–1024px) & Desktop (1024px+)**:
  - Horizontal expansive layout with index, content, thumbnail, and arrow button neatly aligned.

---

## 4. Verification & Testing
- `npx tsc --noEmit` in `frontend/` (0 errors).
- Verify responsive rendering on `http://localhost:3000/`.
- Ensure all article links route correctly to `/blog/[slug]`.
