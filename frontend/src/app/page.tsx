export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import Link from "next/link";
import { translations } from "@/lib/translations";
import TechStackMarquee from "@/components/TechStackMarquee";
import {
  HiOutlineMapPin,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCodeBracket,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineTrophy,
  HiOutlineCheckBadge,
  HiOutlineRocketLaunch,
  HiOutlineDocumentText,
  HiOutlineComputerDesktop,
  HiOutlineSparkles,
  HiOutlineUserGroup,
} from "react-icons/hi2";

const BACKEND = "http://localhost:3001";

function img(url?: string) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BACKEND}${url}`;
}

function formatUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang = "id" } = await searchParams;
  const t = translations[lang] || translations.id;

  let profile, projects, academics, experiences, blogs, awards, organizations;
  try {
    [profile, projects, academics, experiences, blogs, awards, organizations] = await Promise.all([
      api.getProfile(lang), api.getProjects(lang), api.getAcademics(lang),
      api.getExperiences(lang), api.getBlogs(lang), api.getAwards(lang),
      api.getOrganizations(lang),
    ]);
  } catch {
    return <FallbackPage />;
  }

  const avatarSrc = img(profile.avatarUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            url: "https://erikosyah.my.id",
            jobTitle: profile.title,
            description: profile.bio,
            image: img(profile.avatarUrl),
            sameAs: [
              profile.githubUrl,
              profile.linkedinUrl,
              profile.websiteUrl,
            ].filter(Boolean),
            worksFor: experiences.map((e) => ({
              "@type": "Organization",
              name: e.company,
              jobTitle: e.position,
            })),
          }),
        }}
      />
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot" /> {t.availableBadge}
            </div>
            <h1>
              Hi, I&apos;m <span className="gradient-text">{profile.name}</span>
              <br />{profile.title}
            </h1>
            <p className="hero-desc">{profile.bio}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary"><HiOutlineRocketLaunch size={18} /> {t.viewWork}</a>
              <a href="#about" className="btn btn-secondary">{t.aboutMe}</a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t.about}</p>
            <h2 className="section-title">{t.littleAboutMe}</h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              {avatarSrc && (
                <div style={{ marginBottom: 24 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarSrc} alt={profile.name} style={{ width: 240, height: 240, borderRadius: "16px", objectFit: "contain", border: "3px solid var(--accent-primary)", background: "var(--bg-secondary)" }} />
                </div>
              )}
              {profile.aboutMe?.split("\n").filter(Boolean).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="about-info">
              {profile.location && (
                <div className="about-info-item">
                  <div className="icon"><HiOutlineMapPin size={18} /></div>
                  <div><div className="label">{t.location}</div><div className="value">{profile.location}</div></div>
                </div>
              )}
              {profile.email && (
                <div className="about-info-item">
                  <div className="icon"><HiOutlineEnvelope size={18} /></div>
                  <div><div className="label">{t.email}</div><div className="value"><a href={`mailto:${profile.email}`}>{profile.email}</a></div></div>
                </div>
              )}
              {profile.githubUrl && (
                <div className="about-info-item">
                  <div className="icon"><HiOutlineCodeBracket size={18} /></div>
                  <div><div className="label">GitHub</div><div className="value"><a href={formatUrl(profile.githubUrl)} target="_blank" rel="noreferrer">{profile.githubUrl.replace("https://", "")}</a></div></div>
                </div>
              )}
              {profile.linkedinUrl && (
                <div className="about-info-item">
                  <div className="icon"><HiOutlineBriefcase size={18} /></div>
                  <div><div className="label">LinkedIn</div><div className="value"><a href={formatUrl(profile.linkedinUrl)} target="_blank" rel="noreferrer">{profile.linkedinUrl.replace("https://", "")}</a></div></div>
                </div>
              )}
              {profile.websiteUrl && (
                <div className="about-info-item">
                  <div className="icon"><HiOutlineGlobeAlt size={18} /></div>
                  <div><div className="label">Website</div><div className="value"><a href={formatUrl(profile.websiteUrl)} target="_blank" rel="noreferrer">{profile.websiteUrl.replace("https://", "")}</a></div></div>
                </div>
              )}
            </div>
          </div>
          {/* Stats */}
          {[profile.showProjects, profile.showExperiences, profile.showAwards, profile.showBlog, profile.showOrganizations].some((x) => x !== false) && (
            <div
              className="stats-grid"
              style={{
                gridTemplateColumns: `repeat(${[profile.showProjects, profile.showExperiences, profile.showAwards, profile.showBlog, profile.showOrganizations].filter((x) => x !== false).length}, 1fr)`,
              }}
            >
              {profile.showProjects !== false && (
                <div className="stat-card">
                  <div className="stat-number">{projects.length}+</div>
                  <div className="stat-label">{t.projects}</div>
                </div>
              )}
              {profile.showExperiences !== false && (
                <div className="stat-card">
                  <div className="stat-number">{experiences.length}+</div>
                  <div className="stat-label">{t.yearsExp}</div>
                </div>
              )}
              {profile.showAwards !== false && (
                <div className="stat-card">
                  <div className="stat-number">{awards.length}+</div>
                  <div className="stat-label">{t.awards}</div>
                </div>
              )}
              {profile.showBlog !== false && (
                <div className="stat-card">
                  <div className="stat-number">{blogs.length}+</div>
                  <div className="stat-label">{t.articles}</div>
                </div>
              )}
              {profile.showOrganizations !== false && (
                <div className="stat-card">
                  <div className="stat-number">{organizations.length}+</div>
                  <div className="stat-label">{t.organizations}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <TechStackMarquee lang={lang} />

      {/* Projects */}
      {profile.showProjects !== false && (
        <section className="section" id="projects">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{t.portfolio}</p>
              <h2 className="section-title">{t.featuredProjects}</h2>
              <p className="section-desc">{t.projectsSubtitle}</p>
            </div>
            <div className="projects-grid">
              {projects.map((p) => {
                const pImg = img(p.imageUrl);
                return (
                  <div className="project-card" key={p.id} style={{ display: "flex", flexDirection: "column" }}>
                    <Link href={`/projects/${p.id}?lang=${lang}`} className="project-card-link" style={{ flex: 1, display: "block", color: "inherit", textDecoration: "none" }}>
                      {pImg ? (
                        <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-color)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={pImg} alt={p.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                        </div>
                      ) : (
                        <div style={{ marginBottom: 16, borderRadius: 8, height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-glow)", border: "1px solid var(--border-color)", color: "var(--accent-secondary)" }}>
                          <HiOutlineComputerDesktop size={40} />
                        </div>
                      )}
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <div className="project-techs" style={{ marginBottom: 16 }}>
                        {p.technologies?.map((t) => <span className="tech-tag" key={t}>{t}</span>)}
                      </div>
                    </Link>
                    <div className="project-links" style={{ marginTop: "auto" }}>
                      {p.liveUrl && (
                        <a href={formatUrl(p.liveUrl)} target="_blank" rel="noreferrer">
                          <HiOutlineArrowTopRightOnSquare size={14} /> {t.liveDemo}
                        </a>
                      )}
                      {p.githubUrl && (
                        <a href={formatUrl(p.githubUrl)} target="_blank" rel="noreferrer">
                          <HiOutlineCodeBracket size={14} /> {t.sourceCode}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {profile.showExperiences !== false && (
        <section className="section" id="experience">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{t.career}</p>
              <h2 className="section-title">{t.workExperience}</h2>
              <p className="section-desc">{t.experienceSubtitle}</p>
            </div>
            <div className="timeline">
              {experiences.map((e) => {
                const eLogo = img(e.logoUrl);
                return (
                  <div className={`timeline-item ${e.current ? "current" : ""}`} key={e.id}>
                    <div className="timeline-dot" />
                    <div className="timeline-date"><HiOutlineCalendar size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />{e.startDate} — {e.current ? t.present : e.endDate}</div>
                    <div className="timeline-card">
                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                        {eLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={eLogo} alt={e.company} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border-color)" }} />
                        ) : (
                          <div className="timeline-icon-fallback" style={{ width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-glow)", color: "var(--accent-secondary)", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                            <HiOutlineBriefcase size={20} />
                          </div>
                        )}
                        <div>
                          <h3>{e.position}</h3>
                          <div className="subtitle">{e.company}{e.location ? ` · ${e.location}` : ""}</div>
                        </div>
                      </div>
                      {e.description && <p>{e.description}</p>}
                      <div className="skills">
                        {e.skills?.map((s) => <span className="tech-tag" key={s}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {profile.showAcademics !== false && (
        <section className="section" id="education">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{t.education}</p>
              <h2 className="section-title">{t.academicBackground}</h2>
            </div>
            <div className="education-grid">
              {academics.map((a) => {
                const aLogo = img(a.logoUrl);
                return (
                  <div className="edu-card" key={a.id}>
                    <div className="edu-icon">
                      {aLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={aLogo} alt={a.institution} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                      ) : (
                        <HiOutlineAcademicCap size={24} />
                      )}
                    </div>
                    <div>
                      <h3>{a.institution}</h3>
                      <div className="edu-degree">{a.degree} {lang === 'en' ? 'in' : 'bidang'} {a.field}{a.gpa && <span className="edu-gpa">{lang === 'en' ? 'GPA' : 'IPK'}: {a.gpa}</span>}</div>
                      <div className="edu-year">{a.startYear} — {a.endYear || t.present}</div>
                      {a.description && <p>{a.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Leadership & Organization */}
      {profile.showOrganizations !== false && (
        <section className="section" id="organizations">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{lang === "en" ? "Leadership & Activities" : "Kepemimpinan & Organisasi"}</p>
              <h2 className="section-title">{lang === "en" ? "Organization Experience" : "Pengalaman Organisasi"}</h2>
              <p className="section-desc">{lang === "en" ? "Active involvement in leadership roles and communities." : "Peran aktif dalam kepemimpinan dan organisasi kemasyarakatan."}</p>
            </div>
            <div className="timeline">
              {organizations.map((org) => {
                const orgLogo = img(org.logoUrl);
                return (
                  <div className={`timeline-item ${org.current ? "current" : ""}`} key={org.id}>
                    <div className="timeline-dot" />
                    <div className="timeline-date"><HiOutlineCalendar size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />{org.startDate} — {org.current ? t.present : org.endDate}</div>
                    <div className="timeline-card">
                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                        {orgLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={orgLogo} alt={org.organization} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border-color)" }} />
                        ) : (
                          <div className="timeline-icon-fallback" style={{ width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-glow)", color: "var(--accent-secondary)", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                            <HiOutlineUserGroup size={20} />
                          </div>
                        )}
                        <div>
                          <h3>{org.role}</h3>
                          <div className="subtitle">{org.organization}{org.location ? ` · ${org.location}` : ""}</div>
                        </div>
                      </div>
                      {org.description && (
                        <div className="org-description" style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                          {org.description.split("\n").map((line, idx) => (
                            <p key={idx} style={{ marginBottom: 8 }}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {profile.showBlog !== false && (
        <section className="section" id="blog">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{t.blog}</p>
              <h2 className="section-title">{t.latestArticles}</h2>
              <p className="section-desc">{t.blogSubtitle}</p>
            </div>
            <div className="blog-grid">
              {blogs.map((b) => {
                const bImg = img(b.coverImageUrl);
                return (
                  <Link href={`/blog/${b.slug}?lang=${lang}`} key={b.id} className="blog-card">
                    {bImg && (
                      <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", marginTop: -4 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={bImg} alt={b.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                      </div>
                    )}
                    <div className="blog-meta">
                      <span><HiOutlineCalendar size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 3 }} />{new Date(b.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span>·</span>
                      <span><HiOutlineClock size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 3 }} />{b.readTime} {t.readTime}</span>
                    </div>
                    <h3>{b.title}</h3>
                    <p>{b.excerpt}</p>
                    <div className="blog-tags">
                      {b.tags?.map((t) => <span className="tech-tag" key={t}>{t}</span>)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Awards */}
      {profile.showAwards !== false && (
        <section className="section" id="awards">
          <div className="container">
            <div className="section-header">
              <p className="section-label">{t.recognition}</p>
              <h2 className="section-title">{t.awardsAchievements}</h2>
            </div>
            <div className="awards-grid">
              {awards.map((a) => {
                const aImg = img(a.imageUrl);
                return (
                  <div className="award-card" key={a.id}>
                    {aImg && (
                      <div style={{ marginBottom: 12, borderRadius: 8, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={aImg} alt={a.title} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                      </div>
                    )}
                    <span className="award-year"><HiOutlineTrophy size={12} style={{ display: "inline", verticalAlign: "-1px", marginRight: 4 }} />{a.year}</span>
                    <h3>{a.title}</h3>
                    <div className="issuer">{a.issuer}</div>
                    {a.description && <p>{a.description}</p>}
                    {a.credentialUrl && (
                      <a href={formatUrl(a.credentialUrl)} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginTop: 16, padding: "8px 16px", fontSize: "0.8rem" }}>
                        <HiOutlineCheckBadge size={14} /> {t.viewCredential}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function FallbackPage() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Portfolio</h1>
          <p className="hero-desc">
            Backend is not running. Start the backend server with <code>npm run dev</code> in the <code>backend</code> folder, then run <code>npm run seed</code> to populate data.
          </p>
        </div>
      </div>
    </section>
  );
}
