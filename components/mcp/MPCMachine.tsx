"use client";

import { useState, useCallback } from "react";
import type { MPCSong } from "@/lib/mcp-songs";
import { useAudioEngine } from "./useAudioEngine";
import { useKeyboardInput } from "./useKeyboardInput";
import MPCScreen from "./MPCScreen";
import MPCPad from "./MPCPad";
import "./mcp.css";

interface MPCMachineProps {
  song: MPCSong;
}

// ─── MPC2000XL Machine Shell ──────────────────────────────────────────────────
// Pixel-faithful recreation of the AKAI MPC2000XL.
// Left panel: LCD, mode buttons, jog wheel, cursor pad, transport.
// Right panel: Pad bank selector, knobs, 4×4 pad grid.
// ─────────────────────────────────────────────────────────────────────────────

const MODE_BUTTONS = [
  { num: "7", label: "OTHER" },
  { num: "8", label: "MIDI" },
  { num: "9", label: "SYNC" },
  { num: "4", label: "SAMPLING" },
  { num: "5", label: "STEP EDIT" },
  { num: "6", label: "MIXER" },
  { num: "1", label: "MAIN SCREEN" },
  { num: "2", label: "DRUM" },
  { num: "3", label: "PROGRAM" },
];

const TRANSPORT_BUTTONS = [
  { label: "REC", className: "red" },
  { label: "OVERDUB", className: "red" },
  { label: "STOP", className: "" },
  { label: "PLAY", className: "" },
  { label: "PLAY START", className: "" },
];

