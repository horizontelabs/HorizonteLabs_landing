import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SustratoMark } from './SustratoMark';
import { BentoAgentsVisual } from './visuals/BentoAgentsVisual';
import { BentoAutomationVisual } from './visuals/BentoAutomationVisual';
import { BentoCustomSoftwareVisual } from './visuals/BentoCustomSoftwareVisual';
import { Link } from '../lib/router';

interface Consumer {
  id: 'agentes' | 'automatizaciones' | 'software';
  label: string;
  shortLabel: string;
  title: string;
  description: string;
  route: string;
  routeLabel: string;
  visual: React.ReactNode;
}

const consumers: Consumer[] = [
  {
    id: 'agentes',
    label: 'Agentes',
    shortLabel: 'Agentes',
    title: 'Agentes integrados a tu operación',
    description:
      'Cada agente asume una responsabilidad acotada —desde captación y seguimiento en CRM hasta consultas sobre documentación interna— apoyándose en la misma capa de criterios, permisos y trazabilidad.',
    route: '/soluciones',
    routeLabel: 'Ver Soluciones tecnológicas',
    visual: <BentoAgentsVisual />,
  },
  {
    id: 'automatizaciones',
    label: 'Automatizaciones',
    shortLabel: 'Flujos',
    title: 'Automatizaciones conectadas de principio a fin',
    description:
      'Procesos repetitivos que hoy dependen de copiar datos, revisar correos o perseguir actualizaciones pasan a ejecutarse con reglas claras y escalamiento humano cuando corresponde.',
    route: '/soluciones',
    routeLabel: 'Explorar flujos paso a paso',
    visual: <BentoAutomationVisual />,
  },
  {
    id: 'software',
    label: 'Software a medida',
    shortLabel: 'Software',
    title: 'Aplicaciones propias listas para tu equipo y tus agentes',
    description:
      'Desarrollamos el software operativo que tu empresa necesita —paneles, portales o integradores— diseñado sobre el sustrato para que tanto las personas como los agentes puedan operarlo.',
    route: '/ingenieria',
    routeLabel: 'Ver Ingeniería de software',
    visual: <BentoCustomSoftwareVisual />,
  },
];

const feeds = [
  'Comunicación',
  'Canales de entrada',
  'Documentos',
  'Datos de operación',
  'ERP y CRM',
  'Aplicaciones propias',
];

const segments = [
  { state: 'done', label: 'Conectores' },
  { state: 'done', label: 'Contexto' },
  { state: 'building', label: 'Criterios' },
  { state: 'next', label: 'Agentes' },
  { state: 'next', label: 'Software' },
] as const;

export const SustratoDiagram: React.FC = () => {
  const [activeId, setActiveId] = useState<Consumer['id']>('agentes');
  const activeConsumer = consumers.find((c) => c.id === activeId) ?? consumers[0];

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveId(consumers[(index + 1) % consumers.length].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveId(consumers[(index - 1 + consumers.length) % consumers.length].id);
    }
  };

  return (
    <section
      id="sustrato"
      className="py-20 sm:py-24 lg:py-28 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header without repeating Hero */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
            Una capa compartida, construida pieza a pieza.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Cada etapa entrega algo utilizable desde el primer día: integraciones, automatizaciones,
            agentes y software a medida. Todo apoya la misma capa, haciendo más simple cada paso
            siguiente.
          </p>
        </div>

        {/* Interactive layer explorer */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-7 lg:p-8">
          {/* Segmented tab bar: always 1 clean row on mobile and desktop */}
          <div
            role="tablist"
            aria-label="Capacidades que operan sobre el sustrato"
            className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200"
          >
            {consumers.map((consumer, index) => {
              const isSelected = consumer.id === activeId;
              return (
                <button
                  key={consumer.id}
                  id={`sustrato-tab-${consumer.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`sustrato-panel-${consumer.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveId(consumer.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`relative min-h-[44px] px-2 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isSelected ? 'text-[#111111]' : 'text-neutral-600 hover:text-[#111111]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="sustrato-active-tab"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-white rounded-lg border border-neutral-200 shadow-[0_1px_3px_rgba(17,17,17,0.06)]"
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isSelected ? 'bg-[#E10600]' : 'bg-neutral-400'
                      }`}
                    />
                    <span className="sm:hidden">{consumer.shortLabel}</span>
                    <span className="hidden sm:inline">{consumer.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeConsumer.id}
              id={`sustrato-panel-${activeConsumer.id}`}
              role="tabpanel"
              aria-labelledby={`sustrato-tab-${activeConsumer.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
            >
              <div className="lg:col-span-5 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-[-0.02em] leading-snug">
                  {activeConsumer.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {activeConsumer.description}
                </p>
                <Link
                  to={activeConsumer.route}
                  className="mt-5 inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#C50500] hover:text-[#111111] transition-colors"
                >
                  <span>{activeConsumer.routeLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="lg:col-span-7">{activeConsumer.visual}</div>
            </motion.div>
          </AnimatePresence>

          {/* Architectural connection divider */}
          <div className="my-6 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-neutral-600">
              operan sobre
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* The Sustrato Slab */}
          <div className="bg-[#FFF8F8] border border-[#E10600]/35 rounded-xl px-5 sm:px-8 py-6 sm:py-7 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <SustratoMark idPrefix="slab" className="h-8 w-8 text-[#111111]" />
              <span className="text-xs font-mono-code uppercase tracking-[0.22em] text-[#C50500] font-bold">
                Sustrato
              </span>
            </div>

            <p className="mt-2.5 text-base sm:text-lg text-[#111111] font-semibold max-w-lg mx-auto">
              La información, los criterios, los permisos y la trazabilidad de tu empresa
            </p>

            {/* Progressive piece-by-piece bar */}
            <div className="mt-5 max-w-lg mx-auto grid grid-cols-5 gap-1.5 sm:gap-2">
              {segments.map((seg) => (
                <div key={seg.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full h-2 rounded-full ${
                      seg.state === 'done'
                        ? 'bg-[#E10600]'
                        : seg.state === 'building'
                          ? 'bg-[#E10600]/45'
                          : 'border border-dashed border-[#E10600]/55 bg-white'
                    }`}
                  />
                  <span className="text-[10px] font-mono-code text-neutral-600 hidden sm:block">
                    {seg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational sources feeding the layer */}
          <div className="mt-6">
            <p className="text-center text-xs font-mono-code uppercase tracking-wider text-neutral-600 mb-3">
              Fuentes que alimentan la capa
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {feeds.map((feed) => (
                <span
                  key={feed}
                  className="px-3.5 py-1.5 bg-[#FAFAFA] border border-neutral-200 rounded-full text-xs font-medium text-neutral-700"
                >
                  {feed}
                </span>
              ))}
            </div>
            <p className="text-center text-xs sm:text-sm text-neutral-600 leading-relaxed mt-4 max-w-2xl mx-auto">
              Sin reemplazar las herramientas que tu equipo ya domina: conectamos correo, mensajería,
              CRM, ERP, bases de datos y aplicaciones internas bajo un mismo estándar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
