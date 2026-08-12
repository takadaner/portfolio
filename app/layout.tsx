import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AnimationProvider } from "@/lib/AnimationContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import CustomCursor from "@/components/CustomCursor";
import ScrollBehavior from "@/components/ScrollBehavior";
import JsonLd from "@/components/JsonLd";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abduladaner.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abdula Daner — Full-Stack Developer & Tech Builder",
    template: "%s | Abdula Daner",
  },
  description:
    "Official website of Abdula Daner — Full-Stack Developer & Tech Builder based in Constanța, Romania. Web Development, AI Automations, WhatsApp Bots & Hotel SaaS Software.",
  keywords: [
    "Abdula Daner",
    "Daner Abdula",
    "Abdula Daner Developer",
    "Abdula Daner Full-Stack",
    "Full-Stack Developer Romania",
    "Dezvoltator Web Romania",
    "Next.js Developer",
    "React Developer",
    "Python Developer",
    "Automatizari AI",
    "WhatsApp Bot UI",
    "Hotel SaaS Suite",
    "Render 3D Arhitectura",
    "Software Hoteluri",
    "Programator Constanta",
  ],
  authors: [{ name: "Abdula Daner", url: siteUrl }],
  creator: "Abdula Daner",
  publisher: "Abdula Daner",
  alternates: {
    canonical: siteUrl,
    languages: {
      "ro-RO": siteUrl,
      "en-US": siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    alternateLocale: ["en_US"],
    url: siteUrl,
    title: "Abdula Daner — Full-Stack Developer & Tech Builder",
    description:
      "Aplicații web rapide, automatizări AI și soluții digitale dedicate. Vezi proiectele și serviciile oferite de Abdula Daner.",
    siteName: "Abdula Daner",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Abdula Daner — Full-Stack Developer & Tech Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdula Daner — Full-Stack Developer & Tech Builder",
    description:
      "Dezvoltare web, automatizări AI și software dedicat pentru afacerea ta.",
    images: [`${siteUrl}/opengraph-image`],
    creator: "@takadaner",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <JsonLd />
        <LanguageProvider>
          <AnimationProvider>
            <CustomCursor />
            <ScrollBehavior />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <BottomNav />
          </AnimationProvider>
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
