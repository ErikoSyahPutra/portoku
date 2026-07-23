import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const client = axios.create({ baseURL: API });

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const login = (username: string, pass: string) =>
  client.post("/auth/login", { username, pass }).then((r) => r.data);

// Profile
export const getProfile = () => client.get("/profile").then((r) => r.data);
export const updateProfile = (data: any) => client.put("/profile", data).then((r) => r.data);

// Projects
export const getProjects = () => client.get("/projects").then((r) => r.data);
export const createProject = (data: any) => client.post("/projects", data).then((r) => r.data);
export const updateProject = (id: number, data: any) => client.put(`/projects/${id}`, data).then((r) => r.data);
export const deleteProject = (id: number) => client.delete(`/projects/${id}`).then((r) => r.data);

// Academics
export const getAcademics = () => client.get("/academics").then((r) => r.data);
export const createAcademic = (data: any) => client.post("/academics", data).then((r) => r.data);
export const updateAcademic = (id: number, data: any) => client.put(`/academics/${id}`, data).then((r) => r.data);
export const deleteAcademic = (id: number) => client.delete(`/academics/${id}`).then((r) => r.data);

// Experiences
export const getExperiences = () => client.get("/experiences").then((r) => r.data);
export const createExperience = (data: any) => client.post("/experiences", data).then((r) => r.data);
export const updateExperience = (id: number, data: any) => client.put(`/experiences/${id}`, data).then((r) => r.data);
export const deleteExperience = (id: number) => client.delete(`/experiences/${id}`).then((r) => r.data);

// Blogs
export const getBlogs = () => client.get("/blogs/all").then((r) => r.data);
export const createBlog = (data: any) => client.post("/blogs", data).then((r) => r.data);
export const updateBlog = (id: number, data: any) => client.put(`/blogs/${id}`, data).then((r) => r.data);
export const deleteBlog = (id: number) => client.delete(`/blogs/${id}`).then((r) => r.data);

// Awards
export const getAwards = () => client.get("/awards").then((r) => r.data);
export const createAward = (data: any) => client.post("/awards", data).then((r) => r.data);
export const updateAward = (id: number, data: any) => client.put(`/awards/${id}`, data).then((r) => r.data);
export const deleteAward = (id: number) => client.delete(`/awards/${id}`).then((r) => r.data);

// Organizations
export const getOrganizations = () => client.get("/organizations").then((r) => r.data);
export const createOrganization = (data: any) => client.post("/organizations", data).then((r) => r.data);
export const updateOrganization = (id: number, data: any) => client.put(`/organizations/${id}`, data).then((r) => r.data);
export const deleteOrganization = (id: number) => client.delete(`/organizations/${id}`).then((r) => r.data);

// Image Compression Helper
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    // Only compress standard images (exclude gifs or SVGs to preserve animations/vector paths)
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            // Only use compressed file if it's actually smaller
            resolve(compressedFile.size < file.size ? compressedFile : file);
          },
          "image/jpeg",
          0.8
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

// Upload
export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const fileToUpload = typeof window !== "undefined" ? await compressImage(file) : file;
  const formData = new FormData();
  formData.append("file", fileToUpload);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await client.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};
