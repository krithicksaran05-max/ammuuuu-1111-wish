"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { useAudio } from "./AudioProvider";
import MusicVisualizer from "./MusicVisualizer";
import { siteConfig } from "@/config/site-config";

export default function AudioHeader() {
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume } = useAudio();
  const [showSlider, setShowSlider] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 h-20 z-40 flex items-center justify-between px-6 md:px-12 pointer-events-none">
      
      {/* Left Logo Title */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        <span className="font-playfair text-lg text-white font-light tracking-widest drop-shadow-md">
          {siteConfig.favoriteHeartEmoji} {siteConfig.girlName.toUpperCase()}
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-4 pointer-events-auto glass-panel border border-white/5 px-4 py-2 rounded-full shadow-lg">
        
        {/* Visualizer */}
        <MusicVisualizer />

        {/* Volume Controls */}
        <div 
          className="flex items-center space-x-2 relative"
          onMouseEnter={() => setShowSlider(true)}
          onMouseLeave={() => setShowSlider(false)}
        >
          {/* Mute toggle button */}
          <button
            onClick={toggleMute}
            className="p-1.5 hover:text-sky-blue text-white transition-colors cursor-pointer focus:outline-hidden"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Sliding bar control */}
          {showSlider && (
            <div className="absolute right-8 bg-navy/90 border border-white/10 px-3 py-1.5 rounded-md shadow-md flex items-center justify-center z-50">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                }}
                className="w-20 accent-sky-blue h-1 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Toggle play button */}
        <button
          onClick={togglePlay}
          className="px-3.5 py-1.5 bg-sky-blue/20 hover:bg-sky-blue/30 text-sky-blue border border-sky-blue/30 rounded-full text-[10px] font-montserrat tracking-wider uppercase cursor-pointer transition-all duration-300 flex items-center gap-1.5 focus:outline-hidden"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-blue animate-pulse" />
          {isPlaying ? "Pause Ambient" : "Play Ambient"}
        </button>

      </div>
    </header>
  );
}
