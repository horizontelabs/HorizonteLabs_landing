import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

/**
 * Primitivas compartidas por los diagramas blueprint de sustrato.ai.
 * - Trazo hairline de 1px, geometría limpia, paleta blanco/negro + acento #E10600 puntual.
 * - Respeta prefers-reduced-motion en todas las variantes.
 */

const ACCENT = '#E10600';
const ARROW_NEUTRAL = '#737373';

export const useBlueprintMotion = () => {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
  };

  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 6 },
        show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
      };

  return { container, item, reduce };
};

interface BlueprintFrameProps {
  label: string;
  badge?: string;
  note?: string;
  minHeightClass?: string;
  children: React.ReactNode;
}

export const BlueprintFrame: React.FC<BlueprintFrameProps> = ({
  label,
  badge,
  note,
  minHeightClass = 'min-h-[260px] sm:min-h-[300px]',
  children,
}) => {
  const { container } = useBlueprintMotion();

  return (
    <div
      className={`relative w-full ${minHeightClass} bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 flex flex-col overflow-hidden`}
    >
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono-code uppercase tracking-[0.14em] text-neutral-600 font-medium">
          {label}
        </span>
        {badge && (
          <span className="text-[11px] font-mono-code text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex-1 flex items-center py-5"
      >
        {children}
      </motion.div>

      {note && (
        <p className="relative z-10 text-xs text-neutral-600 leading-snug border-t border-neutral-200 pt-3">
          {note}
        </p>
      )}
    </div>
  );
};

interface BlueprintNodeProps {
  icon?: LucideIcon;
  title: string;
  meta?: string;
  accent?: boolean;
  muted?: boolean;
  className?: string;
}

export const BlueprintNode: React.FC<BlueprintNodeProps> = ({
  icon: Icon,
  title,
  meta,
  accent = false,
  muted = false,
  className = '',
}) => {
  const { item } = useBlueprintMotion();

  return (
    <motion.div
      variants={item}
      className={`flex items-center gap-2.5 bg-white border px-3 py-2 min-w-0 rounded-md transition-colors duration-200 ${
        accent
          ? 'border-[#E10600] bg-[#FFF8F8]'
          : muted
            ? 'border-neutral-200 bg-neutral-50'
            : 'border-neutral-300'
      } ${className}`}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={`w-4 h-4 shrink-0 ${accent ? 'text-[#E10600]' : 'text-neutral-600'}`}
          strokeWidth={1.6}
        />
      )}
      <div className="min-w-0">
        <span className="block text-xs leading-tight font-semibold text-[#111111] truncate">
          {title}
        </span>
        {meta && (
          <span className="block text-[11px] font-mono-code leading-tight text-neutral-600 mt-0.5 truncate">
            {meta}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const Head: React.FC<{ accent: boolean; dir: 'right' | 'left' | 'up' | 'down' }> = ({
  accent,
  dir,
}) => {
  const fill = accent ? ACCENT : ARROW_NEUTRAL;
  const horizontal = dir === 'right' || dir === 'left';

  const path = {
    right: 'M0 0 L5 3.5 L0 7 Z',
    left: 'M5 0 L0 3.5 L5 7 Z',
    down: 'M0 0 L3.5 5 L7 0 Z',
    up: 'M0 5 L3.5 0 L7 5 Z',
  }[dir];

  return (
    <svg
      width={horizontal ? 5 : 7}
      height={horizontal ? 7 : 5}
      viewBox={horizontal ? '0 0 5 7' : '0 0 7 5'}
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={path} fill={fill} />
    </svg>
  );
};

interface ArrowProps {
  label?: string;
  accent?: boolean;
  bidirectional?: boolean;
  className?: string;
}

export const BlueprintArrowH: React.FC<ArrowProps> = ({
  label,
  accent = false,
  bidirectional = false,
  className = '',
}) => {
  const { item } = useBlueprintMotion();

  return (
    <motion.div
      variants={item}
      className={`relative flex-1 min-w-[20px] flex items-center ${className}`}
    >
      {bidirectional && <Head accent={accent} dir="left" />}
      <span className={`flex-1 h-px ${accent ? 'bg-[#E10600]' : 'bg-neutral-400'}`} />
      <Head accent={accent} dir="right" />
      {label && (
        <span
          className={`absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono-code uppercase tracking-[0.08em] ${
            accent ? 'text-[#C50500] font-semibold' : 'text-neutral-600'
          }`}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
};

interface ArrowVProps {
  accent?: boolean;
  dir?: 'down' | 'up';
  bidirectional?: boolean;
  className?: string;
}

export const BlueprintArrowV: React.FC<ArrowVProps> = ({
  accent = false,
  dir = 'down',
  bidirectional = false,
  className = '',
}) => {
  const { item } = useBlueprintMotion();

  return (
    <motion.div variants={item} className={`flex flex-col items-center ${className}`}>
      {(bidirectional || dir === 'up') && <Head accent={accent} dir="up" />}
      <span className={`w-px flex-1 min-h-[12px] ${accent ? 'bg-[#E10600]' : 'bg-neutral-400'}`} />
      {(bidirectional || dir === 'down') && <Head accent={accent} dir="down" />}
    </motion.div>
  );
};

export const BlueprintColumnLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <span
    className={`block text-[11px] font-mono-code uppercase tracking-[0.12em] text-neutral-600 font-medium ${className}`}
  >
    {children}
  </span>
);
