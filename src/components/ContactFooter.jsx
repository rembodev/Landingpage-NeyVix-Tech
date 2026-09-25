import React, { useState } from 'react';
import { 
  Cpu, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Send, 
  ShieldCheck, 
  ArrowUp,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { BRAND_DATA, createWhatsAppLink } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function ContactFooter() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device: '',
    issue: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor ingresa tu nombre completo.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Ingresa un número telefónico o WhatsApp.';
    } else if (!/^[0-9+]{8,15}$/.test(cleanPhone)) {
      newErrors.phone = 'Ingresa un número válido de Perú (ej. 929 443 131).';
    }

    if (!formData.device.trim()) {
      newErrors.device = 'Indica el equipo (marca y modelo, ej. Lenovo ThinkPad).';
    }

    if (!formData.issue.trim()) {
      newErrors.issue = 'Describe la falla o servicio requerido.';
    } else if (formData.issue.trim().length < 4) {
      newErrors.issue = 'Por favor describe un poco más el problema.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const text = `Hola Neyvix Tech, mi nombre es ${formData.name.trim()}.
Mi número de contacto es: ${formData.phone.trim()}
Mi equipo es: ${formData.device.trim()}
Detalle de la falla / requerimiento: ${formData.issue.trim()}
¿Podrían apoyarme con el diagnóstico y presupuesto?`;

    const targetUrl = createWhatsAppLink(text);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.open(targetUrl, '_blank');
    }, 600);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contacto" className="bg-[#080B11] text-slate-400 pt-20 pb-12 border-t border-slate-900 relative">
      
      {/* Contact Section Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Canales Directos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ¿Listo para revivir tu equipo o equipar tu empresa?
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Atendemos tus consultas de inmediato por WhatsApp, llamada o mensaje. Te brindamos un diagnóstico previo sin costo para que tomes la mejor decisión.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#161F30]/60 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">Zona de Cobertura</h4>
                  <p className="text-xs text-slate-300">{BRAND_DATA.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#161F30]/60 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">Horarios de Atención</h4>
                  <p className="text-xs text-slate-300">{BRAND_DATA.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#161F30]/60 border border-slate-800">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">Línea Telefónica & WhatsApp</h4>
                  <p className="text-xs text-slate-300">{BRAND_DATA.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Quick Inquiry Form */}
          <div className="lg:col-span-6 bg-[#161F30]/90 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl shadow-black/40">
            <h3 className="text-xl font-bold text-white mb-2">
              Envía tu Solicitud Rápida
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Completa los datos y se abrirá tu WhatsApp con el mensaje estructurado listo para enviar.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Tu Nombre y Apellidos</span>
                  {errors.name && (
                    <span className="text-[11px] text-rose-400 font-normal flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                    errors.name
                      ? 'border-rose-500/70 bg-rose-950/20 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Teléfono / Celular</span>
                    {errors.phone && (
                      <span className="text-[10px] text-rose-400 font-normal flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> Requerido
                      </span>
                    )}
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. 929 443 131"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                      errors.phone
                        ? 'border-rose-500/70 bg-rose-950/20 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                        : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Equipo (Marca y Modelo)</span>
                    {errors.device && (
                      <span className="text-[10px] text-rose-400 font-normal flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> Requerido
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Asus TUF / Lenovo ThinkPad"
                    value={formData.device}
                    onChange={(e) => handleChange('device', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                      errors.device
                        ? 'border-rose-500/70 bg-rose-950/20 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                        : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20'
                    }`}
                  />
                  {errors.device && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.device}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>¿Qué falla presenta o qué servicio requieres?</span>
                  {errors.issue && (
                    <span className="text-[11px] text-rose-400 font-normal flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.issue}
                    </span>
                  )}
                </label>
                <textarea
                  rows="3"
                  placeholder="Ej. Se calienta demasiado, ventilador suena fuerte o deseo instalar un SSD de 1TB..."
                  value={formData.issue}
                  onChange={(e) => handleChange('issue', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-sm focus:outline-none transition-all resize-none ${
                    errors.issue
                      ? 'border-rose-500/70 bg-rose-950/20 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-track="Formulario Contacto: Enviar Consulta a WhatsApp"
                data-track-type="click_whatsapp"
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2.5 ${
                  isSubmitting
                    ? 'bg-cyan-800/80 cursor-wait'
                    : submitSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-cyan-500/25 active:scale-[0.99] cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Estructurando consulta y abriendo WhatsApp...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>¡Consulta enviada a WhatsApp! Volver a consultar</span>
                  </>
                ) : (
                  <>
                    <WhatsAppIcon className="w-5 h-5 fill-white" />
                    <span>Enviar Consulta Directa a WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-md">
              <img
                src="/logo.webp"
                alt="Logo oficial de Neyvix Tech - Soporte Técnico en Chiclayo"
                className="w-full h-full object-cover rounded-full bg-[#080B11]"
              />
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-wider">
                NEYVIX <span className="text-cyan-400">TECH</span>
              </span>
              <p className="text-[11px] text-slate-400">{BRAND_DATA.slogan}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={BRAND_DATA.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href={BRAND_DATA.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={BRAND_DATA.defaultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
            </a>
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>© 2026 Neyvix Tech. Todos los derechos reservados.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors cursor-pointer"
              title="Volver arriba"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}
