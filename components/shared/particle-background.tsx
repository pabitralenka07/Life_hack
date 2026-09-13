"use client";

import dynamic from "next/dynamic";

const Antigravity = dynamic(
  () => import("@/components/shared/Antigravity"),
  { ssr: false }
);

/**
 * Full-screen fixed particle background with React Bits Antigravity.
 * Rendered globally so it persists seamlessly across all pages.
 * pointer-events: none ensures all clicks reach page interactive elements.
 * hideWhenIdle={true} and autoAnimate={false} ensure it only appears and
 * interacts while the cursor is actively moving, completely idle when stationary.
 */
export function ParticleBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
        <Antigravity
          count={350}
          magnetRadius={10}
          ringRadius={8}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.06}
          color="#A855F7"
          autoAnimate={false}
          hideWhenIdle={true}
          idleTimeout={800}
          particleVariance={1}
          rotationSpeed={0.05}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>
    </div>
  );
}
