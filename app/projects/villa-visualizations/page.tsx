import type { Metadata } from "next";
import VillaVisualizationsProject from "@/components/VillaVisualizationsProject";

export const metadata: Metadata = {
  title: "Villa Visualizations — 3D Architectural Renders",
  description:
    "Randări 3D arhitecturale fotorealiste pentru vile rezidențiale de lux. Concepte vizuale cu schițe suprapuse, planuri de etaj și videoclipuri cinematografice.",
  alternates: {
    canonical: "/projects/villa-visualizations",
  },
  openGraph: {
    title: "Villa Visualizations — 3D Architectural Renders | Abdula Daner",
    description:
      "Visualizări fotorealiste 3D pentru concepte arhitecturale de vile moderne, tururi virtuale și planuri tehnice.",
    url: "/projects/villa-visualizations",
  },
};

export default function VillaVisualizationsPage() {
  return <VillaVisualizationsProject />;
}
