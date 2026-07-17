"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useAudio } from "./AudioProvider";

export default function SecretSurprise() {
  const { playSparkle } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [found, setFound] = useState(false);

  const handleFindTulip = () => {
    if (found) return;
    setFound(true);
    setIsOpen(true);
    playSparkle();

    // Trigger massive blue & silver fireworks/confetti explosions!
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Blue, light blue, silver, white bursts
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#87CEEB", "#BFEFFF", "#ffffff", "#C0C0C0"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#87CEEB", "#BFEFFF", "#ffffff", "#C0C0C0"],
      });
    }, 250);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Allow finding it again if they reload, or keep it found
  };

  return (
    <>
      {/* Hidden Easter Egg: Tiny floating blue tulip in the corner */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-40 select-none pointer-events-auto">
          <button
            onClick={handleFindTulip}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-navy/30 hover:bg-navy/80 border border-white/5 hover:border-sky-blue/30 opacity-20 hover:opacity-100 shadow-md transition-all duration-500 group cursor-pointer"
          >
            {/* Glowing Blue Tulip Icon */}
            <span className="text-sm group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_8px_#87CEEB]">
              🌷
            </span>
          </button>
        </div>
      )}

      {/* Secret Modal Reveal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 backdrop-blur-md p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="max-w-md w-full glass-panel border border-sky-blue/40 rounded-2xl p-8 text-center relative shadow-[0_0_50px_rgba(135,206,235,0.3)]"
              style={{
                animation: "float 6s ease-in-out infinite",
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full glass-panel hover:border-sky-blue/50 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glowing header icon */}
              <div className="w-16 h-16 rounded-full bg-sky-blue/10 border border-sky-blue/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(135,206,235,0.2)]">
                <Sparkles className="w-8 h-8 text-sky-blue animate-pulse" />
              </div>

              {/* Message */}
              <span className="font-montserrat text-[10px] tracking-[0.3em] text-sky-blue uppercase font-medium">
                Secret Surprise Unlocked
              </span>
              <h3 className="font-playfair text-2xl md:text-3xl text-white font-light mt-3 leading-relaxed">
                "I hope every 11:11 wish you ever make comes true."
              </h3>
              
              <div className="w-12 h-[1px] bg-sky-blue/40 mx-auto my-6" />
              
              <p className="font-dancing text-xl text-lavender/90">
                May the stars always guide your dreams.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
