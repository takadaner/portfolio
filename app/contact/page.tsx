import type { Metadata } from "next";
import Contact from "@/components/Contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abduladaner.com";

export const metadata: Metadata = {
  title: "Contact — Get in Touch",
  description:
    "Ia legătura direct cu Abdula Daner pentru proiecte de dezvoltare web, automatizări AI și consultanță software. Răspuns garantat în 48h.",
  alternates: {
    canonical: `${siteUrl}/contact`,
    languages: {
      "ro-RO": `${siteUrl}/contact`,
      "en-US": `${siteUrl}/contact`,
      "x-default": `${siteUrl}/contact`,
    },
  },
  openGraph: {
    title: "Contact — Abdula Daner | Full-Stack Developer",
    description:
      "Formular de contact direct, email și telefon pentru colaborări cu Abdula Daner.",
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  return <Contact />;
}
