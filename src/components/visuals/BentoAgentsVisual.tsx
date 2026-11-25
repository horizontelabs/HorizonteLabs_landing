import React from 'react';
import { motion } from 'motion/react';
import { BlueprintFrame, BlueprintArrowV, useBlueprintMotion } from './blueprint';

const agentSlots = [
  { name: 'Atención y CRM', action: 'lee historial · responde' },
  { name: 'Operaciones', action: 'verifica · registra' },
  { name: 'Soporte interno', action: 'consulta · prepara' },
];

export const BentoAgentsVisual: React.FC = () => {
  const { item } = useBlueprintMotion();

  return (
    <BlueprintFrame
      label="Agentes sobre la capa"
      badge="Escenario ilustrativo"
    >
      <div className="w-full flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {agentSlots.map((slot) => (
            <motion.div
              key={slot.name}
              variants={item}
              className="border border-[#E10600] bg-white px-3 py-2.5 rounded-md text-left"
            >
              <span className="block text-[11px] font-mono-code uppercase tracking-[0.1em] text-[#C50500] font-semibold">
                {slot.name}
              </span>
              <span className="block text-[11px] text-neutral-600 mt-1">{slot.action}</span>
            </motion.div>
          ))}
        </div>

        <div className="hidden sm:grid grid-cols-3 gap-2.5">
          {agentSlots.map((slot) => (
            <div key={slot.name} className="flex justify-center">
              <BlueprintArrowV bidirectional className="h-10" />
            </div>
          ))}
        </div>
        <div className="flex sm:hidden justify-center py-1">
          <BlueprintArrowV bidirectional className="h-7" />
        </div>

        <motion.div
          variants={item}
          className="border border-neutral-300 bg-[#FAFAFA] px-4 py-3 rounded-md text-center"
        >
          <span className="block text-[11px] font-mono-code uppercase tracking-[0.14em] text-[#111111] font-semibold">
            Sustrato
          </span>
          <span className="block text-xs leading-snug text-neutral-600 mt-1">
            Información, permisos, criterios del negocio y log de auditoría
          </span>
        </motion.div>
      </div>
    </BlueprintFrame>
  );
};
