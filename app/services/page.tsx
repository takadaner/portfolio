import Services from "@/components/Services";
import LockScroll from "@/components/LockScroll";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/services", params?.lang, {
    ro: {
      title: "Servicii — Dezvoltare Web, Automatizări AI & Software",
      description: "Dezvoltare web custom, automatizări AI, integrări și soluții digitale pentru industria ospitalității.",
    },
    en: {
      title: "Services — Web Development, AI Automation & Software",
      description: "Custom web development, AI automation, integrations, and digital solutions for hospitality businesses.",
    },
  });
}

export default function ServicesPage() {
  return <><LockScroll /><Services /></>;
}
