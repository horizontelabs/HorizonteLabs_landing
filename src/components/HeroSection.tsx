import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Check } from 'lucide-react';
import type { DiagnosticContext } from '../lib/siteConfig';

interface HeroSectionProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
}

const pillars = [
  'Conectado a tus sistemas actuales',
  'Permisos y aprobación humana',
  'Trazabilidad de cada acción',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 px-5 sm:px-8 lg:px-14 bg-white overflow-hidden">
      {/* Subtle architectural axis frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(225,6,0,0.045),transparent_65%)]"
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.35rem] sm:text-5xl lg:text-[4rem] font-bold tracking-[-0.03em] leading-[1.08] text-[#111111] max-w-4xl"
        >
          Donde los agentes <span className="text-[#D91914]">viven</span>,{' '}
          <span className="text-[#D91914]">actúan</span> y{' '}
          <span className="text-[#D91914]">entienden</span> de tu operación.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed"
        >
          <span className="text-[#111111] font-medium">Un agente solo no llega a tu empresa.</span>{' '}
          Construimos la capa operativa que conecta tus herramientas, aplica tus criterios y deja
          registro de cada paso — sobre ella desplegamos agentes, automatizaciones y software a
          medida.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto"
        >
          <button
            id="hero-primary-cta"
            type="button"
            onClick={() => onOpenConsultation('general')}
            className="group inline-flex items-center justify-center gap-2.5 min-h-[50px] px-7 py-3.5 bg-[#E10600] hover:bg-[#C50500] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors duration-200 shadow-[0_8px_24px_rgba(225,6,0,0.2)] cursor-pointer"
          >
            <span>Agendar diagnóstico</span>
            <ArrowUpRight
              aria-hidden="true"
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

          <a
            href="#sustrato"
            className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3.5 text-sm sm:text-base font-medium text-[#111111] bg-white border border-neutral-300 hover:border-[#111111] rounded-lg transition-colors"
          >
            <span>Explorar cómo funciona</span>
            <ArrowDown aria-hidden="true" className="w-4 h-4 text-neutral-600" />
          </a>
        </motion.div>

        {/* Three concrete operational anchors */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-neutral-600"
        >
          {pillars.map((pillar) => (
            <li key={pillar} className="inline-flex items-center gap-2">
              <Check aria-hidden="true" className="w-4 h-4 text-[#E10600] shrink-0" strokeWidth={2.2} />
              <span>{pillar}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};
