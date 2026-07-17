import type { Metadata } from "next";
import Services from "@/components/Services";
import LockScroll from "@/components/LockScroll";

export const metadata: Metadata = {
  title: "Servicii — Abdula Daner",
  description:
    "Servicii de dezvoltare web, automatizări AI și software pentru hoteluri.",
};

export default function ServicesPage() {
  return (
    <>
      <LockScroll />
      <Services />
    </>
  );
}
