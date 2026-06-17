import type { Metadata } from "next";
import Projects from "@/components/Projects";

export const metadata: Metadata = {
  title: "Proiecte — Abdula Daner",
  description: "O selecție din proiectele la care am lucrat recent.",
};

export default function ProjectsPage() {
  return <Projects />;
}
