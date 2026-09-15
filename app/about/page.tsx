import type { Metadata } from "next";
import About from "@/components/About";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Despre Mine — About Abdula Daner",
  description:
    "Află mai multe despre Abdula Daner, parcursul profesional în dezvoltare web și automatizări AI, competențele tehnice și testimonialele clienților.",
  alternates: {
    canonical: `${siteUrl}/about`,
    languages: {
      "ro-RO": `${siteUrl}/about`,
      "en-US": `${siteUrl}/about`,
      "x-default": `${siteUrl}/about`,
    },
  },
  openGraph: {
    title: "Despre Mine — About Abdula Daner",
    description:
      "Full-Stack Developer & Tech Builder bazat în Constanța, România. Experiență în React, Next.js, Python, FastAPI și automatizări inteligență artificială.",
    url: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return <About />;
}
