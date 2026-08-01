# Featured Projects Spotlight Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Gaya A: Asymmetric Split Grid (Spotlight Layout) for Featured Projects on the portfolio homepage, separating projects into 1 Hero Spotlight Card + up to 3 Mini Cards + a "View All Projects" CTA.

**Architecture:** Update `frontend/src/lib/translations.ts` for new UI copy, add CSS Grid and card styles in `frontend/src/app/globals.css`, and update `frontend/src/app/page.tsx` to render the asymmetric spotlight grid structure.

**Tech Stack:** Next.js (React / TypeScript), Vanilla CSS, React Icons.

## Global Constraints

- Preserve all existing project data fields and API calls.
- Responsive breakpoints: 2-column grid (`1.35fr 1fr`) on desktop (`> 992px`), 1-column stacked grid on mobile (`<= 992px`).
- No new third-party dependencies.

---

### Task 1: Add Translation Keys

**Files:**
- Modify: `frontend/src/lib/translations.ts:1-75`

**Interfaces:**
- Consumes: `translations` dictionary structure
- Produces: `t.flagshipBadge`, `t.viewAllProjects`, `t.viewDetail`

- [ ] **Step 1: Update `translations.ts` with new keys**

Add `flagshipBadge`, `viewAllProjects`, and `viewDetail` to both `id` and `en` dictionaries in `frontend/src/lib/translations.ts`:

```typescript
// In id dictionary:
flagshipBadge: "⭐ Proyek Utama",
viewAllProjects: "Lihat Semua Proyek ({count}) →",
viewDetail: "Detail Proyek",

// In en dictionary:
flagshipBadge: "⭐ Featured Project",
viewAllProjects: "View All Projects ({count}) →",
viewDetail: "View Detail",
```

- [ ] **Step 2: Verify TypeScript types**

Run build or check file syntax to ensure `translations.ts` exports correctly.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/translations.ts
git commit -m "feat: add spotlight translation keys for projects"
```

---

### Task 2: Add CSS Styles for Spotlight Layout

**Files:**
- Modify: `frontend/src/app/globals.css:307-397`

**Interfaces:**
- Consumes: CSS variables `--bg-card`, `--border-color`, `--accent-glow`, `--accent-secondary`, etc.
- Produces: Classes `.projects-spotlight-grid`, `.project-card-spotlight`, `.projects-mini-list`, `.project-mini-card`, `.flagship-badge`, `.mini-card-thumb`

- [ ] **Step 1: Add Spotlight Grid & Card styles to `globals.css`**

Add the following CSS rules right after line 397 in `frontend/src/app/globals.css`:

```css
/* ─── Spotlight Grid Layout (Gaya A) ─── */
.projects-spotlight-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 24px;
  align-items: stretch;
}

.project-card-spotlight {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 28px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.project-card-spotlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: var(--transition);
}

.project-card-spotlight:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.project-card-spotlight:hover::before {
  opacity: 1;
}

.flagship-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 100px;
  background: var(--accent-glow);
  color: var(--accent-secondary);
  border: 1px solid rgba(99, 102, 241, 0.25);
  margin-bottom: 16px;
  width: fit-content;
}

.projects-mini-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-mini-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: var(--transition);
  position: relative;
  text-decoration: none;
  color: inherit;
}

.project-mini-card:hover {
  border-color: var(--border-hover);
  background: var(--bg-card-hover);
  transform: translateX(4px);
}

.mini-card-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
}

.mini-card-thumb-fallback {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-glow);
  color: var(--accent-secondary);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.mini-card-content {
  flex: 1;
  min-width: 0;
}

