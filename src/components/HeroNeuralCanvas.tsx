import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

interface Pulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export const HeroNeuralCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    let animationFrameId: number | null = null;
    let pulseInterval: number | null = null;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const particles: Particle[] = [];
    const pulses: Pulse[] = [];

    const resizeAndInit = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.parentElement.clientHeight || window.innerHeight;
      const isNarrowMobile = width < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, isNarrowMobile ? 1.5 : 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleCount = isNarrowMobile
        ? Math.min(Math.floor((width * height) / 22000), 26)
        : Math.min(Math.floor((width * height) / 12000), 75);
      particles.length = 0;
      pulses.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          radius: Math.random() * 1.8 + 1.4,
          baseAlpha: Math.random() * 0.35 + 0.45,
        });
      }
    };

    const drawFrame = (advance: boolean) => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections between nearby nodes
      const maxDist = 175;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(160, 165, 180, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw Rosso Corsa pulse signals traveling between nodes
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        const p1 = particles[pulse.fromIndex];
        const p2 = particles[pulse.toIndex];

        if (p1 && p2) {
          const px = p1.x + (p2.x - p1.x) * pulse.progress;
          const py = p1.y + (p2.y - p1.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(225, 6, 0, 0.95)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(225, 6, 0, 0.3)';
          ctx.fill();

          if (advance) {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) {
              pulses.splice(p, 1);
            }
          }
        } else {
          pulses.splice(p, 1);
        }
      }

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (advance) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 125, 135, ${p.baseAlpha})`;
        ctx.fill();
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (pulseInterval !== null) {
        window.clearInterval(pulseInterval);
        pulseInterval = null;
      }
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        drawFrame(false);
        return;
      }
      if (animationFrameId !== null) return;

      pulseInterval = window.setInterval(() => {
        if (particles.length < 2) return;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 170 && Math.random() > 0.45) {
              pulses.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: 0.01 + Math.random() * 0.01,
              });
              if (pulses.length > 8) pulses.shift();
              return;
            }
          }
        }
      }, 1200);

      const render = () => {
        drawFrame(true);
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    };

    const syncRunning = () => {
      if (isVisible && !document.hidden && !prefersReducedMotion) {
        startLoop();
      } else {
        stopLoop();
        if (prefersReducedMotion) drawFrame(false);
      }
    };

    resizeAndInit();
    syncRunning();

    const handleResize = () => {
      resizeAndInit();
      if (prefersReducedMotion) drawFrame(false);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      syncRunning();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        syncRunning();
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', syncRunning);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', syncRunning);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-neural-canvas"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none w-full h-full opacity-60 sm:opacity-85 z-0"
    />
  );
};
