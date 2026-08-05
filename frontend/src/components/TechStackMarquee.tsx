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
  SiGit,
  SiFigma,
  SiHtml5,
  SiCss,
  SiMysql,
  SiPrisma,
  SiExpress,
  SiWordpress,
} from "react-icons/si";

interface TechItem {
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: "Next.js", icon: SiNextdotjs, color: "var(--text-primary)" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express", icon: SiExpress, color: "var(--text-primary)" },
  { name: "Prisma", icon: SiPrisma, color: "var(--text-primary)" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "WordPress", icon: SiWordpress, color: "#21759B" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: SiCss, color: "#1572B6" },
];

export default function TechStackMarquee({ lang }: { lang: string }) {
  const t = translations[lang] || translations.id;
  
  const half = Math.ceil(TECH_ITEMS.length / 2);
  const row1 = TECH_ITEMS.slice(0, half);
  const row2 = TECH_ITEMS.slice(half);

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

        <div className="marquee-wrapper" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Row 1: Gerak Kiri */}
          <div className="marquee-track">
            <div className="marquee-group">
              {row1.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r1-1-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {row1.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r1-2-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {row1.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r1-3-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {row1.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r1-4-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Gerak Kanan */}
          <div className="marquee-track">
            <div className="marquee-group group-right">
              {row2.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r2-1-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="marquee-group group-right" aria-hidden="true">
              {row2.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r2-2-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="marquee-group group-right" aria-hidden="true">
              {row2.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r2-3-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="marquee-group group-right" aria-hidden="true">
              {row2.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="tech-card" key={`r2-4-${item.name}-${idx}`}>
                    <div className="tech-icon-wrapper" style={{ color: item.color }}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
