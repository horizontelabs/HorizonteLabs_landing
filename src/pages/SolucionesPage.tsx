import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Database,
  FileSearch,
  GitBranch,
  Layers,
  Pause,
  Play,
  Plug,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { GovernanceSection } from '../components/GovernanceSection';
import { FaqAccordion, type FaqItem } from '../components/FaqAccordion';
import { CTASection } from '../components/CTASection';
import { SustratoBackdrop } from '../components/SustratoBackdrop';
import { BlueprintArrowH, BlueprintFrame } from '../components/visuals/blueprint';
import { Link } from '../lib/router';
import { SITE_URL, type DiagnosticContext } from '../lib/siteConfig';

interface SolucionesPageProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
}

const flowSteps = [
  {
    id: 'disparador',
    number: '01',
    title: 'Disparador',
    system: 'Correo / CRM / Ticket',
    summary: 'Un evento real inicia el proceso sin intervención manual.',
    detail:
      'Llega una solicitud de cliente por correo o formulario, se crea un ticket en mesa de ayuda o cambia una etapa en el CRM.',
    output: 'Evento normalizado · ID #OP-482',
  },
  {
    id: 'lectura',
    number: '02',
    title: 'Lectura en Sustrato',
    system: 'Documentos · Historial · ERP',
    summary: 'El agente reúne contexto real antes de decidir.',
    detail:
      'Consulta la ficha del cliente, casos anteriores, contratos vigentes y políticas internas indexadas en la capa.',
    output: '3 fuentes verificadas · 0 datos inventados',
  },
  {
    id: 'criterio',
    number: '03',
    title: 'Criterio y permisos',
    system: 'Motor de reglas · Aprobación',
    summary: 'Valida límites del negocio y escala si corresponde.',
    detail:
      'Si el caso cumple tus reglas, continúa. Si supera un umbral sensible o faltan datos, solicita aprobación a un responsable.',
    output: 'Regla validada · Permiso verificado',
  },
  {
    id: 'accion',
    number: '04',
    title: 'Acción en sistemas',
    system: 'CRM · ERP · Slack',
    summary: 'Ejecuta los cambios directamente donde trabaja el equipo.',
    detail:
      'Actualiza el CRM, genera el borrador o pedido en el ERP y notifica por Slack al área encargada con el resumen listo.',
    output: '2 sistemas actualizados · Aviso enviado',
  },
  {
    id: 'trazabilidad',
    number: '05',
    title: 'Trazabilidad',
    system: 'Log auditable · Sustrato',
    summary: 'Cada paso queda documentado y alimenta futuros casos.',
    detail:
      'Registra qué leyó, qué criterio aplicó, quién aprobó y qué escribió. La operación queda más ordenada que antes.',
    output: 'Historial inmutable guardado',
  },
];

interface UseCaseTab {
  id: string;
  label: string;
  shortLabel: string;
  problem: string;
  flow: string;
  systems: string[];
  humanControl: string;
  diagramLabel: string;
  nodes: { label: string; meta: string; active?: boolean }[];
}

