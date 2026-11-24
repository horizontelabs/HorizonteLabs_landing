import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  GitMerge,
  KeyRound,
  Layers,
  Lock,
  Terminal,
  Users,
} from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { FaqAccordion, type FaqItem } from '../components/FaqAccordion';
import { CTASection } from '../components/CTASection';
import { BlueprintFrame } from '../components/visuals/blueprint';
import { Link } from '../lib/router';
import { SITE_URL, type DiagnosticContext } from '../lib/siteConfig';

interface IngenieriaPageProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
}

type SurfaceMode = 'equipo' | 'agente';

const sampleRequests = [
  {
    id: 'SOL-1042',
    title: 'Alta de proveedor estratégico',
    area: 'Operaciones',
    status: 'Pendiente aprobación',
    rule: 'Monto anual > umbral → requiere firma de jefatura',
    toolCall: 'sustrato.requests.get("SOL-1042") → verify_docs() → request_approval()',
  },
  {
    id: 'SOL-1043',
    title: 'Actualización de tarifa regional',
    area: 'Comercial',
    status: 'Validado',
    rule: 'Dentro de lista autorizada → sincronizable con ERP',
    toolCall: 'sustrato.pricing.check_policy("SOL-1043") → erp.sync_rate()',
  },
  {
    id: 'SOL-1044',
    title: 'Conciliación orden #8819',
    area: 'Finanzas',
    status: 'Listo para cierre',
    rule: 'OC y factura coinciden 100 % → listo para registro',
    toolCall: 'sustrato.finance.match_po("8819") → erp.post_entry()',
  },
];

interface BuildTab {
  id: string;
  label: string;
  shortLabel: string;
  whenApplies: string;
  whatWeBuild: string;
  sustratoConnection: string;
  deliverables: string[];
  schemaTitle: string;
  layers: { name: string; detail: string; accent?: boolean }[];
}

const buildTabs: BuildTab[] = [
  {
    id: 'internas',
    label: 'Aplicaciones operativas internas',
    shortLabel: 'Apps internas',
    whenApplies:
      'Cuando tu operación creció en planillas desconectadas o formularios dispersos y necesitas una herramienta central hecha para tu flujo real.',
    whatWeBuild:
      'Paneles web rápidos, gestores de solicitudes, flujos de aprobación y tableros operativos diseñados alrededor de cómo trabaja tu equipo.',
    sustratoConnection:
      'Cada entidad y acción queda disponible vía API/MCP con permisos por rol, permitiendo que agentes lean estados y ejecuten tareas trazables.',
    deliverables: ['Interfaz web responsive', 'Modelo de datos y roles', 'Endpoints API / MCP', 'Documentación técnica'],
    schemaTitle: 'Aplicación operativa + capa agéntica',
    layers: [
      { name: 'Interfaz del equipo', detail: 'Paneles · Filtros · Aprobaciones' },
      { name: 'Dominio y API / MCP', detail: 'Reglas · Permisos · Auditoría', accent: true },
      { name: 'Sustrato y agentes', detail: 'Contexto compartido · Acciones seguras' },
    ],
  },
  {
    id: 'portales',
    label: 'Portales de clientes y proveedores',
    shortLabel: 'Portales',
    whenApplies:
      'Cuando clientes o proveedores consultan estados por correo o teléfono y necesitas autoservicio ordenado conectado a tu operación.',
    whatWeBuild:
      'Portales autenticados para carga de documentos, seguimiento de solicitudes, entregas, facturación o soporte con visibilidad en tiempo real.',
    sustratoConnection:
      'Los eventos del portal disparan validaciones automáticas y notificaciones contextualizadas a través del sustrato.',
    deliverables: ['Portal autenticado', 'Carga y validación documental', 'Webhooks y eventos', 'Auditoría de accesos'],
    schemaTitle: 'Portal externo conectado a backoffice',
    layers: [
      { name: 'Portal clientes / proveedores', detail: 'Autoservicio · Estado en vivo' },
      { name: 'Validación y orquestación', detail: 'Sustrato · Criterios', accent: true },
      { name: 'Sistemas internos', detail: 'ERP · CRM · Facturación' },
    ],
  },
  {
    id: 'integracion',
    label: 'Capas de integración y APIs/MCP',
    shortLabel: 'APIs / MCP',
    whenApplies:
      'Cuando ya tienes buenos sistemas pero no conversan entre sí, o quieres exponer tus datos internos a agentes de IA de forma gobernada.',
    whatWeBuild:
      'Servicios de integración, servidores MCP corporativos, sincronizadores de datos y gateways con control de permisos y observabilidad.',
    sustratoConnection:
      'Es la pieza estructural que convierte tus bases y APIs en un sustrato seguro, auditable y reutilizable por múltiples agentes.',
    deliverables: ['Servidores MCP / REST', 'Control de permisos y límites', 'Logs estructurados', 'Pruebas de contrato'],
    schemaTitle: 'Capa de integración gobernada',
    layers: [
      { name: 'Agentes y aplicaciones', detail: 'Consumidores autorizados' },
      { name: 'Gateway MCP / API', detail: 'Scopes · Rate limits · Logs', accent: true },
      { name: 'ERP · CRM · SQL · Legacy', detail: 'Sistemas existentes sin reemplazo' },
    ],
  },
  {
    id: 'modernizacion',
    label: 'Modernización de sistemas legacy',
    shortLabel: 'Legacy',
    whenApplies:
      'Cuando un sistema crítico es lento, difícil de mantener o imposible de integrar, pero no puedes detener la operación para reescribirlo todo.',
    whatWeBuild:
      'Extracción progresiva por módulos (patrón strangler), interfaces modernas sobre backends antiguos y migración incremental con cero interrupción.',
    sustratoConnection:
      'Encapsula la lógica antigua detrás de contratos limpios para que tanto el nuevo frontend como los agentes operen de forma estable.',
    deliverables: ['Mapa de migración por fases', 'Adaptadores sobre legacy', 'Módulos nuevos en producción', 'Plan de traspaso'],
    schemaTitle: 'Modernización progresiva sin cortes',
    layers: [
      { name: 'Nuevos módulos web + agentes', detail: 'UX moderna · APIs limpias' },
      { name: 'Capa de adaptación Sustrato', detail: 'Contratos estables · Convivencia', accent: true },
      { name: 'Sistema legacy actual', detail: 'Operación continua sin detención' },
    ],
  },
];

