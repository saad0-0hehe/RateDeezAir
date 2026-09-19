import type { Metadata } from "next";
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { IBM_Plex_Sans } from 'next/font/google';
import Navbar from "@/components/Navbar";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ibm-plex-sans',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rate-deez-air.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'RateDeezAir - Rate Air University Professors',
    template: '%s | RateDeezAir',
  },
  description: 'Anonymous professor ratings and reviews for Air University Islamabad students. Search, rate, and review your professors to help fellow students make informed decisions.',
  keywords: ['Air University', 'professor rating', 'teacher reviews', 'Air University Islamabad', 'RateDeezAir', 'rate my professor', 'AU Islamabad', 'university reviews', 'faculty ratings'],
  authors: [{ name: 'RateDeezAir' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'RateDeezAir',
    title: 'RateDeezAir - Rate Air University Professors',
    description: 'Anonymous professor ratings and reviews for Air University Islamabad students. Search, rate, and review your professors.',
    images: [
      {
        url: `${BASE_URL}/api/og?name=RateDeezAir&dept=Air University Islamabad&designation=Rate Your Professors&rating=0&count=0`,
        width: 1200,
        height: 630,
        alt: 'RateDeezAir - Rate Air University Professors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RateDeezAir - Rate Air University Professors',
    description: 'Anonymous professor ratings and reviews for Air University Islamabad students.',
    images: [`${BASE_URL}/api/og?name=RateDeezAir&dept=Air University Islamabad&designation=Rate Your Professors&rating=0&count=0`],
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
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
};

// Inline script: run before hydration to avoid FOUC (flash of wrong theme)
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('rda-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || (stored === null && prefersDark);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        {/* Theme script — must run before page paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${ibmPlexSans.variable} antialiased`} style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
        <Auth0Provider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </Auth0Provider>
      </body>
    </html>
  );
}
