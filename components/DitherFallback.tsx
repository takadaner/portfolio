"use client";

import { useEffect, useRef } from "react";

// Canvas 2D port of Dither.tsx (same fbm wave + 8x8 Bayer ordered dither),
// used where WebGL is unavailable or fails. Runs at a reduced resolution and
// is scaled up with `image-rendering: pixelated`.

export interface DitherFallbackProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

const BAYER = [
  0, 48, 12, 60, 3, 51, 15, 63, 32, 16, 44, 28, 35, 19, 47, 31, 8, 56, 4, 52,
  11, 59, 7, 55, 40, 24, 36, 20, 43, 27, 39, 23, 2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29, 10, 58, 6, 54, 9, 57, 5, 53, 42, 26, 38, 22,
  41, 25, 37, 21,
].map((v) => v / 64);

const m289 = (x: number) => x - Math.floor(x / 289) * 289;
const permute = (x: number) => m289((x * 34 + 1) * x);
const invSqrt = (r: number) => 1.79284291400159 - 0.85373472095314 * r;
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

// Classic Perlin noise, scalar port of the GLSL cnoise.
// Corner order: 00, 10, 01, 11 (x then y offsets).
function cnoise(px: number, py: number): number {
  const fx0 = Math.floor(px);
  const fy0 = Math.floor(py);
  const pfx = px - fx0;
  const pfy = py - fy0;
  const ix0 = m289(fx0);
  const iy0 = m289(fy0);
  const ix1 = m289(fx0 + 1);
  const iy1 = m289(fy0 + 1);

  const corner = (ix: number, iy: number, dx: number, dy: number) => {
    const i = permute(permute(ix) + iy);
    let gx = (i * (1 / 41) - Math.floor(i * (1 / 41))) * 2 - 1;
    const gy = Math.abs(gx) - 0.5;
    gx -= Math.floor(gx + 0.5);
    const s = invSqrt(gx * gx + gy * gy);
    return gx * s * dx + gy * s * dy;
  };

  const n00 = corner(ix0, iy0, pfx, pfy);
  const n10 = corner(ix1, iy0, pfx - 1, pfy);
  const n01 = corner(ix0, iy1, pfx, pfy - 1);
  const n11 = corner(ix1, iy1, pfx - 1, pfy - 1);
  const u = fade(pfx);
  const v = fade(pfy);
  const nx0 = n00 + (n10 - n00) * u;
  const nx1 = n01 + (n11 - n01) * u;
  return 2.3 * (nx0 + (nx1 - nx0) * v);
}

export default function DitherFallback({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wr, wg, wb] = waveColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Buffer width is capped so the per-pixel JS noise stays cheap.
    const MAX_W = 400;
    let W = 1;
    let H = 1;
    let img: ImageData = ctx.createImageData(1, 1);
    let data = new Uint32Array(img.data.buffer);
    let time = 0;
    let last = 0;
    let raf = 0;
    let mx = 0;
    let my = 0;
    let hasMouse = false;

    const fbm = (x: number, y: number) => {
      let value = 0;
      let amp = 1;
      for (let i = 0; i < 4; i++) {
        value += amp * Math.abs(cnoise(x, y));
        x *= waveFrequency;
        y *= waveFrequency;
        amp *= waveAmplitude;
      }
      return value;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const cssW = Math.max(1, r.width);
      const cssH = Math.max(1, r.height);
      W = Math.max(1, Math.min(MAX_W, Math.round(cssW / (pixelSize * 1.5))));
      H = Math.max(1, Math.round((W * cssH) / cssW));
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
      data = new Uint32Array(img.data.buffer);
    };

    const draw = () => {
      const aspect = W / H;
      const levels = colorNum - 1;
      const step = 1 / levels;
      const useMouse = enableMouseInteraction && hasMouse;
      // Mouse in shader uv space (centered, y up).
      const mu = (mx - 0.5) * aspect;
      const mv = 0.5 - my;
      const q = (c: number, thr: number) => {
        let v = c + thr * step - 0.2;
        v = v < 0 ? 0 : v > 1 ? 1 : v;
        return Math.round((Math.floor(v * levels + 0.5) / levels) * 255);
      };
      for (let y = 0; y < H; y++) {
        const vy = 0.5 - (y + 0.5) / H;
        for (let x = 0; x < W; x++) {
          const ux = ((x + 0.5) / W - 0.5) * aspect;
          const o = fbm(ux - time * waveSpeed, vy - time * waveSpeed);
          let f = fbm(ux + o, vy + o);
          if (useMouse) {
            const dx = ux - mu;
            const dy = vy - mv;
            const d = Math.sqrt(dx * dx + dy * dy);
            const t = Math.min(1, d / mouseRadius);
            f -= 0.5 * (1 - t * t * (3 - 2 * t));
          }
          const thr = BAYER[(y & 7) * 8 + (x & 7)] - 0.25;
          data[y * W + x] =
            (255 << 24) |
            (q(f * wb, thr) << 16) |
            (q(f * wg, thr) << 8) |
            q(f * wr, thr);
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps
      time += Math.min(0.1, (now - last) / 1000);
      last = now;
      draw();
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // The parent is pointer-events-none, so track the pointer on window.
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      hasMouse = mx >= 0 && mx <= 1 && my >= 0 && my <= 1;
      if (disableAnimation) draw(); // paused: keep the hover responsive
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!disableAnimation) start();
    };
    const onResize = () => {
      resize();
      draw();
    };

    resize();
    draw(); // always at least one static frame
    if (!disableAnimation) start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (enableMouseInteraction) window.addEventListener("pointermove", onMove);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
    };
  }, [
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    wr,
    wg,
    wb,
    colorNum,
    pixelSize,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
