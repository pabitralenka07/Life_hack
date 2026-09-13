"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";

/**
 * Custom RPG cursor:
 * - Small bright inner dot (snaps to pointer)
 * - Glowing outer ring (lerps behind)
 * - Particle trail that spawns on movement
 * - Crosshair tick marks on the ring
 * - Click burst effect
 */
export function CustomCursor() {
  const [isLight, setIsLight] = useState(false);
  const isLightRef = useRef(false);

  useEffect(() => {
    const checkTheme = () => {
      const isLightMode =
        document.documentElement.classList.contains("light") ||
        document.documentElement.getAttribute("data-theme") === "light";
      setIsLight(isLightMode);
      isLightRef.current = isLightMode;
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);

  // Raw mouse position
  const mouse = useRef({ x: -100, y: -100 });
  // Lerped ring position
  const ring = useRef({ x: -100, y: -100 });
  // Track if mouse is down
  const isDown = useRef(false);
  // Track if hovering a clickable
  const isHover = useRef(false);
  // Animation frame id
  const raf = useRef<number>(0);
  // Last position for trail throttle
  const lastTrail = useRef({ x: -100, y: -100 });

  const spawnTrail = useCallback((x: number, y: number) => {
    const container = trailContainerRef.current;
    if (!container) return;

    const dx = x - lastTrail.current.x;
    const dy = y - lastTrail.current.y;
    if (dx * dx + dy * dy < 64) return; // min 8px movement
    lastTrail.current = { x, y };

    const trailColor = isLightRef.current ? "#FF8500" : "#A855F7";
    const trailGlow = isLightRef.current ? "#F59E0B" : "#6D28D9";

    const dot = document.createElement("div");
    const size = 3 + Math.random() * 4;
    dot.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${trailColor};
      pointer-events: none;
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.7;
      transition: transform 0.5s ease-out, opacity 0.5s ease-out;
      box-shadow: 0 0 ${size * 2}px ${trailGlow};
      will-change: transform, opacity;
    `;
    container.appendChild(dot);

    // Trigger fade-out on next frame
    requestAnimationFrame(() => {
      dot.style.transform = `translate(-50%, -50%) scale(0)`;
      dot.style.opacity = "0";
    });

    setTimeout(() => dot.remove(), 500);
  }, []);

  const spawnClickBurst = useCallback((x: number, y: number) => {
    const container = trailContainerRef.current;
    if (!container) return;

    const burstColor = isLightRef.current ? "#FF8500" : "#A855F7";
    const burstGlow = isLightRef.current ? "#F59E0B" : "#6D28D9";

    for (let i = 0; i < 8; i++) {
      const dot = document.createElement("div");
      const angle = (i / 8) * Math.PI * 2;
      const distance = 20 + Math.random() * 20;
      dot.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: ${burstColor};
        pointer-events: none;
        transform: translate(-50%, -50%) translate(0px, 0px) scale(1);
        opacity: 0.9;
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-out;
        box-shadow: 0 0 6px ${burstGlow};
        will-change: transform, opacity;
      `;
      container.appendChild(dot);

      requestAnimationFrame(() => {
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        dot.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(0)`;
        dot.style.opacity = "0";
      });

      setTimeout(() => dot.remove(), 400);
    }
  }, []);

  useEffect(() => {
    // Hide native cursor globally
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      spawnTrail(e.clientX, e.clientY);
    };

    const onDown = (e: MouseEvent) => {
      isDown.current = true;
      spawnClickBurst(e.clientX, e.clientY);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(-50%, -50%) scale(0.7)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(-50%, -50%) scale(1.8)`;
      }
    };

    const onUp = () => {
      isDown.current = false;
      const scale = isHover.current ? 1.6 : 1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(-50%, -50%) scale(1)`;
      }
    };

    // Detect hoverable elements
    const onEnterHoverable = () => {
      isHover.current = true;
      if (ringRef.current) {
        ringRef.current.classList.add("cursor-hover");
      }
    };
    const onLeaveHoverable = () => {
      isHover.current = false;
      if (ringRef.current) {
        ringRef.current.classList.remove("cursor-hover");
      }
    };

    const hoverableSelector =
      "a, button, [role='button'], input, textarea, select, label, [tabindex]";

    const attachHoverListeners = () => {
      document.querySelectorAll<HTMLElement>(hoverableSelector).forEach((el) => {
        el.addEventListener("mouseenter", onEnterHoverable);
        el.addEventListener("mouseleave", onLeaveHoverable);
        el.style.cursor = "none";
      });
    };

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    attachHoverListeners();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Lerp animation loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const LERP_SPEED = 0.1;

    const animate = () => {
      // Snap dot to exact position
      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.current.x}px`;
        dotRef.current.style.top = `${mouse.current.y}px`;
      }

      // Lerp ring toward mouse
      ring.current.x = lerp(ring.current.x, mouse.current.x, LERP_SPEED);
      ring.current.y = lerp(ring.current.y, mouse.current.y, LERP_SPEED);

      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }

      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
    };
  }, [spawnTrail, spawnClickBurst]);

  return (
    <>
      {/* Trail container */}
      <div
        ref={trailContainerRef}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998 }}
      />

      {/* Inner dot — snaps instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isLight ? "#FFFFFF" : "#F8FAFC",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          boxShadow: isLight
            ? "0 0 8px #FF8500, 0 0 16px #F59E0B"
            : "0 0 8px #A855F7, 0 0 16px #6D28D9",
          transition: "transform 0.1s ease, box-shadow 0.2s",
          willChange: "left, top, transform",
        }}
      />

      {/* Outer ring — lerps behind */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: isLight ? "1.5px solid #FF8500" : "1.5px solid #A855F7",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%) scale(1)",
          boxShadow: isLight
            ? "0 0 10px rgba(255,133,0,0.6), inset 0 0 10px rgba(245,158,11,0.2)"
            : "0 0 10px rgba(168,85,247,0.4), inset 0 0 10px rgba(109,40,217,0.15)",
          transition:
            "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s, box-shadow 0.2s",
          willChange: "left, top",
        }}
      >
        {/* Crosshair ticks */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 5,
              height: 1.5,
              background: isLight ? "#FF8500" : "#A855F7",
              transformOrigin: "left center",
              transform: `rotate(${deg}deg) translateX(14px) translateY(-50%)`,
              borderRadius: 1,
              transition: "background-color 0.2s",
            }}
          />
        ))}
      </div>

      {/* Hover + click ring styles */}
      <style>{`
        .cursor-ring.cursor-hover {
          border-color: ${isLight ? "#FF8500" : "#F59E0B"} !important;
          box-shadow: ${
            isLight
              ? "0 0 14px rgba(255,133,0,0.7), inset 0 0 10px rgba(245,158,11,0.25)"
              : "0 0 14px rgba(245,158,11,0.5), inset 0 0 10px rgba(245,158,11,0.15)"
          } !important;
          transform: translate(-50%, -50%) scale(1.6) !important;
        }
        * { cursor: none !important; }
      `}</style>
    </>
  );
}
