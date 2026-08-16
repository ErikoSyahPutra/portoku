"use client";

import { useState } from "react";
import { translations } from "@/lib/translations";
import { sendContact } from "@/lib/admin-api";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineTag,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

interface Props {
  lang: string;
  profileEmail?: string;
  profileLocation?: string;
}

export default function ContactFormSection({ lang, profileEmail, profileLocation }: Props) {
  const t = translations[lang] || translations.id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage(lang === "en" ? "Please fill in all required fields." : "Harap isi semua kolom wajib.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await sendContact(formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage(t.errorMessage);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header">
          <p className="section-label">{t.getInTouch}</p>
          <h2 className="section-title">{t.contactTitle}</h2>
          <p className="section-desc">{t.contactSubtitle}</p>
        </div>

        <div className="contact-grid">
          {/* Contact Information Side Card */}
          <div className="contact-info-card">
            <h3>{lang === "en" ? "Let's work together!" : "Mari Bekerja Sama!"}</h3>
            <p>
              {lang === "en"
                ? "Feel free to reach out directly via form or email. I am always open to discussing new projects, creative ideas, or opportunities."
                : "Silakan hubungi saya melalui formulir atau email. Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang karir."}
            </p>

            <div className="contact-details-list">
              {profileEmail && (
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <HiOutlineEnvelope size={20} />
                  </div>
                  <div>
                    <div className="contact-label">{t.email}</div>
                    <a href={`mailto:${profileEmail}`} className="contact-val">
                      {profileEmail}
                    </a>
                  </div>
                </div>
              )}

              {profileLocation && (
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <HiOutlineMapPin size={20} />
                  </div>
                  <div>
                    <div className="contact-label">{t.location}</div>
                    <div className="contact-val">{profileLocation}</div>
                  </div>
                </div>
              )}

              <div className="contact-detail-item">
                <div className="contact-icon">
                  <HiOutlineBriefcase size={20} />
                </div>
                <div>
                  <div className="contact-label">Status</div>
                  <div className="contact-val" style={{ color: "#34d399", fontWeight: 600 }}>
                    ● {t.availableBadge}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Glass Card */}
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="contact-field-group">
                  <label htmlFor="contact-name">
                    <HiOutlineUser size={15} /> {t.nameLabel} <span className="req">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="contact-form-input"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="contact-field-group">
                  <label htmlFor="contact-email">
                    <HiOutlineEnvelope size={15} /> {t.emailLabel} <span className="req">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="contact-form-input"
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-subject">
                  <HiOutlineTag size={15} /> {t.subjectLabel}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  className="contact-form-input"
                  placeholder={t.subjectPlaceholder}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-message">
                  <HiOutlineChatBubbleBottomCenterText size={15} /> {t.messageLabel} <span className="req">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className="contact-form-input"
                  placeholder={t.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              {status === "success" && (
                <div className="contact-alert success">
                  <HiOutlineCheckCircle size={20} />
                  <span>{t.successMessage}</span>
                </div>
              )}

              {status === "error" && (
                <div className="contact-alert error">
                  <HiOutlineExclamationTriangle size={20} />
                  <span>{errorMessage || t.errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-primary contact-submit-btn"
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner" /> {t.sendingButton}
                  </>
                ) : (
                  <>
                    <HiOutlinePaperAirplane size={18} /> {t.sendButton}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
