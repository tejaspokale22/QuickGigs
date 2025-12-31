import type { Metadata } from 'next'
import '@/app/globals.css'
import { Poppins } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import LayoutWrapper from '@/components/LayoutWrapper'
import { AuthProvider } from '@/context/AuthContext'

// App-level metadata
export const metadata: Metadata = {
  title: 'QuickGigs',
  description: 'Freelancing Platform for Students and Beginners.',
  icons: {
    icon: ['/favicon.ico?v=4'],
  },
}

// Google Font configuration
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={poppins.className}>
        <AuthProvider>
          <Header />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                zIndex: 9999,
              },
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
        </AuthProvider>
      </body>
    </html>
  )
}
