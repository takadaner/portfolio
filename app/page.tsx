import Hero from "@/components/Hero";
import LockScroll from "@/components/LockScroll";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/", params?.lang, {
    ro: {
      title: "Abdula Daner — Full-Stack Developer & Tech Builder",
      description: "Portofoliul oficial al lui Abdula Daner: aplicații web, automatizări AI și software pentru industria hotelieră.",
    },
    en: {
      title: "Abdula Daner — Full-Stack Developer & Tech Builder",
      description: "The official portfolio of Abdula Daner: web applications, AI automation, and software for the hospitality industry.",
    },
  });
}

export default function Home() {
  return <><LockScroll /><Hero /></>;
}
