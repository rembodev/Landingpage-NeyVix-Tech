import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function WorkshopLogin({ onBackToSite }) {
  const { login, isSupabase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Ingrese su correo electrónico y contraseña.');
      }
      await login(email.trim(), password);
    } catch (err) {
      setError(
        err.message?.includes('Invalid login')
          ? 'Credenciales incorrectas. Verifique su correo y contraseña.'
          : err.message || 'Error al autenticar en el sistema'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luces de fondo y atmósfera segura */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo y Encabezado de Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20 mb-4">
            <img
              src="/logo.webp"
              alt="Neyvix Tech"
              className="w-full h-full object-cover rounded-2xl bg-[#0B0F17]"
            />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white">
            NEYVIX <span className="text-cyan-400">TECH</span>
          </h1>
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-1">
            Control Técnico & Taller Privado
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300">
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabase ? 'bg-emerald-400' : 'bg-cyan-400'} animate-pulse`}></span>
              <span>Acceso Restringido a Personal Autorizado</span>
            </span>
          </div>
        </div>

        {/* Tarjeta de Login Estricta */}
        <div className="bg-[#121926]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <div className="mb-6 pb-4 border-b border-slate-800 text-center">
            <h2 className="text-base font-bold text-white">Iniciar Sesión en el Taller</h2>
            <p className="text-xs text-slate-400 mt-1">
              Ingrese sus credenciales de técnico o administrador
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@neyvixtech.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Enlace de regreso al sitio público */}
        {onBackToSite && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-cyan-400 transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Volver al sitio web principal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