.mini-card-content h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-card-content p {
  font-size: 0.825rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.projects-view-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: var(--accent-glow);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: var(--radius-lg);
  color: var(--accent-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: var(--transition);
  margin-top: auto;
}

.projects-view-all-btn:hover {
  background: var(--accent-secondary);
  color: #ffffff;
}

@media (max-width: 992px) {
  .projects-spotlight-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "style: add CSS styles for spotlight projects layout"
```

---

### Task 3: Update `page.tsx` Featured Projects Section

**Files:**
- Modify: `frontend/src/app/page.tsx:211-260`

**Interfaces:**
- Consumes: `projects: Project[]`, `t` translations
- Produces: Asymmetric Split Grid JSX rendering

- [ ] **Step 1: Replace `projects-grid` with `projects-spotlight-grid`**

In `frontend/src/app/page.tsx`, update the `{/* Projects */}` section:

```tsx
      {/* Projects */}
      {profile.showProjects !== false && projects.length > 0 && (
        <section className="section" id="projects">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{t.portfolio}</p>
              <h2 className="section-title">{t.featuredProjects}</h2>
              <p className="section-desc">{t.projectsSubtitle}</p>
            </div>

            {(() => {
              const heroProject = projects[0];
              const miniProjects = projects.slice(1, 4);
              const totalProjects = projects.length;

              const heroImg = img(heroProject.imageUrl);

              return (
                <div className="projects-spotlight-grid">
                  {/* Hero Spotlight Card */}
                  <div className="project-card-spotlight">
                    <span className="flagship-badge">{t.flagshipBadge}</span>
                    <Link href={`/projects/${heroProject.id}?lang=${lang}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {heroImg ? (
                        <div style={{ marginBottom: 18, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-color)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={heroImg} alt={heroProject.title} style={{ width: "100%", height: 230, objectFit: "cover", display: "block" }} />
                        </div>
                      ) : (
                        <div style={{ marginBottom: 18, borderRadius: 8, height: 230, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-glow)", border: "1px solid var(--border-color)", color: "var(--accent-secondary)" }}>
                          <HiOutlineComputerDesktop size={48} />
                        </div>
                      )}
                      <h3 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 10 }}>{heroProject.title}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", marginBottom: 16, lineHeight: 1.6 }}>{heroProject.description}</p>
                      <div className="project-techs" style={{ marginBottom: 20 }}>
                        {heroProject.technologies?.map((tech) => (
                          <span className="tech-tag" key={tech}>{tech}</span>
                        ))}
                      </div>
                    </Link>

                    <div className="project-links" style={{ marginTop: "auto", paddingTop: 12 }}>
                      {heroProject.liveUrl && (
                        <a href={formatUrl(heroProject.liveUrl)} target="_blank" rel="noreferrer">
                          <HiOutlineArrowTopRightOnSquare size={14} /> {t.liveDemo}
                        </a>
                      )}
                      {heroProject.githubUrl && (
                        <a href={formatUrl(heroProject.githubUrl)} target="_blank" rel="noreferrer">
                          <HiOutlineCodeBracket size={14} /> {t.sourceCode}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Mini Projects Side Column */}
                  <div className="projects-mini-list">
                    {miniProjects.map((p) => {
                      const pImg = img(p.imageUrl);
                      return (
                        <Link href={`/projects/${p.id}?lang=${lang}`} className="project-mini-card" key={p.id}>
                          {pImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pImg} alt={p.title} className="mini-card-thumb" />
                          ) : (
                            <div className="mini-card-thumb-fallback">
                              <HiOutlineComputerDesktop size={24} />
                            </div>
                          )}
                          <div className="mini-card-content">
                            <h4>{p.title}</h4>
                            <p>{p.description}</p>
                            <div className="project-techs" style={{ marginBottom: 0 }}>
                              {p.technologies?.slice(0, 3).map((tech) => (
                                <span className="tech-tag" key={tech} style={{ fontSize: "0.7rem", padding: "2px 8px" }}>{tech}</span>
                              ))}
                            </div>
                          </div>
                          <HiOutlineArrowTopRightOnSquare size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                        </Link>
                      );
                    })}

                    {totalProjects > 1 && (
                      <Link href={`/projects?lang=${lang}`} className="projects-view-all-btn">
                        {t.viewAllProjects.replace("{count}", String(totalProjects))}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: implement spotlight projects grid in homepage"
```

---

### Task 4: Verification & Build Check

**Files:**
- None (Build verification)

- [ ] **Step 1: Test Next.js build**

Run build inside frontend directory:
```bash
cd frontend && npm run build
```
Expected output: Build succeeds with 0 errors.

- [ ] **Step 2: Commit any final build artifacts/fixes if needed**
