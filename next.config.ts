import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'randomuser.me' }
    ],
  },
  // Add any other configuration options below
}

export default nextConfig
