"use client";

import { useEffect, useState } from "react";
import type { MPCSong } from "@/lib/mcp-songs";

interface MPCScreenProps {
  song: MPCSong;
  isLoading?: boolean;
  loadedCount?: number;
}

// ─── LCD Screen Component ─────────────────────────────────────────────────────
// Renders the green phosphor-CRT-style display on the MPC with a blinking
// cursor and a live sample-load status readout.
// ─────────────────────────────────────────────────────────────────────────────

export default function MPCScreen({ song, isLoading, loadedCount }: MPCScreenProps) {
  const [tick, setTick] = useState(0);

  // Blinking cursor effect
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 800);
    return () => clearInterval(id);
  }, []);

  const cursor = tick % 2 === 0 ? "█" : " ";
  const status = isLoading
    ? "LOAD…"
    : loadedCount && loadedCount > 0
      ? `SMP:${String(loadedCount).padStart(2, "0")}`
      : "READY";

  return (
    <div className="mpc-lcd">
      <div className="lcd-line lcd-title">
        {song.title.toUpperCase()}
        <span style={{ opacity: 0.5 }}>{cursor}</span>
      </div>
      <div className="lcd-line">
        {song.artist.toUpperCase().substring(0, 22)} - {song.model}
      </div>
      <div className="lcd-powered-row">
        <div className="lcd-line lcd-dim">
          Bank:{song.padBank} BPM:{song.bpm} [{status}]
        </div>
        <div className="lcd-powered">
          POWERED BY<br />
          <span style={{ color: "#00ff41", textShadow: "0 0 6px rgba(0,255,65,0.6)" }}>
            Growthr
          </span>
        </div>
      </div>
    </div>
  );
}
