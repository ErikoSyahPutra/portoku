"use client";
import { HiOutlineHeart } from "react-icons/hi2";
import { useSearchParams, usePathname } from "next/navigation";
import { translations } from "@/lib/translations";

export default function Footer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = searchParams.get("lang") || "id";
  const t = translations[lang] || translations.id;

  const getLinkHref = (hash: string) => {
    if (pathname === "/") {
      return hash;
    }
    return `/?lang=${lang}${hash}`;
  };

  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer-links">
          <li><a href={getLinkHref("#about")}>{t.about || "About"}</a></li>
          <li><a href={getLinkHref("#projects")}>{t.projects || "Projects"}</a></li>
          <li><a href={getLinkHref("#blog")}>{t.blog || "Blog"}</a></li>
          <li><a href={`/admin?lang=${lang}`}>{t.admin || "Admin"}</a></li>
        </ul>
        <p>
          <HiOutlineHeart size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4, color: "var(--accent-primary)" }} />
          &copy; {new Date().getFullYear()} Eriko Syah Putra Friyadi. Built with Next.js &amp; NestJS.
        </p>
      </div>
    </footer>
  );
}
