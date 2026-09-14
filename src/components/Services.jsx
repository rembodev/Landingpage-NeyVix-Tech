import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Wrench, 
  Terminal, 
  Check, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { SERVICES, createWhatsAppLink } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

const iconMap = {
  ShieldAlert: ShieldAlert,
  Cpu: Cpu,
  Wrench: Wrench,
  Terminal: Terminal
};

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="servicios" className="py-24 relative bg-[#0B0F17]">
      {/* Background soft gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Especialidades Técnicas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Catálogo de <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Servicios Profesionales</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Diagnóstico honesto, repuestos garantizados y protocolos antiestáticos para garantizar la máxima longevidad y rendimiento de tu laptop o computadora de escritorio.
          </p>
        </div>

        {/* 4 Interactive Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((srv) => {
            const IconComponent = iconMap[srv.icon] || Cpu;
            return (
              <div
                key={srv.id}
                className="group relative rounded-2xl bg-[#161F30]/80 border border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-950/40 hover:-translate-y-1"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Card Header: Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/10 via-blue-600/20 to-violet-600/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 group-hover:scale-105 transition-all duration-300 shadow-inner">
                      <IconComponent className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300" />
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 shadow-sm">
                      {srv.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    {srv.shortDesc}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-800/80">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-cyan-400" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Protocol Link & Action CTA */}
                <div className="pt-5 border-t border-slate-800/80 mt-auto flex flex-col gap-3.5">
                  {/* Protocol Link */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedService(srv)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer group/proto"
                    >
                      <span className="text-sm">📋</span>
                      <span className="underline underline-offset-4 decoration-cyan-500/40 group-hover/proto:decoration-cyan-400">
                        Ver protocolo de servicio garantizado
                      </span>
                    </button>
                  </div>

                  {/* Direct WhatsApp Quote Button */}
                  <a
                    href={createWhatsAppLink(srv.whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 border border-slate-700 hover:border-transparent transition-all duration-300 shadow-md hover:shadow-cyan-500/20 group/btn active:scale-[0.99]"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-emerald-400 group-hover/btn:fill-white transition-colors" />
                    <span>Cotizar este Servicio</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Banner below services: Need multiple units or custom request? */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#161F30] to-violet-950/40 border border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
              ¿Tienes varios equipos en tu oficina o requieres atención in-situ?
            </h4>
            <p className="text-sm text-slate-300">
              Ofrecemos paquetes corporativos para empresas, profesionales independientes y colegios con factura electrónica.
            </p>
          </div>
          <a
            href={createWhatsAppLink("Hola Neyvix Tech, requiero una cotización para múltiples equipos en mi empresa/oficina.")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4 fill-slate-950" />
            <span>Consultar Paquete Corporativo</span>
          </a>
        </div>

      </div>

      {/* Modal for Service Protocol Details */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161F30] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                {selectedService.badge}
              </span>
              <span className="text-xs text-cyan-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Protocolo Garantizado
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {selectedService.title}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              {selectedService.fullDesc}
            </p>

            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Ideal para:
              </h4>
              <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                {selectedService.idealFor}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Protocolo detallado:
              </h4>
              <ul className="space-y-2">
                {selectedService.features.map((feat, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={createWhatsAppLink(selectedService.whatsappText)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Coordinar este servicio por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
