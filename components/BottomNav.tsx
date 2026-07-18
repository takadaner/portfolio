"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, LayoutGrid, FolderKanban, Mail, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Spotify-style bottom tab bar — mobile only. Replaces the header burger menu
 * with four primary destinations fixed to the bottom of the viewport.
 */
export default function BottomNav() {
  const { dict } = useLanguage();
  const pathname = usePathname();

  // Hide on immersive full-screen pages
  if (pathname.startsWith("/mcp")) return null;

  const tabs: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/", label: dict.nav.home, icon: Home },
    { href: "/services", label: dict.nav.links[0].label, icon: LayoutGrid },
    { href: "/projects", label: dict.nav.links[1].label, icon: FolderKanban },
    { href: dict.nav.ctaHref, label: dict.nav.cta, icon: Mail },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="flex items-stretch justify-around divide-x divide-line">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-300 ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? "fill-foreground/10" : ""}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
