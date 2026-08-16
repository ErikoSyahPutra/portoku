"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import "./admin.css";
import * as api from "@/lib/admin-api";

// Icons from react-icons (Heroicons outline)
import {
  HiOutlineUser,
  HiOutlineComputerDesktop,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineTrophy,
  HiOutlineArrowLeft,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineXMark,
  HiOutlinePhoto,
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserGroup,
  HiOutlineEnvelope,
} from "react-icons/hi2";

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

const TABS = [
  { key: "profile", label: "Profile", icon: HiOutlineUser },
  { key: "projects", label: "Projects", icon: HiOutlineComputerDesktop },
  { key: "experiences", label: "Experience", icon: HiOutlineBriefcase },
  { key: "academics", label: "Education", icon: HiOutlineAcademicCap },
  { key: "organizations", label: "Organizations", icon: HiOutlineUserGroup },
  { key: "blogs", label: "Blog", icon: HiOutlineDocumentText },
  { key: "awards", label: "Awards", icon: HiOutlineTrophy },
  { key: "contacts", label: "Inbox Messages", icon: HiOutlineEnvelope },
  { key: "media", label: "Media Helper", icon: HiOutlinePhoto },
];

type Toast = { message: string; type: "success" | "error" } | null;

export default function AdminPage() {
  const [tab, setTab] = useState("profile");
  const [toast, setToast] = useState<Toast>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>Manage portfolio</p>
        </div>
        <ul className="admin-nav">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.key}>
                <button className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
                  <Icon /> <span>{t.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="admin-sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/"><HiOutlineArrowLeft /> <span>Back to Site</span></Link>
          <button
            onClick={handleSignOut}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.8rem",
              cursor: "pointer",
              padding: 0,
              opacity: 0.8,
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
          >
            <HiOutlineArrowRightOnRectangle size={14} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {tab === "profile" && <ProfilePanel showToast={showToast} />}
        {tab === "projects" && <CrudPanel entity="projects" showToast={showToast} fields={projectFields} columns={["title","category","order","featured","technologies"]} />}
        {tab === "experiences" && <CrudPanel entity="experiences" showToast={showToast} fields={experienceFields} columns={["position","company","startDate","current"]} />}
        {tab === "academics" && <CrudPanel entity="academics" showToast={showToast} fields={academicFields} columns={["institution","degree","field","startYear"]} />}
        {tab === "blogs" && <CrudPanel entity="blogs" showToast={showToast} fields={blogFields} columns={["title","slug","published","readTime"]} />}
        {tab === "awards" && <CrudPanel entity="awards" showToast={showToast} fields={awardFields} columns={["title","issuer","year"]} />}
        {tab === "organizations" && <CrudPanel entity="organizations" showToast={showToast} fields={organizationFields} columns={["organization","role","startDate","current"]} />}
        {tab === "contacts" && <ContactsPanel showToast={showToast} />}
        {tab === "media" && <MediaHelperPanel showToast={showToast} />}
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <HiOutlineCheckCircle style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ═══════════ Image Upload Component ═══════════ */
function ImageUpload({ value, onChange, round }: { value?: string; onChange: (url: string) => void; round?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const imgSrc = value ? (value.startsWith("http") ? value : `${BACKEND}${value}`) : null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      onChange(res.url);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="image-upload">
      <div className={`image-upload-preview ${round ? "large" : ""}`}>
        {imgSrc ? <img src={imgSrc} alt="Preview" /> : <HiOutlinePhoto size={24} />}
      </div>
      <div className="image-upload-controls">
        <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} hidden />
        <button type="button" className={`image-upload-btn ${uploading ? "uploading" : ""}`} onClick={() => fileRef.current?.click()}>
          <HiOutlineCloudArrowUp size={16} />
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <span className="image-upload-hint">JPG, PNG, WebP. Max 5MB.</span>
        {value && (
          <button type="button" className="image-upload-remove" onClick={() => onChange("")}>
            Remove image
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════ Markdown Textarea Component ═══════════ */
function MarkdownTextarea({
  value,
  onChange,
  rows = 6,
  placeholder = "Tulis konten Markdown di sini...",
}: {
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdownImage = (url: string) => {
    const markdownImage = `\n![Image](${url})\n`;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      
      onChange(before + markdownImage + after);
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + markdownImage.length;
      }, 50);
    } else {
      onChange(value + markdownImage);
    }
  };

  const insertFormat = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    let replacement = "";
    let cursorOffset = 0;

    switch (type) {
      case "h1":
        replacement = `\n# ${selected || "Header 1"}\n`;
        cursorOffset = replacement.length;
        break;
      case "h2":
        replacement = `\n## ${selected || "Header 2"}\n`;
        cursorOffset = replacement.length;
        break;
      case "h3":
        replacement = `\n### ${selected || "Header 3"}\n`;
        cursorOffset = replacement.length;
        break;
      case "bold":
        replacement = `**${selected || "Teks Tebal"}**`;
        cursorOffset = replacement.length;
        break;
      case "italic":
        replacement = `*${selected || "Teks Miring"}*`;
        cursorOffset = replacement.length;
        break;
      case "list":
        replacement = `\n- ${selected || "Item list"}\n`;
        cursorOffset = replacement.length;
        break;
      case "link":
        replacement = `[${selected || "Judul Link"}](https://example.com)`;
        cursorOffset = selected ? replacement.length : 12 + (selected || "Judul Link").length; // cursor in URL
        break;
      default:
        return;
    }

    onChange(before + replacement + after);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
    }, 50);
  };

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      const fullUrl = res.url.startsWith("http") ? res.url : `${BACKEND}${res.url}`;
      insertMarkdownImage(fullUrl);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      const fullUrl = res.url.startsWith("http") ? res.url : `${BACKEND}${res.url}`;
      insertMarkdownImage(fullUrl);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const file = e.clipboardData.items?.[0]?.getAsFile();
    if (!file || !file.type.startsWith("image/")) return; // Let default text paste happen if not an image

    e.preventDefault();
    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      const fullUrl = res.url.startsWith("http") ? res.url : `${BACKEND}${res.url}`;
      insertMarkdownImage(fullUrl);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, background: "var(--bg-secondary)", padding: "8px 12px", border: "1px solid var(--border-color)", borderBottom: "none", borderRadius: "8px 8px 0 0", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", marginRight: 8 }}>MARKDOWN</span>
        
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto" }} onClick={() => insertFormat("h1")}>H1</button>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto" }} onClick={() => insertFormat("h2")}>H2</button>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto" }} onClick={() => insertFormat("h3")}>H3</button>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto", fontWeight: "bold" }} onClick={() => insertFormat("bold")}>B</button>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto", fontStyle: "italic" }} onClick={() => insertFormat("italic")}>I</button>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto" }} onClick={() => insertFormat("list")}>• List</button>
          <button type="button" className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto" }} onClick={() => insertFormat("link")}>🔗 Link</button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <input type="file" ref={fileRef} accept="image/*" onChange={handleInsertImage} style={{ display: "none" }} />
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: "4px 8px", fontSize: "0.75rem", height: "auto" }}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "📸 Insert Image"}
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        className="form-input"
        style={{ borderRadius: "0 0 8px 8px", borderTop: "none", marginTop: -8 }}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
      />
    </div>
  );
}

/* ═══════════ Profile Panel ═══════════ */
function ProfilePanel({ showToast }: { showToast: (m: string, t?: "success"|"error") => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getProfile().then(setData).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    try {
      await api.updateProfile(data);
      showToast("Profile updated!");
    } catch { showToast("Failed to update", "error"); }
  };

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Loading...</p>;
  if (!data) return null;

  const set = (k: string, v: any) => setData({ ...data, [k]: v });

  return (
    <>
      <div className="admin-topbar">
        <h1>Profile</h1>
        <button className="btn btn-primary" onClick={handleSave}>
          <HiOutlineCheckCircle size={18} /> Save Changes
        </button>
      </div>
      <div className="admin-table-wrap" style={{ padding: 24 }}>
        {/* Avatar */}
        <div className="form-group">
          <label>Avatar</label>
          <ImageUpload value={data.avatarUrl} onChange={(url) => set("avatarUrl", url)} round />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input className="form-input" value={data.name || ""} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input className="form-input" value={data.title || ""} onChange={(e) => set("title", e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Bio (short)</label>
          <textarea className="form-input" value={data.bio || ""} onChange={(e) => set("bio", e.target.value)} />
        </div>
        <div className="form-group">
          <label>About Me (full - Markdown)</label>
          <MarkdownTextarea value={data.aboutMe || ""} onChange={(val) => set("aboutMe", val)} rows={6} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" value={data.email || ""} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="form-input" value={data.location || ""} onChange={(e) => set("location", e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>GitHub URL</label>
            <input className="form-input" value={data.githubUrl || ""} onChange={(e) => set("githubUrl", e.target.value)} />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input className="form-input" value={data.linkedinUrl || ""} onChange={(e) => set("linkedinUrl", e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Twitter URL</label>
            <input className="form-input" value={data.twitterUrl || ""} onChange={(e) => set("twitterUrl", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Website URL</label>
            <input className="form-input" value={data.websiteUrl || ""} onChange={(e) => set("websiteUrl", e.target.value)} />
          </div>
        </div>

        {/* Resume */}
        <div className="form-group">
          <label>Resume URL</label>
          <input className="form-input" value={data.resumeUrl || ""} onChange={(e) => set("resumeUrl", e.target.value)} placeholder="Link or upload path" />
        </div>

        {/* Feature Toggles */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border-color)" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16, letterSpacing: "0.04em" }}>FEATURE VISIBILITY</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="form-check">
              <input type="checkbox" id="showProjects" checked={data.showProjects !== false} onChange={(e) => set("showProjects", e.target.checked)} />
              <label htmlFor="showProjects">Show Projects Section</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="showExperiences" checked={data.showExperiences !== false} onChange={(e) => set("showExperiences", e.target.checked)} />
              <label htmlFor="showExperiences">Show Experience Section</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="showAcademics" checked={data.showAcademics !== false} onChange={(e) => set("showAcademics", e.target.checked)} />
              <label htmlFor="showAcademics">Show Education Section</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="showBlog" checked={data.showBlog !== false} onChange={(e) => set("showBlog", e.target.checked)} />
              <label htmlFor="showBlog">Show Blog Section</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="showAwards" checked={data.showAwards !== false} onChange={(e) => set("showAwards", e.target.checked)} />
              <label htmlFor="showAwards">Show Awards Section</label>
            </div>
            <div className="form-check">
              <input type="checkbox" id="showOrganizations" checked={data.showOrganizations !== false} onChange={(e) => set("showOrganizations", e.target.checked)} />
              <label htmlFor="showOrganizations">Show Organizations Section</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════ Media Helper Panel ═══════════ */
function MediaHelperPanel({ showToast }: { showToast: (m: string, t?: "success"|"error") => void }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadFile(file);
      const fullUrl = res.url.startsWith("http") ? res.url : `${BACKEND}${res.url}`;
      setImageUrl(fullUrl);
      showToast("Uploaded successfully!");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showToast(message);
  };

  return (
    <>
      <div className="admin-topbar">
        <h1>Media Helper</h1>
      </div>
      <div className="admin-table-wrap" style={{ padding: 24, maxWidth: 600 }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
          Upload your images here to get public URLs and formatted Markdown codes that you can paste directly into your Project or Blog articles.
        </p>

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label>Select Image File</label>
          <input
            type="file"
            ref={fileRef}
            onChange={handleUpload}
            style={{ display: "none" }}
            accept="image/*"
          />
          <button
            type="button"
            className={`btn btn-primary ${uploading ? "uploading" : ""}`}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        {imageUrl && (
          <div style={{ marginTop: 24, padding: 16, background: "var(--bg-secondary)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: 16, color: "var(--text-primary)" }}>Uploaded Image Details</h3>
            
            {/* Preview */}
            <div style={{ width: "100%", maxHeight: 200, borderRadius: 8, overflow: "hidden", marginBottom: 16, border: "1px solid var(--border-color)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Uploaded preview" style={{ width: "100%", height: "100%", maxHeight: 200, objectFit: "contain", background: "#050508", display: "block", margin: "0 auto" }} />
            </div>

            {/* URL Input */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Direct Image URL</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-input" readOnly value={imageUrl} />
                <button className="btn btn-secondary" onClick={() => copyToClipboard(imageUrl, "URL copied!")}>Copy</button>
              </div>
            </div>

            {/* Markdown Input */}
            <div className="form-group">
              <label>Markdown Code (for Projects / Blog)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="form-input" readOnly value={`![Project Image](${imageUrl})`} />
                <button className="btn btn-secondary" onClick={() => copyToClipboard(`![Project Image](${imageUrl})`, "Markdown code copied!")}>Copy Code</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════ Contacts / Inbox Messages Panel ═══════════ */
function ContactsPanel({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(() => {
    setLoading(true);
    api
      .getContacts()
      .then(setMessages)
      .catch(() => showToast("Failed to load messages", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.deleteContact(id);
      showToast("Message deleted successfully!");
      loadMessages();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <>
      <div className="panel-header">
        <div>
          <h2>Inbox Messages</h2>
          <p className="subtitle">Pesan masuk dari pengunjung melalui Direct Contact Form.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="empty-state">
          <HiOutlineEnvelope size={48} style={{ opacity: 0.5, marginBottom: 12 }} />
          <h3>Belum ada pesan masuk</h3>
          <p>Pesan yang dikirim pengunjung via contact form akan tampil di sini.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>{m.name}</h3>
                  <div style={{ fontSize: "0.85rem", color: "var(--accent-secondary)", fontWeight: 500 }}>
                    <a href={`mailto:${m.email}`} style={{ color: "inherit" }}>
                      {m.email}
                    </a>
                    {m.subject && <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>· Subjek: {m.subject}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {new Date(m.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                  <button className="btn btn-secondary btn-icon danger" onClick={() => handleDelete(m.id)} title="Delete message">
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════ Generic CRUD Panel ═══════════ */
type FieldDef = { key: string; label: string; type: "text" | "textarea" | "number" | "checkbox" | "tags" | "image" | "select"; options?: { label: string; value: string }[] };

const apiMap: Record<string, { getAll: () => Promise<any>; create: (d: any) => Promise<any>; update: (id: number, d: any) => Promise<any>; remove: (id: number) => Promise<any> }> = {
  projects: { getAll: api.getProjects, create: api.createProject, update: api.updateProject, remove: api.deleteProject },
  experiences: { getAll: api.getExperiences, create: api.createExperience, update: api.updateExperience, remove: api.deleteExperience },
  academics: { getAll: api.getAcademics, create: api.createAcademic, update: api.updateAcademic, remove: api.deleteAcademic },
  blogs: { getAll: api.getBlogs, create: api.createBlog, update: api.updateBlog, remove: api.deleteBlog },
  awards: { getAll: api.getAwards, create: api.createAward, update: api.updateAward, remove: api.deleteAward },
  organizations: { getAll: api.getOrganizations, create: api.createOrganization, update: api.updateOrganization, remove: api.deleteOrganization },
};

function CrudPanel({ entity, showToast, fields, columns }: { entity: string; showToast: (m: string, t?: "success"|"error") => void; fields: FieldDef[]; columns: string[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [current, setCurrent] = useState<any>({});

  const load = useCallback(() => {
    setLoading(true);
    apiMap[entity].getAll().then(setItems).finally(() => setLoading(false));
  }, [entity]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setCurrent({}); setModal("create"); };
  const openEdit = (item: any) => {
    const copy = { ...item };
    fields.forEach((f) => {
      if (f.type === "tags" && Array.isArray(copy[f.key])) {
        copy[f.key] = copy[f.key].join(", ");
      }
    });
    setCurrent(copy);
    setModal("edit");
  };

  const handleSave = async () => {
    try {
      const payload = { ...current };
      fields.forEach((f) => {
        if (f.type === "tags" && typeof payload[f.key] === "string") {
          payload[f.key] = payload[f.key].split(",").map((s: string) => s.trim()).filter(Boolean);
        }
      });
      if (modal === "create") {
        await apiMap[entity].create(payload);
        showToast("Created successfully!");
      } else {
        await apiMap[entity].update(current.id, payload);
        showToast("Updated successfully!");
      }
      setModal(null);
      load();
    } catch { showToast("Operation failed", "error"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiMap[entity].remove(id);
      showToast("Deleted successfully!");
      load();
    } catch { showToast("Delete failed", "error"); }
  };

  const renderCellValue = (item: any, col: string) => {
    const val = item[col];
    if (typeof val === "boolean") return <span className={`table-badge ${val ? "green" : "yellow"}`}>{val ? "Yes" : "No"}</span>;
    if (Array.isArray(val)) return val.slice(0, 3).join(", ") + (val.length > 3 ? "…" : "");
    return String(val ?? "—");
  };

  const title = entity.charAt(0).toUpperCase() + entity.slice(1);

  return (
    <>
      <div className="admin-topbar">
        <h1>{title}</h1>
        <div className="admin-topbar-actions">
          <button className="btn btn-primary" onClick={openCreate}><HiOutlinePlus size={18} /> Add New</button>
        </div>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="empty-state"><p>Loading...</p></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No {entity} yet.</p>
            <button className="btn btn-secondary" onClick={openCreate}>Create your first one</button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => <th key={c}>{c.replace(/([A-Z])/g, " $1").trim()}</th>)}
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => <td key={c}>{renderCellValue(item, c)}</td>)}
                  <td className="col-actions">
                    <div className="actions-cell">
                      <button className="btn-icon" title="Edit" onClick={() => openEdit(item)}>
                        <HiOutlinePencilSquare size={16} />
                      </button>
                      <button className="btn-icon danger" title="Delete" onClick={() => handleDelete(item.id)}>
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "create" ? `Add New` : `Edit`} {title.endsWith("s") ? title.slice(0, -1) : title}</h2>
              <button className="modal-close" onClick={() => setModal(null)}><HiOutlineXMark size={20} /></button>
            </div>
            <div className="modal-body">
              {fields.map((f) => {
                if (f.type === "image") {
                  return (
                    <div className="form-group" key={f.key}>
                      <label>{f.label}</label>
                      <ImageUpload value={current[f.key]} onChange={(url) => setCurrent({ ...current, [f.key]: url })} />
                    </div>
                  );
                }
                if (f.type === "checkbox") {
                  return (
                    <div className="form-group" key={f.key}>
                      <div className="form-check">
                        <input type="checkbox" id={`${f.key}-${entity}`} checked={!!current[f.key]} onChange={(e) => setCurrent({ ...current, [f.key]: e.target.checked })} />
                        <label htmlFor={`${f.key}-${entity}`}>{f.label}</label>
                      </div>
                    </div>
                  );
                }
                if (f.type === "select") {
                  return (
                    <div className="form-group" key={f.key}>
                      <label>{f.label}</label>
                      <select
                        className="form-input"
                        value={current[f.key] || (f.options && f.options[0]?.value) || ""}
                        onChange={(e) => setCurrent({ ...current, [f.key]: e.target.value })}
                      >
                        {f.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return (
                  <div className="form-group" key={f.key}>
                    <label>{f.label}</label>
                    {f.type === "textarea" ? (
                      f.label.includes("Markdown") ? (
                        <MarkdownTextarea value={current[f.key] || ""} onChange={(val) => setCurrent({ ...current, [f.key]: val })} rows={8} />
                      ) : (
                        <textarea className="form-input" rows={4} value={current[f.key] || ""} onChange={(e) => setCurrent({ ...current, [f.key]: e.target.value })} />
                      )
                    ) : f.type === "number" ? (
                      <input className="form-input" type="number" value={current[f.key] ?? ""} onChange={(e) => setCurrent({ ...current, [f.key]: e.target.value === "" ? "" : Number(e.target.value) })} />
                    ) : (
                      <input className="form-input" value={current[f.key] || ""} onChange={(e) => setCurrent({ ...current, [f.key]: e.target.value })} placeholder={f.type === "tags" ? "Comma-separated values" : ""} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <HiOutlineCheckCircle size={16} /> {modal === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════ Field Definitions ═══════════ */
const projectFields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  {
    key: "category",
    label: "Kategori Proyek",
    type: "select",
    options: [
      { label: "Web Development", value: "web" },
      { label: "UI/UX Design", value: "ui_ux" },
      { label: "Mobile App", value: "mobile" },
      { label: "Lainnya (Other)", value: "other" },
    ],
  },
  { key: "description", label: "Description", type: "textarea" },
  { key: "content", label: "Detailed Content (Markdown)", type: "textarea" },
  { key: "imageUrl", label: "Project Image", type: "image" },
  { key: "liveUrl", label: "Live URL (Web)", type: "text" },
  { key: "githubUrl", label: "GitHub URL (Source Code)", type: "text" },
  { key: "figmaUrl", label: "Figma Prototype URL (UI/UX)", type: "text" },
  { key: "behanceUrl", label: "Behance / Case Study URL (UI/UX)", type: "text" },
  { key: "technologies", label: "Technologies", type: "tags" },
  { key: "featured", label: "Featured", type: "checkbox" },
  { key: "order", label: "Urutan / Sort Order (Urutan 1 = Proyek Utama / Hero Spotlight)", type: "number" },
];

const experienceFields: FieldDef[] = [
  { key: "position", label: "Position", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "logoUrl", label: "Company Logo", type: "image" },
  { key: "location", label: "Location", type: "text" },
  { key: "startDate", label: "Start Date (YYYY-MM)", type: "text" },
  { key: "endDate", label: "End Date (YYYY-MM)", type: "text" },
  { key: "current", label: "Currently Working Here", type: "checkbox" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "skills", label: "Skills", type: "tags" },
  { key: "order", label: "Sort Order", type: "number" },
];

const organizationFields: FieldDef[] = [
  { key: "organization", label: "Organization", type: "text" },
  { key: "role", label: "Role/Position", type: "text" },
  { key: "logoUrl", label: "Organization Logo", type: "image" },
  { key: "location", label: "Location", type: "text" },
  { key: "startDate", label: "Start Date (YYYY-MM)", type: "text" },
  { key: "endDate", label: "End Date (YYYY-MM)", type: "text" },
  { key: "current", label: "Currently Active", type: "checkbox" },
  { key: "description", label: "Description (Markdown)", type: "textarea" },
  { key: "order", label: "Sort Order", type: "number" },
];

const academicFields: FieldDef[] = [
  { key: "institution", label: "Institution", type: "text" },
  { key: "logoUrl", label: "Institution Logo", type: "image" },
  { key: "degree", label: "Degree", type: "text" },
  { key: "field", label: "Field of Study", type: "text" },
  { key: "startYear", label: "Start Year", type: "number" },
  { key: "endYear", label: "End Year", type: "number" },
  { key: "gpa", label: "GPA", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "order", label: "Sort Order", type: "number" },
];

const blogFields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "slug", label: "Slug (auto-generated if empty)", type: "text" },
  { key: "coverImageUrl", label: "Cover Image", type: "image" },
  { key: "excerpt", label: "Excerpt", type: "textarea" },
  { key: "content", label: "Content (Markdown)", type: "textarea" },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "published", label: "Published", type: "checkbox" },
];

const awardFields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "issuer", label: "Issuer", type: "text" },
  { key: "imageUrl", label: "Award Image", type: "image" },
  { key: "year", label: "Year", type: "number" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "credentialUrl", label: "Credential URL", type: "text" },
  { key: "order", label: "Sort Order", type: "number" },
];

/* ═══════════ Login Screen Component ═══════════ */
function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem("token", res.token);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-primary)", padding: 24 }}>
      <div className="admin-table-wrap" style={{ width: "100%", maxWidth: 400, padding: 32, boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6 }}>Admin Sign In</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Enter credentials to manage your portfolio</p>
        </div>
        
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-sm)", padding: "10px 14px", color: "#ef4444", fontSize: "0.85rem", marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
