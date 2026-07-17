"use client";

import React, { useEffect, useRef, useState } from "react";

interface StarfieldCanvasProps {
  intensity?: number;
  isMagicTime?: boolean;
}

export default function StarfieldCanvas({
  intensity = 0.5,
  isMagicTime = false,
}: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    // --- 1. 3D Parallax Stars ---
    class Star {
      x!: number;
      y!: number;
      z!: number;
      size!: number;
      baseOpacity!: number;
      opacity!: number;
      pulseSpeed!: number;
      pulseOffset!: number;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = init ? Math.random() * width : width;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.5 + 0.3;
        this.opacity = this.baseOpacity;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(tick: number) {
        const speed = isMagicTime ? 1.5 : 0.2;
        this.z -= speed;
        if (this.z <= 0) {
          this.reset();
          return;
        }

        const k = 120 / this.z;
        const px = this.x * k + width / 2;
        const py = this.y * k + height / 2;

        if (px < 0 || px > width || py < 0 || py > height) {
          this.reset();
          return;
        }

        this.opacity = this.baseOpacity + Math.sin(tick * this.pulseSpeed + this.pulseOffset) * 0.15;
        if (this.opacity < 0.1) this.opacity = 0.1;

        const dx = mouseRef.current.x - px;
        const dy = mouseRef.current.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;
        let offsetX = 0;
        let offsetY = 0;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          offsetX = -(dx / dist) * force * 15;
          offsetY = -(dy / dist) * force * 15;
        }

        const sizeMultiplier = isMagicTime ? 1.6 : 1.0;
        ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity * (isMagicTime ? 1 : intensity)})`;
        ctx!.beginPath();
        ctx!.arc(px + offsetX, py + offsetY, this.size * sizeMultiplier, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // --- 2. Shooting Star ---
    class ShootingStar {
      x!: number;
      y!: number;
      length!: number;
      speed!: number;
      angle!: number;
      opacity!: number;
      active!: boolean;
      timer!: number;

      constructor() {
        this.active = false;
        this.timer = Math.random() * 300 + 100;
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.speed = 0;
        this.angle = 0;
        this.opacity = 0;
      }

      trigger() {
        this.x = Math.random() * (width * 0.6) + width * 0.2;
        this.y = Math.random() * (height * 0.3);
        this.length = Math.random() * 80 + 50;
        this.speed = Math.random() * 8 + 6;
        this.angle = Math.PI / 6 + (Math.random() - 0.5) * 0.1;
        this.opacity = 1;
        this.active = true;
      }

      update() {
        if (!this.active) {
          this.timer--;
          if (this.timer <= 0) {
            this.trigger();
            this.timer = Math.random() * 600 + 400;
          }
          return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.02;

        if (this.opacity <= 0) {
          this.active = false;
          return;
        }

        const gradient = ctx!.createLinearGradient(
          this.x,
          this.y,
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, `rgba(139, 214, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(63, 142, 252, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, "rgba(139, 214, 255, 0)");

        ctx!.save();
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 2;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(this.x, this.y);
        ctx!.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx!.stroke();
        ctx!.restore();
      }
    }

    // --- 3. Aurora Wave ---
    const drawAurora = (tick: number) => {
      ctx!.save();
      ctx!.shadowBlur = 40;
      ctx!.shadowColor = "rgba(139, 214, 255, 0.4)";

      const numWaves = 3;
      const waveColors = [
        "rgba(11, 46, 107, 0.12)",
        "rgba(14, 77, 146, 0.1)",
        "rgba(139, 214, 255, 0.08)"
      ];

      for (let w = 0; w < numWaves; w++) {
        ctx!.beginPath();
        const baseGradient = ctx!.createLinearGradient(0, 0, width, 0);
        baseGradient.addColorStop(0, "rgba(11, 46, 107, 0)");
        baseGradient.addColorStop(0.3, waveColors[w]);
        baseGradient.addColorStop(0.7, "rgba(14, 77, 146, 0.08)");
        baseGradient.addColorStop(1, "rgba(11, 46, 107, 0)");

        ctx!.fillStyle = baseGradient;
        ctx!.moveTo(0, height);

        for (let x = 0; x <= width; x += 15) {
          const waveHeight = (isMagicTime ? 120 : 60) + w * 20;
          const frequency = 0.0015 + w * 0.0008;
          const speed = (isMagicTime ? 0.015 : 0.005) - w * 0.001;
          const y = (height * 0.15) + Math.sin(x * frequency + tick * speed) * waveHeight;
          ctx!.lineTo(x, y);
        }

        ctx!.lineTo(width, height);
        ctx!.closePath();
        ctx!.fill();
      }
      ctx!.restore();
    };

    // --- 4. Floating Fog/Mist ---
    class Fog {
      x!: number;
      y!: number;
      radius!: number;
      angle!: number;
      speed!: number;
      baseOpacity!: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height * 0.4) + height * 0.1;
        this.radius = Math.random() * 200 + 200;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.002 + 0.001;
        this.baseOpacity = Math.random() * 0.02 + 0.02;
      }

      update(tick: number) {
        this.angle += this.speed;
        const driftX = Math.sin(this.angle) * 30;
        const opacity = this.baseOpacity + Math.sin(tick * 0.01) * 0.005;

        const grad = ctx!.createRadialGradient(
          this.x + driftX,
          this.y,
          0,
          this.x + driftX,
          this.y,
          this.radius
        );
        grad.addColorStop(0, `rgba(139, 214, 255, ${opacity})`);
        grad.addColorStop(0.5, `rgba(139, 214, 255, ${opacity * 0.4})`);
        grad.addColorStop(1, "rgba(139, 214, 255, 0)");

        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(this.x + driftX, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // --- 5. Blue Fireflies ---
    class Firefly {
      x!: number;
      y!: number;
      size!: number;
      angle!: number;
      speed!: number;
      opacity!: number;
      wobbleSpeed!: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1.2;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.4 + 0.15;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.wobbleSpeed = Math.random() * 0.04 + 0.01;
      }

      update(tick: number) {
        this.angle += Math.sin(tick * this.wobbleSpeed) * 0.05;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed - 0.05;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        const pulse = this.opacity * (0.6 + Math.sin(tick * 0.05) * 0.4);

        ctx!.save();
        ctx!.shadowBlur = 8;
        ctx!.shadowColor = "rgba(139, 214, 255, 0.8)";
        ctx!.fillStyle = `rgba(139, 214, 255, ${pulse * (isMagicTime ? 1.5 : 1.0)})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    // --- 6. Falling Tulip Petals ---
    class Petal {
      x!: number;
      y!: number;
      size!: number;
      speedY!: number;
      speedX!: number;
      rotation!: number;
      rotationSpeed!: number;
      color!: string;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * -height : -20;
        this.size = Math.random() * 10 + 6;
        this.speedY = Math.random() * 0.6 + 0.3;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.02 - 0.01) * 0.5;
        this.color = Math.random() > 0.5 ? "rgba(139, 214, 255, 0.3)" : "rgba(185, 230, 255, 0.4)";
      }

      update(tick: number) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(tick * 0.01) * 0.2;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.reset();
          return;
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

    // --- 7. Tiny Blue Hearts ---
    class Heart {
      x!: number;
      y!: number;
      size!: number;
      speedY!: number;
      wobbleSpeed!: number;
      wobbleScale!: number;
      opacity!: number;
      decay!: number;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 20;
        this.size = Math.random() * 8 + 6;
        this.speedY = -(Math.random() * 0.5 + 0.3);
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        this.wobbleScale = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.3 + 0.15;
        this.decay = Math.random() * 0.001 + 0.0005;
      }

      update(tick: number) {
        this.y += this.speedY;
        this.x += Math.sin(tick * this.wobbleSpeed) * 0.3;
        this.opacity -= this.decay;

        if (this.y < -20 || this.opacity <= 0) {
          this.reset();
          return;
        }

        const x = this.x;
        const y = this.y;
        const size = this.size;

        ctx!.save();
        ctx!.fillStyle = `rgba(63, 142, 252, ${this.opacity * (isMagicTime ? 2 : 1)})`;
        ctx!.beginPath();
        ctx!.moveTo(x, y + size / 4);
        ctx!.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 3);
        ctx!.bezierCurveTo(x - size / 2, y + (size * 2) / 3, x, y + size, x, y + size);
        ctx!.bezierCurveTo(x, y + size, x + size / 2, y + (size * 2) / 3, x + size / 2, y + size / 3);
        ctx!.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
      }
    }

    // --- 8. Rising Wish Stars ---
    class WishStar {
      x!: number;
      y!: number;
      text!: string;
      speedY!: number;
      opacity!: number;
      size!: number;

      constructor(text: string) {
        this.x = Math.random() * (width - 240) + 120;
        this.y = height + 20;
        this.text = text;
        this.speedY = -(Math.random() * 0.4 + 0.35);
        this.opacity = 1.0;
        this.size = 3.5;
      }

      update() {
        this.y += this.speedY;
        this.opacity -= 0.0016;

        if (this.opacity <= 0) return false;

        // Draw star
        ctx!.save();
        ctx!.shadowBlur = 15;
        ctx!.shadowColor = "rgba(139, 214, 255, 0.8)";
        ctx!.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();

        // Draw wish text
        ctx!.fillStyle = `rgba(185, 230, 255, ${this.opacity * 0.85})`;
        ctx!.font = "italic 14px var(--font-cormorant), serif";
        ctx!.fillText(this.text, this.x + 8, this.y + 4);
        ctx!.restore();

        return true;
      }
    }

    const starsCount = Math.floor((width * height) / 7000);
    const firefliesCount = Math.floor((width * height) / 35000) + 10;
    const petalsCount = Math.floor((width * height) / 45000) + 6;
    const heartsCount = Math.floor((width * height) / 50000) + 5;

    const stars: Star[] = Array.from({ length: starsCount }, () => new Star());
    const shootingStar = new ShootingStar();
    const fogs: Fog[] = Array.from({ length: 3 }, () => new Fog());
    const fireflies: Firefly[] = Array.from({ length: firefliesCount }, () => new Firefly());
    const petals: Petal[] = Array.from({ length: petalsCount }, () => new Petal());
    const hearts: Heart[] = Array.from({ length: heartsCount }, () => new Heart());
    const wishStars: WishStar[] = [];

    // Register global event listener for spawning wishes
    const handleSpawnWish = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      wishStars.push(new WishStar(customEvent.detail.text));
    };
    window.addEventListener("spawn-wish-star", handleSpawnWish);

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => star.update(tick));
      fogs.forEach((fog) => fog.update(tick));
      drawAurora(tick);
      shootingStar.update();
      fireflies.forEach((ff) => ff.update(tick));
      hearts.forEach((h) => h.update(tick));
      petals.forEach((p) => p.update(tick));

      // Update wishes
      for (let i = wishStars.length - 1; i >= 0; i--) {
        const active = wishStars[i].update();
        if (!active) {
          wishStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("spawn-wish-star", handleSpawnWish);
    };
  }, [windowSize, intensity, isMagicTime]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
