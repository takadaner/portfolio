import Projects from "@/components/Projects";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/projects", params?.lang, {
    ro: {
      title: "Proiecte — Portofoliu",
      description: "Proiecte publicate de Abdula Daner: aplicații web, produse SaaS, experiențe interactive și randări arhitecturale 3D.",
    },
    en: {
      title: "Projects — Portfolio",
      description: "Published work by Abdula Daner: web applications, SaaS products, interactive experiences, and 3D architectural visualization.",
    },
  });
}

export default function ProjectsPage() {
  return <Projects />;
}
