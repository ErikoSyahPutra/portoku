"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Project } from "@/lib/api";
import { translations } from "@/lib/translations";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCodeBracket,
  HiOutlineComputerDesktop,
  HiOutlinePaintBrush,
  HiOutlineDevicePhoneMobile,
  HiOutlineSparkles,
  HiOutlineFolder,
} from "react-icons/hi2";
import { SiFigma, SiBehance } from "react-icons/si";

interface Props {
  projects: Project[];
  lang: string;
  isSpotlight?: boolean;
  showAllLink?: boolean;
}

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

function img(url?: string, width: number = 600): string | null {
  if (!url) return null;
  const fullUrl = url.startsWith("http") ? url : `${BACKEND}${url}`;
  if (fullUrl.includes("ik.imagekit.io") && !fullUrl.includes("tr=")) {
    const separator = fullUrl.includes("?") ? "&" : "?";
    return `${fullUrl}${separator}tr=w-${width},q-80,f-auto`;
  }
  return fullUrl;
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

export default function ProjectGridWithFilter({
  projects,
  lang,
  isSpotlight = false,
  showAllLink = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const t = translations[lang] || translations.id;

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return projects;
    return projects.filter((p) => (p.category || "web").toLowerCase() === activeTab);
  }, [projects, activeTab]);

  // Categories present in projects
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      const cat = (p.category || "web").toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const tabs = [
    { id: "all", label: t.allCategories, icon: HiOutlineFolder, count: categoryCounts.all },
    { id: "web", label: t.catWeb, icon: HiOutlineCodeBracket, count: categoryCounts.web || 0 },
    { id: "ui_ux", label: t.catUiUx, icon: HiOutlinePaintBrush, count: categoryCounts.ui_ux || 0 },
    { id: "mobile", label: t.catMobile, icon: HiOutlineDevicePhoneMobile, count: categoryCounts.mobile || 0 },
    { id: "other", label: t.catOther, icon: HiOutlineSparkles, count: categoryCounts.other || 0 },
  ].filter((tab) => tab.id === "all" || tab.count > 0);

  const getCategoryBadge = (cat?: string) => {
    const key = (cat || "web").toLowerCase();
    switch (key) {
      case "ui_ux":
        return (
          <span className="cat-badge ui-ux">
            <HiOutlinePaintBrush size={12} /> UI/UX Design
          </span>
        );
      case "mobile":
        return (
          <span className="cat-badge mobile">
            <HiOutlineDevicePhoneMobile size={12} /> Mobile App
          </span>
        );
      case "other":
        return (
          <span className="cat-badge other">
            <HiOutlineSparkles size={12} /> {t.catOther}
          </span>
        );
      default:
        return (
          <span className="cat-badge web">
            <HiOutlineCodeBracket size={12} /> Web Dev
          </span>
        );
    }
  };

  const renderActionLinks = (p: Project) => (
    <div className="project-links" style={{ marginTop: "auto", paddingTop: 12 }}>
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
      {p.figmaUrl && (
        <a href={formatUrl(p.figmaUrl)} target="_blank" rel="noreferrer" className="link-figma">
          <SiFigma size={13} /> {t.figmaPrototype}
        </a>
      )}
      {p.behanceUrl && (
        <a href={formatUrl(p.behanceUrl)} target="_blank" rel="noreferrer" className="link-behance">
          <SiBehance size={14} /> {t.behanceShowcase}
        </a>
      )}
    </div>
  );

  return (
    <div className="project-filter-wrapper">
      {/* Category Tabs */}
      <div className="project-tabs-container">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`project-tab-btn ${isActive ? "active" : ""}`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          <HiOutlineComputerDesktop size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p>{lang === "en" ? "No projects found in this category." : "Tidak ada proyek dalam kategori ini."}</p>
        </div>
      ) : isSpotlight && activeTab === "all" ? (
        /* Default Home Hero Spotlight view when "All" is active */
        (() => {
          const heroProject = filteredProjects[0];
          const miniProjects = filteredProjects.slice(1, 4);
          const totalProjects = filteredProjects.length;
          const heroImg = img(heroProject.imageUrl);

          return (
            <div className="projects-spotlight-grid">
              {/* Hero Spotlight Card */}
              <div className="project-card-spotlight">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="flagship-badge">{t.flagshipBadge}</span>
                  {getCategoryBadge(heroProject.category)}
                </div>

                <Link
                  href={`/projects/${heroProject.id}?lang=${lang}`}
                  style={{ color: "inherit", textDecoration: "none", display: "flex", flexDirection: "column", flex: 1 }}
                >
                  {heroImg ? (
                    <div style={{ marginBottom: 18, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-color)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroImg}
                        alt={heroProject.title || "Gambar proyek utama"}
                        style={{ width: "100%", height: 230, objectFit: "cover", display: "block" }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        marginBottom: 18,
                        borderRadius: 8,
                        height: 230,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--accent-glow)",
                        border: "1px solid var(--border-color)",
                        color: "var(--accent-secondary)",
                      }}
                    >
                      <HiOutlineComputerDesktop size={48} />
                    </div>
                  )}
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 10 }}>{heroProject.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", marginBottom: 16, lineHeight: 1.6 }}>
                    {heroProject.description}
                  </p>
                  <div className="project-techs" style={{ marginBottom: 20 }}>
                    {heroProject.technologies?.map((tech) => (
                      <span className="tech-tag" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>

                {renderActionLinks(heroProject)}
              </div>

              {/* Mini Projects Side Column */}
              <div className="projects-mini-list">
                {miniProjects.map((p) => {
                  const pImg = img(p.imageUrl, 400);
                  return (
                    <Link href={`/projects/${p.id}?lang=${lang}`} className="project-mini-card" key={p.id}>
                      {pImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pImg} alt={p.title || "Gambar proyek"} className="mini-card-thumb" />
                      ) : (
                        <div className="mini-card-thumb-fallback">
                          <HiOutlineComputerDesktop size={24} />
                        </div>
                      )}
                      <div className="mini-card-content">
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          {getCategoryBadge(p.category)}
                        </div>
                        <h4>{p.title}</h4>
                        <p>{p.description}</p>
                        <div className="project-techs" style={{ marginBottom: 0 }}>
                          {p.technologies?.slice(0, 3).map((tech) => (
                            <span className="tech-tag" key={tech} style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <HiOutlineArrowTopRightOnSquare size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    </Link>
                  );
                })}

                {showAllLink && totalProjects > 1 && (
                  <Link href={`/projects?lang=${lang}`} className="projects-view-all-btn">
                    {t.viewAllProjects.replace("{count}", String(totalProjects))}
                  </Link>
                )}
              </div>
            </div>
          );
        })()
      ) : (
        /* Standard Grid View for Category Filter & Projects Page */
        <div className="projects-grid">
          {filteredProjects.map((p) => {
            const pImg = img(p.imageUrl);
            return (
              <div className="project-card" key={p.id} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  {getCategoryBadge(p.category)}
                  {p.featured && <span className="flagship-badge-sm">⭐ Featured</span>}
                </div>

                <Link
                  href={`/projects/${p.id}?lang=${lang}`}
                  style={{ flex: 1, display: "block", color: "inherit", textDecoration: "none" }}
                >
                  {pImg ? (
                    <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-color)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pImg} alt={p.title} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                    </div>
                  ) : (
                    <div
                      style={{
                        marginBottom: 16,
                        borderRadius: 8,
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--accent-glow)",
                        border: "1px solid var(--border-color)",
                        color: "var(--accent-secondary)",
                      }}
                    >
                      <HiOutlineComputerDesktop size={44} />
                    </div>
                  )}
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 10 }}>{p.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 16, lineHeight: 1.6 }}>
                    {p.description}
                  </p>
                  <div className="project-techs" style={{ marginBottom: 16 }}>
                    {p.technologies?.map((tech) => (
                      <span className="tech-tag" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>

                {renderActionLinks(p)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
