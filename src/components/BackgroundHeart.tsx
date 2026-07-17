"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BackgroundHeart() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Main pulsing heart */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.06, 1, 1.08, 1],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.45, 0.65, 1],
        }}
      >
        <svg
          width="700"
          height="630"
          viewBox="0 0 700 630"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[80vw] h-auto max-w-[700px] md:w-[60vw]"
        >
          <defs>
            {/* Radial glow gradient */}
            <radialGradient id="heartGlow" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="rgba(130, 196, 255, 0.18)" />
              <stop offset="40%" stopColor="rgba(63, 142, 252, 0.10)" />
              <stop offset="70%" stopColor="rgba(139, 214, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(0, 27, 68, 0)" />
            </radialGradient>
            {/* Soft edge blur filter */}
            <filter id="heartBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
            </filter>
            {/* Outer mega blur for ambient glow */}
            <filter id="heartMegaBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="45" />
            </filter>
          </defs>

          {/* Ambient outer glow layer */}
          <path
            d="M350 580C350 580 50 380 50 220C50 120 130 50 220 50C270 50 315 75 350 115C385 75 430 50 480 50C570 50 650 120 650 220C650 380 350 580 350 580Z"
            fill="rgba(130, 196, 255, 0.06)"
            filter="url(#heartMegaBlur)"
          />

          {/* Main blurred heart fill */}
          <path
            d="M350 580C350 580 50 380 50 220C50 120 130 50 220 50C270 50 315 75 350 115C385 75 430 50 480 50C570 50 650 120 650 220C650 380 350 580 350 580Z"
            fill="url(#heartGlow)"
            filter="url(#heartBlur)"
          />

          {/* Subtle stroke outline */}
          <path
            d="M350 580C350 580 50 380 50 220C50 120 130 50 220 50C270 50 315 75 350 115C385 75 430 50 480 50C570 50 650 120 650 220C650 380 350 580 350 580Z"
            fill="none"
            stroke="rgba(130, 196, 255, 0.08)"
            strokeWidth="1.5"
            filter="url(#heartBlur)"
          />
        </svg>

        {/* Floating sparkle dots on the heart */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 120 + Math.random() * 80;
          const cx = 50 + Math.cos(angle) * (radius / 4);
          const cy = 42 + Math.sin(angle) * (radius / 4.5);
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-sky/40 rounded-full"
              style={{
                left: `${cx}%`,
                top: `${cy}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
