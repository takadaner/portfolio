import type { Metadata } from "next";
import DarkroomProject from "@/components/DarkroomProject";

export const metadata: Metadata = {
  title: "Darkroom — Projection Mapping",
  description:
    "Instalație imersivă de projection mapping formată din 5 camere tematice: Portal, Odyssey, Link, Alter Ego și Syntesys. Proiect vizual și auditiv interactiv.",
  alternates: {
    canonical: "/projects/darkroom",
  },
  openGraph: {
    title: "Darkroom — Projection Mapping & Immersive Art | Abdula Daner",
    description:
      "Experiență vizuală imersivă compusă din 5 camere conceptuale cu proiecții video sincronizate și sound design dinamic.",
    url: "/projects/darkroom",
  },
};

export default function DarkroomPage() {
  return <DarkroomProject />;
}
