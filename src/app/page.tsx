"use client";

import React, { useState } from "react";
import { AudioProvider } from "@/components/AudioProvider";
import AudioHeader from "@/components/AudioHeader";
import DreamCanvas from "@/components/DreamCanvas";
import CursorTrail from "@/components/CursorTrail";
import OpeningExperience from "@/components/OpeningExperience";
import Hero from "@/components/Hero";
import WishLetter from "@/components/WishLetter";
import TulipGarden from "@/components/TulipGarden";
import MemoryGallery from "@/components/MemoryGallery";
import ConstellationMemories from "@/components/ConstellationMemories";
import WishJar from "@/components/WishJar";
import RandomWishes from "@/components/RandomWishes";
import SecretSurprise from "@/components/SecretSurprise";
import EndingSection from "@/components/EndingSection";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [openingComplete, setOpeningComplete] = useState(false);
  const [canvasState, setCanvasState] = useState<"opening" | "transition" | "main" | "ending">("opening");
  
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>("/images/portrait.jpg");

  const handleOpeningComplete = () => {
    setCanvasState("transition");
    
    // Smooth transition from zoom state to main experience
    setTimeout(() => {
      setOpeningComplete(true);
      setCanvasState("main");
    }, 1200);
  };

  const handleEnterEnding = (isEnding: boolean) => {
    setCanvasState(isEnding ? "ending" : "main");
  };

  const handlePhotoUploaded = (file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedPhotoUrl(url);
  };

  return (
    <AudioProvider>
      <main className="relative w-full min-h-screen bg-[#020617] overflow-hidden select-none">
        
        {/* Render Opening Experience Overlay */}
        <AnimatePresence mode="wait">
          {!openingComplete && (
            <OpeningExperience 
              onComplete={handleOpeningComplete} 
              onPhotoUploaded={handlePhotoUploaded}
            />
          )}
        </AnimatePresence>

        {/* Main Site Container */}
        {openingComplete && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5 }}
            className="w-full flex flex-col"
          >
            {/* Global floating cursor overlay */}
            <CursorTrail />

            {/* Global starlit animated backdrop */}
            <DreamCanvas state={canvasState} />

            {/* Global Navbar header */}
            <AudioHeader />

            {/* Main scroll sections */}
            <div className="w-full relative z-10 flex flex-col">
              
              {/* Hero header with custom uploaded photo */}
              <Hero customPhotoUrl={uploadedPhotoUrl} />

              {/* Heartfelt typing letter */}
              <WishLetter />

              {/* Swaying tulip gardens */}
              <TulipGarden />

              {/* Masonry image grids */}
              <MemoryGallery />

              {/* Quote visual rotators */}
              <RandomWishes />

              {/* Interactive custom space maps */}
              <ConstellationMemories />

              {/* Magical star shaker jar */}
              <WishJar />

              {/* Ending block spells name */}
              <EndingSection onEnterEnding={handleEnterEnding} />

              {/* Glowing Easter Egg blue tulip surprise */}
              <SecretSurprise />
              
            </div>

            {/* Custom Footer */}
            <footer className="relative z-10 py-8 border-t border-white/5 bg-[#020617]/65 text-center">
              <p className="font-montserrat text-[10px] text-silver/40 tracking-widest uppercase">
                MADE WITH MAGIC &amp; HOPE • 11:11
              </p>
            </footer>
          </motion.div>
        )}
      </main>
    </AudioProvider>
  );
}
