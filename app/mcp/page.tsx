import type { Metadata } from "next";
import MCPPage from "@/components/mcp/MCPPage";

export const metadata: Metadata = {
  title: "MPC Playground — The Internet of Music",
  description:
    "Play iconic tracks as instruments in your browser. An interactive AKAI MPC2000XL powered by Growthr.",
};

export default function MCPRoute() {
  return <MCPPage />;
}
