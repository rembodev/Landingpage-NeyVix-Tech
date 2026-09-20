import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Activity, 
  Flame, 
  HardDrive, 
  Volume2, 
  Sparkles 
} from 'lucide-react';
import { BRAND_DATA, TRUST_METRICS } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

export default function Hero() {
  const [viewState, setViewState] = useState('after'); // 'before' or 'after'

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-mesh-radial">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm shadow-cyan-950">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Soporte Técnico Confiable & Garantizado</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
              Rendimiento <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">extremo</span> para tus equipos y soluciones tecnológicas para tu futuro.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed font-normal">
              Diagnóstico transparente, optimización de laptops/PCs y mantenimiento preventivo para usuarios y negocios. Resolvemos tus fallas con <strong className="text-white font-semibold">garantía real</strong> y componentes de primera.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href={BRAND_DATA.defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track="Solicitar Diagnóstico Rápido (Hero)"
                data-track-type="click_whatsapp"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-size-200 hover:bg-right hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 shadow-xl shadow-cyan-500/25 border border-cyan-400/30"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Solicitar Diagnóstico Rápido</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#servicios"
                data-track="Ver Todos los Servicios (Hero)"
                data-track-type="cta_click"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
              >
                <span>Ver Todos los Servicios</span>
              </a>
            </div>

            {/* Trust Badges - Horizontal Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full border-t border-slate-800/80 pt-6">
              <div className="flex items-center gap-2.5 text-slate-300 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Diagnóstico Transparente</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300 text-sm font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Garantía en Cada Servicio</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300 text-sm font-medium">
                <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
                <span>Atención Personalizada</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Hardware Telemetry Simulator */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-cyan-500/40 via-slate-700/30 to-violet-600/40 shadow-2xl shadow-cyan-950/50">
              <div className="bg-[#111827]/95 rounded-2xl p-6 sm:p-7 backdrop-blur-xl border border-slate-800/80 relative overflow-hidden">
                
                {/* Header of the Telemetry Panel */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        Simulador de Rendimiento
                      </h3>
                      <p className="text-xs text-slate-400">Impacto real de la optimización Neyvix</p>
                    </div>
                  </div>

                  {/* Toggle Selector */}
                  <div className="flex bg-[#0B0F17] p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setViewState('before')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        viewState === 'before'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Antes
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewState('after')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        viewState === 'after'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Con Neyvix
                    </button>
                  </div>
                </div>

                {/* State Banner */}
                <div className="my-4">
                  {viewState === 'before' ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-400" /> Estado: Sobrecalentamiento & Disco Lento
                      </span>
                      <span className="font-mono bg-rose-900/60 px-2 py-0.5 rounded text-[11px]">Riesgo Falla</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-cyan-400" /> Estado: Pasta Prémium + SSD NVMe Gen4
                      </span>
                      <span className="font-mono bg-cyan-900/60 text-cyan-200 px-2 py-0.5 rounded text-[11px]">Óptimo 100%</span>
                    </div>
                  )}
                </div>

                {/* Telemetry Metrics */}
                <div className="space-y-4">
                  {/* Metric 1: Boot Time */}
                  <div className="p-3.5 rounded-xl bg-[#161F30]/80 border border-slate-800">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" /> Tiempo de Arranque
                      </span>
                      <span className={`font-bold font-mono ${viewState === 'before' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {viewState === 'before' ? '78 segundos (HDD)' : '8.5 segundos (SSD)'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          viewState === 'before' ? 'w-[90%] bg-rose-500' : 'w-[12%] bg-emerald-400'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Metric 2: CPU Temperature */}
                  <div className="p-3.5 rounded-xl bg-[#161F30]/80 border border-slate-800">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> Temperatura CPU en Carga
                      </span>
                      <span className={`font-bold font-mono ${viewState === 'before' ? 'text-rose-400' : 'text-cyan-400'}`}>
                        {viewState === 'before' ? '92°C (Thermal Throttling)' : '62°C (Estable y Seguro)'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          viewState === 'before' ? 'w-[95%] bg-gradient-to-r from-amber-500 to-rose-500' : 'w-[55%] bg-gradient-to-r from-cyan-400 to-blue-500'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Metric 3: Disk Read Speed */}
                  <div className="p-3.5 rounded-xl bg-[#161F30]/80 border border-slate-800">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-violet-400" /> Velocidad Lectura Disco
                      </span>
                      <span className={`font-bold font-mono ${viewState === 'before' ? 'text-slate-400' : 'text-cyan-300'}`}>
                        {viewState === 'before' ? '85 MB/s (Lento)' : '3,500 MB/s (+40x más veloz)'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          viewState === 'before' ? 'w-[6%] bg-slate-600' : 'w-[95%] bg-gradient-to-r from-cyan-400 to-violet-500'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Metric 4: Sound / Noise */}
                  <div className="p-3.5 rounded-xl bg-[#161F30]/80 border border-slate-800">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-teal-400" /> Ruido y Fricción de Ventiladores
                      </span>
                      <span className={`font-bold font-mono ${viewState === 'before' ? 'text-rose-400' : 'text-teal-300'}`}>
                        {viewState === 'before' ? '56 dB (Ruido turbina / suciedad)' : '21 dB (Silencioso y lubricado)'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          viewState === 'before' ? 'w-[80%] bg-rose-500' : 'w-[25%] bg-teal-400'
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom interactive card trigger */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">¿Tu equipo presenta estos síntomas?</span>
                  <a
                    href={BRAND_DATA.defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
                  >
                    <span>Pedir revisión</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Floating Trust Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_METRICS.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-[#161F30]/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-md text-center group"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1 group-hover:scale-105 transition-transform">
                {item.value}
              </div>
              <div className="text-sm font-semibold text-white mb-0.5">{item.label}</div>
              <div className="text-xs text-slate-400">{item.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
