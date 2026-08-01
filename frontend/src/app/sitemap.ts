import type { MetadataRoute } from 'next'
import { api } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://erikosyah.my.id'

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#education`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Blog posts
  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const blogs = await api.getBlogs('en')
    if (Array.isArray(blogs)) {
      blogUrls = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    console.error('Failed to fetch blogs for sitemap')
  }

  return [...mainPages, ...blogUrls]
}
