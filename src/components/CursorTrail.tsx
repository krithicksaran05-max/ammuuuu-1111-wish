"use client";

import React, { useEffect, useRef, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  life: number;
}

export default function CursorTrail() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(true);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateMouse = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });

      // Update CSS variables for spotlight effect
      document.documentElement.style.setProperty("--mouse-x", `${clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${clientY}px`);

      // Add a sparkle occasionally on move
      if (Math.random() < 0.35) {
        const colors = ["#87CEEB", "#BFEFFF", "#FFFFFF", "#E6E6FA"];
        const newSparkle: Sparkle = {
          id: nextId.current++,
          x: clientX,
          y: clientY,
          size: Math.random() * 5 + 2,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: Math.random() * 1.5 + 0.5, // drift down
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
          life: 1.0,
        };

        setSparkles((prev) => [...prev.slice(-30), newSparkle]); // cap at 30
      }
    };

    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, [isMobile]);

  // Sparkle decay cycle
  useEffect(() => {
    if (sparkles.length === 0) return;

    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev
          .map((sp) => ({
            ...sp,
            x: sp.x + sp.speedX,
            y: sp.y + sp.speedY,
            opacity: sp.opacity - 0.04,
            life: sp.life - 0.04,
          }))
          .filter((sp) => sp.opacity > 0)
      );
    }, 20);

    return () => clearInterval(interval);
  }, [sparkles]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Mouse Spotlight effect mask */}
      <div className="spotlight fixed inset-0 z-0" />

      {/* Sparkles */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute rounded-full transition-transform duration-75"
          style={{
            left: sp.x,
            top: sp.y,
            width: sp.size,
            height: sp.size,
            backgroundColor: sp.color,
            opacity: sp.opacity,
            boxShadow: `0 0 ${sp.size * 2}px ${sp.color}`,
            transform: `translate(-50%, -50%) scale(${sp.life})`,
          }}
        />
      ))}

      {/* Heart Cursor */}
      <div
        className="absolute w-6 h-6 flex items-center justify-center transition-transform duration-75 ease-out select-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Glow */}
        <div className="absolute w-5 h-5 bg-sky-blue/30 rounded-full blur-[8px] animate-pulse" />
        
        {/* Heart icon */}
        <svg
          viewBox="0 0 24 24"
          fill="#87CEEB"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          className="w-4 h-4 drop-shadow-[0_0_4px_rgba(135,206,235,0.8)]"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );
}
