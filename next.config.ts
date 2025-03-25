import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'randomuser.me' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'placehold.co' }
    ],
  },
  // Add any other configuration options below
}

export default nextConfig
