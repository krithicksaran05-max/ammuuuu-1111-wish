"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig, MemoryItem } from "@/config/site-config";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function MemoryGallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handlePrev = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! === 0 ? siteConfig.gallery.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev! === siteConfig.gallery.length - 1 ? 0 : prev! + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      
      {/* Background glow decoration */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-sky-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-soft-purple/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto z-10 relative">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            className="font-montserrat text-xs tracking-[0.35em] text-sky-blue uppercase"
          >
            Captured Moments
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-playfair text-3xl md:text-5xl font-light text-white mt-2"
          >
            Memory Gallery
          </motion.h2>
          <p className="font-poppins text-sm text-silver/60 font-light mt-4 max-w-md mx-auto leading-relaxed">
            Beautiful steps of a wonderful journey, preserved inside glowing frames.
          </p>
        </div>

        {/* Masonry Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {siteConfig.gallery.map((item, idx) => {
            const hasError = imgErrors[item.id];
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                onClick={() => setSelectedIdx(idx)}
                className="break-inside-avoid relative rounded-xl overflow-hidden glass-card cursor-pointer group flex flex-col"
              >
                {/* Image Display or Aesthetic Gradient Fallback if file not uploaded */}
                <div className="relative w-full aspect-video overflow-hidden bg-navy/60">
                  {!hasError ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.85] group-hover:brightness-100"
                    />
                  ) : (
                    // Beautiful Abstract Gradient Fallback representing star skies
                    <div className="w-full h-full min-h-[180px] bg-linear-to-tr from-navy via-[#1e1b4b]/40 to-[#0c0a09] flex items-center justify-center p-6 relative">
                      <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(135,206,235,0.15) 0%, transparent 75%)" />
                      <span className="font-playfair text-4xl opacity-15 select-none text-sky-blue">💙</span>
                      {/* Floating star particles in placeholder */}
                      <span className="absolute top-4 left-6 text-[10px] text-sky-blue/20">★</span>
                      <span className="absolute bottom-6 right-8 text-[12px] text-sky-blue/20">★</span>
                      <span className="absolute top-1/2 right-12 text-[8px] text-sky-blue/20">★</span>
                    </div>
                  )}

                  {/* Glass Shimmer Reflection */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                    <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-linear-to-r from-transparent via-white/5 to-transparent transform -skew-x-20 transition-transform duration-700 group-hover:translate-x-[150%]" />
                  </div>
                </div>

                {/* Info details */}
                <div className="p-5 flex flex-col space-y-2 relative bg-navy/20">
                  <div className="flex items-center space-x-1.5 text-sky-blue/70">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-montserrat text-[10px] tracking-wider uppercase">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-playfair text-lg text-white font-medium group-hover:text-sky-blue transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="font-poppins text-xs text-silver/60 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lightbox / Fullscreen Viewer */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 p-4 md:p-12 backdrop-blur-md"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIdx(null)}
                className="absolute top-6 right-6 p-2 rounded-full glass-panel hover:border-sky-blue/40 text-white cursor-pointer transition-colors z-25"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full glass-panel hover:border-sky-blue/40 text-white cursor-pointer transition-colors z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full glass-panel hover:border-sky-blue/40 text-white cursor-pointer transition-colors z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Display Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="max-w-4xl w-full glass-panel border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10"
              >
                {/* Photo Display */}
                <div className="w-full md:w-3/5 aspect-video md:aspect-auto md:h-[450px] bg-black flex items-center justify-center overflow-hidden">
                  {!imgErrors[siteConfig.gallery[selectedIdx].id] ? (
                    <img
                      src={siteConfig.gallery[selectedIdx].image}
                      alt={siteConfig.gallery[selectedIdx].title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[250px] bg-linear-to-tr from-navy to-[#1e1b4b] flex items-center justify-center p-6 relative">
                      <span className="font-playfair text-6xl opacity-15 select-none text-sky-blue">💙</span>
                      <span className="absolute top-10 left-12 text-[12px] text-sky-blue/20">★</span>
                      <span className="absolute bottom-12 right-16 text-[14px] text-sky-blue/20">★</span>
                    </div>
                  )}
                </div>

                {/* Details info */}
                <div className="w-full md:w-2/5 p-8 flex flex-col justify-between bg-navy/90 border-t md:border-t-0 md:border-l border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1.5 text-sky-blue">
                      <Calendar className="w-4 h-4" />
                      <span className="font-montserrat text-[11px] tracking-wider uppercase">
                        {siteConfig.gallery[selectedIdx].date}
                      </span>
                    </div>
                    <h3 className="font-playfair text-2xl text-white font-medium">
                      {siteConfig.gallery[selectedIdx].title}
                    </h3>
                    <div className="w-12 h-[1px] bg-sky-blue/50" />
                    <p className="font-poppins text-sm text-silver/85 font-light leading-relaxed">
                      {siteConfig.gallery[selectedIdx].description}
                    </p>
                  </div>

                  <div className="mt-8 text-sky-blue/40 font-montserrat text-[9px] tracking-widest uppercase">
                    Moments Shared
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
