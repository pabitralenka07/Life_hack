"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  /* ring spawn */
  angle: number;
  ringR: number;
  /* current world pos */
  x: number;
  y: number;
  /* velocity */
  vx: number;
  vy: number;
  /* capsule dimensions */
  len: number;
  width: number;
  /* wave phase */
  phase: number;
  speed: number;
  /* rotation of the capsule itself */
  rot: number;
  rotV: number;
  /* depth / opacity layer */
  depth: number;
  /* color index */
  colorIdx: number;
}

const COLORS = [
  "rgba(168,85,247,",   // violet  #A855F7
  "rgba(109,40,217,",   // purple  #6D28D9
  "rgba(192,132,252,",  // light   #C084FC
  "rgba(245,158,11,",   // amber   #F59E0B  – used sparingly
];

const COLOR_WEIGHTS = [0.42, 0.34, 0.18, 0.06]; // amber is 6 %

function pickColorIdx(): number {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < COLOR_WEIGHTS.length; i++) {
    acc += COLOR_WEIGHTS[i];
    if (r < acc) return i;
  }
  return 0;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function AntigravityBackground({
  count = 260,
  ringRadius = 110,
  magnetRadius = 130,
  waveSpeed = 0.38,
  waveAmplitude = 22,
  fieldStrength = 9,
  lerpSpeed = 0.085,
  reduced = false,
}: {
  count?: number;
  ringRadius?: number;
  magnetRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  fieldStrength?: number;
  lerpSpeed?: number;
  reduced?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  // Build particle list
  const buildParticles = useCallback(
    (w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const ps: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const rVariance = (Math.random() - 0.5) * ringRadius * 0.35;
        const r = ringRadius + rVariance;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        const depth = 0.4 + Math.random() * 0.6;
        ps.push({
          angle,
          ringR: r,
          x,
          y,
          vx: 0,
          vy: 0,
          len: 4 + Math.random() * 10,
          width: 1.5 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 0.8,
          rot: angle + Math.PI / 2,
          rotV: (Math.random() - 0.5) * 0.02,
          depth,
          colorIdx: pickColorIdx(),
        });
      }
      return ps;
    },
    [count, ringRadius]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size canvas to parent
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      particlesRef.current = buildParticles(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // Mouse tracking
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);

    // Draw capsule
    function drawCapsule(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      len: number,
      w: number,
      rot: number,
      colorBase: string,
      alpha: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      const r = w / 2;
      const halfLen = len / 2;

      const grd = ctx.createLinearGradient(-halfLen, 0, halfLen, 0);
      grd.addColorStop(0, `${colorBase}0)`);
      grd.addColorStop(0.3, `${colorBase}${(alpha * 0.6).toFixed(2)})`);
      grd.addColorStop(0.5, `${colorBase}${alpha.toFixed(2)})`);
      grd.addColorStop(0.7, `${colorBase}${(alpha * 0.6).toFixed(2)})`);
      grd.addColorStop(1, `${colorBase}0)`);

      ctx.beginPath();
      ctx.moveTo(-halfLen, -r);
      ctx.lineTo(halfLen, -r);
      ctx.arcTo(halfLen + r, -r, halfLen + r, r, r);
      ctx.lineTo(halfLen + r, r);
      ctx.arcTo(halfLen + r, r, -halfLen, r, r);
      ctx.lineTo(-halfLen, r);
      ctx.arcTo(-halfLen - r, r, -halfLen - r, -r, r);
      ctx.lineTo(-halfLen - r, -r);
      ctx.arcTo(-halfLen - r, -r, -halfLen, -r, r);
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    }

    // Reduced-motion: just draw static ring quietly
    if (reduced) {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p) => {
        drawCapsule(
          ctx,
          cx + Math.cos(p.angle) * p.ringR,
          cy + Math.sin(p.angle) * p.ringR,
          p.len,
          p.width,
          p.rot,
          COLORS[p.colorIdx],
          p.depth * 0.35
        );
      });
      return () => {
        ro.disconnect();
        window.removeEventListener("mousemove", onMove);
      };
    }

    // Animation loop
    function tick() {
      const w = canvas!.width;
      const h = canvas!.height;
      const cx = w / 2;
      const cy = h / 2;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx!.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        // Target: ring position + wave displacement
        const wave = Math.sin(t * waveSpeed * p.speed + p.phase) * waveAmplitude;
        const tx = cx + Math.cos(p.angle) * (p.ringR + wave);
        const ty = cy + Math.sin(p.angle) * (p.ringR + wave);

        // Mouse magnet repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let fx = 0;
        let fy = 0;
        if (dist < magnetRadius && dist > 0.1) {
          const strength = (1 - dist / magnetRadius) * fieldStrength;
          fx = (dx / dist) * strength;
          fy = (dy / dist) * strength;
        }

        // Smooth to target
        p.vx = lerp(p.vx, (tx - p.x) * lerpSpeed + fx, 0.18);
        p.vy = lerp(p.vy, (ty - p.y) * lerpSpeed + fy, 0.18);
        p.x += p.vx;
        p.y += p.vy;

        // Capsule auto-rotation follows velocity
        const speed2 = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed2 > 0.05) {
          p.rot = lerp(p.rot, Math.atan2(p.vy, p.vx), 0.12);
        } else {
          p.rot += p.rotV;
        }

        const alpha = p.depth * (0.55 + 0.45 * Math.abs(Math.sin(t * 0.7 + p.phase)));

        drawCapsule(ctx!, p.x, p.y, p.len, p.width, p.rot, COLORS[p.colorIdx], alpha);
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [buildParticles, magnetRadius, waveSpeed, waveAmplitude, fieldStrength, lerpSpeed, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
    />
  );
}
