"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishJar() {
  const [wishText, setWishText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wish = wishText.trim();
    if (!wish || isSending) return;

    setIsSending(true);

    // Vibrate if mobile
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(40);
    }

    // Scroll smoothly to the photo section
    document.getElementById("photo-section")?.scrollIntoView({ behavior: "smooth" });

    // Dispatch global events
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("spawn-wish-star", {
          detail: { text: wish },
        })
      );
      window.dispatchEvent(
        new CustomEvent("wish-submitted", {
          detail: { text: wish },
        })
      );
    }

    // Simulate sending animations
    setTimeout(() => {
      setWishText("");
      setIsSending(false);
      setShowStatus(true);

      setTimeout(() => {
        setShowStatus(false);
      }, 4000);
    }, 1200);
  };

  return (
    <section
      id="wish-jar-section"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 z-10"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-sm z-10"
      >
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white font-light tracking-wide mb-4">
          The Cosmic Wish Jar
        </h2>
        <p className="font-[family-name:var(--font-cormorant)] text-lg text-white/50 italic">
          Type your deepest wish and release it to the night sky
        </p>
      </motion.div>

      {/* Jar Glass morphism wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
        viewport={{ once: true }}
        className="relative w-full max-w-md glass rounded-3xl p-8 md:p-10 flex flex-col items-center border-glow"
      >
        {/* Top reflection shine */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

        {/* Floating elements inside jar (visual ambient) */}
        <div className="absolute w-[180px] h-[180px] bg-sky/5 rounded-full blur-[40px] pointer-events-none" />

        {/* Jar top ring SVG decor */}
        <div className="w-16 h-4 bg-white/10 rounded-full border border-white/20 mb-8 flex items-center justify-center">
          <div className="w-12 h-1.5 bg-[#001B44] rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="w-full relative z-10 flex flex-col items-center">
          {/* Wish Input */}
          <div className="w-full relative mb-6">
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Write a wish for us..."
              maxLength={120}
              disabled={isSending}
              rows={3}
              className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.06] border border-white/10 focus:border-sky/50 text-white placeholder-white/30 text-sm focus:outline-none resize-none transition-all duration-300 font-[family-name:var(--font-inter)] leading-relaxed"
            />
            {/* Length count */}
            <span className="absolute bottom-3 right-4 text-[10px] text-white/30">
              {wishText.length}/120
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!wishText.trim() || isSending}
            className={`w-full py-4 rounded-full font-[family-name:var(--font-inter)] text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 cursor-pointer overflow-hidden relative ${
              wishText.trim() && !isSending
                ? "glass-button text-white border border-sky/30"
                : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            {isSending ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending to Stars...
              </span>
            ) : (
              "Send to Cosmos"
            )}
          </button>
        </form>

        {/* Temporary floating success label */}
        <AnimatePresence>
          {showStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute -bottom-16 text-center"
            >
              <p className="font-[family-name:var(--font-cormorant)] text-lg text-sky italic">
                ✨ Look up! Your wish has turned into a star...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
