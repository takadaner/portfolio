"use client";

import ShinyText from "@/components/ShinyText";

type LogoProps = {
  /** Wordmark text shown next to the mark (e.g. "Abdula Daner"). */
  label?: string;
  /** Render only the badge mark, without the wordmark. */
  markOnly?: boolean;
  /** Pixel size of the square badge mark. */
  size?: number;
  /** Render the wordmark with the animated shiny sweep. */
  shiny?: boolean;
  className?: string;
};

/**
 * Brand mark inspired by the Polo (Framebase) wordmark-with-icon style:
 * a rounded badge using the same dark gradient + hairline border as the
 * site's CTA buttons, with a clean white "A" monogram and a warm accent dot.
 */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="logoBadge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#242424" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
      </defs>
      <rect
        x="0.75"
        y="0.75"
        width="26.5"
        height="26.5"
        rx="8"
        fill="url(#logoBadge)"
        stroke="#2c2c2c"
        strokeWidth="1.5"
      />
      {/* "A" monogram */}
      <path
        d="M8.5 19.75 L14 8 L19.5 19.75"
        stroke="#f5f5f5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7 15 H17.3"
        stroke="#f5f5f5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* warm accent dot — echoes the theme accent colour */}
      <circle cx="14" cy="6.4" r="1.7" fill="#b9b1a4" />
    </svg>
  );
}

export default function Logo({
  label,
  markOnly = false,
  size = 24,
  shiny = false,
  className = "",
}: LogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {!markOnly && label && (
        shiny ? (
          <ShinyText
            text={label}
            speed={3}
            delay={1}
            color="#e5e5e5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo
            className="font-semibold tracking-tight"
          />
        ) : (
          <span className="font-semibold tracking-tight">{label}</span>
        )
      )}
    </span>
  );
}
