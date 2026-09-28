import MCPPage from "@/components/mcp/MCPPage";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/mcp", params?.lang, {
    ro: {
      title: "MPC Playground — Sampler Interactiv",
      description: "Un sampler AKAI MPC2000XL virtual, construit cu Web Audio și controlabil direct din browser.",
    },
    en: {
      title: "MPC Playground — Interactive Sampler",
      description: "A virtual AKAI MPC2000XL sampler built with Web Audio and playable directly in the browser.",
    },
  });
}

export default function MCPRoute() {
  return <MCPPage />;
}