const useCaseTabs: UseCaseTab[] = [
  {
    id: 'comercial',
    label: 'Atención y seguimiento comercial',
    shortLabel: 'Comercial',
    problem:
      'Consultas y cotizaciones se pierden entre correos, WhatsApp y planillas, con tiempos de respuesta irregulares.',
    flow: 'Clasifica cada consulta entrante, consulta catálogo y condiciones en el sustrato, actualiza el CRM y prepara la propuesta o seguimiento oportuno.',
    systems: ['CRM', 'Correo corporativo', 'Catálogo / Precios', 'Calendario'],
    humanControl:
      'Descuentos especiales, condiciones fuera de pauta y cierres finales requieren aprobación explícita del ejecutivo.',
    diagramLabel: 'Flujo comercial sobre Sustrato',
    nodes: [
      { label: 'Consulta entrante', meta: 'Correo · Formulario' },
      { label: 'Sustrato comercial', meta: 'Reglas + Historial', active: true },
      { label: 'CRM actualizado', meta: 'Borrador + Seguimiento' },
    ],
  },
  {
    id: 'operaciones',
    label: 'Operaciones y backoffice',
    shortLabel: 'Backoffice',
    problem:
      'Horas semanales copiando datos entre órdenes de compra, facturas, planillas y el ERP con riesgo de errores manuales.',
    flow: 'Extrae y valida documentos recibidos, cruza montos contra órdenes vigentes, detecta discrepancias y registra los movimientos aprobados.',
    systems: ['ERP', 'Documentos PDF', 'Correo / Carpetas', 'Slack / Teams'],
    humanControl:
      'Cualquier diferencia de monto, proveedor nuevo o excepción tributaria se pausa automáticamente para revisión humana.',
    diagramLabel: 'Flujo backoffice sobre Sustrato',
    nodes: [
      { label: 'Documento recibido', meta: 'OC · Factura · Guía' },
      { label: 'Cruce y validación', meta: 'Reglas contables', active: true },
      { label: 'Registro en ERP', meta: 'Trazabilidad completa' },
    ],
  },
  {
    id: 'conocimiento',
    label: 'Conocimiento interno y soporte',
    shortLabel: 'Conocimiento',
    problem:
      'El criterio técnico, manuales y casos pasados viven dispersos en carpetas y en la cabeza de pocas personas clave.',
    flow: 'Centraliza documentación, historial de proyectos y decisiones en la capa para que el equipo consulte con citas exactas a las fuentes originales.',
    systems: ['Google Drive / SharePoint', 'Slack / Teams', 'Mesa de ayuda', 'Wiki interna'],
    humanControl:
      'Respuestas siempre ancladas a documentos con permisos por área; si no hay respaldo suficiente, el agente lo indica sin inventar.',
    diagramLabel: 'Flujo de conocimiento interno',
    nodes: [
      { label: 'Pregunta del equipo', meta: 'Slack · Web interna' },
      { label: 'Búsqueda con permisos', meta: 'Docs + Casos previos', active: true },
      { label: 'Respuesta citada', meta: 'Enlace a fuente real' },
    ],
  },
  {
    id: 'reportes',
    label: 'Monitoreo y reportes',
    shortLabel: 'Reportes',
    problem:
      'Consolidar reportes semanales o detectar alertas operativas exige cruzar manualmente varias bases y herramientas.',
    flow: 'Consulta métricas en tus bases de datos y sistemas conectados, detecta desvíos según tus umbrales y entrega resúmenes ejecutivos accionables.',
    systems: ['Bases SQL', 'ERP / CRM', 'Hojas de cálculo', 'Correo / Slack'],
    humanControl:
      'Consultas de solo lectura sobre bases productivas y distribución restringida por rol directivo u operativo.',
    diagramLabel: 'Flujo de monitoreo operativo',
    nodes: [
      { label: 'Fuentes de datos', meta: 'SQL · ERP · CRM' },
      { label: 'Reglas de desvío', meta: 'Criterios definidos', active: true },
      { label: 'Resumen y alerta', meta: 'Envío programado' },
    ],
  },
];

const capabilityBlocks = [
  {
    icon: Plug,
    title: 'Integraciones (MCP y APIs)',
    lead: 'Conectamos tus herramientas sin cambiar la forma en que trabaja tu equipo.',
    bullets: [
      'Conectores seguros vía MCP y APIs hacia CRM, ERP, correo y bases de datos',
      'Permisos granulares de lectura y escritura por rol y sistema',
      'Estandarización de fuentes para que cualquier agente futuro las reutilice',
    ],
  },
  {
    icon: Workflow,
    title: 'Automatizaciones de flujo',
    lead: 'Eliminamos el trabajo repetitivo entre pasos que hoy dependen de memoria humana.',
    bullets: [
      'Orquestación determinista combinada con modelos de IA donde aporta criterio',
      'Manejo explícito de excepciones, reintentos y escalamiento a personas',
      'Alertas y registros claros de cada ejecución en producción',
    ],
  },
  {
    icon: Bot,
    title: 'Agentes con contexto',
    lead: 'Agentes especializados que conocen tus políticas, documentos e historial real.',
    bullets: [
      'Alcance acotado por proceso, evitando agentes genéricos impredecibles',
      'Respuestas y acciones respaldadas en fuentes verificables de tu operación',
      'Evaluación continua de calidad y ajuste fino según uso real del equipo',
    ],
  },
];

