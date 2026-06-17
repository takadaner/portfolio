import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Abdula Daner",
  description: "Ai un proiect sau o idee? Scrie-mi și revin în maximum 48 de ore.",
};

export default function ContactPage() {
  return <Contact />;
}
