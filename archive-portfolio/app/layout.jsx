import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

// Components
import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";
import StairTransition from "@/components/StairTransition";

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrainsMono',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'monospace']
})

export const metadata = {
  title: 'Rohan Sonawane | Full Stack Developer',
  description: 'Full Stack Developer specializing in React, Next.js, and Node.js. Building modern web applications with a focus on performance and user experience.',
  keywords: 'Full Stack Developer, React, Next.js, Node.js, Web Development',
  authors: [{ name: 'Rohan Sonawane' }],
  creator: 'Rohan Sonawane',
  publisher: 'Rohan Sonawane',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rohansonawane.tech'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rohan Sonawane | Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Next.js, and Node.js. Building modern web applications with a focus on performance and user experience.',
    url: 'https://rohansonawane.tech',
    siteName: 'Rohan Sonawane Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rohan Sonawane Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohan Sonawane | Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Next.js, and Node.js. Building modern web applications with a focus on performance and user experience.',
    images: ['/og-image.png'],
    creator: '@rohansonawane',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <Script
          id="gtm-script"
          strategy="worker"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtm(){dataLayer.push(arguments);}
              gtm('js', new Date());
              gtm('config', 'GTM-5727CZ8R', {
                'send_page_view': false
              });
            `,
          }}
        />
        <Script
          id="gtm-load"
          strategy="worker"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5727CZ8R"
        />
      </head>
      <body className={`${jetbrainsMono.className} antialiased`}>
        <ErrorBoundary>
          <Header />
          <StairTransition />
          <PageTransition>
            {children}
          </PageTransition>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
