import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Lock, ShieldCheck, UserCheck } from 'lucide-react';

type GovernanceMode = 'autonomo' | 'aprobacion';

interface GovernanceSectionProps {
  compact?: boolean;
  id?: string;
}

const permissions = [
  { system: 'CRM', access: 'Lectura y escritura', tone: 'neutral' as const },
  { system: 'ERP / Pedidos', access: 'Lectura · escritura acotada', tone: 'neutral' as const },
  { system: 'Descuentos > 10 %', access: 'Requiere aprobación', tone: 'accent' as const },
  { system: 'Precios base / Nómina', access: 'Bloqueado', tone: 'locked' as const },
];

const scenarios: Record<
  GovernanceMode,
  {
    label: string;
    summary: string;
    activeRuleIndex: number;
    logs: { time: string; actor: string; detail: string; status: 'done' | 'pending' | 'approved' }[];
  }
> = {
  autonomo: {
    label: 'Acción dentro de reglas',
    summary: 'El agente ejecuta de punta a punta porque la solicitud cae dentro de tus límites definidos.',
    activeRuleIndex: 0,
    logs: [
      { time: '10:14:02', actor: 'Agente', detail: 'Lee solicitud y ficha en CRM', status: 'done' },
      { time: '10:14:05', actor: 'Sustrato', detail: 'Valida regla: descuento 5 % (≤ 10 %)', status: 'done' },
      { time: '10:14:09', actor: 'Agente', detail: 'Genera borrador y actualiza CRM', status: 'done' },
      { time: '10:14:11', actor: 'Auditoría', detail: 'Registro guardado con fuentes usadas', status: 'done' },
    ],
  },
  aprobacion: {
    label: 'Acción crítica con aprobación',
    summary: 'Cuando una operación supera un umbral, el agente frena y pide autorización humana con contexto.',
    activeRuleIndex: 1,
    logs: [
      { time: '11:02:10', actor: 'Agente', detail: 'Detecta solicitud con descuento 15 %', status: 'done' },
      { time: '11:02:12', actor: 'Sustrato', detail: 'Regla disparada: supera tope de 10 %', status: 'pending' },
      { time: '11:04:41', actor: 'Responsable', detail: 'Aprueba excepción desde Slack', status: 'approved' },
      { time: '11:04:44', actor: 'Agente', detail: 'Ejecuta envío y cierra trazabilidad', status: 'done' },
    ],
  },
};

const policies = [
  'Operaciones estándar bajo umbral se ejecutan automáticamente.',
  'Excepciones comerciales o montos críticos exigen aprobación humana.',
  'Credenciales y datos sensibles se aíslan por rol y nunca salen sin filtro.',
  'Cada decisión queda ligada al documento o dato exacto que la respaldó.',
];

export const GovernanceSection: React.FC<GovernanceSectionProps> = ({
  compact = false,
  id = 'gobernanza',
}) => {
  const [mode, setMode] = useState<GovernanceMode>('aprobacion');
  const active = scenarios[mode];

  return (
    <section
      id={id}
      className={`${compact ? 'py-16 sm:py-20' : 'py-20 sm:py-24 lg:py-28'} px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Control, permisos y trazabilidad por diseño.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
              Los agentes no improvisan ni operan como una caja negra. Tú defines qué pueden leer,
              cuándo deben pedir permiso y dónde queda el historial completo.
            </p>
          </div>

          {/* Interactive scenario switch */}
          <div
            role="group"
            aria-label="Simular comportamiento de gobernanza"
            className="inline-flex p-1 bg-neutral-100 border border-neutral-200 rounded-xl self-start"
          >
            {(Object.keys(scenarios) as GovernanceMode[]).map((key) => {
              const selected = mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMode(key)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#111111] text-white'
                      : 'text-neutral-700 hover:text-[#111111]'
                  }`}
                >
                  {scenarios[key].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 scannable columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Column 1: Policies */}
          <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E10600]" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#111111]">Reglas del negocio</h3>
              </div>
              <span className="text-[11px] font-mono-code text-neutral-600">Políticas</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {policies.map((policy, idx) => {
                const isHighlighted = idx === active.activeRuleIndex;
                return (
                  <li
                    key={policy}
                    className={`p-3 rounded-lg border transition-colors ${
                      isHighlighted
                        ? 'bg-white border-[#E10600] text-[#111111] font-medium'
                        : 'bg-white border-neutral-200 text-neutral-700'
                    }`}
                  >
                    {policy}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Audit log */}
          <div className="bg-white border border-neutral-300 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#E10600]" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#111111]">Registro de auditoría</h3>
              </div>
              <span className="text-[11px] font-mono-code text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                Escenario ilustrativo
              </span>
            </div>

            <p className="mt-3 text-xs text-neutral-600 leading-relaxed">{active.summary}</p>

            <AnimatePresence mode="wait">
              <motion.ol
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
                className="mt-4 space-y-2.5 flex-1"
              >
                {active.logs.map((entry) => (
                  <li
                    key={`${entry.time}-${entry.actor}`}
                    className={`p-3 rounded-lg border text-xs ${
                      entry.status === 'pending'
                        ? 'border-[#E10600] bg-[#FFF8F8]'
                        : entry.status === 'approved'
                          ? 'border-[#111111] bg-[#FAFAFA]'
                          : 'border-neutral-200 bg-[#FAFAFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono-code tabular-nums">
                      <span className="text-neutral-600">
                        {entry.time} · <strong className="text-[#111111]">{entry.actor}</strong>
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          entry.status === 'pending'
                            ? 'bg-[#E10600] text-white'
                            : entry.status === 'approved'
                              ? 'bg-[#111111] text-white'
                              : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {entry.status === 'pending'
                          ? 'Aprobación'
                          : entry.status === 'approved'
                            ? 'Aprobado'
                            : 'Completado'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-neutral-700 leading-snug">{entry.detail}</p>
                  </li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>

          {/* Column 3: Permissions matrix */}
          <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E10600]" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#111111]">Permisos por sistema</h3>
              </div>
              <span className="text-[11px] font-mono-code text-neutral-600">Matriz</span>
            </div>

            <div className="mt-4 divide-y divide-neutral-200 border border-neutral-200 rounded-lg bg-white overflow-hidden">
              {permissions.map((perm) => (
                <div
                  key={perm.system}
                  className="px-3.5 py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-semibold text-[#111111]">{perm.system}</span>
                  <span
                    className={`font-mono-code px-2 py-0.5 rounded border text-[11px] shrink-0 ${
                      perm.tone === 'accent'
                        ? 'border-[#E10600]/40 bg-[#FFF8F8] text-[#C50500] font-semibold'
                        : perm.tone === 'locked'
                          ? 'border-neutral-300 bg-neutral-100 text-neutral-700'
                          : 'border-neutral-200 bg-[#FAFAFA] text-neutral-700'
                    }`}
                  >
                    {perm.access}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                El acceso corre con principio de mínimo privilegio y bajo la infraestructura que tu
                equipo apruebe.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
