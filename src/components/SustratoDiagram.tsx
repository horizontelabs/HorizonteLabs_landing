import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowRight, ChevronRight } from 'lucide-react';
import { SustratoMark } from './SustratoMark';
import { Link } from '../lib/router';

interface ConsumerItem {
  tag: string;
  title: string;
  detail: string;
  accent?: boolean;
}

interface Consumer {
  id: 'agentes' | 'automatizaciones' | 'software';
  tabLabel: React.ReactNode;
  title: string;
  description: string;
  route: string;
  routeLabel: string;
  flow?: boolean;
  items: ConsumerItem[];
}

const consumers: Consumer[] = [
  {
    id: 'agentes',
    tabLabel: 'Agentes',
    title: 'Agentes con rol acotado',
    description:
      'Operan sobre tus sistemas con contexto real, permisos definidos y aprobación humana cuando corresponde.',
    route: '/soluciones',
    routeLabel: 'Ver Soluciones tecnológicas',
    items: [
      { tag: 'Comercial', title: 'Atención y CRM', detail: 'Lee historial · responde' },
      { tag: 'Backoffice', title: 'Operaciones', detail: 'Verifica · registra' },
      { tag: 'Equipo', title: 'Soporte interno', detail: 'Consulta · prepara' },
    ],
  },
  {
    id: 'automatizaciones',
    tabLabel: 'Automatizaciones',
    title: 'Flujos conectados de extremo a extremo',
    description:
      'Procesos repetitivos que hoy dependen de copiar datos pasan a ejecutarse con reglas claras y registro.',
    route: '/soluciones',
    routeLabel: 'Explorar flujos paso a paso',
    flow: true,
    items: [
      { tag: '01 · Evento', title: 'Disparador', detail: 'Correo, ticket o CRM' },
      { tag: '02 · Regla', title: 'Criterio en Sustrato', detail: 'Historial y permisos', accent: true },
      { tag: '03 · Resultado', title: 'Acción trazable', detail: 'Actualiza o escala' },
    ],
  },
  {
    id: 'software',
    tabLabel: (
      <>
        Software<span className="sr-only sm:not-sr-only"> a medida</span>
      </>
    ),
    title: 'Aplicaciones propias para tu equipo y tus agentes',
    description:
      'Paneles, portales e integradores diseñados para el trabajo diario y expuestos vía API/MCP desde el día 1.',
    route: '/ingenieria',
    routeLabel: 'Ver Ingeniería de software',
    flow: true,
    items: [
      { tag: 'Interfaz', title: 'Tu equipo', detail: 'Paneles y aprobaciones' },
      { tag: 'Contrato', title: 'API / MCP', detail: 'Permisos y auditoría', accent: true },
      { tag: 'Operación', title: 'Agentes', detail: 'Mismo contexto y reglas' },
    ],
  },
];

const sustratoPillars = ['Información', 'Criterios', 'Permisos', 'Trazabilidad'];

const feeds = [
  'Comunicación',
  'Canales de entrada',
  'Documentos',
  'Datos de operación',
  'ERP y CRM',
  'Aplicaciones propias',
];

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
      className="py-12 sm:py-24 lg:py-28 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200"
    >
      <div className="max-w-5xl mx-auto">
        {/* Concise header */}
        <div className="max-w-2xl mb-7 sm:mb-12">
          <h2 className="text-[1.75rem] sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
            Una capa compartida, construida pieza a pieza.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Agentes, automatizaciones y software a medida operando sobre tus sistemas actuales, sin
            partir de cero en cada proyecto.
          </p>
        </div>

        {/* Unified 3-tier architecture card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-7 lg:p-8">
          {/* Tier 1: What runs on top (interactive) */}
          <div
            role="tablist"
            aria-label="Capacidades que operan sobre el sustrato"
            className="grid grid-cols-[1fr_1.45fr_1fr] sm:grid-cols-3 gap-1 sm:gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200"
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
                  className={`relative min-h-[44px] px-1.5 sm:px-4 py-2.5 rounded-lg text-[12px] sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
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
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                        isSelected ? 'bg-[#E10600]' : 'bg-neutral-400'
                      }`}
                    />
                    <span>{consumer.tabLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeConsumer.id}
              id={`sustrato-panel-${activeConsumer.id}`}
              role="tabpanel"
              aria-labelledby={`sustrato-tab-${activeConsumer.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 sm:mt-7 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center"
            >
              {/* Short explanation + route link */}
              <div className="lg:col-span-5 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-[#111111] tracking-[-0.02em] leading-snug">
                  {activeConsumer.title}
                </h3>
                <p className="mt-2 text-base sm:text-sm text-neutral-600 leading-relaxed">
                  {activeConsumer.description}
                </p>
                <Link
                  to={activeConsumer.route}
                  className="mt-3 sm:mt-4 inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#C50500] hover:text-[#111111] transition-colors"
                >
                  <span>{activeConsumer.routeLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Clean 3-node micro-diagram (no duplicated Sustrato box) */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeConsumer.items.map((item, idx) => (
                    <div key={item.title} className="relative flex flex-col">
                      <div
                        className={`h-full rounded-xl border px-3.5 py-3 flex flex-col justify-between ${
                          item.accent
                            ? 'border-[#E10600]/45 bg-[#FFF8F8]'
                            : 'border-neutral-200 bg-[#FAFAFA]'
                        }`}
                      >
                        <span
                          className={`block text-[11px] font-mono-code uppercase tracking-wider font-semibold ${
                            item.accent ? 'text-[#C50500]' : 'text-neutral-600'
                          }`}
                        >
                          {item.tag}
                        </span>
                        <span className="mt-1.5 block text-sm font-semibold text-[#111111] leading-snug">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs text-neutral-600 leading-snug">
                          {item.detail}
                        </span>
                      </div>
                      {activeConsumer.flow && idx < activeConsumer.items.length - 1 && (
                        <ChevronRight
                          aria-hidden="true"
                          className="hidden sm:block w-4 h-4 text-neutral-400 absolute -right-3.5 top-1/2 -translate-y-1/2 z-10"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Connector: Tier 1 -> Tier 2 */}
          <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="inline-flex items-center gap-1 text-[11px] font-mono-code uppercase tracking-wider text-neutral-600">
              <span>operan sobre</span>
              <ArrowDown className="w-3 h-3 text-[#E10600]" />
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* Tier 2: Single protagonist Sustrato bar */}
          <div className="bg-[#FFF8F8] border border-[#E10600]/30 rounded-xl px-4 sm:px-7 py-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <SustratoMark idPrefix="slab" className="h-7 w-7 text-[#111111]" />
              <span className="text-xs font-mono-code uppercase tracking-[0.22em] text-[#C50500] font-bold">
                Sustrato
              </span>
            </div>

            <ul className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto">
              {sustratoPillars.map((pillar) => (
                <li
                  key={pillar}
                  className="bg-white/90 border border-[#E10600]/20 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#111111]"
                >
                  {pillar}
                </li>
              ))}
            </ul>
          </div>

          {/* Tier 3: Connected operational sources */}
          <div className="mt-5">
            <p className="text-center text-[11px] font-mono-code uppercase tracking-wider text-neutral-600 mb-3">
              Conectado a tus sistemas actuales
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {feeds.map((feed) => (
                <span
                  key={feed}
                  className="px-3 py-1.5 bg-[#FAFAFA] border border-neutral-200 rounded-full text-xs font-medium text-neutral-700"
                >
                  {feed}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
