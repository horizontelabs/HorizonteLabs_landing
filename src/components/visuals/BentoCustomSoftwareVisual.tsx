import React from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { BlueprintFrame, BlueprintNode, BlueprintArrowV, useBlueprintMotion } from './blueprint';

const views = ['Panel operativo', 'Aprobaciones', 'Reportes'];

export const BentoCustomSoftwareVisual: React.FC = () => {
  const { item } = useBlueprintMotion();

  return (
    <BlueprintFrame
      label="Software a medida sobre la capa"
      badge="Escenario ilustrativo"
      note="Resuelve primero el flujo diario del equipo y queda expuesto vía API/MCP para que tus agentes también operen sobre él."
    >
      <div className="w-full flex flex-col items-center">
        <BlueprintNode icon={Users} title="Equipo humano" meta="Interfaz web dedicada" />

        <div className="flex items-center gap-2 py-0.5">
          <BlueprintArrowV dir="down" className="h-7" />
          <span className="text-[11px] font-mono-code text-neutral-600">opera diario</span>
        </div>

        <motion.div
          variants={item}
          className="w-full border border-[#E10600] bg-white px-4 py-3 rounded-md text-center"
        >
          <span className="block text-[11px] font-mono-code uppercase tracking-[0.14em] text-[#C50500] font-semibold mb-2">
            Aplicación a medida
          </span>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {views.map((view) => (
              <span
                key={view}
                className="border border-neutral-200 bg-[#FAFAFA] px-2.5 py-1 text-xs text-neutral-700 rounded"
              >
                {view}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center gap-2 py-0.5">
          <BlueprintArrowV bidirectional accent className="h-8" />
          <span className="text-[11px] font-mono-code text-neutral-600">API / MCP con permisos</span>
        </div>

        <motion.div
          variants={item}
          className="w-full border border-neutral-300 bg-[#FAFAFA] px-4 py-2.5 rounded-md text-center"
        >
          <span className="block text-[11px] font-mono-code uppercase tracking-[0.14em] text-[#111111] font-semibold">
            Sustrato y agentes
          </span>
          <span className="block text-xs text-neutral-600 mt-0.5">
            misma información, reglas y registro auditable
          </span>
        </motion.div>
      </div>
    </BlueprintFrame>
  );
};