const solutionsFaqs: FaqItem[] = [
  {
    id: 'sol-replace',
    question: '¿Tenemos que cambiar nuestro ERP, CRM o correo para implementar esto?',
    answer:
      'No. El principio de Sustrato es conectar lo que tu equipo ya usa (Google Workspace, Microsoft 365, Slack, HubSpot, ERPs locales o bases SQL) sin migraciones traumáticas.',
  },
  {
    id: 'sol-hallucinations',
    question: '¿Cómo evitan que un agente invente información o ejecute algo indebido?',
    answer:
      'Separamos la lógica determinista (permisos, validaciones, reglas de negocio) del razonamiento del modelo. Los agentes operan sobre fuentes verificadas y toda acción sensible exige confirmación humana antes de ejecutarse.',
  },
  {
    id: 'sol-start',
    question: '¿Por qué tipo de proceso conviene empezar?',
    answer:
      'Siempre recomendamos iniciar con un proceso frecuente, medible y con reglas claras —donde el equipo hoy pierde horas repetitivas— para validar valor real antes de expandir la capa a otras áreas.',
  },
  {
    id: 'sol-software',
    question: '¿Qué pasa si además necesitamos una interfaz o sistema propio?',
    answer:
      'Como todo vive sobre la misma capa, podemos complementar tus flujos con desarrollo a medida desde nuestra vertical de Ingeniería de software sin duplicar integraciones.',
  },
];

