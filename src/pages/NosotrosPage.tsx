import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { TeamSection } from '../components/TeamSection';
import { CTASection } from '../components/CTASection';
import { SustratoBackdrop } from '../components/SustratoBackdrop';
import { Link } from '../lib/router';
import { SITE_URL, type DiagnosticContext } from '../lib/siteConfig';

interface NosotrosPageProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
}

export const NosotrosPage: React.FC<NosotrosPageProps> = ({ onOpenConsultation }) => {
  return (
    <>
      <PageMeta
        title="Nosotros · sustrato.ai"
        description="Conoce al equipo de ingeniería detrás de sustrato.ai y cómo construimos infraestructura operativa de IA y software a medida."
        path="/nosotros"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'Nosotros — sustrato.ai',
          url: `${SITE_URL}/nosotros`,
        }}
      />

      <section className="relative overflow-hidden pt-28 sm:pt-34 pb-16 sm:pb-20 px-5 sm:px-8 lg:px-14 bg-white">
        <SustratoBackdrop variant="orbital" align="right" intensity="medium" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <nav aria-label="Ruta de navegación" className="mb-6 text-xs text-neutral-600 flex items-center gap-2">
            <Link to="/" className="hover:text-[#111111] transition-colors">
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#111111] font-medium" aria-current="page">
              Nosotros
            </span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] leading-[1.08] text-[#111111]">
              Ingeniería aplicada para que la IA opere en el mundo real.
            </h1>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed">
              Combinamos experiencia en sistemas agénticos en producción con desarrollo de software
              empresarial para construir capas operativas claras, auditables y propias de cada
              organización.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => onOpenConsultation('general')}
                className="group inline-flex items-center gap-2.5 min-h-[50px] px-7 py-3.5 bg-[#E10600] hover:bg-[#C50500] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors shadow-[0_8px_24px_rgba(225,6,0,0.2)] cursor-pointer"
              >
                <span>Agendar diagnóstico</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

      {/* [PENDIENTE DE CASOS REALES]: Incorporar módulo de casos documentados y autorizados cuando estén disponibles */}

      <CTASection
        onOpenConsultation={onOpenConsultation}
        context="general"
        backdropVariant="strata"
        title="Hablemos directo sobre tu operación."
        description="Sin intermediarios: revisamos tu contexto técnico y operativo en 30 minutos para definir si tiene sentido trabajar juntos."
      />
    </>
  );
};
