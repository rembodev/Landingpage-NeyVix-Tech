import React from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  Globe, 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ROADMAP, BRAND_DATA } from '../data/content';

const iconMap = {
  Wrench: Wrench,
  ShieldCheck: ShieldCheck,
  Globe: Globe
};

export default function Roadmap() {
  return (
    <section id="vision" className="py-24 relative bg-[#0B0F17] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4 uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5 text-violet-400" />
            <span>Nuestra Hoja de Ruta</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Crecimiento Escalable & <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Visión Tecnológica</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Evolucionamos de manera ágil y sostenible, acompañando a personas, consultorios y pequeños negocios en cada etapa de su desarrollo tecnológico.
          </p>
        </div>

        {/* 3-Phase Roadmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {ROADMAP.map((item, idx) => {
            const Icon = iconMap[item.icon] || Layers;
            return (
              <div 
                key={item.phase}
                className="relative rounded-2xl bg-[#161F30]/85 border border-slate-800 p-7 sm:p-8 flex flex-col justify-between backdrop-blur-md hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/30 transition-all duration-300 group"
              >
                {/* Phase Number & Status Tag */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                      {item.phase}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center group-hover:border-cyan-400/60 transition-colors">
                      <Icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-3 mb-6 pt-4 border-t border-slate-800">
                    {item.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom / Action */}
                <div className="pt-4 border-t border-slate-800 mt-auto">
                  <a
                    href={BRAND_DATA.defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                  >
                    <span>Consultar disponibilidad y alcance</span>
                    <ArrowRight className="w-3.5 h-3.5 group-link:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>
            );
          })}

        </div>

        {/* Vision Statement Banner */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-[#161F30] via-cyan-950/30 to-[#161F30] border border-cyan-500/30 text-center max-w-4xl mx-auto shadow-xl">
          <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Soluciones Prácticas para tu Hogar y Negocio
          </h4>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Desde la optimización y rescate de tu laptop en Chiclayo hasta la seguridad de tu local y presencia digital, en <strong className="text-white">Neyvix Tech</strong> combinamos honestidad, rapidez y tecnología accesible.
          </p>
        </div>

      </div>
    </section>
  );
}
