import React, { useState, useEffect, useRef } from 'react';
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
import { initTracker } from './lib/tracker';

/**
 * Función que detecta la vista actual según la URL y el hash
 * - 'landing': Ruta Raíz (/)
 * - 'workshop': /taller o /admin
 * - 'analytics': /tracking o /analytics
 */
function getRouteView() {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (
    path === '/tracking' ||
    path.startsWith('/tracking/') ||
    path === '/analytics' ||
    path.startsWith('/analytics/') ||
    hash === '#tracking' ||
    hash.startsWith('#/tracking') ||
    hash === '#analytics' ||
    hash.startsWith('#/analytics')
  ) {
    return 'analytics';
  }

  if (
    path === '/taller' ||
    path.startsWith('/taller/') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#taller' ||
    hash.startsWith('#/taller') ||
    hash === '#admin' ||
    hash.startsWith('#/admin')
  ) {
    return 'workshop';
  }

  return 'landing';
}

export default function App() {
  // Por defecto es 'landing' (Ruta Raíz /).
  // Solo se activan vistas privadas si se escribe manualmente /taller, /admin, /tracking o /analytics.
  const [routeView, setRouteView] = useState(getRouteView);

  useEffect(() => {
    const handleRouteChange = () => {
      setRouteView(getRouteView());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const trackerInitializedRef = useRef(false);

  // Inicializar rastreador en vivo una sola vez durante el ciclo de vida de la aplicación
  // El uso de useRef previene ejecuciones duplicadas en React.StrictMode durante desarrollo
  useEffect(() => {
    if (trackerInitializedRef.current) return;
    trackerInitializedRef.current = true;
    initTracker();
  }, []);

  const handleGoHome = () => {
    window.history.pushState(null, '', '/');
    window.location.hash = '';
    setRouteView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPrivate = routeView === 'workshop' || routeView === 'analytics';

  return (
    <AuthProvider>
      {isPrivate ? (
        /* Rutas Privadas: /taller, /admin, /tracking o /analytics */
        <WorkshopApp
          onBackToSite={handleGoHome}
          defaultTab={routeView === 'analytics' ? 'analytics' : 'pipeline'}
        />
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
