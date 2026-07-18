"use client";
import React, { useRef, useCallback } from "react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: any[];
  duration?: number;
  onSpotlight?: (item: any | null) => void;
}) => {
  return (
    <div className={props.className}>
      <div
        className="flex flex-col gap-6 pb-6 bg-background animate-marquee-y"
        style={{ animationDuration: `${props.duration || 10}s` }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ quote, image, author, role }, i) => (
                <TestimonialCard
                  key={i}
                  quote={quote}
                  image={image}
                  author={author}
                  role={role}
                  onSpotlight={props.onSpotlight}
                />
              ))}
            </React.Fragment>
          )),
        ]}
      </div>
    </div>
  );
};

function TestimonialCard({
  quote,
  image,
  author,
  role,
  onSpotlight,
}: {
  quote: string;
  image: string;
  author: string;
  role: string;
  onSpotlight?: (item: any | null) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!onSpotlight) return;
    timerRef.current = setTimeout(() => {
      onSpotlight({ quote, image, author, role });
    }, 350);
  }, [onSpotlight, quote, image, author, role]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onSpotlight?.(null);
  }, [onSpotlight]);

  return (
    <div
      className="p-10 rounded-3xl border border-line shadow-lg shadow-black/10 bg-surface max-w-xs w-full cursor-pointer transition-all duration-300 hover:border-foreground/30 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-foreground/90">{quote}</div>
      <div className="flex items-center gap-3 mt-5">
        <img
          width={40}
          height={40}
          src={image}
          alt={author}
          className="h-10 w-10 rounded-full object-cover border border-line"
        />
        <div className="flex flex-col">
          <div className="font-medium tracking-tight leading-5 text-foreground">{author}</div>
          <div className="text-xs text-muted leading-5 tracking-tight">{role}</div>
        </div>
      </div>
    </div>
  );
}
