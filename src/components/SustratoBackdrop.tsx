import React, { useEffect, useRef } from 'react';

export type BackdropVariant = 'neural' | 'strata' | 'orbital' | 'lattice';
export type BackdropIntensity = 'subtle' | 'medium' | 'hero';
export type BackdropTone = 'light' | 'dark';
export type BackdropAlign = 'center' | 'right' | 'top-right';

interface SustratoBackdropProps {
  variant: BackdropVariant;
  intensity?: BackdropIntensity;
  tone?: BackdropTone;
  align?: BackdropAlign;
  id?: string;
  className?: string;
}

const INTENSITY_OPACITY: Record<BackdropIntensity, string> = {
  hero: 'opacity-70 sm:opacity-85',
  medium: 'opacity-50 sm:opacity-75',
  subtle: 'opacity-40 sm:opacity-60',
};

interface NeuralParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

interface NeuralPulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

interface StrataWave {
  baseYRatio: number;
  amp1: number;
  amp2: number;
  freq1: number;
  freq2: number;
  speed1: number;
  speed2: number;
  phase: number;
  alpha: number;
}

interface StrataRunner {
  waveIndex: number;
  progress: number;
  speed: number;
  accent: boolean;
}

interface OrbitalRing {
  rxFactor: number;
  ryFactor: number;
  rotation: number;
  nodes: { angle: number; speed: number; radius: number; accent: boolean }[];
}

interface LatticeTrace {
  points: { x: number; y: number }[];
  totalLength: number;
  progress: number; // 0 -> 1.35 (fade out after 1)
  speed: number;
  accent: boolean;
}

