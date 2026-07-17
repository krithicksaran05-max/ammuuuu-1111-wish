"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CosmicLoaderProps {
  onComplete: () => void;
}

export default function CosmicLoader({ onComplete }: CosmicLoaderProps) {
  const [phase, setPhase] = useState<"text1" | "text2" | "clock" | "button">("text1");

  // Sequence flow timer logic
  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("text2");
    }, 3500);

    const t2 = setTimeout(() => {
      setPhase("clock");
    }, 7000);

    const t3 = setTimeout(() => {
      setPhase("button");
    }, 9500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent overflow-hidden select-none">
      {/* Ambient glowing clouds */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-ocean/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-sky/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center w-full max-w-xl">
        <AnimatePresence mode="wait">
          {phase === "text1" && (
            <motion.p
              key="text1"
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
              className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl italic text-white/70"
            >
              Every day has thousands of moments...
            </motion.p>
          )}

          {phase === "text2" && (
            <motion.p
              key="text2"
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
              className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl italic text-white/70"
            >
              But only one belongs to us.
            </motion.p>
          )}

          {(phase === "clock" || phase === "button") && (
            <motion.div
              key="clock-container"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6, ease: [0.25, 0.8, 0.25, 1] }}
              className="flex flex-col items-center"
            >
              {/* Giant Glowing 11:11 */}
              <motion.h1
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="font-[family-name:var(--font-playfair)] text-7xl md:text-9xl text-white text-glow-intense tracking-wider font-light mb-12 select-none"
              >
                11:11
              </motion.h1>

              {/* Reveal "✨ Open My Wish" Button */}
              <div className="h-20 flex items-center justify-center">
                <AnimatePresence>
                  {phase === "button" && (
                    <motion.button
                      onClick={onComplete}
                      initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      whileHover={{
                        scale: 1.02,
                        borderColor: "rgba(139, 214, 255, 0.3)",
                        boxShadow: "0 0 30px rgba(139, 214, 255, 0.25), 0 8px 32px rgba(0, 0, 0, 0.3)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="relative px-10 py-4 glass-button rounded-full cursor-pointer overflow-hidden font-[family-name:var(--font-inter)] text-sm tracking-[0.2em] text-white uppercase"
                    >
                      {/* Top liquid reflection */}
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent rounded-t-full pointer-events-none" />
                      <span className="relative z-10 flex items-center gap-2">
                        ✨ Open My Wish
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