const engineeringStandards = [
  {
    icon: KeyRound,
    title: 'Propiedad total del código',
    description:
      'El repositorio, infraestructura y documentación quedan a nombre de tu empresa. Sin licencias cautivas ni cajas negras.',
  },
  {
    icon: Code2,
    title: 'Arquitectura mantenible',
    description:
      'Tipado estricto, pruebas automatizadas, CI/CD y código legible para que tu equipo interno pueda evolucionarlo cuando quiera.',
  },
  {
    icon: Lock,
    title: 'Seguridad desde el diseño',
    description:
      'Autenticación, control de acceso por rol, auditoría de cambios y despliegue en la nube o entorno que tu organización apruebe.',
  },
  {
    icon: Cpu,
    title: 'Compatibilidad agéntica nativa',
    description:
      'Cada módulo expone contratos y eventos claros sobre el sustrato para sumar agentes cuando tenga sentido operativo.',
  },
];

const engineeringCycle = [
  {
    id: 'arquitectura',
    step: '01',
    title: 'Arquitectura y alcance',
    description:
      'Definimos usuarios, flujos críticos, integraciones necesarias y el corte exacto de la primera entrega.',
    clientValidates: 'Qué entra en la fase 1 y cómo convive con sistemas actuales.',
    deliverable: 'Especificación técnica ligera y plan por hitos.',
  },
  {
    id: 'prototipo',
    step: '02',
    title: 'Prototipo navegable',
    description:
      'Validamos pantallas y flujos reales con quienes operarán el sistema antes de invertir semanas de código.',
    clientValidates: 'Usabilidad real con el equipo operativo.',
    deliverable: 'Prototipo interactivo y contratos de datos aprobados.',
  },
  {
    id: 'iteracion',
    step: '03',
    title: 'Desarrollo iterativo',
    description:
      'Construimos en ciclos cortos con demos semanales sobre un ambiente real conectado a tus datos de prueba.',
    clientValidates: 'Avance verificable cada semana, sin sorpresas al final.',
    deliverable: 'Módulos funcionales, pruebas y conectores MCP/API.',
  },
  {
    id: 'despliegue',
    step: '04',
    title: 'Producción y evolución',
    description:
      'Desplegamos en tu infraestructura con observabilidad, capacitación al equipo y traspaso o evolución continua.',
    clientValidates: 'Estabilidad en producción y autonomía del equipo.',
    deliverable: 'Sistema en producción, documentación y repositorio propio.',
  },
];

