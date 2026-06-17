import type { Metadata } from "next";
import Experience from "@/components/Experience";

export const metadata: Metadata = {
  title: "Experiență — Abdula Daner",
  description: "Parcursul meu profesional și ce construiesc acum.",
};

export default function ExperiencePage() {
  return <Experience />;
}
