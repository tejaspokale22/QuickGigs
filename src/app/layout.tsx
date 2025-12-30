import type { Metadata } from 'next'
import '@/app/globals.css'
import NextTopLoader from 'nextjs-toploader'
import LayoutWrapper from '@/components/LayoutWrapper'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'QuickGigs',
  description: 'Freelancing Platform for Students',
  icons: {
    icon: ['/favicon.ico?v=4'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="vsc-initialized">
        <Header />
        <main>
          <NextTopLoader
            color="#000000"
            initialPosition={0.08}
            crawlSpeed={150}
            height={4}
            crawl={true}
            showSpinner={false}
            easing="ease-in-out"
            speed={300}
            zIndex={1600}
            showAtBottom={false}
          />
          {/* Wrap the main layout inside LayoutWrapper */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </main>
      </body>
    </html>
  )
}