export const SolucionesPage: React.FC<SolucionesPageProps> = ({ onOpenConsultation }) => {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTabId, setActiveTabId] = useState(useCaseTabs[0].id);

  const activeTab = useCaseTabs.find((t) => t.id === activeTabId) ?? useCaseTabs[0];
  const currentStep = flowSteps[activeStep];

  useEffect(() => {
    if (!isPlaying || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % flowSteps.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isPlaying, reduceMotion]);

  const handleTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveTabId(useCaseTabs[(idx + 1) % useCaseTabs.length].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveTabId(useCaseTabs[(idx - 1 + useCaseTabs.length) % useCaseTabs.length].id);
    }
  };

  return (
    <>
      <PageMeta
        title="Soluciones tecnológicas · sustrato.ai"
        description="Agentes de IA, automatizaciones de extremo a extremo e integraciones MCP/API sobre tu operación, con permisos, aprobación humana y trazabilidad completa."
        path="/soluciones"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Soluciones tecnológicas sobre Sustrato',
          provider: { '@type': 'Organization', name: 'sustrato.ai', url: SITE_URL },
          url: `${SITE_URL}/soluciones`,
          description:
            'Implementación de agentes de IA, automatizaciones operativas e integraciones con control y trazabilidad.',
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-34 pb-16 sm:pb-20 px-5 sm:px-8 lg:px-14 bg-white">
        <SustratoBackdrop variant="neural" intensity="medium" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <nav aria-label="Ruta de navegación" className="mb-6 text-xs text-neutral-600 flex items-center gap-2">
            <Link to="/" className="hover:text-[#111111] transition-colors">
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#111111] font-medium" aria-current="page">
              Soluciones tecnológicas
            </span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-[2.25rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] leading-[1.08] text-[#111111]">
              Agentes y automatizaciones operando dentro de tus sistemas reales.
            </h1>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed">
              Conectamos tus herramientas actuales al sustrato para ejecutar procesos de principio a
              fin: con tus reglas de negocio, aprobación humana donde importa y trazabilidad total.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsultation('soluciones')}
                className="group inline-flex items-center justify-center gap-2.5 min-h-[50px] px-7 py-3.5 bg-[#E10600] hover:bg-[#C50500] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors shadow-[0_8px_24px_rgba(225,6,0,0.2)] cursor-pointer"
              >
                <span>Agendar diagnóstico</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
              <a
                href="#flujo-vivo"
                className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3.5 text-sm sm:text-base font-medium text-[#111111] bg-white border border-neutral-300 hover:border-[#111111] rounded-lg transition-colors"
              >
                <span>Recorrer el flujo paso a paso</span>
                <ArrowDown aria-hidden="true" className="w-4 h-4 text-neutral-600" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 5-step End-to-End Flow */}
      <section
        id="flujo-vivo"
        className="py-20 sm:py-24 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
                De un evento operativo a una acción auditable.
              </h2>
              <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                Haz clic en cada etapa para ver cómo viaja la información por la capa sin perder el
                control.
              </p>
            </div>

            {!reduceMotion && (
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold text-[#111111] bg-white border border-neutral-300 hover:border-[#111111] rounded-lg transition-colors self-start md:self-auto cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 text-[#E10600]" aria-hidden="true" />
                    <span>Pausar recorrido</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#E10600]" aria-hidden="true" />
                    <span>Reproducir recorrido</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Step selector rail */}
          <div
            role="tablist"
            aria-label="Etapas del flujo operativo"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6"
          >
            {flowSteps.map((step, index) => {
              const isSelected = index === activeStep;
              return (
                <button
                  key={step.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(index);
                  }}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer min-h-[84px] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#111111] border-[#111111] text-white'
                      : 'bg-white border-neutral-200 text-[#111111] hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-mono-code font-semibold tabular-nums ${
                        isSelected ? 'text-[#FF5A52]' : 'text-neutral-600'
                      }`}
                    >
                      {step.number}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected
                          ? 'bg-[#E10600]'
                          : index < activeStep
                            ? 'bg-neutral-500'
                            : 'bg-neutral-200'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm font-semibold leading-snug mt-2">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Live synchronized Blueprint readout */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Visual blueprint pipeline */}
              <div className="lg:col-span-7">
                <BlueprintFrame
                  label="Arquitectura del flujo en ejecución"
                  badge="Escenario ilustrativo"
                  minHeightClass="min-h-[240px]"
                  note={`Paso activo ${currentStep.number} de 05 · ${currentStep.system}`}
                >
                  <div className="w-full space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      {flowSteps.map((st, idx) => {
                        const isActive = idx === activeStep;
                        const isDone = idx < activeStep;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              setIsPlaying(false);
                              setActiveStep(idx);
                            }}
                            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                              isActive
                                ? 'border-[#E10600] bg-[#FFF8F8]'
                                : isDone
                                  ? 'border-neutral-400 bg-white'
                                  : 'border-neutral-200 bg-[#FAFAFA]'
                            }`}
                          >
                            <span
                              className={`block text-[10px] font-mono-code font-semibold tabular-nums ${
                                isActive ? 'text-[#C50500]' : 'text-neutral-600'
                              }`}
                            >
                              {st.number}
                            </span>
                            <span className="block text-xs font-semibold text-[#111111] mt-1 leading-tight">
                              {st.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active telemetry bar */}
                    <div className="p-3.5 rounded-lg bg-[#FAFAFA] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-code">
                      <span className="text-neutral-700">
                        <strong className="text-[#111111]">Sistemas:</strong> {currentStep.system}
                      </span>
                      <span className="text-[#C50500] font-semibold">{currentStep.output}</span>
                    </div>
                  </div>
                </BlueprintFrame>
              </div>

              {/* Detail panel */}
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="inline-block text-xs font-mono-code font-semibold text-[#C50500] uppercase tracking-wider mb-2">
                      Paso {currentStep.number} · {currentStep.title}
                    </span>
                    <h3 className="text-2xl font-bold text-[#111111] tracking-[-0.02em] leading-snug">
                      {currentStep.summary}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
                      {currentStep.detail}
                    </p>

                    <div className="mt-6 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          setActiveStep((prev) => (prev - 1 + flowSteps.length) % flowSteps.length);
                        }}
                        className="min-h-[42px] px-4 py-2 text-xs font-semibold border border-neutral-300 hover:border-[#111111] rounded-lg text-[#111111] transition-colors cursor-pointer"
                      >
                        ← Anterior
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          setActiveStep((prev) => (prev + 1) % flowSteps.length);
                        }}
                        className="min-h-[42px] px-4 py-2 text-xs font-semibold bg-[#111111] hover:bg-[#E10600] text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Siguiente paso →
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases in Tabs with Repeatable 4-Block Framework */}
      <section className="relative overflow-hidden py-20 sm:py-24 px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200">
        <SustratoBackdrop variant="strata" intensity="subtle" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Escenarios concretos por tipo de operación.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
              Cada solución sigue el mismo marco: qué problema ataca, qué ejecuta el flujo, qué
              sistemas conecta y dónde interviene tu equipo.
            </p>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Escenarios de soluciones tecnológicas"
            className="flex flex-wrap gap-2 mb-8"
          >
            {useCaseTabs.map((tab, idx) => {
              const selected = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  id={`sol-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`sol-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTabId(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-[#FAFAFA] text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:text-[#111111]'
                  }`}
                >
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Repeatable 4-block panel + dedicated visual */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              id={`sol-panel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`sol-tab-${activeTab.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-6 sm:p-8"
            >
              {/* Left: Repeatable 4-part specification */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2">
                    <FileSearch className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Problema operativo</span>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{activeTab.problem}</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2">
                    <GitBranch className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Qué ejecuta el flujo</span>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{activeTab.flow}</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2.5">
                    <Database className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Sistemas conectados</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTab.systems.map((sys) => (
                      <span
                        key={sys}
                        className="px-2.5 py-1 rounded bg-[#FAFAFA] border border-neutral-200 text-xs font-medium text-[#111111]"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Control humano</span>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {activeTab.humanControl}
                  </p>
                </div>
              </div>

              {/* Right: Dedicated Blueprint diagram for this tab */}
              <div className="lg:col-span-5">
                <BlueprintFrame
                  label={activeTab.diagramLabel}
                  badge="Escenario ilustrativo"
                  minHeightClass="min-h-[300px]"
                  note="Cada escenario se adapta a tus reglas y sistemas específicos en el diagnóstico."
                >
                  <div className="w-full space-y-3">
                    {activeTab.nodes.map((node, index) => (
                      <React.Fragment key={node.label}>
                        {index > 0 && (
                          <div className="flex justify-center">
                            <span className="w-px h-5 bg-[#E10600]" aria-hidden="true" />
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 ${
                            node.active
                              ? 'border-[#E10600] bg-[#FFF8F8]'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          <div>
                            <span className="block text-sm font-semibold text-[#111111]">
                              {node.label}
                            </span>
                            <span className="block text-xs font-mono-code text-neutral-600 mt-0.5">
                              {node.meta}
                            </span>
                          </div>
                          {node.active && (
                            <Layers className="w-4 h-4 text-[#E10600] shrink-0" aria-hidden="true" />
                          )}
                        </div>
                      </React.Fragment>
                    ))}

                    <div className="pt-2 flex items-center gap-2 text-[11px] font-mono-code text-neutral-600">
                      <span>Entrada</span>
                      <BlueprintArrowH accent label="trazable" />
                      <span>Auditoría</span>
                    </div>
                  </div>
                </BlueprintFrame>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Building blocks: 3 concrete capability cards */}
      <section className="py-20 sm:py-24 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Qué construimos en cada capa de solución.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {capabilityBlocks.map((cap) => (
              <div
                key={cap.title}
                className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-7 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-neutral-200 flex items-center justify-center text-[#E10600] mb-5">
                  <cap.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#111111] tracking-[-0.02em]">{cap.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{cap.lead}</p>
                <ul className="mt-5 pt-4 border-t border-neutral-200 space-y-2.5 text-sm text-neutral-700 flex-1">
                  {cap.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2
                        aria-hidden="true"
                        className="w-4 h-4 text-[#E10600] shrink-0 mt-0.5"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance applied */}
      <GovernanceSection compact id="control-soluciones" />

      {/* Honest verifiable commitments (no fake client KPIs) */}
      <section className="relative overflow-hidden py-16 sm:py-20 px-5 sm:px-8 lg:px-14 bg-[#111111] text-white">
        <SustratoBackdrop variant="neural" tone="dark" intensity="subtle" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] mb-10">
            Principios medibles desde el primer ciclo.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/15 rounded-xl p-6">
              <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white leading-snug">
                Conectado a lo que ya usas
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                Integración directa con tu CRM, ERP, correo y bases actuales, sin reemplazos
                forzados.
              </p>
            </div>
            <div className="border border-white/15 rounded-xl p-6">
              <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white leading-snug">
                Permisos y aprobación humana
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                Accesos definidos por rol y validación humana en los puntos clave del flujo.
              </p>
            </div>
            <div className="border border-white/15 rounded-xl p-6">
              <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white leading-snug">
                Trazabilidad completa
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                Registro auditable de cada lectura, criterio y acción ejecutada sobre tus sistemas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link to Engineering */}
      <section className="py-12 px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[#FAFAFA] border border-neutral-200">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">
              ¿También necesitas construir software propio para tu operación?
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Desarrollamos aplicaciones a medida que tu equipo usa a diario y tus agentes pueden
              operar desde el mismo sustrato.
            </p>
          </div>
          <Link
            to="/ingenieria"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#E10600] text-white text-sm font-semibold transition-colors shrink-0"
          >
            <span>Ver Ingeniería de software</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <FaqAccordion
        title="Preguntas sobre Soluciones tecnológicas."
        items={solutionsFaqs}
      />

      <CTASection
        onOpenConsultation={onOpenConsultation}
        context="soluciones"
        title="Identifiquemos tu primer flujo en producción."
        description="Revisamos tus herramientas y procesos actuales en 30 minutos para proponerte la primera integración con impacto inmediato."
      />
    </>
  );
};
