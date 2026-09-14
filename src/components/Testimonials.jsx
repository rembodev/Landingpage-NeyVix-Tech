import React from 'react';
import { Star, Quote, CheckCircle, Award } from 'lucide-react';
import { TESTIMONIALS } from '../data/content';

export default function Testimonials() {
  return (
    <section className="py-24 relative bg-[#0B0F17] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Casos de Éxito & Opiniones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Clientes que Confiaron en <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Neyvix Tech</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Conoce la experiencia de profesionales y gamers que multiplicaron el rendimiento de sus herramientas de trabajo.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-[#161F30]/80 border border-slate-800 p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 shadow-lg relative group"
            >
              <Quote className="w-8 h-8 text-cyan-500/20 absolute top-6 right-6" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Service Meta */}
              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {t.name}
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                </h4>
                <div className="text-xs text-slate-400">{t.role}</div>
                <div className="mt-2 inline-block text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  {t.service}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
