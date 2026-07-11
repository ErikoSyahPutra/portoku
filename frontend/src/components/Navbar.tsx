"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineBars3, HiOutlineXMark, HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { api, Profile } from "@/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setIsDark(!isLight);

    api.getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error loading profile in Navbar:", err));
  }, []);

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
    { href: "#about", label: "About" },
    ...(profile?.showProjects !== false ? [{ href: "#projects", label: "Projects" }] : []),
    ...(profile?.showExperiences !== false ? [{ href: "#experience", label: "Experience" }] : []),
    ...(profile?.showAcademics !== false ? [{ href: "#education", label: "Education" }] : []),
    ...(profile?.showBlog !== false ? [{ href: "#blog", label: "Blog" }] : []),
    ...(profile?.showAwards !== false ? [{ href: "#awards", label: "Awards" }] : []),
  ];

  return (
    <nav className="navbar" id="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-logo">Eriko Syah</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ul className={`navbar-links ${open ? "open" : ""}`}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
              </li>
            ))}
          </ul>
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
