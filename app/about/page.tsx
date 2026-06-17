import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "Despre — Abdula Daner",
  description: "O scurtă prezentare despre mine și despre ce construiesc.",
};

export default function AboutPage() {
  return <About />;
}
