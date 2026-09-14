import React from 'react';
import { 
  MessageSquareText, 
  ScanSearch, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { WORKFLOW_STEPS, BRAND_DATA } from '../data/content';

const stepIcons = {
  MessageSquareText: MessageSquareText,
  ScanSearch: ScanSearch,
  CheckCircle2: CheckCircle2,
  ShieldCheck: ShieldCheck
};

export default function Workflow() {
  return (
    <section id="proceso" className="py-24 relative bg-[#0E1524]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 uppercase tracking-wider">
            <ScanSearch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flujo de Trabajo Confiable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Proceso Transparente en <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">4 Pasos</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Tu tranquilidad y la seguridad de tu información son lo primero. Sin sorpresas, con comunicación fluida y aprobación antes de cualquier intervención.
          </p>
        </div>

        {/* 4 Steps Grid with connector lines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = stepIcons[step.icon] || CheckCircle2;
            return (
              <div 
                key={step.step}
                className="relative rounded-2xl bg-[#161F30] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between group hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20"
              >
                {/* Step badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-extrabold font-mono text-cyan-400/40 group-hover:text-cyan-400 transition-colors">
                      {step.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Sub-tag indicator */}
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{idx === 0 ? "Respuesta en < 15 min" : idx === 1 ? "Pruebas científicas" : idx === 2 ? "Aprobación del cliente" : "Pruebas en vivo"}</span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Action button below workflow */}
        <div className="mt-14 text-center">
          <a
            href={BRAND_DATA.defaultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
          >
            <span>Inicia el Paso 1 ahora vía WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
