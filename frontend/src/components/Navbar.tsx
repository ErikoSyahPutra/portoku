"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineBars3, HiOutlineXMark, HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { api, Profile } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { translations } from "@/lib/translations";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLang = searchParams.get("lang") || "id";
  const t = translations[currentLang] || translations.id;

  const changeLanguage = (lang: string) => {
    localStorage.setItem("lang", lang);
    const params = new URLSearchParams(window.location.search);
    params.set("lang", lang);
    router.push(`${window.location.pathname}?${params.toString()}${window.location.hash}`);
  };

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setIsDark(!isLight);
  }, []);

  useEffect(() => {
    const localLang = localStorage.getItem("lang");
    const urlLang = searchParams.get("lang");

    if (urlLang) {
      if (localLang !== urlLang) {
        localStorage.setItem("lang", urlLang);
      }
    } else {
      if (localLang) {
        const params = new URLSearchParams(window.location.search);
        params.set("lang", localLang);
        router.replace(`${window.location.pathname}?${params.toString()}${window.location.hash}`);
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    api.getProfile(currentLang)
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error loading profile in Navbar:", err));
  }, [currentLang]);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const links = [
    { href: "#about", label: t.about || "About" },
    ...(profile?.showProjects !== false ? [{ href: "#projects", label: t.projects || "Projects" }] : []),
    ...(profile?.showExperiences !== false ? [{ href: "#experience", label: t.career || "Experience" }] : []),
    ...(profile?.showAcademics !== false ? [{ href: "#education", label: t.education || "Education" }] : []),
    ...(profile?.showBlog !== false ? [{ href: "#blog", label: t.blog || "Blog" }] : []),
    ...(profile?.showAwards !== false ? [{ href: "#awards", label: t.awards || "Awards" }] : []),
  ];

  return (
    <nav className="navbar" id="navbar">
      <div className="container navbar-inner">
        <Link href={`/?lang=${currentLang}`} className="navbar-logo">Eriko Syah</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ul className={`navbar-links ${open ? "open" : ""}`}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className="lang-toggle">
            <button
              onClick={() => changeLanguage("id")}
              className={currentLang === "id" ? "active" : ""}
            >
              ID
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={currentLang === "en" ? "active" : ""}
            >
              EN
            </button>
          </div>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            {isDark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          </button>
          <button className="navbar-mobile-btn" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <HiOutlineXMark size={24} /> : <HiOutlineBars3 size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
