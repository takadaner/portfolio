import type { Metadata } from "next";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Testimoniale — Abdula Daner",
  description: "Câteva cuvinte de la partenerii și clienții cu care am colaborat.",
};

export default function TestimonialsPage() {
  return <Testimonials />;
}
