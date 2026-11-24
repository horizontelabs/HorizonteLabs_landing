import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { SustratoMark } from './SustratoMark';
import { Link, useRouter } from '../lib/router';
import type { DiagnosticContext } from '../lib/siteConfig';

interface NavbarProps {
  onOpenConsultation: (context?: DiagnosticContext) => void;
}

const serviceLinks = [
  {
    to: '/soluciones',
    title: 'Soluciones tecnológicas',
    description: 'Agentes, automatizaciones e integraciones conectadas a tu operación.',
  },
  {
    to: '/ingenieria',
    title: 'Ingeniería de software',
    description: 'Software a medida para tu equipo, operable nativamente por agentes.',
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation }) => {
  const { pathname } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isServiceActive = pathname === '/soluciones' || pathname === '/ingenieria';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentContext: DiagnosticContext =
    pathname === '/soluciones' ? 'soluciones' : pathname === '/ingenieria' ? 'ingenieria' : 'general';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,padding,box-shadow] duration-200 ${
        scrolled || mobileOpen
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3 shadow-[0_1px_4px_rgba(17,17,17,0.04)]'
          : 'bg-white/85 backdrop-blur-sm border-b border-transparent py-4'
      }`}
    >
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2.5 focus:bg-[#111111] focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
      >
        Saltar al contenido principal
      </a>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          to="/"
          aria-label="sustrato.ai — Inicio"
          className="group inline-flex items-center gap-2.5 min-h-[44px] py-1"
        >
          <SustratoMark idPrefix="nav" className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 text-[#111111]" />
          <span className="flex items-baseline gap-0.5" translate="no">
            <span className="text-xl font-bold tracking-[-0.02em] text-[#111111] lowercase">sustrato</span>
            <span className="text-xl font-bold tracking-[-0.02em] text-[#E10600] transition-opacity duration-200 group-hover:opacity-75">
              .ai
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/#sustrato"
            className="px-3.5 py-2.5 text-sm font-medium text-neutral-700 hover:text-[#111111] rounded-md transition-colors"
          >
            La Capa
          </Link>

          {/* Grouped Services menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                isServiceActive || servicesOpen
                  ? 'text-[#111111] bg-neutral-100'
                  : 'text-neutral-700 hover:text-[#111111] hover:bg-neutral-50'
              }`}
            >
              <span>Servicios</span>
              <ChevronDown
                aria-hidden="true"
                className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-[#E10600]' : 'text-neutral-500'}`}
              />
            </button>

            {servicesOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-[360px] bg-white border border-neutral-200 rounded-xl shadow-[0_16px_40px_rgba(17,17,17,0.08)] p-2 z-50"
              >
                {serviceLinks.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                      className={`block p-3.5 rounded-lg transition-colors ${
                        active ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <span className="flex items-center justify-between text-sm font-semibold text-[#111111]">
                        <span>{item.title}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className={`w-4 h-4 ${active ? 'text-[#E10600]' : 'text-neutral-500'}`}
                        />
                      </span>
                      <span className="block text-xs text-neutral-600 mt-1 leading-relaxed">
                        {item.description}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/nosotros"
            aria-current={pathname === '/nosotros' ? 'page' : undefined}
            className={`px-3.5 py-2.5 text-sm font-medium rounded-md transition-colors ${
              pathname === '/nosotros'
                ? 'text-[#111111] bg-neutral-100'
                : 'text-neutral-700 hover:text-[#111111]'
            }`}
          >
            Nosotros
          </Link>

          <Link
            to="/#faq"
            className="px-3.5 py-2.5 text-sm font-medium text-neutral-700 hover:text-[#111111] rounded-md transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id="nav-cta-btn"
            type="button"
            onClick={() => onOpenConsultation(currentContext)}
            className="group inline-flex items-center gap-1.5 h-11 px-3.5 sm:px-5 text-xs sm:text-sm font-semibold whitespace-nowrap text-white bg-[#111111] hover:bg-[#E10600] rounded-lg transition-colors duration-200 cursor-pointer shrink-0"
          >
            <span className="sm:hidden">Diagnóstico</span>
            <span className="hidden sm:inline">Agendar diagnóstico</span>
            <ArrowUpRight
              aria-hidden="true"
              className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-neutral-200 text-[#111111] hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-neutral-200 bg-white px-5 pt-4 pb-6 shadow-[0_16px_32px_rgba(17,17,17,0.08)]"
        >
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`min-h-[44px] flex items-center px-3 rounded-lg text-base font-medium ${
                pathname === '/' ? 'bg-neutral-100 text-[#111111]' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Inicio
            </Link>

            <Link
              to="/#sustrato"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] flex items-center px-3 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50"
            >
              La Capa
            </Link>

            <div className="my-2 border-y border-neutral-200 py-2">
              <p className="px-3 pb-1 text-xs font-mono-code uppercase tracking-wider text-neutral-600">
                Servicios
              </p>
              {serviceLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg ${
                    pathname === item.to ? 'bg-neutral-100 text-[#111111]' : 'text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  <span className="block text-base font-semibold">{item.title}</span>
                  <span className="block text-xs text-neutral-600 mt-0.5">{item.description}</span>
                </Link>
              ))}
            </div>

            <Link
              to="/nosotros"
              onClick={() => setMobileOpen(false)}
              className={`min-h-[44px] flex items-center px-3 rounded-lg text-base font-medium ${
                pathname === '/nosotros' ? 'bg-neutral-100 text-[#111111]' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Nosotros
            </Link>

            <Link
              to="/#faq"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] flex items-center px-3 rounded-lg text-base font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Preguntas frecuentes
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
