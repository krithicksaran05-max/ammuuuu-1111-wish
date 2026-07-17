"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site-config";

interface HeroProps {
  customPhotoUrl?: string | null;
}

export default function Hero({ customPhotoUrl }: HeroProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left - width / 2) / width;
    const mouseY = (e.clientY - rect.top - height / 2) / height;

    setTilt({
      x: mouseX * 15, // tilt up to 15 degrees
      y: -mouseY * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden">
      
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-45">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-sky-blue/20 blur-[130px] animate-[aurora_15s_linear_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-soft-purple/15 blur-[160px] animate-[aurora_20s_linear_infinite_reverse]" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center z-10">
        
        {/* Left Column: Headline */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col text-center md:text-left space-y-6"
        >
          <span className="font-montserrat text-xs tracking-[0.45em] text-sky-blue uppercase font-semibold">
            Princess of the Night Sky
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl font-extralight text-white leading-tight">
            {siteConfig.girlName} <span className="text-sky-blue text-glow-blue animate-pulse">{siteConfig.favoriteHeartEmoji}</span>
          </h1>
          
          <div className="h-[1px] w-3/4 bg-linear-to-r from-sky-blue/40 to-transparent mx-auto md:mx-0" />
          
          <p className="font-poppins text-lg text-silver/80 font-light max-w-md leading-relaxed">
            Someone who deserves endless happiness, peace, and beautiful memories.
          </p>

          <div className="pt-4 flex justify-center md:justify-start gap-4">
            <span className="w-16 h-[1px] bg-sky-blue/30 self-center animate-pulse" />
            <span className="font-dancing text-2xl text-lavender tracking-wider">
              May your life be as radiant as the stars.
            </span>
          </div>
        </motion.div>

        {/* Right Column: Upgraded 3D Card Frame */}
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative group cursor-pointer"
          >
            {/* Holographic outer glow wrapper */}
            <div className="absolute inset-[-8px] bg-linear-to-tr from-sky-blue/15 via-soft-purple/10 to-baby-blue/15 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none" />

            {/* Glowing Border Rings */}
            <div className="absolute inset-[-1px] rounded-2xl bg-linear-to-r from-sky-blue/20 via-white/10 to-soft-purple/20 pointer-events-none z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Card Frame */}
            <div
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: "transform 0.1s ease-out",
              }}
              className="relative w-[300px] sm:w-[330px] md:w-[360px] aspect-[3/4] rounded-2xl p-3.5 glass-panel border border-white/10 shadow-2xl animate-[float_6s_ease-in-out_infinite]"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-navy/90 border border-white/5 flex flex-col justify-between p-6">
                
                {/* Dynamic light shimmer path */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden z-20">
                  <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-20 transition-transform duration-700 group-hover:translate-x-[150%]" />
                </div>

                {/* 3D Border Glow Reflection */}
                <div className="absolute inset-0 border border-sky-blue/0 group-hover:border-sky-blue/40 rounded-xl transition-all duration-500 pointer-events-none z-20" />

                {/* Portrait Content Box */}
                <div className="absolute inset-0 z-0">
                  {customPhotoUrl ? (
                    // Display uploaded portrait photo
                    <img
                      src={customPhotoUrl}
                      alt={siteConfig.girlName}
                      className="w-full h-full object-cover brightness-[0.8] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    // Celestial Art fallback (Gradient vector shape)
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <radialGradient id="celestial-glow-grad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.4" />
                          <stop offset="60%" stopColor="#8A2BE2" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                        </radialGradient>
                        <filter id="blur-filter-card">
                          <feGaussianBlur stdDeviation="8" />
                        </filter>
                      </defs>
                      <rect width="100" height="100" fill="#020617" />
                      <circle cx="50" cy="40" r="30" fill="url(#celestial-glow-grad)" />
                      <circle cx="30" cy="70" r="25" fill="#8A2BE2" fillOpacity="0.15" filter="url(#blur-filter-card)" />
                      <circle cx="70" cy="20" r="20" fill="#87CEEB" fillOpacity="0.15" filter="url(#blur-filter-card)" />
                      
                      <path d="M15,20 L30,45 L50,15 L70,55 L88,30" stroke="rgba(135, 206, 235, 0.25)" strokeWidth="0.5" fill="none" />
                      <circle cx="50" cy="15" r="1.5" fill="#fff" className="animate-ping" />
                      <path d="M72,25 C67,25 63,29 63,34 C63,38 66,42 71,43 C67,43 62,39 62,34 C62,29 67,25 72,25 Z" fill="rgba(255, 255, 255, 0.6)" />
                    </svg>
                  )}
                  {/* Subtle dark bottom vignette */}
                  <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/20 to-transparent pointer-events-none z-10" />
                </div>

                {/* Corner details */}
                <div className="relative flex justify-between items-start z-20 w-full">
                  <span className="font-montserrat text-[9px] text-sky-blue/70 tracking-widest bg-navy/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                    EST. 11:11
                  </span>
                  <div className="text-sky-blue text-glow-blue text-sm">🌷</div>
                </div>

                {/* Bottom details inside card */}
                <div className="relative z-20 mt-auto w-full flex flex-col space-y-2">
                  <div className="h-[1px] w-full bg-linear-to-r from-sky-blue/40 to-transparent" />
                  <span className="font-playfair text-xl text-white font-medium drop-shadow-md">
                    Celestial Queen
                  </span>
                  <span className="font-poppins text-[10px] text-silver/60">
                    {customPhotoUrl ? "Personal Portrait Loaded" : "Abstract Starlit Art"}
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
