import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { FAQS, BRAND_DATA } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#0E1524]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Respuestas Rápidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Preguntas <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Frecuentes</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Resolvemos tus dudas habituales sobre tiempos de entrega, protocolos de seguridad, garantías y formas de pago.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#161F30] border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer group"
                >
                  <span className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-cyan-950 border-cyan-500/50' : ''}`}>
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-cyan-400' : 'text-slate-400'}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/80">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#161F30]/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-white mb-1">
              ¿Tienes otra duda específica sobre tu equipo?
            </h4>
            <p className="text-xs text-slate-400">
              Escríbenos directamente y un técnico especialista te asesorará sin costo.
            </p>
          </div>
          <a
            href={BRAND_DATA.defaultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 transition-all"
          >
            <WhatsAppIcon className="w-4 h-4 fill-emerald-400" />
            <span>Consultar al WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
