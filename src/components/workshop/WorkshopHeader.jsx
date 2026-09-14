import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';

export default function WorkshopHeader({
  activeTab,
  setActiveTab,
  onOpenNewOrder,
  onOpenProfile,
  orderCounts = { total: 0, ready: 0 },
}) {
  const { user, logout, isSupabase } = useAuth();

  // Detección en vivo de conectividad de red
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isConnected = isOnline && (isSupabase || true);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Taller Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-10 h-10 rounded-xl p-[1px] bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/20">
              <img
                src="/logo.webp"
                alt="Neyvix Tech"
                className="w-full h-full object-cover rounded-xl bg-[#0B0F17]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">
                  NEYVIX <span className="text-cyan-400">TECH</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  TALLER PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Control Técnico & Gestión de Órdenes • Chiclayo
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs: Pipeline & Nueva Recepción (Sin Ajustes SQL) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Pipeline & Órdenes</span>
              {orderCounts.total > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                  {orderCounts.total}
                </span>
              )}
            </button>

            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nueva Recepción</span>
            </button>
          </div>

          {/* Right Area: Indicador de Solo Lectura, Perfil de Usuario & Cerrar Sesión */}
          <div className="flex items-center gap-2.5">
            {/* Indicador de Estado de Solo Lectura (No clickeable) */}
            <div
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-semibold pointer-events-none ${
                !isOnline
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : isSupabase
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
              title="Estado de conexión del sistema de taller"
            >
              <span className="relative flex h-2 w-2">
                {!isOnline ? (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                ) : (
                  <>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSupabase ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      isSupabase ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`}></span>
                  </>
                )}
              </span>
              <span>
                {!isOnline
                  ? 'Sin conexión'
                  : isSupabase
                  ? 'Conectado (Cloud)'
                  : 'Conectado (Local)'}
              </span>
            </div>

            {/* Mobile New Order Button */}
            <button
              onClick={onOpenNewOrder}
              className="md:hidden flex items-center justify-center p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-pointer"
              title="Nueva Recepción"
            >
              <PlusCircle className="w-5 h-5" />
            </button>

            {/* Tarjeta de Perfil del Técnico (Clickeable -> Abre Mi Perfil) */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 sm:border-l border-slate-800 hover:bg-slate-800/60 p-1.5 rounded-xl transition cursor-pointer text-left group"
              title="Haga clic para ver o editar su perfil"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-500/50 group-hover:border-cyan-400 shrink-0 transition">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.full_name || 'Técnico'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition leading-tight truncate max-w-[130px]">
                  {user?.full_name || user?.email || 'Técnico'}
                </p>
                <p className="text-[10px] text-cyan-400 font-medium">
                  {user?.role === 'admin' ? 'Administrador' : 'Técnico Taller'} • Mi Perfil
                </p>
              </div>
            </button>

            {/* Botón Cerrar Sesión */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Cerrar sesión técnica"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
