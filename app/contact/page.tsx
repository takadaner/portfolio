import Contact from "@/components/Contact";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/contact", params?.lang, {
    ro: {
      title: "Contact — Hai să lucrăm împreună",
      description: "Contactează-l pe Abdula Daner pentru dezvoltare web, automatizări AI și consultanță software.",
    },
    en: {
      title: "Contact — Let’s Work Together",
      description: "Contact Abdula Daner about web development, AI automation, and software consulting.",
    },
  });
}

export default function ContactPage() {
  return <Contact />;
}
