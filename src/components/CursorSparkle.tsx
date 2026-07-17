"use client";

import React, { useEffect, useRef } from "react";

export default function CursorSparkle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only enable on devices with fine pointer (no touch-only)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Track mouse
    let lastX = -1000;
    let lastY = -1000;
    let frameCount = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Spawn sparkles based on movement distance
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        spawnSparkle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    // Touch ripple
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        for (let i = 0; i < 8; i++) {
          spawnSparkle(
            touch.clientX + (Math.random() - 0.5) * 20,
            touch.clientY + (Math.random() - 0.5) * 20
          );
        }
      }
    };

    const spawnSparkle = (x: number, y: number) => {
      const sparkle: Particle = {
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 0.5,
        size: Math.random() * 3 + 1,
        life: 1,
        decay: Math.random() * 0.03 + 0.015,
        color: Math.random() > 0.5 ? "139, 214, 255" : "255, 255, 255",
      };
      particlesRef.current.push(sparkle);

      // Limit particles
      if (particlesRef.current.length > 80) {
        particlesRef.current.splice(0, 10);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouch, { passive: true });

    let animId: number;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cursor glow
      if (mouseRef.current.x > 0) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          60
        );
        gradient.addColorStop(0, "rgba(139, 214, 255, 0.08)");
        gradient.addColorStop(1, "rgba(139, 214, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 60, 0, Math.PI * 2);
        ctx.fill();

        // Cursor dot
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gentle gravity
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life * 0.8;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, ${alpha})`;
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.beginPath();

        // Draw as a tiny 4-point star
        const s = p.size * p.life;
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x + s * 0.3, p.y);
        ctx.lineTo(p.x, p.y + s);
        ctx.lineTo(p.x - s * 0.3, p.y);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      aria-hidden="true"
    />
  );
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  color: string;
}
