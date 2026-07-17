"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { siteConfig } from "@/config/site-config";
import { useAudio } from "./AudioProvider";

interface EndingSectionProps {
  onEnterEnding: (isEnding: boolean) => void;
}

export default function EndingSection({ onEnterEnding }: EndingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.4 });
  const { playSparkle } = useAudio();

  useEffect(() => {
    onEnterEnding(isInView);
    if (isInView) {
      playSparkle();
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden bg-linear-to-t from-[#010206] to-transparent"
    >
      <div className="max-w-3xl w-full text-center z-10 space-y-8">
        
        {/* Sky blue heart icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-5xl text-glow-blue select-none"
        >
          💙
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-dancing text-5xl md:text-6xl text-sky-blue text-glow-blue font-bold"
        >
          Happy 11:11 {siteConfig.girlName}
        </motion.h2>

        {/* Beautiful ending text block */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="space-y-4 font-playfair text-lg md:text-xl text-lavender/90 font-light tracking-wide leading-relaxed italic"
        >
          <p>May every dream you dream become real.</p>
          <p>May every wish find its way to you.</p>
          <p>May happiness always stay with you.</p>
          <p className="not-italic font-poppins text-sm text-silver/60 tracking-widest uppercase py-2">
            Keep smiling. Keep shining.
          </p>
          <p>Never stop believing in magic.</p>
        </motion.div>

        {/* Emblems */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.7, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-2xl pt-4 select-none"
        >
          🌷✨
        </motion.div>

      </div>
    </section>
  );
}
