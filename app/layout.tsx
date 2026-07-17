import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AnimationProvider } from "@/lib/AnimationContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import CustomCursor from "@/components/CustomCursor";
import ScrollBehavior from "@/components/ScrollBehavior";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Abdula Daner — Full-Stack Developer & Tech Builder",
  description:
    "Aplicații web și automatizări AI — boți WhatsApp, unelte pentru hoteluri și jocuri web. De Abdula Daner.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>
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
