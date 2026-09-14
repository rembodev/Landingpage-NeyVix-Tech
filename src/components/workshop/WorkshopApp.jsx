import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import WorkshopLogin from './WorkshopLogin';
import WorkshopHeader from './WorkshopHeader';
import DashboardMetrics from './DashboardMetrics';
import OrdersPipeline from './OrdersPipeline';
import OrderReceptionModal from './OrderReceptionModal';
import ReceiptModal from './ReceiptModal';
import ProfileModal from './ProfileModal';
import {
  supabase,
  isSupabaseConfigured,
  getWorkOrders,
  saveWorkOrder,
  sanitizeOrderPayload,
  getNextOrderCode,
  syncLocalOrder,
  getLocalOrders,
} from '../../lib/supabaseClient';

export default function WorkshopApp({ onBackToSite }) {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modales
  const [isReceptionOpen, setIsReceptionOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. FUNCIÓN CENTRALIZADA DE LECTURA (SELECT)
  const fetchOrders = useCallback(async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('work_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error al obtener órdenes de Supabase:', error.message, error.details);
        } else if (Array.isArray(data)) {
          const normalized = data.map((o) => ({
            ...o,
            total_cost: Number(o.total_cost || 0),
            advance_payment: Number(o.advance_payment || 0),
            balance_payment: Number(
              o.balance_payment !== undefined && o.balance_payment !== null
                ? o.balance_payment
                : Math.max(0, Number(o.total_cost || 0) - Number(o.advance_payment || 0))
            ),
          }));
          setOrders(normalized);
          try {
            localStorage.setItem('neyvix_work_orders', JSON.stringify(normalized));
          } catch {}
          return normalized;
        }
      } catch (err) {
        console.error('Fallo de red o consulta en Supabase:', err);
      }
    }

    // Fallback a almacenamiento local si Supabase no está configurado o falla
    const local = getLocalOrders();
    setOrders(local);
    return local;
  }, []);

  // Llama a fetchOrders al montar o al cambiar el usuario
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const safeOrders = Array.isArray(orders) ? orders : [];

  // 2. GUARDADO ROBUSTO (INSERT & UPDATE)
  const handleSaveOrder = async (orderData) => {
    const isEditing = Boolean(
      orderData?.id &&
      !String(orderData.id).startsWith('temp_') &&
      !String(orderData.id).startsWith('ord-') &&
      safeOrders.some((o) => o.id === orderData.id)
    );
    const isNew = !isEditing;

    const payload = sanitizeOrderPayload(orderData);
    if (!payload.order_code) {
      payload.order_code = getNextOrderCode(safeOrders);
    }
    const total = Number(orderData.total_cost || 0);
    const advance = Number(orderData.advance_payment || 0);
    const calculatedBalance = Math.max(0, total - advance);

    if (isSupabaseConfigured() && supabase) {
      try {
        if (isNew) {
          // INSERT ROBUSTO
          const { data, error } = await supabase
            .from('work_orders')
            .insert([payload])
            .select();

          if (error) {
            console.error('Error al guardar en Supabase:', error.message, error.details);
            alert('Error al guardar la orden: ' + error.message);
            return null;
          }

          if (data && data.length > 0) {
            const savedOrder = {
              ...data[0],
              balance_payment: Number(data[0].balance_payment ?? calculatedBalance),
            };

            // Reflejo instantáneo en el estado local
            setOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)]);

            // Sincronización completa centralizada con fetchOrders()
            await fetchOrders();

            // Abrir comprobante
            setReceiptOrder(savedOrder);
            return savedOrder;
          }
        } else {
          // UPDATE
          const { data, error } = await supabase
            .from('work_orders')
            .update(payload)
            .eq('id', orderData.id)
            .select();

          if (error) {
            console.error('Error al actualizar en Supabase:', error.message, error.details);
            alert('Error al actualizar la orden: ' + error.message);
            return null;
          }

          if (data && data.length > 0) {
            const updatedOrder = {
              ...data[0],
              balance_payment: Number(data[0].balance_payment ?? calculatedBalance),
            };

            setOrders((prev) =>
              prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );

            await fetchOrders();
            setReceiptOrder(updatedOrder);
            return updatedOrder;
          }
        }
      } catch (err) {
        console.error('Excepción inesperada al guardar en Supabase:', err);
        alert('Error inesperado: ' + (err.message || 'Error de conexión'));
        return null;
      }
    }

    // Fallback a almacenamiento local
    const fallbackId = isNew ? 'ord-' + Date.now() : orderData.id;
    const localOrder = {
      ...payload,
      id: fallbackId,
      order_code: payload.order_code || getNextOrderCode(safeOrders),
      balance_payment: calculatedBalance,
      created_at: isNew ? new Date().toISOString() : orderData.created_at || new Date().toISOString(),
    };

    syncLocalOrder(localOrder);
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === localOrder.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = localOrder;
        return copy;
      }
      return [localOrder, ...prev];
    });
    setReceiptOrder(localOrder);
    return localOrder;
  };

  // 3. CAMBIO RÁPIDO DE ESTADO (UPDATE REACTIVO Y LIMPIO)
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('work_orders')
          .update({ status: newStatus })
          .eq('id', orderId)
          .select();

        if (error) {
          console.error('Error al actualizar estado:', error.message);
          alert('Error al actualizar estado: ' + error.message);
          return;
        }

        // Actualización reactiva inmediata en el estado local de React
        setOrders((prev) =>
          prev.map((o) => (o?.id === orderId ? { ...o, ...(data?.[0] || {}), status: newStatus } : o))
        );

        if (data && data[0]) {
          syncLocalOrder(data[0]);
        }
      } catch (err) {
        console.error('Error al actualizar estado:', err);
        alert('Error al actualizar estado: ' + (err.message || 'Error de conexión'));
        return;
      }
    } else {
      // Fallback local si Supabase no está activo
      setOrders((prev) =>
        prev.map((o) => (o?.id === orderId ? { ...o, status: newStatus } : o))
      );
      const target = safeOrders.find((o) => o?.id === orderId);
      if (target) {
        syncLocalOrder({ ...target, status: newStatus });
      }
    }
  };

  // 1. FEEDBACK VISUAL: Mientras se verifica la sesión técnica
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 bg-[#121926]/90 p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-black/80 max-w-sm w-full text-center backdrop-blur-xl">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-3 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-black tracking-wide text-white">
              Cargando taller...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verificando credenciales de acceso técnico en Neyvix Tech
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. CONTROL DE ACCESO: Si NO hay usuario autenticado -> Mostrar pantalla de Login de taller
  if (!user) {
    return <WorkshopLogin onBackToSite={onBackToSite} />;
  }

  // 3. USUARIO AUTENTICADO -> Mostrar Panel de Gestión de Taller
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Barra de Navegación del Taller */}
      <WorkshopHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewOrder={() => {
          setEditingOrder(null);
          setIsReceptionOpen(true);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onBackToSite={onBackToSite}
        orderCounts={{
          total: safeOrders.length,
          ready: safeOrders.filter((o) => o?.status === 'listo').length,
        }}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Métricas Principales en Tarjetas */}
        <DashboardMetrics
          orders={safeOrders}
          onFilterStatus={(st) => {
            setFilterStatus(st);
            setActiveTab('pipeline');
          }}
        />

        {/* Pipeline & Lista de Órdenes */}
        {activeTab === 'pipeline' && (
          <OrdersPipeline
            orders={safeOrders}
            onEditOrder={(order) => {
              setEditingOrder(order);
              setIsReceptionOpen(true);
            }}
            onOpenReceipt={(order) => setReceiptOrder(order)}
            onUpdateStatus={handleUpdateStatus}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}
      </main>

      {/* MODAL: Recepción / Edición de Orden Dinámica */}
      <OrderReceptionModal
        isOpen={isReceptionOpen}
        onClose={() => {
          setIsReceptionOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
        existingOrder={editingOrder}
        allOrders={safeOrders}
      />

      {/* MODAL: Comprobante Imprimible & PDF */}
      <ReceiptModal
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
        order={receiptOrder}
      />

      {/* MODAL: Mi Perfil Técnico */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
