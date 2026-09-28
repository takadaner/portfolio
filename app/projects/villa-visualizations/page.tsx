import VillaVisualizationsProject from "@/components/VillaVisualizationsProject";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/projects/villa-visualizations", params?.lang, {
    ro: {
      title: "Vizualizări de Vilă — Randări Arhitecturale 3D",
      description: "Randări arhitecturale 3D, concepte vizuale și tururi cinematografice pentru vile moderne.",
    },
    en: {
      title: "Villa Visualizations — 3D Architectural Renders",
      description: "3D architectural renders, visual concepts, and cinematic walkthroughs for modern villas.",
    },
  });
}

export default function VillaVisualizationsPage() {
  return <VillaVisualizationsProject />;
}
