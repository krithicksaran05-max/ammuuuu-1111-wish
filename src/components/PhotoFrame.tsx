"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";

export default function PhotoFrame() {
  const parallax = useParallax(0.015);
  const [wishMessage, setWishMessage] = useState<string | null>(null);
  const [showWishResponse, setShowWishResponse] = useState(false);
  const [imgSrc, setImgSrc] = useState("/images/my-photo.png");

  useEffect(() => {
    if (showWishResponse) {
      setImgSrc("/images/wish-photo.png");
    } else {
      setImgSrc("/images/my-photo.png");
    }
  }, [showWishResponse]);

  const handleWishSubmitted = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const wishText = detail?.text || "";

    setWishMessage(wishText);
    setShowWishResponse(true);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setShowWishResponse(false);
      setTimeout(() => setWishMessage(null), 600);
    }, 10000);
  }, []);

  useEffect(() => {
    window.addEventListener("wish-submitted", handleWishSubmitted);
    return () => {
      window.removeEventListener("wish-submitted", handleWishSubmitted);
    };
  }, [handleWishSubmitted]);

  return (
    <section
      id="photo-section"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-24 z-10"
    >
      {/* Ambient glow behind frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-glow/5 blur-[100px]" />
      </div>

      {/* Floating Glass Frame */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px) perspective(1000px) rotateX(${parallax.rotateX}deg) rotateY(${parallax.rotateY}deg)`,
        }}
        className="relative group"
      >
        {/* Animated border glow — intensifies when wish arrives */}
        <motion.div
          className="absolute -inset-[2px] rounded-3xl overflow-hidden z-0"
          animate={{
            opacity: showWishResponse ? 1 : 0.7,
          }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: showWishResponse
                ? "linear-gradient(135deg, rgba(139,214,255,0.8), rgba(63,142,252,0.4), rgba(139,214,255,0.8), rgba(63,142,252,0.4))"
                : "linear-gradient(135deg, rgba(139,214,255,0.4), rgba(63,142,252,0.15), rgba(139,214,255,0.4), rgba(14,77,146,0.15))",
              backgroundSize: "300% 300%",
              animation: showWishResponse
                ? "aurora 3s linear infinite"
                : "aurora 6s linear infinite",
              transition: "all 1s ease",
            }}
          />
        </motion.div>

        {/* Glass container */}
        <div className="relative glass-photo rounded-3xl p-3 md:p-4 z-10">
          {/* Inner reflection highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/[0.07] to-transparent rounded-t-3xl pointer-events-none z-20" />

          {/* Photo */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Photo with transformation when wish arrives */}
            <motion.img
              src={imgSrc}
              onError={() => {
                if (imgSrc !== "/images/my-photo.png") {
                  setImgSrc("/images/my-photo.png");
                }
              }}
              alt="Our precious moment"
              className="w-[280px] h-[350px] sm:w-[320px] sm:h-[400px] md:w-[400px] md:h-[500px] object-cover rounded-2xl"
              animate={{
                scale: showWishResponse ? 1.08 : 1,
                filter: showWishResponse
                  ? "brightness(1.15) saturate(1.2)"
                  : "brightness(1) saturate(1)",
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            />

            {/* Dreamy glow overlay when wish is active */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                opacity: showWishResponse ? 1 : 0,
              }}
              transition={{ duration: 1 }}
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(139,214,255,0.15), transparent 70%)",
              }}
            />

            {/* Photo overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/30 via-transparent to-transparent rounded-2xl pointer-events-none" />

            {/* ═══ WISH RESPONSE OVERLAY ═══ */}
            <AnimatePresence>
              {showWishResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-30"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(0,27,68,0.88) 0%, rgba(0,27,68,0.65) 60%, rgba(0,27,68,0.4) 100%)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {/* Magical glow behind the text */}
                  <motion.div
                    className="absolute w-[220px] h-[220px] rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(139,214,255,0.3) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Sparkle dots */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-sky rounded-full"
                      style={{
                        top: `${15 + Math.random() * 70}%`,
                        left: `${10 + Math.random() * 80}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 2, 0.5],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}

                  <motion.div
                    initial={{ y: 25, opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                    className="relative z-10 text-center px-6 max-w-[280px] md:max-w-[360px]"
                  >
                    {/* Incoming wish label */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-[10px] tracking-[0.3em] text-sky/70 uppercase font-semibold mb-5"
                    >
                      ✨ Wish Received ✨
                    </motion.div>

                    {/* The user's wish text */}
                    {wishMessage && (
                      <motion.p
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl text-white/90 italic leading-relaxed mb-6"
                      >
                        &ldquo;{wishMessage}&rdquo;
                      </motion.p>
                    )}

                    {/* Divider line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                      className="w-20 h-[1px] bg-gradient-to-r from-transparent via-sky/60 to-transparent mx-auto mb-6"
                    />

                    {/* The magical response in Tamil — with proper Tamil font */}
                    <motion.div
                      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 1.6, duration: 1, ease: "easeOut" }}
                    >
                      <p
                        className="text-2xl md:text-3xl text-white font-semibold text-glow leading-snug mb-1"
                        style={{ fontFamily: "var(--font-tamil), 'Noto Sans Tamil', sans-serif" }}
                      >
                        உங்களோட wish-ah
                      </p>
                      <p
                        className="text-2xl md:text-3xl text-white font-semibold text-glow leading-snug mb-1"
                        style={{ fontFamily: "var(--font-tamil), 'Noto Sans Tamil', sans-serif" }}
                      >
                        நா நிறைவேற்றுறேன் 💫
                      </p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.4, duration: 0.8 }}
                        className="font-[family-name:var(--font-cormorant)] text-sm text-white/40 italic mt-4"
                      >
                        &ldquo;I will fulfill your wish&rdquo;
                      </motion.p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Outer glow effect — enhanced when wish active */}
        <motion.div
          className="absolute -inset-8 rounded-[2rem] blur-2xl pointer-events-none z-0"
          animate={{
            opacity: showWishResponse ? 0.6 : 0,
            backgroundColor: showWishResponse
              ? "rgba(139, 214, 255, 0.12)"
              : "rgba(139, 214, 255, 0.05)",
          }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
        viewport={{ once: true }}
        className="mt-12 md:mt-16 text-center max-w-sm"
      >
        <p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl text-white/60 italic leading-relaxed">
          My favourite place…
        </p>
        <p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl text-white/80 italic leading-relaxed mt-1">
          is wherever you are.
        </p>
      </motion.div>
    </section>
  );
}
