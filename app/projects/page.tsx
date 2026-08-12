import type { Metadata } from "next";
import Projects from "@/components/Projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abduladaner.com";

export const metadata: Metadata = {
  title: "Proiecte — Portfolio Projects",
  description:
    "Proiecte recente realizate de Abdula Daner: Hotel SaaS Suite, Darkroom Projection Mapping, Renderi 3D Arhitectură și MPC Playground.",
  alternates: {
    canonical: `${siteUrl}/projects`,
    languages: {
      "ro-RO": `${siteUrl}/projects`,
      "en-US": `${siteUrl}/projects`,
      "x-default": `${siteUrl}/projects`,
    },
  },
  openGraph: {
    title: "Proiecte & Portofoliu — Abdula Daner",
    description:
      "Portofoliu de aplicații web, produse SaaS, experiențe interactive și randări arhitecturale 3D produse de Abdula Daner.",
    url: `${siteUrl}/projects`,
  },
};

export default function ProjectsPage() {
  return <Projects />;
}
