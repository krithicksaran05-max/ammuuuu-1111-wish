"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site-config";

export default function RandomWishes() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % siteConfig.quotes.length);
    }, 6000); // rotate every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 px-6 overflow-hidden flex items-center justify-center bg-linear-to-r from-transparent via-navy/20 to-transparent">
      <div className="max-w-2xl w-full text-center z-10 min-h-[90px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIdx}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 0.8, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 1 }}
            className="font-playfair text-xl md:text-2xl text-sky-blue text-glow-blue italic font-light leading-relaxed px-4"
          >
            "{siteConfig.quotes[currentIdx]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
