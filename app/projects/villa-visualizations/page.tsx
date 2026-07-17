import type { Metadata } from "next";
import VillaVisualizationsProject from "@/components/VillaVisualizationsProject";

export const metadata: Metadata = {
  title: "Villa Visualizations — 3D Architectural Renders | Abdula Daner",
  description:
    "Photorealistic 3D architectural visualizations of luxury villas and residences. Concept renders with blueprint overlays, floor plans, and walkthrough videos.",
};

export default function VillaVisualizationsPage() {
  return <VillaVisualizationsProject />;
}
