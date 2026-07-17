export const dynamic = "force-dynamic";

import { api } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = typeof resolvedSearchParams.lang === "string" ? resolvedSearchParams.lang : "id";

  let blog;
  try {
    blog = await api.getBlog(slug, lang);
  } catch {
    notFound();
  }
  if (!blog) notFound();

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
      if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
      if (line.startsWith("# ")) return <h1 key={i}>{line.slice(2)}</h1>;
      if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i}>{line.slice(2)}</li>;
      if (line.match(/^\d+\.\s/)) return <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>;
      if (line.startsWith("```")) return null;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}</p>;
    });
  };

  return (
    <div className="blog-detail">
      <div className="container">
        <div className="blog-detail-header">
          <Link href={`/?lang=${lang}#blog`} className="btn btn-secondary" style={{ marginBottom: 32, padding: "8px 16px", fontSize: "0.85rem" }}>
            {lang === "en" ? "← Back to Blog" : "← Kembali ke Blog"}
          </Link>
          <h1>{blog.title}</h1>
          <div className="blog-detail-meta">
            <span>{new Date(blog.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>·</span>
            <span>{blog.readTime} {lang === "en" ? "min read" : "menit baca"}</span>
          </div>
          <div className="blog-tags" style={{ marginBottom: 24 }}>
            {blog.tags?.map((t) => <span className="tech-tag" key={t}>{t}</span>)}
          </div>
        </div>
        <div className="blog-detail-content">
          {renderContent(blog.content)}
        </div>
      </div>
    </div>
  );
}
