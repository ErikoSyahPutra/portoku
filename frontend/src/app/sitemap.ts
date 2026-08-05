import type { MetadataRoute } from 'next'
import { api } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://erikosyah.my.id'

  // Main pages (clean URLs without fragment hashes)
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // Dynamic Blog Posts
  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const blogs = await api.getBlogs('en')
    if (Array.isArray(blogs)) {
      blogUrls = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.createdAt ? new Date(blog.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    console.error('Failed to fetch blogs for sitemap')
  }

  // Dynamic Projects
  let projectUrls: MetadataRoute.Sitemap = []
  try {
    const projects = await api.getProjects('en')
    if (Array.isArray(projects)) {
      projectUrls = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    console.error('Failed to fetch projects for sitemap')
  }

  return [...mainPages, ...blogUrls, ...projectUrls]
}
