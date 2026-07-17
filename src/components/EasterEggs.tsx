"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function EasterEggs() {
  const [clickCount, setClickCount] = useState(0);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [showTapSecret, setShowTapSecret] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tap 11 times detection
  useEffect(() => {
    if (clickCount === 0) return;

    // Reset tap counter after 4 seconds of inactivity
    const resetTimer = setTimeout(() => {
      setClickCount(0);
    }, 4000);

    if (clickCount >= 11) {
      setClickCount(0);
      triggerTapSecret();
    }

    return () => clearTimeout(resetTimer);
  }, [clickCount]);

  const triggerTapSecret = () => {
    setShowTapSecret(true);

    // Multi-angle burst
    confetti({
      particleCount: 111,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#82C4FF", "#3F8EFC", "#B9E6FF", "#ffffff"],
    });

    setTimeout(() => {
      setShowTapSecret(false);
    }, 4500);
  };

  // Long press detection
  useEffect(() => {
    const handleStart = () => {
      longPressTimerRef.current = setTimeout(() => {
        setShowSecretMessage(true);
        // Soft trigger vibration if mobile
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(30);
        }
      }, 1500); // 1.5s press
    };

    const handleEnd = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };

    window.addEventListener("mousedown", handleStart);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchend", handleEnd);

    // Document click tracking for 11 taps
    const handleDocClick = (e: MouseEvent) => {
      // Prevent incrementing if clicking interactive elements
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("input")) {
        return;
      }
      setClickCount((prev) => prev + 1);
    };
    window.addEventListener("click", handleDocClick);

    return () => {
      window.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("click", handleDocClick);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Tap 11 times secret alert */}
      <AnimatePresence>
        {showTapSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 glass px-6 py-3 rounded-full text-center pointer-events-none"
          >
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-white/90 italic">
              ✨ You found the secret 11:11 wish! ❤️
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Long press secret message modal */}
      <AnimatePresence>
        {showSecretMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/80 backdrop-blur-md px-6 cursor-default"
            onClick={() => setShowSecretMessage(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-8 md:p-12 rounded-3xl max-w-sm text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-sky mb-4 font-light">
                Hidden Note
              </h3>
              <p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl text-white/80 italic leading-relaxed mb-6">
                "P.S. I love you more than all the stars in the night sky."
              </p>
              <button
                onClick={() => setShowSecretMessage(false)}
                className="font-[family-name:var(--font-inter)] text-xs text-white/40 hover:text-white/60 tracking-widest uppercase transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
