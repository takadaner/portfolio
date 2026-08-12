import type { Metadata } from "next";
import Services from "@/components/Services";
import LockScroll from "@/components/LockScroll";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abduladaner.com";

export const metadata: Metadata = {
  title: "Servicii — Dezvoltare Web, Automatizări AI & Software",
  description:
    "Servicii profesionale oferite de Abdula Daner: Dezvoltare Web custom (Next.js, React), Automatizări AI (Boți WhatsApp Meta Cloud API) și Hotel SaaS Suite.",
  alternates: {
    canonical: `${siteUrl}/services`,
    languages: {
      "ro-RO": `${siteUrl}/services`,
      "en-US": `${siteUrl}/services`,
      "x-default": `${siteUrl}/services`,
    },
  },
  openGraph: {
    title: "Servicii Web Development & AI Automations — Abdula Daner",
    description:
      "Aplicații web responsive de înaltă performanță, asistenți virtuali AI pe WhatsApp și soluții digitale dedicate pentru industria ospitalității.",
    url: `${siteUrl}/services`,
  },
};

export default function ServicesPage() {
  return (
    <>
      <LockScroll />
      <Services />
    </>
  );
}
