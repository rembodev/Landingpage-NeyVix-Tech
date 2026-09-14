import React, { useState, useMemo } from 'react';
import {
  Search,
  Columns3,
  List,
  Eye,
  FileText,
  MessageCircle,
  Clock,
  Laptop,
  Monitor,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { openWhatsAppChat } from '../../lib/whatsapp';

export const STATUS_CONFIG = {
  diagnostico: {
    label: 'Diagnóstico',
    color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    next: 'en_proceso',
    nextLabel: 'Pasar a Taller',
  },
  en_proceso: {
    label: 'En Proceso',
    color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400',
    next: 'control_calidad',
    nextLabel: 'Pasar a QA',
  },
  control_calidad: {
    label: 'Control de Calidad',
    color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dot: 'bg-blue-400',
    next: 'listo',
    nextLabel: 'Marcar Listo',
  },
  listo: {
    label: 'Listo para Entrega',
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    next: 'entregado',
    nextLabel: 'Entregar / Cobrar',
  },
  entregado: {
    label: 'Entregado & Cobrado',
    color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dot: 'bg-purple-400',
    next: null,
    nextLabel: null,
  },
};

export default function OrdersPipeline({
  orders = [],
  onEditOrder,
  onOpenReceipt,
  onUpdateStatus,
  filterStatus = 'all',
  setFilterStatus,
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');

  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filtrado reactivo en vivo con null safety
  const filteredOrders = useMemo(() => {
    return safeOrders.filter((order) => {
      if (!order) return false;

      // Filtro de estado
      if (filterStatus !== 'all' && order?.status !== filterStatus) {
        if (filterStatus === 'en_proceso' && order?.status === 'control_calidad') {
          // agrupar control de calidad con en proceso si se desea
        } else {
          return false;
        }
      }

      // Filtro de texto
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        order?.order_code?.toLowerCase()?.includes(q) ||
        order?.customer_name?.toLowerCase()?.includes(q) ||
        order?.customer_phone?.toLowerCase()?.includes(q) ||
        order?.device_brand?.toLowerCase()?.includes(q) ||
        order?.device_model?.toLowerCase()?.includes(q) ||
        order?.device_serial?.toLowerCase()?.includes(q) ||
        order?.reported_issue?.toLowerCase()?.includes(q)
      );
    });
  }, [safeOrders, filterStatus, searchQuery]);

  const kanbanColumns = [
    { key: 'diagnostico', title: 'Diagnóstico Inicial', dot: 'bg-amber-400' },
    { key: 'en_proceso', title: 'En Proceso (Taller)', dot: 'bg-cyan-400' },
    { key: 'control_calidad', title: 'Control de Calidad (QA)', dot: 'bg-blue-400' },
    { key: 'listo', title: 'Listo para Entrega', dot: 'bg-emerald-400' },
    { key: 'entregado', title: 'Entregado & Cobrado', dot: 'bg-purple-400' },
  ];

  return (
    <div className="space-y-4">
      {/* Barra de Herramientas: Buscador, Filtros de Estado y Selector de Vista */}
      <div className="bg-[#121926]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xl">
        {/* Input de Búsqueda Predictiva */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por NVX-001, cliente, teléfono, marca o serie..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtros de Pestañas de Estado */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Todas ({safeOrders.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = safeOrders.filter((o) => o?.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${
                  filterStatus === key
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                <span>{cfg.label}</span>
                <span className="text-[10px] text-slate-500 font-bold">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Alternador Tabla / Kanban */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista de Tabla Interactiva"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'kanban' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Vista de Tablero Kanban"
          >
            <Columns3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VISTA 1: TABLA INTERACTIVA */}
      {viewMode === 'table' && (
        <div className="bg-[#121926]/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Orden / Fecha</th>
                  <th className="py-3.5 px-4">Cliente & Contacto</th>
                  <th className="py-3.5 px-4">Equipo & Modelo</th>
                  <th className="py-3.5 px-4">Servicios & Falla</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Económico</th>
                  <th className="py-3.5 px-4 text-center">Acciones Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="font-semibold text-slate-300">No se encontraron órdenes con esos criterios</p>
                      <p className="text-[11px] text-slate-500 mt-1">Prueba limpiando los filtros o creando una nueva recepción técnica.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.diagnostico;
                    const balance = Number(order.balance_payment ?? (Number(order.total_cost || 0) - Number(order.advance_payment || 0)));

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Código y Fecha */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-black text-cyan-400 tracking-wider text-sm">
                            {order.order_code}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-600" />
                            <span>
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString('es-PE', {
                                    day: '2-digit',
                                    month: 'short',
                                  })
                                : 'Reciente'}
                            </span>
                          </div>
                        </td>

                        {/* Cliente */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-200">{order.customer_name}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span>WhatsApp: {order.customer_phone}</span>
                            {order.customer_doc && (
                              <span className="text-[10px] text-slate-500">
                                • Doc: {order.customer_doc}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Equipo */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                            {order.device_type === 'Laptop' ? (
                              <Laptop className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            ) : (
                              <Monitor className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            )}
                            <span className="truncate max-w-[160px]">
                              {order.device_brand} {order.device_model}
                            </span>
                          </div>
                          {order.device_serial && (
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              S/N: {order.device_serial}
                            </p>
                          )}
                        </td>

                        {/* Servicios & Falla */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <div className="flex flex-wrap gap-1 mb-1">
                            {(order.services_selected || []).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-300 border border-slate-700"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate" title={order.reported_issue}>
                            {order.reported_issue || 'Sin detalle de falla'}
                          </p>
                        </td>

                        {/* Estado y Cambio Rápido */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusCfg.color}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
                              {statusCfg.label}
                            </span>
                            {statusCfg.next && (
                              <button
                                onClick={() => onUpdateStatus(order.id, statusCfg.next)}
                                title={statusCfg.nextLabel}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-700 transition"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Económico: Total y Saldo */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="font-bold text-slate-200">
                            S/ {Number(order.total_cost || 0).toFixed(2)}
                          </div>
                          <div className="text-[10px] font-semibold mt-0.5">
                            {balance <= 0 ? (
                              <span className="text-emerald-400">Cancelado</span>
                            ) : (
                              <span className="text-amber-400">
                                Saldo: S/ {balance.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Botones de Acción */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Ver / Editar Detalle */}
                            <button
                              onClick={() => onEditOrder(order)}
                              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700/60 transition cursor-pointer"
                              title="Ver Detalle Técnico & Editar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Generar Comprobante PDF */}
                            <button
                              onClick={() => onOpenReceipt(order)}
                              className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
                              title="Generar Comprobante de Recepción / Entrega"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Notificar por WhatsApp */}
                            <button
                              onClick={() => openWhatsAppChat(order)}
                              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                              title="Enviar Notificación por WhatsApp al Cliente"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 2: TABLERO KANBAN */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.key);
            return (
              <div
                key={col.key}
                className="bg-[#121926]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Cabecera de Columna */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></span>
                    <span className="font-bold text-xs text-white uppercase tracking-wider">
                      {col.title}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                    {colOrders.length}
                  </span>
                </div>

                {/* Tarjetas de la Columna */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {colOrders.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800/60 rounded-xl text-[11px] text-slate-500">
                      Sin equipos aquí
                    </div>
                  ) : (
                    colOrders.map((order) => {
                      const balance = Number(order.balance_payment ?? (Number(order.total_cost || 0) - Number(order.advance_payment || 0)));
                      const statusCfg = STATUS_CONFIG[order.status];

                      return (
                        <div
                          key={order.id}
                          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 transition-all duration-200 shadow-md group relative"
                        >
                          {/* Código y Marca */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-cyan-400 text-xs">
                              {order.order_code}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[100px]">
                              {order.device_brand}
                            </span>
                          </div>

                          {/* Cliente y Equipo */}
                          <h4 className="font-bold text-slate-200 text-xs truncate">
                            {order.customer_name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {order.device_model}
                          </p>

                          {/* Falla resumida */}
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                            {order.reported_issue || 'Revisión técnica'}
                          </p>

                          {/* Económico */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[11px]">
                            <span className="font-bold text-slate-300">
                              S/ {Number(order.total_cost || 0).toFixed(2)}
                            </span>
                            {balance > 0 ? (
                              <span className="text-amber-400 text-[10px] font-semibold">
                                Debe S/ {balance.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-emerald-400 text-[10px] font-semibold">
                                Cancelado
                              </span>
                            )}
                          </div>

                          {/* Botones de Acción en Kanban */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onEditOrder(order)}
                                className="p-1 rounded text-slate-400 hover:text-cyan-400 transition"
                                title="Editar"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onOpenReceipt(order)}
                                className="p-1 rounded text-slate-400 hover:text-cyan-400 transition"
                                title="Comprobante"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openWhatsAppChat(order)}
                                className="p-1 rounded text-slate-400 hover:text-emerald-400 transition"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {statusCfg?.next && (
                              <button
                                onClick={() => onUpdateStatus(order.id, statusCfg.next)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition"
                              >
                                <span>Avanzar</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
