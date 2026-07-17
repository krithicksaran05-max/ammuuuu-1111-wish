"use client";

import React, { useEffect, useRef } from "react";
import { useAudio } from "./AudioProvider";

export default function MusicVisualizer() {
  const { analyser, isPlaying, isMuted } = useAudio();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !isPlaying || isMuted) {
      // Clear visualizer heights
      if (containerRef.current) {
        const bars = containerRef.current.children;
        for (let i = 0; i < bars.length; i++) {
          (bars[i] as HTMLElement).style.height = "4px";
        }
      }
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const bars = containerRef.current?.children;

    const draw = () => {
      if (!analyser || !isPlaying || isMuted) return;

      analyser.getByteFrequencyData(dataArray);

      if (bars) {
        const numBars = bars.length;
        for (let i = 0; i < numBars; i++) {
          // Map frequency bucket to bar index
          const dataIdx = Math.floor((i / numBars) * bufferLength * 0.7);
          const val = dataArray[dataIdx];
          
          // Calculate scale (minimum height of 4px, maximum 28px)
          const percent = val / 255;
          const height = Math.max(4, percent * 24);
          (bars[i] as HTMLElement).style.height = `${height}px`;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying, isMuted]);

  return (
    <div ref={containerRef} className="flex items-end gap-1 h-8 px-2 pointer-events-none select-none">
      <div className="w-0.5 bg-sky-blue/60 rounded-full transition-all duration-75" style={{ height: "4px" }} />
      <div className="w-0.5 bg-sky-blue/70 rounded-full transition-all duration-75" style={{ height: "4px" }} />
      <div className="w-0.5 bg-sky-blue/80 rounded-full transition-all duration-75" style={{ height: "4px" }} />
      <div className="w-0.5 bg-sky-blue/75 rounded-full transition-all duration-75" style={{ height: "4px" }} />
      <div className="w-0.5 bg-sky-blue/65 rounded-full transition-all duration-75" style={{ height: "4px" }} />
      <div className="w-0.5 bg-sky-blue/50 rounded-full transition-all duration-75" style={{ height: "4px" }} />
    </div>
  );
}
