"use client";

import { useCallback } from "react";
import type { MPCPad as MPCPadType } from "@/lib/mcp-songs";

interface MPCPadProps {
  pad: MPCPadType;
  isHit: boolean;
  onTrigger: (padId: number) => void;
}

// ─── Individual MPC Pad ───────────────────────────────────────────────────────
// Displays keyboard shortcut (top-left) + sample label (bottom).
// Flashes with CSS animation on hit, triggered by mouse or keyboard.
// ─────────────────────────────────────────────────────────────────────────────

export default function MPCPad({ pad, isHit, onTrigger }: MPCPadProps) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      onTrigger(pad.id);
    },
    [pad.id, onTrigger]
  );

  return (
    <div
      className={`mpc-pad${isHit ? " hit" : ""}`}
      onPointerDown={handlePointerDown}
      role="button"
      tabIndex={-1}
      aria-label={`Pad ${pad.id}: ${pad.label} (key: ${pad.key.toUpperCase()})`}
    >
      <span className="mpc-pad-key">{pad.key.toUpperCase()}</span>
      <span className="mpc-pad-label">{pad.label}</span>
    </div>
  );
}
