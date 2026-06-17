"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import Logo from "@/components/Logo";

export default function Footer() {
  const { dict } = useLanguage();

  return (
    <footer className="border-t border-line px-6 py-12">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label={dict.nav.logo} className="text-sm font-semibold">
            <Logo label={dict.nav.logo} size={20} />
          </Link>
          <ul className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            {dict.nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={dict.nav.ctaHref}
                className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
              >
                {dict.nav.cta}
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs text-muted-2">{dict.footer.copyright}</p>
          <p className="text-xs text-muted-2">{dict.footer.built}</p>
        </div>
      </div>
    </footer>
  );
}
