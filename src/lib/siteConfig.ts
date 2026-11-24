export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://sustratolab.vercel.app').replace(/\/$/, '');
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contacto@sustrato.ai';
export const BOOKING_URL = import.meta.env.VITE_BOOKING_URL || '';

export type DiagnosticContext = 'general' | 'soluciones' | 'ingenieria';

export const DIAGNOSTIC_CONTEXT_LABELS: Record<DiagnosticContext, string> = {
  general: 'Diagnóstico operacional',
  soluciones: 'Soluciones tecnológicas (agentes y automatizaciones)',
  ingenieria: 'Ingeniería de software a medida',
};
