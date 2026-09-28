import NightConciergeDemo from "@/components/NightConciergeDemo";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/projects/night-concierge", params?.lang, {
    ro: {
      title: "Night Concierge — Concept interactiv",
      description: "Un concept independent de concierge digital pentru hoteluri mici, cu un demo conversațional simulat.",
    },
    en: {
      title: "Night Concierge — Interactive Concept",
      description: "An independent digital concierge concept for small hotels, with a simulated conversational demo.",
    },
  });
}

export default function NightConciergePage() {
  return <NightConciergeDemo />;
}
