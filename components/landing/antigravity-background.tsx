/* eslint-disable react/no-unknown-property */
"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface AntigravityBackgroundProps {
  theme?: "light" | "dark";
  className?: string;
}

interface ParticleState {
  t: number;
  factor: number;
  speed: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  randomRadiusOffset: number;
  angleOffset: number;
  isSecondary: boolean;
  baseScale: number;
}

interface FieldSceneProps {
  count: number;
  theme: "light" | "dark";
  reducedMotion: boolean;
}

const FieldScene: React.FC<FieldSceneProps> = ({ count, theme, reducedMotion }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMouseMoveTime = useRef(Date.now());
  const lastMousePos = useRef({ x: 0, y: 0 });
  const virtualMouse = useRef({ x: 0, y: 0 });
  const globalMouse = useRef<{ x: number; y: number } | null>(null);
  const isTabVisible = useRef(true);

  // Track pointer on window and document
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      globalMouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
      lastMouseMoveTime.current = Date.now();
    };

    const handlePointerLeave = () => {
      // Mark idle immediately when cursor leaves document
      globalMouse.current = null;
    };

    const handleVisibilityChange = () => {
      isTabVisible.current = !document.hidden;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Initialize particle distribution
  const particles = useMemo<ParticleState[]>(() => {
    const items: ParticleState[] = [];
    const width = Math.max(viewport.width || 30, 28);
    const height = Math.max(viewport.height || 20, 18);

    for (let i = 0; i < count; i++) {
      const isSecondary = i % 5 === 0; // ~20% secondary highlight particles
      const mx = (Math.random() - 0.5) * (width * 1.15);
      const my = (Math.random() - 0.5) * (height * 1.15);
      const mz = (Math.random() - 0.5) * 12;

      items.push({
        t: Math.random() * 200,
        factor: Math.random() * 100,
        speed: 0.008 + Math.random() * 0.012,
        mx,
        my,
        mz,
        cx: mx,
        cy: my,
        cz: mz,
        randomRadiusOffset: (Math.random() - 0.5) * 2.2,
        angleOffset: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
        isSecondary,
        baseScale: 0.75 + Math.random() * 0.45,
      });
    }
    return items;
  }, [count, viewport.width, viewport.height]);

  // Color tokens per theme
  // Dark: Primary #A855F7 (cyber violet), Secondary #F59E0B (radiant gold)
  // Light: Primary #FF8500 (tactical orange), Secondary #6D28D9 (deep violet)
  const primaryColor = useMemo(
    () => new THREE.Color(theme === "dark" ? "#A855F7" : "#FF8500"),
    [theme]
  );
  const secondaryColor = useMemo(
    () => new THREE.Color(theme === "dark" ? "#F59E0B" : "#6D28D9"),
    [theme]
  );

  // Apply instance colors whenever theme or count changes
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      if (p) {
        mesh.setColorAt(i, p.isSecondary ? secondaryColor : primaryColor);
      }
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [count, particles, primaryColor, secondaryColor, theme]);

  // Set initial or static matrices (for reduced motion or first render)
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      if (!p) continue;
      dummy.position.set(p.cx, p.cy, p.cz);
      dummy.scale.set(p.baseScale, p.baseScale, p.baseScale);
      dummy.rotation.set(0.2, 0.4, 0.1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, dummy, particles]);

  // Physics animation loop
  useFrame((state) => {
    if (reducedMotion || !isTabVisible.current) return;

    const mesh = meshRef.current;
    if (!mesh) return;

    const v = state.viewport;
    const now = Date.now();
    const isIdle = now - lastMouseMoveTime.current > 2000;

    let destX = 0;
    let destY = 0;

    if (isIdle || !globalMouse.current) {
      // Auto-animate in a gentle, elegant Lissajous orbit when idle for > 2 seconds
      const time = state.clock.getElapsedTime() * 0.4;
      destX = Math.sin(time) * (v.width * 0.24);
      destY = Math.cos(time * 1.5) * (v.height * 0.18);
    } else {
      // Track real user pointer
      const pointer = globalMouse.current;
      destX = (pointer.x * v.width) / 2;
      destY = (pointer.y * v.height) / 2;

      // Track pointer delta
      const dist = Math.hypot(pointer.x - lastMousePos.current.x, pointer.y - lastMousePos.current.y);
      if (dist > 0.001) {
        lastMouseMoveTime.current = now;
        lastMousePos.current = { x: pointer.x, y: pointer.y };
      }
    }

    // Smooth virtual mouse interpolation
    const smoothFactor = 0.06;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;
    const elapsedTime = state.clock.getElapsedTime();

    const magnetRadius = 14;
    const ringRadius = 4.2;
    const ringRotation = elapsedTime * 0.4;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      if (!p) continue;

      p.t += p.speed;

      // Target position calculation
      const dx = p.cx - targetX;
      const dy = p.cy - targetY;
      const distToCursor = Math.hypot(dx, dy);

      let tx = p.mx + Math.sin(p.t * 0.6 + p.factor) * 1.3;
      let ty = p.my + Math.cos(p.t * 0.6 + p.factor) * 1.3;
      let tz = p.mz + Math.sin(p.t * 0.4) * 0.9;
      let inRing = false;

      if (distToCursor < magnetRadius) {
        // Particle enters attraction field and forms the soft rotating ring
        inRing = true;
        const influence = Math.max(0, 1 - distToCursor / magnetRadius);
        const currentAngle = Math.atan2(dy, dx) + ringRotation * 0.8 + p.angleOffset * 0.15;
        const wave = Math.sin(p.t * 1.2 + currentAngle * 2) * 0.45;
        const currentRingRadius = ringRadius + wave + p.randomRadiusOffset * 0.7;

        const rx = targetX + Math.cos(currentAngle) * currentRingRadius;
        const ry = targetY + Math.sin(currentAngle) * currentRingRadius;
        const rz = p.mz * 0.4 + Math.sin(p.t * 0.8 + currentAngle) * 1.1;

        tx = THREE.MathUtils.lerp(tx, rx, influence * 0.92);
        ty = THREE.MathUtils.lerp(ty, ry, influence * 0.92);
        tz = THREE.MathUtils.lerp(tz, rz, influence * 0.92);
      }

      // Smooth coordinate transition
      const lerpSpd = inRing ? 0.08 : 0.04;
      p.cx += (tx - p.cx) * lerpSpd;
      p.cy += (ty - p.cy) * lerpSpd;
      p.cz += (tz - p.cz) * lerpSpd;

      dummy.position.set(p.cx, p.cy, p.cz);

      if (inRing) {
        // Orient capsule tangentially/fluidly along ring curve
        dummy.lookAt(targetX, targetY, p.cz);
        dummy.rotateX(Math.PI / 2);
        dummy.rotateZ(elapsedTime * 0.2 + p.angleOffset);
      } else {
        // Organic tumbling drift
        dummy.rotation.x = p.t * 0.8;
        dummy.rotation.y = p.t * 0.6;
        dummy.rotation.z = p.factor;
      }

      // Dynamic scale: gentle pulsing, slightly larger near ring
      const pulse = 1 + Math.sin(p.t * 2.2) * 0.15;
      const ringScaleBonus = inRing ? 1.2 : 1.0;
      const finalScale = p.baseScale * pulse * ringScaleBonus;

      dummy.scale.set(finalScale, finalScale, finalScale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      {/* Sleek rounded micro-capsule geometry */}
      <capsuleGeometry args={[0.065, 0.26, 4, 8]} />
      <meshBasicMaterial
        transparent
        opacity={theme === "dark" ? 0.88 : 0.52}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export const AntigravityBackground: React.FC<AntigravityBackgroundProps> = ({
  theme = "dark",
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);
  const [particleCount, setParticleCount] = useState(240);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    const isMobile = window.innerWidth < 768;
    setParticleCount(isMobile ? 96 : 240);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleResize = () => {
      setParticleCount(window.innerWidth < 768 ? 96 : 240);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Very subtle ambient violet glow in dark mode */}
      {theme === "dark" && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 50% 28%, rgba(109, 40, 217, 0.20), transparent 75%)",
          }}
        />
      )}
      {/* Very subtle ambient warm glow in light mode */}
      {theme === "light" && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 50% 28%, rgba(255, 133, 0, 0.12), transparent 75%)",
          }}
        />
      )}

      {/* Sticky viewport-sized canvas layer that remains centered behind content during scroll */}
      <div className="sticky top-0 h-screen w-full pointer-events-none">
        {mounted && (
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 45], fov: 35 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <FieldScene
              count={particleCount}
              theme={theme}
              reducedMotion={reducedMotion}
            />
          </Canvas>
        )}
      </div>
    </div>
  );
};

export default AntigravityBackground;
