"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Tulip {
  id: number;
  word: string;
  glowColor: string;
  translation: string;
  color: "pink" | "blue";
}

const tulipsData: Tulip[] = [
  { id: 1, word: "Anbha ❤️", glowColor: "rgba(255, 142, 158, 0.8)", translation: "Pure Love", color: "pink" },
  { id: 2, word: "Santhosam ✨", glowColor: "rgba(63, 142, 252, 0.8)", translation: "Pure Joy", color: "blue" },
  { id: 3, word: "Nambikkai 🤝", glowColor: "rgba(255, 183, 197, 0.8)", translation: "Infinite Trust", color: "pink" },
  { id: 4, word: "Amaidhi 🕊️", glowColor: "rgba(139, 214, 255, 0.8)", translation: "Deep Peace", color: "blue" },
  { id: 5, word: "Vazhkai 🌹", glowColor: "rgba(255, 210, 219, 0.8)", translation: "My Whole Life", color: "pink" },
  { id: 6, word: "Enrum Unnodhu ♾️", glowColor: "rgba(185, 230, 255, 0.8)", translation: "Forever Yours", color: "blue" },
];

export default function TulipGarden() {
  const [bloomedTulips, setBloomedTulips] = useState<number[]>([]);
  const [activeMessage, setActiveMessage] = useState<{ word: string; translation: string } | null>(null);

  const handleTulipClick = (id: number, word: string, translation: string, color: "pink" | "blue", event: React.MouseEvent<HTMLButtonElement>) => {
    if (bloomedTulips.includes(id)) {
      // Re-trigger particle effect if already bloomed
      triggerParticles(event.clientX, event.clientY, color);
      setActiveMessage({ word, translation });
      return;
    }

    setBloomedTulips((prev) => [...prev, id]);
    setActiveMessage({ word, translation });

    // Trigger haptics
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(30);
    }

    triggerParticles(event.clientX, event.clientY, color);
  };

  const triggerParticles = (clientX: number, clientY: number, color: "pink" | "blue") => {
    // Normalise client coordinates to viewport coordinates for canvas-confetti origin (0.0 to 1.0)
    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: color === "pink"
        ? ["#FF8E9E", "#FFB7C5", "#FFD2DB", "#ffffff"]
        : ["#82C4FF", "#3F8EFC", "#B9E6FF", "#ffffff"],
      gravity: 0.8,
      scalar: 0.8,
    });
  };

  return (
    <section
      id="tulip-garden-section"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 z-10 overflow-hidden"
    >
      {/* Background radial gradient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ocean/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-center mb-20 max-w-sm z-10"
      >
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white font-light tracking-wide mb-4">
          Magical Tulip Garden
        </h2>
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-white/50 italic">
          Click the closed buds to make them bloom with a magical Tamil wish
        </p>
      </motion.div>

      {/* Floating active message detail */}
      <div className="h-20 flex items-center justify-center mb-16 relative z-10">
        <AnimatePresence mode="wait">
          {activeMessage && (
            <motion.div
              key={activeMessage.word}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
              className="text-center"
            >
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-glow font-medium text-white mb-1">
                {activeMessage.word}
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-base text-white/50 italic">
                ({activeMessage.translation})
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tulips Container Grid */}
      <div className="relative w-full max-w-3xl flex justify-center items-end gap-6 md:gap-12 px-6 h-[250px] border-b border-white/5 pb-2">
        {tulipsData.map((tulip) => {
          const isBloomed = bloomedTulips.includes(tulip.id);

          return (
            <div key={tulip.id} className="relative flex flex-col items-center group">
              {/* Swaying wrapper animation */}
              <motion.button
                onClick={(e) => handleTulipClick(tulip.id, tulip.word, tulip.translation, tulip.color, e)}
                animate={{
                  rotate: isBloomed ? [-1.5, 1.5, -1.5] : [-0.5, 0.5, -0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + tulip.id * 0.5,
                  ease: "easeInOut",
                }}
                className="relative flex flex-col items-center justify-end h-[180px] w-12 cursor-pointer focus:outline-none"
              >
                {/* Glowing glow ring behind active tulip */}
                <span
                  className="absolute -top-4 w-12 h-12 rounded-full blur-md opacity-0 transition-opacity duration-700 pointer-events-none"
                  style={{
                    backgroundColor: tulip.glowColor,
                    opacity: isBloomed ? 0.35 : 0,
                  }}
                />

                {/* SVG Tulip petals */}
                <div className="relative z-10 transition-transform duration-700 select-none">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transform transition-transform duration-700"
                  >
                    {/* Left petal */}
                    <path
                      d="M22 36C17.5 36 12 30.5 12 25C12 17.5 16.5 12 20 6C18.5 13 18 19.5 22 25"
                      fill={isBloomed ? (tulip.color === "pink" ? "#FF8E9E" : "#82C4FF") : (tulip.color === "pink" ? "#BE185D" : "#3F8EFC")}
                      className="origin-bottom transition-all duration-700"
                      style={{
                        transform: isBloomed ? "rotate(-12deg) translate(-2px, -2px)" : "none",
                      }}
                    />
                    {/* Right petal */}
                    <path
                      d="M22 36C26.5 36 32 30.5 32 25C32 17.5 27.5 12 24 6C25.5 13 26 19.5 22 25"
                      fill={isBloomed ? (tulip.color === "pink" ? "#FF8E9E" : "#82C4FF") : (tulip.color === "pink" ? "#BE185D" : "#3F8EFC")}
                      className="origin-bottom transition-all duration-700"
                      style={{
                        transform: isBloomed ? "rotate(12deg) translate(2px, -2px)" : "none",
                      }}
                    />
                    {/* Center glowing bud */}
                    <path
                      d="M22 38C24.5 38 27 34.5 27 28C27 19.5 22 8 22 8C22 8 17 19.5 17 28C17 34.5 19.5 38 22 38Z"
                      fill={isBloomed ? (tulip.color === "pink" ? "#FFD2DB" : "#B9E6FF") : (tulip.color === "pink" ? "#9D174D" : "#1E3A8A")}
                      className="transition-colors duration-700"
                    />
                  </svg>
                </div>

                {/* STEM */}
                <div className="w-[3px] h-[100px] bg-gradient-to-b from-[#0E4D92] to-white/5 relative z-0">
                  {/* Stem Leaf (Left) */}
                  <div
                    className="absolute top-10 right-[1px] w-4 h-6 rounded-l-full bg-gradient-to-r origin-right -rotate-[35deg]"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${tulip.color === "pink" ? "#BE185D" : "#0E4D92"}, transparent)`,
                    }}
                  />
                  {/* Stem Leaf (Right) */}
                  <div
                    className="absolute top-16 left-[1px] w-4 h-6 rounded-r-full bg-gradient-to-l origin-left rotate-[35deg]"
                    style={{
                      backgroundImage: `linear-gradient(to left, ${tulip.color === "pink" ? "#BE185D" : "#0E4D92"}, transparent)`,
                    }}
                  />
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
