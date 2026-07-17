"use client";

import { motion } from "framer-motion";
import { KEY_ROWS, type MPCSong } from "@/lib/mcp-songs";
import "./mcp.css";

interface SongLibraryProps {
  songs: MPCSong[];
  onSelect: (song: MPCSong) => void;
}

// Which mini-thumbnail pads glow, per song — each card gets its own pattern
const LIT_PADS: Record<string, number[]> = {
  runaway: [0, 5, 10, 15],
  father: [1, 4, 11, 14],
  power: [2, 7, 8, 13],
};

// Deterministic equalizer bar heights (%) so SSR and client agree
const EQ_BARS = [34, 62, 48, 88, 55, 72, 40, 95, 60, 78, 45, 66, 52, 84];

// ─── Detailed Mini MPC card thumbnail ─────────────────────────────────────────
// Pixel-accurate miniature of the full AKAI MPC2000XL
function MiniMPC({ song }: { song: MPCSong }) {
  const lit = LIT_PADS[song.slug] ?? [5];
  return (
    <div className="mini-mpc-detailed" data-skin={song.skin}>
      {/* Header bar */}
      <div className="mini-header">
        <span className="mini-akai">AKAI</span>
        <div className="mini-header-right">
          <span className="mini-label-dim">REC GAIN</span>
          <span className="mini-label-dim">MAIN VOLUME</span>
        </div>
      </div>

      <div className="mini-body-layout">
        {/* Left section */}
        <div className="mini-left-section">
          {/* LCD */}
          <div className="mini-lcd-screen">
            <div className="mini-lcd-title">{song.title.toUpperCase()}</div>
            <div className="mini-lcd-info">
              {song.artist.toUpperCase().slice(0, 18)}
            </div>
            <div className="mini-lcd-row">
              <span>Pad Bank: {song.padBank}</span>
              <span className="mini-powered">
                POWERED BY<br />Growthr
              </span>
            </div>
            <div className="mini-lcd-bpm">BPM: {song.bpm}</div>
          </div>

          {/* F buttons row */}
          <div className="mini-f-row">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="mini-f-btn" />
            ))}
          </div>

          {/* Mode buttons */}
          <div className="mini-mode-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="mini-mode-btn" />
            ))}
          </div>

          {/* Jog + cursor row */}
          <div className="mini-jog-row">
            <div className="mini-btn-stack">
              <div className="mini-orange-btn" />
              <div className="mini-gray-btn-sm" />
            </div>
            <div className="mini-jog-wheel" />
            <div className="mini-cursor-pad">
              <div /><div className="mini-arr" /><div />
              <div className="mini-arr" /><div /><div className="mini-arr" />
              <div /><div className="mini-arr" /><div />
            </div>
          </div>

          {/* Transport */}
          <div className="mini-transport-row">
            <div className="mini-transport-btn red" />
            <div className="mini-transport-btn red" />
            <div className="mini-transport-btn" />
            <div className="mini-transport-btn play" />
            <div className="mini-transport-btn" />
          </div>
        </div>

        {/* Right section — pads + knobs */}
        <div className="mini-right-section">
          <div className="mini-knob-row">
            <div className="mini-pad-bank-area">
              <div className="mini-bank-dots">
                {["A", "B", "C", "D"].map((b, i) => (
                  <div key={b} className={`mini-dot ${i === 0 ? "active" : ""}`} />
                ))}
              </div>
            </div>
            <div className="mini-knobs-pair">
              <div className="mini-knob dark" />
              <div className="mini-knob light" />
            </div>
          </div>

          {/* 4×4 pad grid */}
          <div className="mini-pad-grid-detailed">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className={`mini-pad-d${lit.includes(i) ? " active" : ""}`}
                style={lit.includes(i) ? { animationDelay: `${(i % 4) * 0.18}s` } : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Song Library (landing view) ─────────────────────────────────────────────
export default function SongLibrary({ songs, onSelect }: SongLibraryProps) {
  return (
    <div className="mpc-stage mpc-stage-library">
      {/* Ambient background layers */}
      <div className="mpc-stage-grid" aria-hidden />
      <div className="mpc-stage-glow" aria-hidden />
      <div className="mpc-stage-grain" aria-hidden />
      <div className="mpc-stage-watermark" aria-hidden>
        MPC2000XL
      </div>

      <div className="mpc-library-content">
        {/* ── Hero ── */}
        <motion.header
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mpc-library-head"
        >
          <div className="mpc-kicker">
            <span className="mpc-rec-dot" aria-hidden />
            Growthr Sound Lab
            <span className="mpc-kicker-sep" aria-hidden>/</span>
            0{songs.length} machines
          </div>

          <div className="mpc-hero-row">
            <h1 className="mpc-library-hero-title">
              The Internet
              <br />
              <span className="accent">of Music.</span>
            </h1>

            {/* Equalizer decoration */}
            <div className="mpc-eq" aria-hidden>
              {EQ_BARS.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          </div>

          <p className="mpc-hero-copy">
            Touch it. Feel it. Play it. Iconic tracks reborn as instruments you
            play with your hands, right in your browser. No hardware. Every
            device.
          </p>

          <div className="mpc-stats-strip">
            <span>0{songs.length} machines</span>
            <span>{songs.length * 16} pads</span>
            <span>Web Audio</span>
            <span>MPC2000XL</span>
          </div>
        </motion.header>

        {/* ── Song cards ── */}
        <div className="mpc-card-grid">
          {songs.map((song, i) => (
            <motion.div
              key={song.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: "easeOut" }}
            >
              <div
                className="mpc-song-card"
                data-skin={song.skin}
                onClick={() => onSelect(song)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(song);
                  }
                }}
                aria-label={`Open ${song.title} by ${song.artist}`}
              >
                <div className="mpc-card-top">
                  <span className="mpc-card-index">0{i + 1}</span>
                  <span className="mpc-card-bpm-chip">{song.bpm} BPM</span>
                </div>

                <div className="mpc-card-thumb">
                  <MiniMPC song={song} />
                </div>

                <div className="mpc-card-meta">
                  <div className="mpc-card-title">{song.title}</div>
                  <div className="mpc-card-artist">{song.artist}</div>
                </div>

                <div className="mpc-card-foot">
                  <span className="mpc-card-model">
                    {song.title.toUpperCase()} MPC
                  </span>
                  <span className="mpc-card-skin-dot" aria-hidden />
                </div>

                <span className="mpc-play-now-btn">
                  <span className="mpc-play-icon" aria-hidden>
                    <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor">
                      <path d="M0 0.5L8 4.5L0 8.5V0.5Z" />
                    </svg>
                  </span>
                  Play now
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Keyboard hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mpc-library-hint"
        >
          <span className="mpc-hint-label">Play with your keyboard</span>
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

      {/* ── Bottom marquee strip ── */}
      <div className="mpc-marquee" aria-hidden>
        <div className="mpc-marquee-track">
          {[0, 1].map((n) => (
            <div key={n} className="mpc-marquee-seg">
              {songs.map((s) => (
                <span key={s.slug}>
                  {s.title} — {s.artist}
                </span>
              ))}
              <span>AKAI MPC2000XL</span>
              <span>MIDI Production Center</span>
              <span>Powered by Growthr</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
