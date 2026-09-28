import About from "@/components/About";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/about", params?.lang, {
    ro: {
      title: "Despre Mine — Abdula Daner",
      description: "Află despre experiența, competențele tehnice și modul de lucru al lui Abdula Daner.",
    },
    en: {
      title: "About — Abdula Daner",
      description: "Learn about Abdula Daner’s experience, technical skills, and approach to building digital products.",
    },
  });
}

export default function AboutPage() {
  return <About />;
}
