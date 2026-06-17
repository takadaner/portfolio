"use client";

import Reveal from "./Reveal";

type SectionHeaderProps = {
  label: string;
  title1: string;
  title2: string;
  subtitle: string;
  align?: "center" | "left";
};

export default function SectionHeader({
  label,
  title1,
  title2,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <Reveal className={isCenter ? "text-center" : "text-left"}>
      <span className="inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs text-muted">
        {label}
      </span>
      <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        <span className="text-foreground">{title1} </span>
        <span className="text-muted-2">{title2}</span>
      </h2>
      <p
        className={`mt-4 max-w-xl text-base text-muted ${
          isCenter ? "mx-auto" : ""
        }`}
      >
        {subtitle}
      </p>
    </Reveal>
  );
}
