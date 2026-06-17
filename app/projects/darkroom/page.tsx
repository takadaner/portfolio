import type { Metadata } from "next";
import DarkroomProject from "@/components/DarkroomProject";

export const metadata: Metadata = {
  title: "Darkroom — Projection Mapping | Abdula Daner",
  description: "Instalație imersivă de projection mapping formată din 5 camere tematice: Portal, Odyssey, Link, Alter Ego și Syntesys.",
};

export default function DarkroomPage() {
  return <DarkroomProject />;
}
