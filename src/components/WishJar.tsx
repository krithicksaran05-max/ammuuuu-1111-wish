"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site-config";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAudio } from "./AudioProvider";

export default function WishJar() {
  const { playSparkle } = useAudio();
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [jarStars, setJarStars] = useState<{ id: number; left: number; top: number; delay: number; scale: number }[]>([]);

  // Generate random positions for stars inside the jar
  useEffect(() => {
    const stars = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: 15 + Math.random() * 70, // percentage x inside jar width
      top: 30 + Math.random() * 55,  // percentage y inside jar height
      delay: Math.random() * 2,
      scale: Math.random() * 0.8 + 0.4,
    }));
    setJarStars(stars);
  }, []);

  const handleRevealWish = () => {
    if (isShaking) return;
    setIsShaking(true);
    playSparkle();

    // Trigger random wish after shake completes
    setTimeout(() => {
      const wishes = siteConfig.wishes;
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      setCurrentWish(randomWish);
      setIsShaking(false);
    }, 700);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background aurora */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-sky-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full flex flex-col items-center z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            className="font-montserrat text-xs tracking-[0.35em] text-sky-blue uppercase"
          >
            Vessel of Stars
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-playfair text-3xl md:text-4xl font-light text-white mt-2"
          >
            Magical Wish Jar
          </motion.h2>
          <p className="font-poppins text-sm text-silver/60 font-light mt-3 max-w-sm mx-auto leading-relaxed">
            Tap the glowing glass jar to shake the cosmic stars and release a special wish.
          </p>
        </div>

        {/* Jar and Scroll layout */}
        <div className="flex flex-col items-center space-y-12 w-full mt-6">
          
          {/* Glowing Jar container */}
          <motion.div
            onClick={handleRevealWish}
            animate={
              isShaking
                ? {
                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                    rotate: [0, -4, 4, -4, 4, -2, 2, 0],
                  }
                : {}
            }
            transition={{ duration: 0.6 }}
            className="relative w-48 h-64 cursor-pointer group flex items-center justify-center select-none"
          >
            {/* Back glow */}
            <div className="absolute inset-0 bg-sky-blue/15 rounded-full blur-2xl group-hover:scale-110 group-hover:bg-sky-blue/20 transition-all duration-700 pointer-events-none" />
            
            {/* Jar Neck / Lid */}
            <div className="absolute top-2 w-28 h-6 bg-linear-to-r from-silver/70 via-white/80 to-silver/70 rounded-md border border-white/20 shadow-md z-15" />
            <div className="absolute top-8 w-24 h-3 bg-sky-blue/20 border border-white/5 z-10" />

            {/* Jar Body Glass */}
            <div className="absolute inset-x-4 top-8 bottom-0 rounded-t-3xl rounded-b-5xl glass-panel border border-white/25 shadow-2xl flex items-center justify-center overflow-hidden z-10">
              
              {/* Liquid reflection sheen */}
              <div className="absolute top-0 bottom-0 left-2 w-6 bg-white/5 blur-[2px] skew-x-6 rounded-l-3xl pointer-events-none" />
              
              {/* Sparkly reflection overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-linear-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 transition-transform duration-700 group-hover:translate-x-[150%]" />
              </div>

              {/* Floating Jar Stars */}
              {jarStars.map((star) => (
                <motion.div
                  key={star.id}
                  style={{
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    scale: [star.scale, star.scale * 1.3, star.scale],
                    opacity: [0.3, 0.9, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: star.delay,
                    ease: "easeInOut",
                  }}
                  className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#87CEEB]"
                />
              ))}

              {/* Magical energy core glow */}
              <div className="absolute bottom-6 w-24 h-24 rounded-full bg-sky-blue/10 blur-xl pointer-events-none animate-pulse" />
            </div>

            {/* Tap icon indicator */}
            <div className="absolute bottom-[-16px] flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300 font-montserrat text-[10px] text-sky-blue tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> TAP TO SHAKE
            </div>
          </motion.div>

          {/* Opened wish parchment scroll overlay */}
          <div className="h-32 w-full max-w-lg flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentWish && (
                <motion.div
                  key={currentWish}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="w-full rounded-2xl p-6 glass-panel-light border border-sky-blue/30 shadow-[0_0_15px_rgba(135,206,235,0.15)] flex flex-col items-center text-center space-y-4 relative"
                >
                  {/* Glowing icon */}
                  <div className="absolute top-[-16px] px-3.5 py-1 rounded-full glass-panel border border-sky-blue/30 text-sky-blue flex items-center gap-1.5 text-[9px] font-montserrat tracking-widest uppercase">
                    <Sparkles className="w-3 h-3 animate-spin" /> Revealed Wish
                  </div>

                  <p className="font-playfair text-lg md:text-xl text-white font-light tracking-wide pt-2 leading-relaxed">
                    "{currentWish}"
                  </p>

                  <button
                    onClick={handleRevealWish}
                    className="text-sky-blue/60 hover:text-sky-blue text-[10px] font-montserrat tracking-wider flex items-center gap-1 focus:outline-hidden hover:scale-105 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Get Another Wish
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
