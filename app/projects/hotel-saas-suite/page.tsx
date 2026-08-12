import type { Metadata } from "next";
import HotelSaaSProject from "@/components/HotelSaaSProject";

export const metadata: Metadata = {
  title: "Hotel SaaS Suite",
  description:
    "O suită completă de soluții digitale pentru industria ospitalității: WhatsApp Concierge AI, Hotel Websites, Digital Compendium și Review Automator.",
  alternates: {
    canonical: "/projects/hotel-saas-suite",
  },
  openGraph: {
    title: "Hotel SaaS Suite — Soluții Digitale pentru Hoteluri | Abdula Daner",
    description:
      "Automatizări complete pentru recepție și comunicare oaspeți: WhatsApp Concierge cu AI, site-uri de prezentare, compendiu digital și management recenzii.",
    url: "/projects/hotel-saas-suite",
  },
};

export default function HotelSaaSPage() {
  return <HotelSaaSProject />;
}
