import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { CONTACT_EMAIL, type DiagnosticContext } from '../lib/siteConfig';

interface CTASectionProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
  context?: DiagnosticContext;
  title?: string;
  description?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onOpenConsultation,
  context = 'general',
  title = 'Comencemos revisando juntos tu operación.',
  description = 'En una sesión de 30 minutos mapeamos tus herramientas actuales, detectamos el primer proceso con retorno real y definimos la etapa inicial sin compromiso.',
}) => {
  return (
    <section
      id="contacto"
      className="py-20 sm:py-24 px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
          {title}
        </h2>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            id="main-footer-cta"
            type="button"
            onClick={() => onOpenConsultation(context)}
            className="group inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 py-3.5 bg-[#E10600] hover:bg-[#C50500] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors duration-200 shadow-[0_8px_24px_rgba(225,6,0,0.2)] cursor-pointer"
          >
            <span>Agendar diagnóstico</span>
            <ArrowUpRight
              aria-hidden="true"
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 py-3.5 text-sm sm:text-base font-medium text-[#111111] bg-white border border-neutral-300 hover:border-[#111111] rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4 text-neutral-600" aria-hidden="true" />
            <span>{CONTACT_EMAIL}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
