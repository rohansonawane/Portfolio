import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import TawkToChat from "@/components/TawkToChat";
import { GoogleTagManager } from '@next/third-parties/google'

// Components
import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";
import StairTransition from "@/components/StairTransition";

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  weight: ["100","200","300","400","500","600","700","800"],
  variable: '--font-jetbrainsMono'
 });

export const metadata = {
  title: "Rohan Sonawane | Portfolio",
  description: "Full Stack Software Developer | AI / ML | Docker, CI/CD, Jenkins | PHP, Python, JavaScript (React, Node, Next) | WordPress | UI/UX Designer | Blender, Unity Developer | API Integration Specialist | Testing",
  keywords: ["Full Stack Developer", "Software Engineer", "Web Development", "UI/UX Design", "AI/ML", "React", "Next.js", "Node.js", "Python", "PHP"],
  authors: [{ name: "Rohan Sonawane" }],
  creator: "Rohan Sonawane",
  publisher: "Rohan Sonawane",
  robots: "index, follow",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon.png',
    },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rohansonawane.tech",
    title: "Rohan Sonawane | Portfolio",
    description: "Full Stack Software Developer | AI / ML | Docker, CI/CD, Jenkins | PHP, Python, JavaScript (React, Node, Next) | WordPress | UI/UX Designer | Blender, Unity Developer | API Integration Specialist | Testing",
    siteName: "Rohan Sonawane Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Sonawane | Portfolio",
    description: "Full Stack Software Developer | AI / ML | Docker, CI/CD, Jenkins | PHP, Python, JavaScript (React, Node, Next) | WordPress | UI/UX Designer | Blender, Unity Developer | API Integration Specialist | Testing",
    creator: "@rohansonawane",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <GoogleTagManager gtmId="GTM-5727CZ8R" />
      <body className={jetbrainsMono.variable}>
        <ErrorBoundary>
          <Header />
          <StairTransition />
          <PageTransition>
            {children}
          </PageTransition>
        </ErrorBoundary>
        <TawkToChat />
      </body>
    </html>
  );
}
