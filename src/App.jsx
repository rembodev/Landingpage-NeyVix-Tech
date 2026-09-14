import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import WorkshopApp from './components/workshop/WorkshopApp';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import DiagnosticTool from './components/DiagnosticTool';
import Workflow from './components/Workflow';
import Roadmap from './components/Roadmap';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactFooter from './components/ContactFooter';
import FloatingWhatsApp from './components/FloatingWhatsApp';

/**
 * Función que verifica si la ruta actual corresponde al área privada del taller
 * Soporta /taller, /admin, /#/taller y /#taller
 */
function checkIsWorkshopRoute() {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  return (
    path === '/taller' ||
    path.startsWith('/taller/') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#taller' ||
    hash.startsWith('#/taller') ||
    hash === '#admin' ||
    hash.startsWith('#/admin')
  );
}

export default function App() {
  // Por defecto es 'landing' (Ruta Raíz /).
  // Solo se activa 'workshop' si se escribe manualmente /taller o /admin en el navegador.
  const [isWorkshop, setIsWorkshop] = useState(checkIsWorkshopRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsWorkshop(checkIsWorkshopRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const handleGoHome = () => {
    window.history.pushState(null, '', '/');
    window.location.hash = '';
    setIsWorkshop(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      {isWorkshop ? (
        /* Ruta Privada: /taller o /admin */
        <WorkshopApp onBackToSite={handleGoHome} />
      ) : (
        /* Ruta Pública Raíz: / */
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
          {/* Navbar 100% público y limpio sin accesos al taller */}
          <Navbar />

          {/* Secciones Oficiales de Neyvix Tech */}
          <main>
            <Hero />
            <Services />
            <DiagnosticTool />
            <Workflow />
            <Roadmap />
            <Testimonials />
            <FAQ />
          </main>

          <ContactFooter />
          <FloatingWhatsApp />
        </div>
      )}
    </AuthProvider>
  );
}
