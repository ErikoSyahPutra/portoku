"use client";

import { useEffect } from "react";
import { translations } from "@/lib/translations";
import { Profile, Experience, Academic } from "@/lib/api";
import {
  HiOutlineXMark,
  HiOutlineArrowDownTray,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePrinter,
} from "react-icons/hi2";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  experiences?: Experience[];
  academics?: Academic[];
  lang: string;
}

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

function formatUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return `${BACKEND}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export default function CvModal({
  isOpen,
  onClose,
  profile,
  experiences = [],
  academics = [],
  lang,
}: CvModalProps) {
  const t = translations[lang] || translations.id;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pdfSrc = profile.resumeUrl ? formatUrl(profile.resumeUrl) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cv-modal-backdrop" onClick={onClose}>
      <div className="cv-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cv-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="cv-modal-icon">
              <HiOutlineDocumentText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                {profile.name} — {t.cvTitle}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                {profile.title}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {pdfSrc ? (
              <a
                href={pdfSrc}
                download
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                <HiOutlineArrowDownTray size={16} /> {t.downloadCv}
              </a>
            ) : (
              <button
                onClick={handlePrint}
                className="btn btn-secondary"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                <HiOutlinePrinter size={16} /> {lang === "en" ? "Print / Save PDF" : "Cetak / Simpan PDF"}
              </button>
            )}

            <button
              onClick={onClose}
              className="cv-modal-close-btn"
              aria-label="Close CV Modal"
            >
              <HiOutlineXMark size={22} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="cv-modal-body">
          {pdfSrc ? (
            <iframe
              src={pdfSrc}
              className="cv-pdf-iframe"
              title={`${profile.name} CV PDF`}
            />
          ) : (
            /* Digital Interactive Resume Card Fallback */
            <div className="cv-digital-resume">
              {/* Header */}
              <div className="cv-resume-header">
                <h2>{profile.name}</h2>
                <div className="cv-resume-title">{profile.title}</div>
                <div className="cv-resume-meta">
                  {profile.location && (
                    <span>
                      <HiOutlineMapPin size={14} /> {profile.location}
                    </span>
                  )}
                  {profile.email && (
                    <span>
                      <HiOutlineEnvelope size={14} /> {profile.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio Summary */}
              {profile.bio && (
                <div className="cv-resume-section">
                  <h4 className="cv-section-title">
                    {lang === "en" ? "Professional Summary" : "Ringkasan Profesional"}
                  </h4>
                  <p>{profile.bio}</p>
                </div>
              )}

              {/* Work Experience */}
              {experiences.length > 0 && (
                <div className="cv-resume-section">
                  <h4 className="cv-section-title">
                    <HiOutlineBriefcase size={16} />{" "}
                    {lang === "en" ? "Work Experience" : "Pengalaman Kerja"}
                  </h4>
                  <div className="cv-timeline">
                    {experiences.map((exp) => (
                      <div className="cv-timeline-item" key={exp.id}>
                        <div className="cv-item-header">
                          <div>
                            <strong>{exp.position}</strong> —{" "}
                            <span className="cv-company">{exp.company}</span>
                          </div>
                          <span className="cv-date">
                            {exp.startDate} – {exp.current ? (lang === "en" ? "Present" : "Sekarang") : exp.endDate}
                          </span>
                        </div>
                        {exp.description && <p>{exp.description}</p>}
                        {exp.skills?.length > 0 && (
                          <div className="cv-skills">
                            {exp.skills.map((s) => (
                              <span className="cv-skill-tag" key={s}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {academics.length > 0 && (
                <div className="cv-resume-section">
                  <h4 className="cv-section-title">
                    <HiOutlineAcademicCap size={16} />{" "}
                    {lang === "en" ? "Education" : "Pendidikan"}
                  </h4>
                  <div className="cv-timeline">
                    {academics.map((edu) => (
                      <div className="cv-timeline-item" key={edu.id}>
                        <div className="cv-item-header">
                          <div>
                            <strong>{edu.institution}</strong> — {edu.degree} in {edu.field}
                          </div>
                          <span className="cv-date">
                            {edu.startYear} – {edu.endYear || (lang === "en" ? "Present" : "Sekarang")}
                          </span>
                        </div>
                        {edu.description && <p>{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
