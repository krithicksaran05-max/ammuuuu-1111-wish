"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTime } from "@/hooks/useTime";

interface MagicEventProps {
  playAudio: () => void;
  triggerHaptic: (style: "light" | "medium" | "heavy") => void;
  onStateChange: (isMagic: boolean) => void;
}

export default function MagicEvent({
  playAudio,
  triggerHaptic,
  onStateChange,
}: MagicEventProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasTriggeredThisMinute, setHasTriggeredThisMinute] = useState(false);

  const { isMagicTime } = useTime(() => {
    // This callback fires exactly at 11:11
    if (!hasTriggeredThisMinute) {
      triggerMagic();
    }
  });

  const triggerMagic = () => {
    setHasTriggeredThisMinute(true);
    setShowOverlay(true);
    onStateChange(true);
    playAudio();
    triggerHaptic("heavy");

    // Continuous fireworks/confetti for 11 seconds!
    const duration = 11 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 40 * (timeLeft / duration);

      // Heart/blue colors
      const colors = ["#82C4FF", "#3F8EFC", "#B9E6FF", "#ffffff"];

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors,
      });
    }, 250);
  };

  // Reset flag when we exit 11:11
  useEffect(() => {
    if (!isMagicTime) {
      setHasTriggeredThisMinute(false);
      setShowOverlay(false);
      onStateChange(false);
    }
  }, [isMagicTime, onStateChange]);

  const handleClose = () => {
    setShowOverlay(false);
    onStateChange(false);
    triggerHaptic("light");
  };

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-navy/95 backdrop-blur-md px-6 text-center select-none"
        >
          {/* Intense aurora background expansion */}
          <div className="absolute inset-0 bg-gradient-to-tr from-midnight via-ocean/20 to-deep-navy opacity-80 pointer-events-none" />

          {/* Floating magical elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-glow/15 rounded-full blur-[80px] animate-pulse-glow" />

          <motion.div
            initial={{ scale: 0.9, y: 30, filter: "blur(8px)" }}
            animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 0.9, y: -30, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="relative z-10 max-w-lg flex flex-col items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl text-white text-glow-intense tracking-widest font-light mb-6"
            >
              11:11
            </motion.div>

            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white font-light tracking-wide mb-8">
              A magical moment.
            </h2>

            <p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl text-white/80 italic leading-relaxed mb-12">
              "Every single wish, every single hope,<br />
              it always starts and ends with you."
            </p>

            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.02, borderColor: "rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="relative px-8 py-3.5 glass-button rounded-full text-white font-[family-name:var(--font-inter)] text-xs tracking-[0.2em] uppercase cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent rounded-t-full pointer-events-none" />
              <span>Back to the Wish</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
