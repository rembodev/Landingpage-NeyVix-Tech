import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  Users,
  MessageCircle,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  RefreshCw,
  Clock,
  TrendingUp,
  Flame,
  Wrench,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { getLocalAnalyticsEvents } from '../../lib/tracker';

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realtimeActive, setRealtimeActive] = useState(false);

  // Filtros
  const [dateRange, setDateRange] = useState('7d'); // 'today' | '7d' | '30d' | 'all'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'click_whatsapp' | 'click_service' | 'page_view' | 'diagnostic_calc'
  const [searchQuery, setSearchQuery] = useState('');

  // 1. CARGA INICIAL DE EVENTOS (SUPABASE + LOCAL STORAGE FALLBACK)
  const fetchAnalyticsEvents = useCallback(async () => {
    setIsRefreshing(true);
    let loadedEvents = [];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('site_analytics_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500);

        if (!error && Array.isArray(data) && data.length > 0) {
          loadedEvents = data;
        } else if (error) {
          console.warn('Nota: Supabase devolvió error o tabla no creada aún:', error.message);
        }
      } catch (err) {
        console.warn('Fallo de red al conectar con Supabase Analytics:', err);
      }
    }

    // Si Supabase no tiene datos o no está disponible, usar almacenamiento local + semillas
    if (loadedEvents.length === 0) {
      loadedEvents = getLocalAnalyticsEvents();
    }

    setEvents(loadedEvents);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAnalyticsEvents();
  }, [fetchAnalyticsEvents]);

  // 2. SUSCRIPCIÓN EN TIEMPO REAL CON SUPABASE REALTIME
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setRealtimeActive(false);
      return;
    }

    try {
      const channel = supabase
        .channel('public:site_analytics_events_channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'site_analytics_events',
          },
          (payload) => {
            if (payload?.new) {
              const newEvt = payload.new;
              setEvents((prev) => {
                // Evitar duplicados por ID
                if (prev.some((e) => e.id === newEvt.id)) return prev;
                return [newEvt, ...prev];
              });
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setRealtimeActive(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setRealtimeActive(false);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('No se pudo establecer suscripción Realtime en Supabase:', e);
      setRealtimeActive(false);
    }
  }, []);

  // 3. FILTRADO TEMPORAL Y DE BÚSQUEDA
  const filteredEvents = useMemo(() => {
    const now = new Date();

    return events.filter((evt) => {
      if (!evt) return false;

      // Filtro por fecha
      if (dateRange !== 'all' && evt.created_at) {
        const evtTime = new Date(evt.created_at).getTime();
        if (dateRange === 'today') {
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          if (evtTime < startOfToday) return false;
        } else if (dateRange === '7d') {
          const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
          if (evtTime < sevenDaysAgo) return false;
        } else if (dateRange === '30d') {
          const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
          if (evtTime < thirtyDaysAgo) return false;
        }
      }

      // Filtro por tipo de evento
      if (typeFilter !== 'all' && evt.event_type !== typeFilter) {
        return false;
      }

      // Filtro por término de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const target = (evt.event_target || '').toLowerCase();
        const path = (evt.page_path || '').toLowerCase();
        const referrer = (evt.referrer || '').toLowerCase();
        const type = (evt.event_type || '').toLowerCase();
        return target.includes(q) || path.includes(q) || referrer.includes(q) || type.includes(q);
      }

      return true;
    });
  }, [events, dateRange, typeFilter, searchQuery]);

  // 4. CÁLCULO DE MÉTRICAS KPI Y ESTADÍSTICAS
  const kpis = useMemo(() => {
    const totalEvents = filteredEvents.length;

    // Sesiones únicas en el rango
    const uniqueSessions = new Set(
      filteredEvents.map((e) => e.session_id).filter(Boolean)
    ).size;

    // Visitas / Page Views
    const pageViews = filteredEvents.filter((e) => e.event_type === 'page_view').length;

    // Clics en WhatsApp (Leads)
    const whatsappClicks = filteredEvents.filter(
      (e) => e.event_type === 'click_whatsapp' || (e.event_target || '').toLowerCase().includes('whatsapp')
    ).length;

    // Clics e interés en servicios
    const serviceClicks = filteredEvents.filter(
      (e) => e.event_type === 'click_service' || e.event_type === 'diagnostic_calc'
    ).length;

    // Tasa de conversión: Leads / Sesiones Únicas
    const effectiveSessions = Math.max(uniqueSessions, 1);
    const conversionRate = Math.min(100, (whatsappClicks / effectiveSessions) * 100);

    // Distribución por dispositivo
    let mobileCount = 0;
    let desktopCount = 0;
    let tabletCount = 0;

    filteredEvents.forEach((e) => {
      const dev = (e.device_type || '').toLowerCase();
      if (dev.includes('móvil') || dev.includes('movil') || dev.includes('mobile')) {
        mobileCount++;
      } else if (dev.includes('tablet')) {
        tabletCount++;
      } else {
        desktopCount++;
      }
    });

    const totalDevices = Math.max(mobileCount + desktopCount + tabletCount, 1);
    const mobilePercent = Math.round((mobileCount / totalDevices) * 100);
    const desktopPercent = Math.round((desktopCount / totalDevices) * 100);
    const tabletPercent = Math.round((tabletCount / totalDevices) * 100);

    // Servicio más clickeado / cotizado
    const serviceCounts = {
      'Mantenimiento Térmico': 0,
      'Repotenciación SSD & RAM': 0,
      'Formateo & Software': 0,
      'Diagnóstico Electrónico': 0,
      'Cotizador Interactivo': 0,
    };

    filteredEvents.forEach((e) => {
      const text = `${e.event_target || ''} ${e.event_type || ''}`.toLowerCase();
      if (text.includes('térmico') || text.includes('termico') || text.includes('pasta') || text.includes('limpieza')) {
        serviceCounts['Mantenimiento Térmico']++;
      } else if (text.includes('ssd') || text.includes('ram') || text.includes('repotenciacion') || text.includes('repotenciación')) {
        serviceCounts['Repotenciación SSD & RAM']++;
      } else if (text.includes('formateo') || text.includes('software') || text.includes('windows')) {
        serviceCounts['Formateo & Software']++;
      } else if (text.includes('electrónica') || text.includes('electronica') || text.includes('placa') || text.includes('corto')) {
        serviceCounts['Diagnóstico Electrónico']++;
      } else if (text.includes('diagnóstico') || text.includes('diagnostico') || text.includes('cotizador')) {
        serviceCounts['Cotizador Interactivo']++;
      }
    });

    let topService = 'Mantenimiento Térmico';
    let topServiceCount = 0;
    Object.entries(serviceCounts).forEach(([name, count]) => {
      if (count > topServiceCount) {
        topServiceCount = count;
        topService = name;
      }
    });

    // Orígenes de tráfico (Referrers)
    const referrerCounts = {};
    filteredEvents.forEach((e) => {
      const ref = e.referrer || 'Directo';
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });

    return {
      totalEvents,
      uniqueSessions,
      pageViews,
      whatsappClicks,
      serviceClicks,
      conversionRate: conversionRate.toFixed(1),
      mobilePercent,
      desktopPercent,
      tabletPercent,
      topService,
      topServiceCount,
      serviceCounts,
      referrerCounts,
    };
  }, [filteredEvents]);

  // Formato amigable de fecha y hora
  const formatEventTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffMinutes < 1) return 'Hace un momento';
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `Hace ${hours} h`;
      }

      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Badge y color según el tipo de evento
  const getEventBadge = (type) => {
    switch (type) {
      case 'click_whatsapp':
        return {
          label: 'WhatsApp Lead',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'click_service':
        return {
          label: 'Servicio',
          color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
        };
      case 'page_view':
        return {
          label: 'Visita Web',
          color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'diagnostic_calc':
        return {
          label: 'Diagnóstico',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      default:
        return {
          label: 'Interacción CTA',
          color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Estado y Controles Rápidos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121926]/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                Analítica de Tráfico & Conversión
              </h2>
              {realtimeActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                  Realtime Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                  Sincronizado
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Monitoreo en vivo de visitantes, intereses de servicio y prospectos hacia WhatsApp
            </p>
          </div>
        </div>

        {/* Selector de Rango de Fechas & Refrescar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            {[
              { id: 'today', label: 'Hoy' },
              { id: '7d', label: 'Últimos 7 días' },
              { id: '30d', label: '30 días' },
              { id: 'all', label: 'Todo' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setDateRange(r.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  dateRange === r.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalyticsEvents}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
            title="Actualizar métricas ahora"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4 TARJETAS PRINCIPALES DE KPIS (NEON GLOW BORDERS) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Visitas & Sesiones */}
        <div className="relative group rounded-2xl bg-gradient-to-br from-[#121926] to-[#0d1320] border border-cyan-500/30 hover:border-cyan-400/60 p-5 shadow-lg shadow-cyan-950/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Visitas / Sesiones
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {kpis.uniqueSessions}
            </span>
            <span className="text-xs text-slate-400 font-medium">sesiones únicas</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Páginas vistas totales:</span>
            <span className="font-bold text-cyan-300">{kpis.pageViews} vistas</span>
          </div>
        </div>

        {/* KPI 2: Clics a WhatsApp & Tasa de Conversión */}
        <div className="relative group rounded-2xl bg-gradient-to-br from-[#121926] to-[#0d1320] border border-emerald-500/30 hover:border-emerald-400/60 p-5 shadow-lg shadow-emerald-950/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Leads WhatsApp
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 tracking-tight">
              {kpis.whatsappClicks}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {kpis.conversionRate}% Conv.
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Intención de cotización:</span>
            <span className="font-bold text-emerald-300">Alta probabilidad</span>
          </div>
        </div>

        {/* KPI 3: Servicio Más Cotizado */}
        <div className="relative group rounded-2xl bg-gradient-to-br from-[#121926] to-[#0d1320] border border-purple-500/30 hover:border-purple-400/60 p-5 shadow-lg shadow-purple-950/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Servicio Líder
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-base font-black text-purple-300 block truncate" title={kpis.topService}>
              {kpis.topService}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {kpis.topServiceCount} interacciones registradas
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Interés de mercado:</span>
            <span className="font-bold text-purple-300">Pilar #1 Taller</span>
          </div>
        </div>

        {/* KPI 4: Distribución por Dispositivo */}
        <div className="relative group rounded-2xl bg-gradient-to-br from-[#121926] to-[#0d1320] border border-blue-500/30 hover:border-blue-400/60 p-5 shadow-lg shadow-blue-950/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Plataforma
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-cyan-300">Móvil {kpis.mobilePercent}%</span>
              <span className="text-slate-300">Desktop {kpis.desktopPercent}%</span>
            </div>
            {/* Barra visual combinada */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${kpis.mobilePercent}%` }}
                title={`Móvil: ${kpis.mobilePercent}%`}
              />
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                style={{ width: `${kpis.desktopPercent}%` }}
                title={`Desktop: ${kpis.desktopPercent}%`}
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tablet / Otros:</span>
            <span className="font-bold text-slate-300">{kpis.tabletPercent}%</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* GRÁFICOS VISUALES: EMBUDO DE CONVERSIÓN & RANKING DE SERVICIOS */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Embudo de Conversión (7 cols) */}
        <div className="lg:col-span-7 bg-[#121926]/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Embudo de Conversión (Funnel)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Paso a paso hasta el WhatsApp
              </span>
            </div>

            <div className="space-y-4">
              {/* Nivel 1: Visitas a la Landing */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    1. Visitas a la Landing Page
                  </span>
                  <span className="font-bold text-white">
                    {kpis.uniqueSessions} visitantes (100%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg w-full" />
                </div>
              </div>

              {/* Nivel 2: Interés en Servicios & Diagnóstico */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    2. Interacción con Servicios & Protocolos
                  </span>
                  <span className="font-bold text-cyan-300">
                    {kpis.serviceClicks} clics ({Math.round((kpis.serviceClicks / Math.max(kpis.uniqueSessions, 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(8, Math.round((kpis.serviceClicks / Math.max(kpis.uniqueSessions, 1)) * 100)))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Nivel 3: Contacto WhatsApp (Leads) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    3. Clic a WhatsApp (Prospecto Calificado)
                  </span>
                  <span className="font-bold text-emerald-400">
                    {kpis.whatsappClicks} leads ({kpis.conversionRate}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(5, Math.round(Number(kpis.conversionRate))))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Rendimiento del embudo:</span>
            <span className="font-semibold text-cyan-300">
              {Number(kpis.conversionRate) > 10 ? '🔥 Excelente conversión comercial' : 'Óptimo para captación local'}
            </span>
          </div>
        </div>

        {/* Ranking de Servicios (5 cols) */}
        <div className="lg:col-span-5 bg-[#121926]/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Demanda por Servicio
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Clics de interés
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(kpis.serviceCounts).map(([name, count]) => {
                const total = Math.max(kpis.serviceClicks + kpis.whatsappClicks, 1);
                const percent = Math.min(100, Math.round((count / total) * 100));
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[190px]">
                        {name}
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {count} clics ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orígenes destacados */}
          <div className="mt-5 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
              Principales Orígenes de Tráfico:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(kpis.referrerCounts)
                .slice(0, 5)
                .map(([ref, c]) => (
                  <span
                    key={ref}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 border border-slate-700 text-slate-300"
                  >
                    {ref}: <strong className="text-cyan-300">{c}</strong>
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TABLA DE ACTIVIDAD EN TIEMPO REAL (LIVE ACTIVITY FEED) */}
      {/* ==================================================================== */}
      <div className="bg-[#121926]/90 border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        {/* Feed Header con Buscador y Filtros */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Registro de Actividad en Vivo (Live Feed)
              </h3>
              <p className="text-xs text-slate-400">
                Mostrando {filteredEvents.length} eventos registrados
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Buscador de Eventos */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar evento o botón..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Filtro por Categoría de Evento */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">Todos los Eventos</option>
              <option value="click_whatsapp">Leads WhatsApp</option>
              <option value="click_service">Interés en Servicios</option>
              <option value="page_view">Visitas Landing</option>
              <option value="diagnostic_calc">Cotizador Diagnóstico</option>
              <option value="cta_click">Acciones / CTAs</option>
            </select>
          </div>
        </div>

        {/* Tabla de Eventos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Hora / Fecha</th>
                <th className="py-3 px-4">Tipo de Evento</th>
                <th className="py-3 px-4">Acción / Elemento</th>
                <th className="py-3 px-4">Ruta / Hash</th>
                <th className="py-3 px-4">Dispositivo</th>
                <th className="py-3 px-4">Origen (Referrer)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-300">No se encontraron eventos</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Ajusta el rango de fechas o los filtros para visualizar la actividad
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.slice(0, 50).map((evt, idx) => {
                  const badge = getEventBadge(evt.event_type);
                  const isMobile = (evt.device_type || '').toLowerCase().includes('móvil') || (evt.device_type || '').toLowerCase().includes('movil');
                  const isTablet = (evt.device_type || '').toLowerCase().includes('tablet');

                  return (
                    <tr
                      key={evt.id || `${evt.created_at || 'evt'}-${idx}`}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Hora / Fecha */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{formatEventTime(evt.created_at)}</span>
                        </div>
                      </td>

                      {/* Badge Tipo de Evento */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${badge.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          {badge.label}
                        </span>
                      </td>

                      {/* Acción / Elemento */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block max-w-xs sm:max-w-sm truncate" title={evt.event_target}>
                          {evt.event_target || 'Interacción general'}
                        </span>
                      </td>

                      {/* Ruta / Sección */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                          {evt.page_path || '/'}
                        </span>
                      </td>

                      {/* Dispositivo */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          {isMobile ? (
                            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                          ) : isTablet ? (
                            <Tablet className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-blue-400" />
                          )}
                          <span>{evt.device_type || 'Desktop'}</span>
                        </div>
                      </td>

                      {/* Origen (Referrer) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-900/80 border border-slate-700/80 text-slate-300">
                          {evt.referrer || 'Directo'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredEvents.length > 50 && (
          <div className="p-3 bg-slate-900/70 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
            Mostrando los 50 eventos más recientes de {filteredEvents.length} totales registrados
          </div>
        )}
      </div>
    </div>
  );
}
