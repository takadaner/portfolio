import Websites from "@/components/Websites";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/websites", params?.lang, {
    ro: {
      title: "Site-uri pentru hoteluri și ansambluri rezidențiale",
      description: "Un site complet pentru hotel, pensiune sau ansamblu rezidențial, ca în demo, livrat în 10 zile. Română și engleză. Ofertă de lansare: 690 € + 29 €/lună.",
    },
    en: {
      title: "Websites for hotels and residential developments",
      description: "A complete website for your hotel, guesthouse or residential development, like the demo, delivered in 10 days. Romanian and English. Launch offer: 690 € + 29 €/month.",
    },
  });
}

export default function WebsitesPage() {
  return <Websites />;
}
