import React, { useId, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

type DiscountScenario = '5' | '15';

interface GovernanceSectionProps {
  compact?: boolean;
  id?: string;
}

const scenarios: Record<
  DiscountScenario,
  {
    optionLabel: string;
    requestTitle: string;
    verdictText: string;
    resultTitle: string;
    resultDescription: string;
    requiresApproval: boolean;
  }
> = {
  '5': {
    optionLabel: 'Descuento de 5 %',
    requestTitle: 'Descuento de 5 %',
    verdictText: '5 % está dentro del límite.',
    resultTitle: 'Ejecutado y registrado',
    resultDescription: 'El agente actualiza el CRM y guarda el historial con sus fuentes.',
    requiresApproval: false,
  },
  '15': {
    optionLabel: 'Descuento de 15 %',
    requestTitle: 'Descuento de 15 %',
    verdictText: '15 % supera el límite.',
    resultTitle: 'Espera tu aprobación',
    resultDescription:
      'Una persona de tu equipo lo revisa antes de que se ejecute. También queda registrado.',
    requiresApproval: true,
  },
};

const pillars = [
  {
    title: 'Reglas claras',
    description: 'Defines qué puede hacer cada agente y hasta dónde.',
  },
  {
    title: 'Aprobación humana',
    description: 'Lo crítico espera tu visto bueno.',
  },
  {
    title: 'Todo trazable',
    description: 'Cada acción queda registrada con su fuente.',
  },
];

export const GovernanceSection: React.FC<GovernanceSectionProps> = ({
  compact = false,
  id = 'gobernanza',
}) => {
  const [selected, setSelected] = useState<DiscountScenario>('5');
  const groupName = useId();
  const current = scenarios[selected];

  return (
    <section
      id={id}
      className={`bg-white text-[#111111] border-t border-neutral-200 ${
        compact ? 'py-16 sm:py-[72px]' : 'pt-[72px] pb-20'
      } px-5 sm:px-10`}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Heading + Subtitle (único h2 de la sección) */}
        <h2 className="text-[40px] sm:text-[52px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.035em] text-[#111111] max-w-[760px]">
          Tú pones las reglas. Los agentes las cumplen.
        </h2>
        <p className="mt-5 text-[18px] sm:text-[20px] leading-[1.5] text-neutral-600 max-w-[560px]">
          Piden aprobación cuando importa y todo queda registrado.
        </p>

        {/* Toggle row */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <span id={`${groupName}-label`} className="text-[15px] text-neutral-600">
            Prueba con dos solicitudes:
          </span>

          <div
            role="radiogroup"
            aria-labelledby={`${groupName}-label`}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl sm:rounded-full bg-neutral-100 border border-neutral-200 max-w-full"
          >
            {(['5', '15'] as const).map((value) => {
              const isChecked = selected === value;
              const inputId = `${groupName}-${value}`;
              return (
                <div key={value} className="relative">
                  <input
                    id={inputId}
                    type="radio"
                    name={groupName}
                    value={value}
                    checked={isChecked}
                    onChange={() => setSelected(value)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={inputId}
                    className={`inline-flex items-center justify-center min-h-[44px] px-4 sm:px-[22px] py-2.5 rounded-full text-[14px] sm:text-[16px] font-medium whitespace-nowrap cursor-pointer select-none transition-colors duration-200 peer-focus-visible:outline-[3px] peer-focus-visible:outline-solid peer-focus-visible:outline-[#C50500] peer-focus-visible:outline-offset-2 ${
                      isChecked
                        ? 'bg-[#111111] text-white'
                        : 'text-[#111111] hover:bg-neutral-200/60'
                    }`}
                  >
                    {scenarios[value].optionLabel}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-card interactive flow */}
        <div
          aria-live="polite"
          className="mt-7 grid grid-cols-1 min-[861px]:grid-cols-[1fr_32px_1fr_32px_1fr] items-stretch gap-y-2"
        >
          {/* Card 1: Solicitud */}
          <div className="bg-[#FFF8F8] border border-[#E10600]/35 rounded-2xl p-7 min-h-[210px] flex flex-col gap-3 transition-colors duration-200">
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-neutral-600">
              1 · Solicitud
            </p>
            <p className="text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#111111]">
              {current.requestTitle}
            </p>
            <p className="text-[16px] leading-[1.5] text-neutral-600">
              Un cliente pide un descuento sobre su pedido.
            </p>
          </div>

          {/* Arrow 1 */}
          <div className="flex items-center justify-center py-1 min-[861px]:py-0" aria-hidden="true">
            <ChevronRight
              className="w-6 h-6 text-[#A3A3A3] rotate-90 min-[861px]:rotate-0"
              strokeWidth={2}
            />
          </div>

          {/* Card 2: Regla */}
          <div className="bg-[#FFF8F8] border border-[#E10600]/35 rounded-2xl p-7 min-h-[210px] flex flex-col gap-3 transition-colors duration-200">
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-neutral-600">
              2 · Regla
            </p>
            <p className="text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#111111]">
              Hasta 10 % se ejecuta solo
            </p>
            <div
              className={`mt-auto pt-1 flex items-start gap-2.5 text-[16px] font-medium leading-[1.45] transition-colors duration-200 ${
                current.requiresApproval ? 'text-[#B3241A]' : 'text-[#111111]'
              }`}
            >
              {current.requiresApproval ? (
                <AlertTriangle
                  className="w-5 h-5 shrink-0 mt-0.5 text-[#B3241A]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  className="w-5 h-5 shrink-0 mt-0.5 text-[#111111]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              <span>{current.verdictText}</span>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="flex items-center justify-center py-1 min-[861px]:py-0" aria-hidden="true">
            <ChevronRight
              className="w-6 h-6 text-[#A3A3A3] rotate-90 min-[861px]:rotate-0"
              strokeWidth={2}
            />
          </div>

          {/* Card 3: Resultado */}
          <div
            className={`rounded-2xl p-7 min-h-[210px] flex flex-col gap-3 border-[1.5px] transition-colors duration-200 ${
              current.requiresApproval
                ? 'bg-[#FFF0EF] border-[#C50500]'
                : 'bg-[#FFF8F8] border-[#111111]'
            }`}
          >
            <p
              className={`inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 ${
                current.requiresApproval ? 'text-[#B3241A]' : 'text-[#111111]'
              }`}
            >
              <span>3 · Resultado</span>
              {current.requiresApproval ? (
                <Clock className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              )}
            </p>
            <p className="text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#111111]">
              {current.resultTitle}
            </p>
            <p className="text-[16px] leading-[1.5] text-neutral-600">
              {current.resultDescription}
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="mt-14 pt-8 border-t border-neutral-200 grid grid-cols-1 min-[861px]:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title}>
              <p className="text-[17px] font-semibold text-[#111111] leading-snug">
                {pillar.title}
              </p>
              <p className="mt-1.5 text-[15px] leading-[1.5] text-neutral-600">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
