"use client";

import React, { useEffect, useRef, useState } from "react";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
}

export default function AudioVisualizer({ audioRef, isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !audioRef.current) return;

    const setupAudio = () => {
      if (audioContextRef.current) return;

      const audio = audioRef.current;
      if (!audio) return;

      // Create AudioContext (standard or webkit)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128; // Small size for smooth circular visualizer
      analyserRef.current = analyser;

      try {
        const source = ctx.createMediaElementSource(audio);
        sourceRef.current = source;
        source.connect(analyser);
        analyser.connect(ctx.destination);
      } catch (err) {
        console.warn("Audio source already connected or blocked: ", err);
      }
    };

    // Initialize audio context on play to satisfy browser restrictions
    if (isPlaying) {
      setupAudio();
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed size for the sound button orb visualizer
    canvas.width = 120;
    canvas.height = 120;

    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Flat line/smooth pulse when paused
        const t = Date.now() * 0.003;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 10 + Math.sin(t + i * 0.2) * 5;
        }
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 24; // Orbiting just outside the button

      // Render glowing circular particles/frequencies
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(139, 214, 255, 0.6)";

      ctx.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * Math.PI * 2;
        // Map frequency to line amplitude
        const value = dataArray[i];
        const amp = (value / 255) * 22; // max amplitude of 22px
        const r = baseRadius + amp;

        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(139, 214, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner glowing core wave
      ctx.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * Math.PI * 2;
        const value = dataArray[(i + 16) % bufferLength]; // Offset for complexity
        const amp = (value / 255) * 14;
        const r = baseRadius + amp - 4;

        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none z-0"
      style={{
        width: "120px",
        height: "120px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
