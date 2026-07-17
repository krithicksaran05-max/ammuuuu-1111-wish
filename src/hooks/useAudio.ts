"use client";

import { useRef, useCallback, useState, useEffect } from "react";

interface UseAudioOptions {
  src?: string;
  loop?: boolean;
  fadeInDuration?: number; // ms
  fadeOutDuration?: number; // ms
}

export function useAudio({
  src = "/music/my-song.mp3",
  loop = true,
  fadeInDuration = 6000,
  fadeOutDuration = 3000,
}: UseAudioOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, loop]);

  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(
    (targetVolume = 0.7) => {
      const audio = audioRef.current;
      if (!audio) return;

      clearFade();
      audio.volume = 0;

      const promise = audio.play();
      if (promise) {
        promise.catch(() => {
          // Autoplay blocked — will retry on user interaction
        });
      }

      const steps = 60;
      const stepTime = fadeInDuration / steps;
      const volumeStep = targetVolume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVol = Math.min(volumeStep * currentStep, targetVolume);
        audio.volume = newVol;
        setVolume(newVol);

        if (currentStep >= steps) {
          clearFade();
        }
      }, stepTime);
    },
    [fadeInDuration, clearFade]
  );

  const fadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();

    const startVol = audio.volume;
    const steps = 40;
    const stepTime = fadeOutDuration / steps;
    const volumeStep = startVol / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVol = Math.max(startVol - volumeStep * currentStep, 0);
      audio.volume = newVol;
      setVolume(newVol);

      if (currentStep >= steps) {
        clearFade();
        audio.pause();
      }
    }, stepTime);
  }, [fadeOutDuration, clearFade]);

  const play = useCallback(() => {
    fadeIn();
  }, [fadeIn]);

  const pause = useCallback(() => {
    fadeOut();
  }, [fadeOut]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Haptic feedback helper
  const triggerHaptic = useCallback((style: "light" | "medium" | "heavy" = "medium") => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[style]);
    }
  }, []);

  return {
    isPlaying,
    volume,
    play,
    pause,
    toggle,
    fadeIn,
    fadeOut,
    triggerHaptic,
    audioRef,
  };
}
