import type { Metadata } from 'next'
import '@/app/globals.css'
import { Poppins } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'react-hot-toast'

import Header from '@/components/Header'
import LayoutWrapper from '@/components/LayoutWrapper'
import { AuthProvider } from '@/context/AuthContext'
import AuthGate from '@/components/AuthGate'

// Metadata
export const metadata: Metadata = {
  title: 'QuickGigs',
  description: 'Freelancing Platform for Students and Beginners.',
  icons: {
    icon: ['/favicon.ico?v=4'],
  },
}

// Font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <AuthGate>
            <Header />

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3500,
                style: { zIndex: 9999 },
              }}
            />

            <NextTopLoader
              color="#000000"
              height={4}
              crawl
              showSpinner={false}
              speed={300}
            />

            <main>
              <LayoutWrapper>{children}</LayoutWrapper>
            </main>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  )
}
