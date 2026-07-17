"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { siteConfig } from "@/config/site-config";
import DreamCanvas from "./DreamCanvas";
import confetti from "canvas-confetti";

interface OpeningExperienceProps {
  onComplete: () => void;
}

export default function OpeningExperience({ onComplete }: OpeningExperienceProps) {
  const { isPlaying, togglePlay, playSparkle } = useAudio();
  const [started, setStarted] = useState(false);
  const [clockState, setClockState] = useState<"ticking" | "1111">("ticking");
  const [clockTime, setClockTime] = useState("11:10:55");
  const [currentTextIdx, setCurrentTextIdx] = useState(0);
  const [showAmmuuuu, setShowAmmuuuu] = useState(false);
  const [showWishClose, setShowWishClose] = useState(false);
  const [showBeginBtn, setShowBeginBtn] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [canvasTriggerStar, setCanvasTriggerStar] = useState(false);

  const texts = [
    "It's 11:11...",
    "A magical moment...",
    "Every wish begins with hope...",
    "This wish is specially for...",
  ];

  // Start the experience after tapping
  const handleStart = () => {
    setStarted(true);
    togglePlay(); // starts audio
  };

  // Clock countdown logic
  useEffect(() => {
    if (!started) return;

    let count = 55;
    const interval = setInterval(() => {
      count++;
      if (count < 60) {
        setClockTime(`11:10:${count}`);
      } else {
        clearInterval(interval);
        trigger1111();
      }
    }, 1500); // slightly slower than 1s to feel dreamy and deliberate

    return () => clearInterval(interval);
  }, [started]);

  const trigger1111 = () => {
    setClockState("1111");
    playSparkle();
    setCanvasTriggerStar(true);
    
    // Confetti burst (sky blue and white glow)
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#87CEEB", "#BFEFFF", "#ffffff"],
    });

    // Start text sequence
    setTimeout(() => {
      startTextSequence();
    }, 2000);
  };

  const startTextSequence = () => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < texts.length) {
        setCurrentTextIdx(currentIdx);
        currentIdx++;
      } else {
        clearInterval(interval);
        // Show name
        setShowAmmuuuu(true);
        playSparkle();
        
        // Show next prompts
        setTimeout(() => {
          setShowWishClose(true);
          setTimeout(() => {
            setShowBeginBtn(true);
          }, 2000);
        }, 3000);
      }
    }, 3000); // 3 seconds per line of text
  };

  const handleBegin = () => {
    setIsTransitioning(true);
    playSparkle();

    // Trigger visual explosion
    const duration = 2.5 * 1000;
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
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ["#87CEEB", "#ffffff"] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ["#87CEEB", "#ffffff"] });
    }, 250);

    // Zoom camera effect simulation and then complete
    setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617] overflow-hidden select-none">
      {/* Background stars (fading in) */}
      <DreamCanvas state={started ? "opening" : "opening"} triggerShootingStar={canvasTriggerStar} />

      <AnimatePresence mode="wait">
        {!started ? (
          // Initial Screen: Completely Dark with entering prompt
          <motion.div
            key="pre-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleStart}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#01030a] cursor-pointer"
          >
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="font-playfair text-xl tracking-[0.2em] text-sky-blue/80 text-center px-4"
            >
              Tap the night sky to begin the journey...
            </motion.p>
          </motion.div>
        ) : (
          // Active Opening Screen
          <motion.div
            key="started"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex flex-col items-center justify-center"
          >
            {/* Moving Soft Clouds */}
            <div className="absolute top-1/4 left-[-10%] w-[40%] h-[15%] bg-sky-blue/5 rounded-full blur-[80px] pointer-events-none animate-[float_12s_ease-in-out_infinite]" />
            <div className="absolute bottom-1/3 right-[-10%] w-[35%] h-[15%] bg-soft-purple/5 rounded-full blur-[80px] pointer-events-none animate-[float_16s_ease-in-out_infinite]" />

            {/* Fading Moon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: clockState === "1111" ? 0.95 : 0.6, scale: 1 }}
              transition={{ delay: 3, duration: 6 }}
              className="absolute top-16 md:top-24 right-16 md:right-32 w-20 md:w-32 h-20 md:h-32 rounded-full pointer-events-none flex items-center justify-center"
            >
              {/* Moon Glow */}
              <div
                className={`absolute inset-0 bg-white/10 rounded-full blur-xl transition-all duration-[3000ms] ${
                  clockState === "1111" ? "bg-sky-blue/30 scale-125 blur-2xl" : "scale-100"
                }`}
              />
              {/* Moon surface */}
              <div className="w-full h-full bg-linear-to-tr from-silver/70 to-white/95 rounded-full shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.1),0_0_20px_rgba(255,255,255,0.4)]" />
            </motion.div>

            {/* Main Interactive Sequence */}
            <div className="relative flex flex-col items-center max-w-lg px-6 text-center z-10">
              <AnimatePresence mode="wait">
                {clockState === "ticking" ? (
                  // Countdown Clock
                  <motion.div
                    key="clock"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="font-montserrat text-sm tracking-[0.3em] text-silver/60 uppercase mb-3">
                      Silent Hours
                    </span>
                    <span className="font-playfair text-5xl md:text-6xl text-sky-blue tracking-wider text-glow-blue font-light">
                      {clockTime}
                    </span>
                  </motion.div>
                ) : (
                  // Magical 11:11 State
                  <motion.div
                    key="magic-1111"
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="flex flex-col items-center"
                  >
                    {/* Glowing clock */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="font-playfair text-6xl md:text-8xl text-white text-glow-white tracking-widest font-extralight mb-12"
                    >
                      ✨ 11:11 ✨
                    </motion.div>

                    {/* Sequential fading texts */}
                    <div className="h-16 flex items-center justify-center mb-6">
                      <AnimatePresence mode="wait">
                        {currentTextIdx < texts.length && !showAmmuuuu && (
                          <motion.p
                            key={currentTextIdx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 0.9, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.8 }}
                            className="font-poppins text-lg md:text-xl tracking-wide text-silver/80 font-light"
                          >
                            {texts[currentTextIdx]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Beautiful reveal of Ammuuuu */}
                    <div className="h-28 flex flex-col items-center justify-center mb-8">
                      <AnimatePresence>
                        {showAmmuuuu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="flex flex-col items-center"
                          >
                            <h1 className="font-dancing text-6xl md:text-7xl text-sky-blue text-glow-blue py-2">
                              💙 {siteConfig.girlName} 💙
                            </h1>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Make a Wish prompt */}
                    <div className="h-12 flex items-center justify-center mb-10">
                      <AnimatePresence>
                        {showWishClose && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="flex flex-col items-center"
                          >
                            <p className="font-playfair text-lg md:text-xl tracking-[0.1em] text-silver italic">
                              Close your eyes... Make a Wish...
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Begin button */}
                    <div className="h-16 flex items-center justify-center">
                      <AnimatePresence>
                        {showBeginBtn && (
                          <motion.button
                            onClick={handleBegin}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(135,206,235,0.6)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.8 }}
                            className="px-8 py-3.5 glass-panel text-white font-montserrat tracking-widest text-sm rounded-full cursor-pointer hover:border-sky-blue/50 border border-sky-blue/20 transition-all duration-300 flex items-center gap-3"
                          >
                            <span>✨ Begin the Journey ✨</span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition screen masking overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)", scale: 1 }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)", scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#020617]/85 z-50 flex items-center justify-center pointer-events-none"
          >
            {/* Glowing connecting constellation effect */}
            <div className="w-64 h-64 border border-sky-blue/10 rounded-full animate-ping absolute" />
            <div className="w-96 h-96 border border-sky-blue/5 rounded-full animate-[ping_4s_linear_infinite] absolute" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
