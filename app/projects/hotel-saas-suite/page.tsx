import HotelSaaSProject from "@/components/HotelSaaSProject";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/projects/hotel-saas-suite", params?.lang, {
    ro: {
      title: "Hotel SaaS Suite",
      description: "Soluții digitale pentru ospitalitate: concierge AI, site-uri hoteliere, compendiu digital și automatizarea recenziilor.",
    },
    en: {
      title: "Hotel SaaS Suite",
      description: "Digital hospitality tools: AI concierge, hotel websites, digital compendium, and review automation.",
    },
  });
}

export default function HotelSaaSPage() {
  return <HotelSaaSProject />;
}
