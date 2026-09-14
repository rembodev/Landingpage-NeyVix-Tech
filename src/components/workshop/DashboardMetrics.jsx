import React from 'react';
import { Stethoscope, Wrench, CheckCircle2, DollarSign, ArrowUpRight } from 'lucide-react';

export default function DashboardMetrics({ orders = [], onFilterStatus }) {
  // Asegurar que siempre se opere sobre un array seguro
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Cálculos de métricas en tiempo real con optional chaining
  const diagnosticoCount = safeOrders.filter((o) => o?.status === 'diagnostico').length;
  const enProcesoCount = safeOrders.filter((o) => o?.status === 'en_proceso' || o?.status === 'control_calidad').length;
  const listosCount = safeOrders.filter((o) => o?.status === 'listo').length;
  const entregadosList = safeOrders.filter((o) => o?.status === 'entregado');
  const entregadosCount = entregadosList.length;

  // Total cobrado / facturado en el mes
  const totalRevenue = safeOrders.reduce((sum, o) => {
    if (o?.status === 'entregado') {
      return sum + Number(o?.total_cost || 0);
    }
    return sum + Number(o?.advance_payment || 0);
  }, 0);

  const pendingCollection = safeOrders
    .filter((o) => o?.status !== 'entregado' && o?.status !== 'cancelado')
    .reduce((sum, o) => sum + Number(o?.balance_payment || 0), 0);

  const cards = [
    {
      id: 'diagnostico',
      label: 'En Diagnóstico',
      count: diagnosticoCount,
      subtext: 'Revisión y pruebas iniciales',
      icon: Stethoscope,
      color: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30 hover:border-amber-500/60',
      textColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'en_proceso',
      label: 'En Proceso (Taller)',
      count: enProcesoCount,
      subtext: 'Trabajo técnico & QA en curso',
      icon: Wrench,
      color: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
      textColor: 'text-cyan-400',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
    },
    {
      id: 'listo',
      label: 'Listos para Entrega',
      count: listosCount,
      subtext: 'Control de calidad aprobado',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      textColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'entregado',
      label: 'Entregados / Cobrados',
      count: entregadosCount,
      subtext: `S/ ${totalRevenue.toFixed(2)} recaudado (S/ ${pendingCollection.toFixed(2)} por cobrar)`,
      icon: DollarSign,
      color: 'from-purple-500/20 to-indigo-500/10',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      textColor: 'text-purple-400',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterStatus && onFilterStatus(card.id)}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} bg-[#121926]/90 border ${card.borderColor} p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/40 cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/80 ${card.textColor} border border-slate-800 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white tracking-tight">
                {card.count}
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor} flex items-center gap-1`}>
                <span>Activos</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 truncate font-medium">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
