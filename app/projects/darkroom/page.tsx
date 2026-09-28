import DarkroomProject from "@/components/DarkroomProject";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/projects/darkroom", params?.lang, {
    ro: {
      title: "Darkroom — Projection Mapping",
      description: "Instalație imersivă de projection mapping cu cinci camere tematice, vizualuri generative și sound design.",
    },
    en: {
      title: "Darkroom — Projection Mapping",
      description: "An immersive projection-mapping installation with five themed rooms, generative visuals, and sound design.",
    },
  });
}

export default function DarkroomPage() {
  return <DarkroomProject />;
}
