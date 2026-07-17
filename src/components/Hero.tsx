"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site-config";

export default function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center (normalized from -0.5 to 0.5)
    const mouseX = (e.clientX - rect.left - width / 2) / width;
    const mouseY = (e.clientY - rect.top - height / 2) / height;

    // Set max tilt to 12 degrees
    setTilt({
      x: mouseX * 12,
      y: -mouseY * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-blue/20 blur-[120px] animate-[aurora_15s_linear_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-soft-purple/15 blur-[150px] animate-[aurora_20s_linear_infinite_reverse]" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center z-10">
        
        {/* Left Column: Wording */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col text-center md:text-left space-y-6"
        >
          <span className="font-montserrat text-xs tracking-[0.4em] text-sky-blue uppercase font-medium">
            Princess of the Night Sky
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl font-light text-white leading-tight">
            {siteConfig.girlName} <span className="text-sky-blue text-glow-blue">{siteConfig.favoriteHeartEmoji}</span>
          </h1>
          <p className="font-poppins text-lg text-silver/80 font-light max-w-md leading-relaxed">
            Someone who deserves endless happiness.
          </p>
          <div className="pt-4 flex justify-center md:justify-start gap-4">
            <span className="w-16 h-[1px] bg-sky-blue/30 self-center" />
            <span className="font-dancing text-2xl text-lavender tracking-wider">
              May your life be as radiant as the stars.
            </span>
          </div>
        </motion.div>

        {/* Right Column: Floating Glass Portrait Frame */}
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative group cursor-pointer"
          >
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-sky-blue/20 rounded-2xl blur-3xl opacity-60 group-hover:scale-105 group-hover:bg-sky-blue/35 transition-all duration-700" />
            
            {/* Tilt Frame */}
            <div
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: "transform 0.1s ease-out",
              }}
              className="relative w-[280px] sm:w-[320px] md:w-[350px] aspect-[3/4] rounded-2xl p-3 glass-panel border border-sky-blue/20 shadow-2xl animate-[float_6s_ease-in-out_infinite]"
            >
              {/* Inner Frame */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-navy/85 border border-white/5 flex flex-col justify-between p-6">
                
                {/* Glowing border glow outline */}
                <div className="absolute inset-0 border border-sky-blue/0 group-hover:border-sky-blue/30 rounded-xl transition-colors duration-700 pointer-events-none" />

                {/* Shimmer overlay reflection sheen */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-20 transition-transform duration-1000 group-hover:translate-x-[150%]" />
                </div>

                {/* Celestial Portrait representation (Gorgeous vector art background) */}
                <div className="absolute inset-0 z-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id="celestial-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.4" />
                        <stop offset="60%" stopColor="#8A2BE2" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                      </radialGradient>
                      <filter id="blur-filter">
                        <feGaussianBlur stdDeviation="8" />
                      </filter>
                    </defs>
                    <rect width="100" height="100" fill="#020617" />
                    
                    {/* Glowing nebulas */}
                    <circle cx="50" cy="40" r="30" fill="url(#celestial-glow)" />
                    <circle cx="30" cy="70" r="25" fill="#8A2BE2" fillOpacity="0.15" filter="url(#blur-filter)" />
                    <circle cx="70" cy="20" r="20" fill="#87CEEB" fillOpacity="0.15" filter="url(#blur-filter)" />
                    
                    {/* Golden Stars constellation overlay */}
                    <path d="M15,20 L30,45 L50,15 L70,55 L88,30" stroke="rgba(135, 206, 235, 0.25)" strokeWidth="0.5" fill="none" />
                    <circle cx="15" cy="20" r="1" fill="#fff" />
                    <circle cx="30" cy="45" r="1" fill="#fff" />
                    <circle cx="50" cy="15" r="1.5" fill="#fff" className="animate-ping" />
                    <circle cx="70" cy="55" r="1" fill="#fff" />
                    <circle cx="88" cy="30" r="1" fill="#fff" />

                    {/* Glowing Crescent Moon representation */}
                    <path d="M72,25 C67,25 63,29 63,34 C63,38 66,42 71,43 C67,43 62,39 62,34 C62,29 67,25 72,25 Z" fill="rgba(255, 255, 255, 0.65)" />
                  </svg>
                </div>

                {/* Floating butterflies inside frame */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 animate-bounce duration-3000 opacity-60">🦋</div>
                  <div className="absolute bottom-1/4 right-1/4 animate-bounce duration-5000 opacity-40">🦋</div>
                </div>

                {/* Top Corner Details */}
                <div className="relative flex justify-between items-start z-10 w-full">
                  <span className="font-montserrat text-[10px] text-sky-blue/60 tracking-wider">
                    EST. 11:11
                  </span>
                  <div className="text-sky-blue text-glow-blue text-sm">🌷</div>
                </div>

                {/* Bottom Details (Text Info) */}
                <div className="relative z-10 mt-auto w-full flex flex-col space-y-2">
                  <div className="h-[1px] w-full bg-linear-to-r from-sky-blue/40 to-transparent" />
                  <span className="font-playfair text-xl text-white font-medium">
                    Celestial Art
                  </span>
                  <span className="font-poppins text-xs text-silver/60">
                    Dedicated to Ammuuuu
                  </span>
                </div>

              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