const engineeringFaqs: FaqItem[] = [
  {
    id: 'ing-ownership',
    question: '¿El código fuente y la propiedad intelectual son 100 % nuestros?',
    answer:
      'Sí. Trabajamos directamente en repositorios bajo control de tu organización y entregamos toda la documentación técnica, infraestructura como código y guías de despliegue.',
  },
  {
    id: 'ing-internal-team',
    question: '¿Pueden trabajar junto a nuestro equipo interno de TI o desarrollo?',
    answer:
      'Sí. Nos integramos a sus estándares de Git, revisiones de código, seguridad y despliegue — ya sea tomando un módulo completo o construyendo la capa de integración y agentes en paralelo.',
  },
  {
    id: 'ing-agents-mandatory',
    question: '¿Estamos obligados a usar agentes de IA desde el primer día?',
    answer:
      'No. Primero resolvemos la necesidad de software de tu equipo con ingeniería sólida. Dejarlo preparado sobre el sustrato significa que el día que quieras sumar automatizaciones o agentes, la base ya está lista.',
  },
  {
    id: 'ing-maintenance',
    question: '¿Cómo funciona la mantención después de salir a producción?',
    answer:
      'Puedes elegir traspaso completo a tu equipo interno o un acompañamiento evolutivo mensual para nuevas funcionalidades, integraciones y monitoreo.',
  },
];

