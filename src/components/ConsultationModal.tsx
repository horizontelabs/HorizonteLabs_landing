import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  User,
  X,
} from 'lucide-react';
import {
  BOOKING_URL,
  CONTACT_EMAIL,
  DIAGNOSTIC_CONTEXT_LABELS,
  type DiagnosticContext,
} from '../lib/siteConfig';
import { useRouter } from '../lib/router';

interface ConsultationModalProps {
  isOpen: boolean;
  initialContext: DiagnosticContext;
  onClose: () => void;
}

const availableTools = [
  'Slack / Teams',
  'Google Workspace / M365',
  'CRM (HubSpot, Salesforce…)',
  'ERP / Contabilidad',
  'Bases de datos / APIs propias',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  initialContext,
  onClose,
}) => {
  const { pathname } = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    interest: initialContext,
    tools: [] as string[],
    notes: '',
    website: '', // Honeypot
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, interest: initialContext }));
      setStatus('idle');
      setErrorMessage('');
      setFieldErrors({});
      setCopied(false);
    }
  }, [isOpen, initialContext]);

  // Body scroll lock, focus initialization, Escape & Tab focus trap
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      prevFocused?.focus();
    };
  }, [isOpen, onClose]);

  const toggleTool = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Ingresa tu nombre.';
    if (!formData.email.trim() || !EMAIL_RE.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo válido (ej. nombre@empresa.com).';
    }
    if (!formData.company.trim()) errors.company = 'Indica el nombre de tu empresa.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildMailtoHref = () => {
    const subject = encodeURIComponent(
      `Diagnóstico operacional — ${formData.company.trim() || 'sustrato.ai'}`
    );
    const body = encodeURIComponent(
      [
        `Nombre: ${formData.name}`,
        `Correo: ${formData.email}`,
        `Empresa: ${formData.company}`,
        `Enfoque: ${DIAGNOSTIC_CONTEXT_LABELS[formData.interest]}`,
        `Herramientas: ${formData.tools.length ? formData.tools.join(', ') : 'Por definir'}`,
        `Contexto: ${formData.notes || 'Revisar operación en llamada inicial'}`,
      ].join('\n')
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleCopySummary = async () => {
    const text = [
      `Para: ${CONTACT_EMAIL}`,
      `Nombre: ${formData.name}`,
      `Correo: ${formData.email}`,
      `Empresa: ${formData.company}`,
      `Enfoque: ${DIAGNOSTIC_CONTEXT_LABELS[formData.interest]}`,
      `Herramientas: ${formData.tools.join(', ') || 'Por definir'}`,
      `Notas: ${formData.notes || '—'}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interest: DIAGNOSTIC_CONTEXT_LABELS[formData.interest],
          sourcePath: pathname,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.ok) {
        setStatus('sent');
        return;
      }

      setStatus('error');
      setErrorMessage(
        data?.error ||
          'No pudimos confirmar el envío automático. Puedes enviarnos estos mismos datos por correo directo sin volver a escribirlos.'
      );
    } catch {
      setStatus('error');
      setErrorMessage(
        'No hubo respuesta del servidor de envío en este entorno. Usa el botón de correo directo o copia el resumen abajo para enviárnoslo.'
      );
    }
  };

  const handleResetAndClose = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      interest: initialContext,
      tools: [],
      notes: '',
      website: '',
    });
    setStatus('idle');
    setErrorMessage('');
    setFieldErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="diagnostic-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px]"
          />

          {/* Dialog panel */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white rounded-2xl border border-neutral-200 shadow-[0_24px_60px_rgba(17,17,17,0.18)] p-6 sm:p-8 z-10 my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana de diagnóstico"
              className="absolute top-4 right-4 w-11 h-11 inline-flex items-center justify-center rounded-lg text-neutral-600 hover:text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {status !== 'sent' ? (
              <div>
                <div className="pr-10 mb-6">
                  <h2
                    id="diagnostic-modal-title"
                    className="text-2xl font-bold text-[#111111] tracking-[-0.02em]"
                  >
                    Solicitar diagnóstico operacional
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">
                    Sesión de 30 minutos para revisar tu operación actual, herramientas conectables
                    y el primer entregable con sentido práctico. Sin compromiso.
                  </p>
                </div>

                {BOOKING_URL && (
                  <div className="mb-5 p-3.5 rounded-xl bg-[#FAFAFA] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs text-neutral-700">
                      ¿Prefieres elegir horario directamente en el calendario?
                    </span>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#111111] bg-white border border-neutral-300 hover:border-[#111111] rounded-lg transition-colors shrink-0"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#E10600]" aria-hidden="true" />
                      <span>Abrir calendario</span>
                    </a>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="diag-website">Sitio web</label>
                    <input
                      id="diag-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  {/* Interest selector */}
                  <div>
                    <label
                      htmlFor="diag-interest"
                      className="block text-xs font-semibold text-neutral-700 mb-1.5"
                    >
                      ¿Qué quieres explorar primero?
                    </label>
                    <select
                      id="diag-interest"
                      name="interest"
                      value={formData.interest}
                      onChange={(e) =>
                        setFormData({ ...formData, interest: e.target.value as DiagnosticContext })
                      }
                      className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#FAFAFA] border border-neutral-300 rounded-lg text-sm text-[#111111] focus:border-[#E10600] transition-colors"
                    >
                      <option value="general">{DIAGNOSTIC_CONTEXT_LABELS.general}</option>
                      <option value="soluciones">{DIAGNOSTIC_CONTEXT_LABELS.soluciones}</option>
                      <option value="ingenieria">{DIAGNOSTIC_CONTEXT_LABELS.ingenieria}</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="diag-name"
                      className="block text-xs font-semibold text-neutral-700 mb-1.5"
                    >
                      Nombre y apellido
                    </label>
                    <div className="relative">
                      <User
                        aria-hidden="true"
                        className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                      />
                      <input
                        ref={firstFieldRef}
                        id="diag-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        aria-invalid={Boolean(fieldErrors.name)}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        placeholder="Ej. Martín Larraín…"
                        className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-neutral-300 rounded-lg text-sm text-[#111111] placeholder:text-neutral-500 focus:border-[#E10600] transition-colors"
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="mt-1 text-xs text-[#C50500]" role="alert">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="diag-email"
                        className="block text-xs font-semibold text-neutral-700 mb-1.5"
                      >
                        Correo corporativo
                      </label>
                      <div className="relative">
                        <Mail
                          aria-hidden="true"
                          className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                        />
                        <input
                          id="diag-email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          spellCheck={false}
                          required
                          aria-invalid={Boolean(fieldErrors.email)}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                          }}
                          placeholder="martin@empresa.com…"
                          className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-neutral-300 rounded-lg text-sm text-[#111111] placeholder:text-neutral-500 focus:border-[#E10600] transition-colors"
                        />
                      </div>
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-[#C50500]" role="alert">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="diag-company"
                        className="block text-xs font-semibold text-neutral-700 mb-1.5"
                      >
                        Empresa
                      </label>
                      <div className="relative">
                        <Building2
                          aria-hidden="true"
                          className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                        />
                        <input
                          id="diag-company"
                          name="organization"
                          type="text"
                          autoComplete="organization"
                          required
                          aria-invalid={Boolean(fieldErrors.company)}
                          value={formData.company}
                          onChange={(e) => {
                            setFormData({ ...formData, company: e.target.value });
                            if (fieldErrors.company) setFieldErrors({ ...fieldErrors, company: '' });
                          }}
                          placeholder="Nombre de la empresa…"
                          className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-neutral-300 rounded-lg text-sm text-[#111111] placeholder:text-neutral-500 focus:border-[#E10600] transition-colors"
                        />
                      </div>
                      {fieldErrors.company && (
                        <p className="mt-1 text-xs text-[#C50500]" role="alert">
                          {fieldErrors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <fieldset>
                    <legend className="block text-xs font-semibold text-neutral-700 mb-2">
                      Sistemas principales hoy (opcional)
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {availableTools.map((tool) => {
                        const isSelected = formData.tools.includes(tool);
                        return (
                          <button
                            type="button"
                            key={tool}
                            aria-pressed={isSelected}
                            onClick={() => toggleTool(tool)}
                            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'bg-[#FAFAFA] text-neutral-700 hover:bg-neutral-100 border-neutral-300'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}
                            {tool}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="diag-notes"
                      className="block text-xs font-semibold text-neutral-700 mb-1.5"
                    >
                      ¿Qué proceso o necesidad te gustaría revisar primero? (opcional)
                    </label>
                    <textarea
                      id="diag-notes"
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Ej. Seguimiento comercial en CRM, reportes semanales, portal interno conectado a ERP…"
                      className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-neutral-300 rounded-lg text-sm text-[#111111] placeholder:text-neutral-500 focus:border-[#E10600] transition-colors resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-neutral-800 space-y-2.5"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-[#C50500] shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="leading-relaxed">{errorMessage}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        <a
                          href={buildMailtoHref()}
                          className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-md bg-[#111111] text-white font-semibold hover:bg-[#E10600] transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Enviar por correo a {CONTACT_EMAIL}</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleCopySummary}
                          className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-md bg-white border border-neutral-300 text-neutral-800 font-medium hover:border-[#111111] cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                              <span>Resumen copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copiar resumen</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 bg-[#E10600] hover:bg-[#C50500] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-65"
                    >
                      {status === 'submitting' ? (
                        <span className="font-mono-code text-xs uppercase tracking-wider">
                          Enviando solicitud…
                        </span>
                      ) : (
                        <>
                          <span>Solicitar diagnóstico</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                    <p className="text-[12px] text-neutral-600 text-center">
                      Respondemos en menos de 1 día hábil. También puedes escribir directo a{' '}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-[#111111] font-medium underline underline-offset-2 hover:text-[#E10600]"
                      >
                        {CONTACT_EMAIL}
                      </a>
                      .
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center" aria-live="polite">
                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-[#E10600]">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[#111111] tracking-[-0.02em]">
                  Solicitud recibida
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Gracias, <strong className="text-[#111111]">{formData.name}</strong>. Te
                  escribiremos a <strong className="text-[#111111]">{formData.email}</strong> en
                  menos de 1 día hábil para coordinar la sesión de diagnóstico con{' '}
                  <strong className="text-[#111111]">{formData.company}</strong>.
                </p>

                <div className="mt-6 p-4 rounded-xl bg-[#FAFAFA] border border-neutral-200 text-left max-w-sm mx-auto text-xs text-neutral-700 space-y-1.5">
                  <p className="font-mono-code uppercase tracking-wider text-neutral-600 font-semibold">
                    Qué prepararemos para la sesión
                  </p>
                  <p>• Mapa inicial de tus herramientas y puntos de integración</p>
                  <p>• Alcance sugerido para la primera etapa en producción</p>
                </div>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="mt-6 min-h-[44px] px-6 py-2.5 bg-[#111111] text-white rounded-lg text-sm font-semibold hover:bg-[#E10600] transition-colors cursor-pointer"
                >
                  Volver al sitio
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
