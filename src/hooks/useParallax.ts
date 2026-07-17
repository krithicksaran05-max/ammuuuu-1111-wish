"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxState {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

export function useParallax(sensitivity = 0.02) {
  const [state, setState] = useState<ParallaxState>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });
  const targetRef = useRef<ParallaxState>({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMove = (clientX: number, clientY: number) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = (clientX - centerX) * sensitivity;
      const y = (clientY - centerY) * sensitivity;
      const rotateY = (clientX - centerX) * sensitivity * 0.5;
      const rotateX = -(clientY - centerY) * sensitivity * 0.5;

      targetRef.current = { x, y, rotateX, rotateY };
    };

    const handleMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);

    // Device orientation for mobile
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = e.gamma * sensitivity * 2;
        const y = (e.beta - 45) * sensitivity * 2;
        targetRef.current = {
          x,
          y,
          rotateX: -y * 0.5,
          rotateY: x * 0.5,
        };
      }
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("deviceorientation", handleOrientation);

    // Smooth interpolation loop
    const animate = () => {
      setState((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.08,
        y: prev.y + (targetRef.current.y - prev.y) * 0.08,
        rotateX: prev.rotateX + (targetRef.current.rotateX - prev.rotateX) * 0.08,
        rotateY: prev.rotateY + (targetRef.current.rotateY - prev.rotateY) * 0.08,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [sensitivity]);

  return state;
}
