import CookieNotice from "@/components/CookieNotice";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { searchParams?: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  return createPageMetadata("/cookies", params?.lang, {
    ro: {
      title: "Cookie-uri și confidențialitate",
      description: "Află cum sunt folosite cookie-ul de limbă și măsurătorile de performanță pe daner.app.",
    },
    en: {
      title: "Cookies & privacy",
      description: "Learn how the language preference cookie and performance measurements are used on daner.app.",
    },
  });
}

export default function CookiesPage() {
  return <CookieNotice />;
}
