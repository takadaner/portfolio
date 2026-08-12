import type { Metadata } from "next";
import Hero from "@/components/Hero";
import LockScroll from "@/components/LockScroll";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abduladaner.com";

export const metadata: Metadata = {
  title: "Abdula Daner — Full-Stack Developer & Tech Builder",
  description:
    "Official portfolio of Abdula Daner. High-performance web applications, AI automations, WhatsApp bots, and custom hotel SaaS software.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "ro-RO": siteUrl,
      "en-US": siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: "Abdula Daner — Full-Stack Developer & Tech Builder",
    description:
      "Aplicații web moderne, automatizări AI și soluții digitale construite cu Next.js, React și Python de Abdula Daner.",
    url: siteUrl,
  },
};

export default function Home() {
  return (
    <>
      <LockScroll />
      <Hero />
    </>
  );
}
