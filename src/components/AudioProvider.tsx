"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site-config";

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  playSparkle: () => void;
  setCustomBgmFile: (file: File) => void;
  customBgmName: string;
  analyser: AnalyserNode | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [customBgmFile, setCustomBgmFileState] = useState<File | null>(null);
  const [customBgmName, setCustomBgmName] = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const windBufferRef = useRef<AudioBuffer | null>(null);
  
  // Real-time audio nodes
  const customBgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const customBgmSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  const defaultPianoSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const windSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const pianoGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Synth interval for background melody if no file loaded
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Web Audio API
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Analyser for visualizer
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyserRef.current = analyser;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = isMuted ? 0 : volume;
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Gain nodes
    const pianoGain = ctx.createGain();
    pianoGain.gain.value = 0.8;
    pianoGain.connect(masterGain);
    pianoGainRef.current = pianoGain;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.45;
    windGain.connect(masterGain);
    windGainRef.current = windGain;

    // Load actual audio files or start synths
    loadFilesAndStart();
  };

  const loadFilesAndStart = async () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    let loadedWind = false;

    // Load Wind background
    try {
      const windRes = await fetch(siteConfig.music.windUrl);
      if (windRes.ok) {
        const arrayBuf = await windRes.arrayBuffer();
        windBufferRef.current = await ctx.decodeAudioData(arrayBuf);
        loadedWind = true;
      }
    } catch (e) {
      console.warn("Could not load wind audio file. Falling back to synthetic ambient noise.");
    }

    startAudioSources(loadedWind);
  };

  const startAudioSources = (hasWindFile: boolean) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // 1. Setup Wind Noise (File or Procedural Synth)
    if (hasWindFile && windBufferRef.current) {
      const windSource = ctx.createBufferSource();
      windSource.buffer = windBufferRef.current;
      windSource.loop = true;
      windSource.connect(windGainRef.current!);
      windSource.start(0);
      windSourceRef.current = windSource;
    } else {
      // Procedural Wind Synth: White Noise + Lowpass Filter + Slow LFO
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 1.0;

      // Connect LFO to modulate filter frequency
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1; // slow modulation
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 150;
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      filter.frequency.value = 250;

      whiteNoise.connect(filter);
      filter.connect(windGainRef.current!);

      lfo.start(0);
      whiteNoise.start(0);
      windSourceRef.current = whiteNoise;
    }

    // 2. Setup Piano / BGM (Custom Uploaded File or Fallback procedural piano)
    if (customBgmFile) {
      // Stop default melody if running
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }

      const fileUrl = URL.createObjectURL(customBgmFile);
      const audio = new Audio(fileUrl);
      audio.loop = true;
      audio.crossOrigin = "anonymous";
      customBgmAudioRef.current = audio;

      // Pipe HTML5 Audio element into Web Audio graph for real-time visualization
      const mediaSource = ctx.createMediaElementSource(audio);
      mediaSource.connect(pianoGainRef.current!);
      customBgmSourceRef.current = mediaSource;
      
      audio.play().catch((err) => console.error("Error playing custom BGM:", err));
    } else {
      // Procedural Dreamy Piano progression fallback
      const delayNode = ctx.createDelay(1.0);
      delayNode.delayTime.value = 0.6;
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.value = 0.4;

      delayNode.connect(delayFeedback);
      delayFeedback.connect(delayNode);
      delayNode.connect(pianoGainRef.current!);

      const playSynthNote = (freq: number, duration: number, delay = 0) => {
        if (!isPlaying || !audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime + delay;
        
        const osc = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();
        
        osc.type = "triangle";
        osc.frequency.value = freq;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Release
        
        osc.connect(gainNode);
        gainNode.connect(pianoGainRef.current!);
        gainNode.connect(delayNode);
        
        osc.start(now);
        osc.stop(now + duration);
      };

      const progression = [
        [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
        [349.23, 440.00, 523.25, 659.25, 783.99], // Fmaj9
        [220.00, 329.63, 392.00, 440.00, 523.25], // Am9
        [196.00, 293.66, 392.00, 440.00, 493.88], // G6
      ];

      let step = 0;
      const playMelodyLoop = () => {
        const chord = progression[step % progression.length];
        chord.forEach((freq, idx) => {
          playSynthNote(freq, 4.0, idx * 0.4);
        });

        const highNotes = [783.99, 880.00, 987.77, 1174.66];
        if (Math.random() > 0.3) {
          const randNote = highNotes[Math.floor(Math.random() * highNotes.length)];
          playSynthNote(randNote, 2.5, 2.0);
        }

        step++;
      };

      playMelodyLoop();
      const interval = setInterval(playMelodyLoop, 5000);
      synthIntervalRef.current = interval;
    }
  };

  const stopAudioSources = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (customBgmAudioRef.current) {
      customBgmAudioRef.current.pause();
      customBgmAudioRef.current = null;
    }
    if (customBgmSourceRef.current) {
      customBgmSourceRef.current.disconnect();
      customBgmSourceRef.current = null;
    }
    try {
      if (defaultPianoSourceRef.current) {
        defaultPianoSourceRef.current.stop();
        defaultPianoSourceRef.current = null;
      }
    } catch (e) {}
    try {
      if (windSourceRef.current) {
        windSourceRef.current.stop();
        windSourceRef.current = null;
      }
    } catch (e) {}
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudioSources();
      setIsPlaying(false);
      if (audioCtxRef.current?.state === "running") {
        audioCtxRef.current.suspend();
      }
    } else {
      initAudio();
      setIsPlaying(true);
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = nextMuted ? 0 : volume;
    }
    if (customBgmAudioRef.current) {
      customBgmAudioRef.current.muted = nextMuted;
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (masterGainRef.current && !isMuted) {
      masterGainRef.current.gain.value = vol;
    }
    if (customBgmAudioRef.current) {
      customBgmAudioRef.current.volume = vol;
    }
  };

  const playSparkle = async () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    try {
      const sparkleRes = await fetch(siteConfig.music.sparkleUrl);
      if (sparkleRes.ok) {
        const arrayBuf = await sparkleRes.arrayBuffer();
        const buf = await ctx.decodeAudioData(arrayBuf);
        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.connect(masterGainRef.current!);
        source.start(0);
        return;
      }
    } catch (e) {}

    // Synth Sparkle fallback
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(3000, now + 0.35);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(800, now);
    osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.35);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.15;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.3;

    delay.connect(delayGain);
    delayGain.connect(delay);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    gainNode.connect(delay);
    delay.connect(masterGainRef.current!);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  };

  const setCustomBgmFile = (file: File) => {
    setCustomBgmFileState(file);
    setCustomBgmName(file.name);
    
    // If already playing, immediately restart sources to switch songs
    if (isPlaying) {
      stopAudioSources();
      setTimeout(() => {
        startAudioSources(true);
      }, 200);
    }
  };

  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        togglePlay,
        toggleMute,
        setVolume,
        playSparkle,
        setCustomBgmFile,
        customBgmName,
        analyser: analyserRef.current,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
