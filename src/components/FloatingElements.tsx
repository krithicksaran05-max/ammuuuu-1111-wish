"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

/* ── SVG Tulip ── */
function TulipSVG({ color = "#82C4FF", size = 32 }: { color?: string; size?: number }) {
  const darkerColor = color.startsWith("#FF")
    ? "#BE185D"
    : (color === "#82C4FF" ? "#3F8EFC" : color === "#B9E6FF" ? "#82C4FF" : "#0E4D92");
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 32 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left petal */}
      <path
        d="M16 28C12.5 28 8 23.5 8 19C8 13 11.5 9 14 4C13 9.5 12.5 14.5 16 19"
        fill={color}
        opacity={0.9}
      />
      {/* Right petal */}
      <path
        d="M16 28C19.5 28 24 23.5 24 19C24 13 20.5 9 18 4C19 9.5 19.5 14.5 16 19"
        fill={color}
        opacity={0.9}
      />
      {/* Center bud */}
      <path
        d="M16 30C17.8 30 19.5 27 19.5 21C19.5 14.5 16 5 16 5C16 5 12.5 14.5 12.5 21C12.5 27 14.2 30 16 30Z"
        fill={darkerColor}
        opacity={0.85}
      />
      {/* Stem */}
      <rect x="15.2" y="28" width="1.6" height="20" rx="0.8" fill="#0E4D92" opacity={0.6} />
      {/* Left leaf */}
      <ellipse cx="12" cy="38" rx="4" ry="2.5" fill="#0E4D92" opacity={0.4} transform="rotate(-25, 12, 38)" />
      {/* Right leaf */}
      <ellipse cx="20" cy="42" rx="4" ry="2.5" fill="#0E4D92" opacity={0.4} transform="rotate(25, 20, 42)" />
    </svg>
  );
}

/* ── SVG Butterfly ── */
function ButterflySVG({ color = "#82C4FF", size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left wing top */}
      <ellipse cx="12" cy="10" rx="10" ry="8" fill={color} opacity={0.6} />
      {/* Left wing bottom */}
      <ellipse cx="10" cy="20" rx="7" ry="6" fill={color} opacity={0.45} />
      {/* Right wing top */}
      <ellipse cx="28" cy="10" rx="10" ry="8" fill={color} opacity={0.6} />
      {/* Right wing bottom */}
      <ellipse cx="30" cy="20" rx="7" ry="6" fill={color} opacity={0.45} />
      {/* Body */}
      <rect x="19" y="4" width="2" height="22" rx="1" fill="rgba(255,255,255,0.5)" />
      {/* Antennae */}
      <line x1="20" y1="4" x2="15" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <line x1="20" y1="4" x2="25" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      {/* Wing spots */}
      <circle cx="12" cy="10" r="2.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="28" cy="10" r="2.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

interface FloatingItem {
  id: number;
  type: "tulip" | "butterfly";
  x: number; // percentage
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export default function FloatingElements() {
  const items = useMemo<FloatingItem[]>(() => {
    const colors = ["#FF8E9E", "#82C4FF", "#FFB7C5", "#B9E6FF", "#3F8EFC", "#FFD2DB"];
    const elements: FloatingItem[] = [];

    // Tulips — scattered along bottom-ish and sides
    const tulipPositions = [
      { x: 3, y: 75 }, { x: 12, y: 82 }, { x: 88, y: 78 },
      { x: 95, y: 70 }, { x: 7, y: 55 }, { x: 92, y: 60 },
      { x: 18, y: 90 }, { x: 82, y: 88 },
    ];

    tulipPositions.forEach((pos, i) => {
      elements.push({
        id: i,
        type: "tulip",
        x: pos.x,
        y: pos.y,
        size: 22 + ((i * 31 + 7) % 14),
        color: colors[i % colors.length],
        delay: ((i * 17 + 3) % 30) / 10,
        duration: 4 + ((i * 23 + 5) % 30) / 10,
      });
    });

    // Butterflies — scattered freely, more toward center-top
    const butterflyPositions = [
      { x: 20, y: 15 }, { x: 75, y: 20 }, { x: 45, y: 35 },
      { x: 10, y: 45 }, { x: 85, y: 40 }, { x: 55, y: 10 },
      { x: 30, y: 60 }, { x: 70, y: 55 },
    ];

    butterflyPositions.forEach((pos, i) => {
      elements.push({
        id: 100 + i,
        type: "butterfly",
        x: pos.x,
        y: pos.y,
        size: 20 + ((i * 29 + 3) % 12),
        color: colors[i % colors.length],
        delay: ((i * 19 + 7) % 40) / 10,
        duration: 6 + ((i * 27 + 1) % 40) / 10,
      });
    });

    return elements;
  }, []);

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
      {items.map((item) => {
        if (item.type === "tulip") {
          return (
            <motion.div
              key={item.id}
              className="absolute"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              animate={{
                rotate: [-3, 3, -3],
                y: [0, -6, 0],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
            >
              <TulipSVG color={item.color} size={item.size} />
            </motion.div>
          );
        }

        // Butterfly — complex flight path
        return (
          <motion.div
            key={item.id}
            className="absolute"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            animate={{
              x: [0, 30, -20, 40, 0],
              y: [0, -25, -10, -30, 0],
              rotate: [0, 8, -5, 10, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            {/* Wing flap animation */}
            <motion.div
              animate={{
                scaleX: [1, 0.4, 1, 0.4, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "center" }}
            >
              <ButterflySVG color={item.color} size={item.size} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
