import React from 'react';
import { ArrowRight, Code2, Workflow } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { HeroSection } from '../components/HeroSection';
import { SustratoDiagram } from '../components/SustratoDiagram';
import { GovernanceSection } from '../components/GovernanceSection';
import { TeamSection } from '../components/TeamSection';
import { FaqAccordion, type FaqItem } from '../components/FaqAccordion';
import { CTASection } from '../components/CTASection';
import { Link } from '../lib/router';
import { SITE_URL, type DiagnosticContext } from '../lib/siteConfig';

interface HomePageProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
}

const workStages = [
  {
    step: 'Etapa 1',
    title: 'Diagnóstico operacional',
    timing: 'Sesión inicial · 30 min',
    description:
      'Revisamos cómo trabaja tu equipo hoy, qué sistemas usan y dónde está el cuello de botella con mayor retorno sin alterar la operación.',
    deliverable: 'Entregable: mapa de integraciones y alcance de primera etapa.',
  },
  {
    step: 'Etapa 2',
    title: 'Primera capa en producción',
    timing: 'Despliegue acotado',
    description:
      'Conectamos las fuentes prioritarias, fijamos permisos y criterios, y dejamos operando el primer flujo, agente o módulo de software.',
    deliverable: 'Entregable: solución funcionando con trazabilidad desde el día 1.',
  },
  {
    step: 'Etapa 3',
    title: 'Evolución compuesta',
    timing: 'Iteración continua',
    description:
      'Cada nuevo flujo o herramienta reutiliza la misma capa de contexto y permisos, acortando tiempos y ampliando cobertura operativa.',
    deliverable: 'Entregable: nuevas capacidades sin partir de cero.',
  },
];

const homeFaqs: FaqItem[] = [
  {
    id: 'chatbot-diff',
    question: '¿En qué se diferencia Sustrato de un chatbot tradicional?',
    answer:
      'Un chatbot solo responde texto aislado. Sustrato construye la capa conectada a tus sistemas (CRM, ERP, correo, bases de datos y documentos), aplica las reglas de tu negocio y permite que agentes y flujos ejecuten tareas reales con permisos y registro auditable.',
  },
  {
    id: 'data-security',
    question: '¿Dónde quedan los datos de nuestra empresa?',
    answer:
      'La arquitectura se diseña para operar bajo tu control y con el principio de mínimo privilegio: los conectores acceden solo a las tablas, carpetas o endpoints autorizados, sin mezclar información con terceros y respetando los requisitos de infraestructura de tu equipo TI.',
  },
  {
    id: 'human-control',
    question: '¿Quién controla lo que hace cada agente?',
    answer:
      'Tu equipo define qué acciones pueden correr de forma autónoma y cuáles requieren aprobación humana previa (por ejemplo, montos, descuentos o envíos sensibles). Cada lectura, decisión y acción queda registrada en un historial auditable.',
  },
  {
    id: 'legacy-systems',
    question: '¿Funciona si usamos sistemas antiguos o desarrollo propio?',
    answer:
      'Sí. No exigimos cambiar tu ERP, CRM ni tus herramientas diarias. Construimos conectores API/MCP o capas intermedias de integración adaptadas a lo que ya tienes en producción.',
  },
  {
    id: 'diagnostic-scope',
    question: '¿Qué incluye el diagnóstico inicial y qué compromiso implica?',
    answer:
      'Es una conversación técnica de 30 minutos sin costo ni compromiso. Evaluamos tus procesos prioritarios, factibilidad de integración y te proponemos una primera etapa acotada con entregables concretos antes de avanzar.',
  },
  {
    id: 'code-ownership',
    question: '¿El software a medida y las integraciones quedan a nuestro nombre?',
    answer:
      'Sí. Todo el software a medida, conectores y documentación desarrollados para tu operación quedan bajo propiedad de tu empresa, con código limpio y mantenible para que puedas operarlo o escalarlo sin dependencia opaca.',
  },
];

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const HomePage: React.FC<HomePageProps> = ({ onOpenConsultation }) => {
  return (
    <>
      <PageMeta
        title="sustrato.ai · Donde los agentes viven, actúan y entienden de tu operación"
        description="Construimos la capa donde los agentes de IA leen, actúan y se integran con tu operación: soluciones tecnológicas e ingeniería de software con control y trazabilidad."
        path="/"
        jsonLd={{
          ...homeJsonLd,
          url: `${SITE_URL}/`,
        }}
      />

      <HeroSection onOpenConsultation={onOpenConsultation} />

      <SustratoDiagram />

      {/* Bridge to the two priority verticals */}
      <section className="py-20 sm:py-24 px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              <span className="text-[#D91914]">Dos formas</span> de construir sobre la{' '}
              <span className="text-[#D91914]">misma capa</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vertical 1: Soluciones tecnológicas */}
            <div className="group bg-[#FAFAFA] border border-neutral-200 hover:border-[#111111] rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-[#E10600] mb-5">
                  <Workflow className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[#111111] tracking-[-0.02em]">
                  Soluciones tecnológicas
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Agentes de IA, automatizaciones de extremo a extremo e integraciones MCP/API sobre
                  las herramientas que tu equipo ya usa todos los días.
                </p>
              </div>

              <div className="mt-7 pt-5 border-t border-neutral-200">
                <Link
                  to="/soluciones"
                  className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#111111] group-hover:text-[#E10600] transition-colors"
                >
                  <span>Explorar Soluciones tecnológicas</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Vertical 2: Ingeniería de software */}
            <div className="group bg-[#FAFAFA] border border-neutral-200 hover:border-[#111111] rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-[#E10600] mb-5">
                  <Code2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[#111111] tracking-[-0.02em]">
                  Ingeniería de software
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Desarrollo de aplicaciones a medida, portales internos y capas de integración que
                  resuelven el trabajo de tu equipo y nacen listas para tus agentes.
                </p>
              </div>

              <div className="mt-7 pt-5 border-t border-neutral-200">
                <Link
                  to="/ingenieria"
                  className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#111111] group-hover:text-[#E10600] transition-colors"
                >
                  <span>Explorar Ingeniería de software</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GovernanceSection />

      {/* How we work in 3 stages */}
      <section className="py-20 sm:py-24 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Cómo pasamos del diagnóstico a producción.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
              Implementaciones rápidas sin frenar tu operación.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workStages.map((stage, index) => (
              <li
                key={stage.step}
                className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-neutral-200">
                    <span className="text-xs font-mono-code uppercase tracking-wider font-semibold text-[#C50500]">
                      0{index + 1} · {stage.step}
                    </span>
                    <span className="text-xs font-mono-code text-neutral-600">{stage.timing}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#111111] tracking-[-0.02em]">
                    {stage.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
                <p className="mt-5 pt-4 border-t border-neutral-200 text-xs font-medium text-[#111111]">
                  {stage.deliverable}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TeamSection compact />

      {/* [PENDIENTE DE CASOS REALES]: Activar sección de casos autorizados cuando existan clientes y métricas verificables */}

      <FaqAccordion
        id="faq"
        title="Preguntas frecuentes de operaciones y TI."
        subtitle="Respuestas directas sobre cómo nos integramos, dónde viven los datos y qué control mantiene tu equipo."
        items={homeFaqs}
      />

      <CTASection onOpenConsultation={onOpenConsultation} context="general" />
    </>
  );
};
