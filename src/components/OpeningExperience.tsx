"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { siteConfig } from "@/config/site-config";
import DreamCanvas from "./DreamCanvas";
import { Upload, Music, Image as ImageIcon, Sparkles, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface OpeningExperienceProps {
  onComplete: () => void;
  onPhotoUploaded: (file: File) => void;
}

export default function OpeningExperience({
  onComplete,
  onPhotoUploaded,
}: OpeningExperienceProps) {
  const { isPlaying, togglePlay, playSparkle, setCustomBgmFile, customBgmName } = useAudio();
  const [started, setStarted] = useState(false);
  
  // Customizer Assets States
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<"customize" | "countdown">("customize");

  const [clockState, setClockState] = useState<"ticking" | "1111">("ticking");
  const [clockTime, setClockTime] = useState("11:10:55");
  const [currentTextIdx, setCurrentTextIdx] = useState(0);
  const [showAmmuuuu, setShowAmmuuuu] = useState(false);
  const [showWishClose, setShowWishClose] = useState(false);
  const [showBeginBtn, setShowBeginBtn] = useState(false);
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [canvasTriggerStar, setCanvasTriggerStar] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);

  const texts = [
    "It's 11:11...",
    "A magical moment...",
    "Every wish begins with hope...",
    "This wish is specially for...",
  ];

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setCustomBgmFile(file);
      playSparkle();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      onPhotoUploaded(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      playSparkle();
    }
  };

  // Launch countdown experience after asset selection
  const handleProceed = () => {
    setActiveStep("countdown");
    setStarted(true);
    if (!isPlaying) {
      togglePlay(); // starts sound engine
    }
  };

  // Clock countdown logic
  useEffect(() => {
    if (!started || activeStep !== "countdown") return;

    let count = 55;
    const interval = setInterval(() => {
      count++;
      if (count < 60) {
        setClockTime(`11:10:${count}`);
      } else {
        clearInterval(interval);
        trigger1111();
      }
    }, 1500); // cinematic slower pace

    return () => clearInterval(interval);
  }, [started, activeStep]);

  const trigger1111 = () => {
    setClockState("1111");
    playSparkle();
    setCanvasTriggerStar(true);
    setIsFlashActive(true); // screen flash trigger

    // Turn off screen flash shortly after
    setTimeout(() => {
      setIsFlashActive(false);
    }, 500);
    
    // Multiple confetti bursts
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#87CEEB", "#BFEFFF", "#ffffff"],
    });

    setTimeout(() => {
      startTextSequence();
    }, 2000);
  };

  const startTextSequence = () => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < texts.length) {
        setCurrentTextIdx(currentIdx);
        currentIdx++;
      } else {
        clearInterval(interval);
        setShowAmmuuuu(true);
        playSparkle();
        
        setTimeout(() => {
          setShowWishClose(true);
          setTimeout(() => {
            setShowBeginBtn(true);
          }, 2000);
        }, 3000);
      }
    }, 3200);
  };

  const handleBegin = () => {
    setIsTransitioning(true);
    playSparkle();

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ["#87CEEB", "#ffffff", "#BFEFFF"] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ["#87CEEB", "#ffffff", "#BFEFFF"] });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01030a] overflow-hidden select-none">
      
      {/* Dynamic Screen Flash Glow at 11:11 */}
      <AnimatePresence>
        {isFlashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-40 pointer-events-none mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* Background Starfield */}
      <DreamCanvas state="opening" triggerShootingStar={canvasTriggerStar} />

      <AnimatePresence mode="wait">
        
        {/* Step 1: Dream Customizer Upload Panel */}
        {activeStep === "customize" && (
          <motion.div
            key="customize-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-lg w-full mx-4 p-8 glass-panel border border-sky-blue/30 rounded-2xl flex flex-col space-y-8 shadow-[0_0_40px_rgba(135,206,235,0.25)]"
          >
            <div className="text-center">
              <span className="font-montserrat text-[10px] tracking-[0.3em] text-sky-blue uppercase font-semibold">
                Dynamic Asset Customizer
              </span>
              <h2 className="font-playfair text-3xl font-light text-white mt-2">
                Configure Her Journey
              </h2>
              <p className="font-poppins text-xs text-silver/60 font-light mt-2 leading-relaxed">
                Choose the background music and the photo that will represent her star-frame throughout the experience.
              </p>
            </div>

            {/* Customizer Upload Rows */}
            <div className="flex flex-col space-y-4">
              
              {/* Audio Upload */}
              <div className="relative glass-card border border-white/5 hover:border-sky-blue/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  {audioFile ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="w-10 h-10 rounded-full bg-sky-blue/15 border border-sky-blue/30 flex items-center justify-center text-sky-blue"
                    >
                      <Music className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-silver/60">
                      <Music className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex flex-col space-y-0.5 text-left">
                    <span className="font-montserrat text-xs text-white">Choose Favorite BGM</span>
                    <span className="font-poppins text-[10px] text-silver/50 max-w-[200px] truncate">
                      {audioFile ? audioFile.name : "Default Procedural Piano Synth active"}
                    </span>
                  </div>
                </div>
                
                <label className="px-4 py-1.5 bg-sky-blue/15 hover:bg-sky-blue/25 text-sky-blue border border-sky-blue/25 rounded-md text-[10px] font-montserrat tracking-wide uppercase cursor-pointer transition-all">
                  Browse
                  <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                </label>
              </div>

              {/* Photo Upload */}
              <div className="relative glass-card border border-white/5 hover:border-sky-blue/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  {photoPreview ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-sky-blue/30 relative">
                      <img src={photoPreview} className="w-full h-full object-cover" alt="preview" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-silver/60">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex flex-col space-y-0.5 text-left">
                    <span className="font-montserrat text-xs text-white">Choose Her Photo</span>
                    <span className="font-poppins text-[10px] text-silver/50 max-w-[200px] truncate">
                      {photoFile ? photoFile.name : "Default Celestial Art representation active"}
                    </span>
                  </div>
                </div>

                <label className="px-4 py-1.5 bg-sky-blue/15 hover:bg-sky-blue/25 text-sky-blue border border-sky-blue/25 rounded-md text-[10px] font-montserrat tracking-wide uppercase cursor-pointer transition-all">
                  Browse
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>

            </div>

            {/* Launch Button */}
            <button
              onClick={handleProceed}
              className="w-full py-3.5 bg-sky-blue/20 hover:bg-sky-blue/35 border border-sky-blue/45 rounded-full text-white font-montserrat tracking-widest text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(135,206,235,0.2)] hover:shadow-[0_0_25px_rgba(135,206,235,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Enter the Night Sky
            </button>
          </motion.div>
        )}

        {/* Step 2: Cinematic Countdown Experience */}
        {activeStep === "countdown" && (
          <motion.div
            key="countdown-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex flex-col items-center justify-center"
          >
            {/* Soft Floating Clouds */}
            <div className="absolute top-1/4 left-[-10%] w-[40%] h-[15%] bg-sky-blue/5 rounded-full blur-[80px] pointer-events-none animate-[float_12s_ease-in-out_infinite]" />
            <div className="absolute bottom-1/3 right-[-10%] w-[35%] h-[15%] bg-soft-purple/5 rounded-full blur-[80px] pointer-events-none animate-[float_16s_ease-in-out_infinite]" />

            {/* Glowing Moon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: clockState === "1111" ? 0.95 : 0.6, scale: 1 }}
              transition={{ delay: 1, duration: 4 }}
              className="absolute top-16 right-16 w-20 md:w-32 h-20 md:h-32 rounded-full pointer-events-none flex items-center justify-center"
            >
              <div
                className={`absolute inset-0 bg-white/10 rounded-full blur-xl transition-all duration-[3000ms] ${
                  clockState === "1111" ? "bg-sky-blue/35 scale-125 blur-2xl" : "scale-100"
                }`}
              />
              <div className="w-full h-full bg-linear-to-tr from-silver/70 to-white/95 rounded-full shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.1),0_0_20px_rgba(255,255,255,0.4)]" />
            </motion.div>

            {/* Sequence text wrapper */}
            <div className="relative flex flex-col items-center max-w-lg px-6 text-center z-10">
              <AnimatePresence mode="wait">
                {clockState === "ticking" ? (
                  <motion.div
                    key="clock"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="font-montserrat text-xs tracking-[0.3em] text-silver/60 uppercase mb-3">
                      Silent Hours
                    </span>
                    <span className="font-playfair text-5xl md:text-6xl text-sky-blue tracking-wider text-glow-blue font-light">
                      {clockTime}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="magic-1111"
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="font-playfair text-6xl md:text-8xl text-white text-glow-white tracking-widest font-extralight mb-12"
                    >
                      ✨ 11:11 ✨
                    </motion.div>

                    {/* Sequential wording fading */}
                    <div className="h-16 flex items-center justify-center mb-6">
                      <AnimatePresence mode="wait">
                        {currentTextIdx < texts.length && !showAmmuuuu && (
                          <motion.p
                            key={currentTextIdx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 0.95, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.8 }}
                            className="font-poppins text-lg md:text-xl tracking-wide text-silver/85 font-light"
                          >
                            {texts[currentTextIdx]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Glowing Ammuuuu Name */}
                    <div className="h-28 flex flex-col items-center justify-center mb-8">
                      <AnimatePresence>
                        {showAmmuuuu && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="flex flex-col items-center animate-pulse"
                          >
                            <h1 className="font-dancing text-6xl md:text-7xl text-sky-blue text-glow-blue py-2">
                              💙 {siteConfig.girlName} 💙
                            </h1>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Wish Close prompt */}
                    <div className="h-12 flex items-center justify-center mb-10">
                      <AnimatePresence>
                        {showWishClose && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="flex flex-col items-center"
                          >
                            <p className="font-playfair text-lg md:text-xl tracking-[0.1em] text-silver italic">
                              Close your eyes... Make a Wish...
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Begin button */}
                    <div className="h-16 flex items-center justify-center">
                      <AnimatePresence>
                        {showBeginBtn && (
                          <motion.button
                            onClick={handleBegin}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(135,206,235,0.6)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.8 }}
                            className="px-8 py-3.5 glass-panel text-white font-montserrat tracking-widest text-sm rounded-full cursor-pointer hover:border-sky-blue/50 border border-sky-blue/20 transition-all duration-300 flex items-center gap-3"
                          >
                            <span>✨ Begin the Journey ✨</span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition zoom masking overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)", scale: 1 }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)", scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#01030a]/90 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-64 h-64 border border-sky-blue/15 rounded-full animate-ping absolute" />
            <div className="w-96 h-96 border border-sky-blue/5 rounded-full animate-[ping_4s_linear_infinite] absolute" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
