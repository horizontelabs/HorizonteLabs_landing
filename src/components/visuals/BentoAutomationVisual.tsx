import React from 'react';
import { motion } from 'motion/react';
import { BlueprintFrame, BlueprintArrowV, useBlueprintMotion } from './blueprint';

const stages = [
  {
    id: 'disparador',
    label: '01 · Disparador',
    body: 'Un evento real de la operación',
    examples: ['correo entrante', 'ticket nuevo', 'cambio en CRM', 'plazo vencido'],
  },
  {
    id: 'criterio',
    label: '02 · Criterio en Sustrato',
    body: 'Reglas del negocio, historial y permisos',
    examples: ['casos previos', 'umbrales de aprobación'],
  },
  {
    id: 'resultado',
    label: '03 · Acción trazable',
    body: 'La tarea queda ejecutada y registrada',
    examples: ['actualiza sistema', 'deriva a humano', 'genera reporte'],
  },
];

export const BentoAutomationVisual: React.FC = () => {
  const { item } = useBlueprintMotion();

  return (
    <BlueprintFrame
      label="Anatomía de un flujo"
      badge="Escenario ilustrativo"
    >
      <div className="w-full flex flex-col items-stretch">
        {stages.map((stage, i) => (
          <React.Fragment key={stage.id}>
            {i > 0 && (
              <div className="flex justify-center py-1">
                <BlueprintArrowV accent dir="down" className="h-5" />
              </div>
            )}

            <motion.div variants={item} className="flex flex-col">
              <div
                className={`w-full border bg-white px-3.5 py-2.5 rounded-md ${
                  i === 1 ? 'border-[#E10600]' : 'border-neutral-300'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span
                    className={`text-[11px] font-mono-code uppercase tracking-[0.12em] font-semibold ${
                      i === 1 ? 'text-[#C50500]' : 'text-neutral-700'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-xs font-medium text-[#111111]">{stage.body}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {stage.examples.map((example) => (
                    <span
                      key={example}
                      className="text-[11px] font-mono-code text-neutral-600 bg-[#FAFAFA] border border-neutral-200 px-2 py-0.5 rounded"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </BlueprintFrame>
  );
};
