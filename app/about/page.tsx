import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "Despre Mine — Abdula Daner",
  description: "O scurtă prezentare despre mine, parcursul meu profesional și ce construiesc acum.",
};

export default function AboutPage() {
  return <About />;
}
