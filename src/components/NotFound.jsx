import React from 'react';
import { Unplug, Home, ArrowLeft, Wrench, ShieldAlert } from 'lucide-react';
import { BRAND_DATA, createWhatsAppLink } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

export default function NotFound({ onGoHome }) {
  const handleBackHome = (e) => {
    if (e) e.preventDefault();
    if (typeof onGoHome === 'function') {
      onGoHome();
    } else {
      window.history.pushState(null, '', '/');
      window.location.hash = '';
      window.location.reload();
    }
  };

  const whatsappIssueUrl = createWhatsAppLink(
    'Hola Neyvix Tech, estaba navegando en su sitio web y llegué a un circuito o página no encontrada (Error 404). ¿Podrían ayudarme?'
  );

  return (
    <div className="min-h-screen bg-[#070B13] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Simple Brand Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <a 
          href="/" 
          onClick={handleBackHome}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <img 
              src="/logo.webp" 
              alt="Logo Neyvix Tech" 
              className="w-full h-full object-cover rounded-full bg-[#070B13]"
            />
          </div>
          <span className="text-lg font-extrabold tracking-wider text-white">
            NEYVIX <span className="text-cyan-400">TECH</span>
          </span>
        </a>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>ESTADO: 404 OFF-GRID</span>
        </div>
      </header>

      {/* Main 404 Centerpiece */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full text-center relative">
          
          {/* Neon Icon Container */}
          <div className="inline-flex items-center justify-center mb-8 relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0F172A] border border-cyan-500/40 shadow-2xl shadow-cyan-950 flex items-center justify-center relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <Unplug className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-400 relative animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-violet-950/90 border border-violet-500/50 p-2 rounded-xl text-violet-300">
              <ShieldAlert className="w-5 h-5 text-violet-400" />
            </div>
          </div>

          {/* Heading with Neon Gradient */}
          <div className="mb-4">
            <span className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400 uppercase font-semibold">
              // ERROR DE ENRUTAMIENTO TÉCNICO
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1">
              404 — <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Página no encontrada</span>
            </h1>
          </div>

          {/* Core Message Required by Spec */}
          <p className="text-xl sm:text-2xl font-bold text-slate-200 mb-3">
            El circuito que buscas no existe o fue desconectado.
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            La pista técnica que intentas seguir no conduce a ningún componente activo en nuestros servidores. Vuelve a la base de operaciones o comunícate con nosotros.
          </p>

          {/* Terminal Diagnostics Pill */}
          <div className="max-w-md mx-auto mb-10 p-3 rounded-xl bg-[#0E1524]/90 border border-slate-800 text-left font-mono text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-800/80 pb-1.5 mb-1.5">
              <span>TERMINAL DE DIAGNÓSTICO</span>
              <span className="text-rose-400">STATUS: DISCONNECTED</span>
            </div>
            <div><span className="text-cyan-400">&gt;</span> URL: <span className="text-slate-300">{typeof window !== 'undefined' ? window.location.pathname : '/'}</span></div>
            <div><span className="text-cyan-400">&gt;</span> ERROR_CODE: <span className="text-amber-400">CIRCUIT_TRACE_FAILED_404</span></div>
            <div><span className="text-cyan-400">&gt;</span> ACTION: <span className="text-emerald-400">REDIRECT_TO_HOME_GATEWAY</span></div>
          </div>

          {/* Interactive CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleBackHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:opacity-95 shadow-xl shadow-cyan-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-cyan-400/40"
            >
              <Home className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </button>

            <a
              href={whatsappIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 fill-emerald-400" />
              <span>Reportar por WhatsApp</span>
            </a>
          </div>

        </div>
      </main>

      {/* Clean Footer Note */}
      <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-slate-900/80">
        <p>NEYVIX TECH • Servicio Técnico y Soluciones IT en Chiclayo, Perú</p>
      </footer>
    </div>
  );
}
