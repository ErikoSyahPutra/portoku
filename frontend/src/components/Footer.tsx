"use client";
import { HiOutlineHeart } from "react-icons/hi2";
import { useSearchParams } from "next/navigation";
import { translations } from "@/lib/translations";

export default function Footer() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "id";
  const t = translations[lang] || translations.id;

  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer-links">
          <li><a href={`/#about?lang=${lang}`}>{t.about || "About"}</a></li>
          <li><a href={`/#projects?lang=${lang}`}>{t.projects || "Projects"}</a></li>
          <li><a href={`/#blog?lang=${lang}`}>{t.blog || "Blog"}</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
        <p>
          <HiOutlineHeart size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4, color: "var(--accent-primary)" }} />
          &copy; {new Date().getFullYear()} Eriko Syah Putra Friyadi. Built with Next.js &amp; NestJS.
        </p>
      </div>
    </footer>
  );
}