export default function MPCMachine({ song }: MPCMachineProps) {
  // Which pads are currently flashing
  const [hitPads, setHitPads] = useState<Set<number>>(new Set());

  const { triggerPad, isLoading, loadedPads } = useAudioEngine(song);

  const handlePadHit = useCallback((padId: number) => {
    setHitPads((prev) => new Set(prev).add(padId));
    // Clear flash after 140 ms
    setTimeout(() => {
      setHitPads((prev) => {
        const next = new Set(prev);
        next.delete(padId);
        return next;
      });
    }, 140);
  }, []);

  const handleTrigger = useCallback(
    (padId: number) => {
      triggerPad(padId);
      handlePadHit(padId);
    },
    [triggerPad, handlePadHit]
  );

  useKeyboardInput({
    pads: song.pads,
    triggerPad,
    onPadHit: handlePadHit,
  });

  return (
    <div className="mpc-machine" data-skin={song.skin}>
      {/* Chassis screws */}
      <span className="mpc-screw tl" aria-hidden />
      <span className="mpc-screw tr" aria-hidden />
      <span className="mpc-screw bl" aria-hidden />
      <span className="mpc-screw br" aria-hidden />

      {/* ── Header ── */}
      <div className="mpc-header">
        <div className="mpc-akai-logo">
          AKAI<span>professional</span>
        </div>
        <div className="mpc-model-badge">
          <span className="mpc-model-name">MPC2000XL</span>
          <span className="mpc-model-sub">MIDI Production Center</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mpc-body">
        {/* ─────────── LEFT PANEL ─────────── */}
        <div className="mpc-left">
          {/* LCD screen */}
          <MPCScreen song={song} isLoading={isLoading} loadedCount={loadedPads.size} />

          {/* F1 – F6 buttons */}
          <div className="mpc-f-buttons">
            {["F1", "F2", "F3", "F4", "F5", "F6"].map((f) => (
              <button key={f} className="mpc-f-btn" type="button">
                {f}
              </button>
            ))}
          </div>

          {/* Mode button grid (3×3) */}
          <div className="mpc-modes">
            {MODE_BUTTONS.map((m) => (
              <button key={m.num} className="mpc-mode-btn" type="button">
                <span className="mpc-mode-num">{m.num}</span>
                <span className="mpc-mode-label">{m.label}</span>
              </button>
            ))}
          </div>

          {/* OPEN WINDOW + Jog wheel + Cursor pad row */}
          <div className="mpc-mid-row">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button className="mpc-open-window" type="button">
                OPEN WINDOW
              </button>
              <button className="mpc-prev-step" type="button">
                PREV. STEP
              </button>
            </div>

            <div className="mpc-jog" title="Jog Wheel" />

            {/* Cursor directional pad */}
            <div className="mpc-cursor-area">
              <span className="mpc-cursor-label">CURSOR</span>
              <div className="mpc-cursor-grid">
                <div />
                <button className="mpc-cursor-btn" type="button">▲</button>
                <div />
                <button className="mpc-cursor-btn" type="button">◀</button>
                <div className="mpc-cursor-btn center" />
                <button className="mpc-cursor-btn" type="button">▶</button>
                <div />
                <button className="mpc-cursor-btn" type="button">▼</button>
                <div />
              </div>
            </div>
          </div>

          {/* STEP / LOCATE / BAR buttons */}
          <div className="mpc-locate-row">
            <button className="mpc-locate-btn blue" type="button">STEP &lt;</button>
            <button className="mpc-locate-btn blue" type="button">STEP &gt;</button>
            <button className="mpc-locate-btn" type="button">GO TO</button>
            <button className="mpc-locate-btn" type="button">◀◀</button>
            <button className="mpc-locate-btn" type="button">▶▶</button>
            <button className="mpc-locate-btn" type="button">BAR -</button>
            <button className="mpc-locate-btn" type="button">BAR +</button>
          </div>

          {/* Note Variation slider */}
          <div className="mpc-slider-section">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="mpc-slider-label">Note Variation</span>
              <span className="mpc-slider-label">MAX</span>
            </div>
            <div className="mpc-slider-track">
              <div className="mpc-slider-thumb" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <span className="mpc-slider-label">AFTER</span>
              <span className="mpc-slider-label">MIN</span>
            </div>
            <span className="mpc-slider-label" style={{ textAlign: "center" }}>
              UNDO/SEQ
            </span>
          </div>

          {/* Transport */}
          <div className="mpc-transport">
            {TRANSPORT_BUTTONS.map((btn) => (
              <button
                key={btn.label}
                className={`mpc-transport-btn${btn.className ? ` ${btn.className}` : ""}`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─────────── RIGHT PANEL ─────────── */}
        <div className="mpc-right">
          <div className="mpc-right-header">
            {/* Pad Bank selector */}
            <div className="mpc-pad-bank">
              <span className="mpc-pad-bank-label">PAD BANK</span>
              <div className="mpc-pad-bank-dots">
                {(["A", "B", "C", "D"] as const).map((bank) => (
                  <div
                    key={bank}
                    className={`mpc-bank-dot${bank === song.padBank ? " active" : ""}`}
                    title={`Bank ${bank}`}
                  />
                ))}
              </div>
              <div className="mpc-pad-bank-btns">
                {(["A", "B", "C", "D"] as const).map((bank) => (
                  <button key={bank} className="mpc-bank-btn" type="button">
                    {bank}
                  </button>
                ))}
              </div>
            </div>

            {/* Knobs: REC GAIN + MAIN VOLUME */}
            <div className="mpc-knobs">
              <div className="mpc-knob-group">
                <div className="mpc-knob-wrap">
                  <span className="mpc-knob-label">REC GAIN</span>
                  <div className="mpc-knob rec-gain" title="Rec Gain" />
                </div>
                <div className="mpc-knob-wrap">
                  <span className="mpc-knob-label">MAIN VOL</span>
                  <div className="mpc-knob main-vol" title="Main Volume" />
                </div>
              </div>
            </div>
          </div>

          {/* 4×4 Pad grid */}
          <div className="mpc-pad-grid">
            {song.pads.map((pad) => (
              <MPCPad
                key={pad.id}
                pad={pad}
                isHit={hitPads.has(pad.id)}
                onTrigger={handleTrigger}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mpc-footer-bar">AKAI</div>
    </div>
  );
}
