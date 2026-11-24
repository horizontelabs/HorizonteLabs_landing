/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { HomePage } from './pages/HomePage';
import { SolucionesPage } from './pages/SolucionesPage';
import { IngenieriaPage } from './pages/IngenieriaPage';
import { NosotrosPage } from './pages/NosotrosPage';
import { Link, RouterProvider, useRouter } from './lib/router';
import type { DiagnosticContext } from './lib/siteConfig';

function AppShell() {
  const { pathname } = useRouter();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [diagnosticContext, setDiagnosticContext] = useState<DiagnosticContext>('general');

  const handleOpenConsultation = (context: DiagnosticContext = 'general') => {
    setDiagnosticContext(context);
    setIsConsultationOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationOpen(false);
  };

  const renderRoute = () => {
    switch (pathname) {
      case '/':
        return <HomePage onOpenConsultation={handleOpenConsultation} />;
      case '/soluciones':
        return <SolucionesPage onOpenConsultation={handleOpenConsultation} />;
      case '/ingenieria':
        return <IngenieriaPage onOpenConsultation={handleOpenConsultation} />;
      case '/nosotros':
        return <NosotrosPage onOpenConsultation={handleOpenConsultation} />;
      default:
        return (
          <section className="pt-36 pb-28 px-5 sm:px-8 text-center max-w-xl mx-auto">
            <p className="text-xs font-mono-code uppercase tracking-wider text-[#C50500] font-semibold">
              404
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-[#111111] tracking-[-0.02em]">
              Esta página no existe.
            </h1>
            <p className="mt-3 text-base text-neutral-600">
              Puedes volver al inicio o explorar nuestras soluciones tecnológicas e ingeniería de
              software.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="min-h-[44px] inline-flex items-center px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-[#E10600] transition-colors"
              >
                Ir al inicio
              </Link>
              <Link
                to="/soluciones"
                className="min-h-[44px] inline-flex items-center px-5 py-2.5 bg-white border border-neutral-300 text-[#111111] text-sm font-semibold rounded-lg hover:border-[#111111] transition-colors"
              >
                Soluciones tecnológicas
              </Link>
              <Link
                to="/ingenieria"
                className="min-h-[44px] inline-flex items-center px-5 py-2.5 bg-white border border-neutral-300 text-[#111111] text-sm font-semibold rounded-lg hover:border-[#111111] transition-colors"
              >
                Ingeniería de software
              </Link>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col bg-white text-[#111111] font-sans selection:bg-[#E10600] selection:text-white relative">
      <Navbar onOpenConsultation={handleOpenConsultation} />

      <main id="contenido-principal" className="flex-1">
        {renderRoute()}
      </main>

      <Footer onOpenConsultation={handleOpenConsultation} />

      <ConsultationModal
        isOpen={isConsultationOpen}
        initialContext={diagnosticContext}
        onClose={handleCloseConsultation}
      />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <AppShell />
      </RouterProvider>
    </MotionConfig>
  );
}
