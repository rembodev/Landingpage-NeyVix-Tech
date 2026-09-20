import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { BRAND_DATA } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Pop-over message card */}
      {showTooltip && (
        <div className="mb-3 w-72 bg-[#161F30] border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-lg animate-fadeIn relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar mensaje"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-bold text-white">Soporte Neyvix Tech</span>
          </div>

          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            👋 ¡Hola! ¿Tu laptop calienta o está muy lenta? Escríbenos ahora y recibe un diagnóstico previo gratis.
          </p>

          <a
            href={BRAND_DATA.defaultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="Boton Flotante: Chatear por WhatsApp"
            data-track-type="click_whatsapp"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-slate-950" />
            <span>Chatear por WhatsApp</span>
          </a>
        </div>
      )}

      {/* Main Floating Button */}
      <div className="relative group">
        {/* Pulsating glow rings */}
        <span className="animate-ping absolute -inset-1 rounded-full bg-emerald-500 opacity-30 group-hover:opacity-60 duration-1000"></span>

        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          data-track="Boton Flotante: Abrir Ventana WhatsApp"
          data-track-type="cta_click"
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-emerald-900/40 hover:shadow-emerald-700/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/40 cursor-pointer"
          aria-label="Abrir WhatsApp Neyvix Tech"
        >
          <div className="relative">
            <WhatsAppIcon className="w-5 h-5 fill-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <span className="hidden sm:inline font-bold">¿Necesitas ayuda técnica?</span>
        </button>
      </div>

    </div>
  );
}
