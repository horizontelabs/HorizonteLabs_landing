import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { SustratoMark } from './SustratoMark';
import { Link } from '../lib/router';
import { CONTACT_EMAIL, type DiagnosticContext } from '../lib/siteConfig';

interface FooterProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  return (
    <footer className="bg-[#FAFAFA] border-t border-neutral-200 text-[#111111]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 pt-12 sm:pt-16 pb-[max(3rem,env(safe-area-inset-bottom))] sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 min-h-[44px]">
              <SustratoMark idPrefix="footer" className="h-9 w-9 shrink-0 text-[#111111]" />
              <span className="flex items-baseline gap-0.5" translate="no">
                <span className="text-xl font-bold tracking-[-0.02em] text-[#111111] lowercase">sustrato</span>
                <span className="text-xl font-bold tracking-[-0.02em] text-[#E10600]">.ai</span>
              </span>
            </Link>
            <p className="mt-4 text-base sm:text-sm text-neutral-600 leading-relaxed max-w-sm">
              Construimos la capa donde los agentes de IA leen, actúan y se integran con tu operación:
              tus herramientas, tus criterios y trazabilidad completa.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex items-center gap-2 min-h-[44px] text-base sm:text-sm font-medium text-[#111111] hover:text-[#E10600] transition-colors"
            >
              <Mail className="w-4 h-4 text-neutral-600" aria-hidden="true" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>

          {/* Site map */}
          <div className="md:col-span-3">
            <h2 className="text-xs font-mono-code uppercase tracking-wider font-semibold text-neutral-600 mb-3">
              Sitio
            </h2>
            <ul className="space-y-1 text-base sm:text-sm">
              <li>
                <Link to="/" className="inline-flex items-center min-h-[44px] min-w-[44px] text-neutral-700 hover:text-[#111111] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/soluciones" className="inline-flex items-center min-h-[44px] text-neutral-700 hover:text-[#111111] transition-colors">
                  Soluciones tecnológicas
                </Link>
              </li>
              <li>
                <Link to="/ingenieria" className="inline-flex items-center min-h-[44px] text-neutral-700 hover:text-[#111111] transition-colors">
                  Ingeniería de software
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="inline-flex items-center min-h-[44px] text-neutral-700 hover:text-[#111111] transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="inline-flex items-center min-h-[44px] text-neutral-700 hover:text-[#111111] transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Next step & direct links */}
          <div className="md:col-span-4">
            <h2 className="text-xs font-mono-code uppercase tracking-wider font-semibold text-neutral-600 mb-3">
              Primer paso
            </h2>
            <p className="text-base sm:text-sm text-neutral-600 leading-relaxed mb-4">
              Revisamos tu operación actual, identificamos qué conviene conectar primero y te entregamos
              una propuesta acotada por etapas.
            </p>
            <button
              type="button"
              onClick={() => onOpenConsultation('general')}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-[#111111] hover:bg-[#E10600] rounded-lg transition-colors cursor-pointer"
            >
              <span>Agendar diagnóstico</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm sm:text-xs text-neutral-600">
              <a
                href="https://www.linkedin.com/in/francisco-andrades-mart%C3%ADnez-29b6101ab/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] hover:text-[#111111] underline underline-offset-4 decoration-neutral-300 hover:decoration-[#111111]"
              >
                LinkedIn Francisco
              </a>
              <a
                href="https://www.linkedin.com/in/ignacio-rubi/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] hover:text-[#111111] underline underline-offset-4 decoration-neutral-300 hover:decoration-[#111111]"
              >
                LinkedIn Ignacio
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-600">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E10600]" aria-hidden="true" />
            <span>Donde los agentes viven, actúan y entienden de tu operación.</span>
          </span>
          <span className="font-mono-code tabular-nums">
            SUSTRATO.AI © {new Date().getFullYear()} · Chile &amp; Latam
          </span>
        </div>
      </div>
    </footer>
  );
};
