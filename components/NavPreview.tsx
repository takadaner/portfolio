"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  Server,
  Monitor,
  Bot,
  Wrench,
  Database,
  Users,
  ArrowUpRight,
  Star,
  Globe,
  Hotel,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const skillIcons: Record<string, LucideIcon> = {
  "Frontend": Monitor,
  "Backend": Server,
  "Database & Cloud": Database,
  "AI & Automation": Bot,
  "Tools": Wrench,
  "Soft Skills": Users,
};

const serviceIcons: Record<string, LucideIcon> = {
  globe: Globe,
  bot: Bot,
  hotel: Hotel,
  server: Server,
  palette: Palette,
};

/** Routes that have a hover preview — the navbar only renders the
    dropdown shell for these, avoiding an empty box on other links. */
export const PREVIEW_ROUTES = [
  "/services",
  "/skills",
  "/projects",
  "/testimonials",
  "/about",
];

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-2">
          {title}
        </span>
        <ArrowUpRight size={14} className="text-muted-2" />
      </div>
      {children}
    </div>
  );
}

/** Hover preview shown under each nav link. `label` is the localized link text. */
export default function NavPreview({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const { dict } = useLanguage();

  switch (href) {
    case "/services":
      return (
        <Shell title={label}>
          <div className="flex flex-col gap-2">
            {dict.services.items.map((s: any) => {
              const Icon = serviceIcons[s.icon] ?? Globe;
              return (
                <div
                  key={s.title}
                  className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-2 px-3 py-2"
                >
                  <Icon size={15} className="shrink-0 text-muted" />
                  <span className="truncate text-xs font-medium">{s.title}</span>
                </div>
              );
            })}
          </div>
        </Shell>
      );

    case "/skills":
      return (
        <Shell title={label}>
          <div className="grid grid-cols-2 gap-2">
            {dict.skills.categories.map((c: any) => {
              const Icon = skillIcons[c.category] ?? Server;
              return (
                <div
                  key={c.category}
                  className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-2.5 py-2"
                >
                  <Icon size={15} className="shrink-0 text-muted" />
                  <span className="truncate text-xs font-medium">{c.category}</span>
                </div>
              );
            })}
          </div>
        </Shell>
      );


    case "/projects":
      return (
        <Shell title={`${label} · ${dict.projects.items.length}`}>
          <div className="grid grid-cols-3 gap-2">
            {dict.projects.items.slice(0, 3).map((p) => (
              <div
                key={p.title}
                className="overflow-hidden rounded-lg border border-line"
              >
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  width={400}
                  height={300}
                  className="h-14 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Shell>
      );

    case "/testimonials":
      return (
        <Shell title={label}>
          <div className="flex flex-col gap-2">
            {dict.testimonials.items.slice(0, 2).map((t) => (
              <div
                key={t.author}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2.5"
              >
                <div className="mb-1 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      size={11}
                      className="text-accent"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="line-clamp-2 text-xs leading-snug text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-1.5 text-[11px] text-muted">{t.author}</p>
              </div>
            ))}
          </div>
        </Shell>
      );

    case "/about":
      return (
        <Shell title={label}>
          <div className="flex gap-3">
            <div className="overflow-hidden rounded-lg border border-line">
              <Image
                src="/images/placeholder-portrait.svg"
                alt={dict.about.photoGreeting}
                width={160}
                height={200}
                className="h-24 w-20 object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold">{dict.about.photoGreeting}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">
                {dict.about.photoRole}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {dict.about.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[10px] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Shell>
      );

    default:
      return null;
  }
}
