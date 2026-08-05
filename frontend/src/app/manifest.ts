import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eriko Syah Putra Friyadi | Full Stack Developer',
    short_name: 'Eriko Portfolio',
    description: 'Full Stack Developer Portfolio showcasing projects, experience, and web development articles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090d16',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
