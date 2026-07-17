"use client";

import React, { useEffect, useRef, useState } from "react";

interface DreamCanvasProps {
  state: "opening" | "transition" | "main" | "ending";
  intensity?: number;
  triggerShootingStar?: boolean;
}

export default function DreamCanvas({
  state,
  intensity = 0.5,
  triggerShootingStar = false,
}: DreamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Window resize handler
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || windowSize.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    const width = canvas.width;
    const height = canvas.height;

    // Define constellation points for "AMMUUUU" (Centered on screen)
    const letterA = [
      { x: 0.12, y: 0.55 },
      { x: 0.15, y: 0.35 },
      { x: 0.18, y: 0.55 },
      { x: 0.14, y: 0.47 },
      { x: 0.16, y: 0.47 },
    ];
    const letterM1 = [
      { x: 0.23, y: 0.55 },
      { x: 0.23, y: 0.35 },
      { x: 0.26, y: 0.46 },
      { x: 0.29, y: 0.35 },
      { x: 0.29, y: 0.55 },
    ];
    const letterM2 = [
      { x: 0.34, y: 0.55 },
      { x: 0.34, y: 0.35 },
      { x: 0.37, y: 0.46 },
      { x: 0.40, y: 0.35 },
      { x: 0.40, y: 0.55 },
    ];
    const letterU1 = [
      { x: 0.45, y: 0.35 },
      { x: 0.45, y: 0.50 },
      { x: 0.48, y: 0.55 },
      { x: 0.51, y: 0.50 },
      { x: 0.51, y: 0.35 },
    ];
    const letterU2 = [
      { x: 0.56, y: 0.35 },
      { x: 0.56, y: 0.50 },
      { x: 0.59, y: 0.55 },
      { x: 0.62, y: 0.50 },
      { x: 0.62, y: 0.35 },
    ];
    const letterU3 = [
      { x: 0.67, y: 0.35 },
      { x: 0.67, y: 0.50 },
      { x: 0.70, y: 0.55 },
      { x: 0.73, y: 0.50 },
      { x: 0.73, y: 0.35 },
    ];
    const letterU4 = [
      { x: 0.78, y: 0.35 },
      { x: 0.78, y: 0.50 },
      { x: 0.81, y: 0.55 },
      { x: 0.84, y: 0.50 },
      { x: 0.84, y: 0.35 },
    ];

    const constellationLetters = [letterA, letterM1, letterM2, letterU1, letterU2, letterU3, letterU4];
    const constellationPoints: { x: number; y: number; index: number; letterIndex: number }[] = [];
    const constellationConnections: [number, number][] = [];

    let currentPtIndex = 0;
    constellationLetters.forEach((letterPoints, letterIdx) => {
      const letterStartIdx = currentPtIndex;
      letterPoints.forEach((pt) => {
        const isMobile = width < 768;
        const scaleX = isMobile ? 0.9 : 1.0;
        const shiftX = isMobile ? 0.05 : 0.0;
        const adjX = pt.x * scaleX + shiftX;
        const adjY = isMobile ? pt.y * 0.8 + 0.1 : pt.y;

        constellationPoints.push({
          x: adjX * width,
          y: adjY * height,
          index: currentPtIndex,
          letterIndex: letterIdx,
        });
        currentPtIndex++;
      });

      // Connecting strokes
      if (letterIdx === 0) {
        constellationConnections.push([letterStartIdx, letterStartIdx + 1]);
        constellationConnections.push([letterStartIdx + 1, letterStartIdx + 2]);
        constellationConnections.push([letterStartIdx + 3, letterStartIdx + 4]);
      } else {
        constellationConnections.push([letterStartIdx, letterStartIdx + 1]);
        constellationConnections.push([letterStartIdx + 1, letterStartIdx + 2]);
        constellationConnections.push([letterStartIdx + 2, letterStartIdx + 3]);
        constellationConnections.push([letterStartIdx + 3, letterStartIdx + 4]);
      }
    });

    // 1. 3D Parallax Starfield
    class ParallaxStar {
      x: number;
      y: number;
      z: number;
      size: number;
      baseOpacity: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;

      constructor() {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = Math.random() * width; // depth coordinate
        this.size = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.6 + 0.3;
        this.opacity = this.baseOpacity;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(tick: number, isTransition: boolean) {
        // In transition, stars rush forward in 3D
        if (isTransition) {
          this.z -= 15;
          if (this.z <= 0) {
            this.z = width;
            this.x = Math.random() * width - width / 2;
            this.y = Math.random() * height - height / 2;
          }
        } else {
          // Normal slow drift
          this.z -= 0.2;
          if (this.z <= 0) {
            this.z = width;
          }
        }

        // Project 3D coordinates onto 2D viewport
        const k = 120 / this.z;
        const px = this.x * k + width / 2;
        const py = this.y * k + height / 2;

        if (px < 0 || px > width || py < 0 || py > height) {
          this.z = width;
          this.x = Math.random() * width - width / 2;
          this.y = Math.random() * height - height / 2;
          return;
        }

        // Pulse opacity
        this.opacity = this.baseOpacity + Math.sin(tick * this.pulseSpeed + this.pulseOffset) * 0.15;
        if (this.opacity < 0.1) this.opacity = 0.1;

        // Mouse displacement
        const dx = mouseRef.current.x - px;
        const dy = mouseRef.current.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;
        let offsetX = 0;
        let offsetY = 0;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          offsetX = -(dx / dist) * force * 10;
          offsetY = -(dy / dist) * force * 10;
        }

        ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(px + offsetX, py + offsetY, this.size * (isTransition ? 1.8 : 1.0), 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // 2. Aurora Wave
    const drawAurora = (tick: number) => {
      ctx!.save();
      ctx!.shadowBlur = 30;
      ctx!.shadowColor = "rgba(135, 206, 235, 0.4)";
      
      const numWaves = 3;
      for (let w = 0; w < numWaves; w++) {
        ctx!.beginPath();
        const baseGradient = ctx!.createLinearGradient(0, 0, width, 0);
        baseGradient.addColorStop(0, "rgba(138, 43, 226, 0)");
        baseGradient.addColorStop(0.3, `rgba(135, 206, 235, ${0.12 - w * 0.03})`);
        baseGradient.addColorStop(0.7, `rgba(138, 43, 226, ${0.10 - w * 0.02})`);
        baseGradient.addColorStop(1, "rgba(135, 206, 235, 0)");

        ctx!.fillStyle = baseGradient;
        
        ctx!.moveTo(0, height);
        
        // Render sine curve path
        for (let x = 0; x <= width; x += 10) {
          const waveHeight = 80 + w * 25;
          const frequency = 0.002 + w * 0.001;
          const speed = 0.008 - w * 0.002;
          const y = (height * 0.15) + Math.sin(x * frequency + tick * speed) * waveHeight;
          ctx!.lineTo(x, y);
        }
        
        ctx!.lineTo(width, height);
        ctx!.closePath();
        ctx!.fill();
      }
      ctx!.restore();
    };

    // 3. Flower Pollen particle
    class Pollen {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      wobbleSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = height - Math.random() * 100;
        this.size = Math.random() * 2.5 + 1;
        this.speedY = -(Math.random() * 0.6 + 0.3);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.wobbleSpeed = Math.random() * 0.04 + 0.01;
        this.color = Math.random() > 0.5 ? "rgba(135, 206, 235, 0.8)" : "rgba(230, 230, 250, 0.8)";
      }

      update(tick: number) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(tick * this.wobbleSpeed) * 0.3;

        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }

        ctx!.shadowBlur = 5;
        ctx!.shadowColor = this.color;
        ctx!.fillStyle = this.color.replace(/[\d\.]+\)$/, `${this.opacity * (0.6 + Math.sin(tick * 0.05) * 0.4)})`);
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
    }

    // 4. Spiral Morphing Hearts
    class HeartParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      tickOffset: number;
      targetIndex: number;
      morphProgress: number;
      // Spiral fields
      spiralAngle: number;
      spiralRadius: number;

      constructor(targetIndex = -1) {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 6 + 4;
        this.speedY = -(Math.random() * 0.8 + 0.4);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.tickOffset = Math.random() * 100;
        this.targetIndex = targetIndex;
        this.morphProgress = 0;
        this.spiralAngle = Math.random() * Math.PI * 2;
        this.spiralRadius = width * 0.4;
      }

      update(tick: number, isEndingState: boolean) {
        if (isEndingState && this.targetIndex !== -1) {
          const target = constellationPoints[this.targetIndex];
          if (target) {
            if (this.morphProgress < 1) {
              this.morphProgress += 0.007; // smooth assembly
              if (this.morphProgress > 1) this.morphProgress = 1;
            }

            const t = this.morphProgress;
            
            // Spiral physics: orbit around center first, then pull into coordinates
            const centerX = width / 2;
            const centerY = height / 2;

            // Spiral angle speeds up as it converges
            this.spiralAngle += 0.02 * (1 + t * 2);
            this.spiralRadius = this.spiralRadius * (1 - 0.015) + (target.x - centerX) * 0.015;

            // Calculate spiral base coordinates
            const spiralX = centerX + Math.cos(this.spiralAngle) * this.spiralRadius * (1 - t);
            const spiralY = centerY + Math.sin(this.spiralAngle) * this.spiralRadius * (1 - t);

            // Interpolate from spiral base to direct target coordinates
            const currentX = spiralX * (1 - t) + target.x * t;
            const currentY = spiralY * (1 - t) + target.y * t;

            if (t > 0.95) {
              // Lock as bright white stars
              ctx!.shadowBlur = 15;
              ctx!.shadowColor = "rgba(135, 206, 235, 1)";
              ctx!.fillStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(tick * 0.05 + this.tickOffset) * 0.3})`;
              ctx!.beginPath();
              ctx!.arc(target.x, target.y, 2.5, 0, Math.PI * 2);
              ctx!.fill();
              ctx!.shadowBlur = 0;
            } else {
              this.drawHeart(currentX, currentY, this.size * (1 - t * 0.5), `rgba(135, 206, 235, ${this.opacity})`);
            }
            return;
          }
        }

        // Regular float
        this.y += this.speedY;
        this.x += this.speedX + Math.sin((tick + this.tickOffset) * 0.02) * 0.2;
        
        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }

        this.drawHeart(this.x, this.y, this.size, `rgba(135, 206, 235, ${this.opacity})`);
      }

      drawHeart(x: number, y: number, size: number, fillStyle: string) {
        ctx!.fillStyle = fillStyle;
        ctx!.beginPath();
        ctx!.moveTo(x, y + size / 4);
        ctx!.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 3);
        ctx!.bezierCurveTo(x - size / 2, y + (size * 2) / 3, x, y + size, x, y + size);
        ctx!.bezierCurveTo(x, y + size, x + size / 2, y + (size * 2) / 3, x + size / 2, y + size / 3);
        ctx!.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        ctx!.closePath();
        ctx!.fill();
      }
    }

    // 5. Firefly definition
    class Firefly {
      x: number;
      y: number;
      size: number;
      angle: number;
      speed: number;
      opacity: number;
      color: string;
      wobbleSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = "rgba(135, 206, 235, 0.6)";
        this.wobbleSpeed = Math.random() * 0.05 + 0.01;
      }

      update(tick: number) {
        this.angle += Math.sin(tick * this.wobbleSpeed) * 0.05;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed - 0.1;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = Math.random() * height;

        const glowOpacity = this.opacity * (0.6 + Math.sin(tick * 0.04) * 0.4);

        ctx!.shadowBlur = 10;
        ctx!.shadowColor = "rgba(135, 206, 235, 0.8)";
        ctx!.fillStyle = this.color.replace(/[\d\.]+\)$/, `${glowOpacity})`);
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
    }

    // 6. Falling Tulip Petal
    class Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = -20 - Math.random() * height;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 0.7 + 0.4;
        this.speedX = Math.random() * 0.5 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.02 - 0.01) * 0.5;
        this.color = Math.random() > 0.5 ? "rgba(135, 206, 235, 0.4)" : "rgba(191, 239, 255, 0.5)";
      }

      update(tick: number) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(tick * 0.01) * 0.3;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.y = -20;
          this.x = Math.random() * width;
        }

        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rotation);
        ctx!.fillStyle = this.color;
        
        ctx!.beginPath();
        ctx!.moveTo(0, -this.size / 2);
        ctx!.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size / 2, 0, this.size);
        ctx!.bezierCurveTo(this.size / 2, this.size / 2, this.size / 2, -this.size / 2, 0, -this.size / 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    // 7. Flapping Butterfly
    class Butterfly {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      tickOffset: number;
      angle: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 6 + 4;
        this.speedX = Math.random() * 0.6 + 0.3;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.4;
        this.tickOffset = Math.random() * 100;
        this.angle = Math.random() * Math.PI * 2;
      }

      update(tick: number) {
        this.angle += Math.sin((tick + this.tickOffset) * 0.03) * 0.05;
        this.x += Math.cos(this.angle) * this.speedX;
        this.y += Math.sin(this.angle) * 0.4 + this.speedY;

        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.angle + Math.PI / 2);

        const wingScale = Math.abs(Math.cos((tick + this.tickOffset) * 0.15));

        ctx!.fillStyle = "rgba(135, 206, 235, 0.75)";
        ctx!.shadowBlur = 6;
        ctx!.shadowColor = "rgba(135, 206, 235, 0.7)";

        ctx!.beginPath();
        ctx!.ellipse(-this.size * wingScale, 0, this.size * wingScale, this.size * 0.7, -Math.PI / 6, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.ellipse(this.size * wingScale, 0, this.size * wingScale, this.size * 0.7, Math.PI / 6, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx!.shadowBlur = 0;
        ctx!.beginPath();
        ctx!.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.restore();
      }
    }

    // Initialize counts based on width/height
    const starsCount = Math.floor((width * height) / 8000);
    const firefliesCount = Math.floor((width * height) / 20000);
    const heartsCount = state === "ending" ? constellationPoints.length : 15;
    const petalsCount = Math.floor((width * height) / 25000);
    const pollensCount = Math.floor((width * height) / 15000);
    const butterfliesCount = 5;

    const stars: ParallaxStar[] = [];
    const fireflies: Firefly[] = [];
    const hearts: HeartParticle[] = [];
    const petals: Petal[] = [];
    const pollens: Pollen[] = [];
    const butterflies: Butterfly[] = [];

    for (let i = 0; i < starsCount; i++) stars.push(new ParallaxStar());
    
    if (state !== "opening") {
      for (let i = 0; i < firefliesCount; i++) fireflies.push(new Firefly());
      for (let i = 0; i < petalsCount; i++) petals.push(new Petal());
      for (let i = 0; i < butterfliesCount; i++) butterflies.push(new Butterfly());
      for (let i = 0; i < pollensCount; i++) pollens.push(new Pollen());
      
      if (state === "ending") {
        for (let i = 0; i < constellationPoints.length; i++) {
          hearts.push(new HeartParticle(i));
        }
      } else {
        for (let i = 0; i < heartsCount; i++) hearts.push(new HeartParticle(-1));
      }
    }

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render 3D Parallax Stars
      stars.forEach((star) => star.update(tick, state === "transition"));

      // Render Aurora waves in background
      if (state !== "opening") {
        drawAurora(tick);
      }

      // Render other entities
      if (state !== "opening" && state !== "transition") {
        fireflies.forEach((firefly) => firefly.update(tick));
        petals.forEach((petal) => petal.update(tick));
        pollens.forEach((pollen) => pollen.update(tick));
        butterflies.forEach((bf) => bf.update(tick));
        hearts.forEach((heart) => heart.update(tick, state === "ending"));

        // If in ending state, connect letter constellations
        if (state === "ending") {
          const allMorphed = hearts.every(h => h.morphProgress > 0.95);
          if (allMorphed) {
            ctx.save();
            ctx.strokeStyle = "rgba(135, 206, 235, 0.2)";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(135, 206, 235, 0.4)";
            ctx.lineWidth = 1.2;

            constellationConnections.forEach(([p1Idx, p2Idx]) => {
              const p1 = constellationPoints[p1Idx];
              const p2 = constellationPoints[p2Idx];
              if (p1 && p2) {
                const pulse = 0.5 + Math.sin(tick * 0.04 + p1Idx) * 0.4;
                ctx.strokeStyle = `rgba(135, 206, 235, ${pulse * 0.25})`;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            });
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [windowSize, state, intensity, triggerShootingStar]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
