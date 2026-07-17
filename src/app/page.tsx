"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/hooks/useAudio";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import CosmicLoader from "@/components/CosmicLoader";
import PhotoFrame from "@/components/PhotoFrame";
import LoveLetter from "@/components/LoveLetter";
import MemoryStars from "@/components/MemoryStars";
import WishJar from "@/components/WishJar";
import TulipGarden from "@/components/TulipGarden";
import AudioVisualizer from "@/components/AudioVisualizer";
import MagicEvent from "@/components/MagicEvent";
import CursorSparkle from "@/components/CursorSparkle";
import EasterEggs from "@/components/EasterEggs";
import BackgroundHeart from "@/components/BackgroundHeart";
import FloatingElements from "@/components/FloatingElements";

type ExperienceStage = "splash" | "loader" | "sanctuary";

export default function Home() {
  const [stage, setStage] = useState<ExperienceStage>("splash");
  const [isMagicActive, setIsMagicActive] = useState(false);

  // Initialize smooth scroll (Lenis)
  useSmoothScroll();

  // Initialize luxury audio system
  const { isPlaying, toggle, play, triggerHaptic, audioRef } = useAudio();

  const handleEnterSanctuary = () => {
    triggerHaptic("heavy");
    // Start music immediately on user interaction
    play();
    setStage("loader");
  };

  const handleLoaderComplete = () => {
    triggerHaptic("medium");
    setStage("sanctuary");
  };

  return (
    <main className="relative min-h-screen bg-deep-navy selection:bg-azure/30 overflow-x-hidden">
      {/* Custom interactive sparkle cursor */}
      <CursorSparkle />

      {/* Hidden Easter Eggs */}
      <EasterEggs />

      {/* Living Starfield Canvas (always active) */}
      <StarfieldCanvas isMagicTime={isMagicActive} intensity={stage === "splash" ? 0.45 : 0.65} />

      {/* Pulsing skyblue heart background (always active) */}
      <BackgroundHeart />

      {/* Floating tulips & butterflies (always active) */}
      <FloatingElements />

      <AnimatePresence mode="wait">
        {/* Stage 1: Entrance Splash Screen */}
        {stage === "splash" && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent overflow-hidden select-none"
          >
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-ocean/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-sky/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="text-center px-6 relative z-10 max-w-sm flex flex-col items-center">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white font-light tracking-wide mb-3 text-center"
              >
                11:11 Wish for my Bbyyy Doll 🌷🧿🩵
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="font-[family-name:var(--font-cormorant)] text-lg text-white/50 italic mb-10"
              >
                A magical space made just for you
              </motion.p>

              <motion.button
                onClick={handleEnterSanctuary}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                whileHover={{
                  scale: 1.02,
                  borderColor: "rgba(139, 214, 255, 0.3)",
                  boxShadow: "0 0 30px rgba(139, 214, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 glass-button rounded-full text-white font-[family-name:var(--font-inter)] text-xs tracking-[0.25em] uppercase font-semibold cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent rounded-t-full pointer-events-none" />
                <span>Open My Wish</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Stage 2: Cinematic Loader (Music playing) */}
        {stage === "loader" && (
          <CosmicLoader key="loader" onComplete={handleLoaderComplete} />
        )}

        {/* Stage 3: The Main sanctuary experience */}
        {stage === "sanctuary" && (
          <motion.div
            key="sanctuary-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="relative min-h-screen"
          >
            {/* Minimalist Floating Audio Control Header */}
            <header className="fixed top-0 left-0 right-0 z-40 p-6 md:p-8 flex justify-between items-center pointer-events-none safe-area-top">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="font-[family-name:var(--font-playfair)] text-sm tracking-[0.25em] text-white/50 select-none"
              >
                11:11
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="pointer-events-auto relative w-12 h-12 flex items-center justify-center"
              >
                {/* Reactive visualizer orbits the button */}
                <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />

                <button
                  onClick={() => {
                    toggle();
                    triggerHaptic("light");
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full glass border border-white/10 hover:border-white/20 transition-colors cursor-pointer relative z-10"
                  aria-label="Toggle sound"
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent rounded-t-full pointer-events-none" />

                  {/* Visualizer bars */}
                  <div className="flex gap-[3px] items-end h-2.5">
                    <span
                      className={`w-[1.5px] bg-white rounded-full transition-all duration-300 ${
                        isPlaying
                          ? "animate-[sound-wave_1.2s_ease-in-out_infinite]"
                          : "h-1 opacity-40"
                      }`}
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className={`w-[1.5px] bg-white rounded-full transition-all duration-300 ${
                        isPlaying
                          ? "animate-[sound-wave_1.2s_ease-in-out_infinite]"
                          : "h-2 opacity-40"
                      }`}
                      style={{ animationDelay: "0.3s" }}
                    />
                    <span
                      className={`w-[1.5px] bg-white rounded-full transition-all duration-300 ${
                        isPlaying
                          ? "animate-[sound-wave_1.2s_ease-in-out_infinite]"
                          : "h-1.5 opacity-40"
                      }`}
                      style={{ animationDelay: "0s" }}
                    />
                  </div>
                </button>
              </motion.div>
            </header>

            {/* Core Sanctuary Pages */}
            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Photo Frame Section */}
              <PhotoFrame />

              {/* Staggered text Love Letter */}
              <LoveLetter />

              {/* Interactive Memories Stars Constellation */}
              <MemoryStars />

              {/* Wish Jar Star Sender */}
              <WishJar />

              {/* Magical Blooming Tulip Garden */}
              <TulipGarden />
            </div>

            {/* Magic Event overlay timer */}
            <MagicEvent
              playAudio={play}
              triggerHaptic={triggerHaptic}
              onStateChange={setIsMagicActive}
            />

            {/* Global audio visualizer CSS anims */}
            <style jsx global>{`
              @keyframes sound-wave {
                0%, 100% { height: 3px; }
                50% { height: 12px; }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
