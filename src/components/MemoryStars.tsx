"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Memory {
  id: number;
  title: string;
  desc: string;
  date: string;
  x: number; // percentage layout positioning
  y: number;
}

const memories: Memory[] = [
  {
    id: 1,
    title: "Your Precious Smile",
    desc: "The way your entire face lights up when you laugh. It is my absolute favorite site in the entire universe.",
    date: "Always",
    x: 20,
    y: 30,
  },
  {
    id: 2,
    title: "Safest Sanctuary",
    desc: "No matter how chaotic the day gets, one message or call from you instantly silences all the noise. You are my home.",
    date: "Forever",
    x: 45,
    y: 15,
  },
  {
    id: 3,
    title: "Precious Chapter",
    desc: "Every single conversation we share feels like a beautiful page from a storybook I never want to close.",
    date: "Every Day",
    x: 75,
    y: 25,
  },
  {
    id: 4,
    title: "The Warmth You Bring",
    desc: "Your kindness, your care, and the gentle way you hold my heart even from miles away. You make me complete.",
    date: "Eternal",
    x: 30,
    y: 65,
  },
  {
    id: 5,
    title: "My Only Wish",
    desc: "At 11:11, while others wish for wealth or stars, my heart repeats a single name: Ammuuu. You are my reality.",
    date: "11:11",
    x: 65,
    y: 70,
  },
];

export default function MemoryStars() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <section
      id="memories-constellation"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 z-10"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-md z-10"
      >
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white font-light tracking-wide mb-4">
          Interactive Memories
        </h2>
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-white/50 italic">
          Click the glowing stars to unlock floating memory logs
        </p>
      </motion.div>

      {/* Constellation Canvas area */}
      <div className="relative w-full max-w-4xl h-[450px] md:h-[550px] glass-subtle rounded-3xl overflow-hidden p-6">
        {/* Draw joining connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="20%" y1="30%" x2="45%" y2="15%" stroke="#82C4FF" strokeWidth="1" />
          <line x1="45%" y1="15%" x2="75%" y2="25%" stroke="#82C4FF" strokeWidth="1" />
          <line x1="20%" y1="30%" x2="30%" y2="65%" stroke="#82C4FF" strokeWidth="1" />
          <line x1="30%" y1="65%" x2="65%" y2="70%" stroke="#82C4FF" strokeWidth="1" />
          <line x1="75%" y1="25%" x2="65%" y2="70%" stroke="#82C4FF" strokeWidth="1" />
        </svg>

        {/* Floating Stars */}
        {memories.map((memory) => {
          const isSelected = selectedMemory?.id === memory.id;

          return (
            <div
              key={memory.id}
              className="absolute"
              style={{ left: `${memory.x}%`, top: `${memory.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <button
                onClick={() => setSelectedMemory(memory)}
                className="relative group cursor-pointer"
                aria-label={memory.title}
              >
                {/* Glowing ring */}
                <span className="absolute -inset-4 rounded-full bg-glow/10 scale-50 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />

                {/* Animated pulsing star element */}
                <motion.div
                  animate={{
                    scale: isSelected ? [1, 1.3, 1.1] : [1, 1.15, 1],
                    boxShadow: isSelected
                      ? "0 0 20px rgba(139, 214, 255, 0.8)"
                      : "0 0 8px rgba(139, 214, 255, 0.3)",
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: isSelected ? 2 : 3 + memory.id,
                  }}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-white border-2 border-sky" : "bg-sky"
                  }`}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>

                {/* Star subtitle label */}
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] text-white/40 uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {memory.date}
                </span>
              </button>
            </div>
          );
        })}

        {/* Floating Polaroid Detail Note */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:bottom-6 md:max-w-sm glass rounded-2xl p-6 shadow-2xl z-20 pointer-events-auto border-glow"
            >
              {/* Polaroid top layout */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] tracking-[0.2em] text-sky font-semibold uppercase">
                  Memory #{selectedMemory.id} • {selectedMemory.date}
                </span>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-white mb-2 leading-tight">
                {selectedMemory.title}
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-base text-white/80 italic leading-relaxed">
                "{selectedMemory.desc}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
