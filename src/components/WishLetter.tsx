"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { siteConfig } from "@/config/site-config";

export default function WishLetter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const [typedText, setTypedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  const fullLetter = `Dearest ${siteConfig.girlName},

I hope this message finds you in a moment of peace.

At exactly 11:11, when the world quietens down and the stars shine a little brighter, I wanted to send a special wish just for you.

I wish you endless happiness that warms your heart, and the success to achieve everything you dream of. May you always walk in good health, carry a quiet peace of mind, and step forward with confidence in who you are.

I hope your days are filled with beautiful memories, genuine smiles, and kind people who appreciate the light you bring into this world. During difficult times, I wish you quiet strength and a spark of hope to guide you through every single day.

Remember, every single 11:11 that passes is a reminder that you deserve beautiful things in your life. Never stop believing in the magic within you.

Keep shining, always.

With all my best wishes,
Someone who cares 💙`;

  useEffect(() => {
    if (!isInView) return;

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullLetter.length) {
        setTypedText(fullLetter.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsDone(true);
      }
    }, 15); // fast but readable typing speed

    return () => clearInterval(typingInterval);
  }, [isInView]);

  return (
    <section className="relative py-24 px-6 overflow-hidden flex justify-center items-center">
      {/* Background radial gradients for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-soft-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div ref={containerRef} className="max-w-3xl w-full z-10">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-montserrat text-xs tracking-[0.35em] text-sky-blue uppercase"
          >
            A Message in the Stars
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-playfair text-3xl md:text-5xl font-light text-white mt-2"
          >
            A Wish for You
          </motion.h2>
        </div>

        {/* The Letter Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative rounded-2xl p-8 md:p-12 glass-panel-light border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          {/* Top aesthetic rivets */}
          <div className="absolute top-4 left-6 flex space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-blue/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-sky-blue/10" />
          </div>
          <div className="absolute top-4 right-6 text-sky-blue/40 font-montserrat text-[10px] tracking-wider">
            11:11 WISH LETTER
          </div>

          {/* Letter Content Container */}
          <div className="relative font-dancing text-xl md:text-2xl text-lavender/90 leading-relaxed min-h-[350px] whitespace-pre-wrap select-text">
            <span className={isDone ? "" : "typing-cursor"}>
              {typedText}
            </span>
          </div>

          {/* Bottom Tulip Emblem */}
          <div className="absolute bottom-4 right-6 flex items-center gap-1.5 opacity-30 select-none pointer-events-none">
            <span className="font-poppins text-[10px] tracking-widest text-silver">🌷 TULIP GARDEN</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
