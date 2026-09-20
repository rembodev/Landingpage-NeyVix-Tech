import React, { useState } from 'react';
import { 
  Calculator, 
  Laptop, 
  Monitor, 
  Flame, 
  HardDrive, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { createWhatsAppLink } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

export default function DiagnosticTool() {
  const [deviceType, setDeviceType] = useState('laptop_office');
  const [symptom, setSymptom] = useState('slow');
  const [goal, setGoal] = useState('ssd');

  const devices = [
    { id: 'laptop_office', name: 'Laptop Trabajo / Oficina', icon: Laptop },
    { id: 'laptop_gamer', name: 'Laptop Gamer / Diseño', icon: Laptop },
    { id: 'pc_desktop', name: 'PC de Escritorio / Torre', icon: Monitor },
    { id: 'aio', name: 'Todo en Uno (All-in-One)', icon: Monitor }
  ];

  const symptoms = [
    { id: 'slow', name: 'Lentitud extrema y tarda en arrancar', icon: HardDrive },
    { id: 'heat', name: 'Calienta demasiado y ventilador suena fuerte', icon: Flame },
    { id: 'virus', name: 'Virus, publicidad o pantallas azules (BSOD)', icon: AlertTriangle },
    { id: 'hardware', name: 'No enciende, sin video o pantalla/teclado roto', icon: Wrench }
  ];

  const goals = [
    { id: 'ssd', name: 'Instalar SSD NVMe / Ampliar RAM (Velocidad x10)' },
    { id: 'thermal', name: 'Mantenimiento preventivo & pasta térmica' },
    { id: 'format', name: 'Formateo limpio & optimización de SO' },
    { id: 'repair', name: 'Diagnóstico & cambio modular de repuesto' }
  ];

  // Dynamic recommendation logic
  const getRecommendation = () => {
    let title = "Repotenciación con SSD + Mantenimiento";
    let desc = "La combinación ideal para revivir tu equipo. El disco SSD multiplicará la velocidad por 10 y el cambio de pasta térmica evitará daños por calor.";
    let time = "2 a 4 horas (mismo día)";

    if (symptom === 'heat' || goal === 'thermal') {
      title = "Mantenimiento Preventivo & Térmico Profundo";
      desc = "Desensamble completo, retiro de polvo en disipador, lubricación de turbinas y colocación de pasta térmica prémium (Arctic MX-4).";
      time = "3 a 5 horas";
    } else if (symptom === 'hardware' || goal === 'repair') {
      title = "Diagnóstico & Mantenimiento Correctivo";
      desc = "Identificación precisa de fallas, solución a problemas de lentitud, calentamiento y cambio modular de piezas defectuosas (pantallas, teclados, baterías, bisagras).";
      time = "24 a 48 horas (según disponibilidad de repuesto)";
    } else if (symptom === 'virus' || goal === 'format') {
      title = "Formateo Limpio, Desinfección & Respaldo de Datos";
      desc = "Instalación desde cero de Windows 11/10 con licencias, eliminación total de malware y resguardo de tus archivos personales.";
      time = "2 a 3 horas";
    }

    const currentDeviceName = devices.find(d => d.id === deviceType)?.name || "Equipo";
    const currentSymptomName = symptoms.find(s => s.id === symptom)?.name || "Falla";
    const currentGoalName = goals.find(g => g.id === goal)?.name || "Mejora";

    const whatsappMessage = `Hola Neyvix Tech! Hice el diagnóstico en su web:
- Mi equipo: ${currentDeviceName}
- Problema principal: ${currentSymptomName}
- Servicio deseado: ${currentGoalName}
- Diagnóstico sugerido: ${title}
¿Podrían brindarme el presupuesto y disponibilidad?`;

    return { title, desc, time, whatsappMessage };
  };

  const rec = getRecommendation();

  return (
    <section id="cotizador" className="py-24 relative bg-gradient-to-b from-[#0B0F17] via-[#0E1524] to-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Herramienta Interactiva</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Diagnóstico Rápido & <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Cotizador Online</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Selecciona el tipo de equipo y la falla para obtener una recomendación técnica instantánea y contactar directo al especialista.
          </p>
        </div>

        {/* Wizard Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Selection Controls */}
          <div className="lg:col-span-7 space-y-7 bg-[#161F30]/90 p-6 sm:p-8 rounded-2xl border border-slate-800 backdrop-blur-md">
            
            {/* Step 1: Device */}
            <div>
              <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">1</span>
                ¿Qué tipo de equipo tienes?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {devices.map((d) => {
                  const Icon = d.icon;
                  const isSelected = deviceType === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDeviceType(d.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md shadow-cyan-950/50' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium">{d.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Symptom */}
            <div>
              <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">2</span>
                ¿Cuál es la falla o síntoma principal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptoms.map((s) => {
                  const Icon = s.icon;
                  const isSelected = symptom === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSymptom(s.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md shadow-cyan-950/50' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium">{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Desired Goal */}
            <div>
              <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">3</span>
                ¿Qué solución o mejora buscas prioritariamente?
              </label>
              <div className="space-y-2.5">
                {goals.map((g) => {
                  const isSelected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md shadow-cyan-950/50' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">{g.name}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#161F30] to-[#111827] p-6 sm:p-8 rounded-2xl border border-cyan-500/40 shadow-xl shadow-cyan-950/40 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Diagnóstico Preliminar
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                100% Personalizado
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                {rec.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {rec.desc}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" /> Tiempo estimado de atención:
                </span>
                <span className="font-semibold text-white">{rec.time}</span>
              </div>
            </div>

            {/* Generated WhatsApp Message Preview */}
            <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-400" />
                Mensaje que se enviará al WhatsApp:
              </div>
              <p className="text-xs font-mono text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                {rec.whatsappMessage}
              </p>
            </div>

            {/* CTA Button */}
            <a
              href={createWhatsAppLink(rec.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`Cotizar Diagnóstico: ${rec.title}`}
              data-track-type="click_whatsapp"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>Cotizar este diagnóstico por WhatsApp</span>
            </a>

            <p className="text-center text-[11px] text-slate-400 mt-4">
              ⚡ Te respondemos en minutos con precios exactos y opciones de repuestos.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
