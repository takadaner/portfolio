import { useEffect, useCallback } from "react";
import type { MPCPad } from "@/lib/mcp-songs";

// ─── Keyboard Input Hook ──────────────────────────────────────────────────────
// Maps keyboard keys to pad IDs and fires triggerPad + a visual flash callback.
// Ignores events when focus is inside a form element.
// ─────────────────────────────────────────────────────────────────────────────

interface UseKeyboardInputOptions {
  pads: MPCPad[];
  triggerPad: (padId: number) => void;
  onPadHit: (padId: number) => void;
  enabled?: boolean;
}

export function useKeyboardInput({
  pads,
  triggerPad,
  onPadHit,
  enabled = true,
}: UseKeyboardInputOptions) {
  const buildKeyMap = useCallback(() => {
    const map = new Map<string, number>();
    pads.forEach((pad) => map.set(pad.key.toLowerCase(), pad.id));
    return map;
  }, [pads]);

  useEffect(() => {
    if (!enabled) return;

    const keyMap = buildKeyMap();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Leave browser shortcuts (Ctrl+C, Cmd+F, …) alone
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Ignore key events inside inputs / textareas / selects
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }
      // Ignore repeats (held key)
      if (e.repeat) return;

      const padId = keyMap.get(e.key.toLowerCase());
      if (padId !== undefined) {
        e.preventDefault();
        triggerPad(padId);
        onPadHit(padId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, buildKeyMap, triggerPad, onPadHit]);
}
