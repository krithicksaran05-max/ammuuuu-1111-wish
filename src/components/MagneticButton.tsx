"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Only enable magnetic effect on fine pointer devices
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      const magneticRange = 120;

      if (dist < magneticRange) {
        const force = 1 - dist / magneticRange;
        setPosition({
          x: distX * force * 0.3,
          y: distY * force * 0.3,
        });
        setIsHovered(true);
      } else {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? 1.02 : 1,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.5,
      }}
      className={`relative glass-button rounded-full cursor-pointer overflow-hidden ${className}`}
    >
      {/* Top reflection */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent rounded-t-full pointer-events-none" />

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Hover glow ring */}
      <motion.div
        className="absolute -inset-1 rounded-full pointer-events-none"
        animate={{
          opacity: isHovered ? 0.5 : 0,
          boxShadow: isHovered
            ? "0 0 30px rgba(139, 214, 255, 0.3)"
            : "0 0 0px rgba(139, 214, 255, 0)",
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  );
}
