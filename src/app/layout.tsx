import type { Metadata } from "next";
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { Inter } from 'next/font/google';
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "RateDeezAir - Rate Air University Professors",
  description: "Anonymous professor ratings and reviews for Air University Islamabad students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
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