export const IngenieriaPage: React.FC<IngenieriaPageProps> = ({ onOpenConsultation }) => {
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('equipo');
  const [selectedRowId, setSelectedRowId] = useState(sampleRequests[0].id);
  const [activeBuildTabId, setActiveBuildTabId] = useState(buildTabs[0].id);
  const [activeCycleIdx, setActiveCycleIdx] = useState(0);

  const selectedRow = sampleRequests.find((r) => r.id === selectedRowId) ?? sampleRequests[0];
  const activeBuildTab = buildTabs.find((t) => t.id === activeBuildTabId) ?? buildTabs[0];
  const activeCycle = engineeringCycle[activeCycleIdx];

  const handleBuildTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveBuildTabId(buildTabs[(idx + 1) % buildTabs.length].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveBuildTabId(buildTabs[(idx - 1 + buildTabs.length) % buildTabs.length].id);
    }
  };

  return (
    <>
      <PageMeta
        title="Ingeniería de software · sustrato.ai"
        description="Desarrollo de software a medida, portales internos y capas de integración diseñados para tu equipo hoy y listos nativamente para tus agentes sobre el sustrato."
        path="/ingenieria"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Ingeniería de software a medida sobre Sustrato',
          provider: { '@type': 'Organization', name: 'sustrato.ai', url: SITE_URL },
          url: `${SITE_URL}/ingenieria`,
          description:
            'Desarrollo de aplicaciones a medida, APIs/MCP y modernización de sistemas conectados a la capa operativa de IA.',
        }}
      />

      {/* Hero */}
      <section className="pt-24 sm:pt-34 pb-10 sm:pb-20 px-5 sm:px-8 lg:px-14 bg-white">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Ruta de navegación" className="mb-3 sm:mb-6 text-xs text-neutral-600 flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex items-center min-h-[44px] min-w-[44px] px-2 -ml-2 hover:text-[#111111] transition-colors"
            >
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#111111] font-medium pl-1" aria-current="page">
              Ingeniería de software
            </span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-[2rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] leading-[1.08] text-[#111111]">
              Software a medida para tu operación, listo para tus agentes.
            </h1>
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed">
              Diseñamos y construimos aplicaciones, portales e integraciones que resuelven el trabajo
              diario de tu equipo — y nacen conectadas al sustrato para que tus agentes también
              puedan operarlas con seguridad.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsultation('ingenieria')}
                className="group inline-flex items-center justify-center gap-2.5 min-h-[50px] px-7 py-3.5 bg-[#E10600] hover:bg-[#C50500] text-white text-sm sm:text-base font-semibold rounded-lg transition-colors shadow-[0_8px_24px_rgba(225,6,0,0.2)] cursor-pointer"
              >
                <span>Agendar diagnóstico</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
              <a
                href="#doble-interfaz"
                className="inline-flex items-center justify-center gap-2 min-h-[50px] px-6 py-3.5 text-sm sm:text-base font-medium text-[#111111] bg-white border border-neutral-300 hover:border-[#111111] rounded-lg transition-colors"
              >
                <span>Ver doble interfaz en vivo</span>
                <ArrowDown aria-hidden="true" className="w-4 h-4 text-neutral-600" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Centerpiece Kinetic Demo: Vista Equipo <-> Vista Agente */}
      <section
        id="doble-interfaz"
        className="py-12 sm:py-24 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-7 sm:mb-10">
            <div className="max-w-2xl">
              <h2 className="text-[1.75rem] sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
                Una misma aplicación, dos superficies de trabajo.
              </h2>
              <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                Cambia entre la vista de tu equipo y la capa que consumen los agentes sobre el mismo
                registro operativo.
              </p>
            </div>

            {/* Interactive Surface Toggle */}
            <div
              role="group"
              aria-label="Alternar vista de la aplicación"
              className="inline-flex p-1 bg-white border border-neutral-200 rounded-xl self-start"
            >
              <button
                type="button"
                aria-pressed={surfaceMode === 'equipo'}
                onClick={() => setSurfaceMode('equipo')}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  surfaceMode === 'equipo'
                    ? 'bg-[#111111] text-white'
                    : 'text-neutral-700 hover:text-[#111111]'
                }`}
              >
                <Users className="w-4 h-4" aria-hidden="true" />
                <span>Vista Equipo</span>
              </button>
              <button
                type="button"
                aria-pressed={surfaceMode === 'agente'}
                onClick={() => setSurfaceMode('agente')}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  surfaceMode === 'agente'
                    ? 'bg-[#E10600] text-white'
                    : 'text-neutral-700 hover:text-[#111111]'
                }`}
              >
                <Bot className="w-4 h-4" aria-hidden="true" />
                <span>Vista Agente (API / MCP)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Interactive application surface */}
            <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-7 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[#111111] font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      surfaceMode === 'agente' ? 'bg-[#E10600]' : 'bg-[#111111]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>
                    {surfaceMode === 'equipo'
                      ? 'APP INTERNA · GESTOR DE SOLICITUDES'
                      : 'CAPA MCP · CONTRATO OPERATIVO DEL MISMO REGISTRO'}
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                  Escenario ilustrativo
                </span>
              </div>

              {/* Selectable operational rows */}
              <div className="mt-4 space-y-2">
                {sampleRequests.map((req) => {
                  const isSelected = req.id === selectedRowId;
                  return (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => setSelectedRowId(req.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isSelected
                          ? surfaceMode === 'agente'
                            ? 'border-[#E10600] bg-[#FFF8F8]'
                            : 'border-[#111111] bg-[#FAFAFA]'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono-code font-semibold text-neutral-600 tabular-nums shrink-0">
                          {req.id}
                        </span>
                        <span className="text-sm font-semibold text-[#111111] truncate">
                          {req.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-neutral-600">{req.area}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono-code bg-white border border-neutral-200 text-neutral-800">
                          {req.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Contextual inspection pane based on surfaceMode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${surfaceMode}-${selectedRow.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="mt-5 pt-5 border-t border-neutral-200 flex-1"
                >
                  {surfaceMode === 'equipo' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base sm:text-sm">
                      <div className="p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200">
                        <span className="block text-xs font-mono-code uppercase text-neutral-600 mb-1">
                          Regla visible para el equipo
                        </span>
                        <p className="text-[#111111] font-medium leading-relaxed">
                          {selectedRow.rule}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200">
                        <span className="block text-xs font-mono-code uppercase text-neutral-600 mb-1">
                          Experiencia humana
                        </span>
                        <p className="text-neutral-700 leading-relaxed">
                          Tu equipo revisa historial, adjuntos y aprueba en un clic sin saltar entre
                          correos ni planillas.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#111111] text-white font-mono-code text-xs space-y-2.5 overflow-x-auto">
                      <div className="flex items-center gap-2 text-neutral-300">
                        <Terminal className="w-3.5 h-3.5 text-[#FF5A52]" aria-hidden="true" />
                        <span>Herramienta expuesta vía MCP · Scope: {selectedRow.area.toLowerCase()}.write</span>
                      </div>
                      <p className="text-white leading-relaxed">{selectedRow.toolCall}</p>
                      <p className="text-neutral-300">
                        → Política evaluada: <span className="text-white">{selectedRow.rule}</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right callouts */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 flex-1">
                <span className="text-xs font-mono-code uppercase tracking-wider text-[#C50500] font-semibold">
                  01 · Primero resuelve al equipo
                </span>
                <p className="mt-2 text-base sm:text-sm text-neutral-700 leading-relaxed">
                  La aplicación se diseña para que las personas trabajen con claridad y velocidad,
                  sin agregar fricción innecesaria.
                </p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-5 flex-1">
                <span className="text-xs font-mono-code uppercase tracking-wider text-[#C50500] font-semibold">
                  02 · Sin doble desarrollo
                </span>
                <p className="mt-2 text-base sm:text-sm text-neutral-700 leading-relaxed">
                  Las mismas reglas, permisos y validaciones de negocio gobiernan tanto la interfaz
                  humana como las acciones de los agentes.
                </p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-5 flex-1">
                <span className="text-xs font-mono-code uppercase tracking-wider text-[#C50500] font-semibold">
                  03 · Base que se acumula
                </span>
                <p className="mt-2 text-base sm:text-sm text-neutral-700 leading-relaxed">
                  Cada herramienta nueva enriquece el sustrato y habilita nuevas automatizaciones en
                  días en vez de meses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we build: repeatable tabs + blueprint diagram */}
      <section className="py-12 sm:py-24 px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-7 sm:mb-10">
            <h2 className="text-[1.75rem] sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Qué construimos según la etapa de tu operación.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
              Desde aplicaciones internas hasta capas de integración sobre sistemas legacy.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Tipos de proyectos de ingeniería de software"
            className="flex flex-wrap gap-2 mb-8"
          >
            {buildTabs.map((tab, idx) => {
              const selected = tab.id === activeBuildTabId;
              return (
                <button
                  key={tab.id}
                  id={`ing-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`ing-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveBuildTabId(tab.id)}
                  onKeyDown={(e) => handleBuildTabKeyDown(e, idx)}
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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeBuildTab.id}
              id={`ing-panel-${activeBuildTab.id}`}
              role="tabpanel"
              aria-labelledby={`ing-tab-${activeBuildTab.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-6 sm:p-8"
            >
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2">
                    <GitMerge className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Cuándo aplica</span>
                  </div>
                  <p className="text-base sm:text-sm text-neutral-700 leading-relaxed">
                    {activeBuildTab.whenApplies}
                  </p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2">
                    <Code2 className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Qué construimos</span>
                  </div>
                  <p className="text-base sm:text-sm text-neutral-700 leading-relaxed">
                    {activeBuildTab.whatWeBuild}
                  </p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2">
                    <Layers className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Conexión con Sustrato</span>
                  </div>
                  <p className="text-base sm:text-sm text-neutral-700 leading-relaxed">
                    {activeBuildTab.sustratoConnection}
                  </p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-semibold mb-2.5">
                    <Database className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                    <span>Entregables clave</span>
                  </div>
                  <ul className="space-y-1.5 text-base sm:text-sm text-[#111111]">
                    {activeBuildTab.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#E10600] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5">
                <BlueprintFrame
                  label={activeBuildTab.schemaTitle}
                  badge="Arquitectura de referencia"
                  minHeightClass="min-h-[300px]"
                  note="Stack adaptado al entorno y estándares de tu organización."
                >
                  <div className="w-full space-y-3">
                    {activeBuildTab.layers.map((layer, index) => (
                      <React.Fragment key={layer.name}>
                        {index > 0 && (
                          <div className="flex justify-center">
                            <span className="w-px h-5 bg-neutral-400" aria-hidden="true" />
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-lg border ${
                            layer.accent
                              ? 'border-[#E10600] bg-[#FFF8F8]'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          <span className="block text-sm font-semibold text-[#111111]">
                            {layer.name}
                          </span>
                          <span className="block text-xs font-mono-code text-neutral-600 mt-0.5">
                            {layer.detail}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </BlueprintFrame>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Engineering Standards 2x2 */}
      <section className="py-12 sm:py-24 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8 sm:mb-12">
            <h2 className="text-[1.75rem] sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Estándares de ingeniería sin letra chica.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {engineeringStandards.map((std) => (
              <div
                key={std.title}
                className="bg-white border border-neutral-200 rounded-xl p-5 sm:p-7 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-neutral-200 flex items-center justify-center text-[#E10600] shrink-0">
                  <std.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">{std.title}</h3>
                  <p className="mt-1.5 text-base sm:text-sm text-neutral-600 leading-relaxed">
                    {std.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 4-phase engineering cycle */}
      <section className="py-12 sm:py-24 px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-7 sm:mb-10">
            <h2 className="text-[1.75rem] sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Ciclo de ingeniería paso a paso.
            </h2>
            <p className="mt-3 text-base text-neutral-600 leading-relaxed">
              Selecciona cada fase para ver qué valida tu equipo y qué entregable queda en tus
              manos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2.5" role="tablist" aria-label="Fases de ingeniería">
              {engineeringCycle.map((phase, idx) => {
                const selected = idx === activeCycleIdx;
                return (
                  <button
                    key={phase.id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => setActiveCycleIdx(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      selected
                        ? 'bg-[#111111] border-[#111111] text-white'
                        : 'bg-[#FAFAFA] border-neutral-200 text-[#111111] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono-code font-semibold tabular-nums ${
                          selected ? 'text-[#FF5A52]' : 'text-neutral-600'
                        }`}
                      >
                        {phase.step}
                      </span>
                      <span className="text-sm sm:text-base font-semibold">{phase.title}</span>
                    </div>
                    <ArrowRight
                      aria-hidden="true"
                      className={`w-4 h-4 shrink-0 ${selected ? 'text-white' : 'text-neutral-500'}`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCycle.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs font-mono-code uppercase tracking-wider font-semibold text-[#C50500]">
                    Fase {activeCycle.step} · {activeCycle.title}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-[#111111] tracking-[-0.02em]">
                    {activeCycle.title}
                  </h3>
                  <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                    {activeCycle.description}
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-neutral-200">
                      <span className="block text-xs font-mono-code uppercase text-neutral-600 mb-1">
                        Qué valida tu equipo
                      </span>
                      <p className="text-base sm:text-sm font-medium text-[#111111]">
                        {activeCycle.clientValidates}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-neutral-200">
                      <span className="block text-xs font-mono-code uppercase text-neutral-600 mb-1">
                        Entregable concreto
                      </span>
                      <p className="text-base sm:text-sm font-medium text-[#111111]">{activeCycle.deliverable}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link to Soluciones */}
      <section className="py-10 sm:py-12 px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-8 rounded-2xl bg-[#FAFAFA] border border-neutral-200">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">
              ¿Ya cuentas con tus sistemas y buscas conectar agentes y flujos?
            </h2>
            <p className="mt-1 text-base sm:text-sm text-neutral-600">
              Revisa cómo desplegamos automatizaciones, integraciones y agentes trazables sobre tu
              operación actual.
            </p>
          </div>
          <Link
            to="/soluciones"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#E10600] text-white text-sm font-semibold transition-colors shrink-0"
          >
            <span>Ver Soluciones tecnológicas</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <FaqAccordion
        title="Preguntas sobre Ingeniería de software."
        items={engineeringFaqs}
      />

      <CTASection
        onOpenConsultation={onOpenConsultation}
        context="ingenieria"
        title="Conversemos sobre el sistema que tu operación necesita."
        description="Revisamos tu arquitectura actual en 30 minutos y definimos el camino técnico más directo para construir o modernizar tu herramienta."
      />
    </>
  );
};
