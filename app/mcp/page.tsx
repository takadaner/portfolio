import type { Metadata } from "next";
import MCPPage from "@/components/mcp/MCPPage";

export const metadata: Metadata = {
  title: "MPC Playground — Interactive AKAI Sampler",
  description:
    "Cântă piese reprezentative direct în browser. Un AKAI MPC2000XL virtual interactiv cu kituri de tobe și eșantioane audio de Abdula Daner.",
  alternates: {
    canonical: "/mcp",
  },
  openGraph: {
    title: "MPC Playground — The Internet of Music | Abdula Daner",
    description:
      "Interactive Web Audio AKAI MPC2000XL sampler simulator inside your browser.",
    url: "/mcp",
  },
};

export default function MCPRoute() {
  return <MCPPage />;
}
