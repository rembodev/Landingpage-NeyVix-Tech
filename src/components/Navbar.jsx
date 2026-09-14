import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { BRAND_DATA } from '../data/content';
import WhatsAppIcon from './WhatsAppIcon';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Cotizador', href: '#cotizador' },
    { label: 'Proceso', href: '#proceso' },
    { label: 'Visión IT', href: '#vision' },
    { label: 'Preguntas', href: '#faq' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 group-hover:scale-105 transition-all duration-300">
            <img 
              src="/logo.webp" 
              alt="Neyvix Tech Logo" 
              className="w-full h-full object-cover rounded-full bg-[#0B0F17]"
            />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-300 -z-10"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              NEYVIX <span className="text-cyan-400">TECH</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 -mt-1">
              Creative Solutions & Support
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-400 after:to-violet-500 hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* WhatsApp CTA Button Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={BRAND_DATA.defaultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Cotizar por WhatsApp</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={BRAND_DATA.defaultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            aria-label="WhatsApp directo"
          >
            <WhatsAppIcon className="w-5 h-5 fill-emerald-400" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60 focus:outline-none"
            aria-label="Menú principal"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0B0F17]/95 backdrop-blur-xl border-b border-slate-800 px-6 py-6 transition-all duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/60 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-cyan-500 text-xs">→</span>
              </a>
            ))}
            <div className="pt-3">
              <a
                href={BRAND_DATA.defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/30"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Cotizar por WhatsApp Ahora</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
