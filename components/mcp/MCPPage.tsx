"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KEY_ROWS, MPC_SONGS, type MPCSong } from "@/lib/mcp-songs";
import SongLibrary from "./SongLibrary";
import MPCMachine from "./MPCMachine";
import "./mcp.css";

// ─── Top-level MPC Page Client Component ─────────────────────────────────────
// Manages the two-view state machine:
//   "library"  → SongLibrary  (pick a song)
//   "player"   → MPCMachine   (play it)
// ─────────────────────────────────────────────────────────────────────────────

export default function MCPPage() {
  const [selectedSong, setSelectedSong] = useState<MPCSong | null>(null);

  // Escape returns to the library
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSong(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!selectedSong ? (
        <motion.div
          key="library"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <SongLibrary songs={MPC_SONGS} onSelect={setSelectedSong} />
        </motion.div>
      ) : (
        <motion.div
          key="player"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mpc-stage mpc-stage-player"
          data-skin={selectedSong.skin}
        >
          {/* Ambient background layers */}
          <div className="mpc-stage-grid" aria-hidden />
          <div className="mpc-stage-spotlight" aria-hidden />
          <div className="mpc-stage-grain" aria-hidden />

          <div className="mpc-player-content">
            {/* ── Top bar ── */}
            <div className="mpc-player-topbar">
              <button
                className="mpc-back-btn"
                onClick={() => setSelectedSong(null)}
                type="button"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M9 2L4 7L9 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Library
                <span className="mpc-back-esc" aria-hidden>ESC</span>
              </button>

              <div className="mpc-now-playing">
                <span className="mpc-now-dot" aria-hidden />
                {selectedSong.title.toUpperCase()}
                <span className="mpc-now-sep" aria-hidden>—</span>
                {selectedSong.artist.toUpperCase()}
              </div>

              <div className="mpc-key-hint">
                <span className="mpc-key-chip">16 KEYS</span>
                live keyboard
              </div>
            </div>

            {/* ── Decorative row — compass + line + VU meter ── */}
            <div className="mpc-deco-row">
              <div className="mpc-compass">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 2L26 14L38 20L26 26L20 38L14 26L2 20L14 14Z"
                        stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
                  <path d="M20 8L24 16L32 20L24 24L20 32L16 24L8 20L16 16Z"
                        stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
                </svg>
                <div className="mpc-deco-dashes">
                  <span>— —</span>
                </div>
              </div>

              <div className="mpc-deco-line" />

              <div className="mpc-vu-meter">
                <svg width="60" height="36" viewBox="0 0 60 36" fill="none">
                  <path d="M8 30 Q30 4 52 30" stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1" fill="none" />
                  {Array.from({ length: 11 }, (_, i) => {
                    const angle = -180 + i * 18;
                    const rad = (angle * Math.PI) / 180;
                    const cx = 30, cy = 32, r1 = 22, r2 = 25;
                    const x1 = cx + r1 * Math.cos(rad);
                    const y1 = cy + r1 * Math.sin(rad);
                    const x2 = cx + r2 * Math.cos(rad);
                    const y2 = cy + r2 * Math.sin(rad);
                    return (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={i > 8 ? "rgba(220,50,30,0.6)" : "rgba(255,255,255,0.3)"}
                            strokeWidth="1" />
                    );
                  })}
                  <line x1="30" y1="30" x2="18" y2="14"
                        stroke="#e8650a" strokeWidth="1.5"
                        strokeLinecap="round" />
                  <circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.3)" />
                </svg>
              </div>
            </div>

            {/* ── MPC Machine ── */}
            <div className="mpc-machine-wrap">
              <MPCMachine song={selectedSong} />
            </div>

            {/* ── Song info chips ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mpc-info-chips"
            >
              <span className="mpc-info-chip">
                <strong>{selectedSong.bpm}</strong> BPM
              </span>
              <span className="mpc-info-chip">
                BANK <strong>{selectedSong.padBank}</strong>
              </span>
              <span className="mpc-info-chip">
                <strong>16</strong> PADS
              </span>
              <span className="mpc-info-chip">{selectedSong.model}</span>
            </motion.div>

            {/* ── Full key map ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mpc-player-keymap"
            >
              <span className="mpc-hint-label">Tap the pads or play your keyboard</span>
              <div className="mpc-keymap">
                {KEY_ROWS.map((row, ri) => (
                  <div key={ri} className="mpc-keymap-group">
                    {row.map((k) => (
                      <span key={k} className="mpc-keycap">
                        {k.toUpperCase()}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