export const SustratoBackdrop: React.FC<SustratoBackdropProps> = ({
  variant,
  intensity = 'subtle',
  tone = 'light',
  align = 'right',
  id,
  className = '',
}) => {
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
    let time = 0;

    // Shared palette tokens
    const isDark = tone === 'dark';
    const lineRGB = isDark ? '255, 255, 255' : '155, 160, 175';
    const nodeRGB = isDark ? '255, 255, 255' : '120, 125, 138';
    const accentRGB = '225, 6, 0';

    // Variant state containers
    const particles: NeuralParticle[] = [];
    const pulses: NeuralPulse[] = [];

    const waves: StrataWave[] = [];
    const runners: StrataRunner[] = [];

    let orbitalRings: OrbitalRing[] = [];
    let radarProgress = 0;

    const latticeSpacing = 48;
    const traces: LatticeTrace[] = [];

    const makeLatticeTrace = (w: number, h: number): LatticeTrace => {
      const cols = Math.max(4, Math.floor(w / latticeSpacing));
      const rows = Math.max(3, Math.floor(h / latticeSpacing));
      const offsetX = (w - (cols - 1) * latticeSpacing) / 2;
      const offsetY = (h - (rows - 1) * latticeSpacing) / 2;

      let c = Math.floor(Math.random() * cols);
      let r = Math.floor(Math.random() * rows);
      const pts: { x: number; y: number }[] = [
        { x: offsetX + c * latticeSpacing, y: offsetY + r * latticeSpacing },
      ];

      let horizontal = Math.random() > 0.5;
      const segs = 2 + Math.floor(Math.random() * 2); // 2 or 3 orthogonal segments
      let totalLength = 0;

      for (let s = 0; s < segs; s++) {
        const step = (1 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? 1 : -1);
        const prev = pts[pts.length - 1];
        if (horizontal) {
          c = Math.max(0, Math.min(cols - 1, c + step));
        } else {
          r = Math.max(0, Math.min(rows - 1, r + step));
        }
        const next = { x: offsetX + c * latticeSpacing, y: offsetY + r * latticeSpacing };
        const segLen = Math.hypot(next.x - prev.x, next.y - prev.y);
        if (segLen > 1) {
          pts.push(next);
          totalLength += segLen;
        }
        horizontal = !horizontal;
      }

      return {
        points: pts,
        totalLength: Math.max(totalLength, 1),
        progress: Math.random() * 0.4,
        speed: 0.0028 + Math.random() * 0.0022,
        accent: Math.random() > 0.4,
      };
    };

    const resizeAndInit = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      const nextW = parent.clientWidth || window.innerWidth;
      const nextH = parent.clientHeight || 400;
      if (Math.abs(nextW - width) < 2 && Math.abs(nextH - height) < 2 && width > 0) return;

      width = nextW;
      height = nextH;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (variant === 'neural') {
        const cap =
          intensity === 'hero'
            ? isMobile
              ? 32
              : 75
            : intensity === 'medium'
              ? isMobile
                ? 24
                : 48
              : isMobile
                ? 18
                : 34;
        const divisor = intensity === 'hero' ? 12000 : 18000;
        const count = Math.min(Math.max(12, Math.floor((width * height) / divisor)), cap);
        particles.length = 0;
        pulses.length = 0;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 1.7 + 1.3,
            baseAlpha: Math.random() * 0.32 + 0.42,
          });
        }
      } else if (variant === 'strata') {
        const waveCount = isMobile ? 5 : intensity === 'medium' ? 7 : 6;
        waves.length = 0;
        runners.length = 0;
        for (let i = 0; i < waveCount; i++) {
          const ratio = 0.14 + (i / Math.max(1, waveCount - 1)) * 0.72;
          waves.push({
            baseYRatio: ratio,
            amp1: 12 + (i % 3) * 7,
            amp2: 5 + ((i + 1) % 3) * 4,
            freq1: 0.0024 + (i % 4) * 0.0005,
            freq2: 0.0052 + (i % 3) * 0.0008,
            speed1: 0.0045 + (i % 3) * 0.0014,
            speed2: 0.0032 + (i % 2) * 0.0012,
            phase: i * 1.15,
            alpha: 0.38 + (i % 3) * 0.08,
          });
          runners.push({
            waveIndex: i,
            progress: Math.random(),
            speed: 0.00055 + Math.random() * 0.00045,
            accent: i === 1 || i === waveCount - 2 || i === Math.floor(waveCount / 2),
          });
        }
      } else if (variant === 'orbital') {
        orbitalRings = [
          {
            rxFactor: 0.36,
            ryFactor: 0.2,
            rotation: -0.28,
            nodes: [
              { angle: 0.4, speed: 0.0048, radius: 3.1, accent: true },
              { angle: 3.6, speed: 0.0048, radius: 2.1, accent: false },
            ],
          },
          {
            rxFactor: 0.62,
            ryFactor: 0.34,
            rotation: 0.22,
            nodes: [
              { angle: 1.9, speed: -0.0032, radius: 2.4, accent: false },
              { angle: 5.0, speed: -0.0032, radius: 2.0, accent: false },
            ],
          },
          {
            rxFactor: 0.86,
            ryFactor: 0.46,
            rotation: -0.45,
            nodes: [
              { angle: 2.8, speed: 0.0022, radius: 2.8, accent: true },
              { angle: 0.1, speed: 0.0022, radius: 2.0, accent: false },
            ],
          },
          {
            rxFactor: 1.08,
            ryFactor: 0.62,
            rotation: 0.35,
            nodes: [{ angle: 4.2, speed: -0.0016, radius: 2.2, accent: false }],
          },
        ];
      } else if (variant === 'lattice') {
        const traceCount = isMobile ? 4 : intensity === 'subtle' ? 6 : 8;
        traces.length = 0;
        for (let i = 0; i < traceCount; i++) {
          const t = makeLatticeTrace(width, height);
          t.progress = (i / traceCount) * 1.2;
          traces.push(t);
        }
      }
    };

    const evalWaveY = (w: StrataWave, x: number, t: number) =>
      w.baseYRatio * height +
      Math.sin(x * w.freq1 + t * w.speed1 + w.phase) * w.amp1 +
      Math.cos(x * w.freq2 - t * w.speed2 + w.phase * 0.7) * w.amp2;

    const drawNeural = (advance: boolean) => {
      const maxDist = intensity === 'hero' ? 175 : 155;
      const lineScale = isDark ? 0.22 : 0.35;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * lineScale;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        const p1 = particles[pulse.fromIndex];
        const p2 = particles[pulse.toIndex];
        if (p1 && p2) {
          const px = p1.x + (p2.x - p1.x) * pulse.progress;
          const py = p1.y + (p2.y - p1.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRGB}, 0.95)`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRGB}, ${isDark ? 0.38 : 0.28})`;
          ctx.fill();

          if (advance) {
            pulse.progress += pulse.speed;
            if (pulse.progress >= 1) pulses.splice(p, 1);
          }
        } else {
          pulses.splice(p, 1);
        }
      }

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
        ctx.fillStyle = `rgba(${nodeRGB}, ${isDark ? p.baseAlpha * 0.55 : p.baseAlpha})`;
        ctx.fill();
      }
    };

    const drawStrata = (advance: boolean) => {
      if (advance) time += 1;
      const stepX = 18;

      for (let i = 0; i < waves.length; i++) {
        const w = waves[i];
        ctx.beginPath();
        for (let x = 0; x <= width + stepX; x += stepX) {
          const y = evalWaveY(w, x, time);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${lineRGB}, ${w.alpha})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }

      for (const r of runners) {
        const w = waves[r.waveIndex];
        if (!w) continue;
        if (advance) {
          r.progress += r.speed;
          if (r.progress > 1.06) r.progress = -0.06;
        }
        const x = r.progress * width;
        const y = evalWaveY(w, x, time);

        if (r.accent) {
          // Subtle trailing highlight along the stratum
          ctx.beginPath();
          for (let dx = -36; dx <= 0; dx += 6) {
            const tx = x + dx;
            const ty = evalWaveY(w, tx, time);
            if (dx === -36) ctx.moveTo(tx, ty);
            else ctx.lineTo(tx, ty);
          }
          ctx.strokeStyle = `rgba(${accentRGB}, 0.42)`;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRGB}, 0.9)`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 6.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRGB}, 0.2)`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 2.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${nodeRGB}, 0.55)`;
          ctx.fill();
        }
      }
    };

    const drawOrbital = (advance: boolean) => {
      const cx =
        align === 'center' ? width * 0.5 : align === 'top-right' ? width * 0.85 : width * 0.83;
      const cy = align === 'top-right' ? Math.min(height * 0.28, 210) : height * 0.5;
      const baseRadius = Math.min(width * 0.34, Math.max(height * 0.42, 160), 290);

      // Periodic soft pulse from nucleus
      if (advance) {
        radarProgress = (radarProgress + 0.0032) % 1;
      }
      const radarR = 10 + radarProgress * baseRadius * 0.72;
      const radarAlpha = Math.sin(radarProgress * Math.PI) * 0.24;
      if (radarAlpha > 0.01) {
        ctx.beginPath();
        ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentRGB}, ${radarAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Nucleus
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentRGB}, 0.72)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentRGB}, 0.12)`;
      ctx.fill();

      // Elliptical orbits + orbiting nodes
      for (const ring of orbitalRings) {
        const rx = baseRadius * ring.rxFactor;
        const ry = baseRadius * ring.ryFactor;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring.rotation);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${lineRGB}, 0.32)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        for (const node of ring.nodes) {
          if (advance) node.angle += node.speed;
          const nx = Math.cos(node.angle) * rx;
          const ny = Math.sin(node.angle) * ry;

          if (node.accent) {
            ctx.beginPath();
            ctx.arc(nx, ny, node.radius + 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentRGB}, 0.22)`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.accent ? `rgba(${accentRGB}, 0.92)` : `rgba(${nodeRGB}, 0.6)`;
          ctx.fill();
        }

        ctx.restore();
      }
    };

    const drawLattice = (advance: boolean) => {
      const cols = Math.max(4, Math.floor(width / latticeSpacing));
      const rows = Math.max(3, Math.floor(height / latticeSpacing));
      const offsetX = (width - (cols - 1) * latticeSpacing) / 2;
      const offsetY = (height - (rows - 1) * latticeSpacing) / 2;

      // Subtle dot matrix
      ctx.fillStyle = `rgba(${nodeRGB}, ${isDark ? 0.22 : 0.26})`;
      for (let c = 0; c < cols; c++) {
        const x = offsetX + c * latticeSpacing;
        for (let r = 0; r < rows; r++) {
          const y = offsetY + r * latticeSpacing;
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      // Orthogonal traces with traveling pulses
      for (let i = 0; i < traces.length; i++) {
        const tr = traces[i];
        if (advance) {
          tr.progress += tr.speed;
          if (tr.progress >= 1.35) {
            traces[i] = makeLatticeTrace(width, height);
            traces[i].progress = 0;
            continue;
          }
        }

        const fade =
          tr.progress < 0.15
            ? tr.progress / 0.15
            : tr.progress > 1.0
              ? Math.max(0, 1 - (tr.progress - 1.0) / 0.35)
              : 1;

        if (tr.points.length < 2 || fade <= 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(tr.points[0].x, tr.points[0].y);
        for (let p = 1; p < tr.points.length; p++) {
          ctx.lineTo(tr.points[p].x, tr.points[p].y);
        }
        ctx.strokeStyle = `rgba(${lineRGB}, ${0.34 * fade})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Start & end terminal nodes
        const first = tr.points[0];
        const last = tr.points[tr.points.length - 1];
        for (const pt of [first, last]) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${nodeRGB}, ${0.5 * fade})`;
          ctx.fill();
        }

        // Traveling signal dot along the polyline
        const travel = Math.min(1, tr.progress);
        let targetDist = travel * tr.totalLength;
        let px = first.x;
        let py = first.y;
        for (let p = 1; p < tr.points.length; p++) {
          const a = tr.points[p - 1];
          const b = tr.points[p];
          const segLen = Math.hypot(b.x - a.x, b.y - a.y);
          if (targetDist <= segLen || p === tr.points.length - 1) {
            const ratio = segLen > 0 ? Math.min(1, targetDist / segLen) : 0;
            px = a.x + (b.x - a.x) * ratio;
            py = a.y + (b.y - a.y) * ratio;
            break;
          }
          targetDist -= segLen;
        }

        if (tr.accent) {
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRGB}, ${0.24 * fade})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRGB}, ${0.9 * fade})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${nodeRGB}, ${0.72 * fade})`;
          ctx.fill();
        }
      }
    };

    const drawFrame = (advance: boolean) => {
      if (width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);
      if (variant === 'neural') drawNeural(advance);
      else if (variant === 'strata') drawStrata(advance);
      else if (variant === 'orbital') drawOrbital(advance);
      else drawLattice(advance);
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

      if (variant === 'neural') {
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
      }

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

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        syncRunning();
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(canvas);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', syncRunning);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      stopLoop();
      intersectionObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', syncRunning);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [variant, intensity, tone, align]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none w-full h-full z-0 ${INTENSITY_OPACITY[intensity]} ${className}`}
    />
  );
};
