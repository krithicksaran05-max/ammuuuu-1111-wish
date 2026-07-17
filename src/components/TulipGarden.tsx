"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface TulipProps {
  delay: number;
  height: number;
  color: string;
  glowColor: string;
  left: string;
}

function Tulip({ delay, height, color, glowColor, left }: TulipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ left }}
      className="absolute bottom-0 flex flex-col items-center select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Landing Butterfly */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: -40, x: -10, rotate: -20 }}
          animate={{ opacity: 1, y: -height - 10, x: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 10 }}
          className="absolute z-20 pointer-events-none"
          style={{ bottom: 0 }}
        >
          {/* Butterfly SVG */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Left wing */}
            <motion.div
              animate={{ rotateY: [0, 70, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
              className="absolute left-1.5 w-3 h-4 origin-right bg-sky-blue rounded-full border border-white/20 shadow-[0_0_8px_rgba(135,206,235,0.7)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            {/* Right wing */}
            <motion.div
              animate={{ rotateY: [0, -70, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
              className="absolute right-1.5 w-3 h-4 origin-left bg-sky-blue rounded-full border border-white/20 shadow-[0_0_8px_rgba(135,206,235,0.7)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            {/* Body */}
            <div className="absolute w-0.5 h-3.5 bg-white rounded-full z-10" />
          </div>
        </motion.div>
      )}

      {/* Flower Bulb */}
      <motion.div
        animate={{
          rotate: hovered ? [-1, 2, -1] : [-2, 3, -2],
        }}
        transition={{
          repeat: Infinity,
          duration: hovered ? 2.5 : 4,
          ease: "easeInOut",
          delay: delay,
        }}
        style={{
          height: `${height}px`,
          transformOrigin: "bottom center",
        }}
        className="relative flex flex-col items-center origin-bottom"
      >
        {/* Tulip Petals Bulb */}
        <div
          className="relative w-12 h-14 rounded-b-full flex items-center justify-center transition-shadow duration-500"
          style={{
            bottom: `${height - 14}px`,
            filter: hovered ? `drop-shadow(0 0 15px ${glowColor})` : `drop-shadow(0 0 5px ${glowColor}50)`,
          }}
        >
          {/* Left Petal */}
          <div
            style={{ backgroundColor: color }}
            className="absolute left-1 w-7 h-12 rounded-t-full rounded-bl-full transform -rotate-12 origin-bottom border border-white/10"
          />
          {/* Right Petal */}
          <div
            style={{ backgroundColor: color }}
            className="absolute right-1 w-7 h-12 rounded-t-full rounded-br-full transform rotate-12 origin-bottom border border-white/10"
          />
          {/* Middle Petal */}
          <div
            style={{ backgroundColor: color }}
            className="absolute w-6 h-13 rounded-t-full border border-white/10 brightness-110"
          />
          {/* Center Glow Dot */}
          <div className="absolute w-2 h-2 rounded-full bg-white/40 blur-[1px] top-4" />
        </div>

        {/* Stem */}
        <div
          className="w-1.5 bg-emerald-600/70 border-r border-emerald-500/30 rounded-t-full"
          style={{
            height: `${height - 10}px`,
            position: "absolute",
            bottom: 0,
          }}
        />

        {/* Stem Leaves */}
        <div className="absolute bottom-8 -left-3 w-4 h-12 bg-emerald-700/60 border border-emerald-500/20 rounded-t-full rounded-br-full transform -rotate-35 origin-bottom-right" />
        <div className="absolute bottom-12 -right-3 w-4 h-10 bg-emerald-700/60 border border-emerald-500/20 rounded-t-full rounded-bl-full transform rotate-30 origin-bottom-left" />
      </motion.div>
    </div>
  );
}

export default function TulipGarden() {
  const tulipsData = [
    { delay: 0.1, height: 130, color: "#87CEEB", glowColor: "#87CEEB", left: "10%" },
    { delay: 0.5, height: 160, color: "#BFEFFF", glowColor: "#BFEFFF", left: "22%" },
    { delay: 1.2, height: 145, color: "#DA70D6", glowColor: "#DA70D6", left: "35%" },
    { delay: 0.8, height: 180, color: "#87CEEB", glowColor: "#87CEEB", left: "48%" },
    { delay: 1.5, height: 150, color: "#E6E6FA", glowColor: "#E6E6FA", left: "62%" },
    { delay: 0.3, height: 170, color: "#BFEFFF", glowColor: "#BFEFFF", left: "75%" },
    { delay: 1.0, height: 135, color: "#DA70D6", glowColor: "#DA70D6", left: "88%" },
  ];

  return (
    <section className="relative py-28 px-6 bg-linear-to-b from-transparent to-navy/40 overflow-hidden min-h-[500px] flex flex-col items-center justify-between">
      
      {/* Background glow */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-linear-to-t from-sky-blue/10 to-transparent pointer-events-none z-0" />

      {/* Header */}
      <div className="text-center z-10 max-w-lg mb-12">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          className="font-montserrat text-xs tracking-[0.3em] text-sky-blue uppercase"
        >
          Magical Field
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-playfair text-3xl md:text-4xl font-light text-white mt-1"
        >
          Dream Tulip Garden
        </motion.h2>
        <p className="font-poppins text-sm text-silver/60 font-light mt-3 leading-relaxed">
          Hover over the glowing flowers to welcome the blue butterflies.
        </p>
      </div>

      {/* Garden field container */}
      <div className="relative w-full max-w-5xl h-64 border-b border-white/10 z-10 overflow-visible mt-auto">
        {tulipsData.map((data, idx) => (
          <Tulip key={idx} {...data} />
        ))}
      </div>

    </section>
  );
}
