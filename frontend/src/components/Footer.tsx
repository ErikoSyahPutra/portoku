import { HiOutlineHeart } from "react-icons/hi2";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
        <p>
          <HiOutlineHeart size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4, color: "var(--accent-primary)" }} />
          &copy; {new Date().getFullYear()} Mahesa. Built with Next.js &amp; NestJS.
        </p>
      </div>
    </footer>
  );
}
