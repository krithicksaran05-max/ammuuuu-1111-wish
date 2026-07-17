"use client";

import React from "react";
import { motion } from "framer-motion";

const lines = [
  { text: "Dear Ammuuu,", type: "heading" as const },
  { text: "", type: "spacer" as const },
  {
    text: "Every single 11:11 reminds me that there's only one wish I would make every single time.",
    type: "body" as const,
  },
  { text: "", type: "spacer" as const },
  { text: "And that's you.", type: "emphasis" as const },
  { text: "", type: "spacer" as const },
  { text: "You are my calm.", type: "body" as const },
  { text: "My happiness.", type: "body" as const },
  { text: "My peace.", type: "body" as const },
  { text: "My favourite notification.", type: "body" as const },
  { text: "My safest place.", type: "body" as const },
  { text: "My most beautiful chapter.", type: "body" as const },
  { text: "", type: "spacer" as const },
  { text: "I don't need thousands of wishes...", type: "body" as const },
  { text: "", type: "spacer" as const },
  {
    text: "Because my only wish already exists.",
    type: "emphasis" as const,
  },
  { text: "", type: "spacer" as const },
  { text: "It's you.", type: "highlight" as const },
  { text: "", type: "spacer" as const },
  { text: "Happy 11:11 ❤️", type: "closing" as const },
];

const getLineStyle = (type: string) => {
  switch (type) {
    case "heading":
      return "font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white/90 mb-2";
    case "emphasis":
      return "font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl text-sky/90 italic";
    case "highlight":
      return "font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-glow text-glow font-medium";
    case "closing":
      return "font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-white/90 mt-4";
    case "spacer":
      return "h-4 md:h-6";
    default:
      return "font-[family-name:var(--font-cormorant)] text-xl md:text-2xl text-white/70 leading-relaxed";
  }
};

export default function LoveLetter() {
  return (
    <section
      id="love-letter"
      className="relative w-full min-h-screen flex items-center justify-center px-6 py-24 md:py-32 z-10"
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ocean/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-lg mx-auto text-center">
        {lines.map((line, i) => {
          if (line.type === "spacer") {
            return <div key={i} className={getLineStyle(line.type)} />;
          }

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.9,
                delay: 0.08 * i,
                ease: [0.25, 0.8, 0.25, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={getLineStyle(line.type)}
            >
              {line.type === "highlight" ? (
                <span className="text-shimmer">{line.text}</span>
              ) : (
                line.text
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
