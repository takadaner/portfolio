import type { Metadata } from "next";
import HotelSaaSProject from "@/components/HotelSaaSProject";

export const metadata: Metadata = {
  title: "Hotel SaaS Suite | Abdula Daner",
  description: "O suită completă de soluții digitale pentru industria ospitalității: WhatsApp Concierge AI, Hotel Websites, Digital Compendium și Review Automator.",
};

export default function HotelSaaSPage() {
  return <HotelSaaSProject />;
}
