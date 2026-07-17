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
  analyser: AnalyserNode | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const pianoBufferRef = useRef<AudioBuffer | null>(null);
  const windBufferRef = useRef<AudioBuffer | null>(null);
  
  // Real-time audio nodes
  const pianoSourceRef = useRef<AudioBufferSourceNode | null>(null);
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

    // Gain nodes for individual sources
    const pianoGain = ctx.createGain();
    pianoGain.gain.value = 0.8;
    pianoGain.connect(masterGain);
    pianoGainRef.current = pianoGain;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.4;
    windGain.connect(masterGain);
    windGainRef.current = windGain;

    // Load actual audio files or start synths
    loadFilesAndStart();
  };

  const loadFilesAndStart = async () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    let loadedPiano = false;
    let loadedWind = false;

    // Try loading custom files
    try {
      const pianoRes = await fetch(siteConfig.music.pianoUrl);
      if (pianoRes.ok) {
        const arrayBuf = await pianoRes.arrayBuffer();
        pianoBufferRef.current = await ctx.decodeAudioData(arrayBuf);
        loadedPiano = true;
      }
    } catch (e) {
      console.warn("Could not load piano audio file. Falling back to synthetic melody.");
    }

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

    // Start playback
    startAudioSources(loadedPiano, loadedWind);
  };

  const startAudioSources = (hasPianoFile: boolean, hasWindFile: boolean) => {
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
      lfo.frequency.value = 0.1; // slow modulation (10 seconds per cycle)
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 150; // modulate by +/- 150Hz
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      filter.frequency.value = 250; // base frequency

      whiteNoise.connect(filter);
      filter.connect(windGainRef.current!);

      lfo.start(0);
      whiteNoise.start(0);
      windSourceRef.current = whiteNoise as any; // hold reference to stop later
    }

    // 2. Setup Piano (File or Procedural Chord Loop)
    if (hasPianoFile && pianoBufferRef.current) {
      const pianoSource = ctx.createBufferSource();
      pianoSource.buffer = pianoBufferRef.current;
      pianoSource.loop = true;
      pianoSource.connect(pianoGainRef.current!);
      pianoSource.start(0);
      pianoSourceRef.current = pianoSource;
    } else {
      // Procedural Dreamy Piano Chord Progression Loop
      // Plays soft major pentatonic notes with a digital delay
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

      // Progression: Cmaj9 -> Fmaj9 -> Am9 -> G6
      const progression = [
        [261.63, 329.63, 392.00, 493.88, 587.33], // C4, E4, G4, B4, D5 (Cmaj9)
        [349.23, 440.00, 523.25, 659.25, 783.99], // F4, A4, C5, E5, G5 (Fmaj9)
        [220.00, 329.63, 392.00, 440.00, 523.25], // A3, E4, G4, A4, C5 (Am9)
        [196.00, 293.66, 392.00, 440.00, 493.88], // G3, D4, G4, A4, B4 (G6)
      ];

      let step = 0;
      const playMelodyLoop = () => {
        const chord = progression[step % progression.length];
        // Play arpeggio
        chord.forEach((freq, idx) => {
          playSynthNote(freq, 4.0, idx * 0.4);
        });

        // Add a high key melody accent
        const highNotes = [783.99, 880.00, 987.77, 1174.66]; // G5, A5, B5, D6
        if (Math.random() > 0.3) {
          const randNote = highNotes[Math.floor(Math.random() * highNotes.length)];
          playSynthNote(randNote, 2.5, 2.0);
        }

        step++;
      };

      // Play immediately
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
    try {
      if (pianoSourceRef.current) {
        pianoSourceRef.current.stop();
        pianoSourceRef.current = null;
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
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (masterGainRef.current && !isMuted) {
      masterGainRef.current.gain.value = vol;
    }
  };

  const playSparkle = async () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended
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

    // Synth Sparkle fallback (short high frequency sweep + noise burst)
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

    // Simple Delay/echo on sparkle
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

  // Clean up on unmount
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
