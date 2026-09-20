import { createClient } from '@supabase/supabase-js';

// Intentar leer desde variables de entorno de Vite o desde localStorage (configurable en UI)
const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const envAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('neyvix_supabase_url') : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('neyvix_supabase_key') : '';

export const SUPABASE_URL = (storedUrl || envUrl || '').trim();
export const SUPABASE_ANON_KEY = (storedKey || envAnonKey || '').trim();

export const isSupabaseConfigured = () => {
  const url =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof window !== 'undefined' ? localStorage.getItem('neyvix_supabase_url') : '') ||
    '';
  const key =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof window !== 'undefined' ? localStorage.getItem('neyvix_supabase_key') : '') ||
    '';
  return url.trim().length > 10 && url.trim().startsWith('http') && key.trim().length > 15;
};

// Cliente Supabase instanciado si están las credenciales estáticas
export const supabase = (SUPABASE_URL.length > 10 && SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 15)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

let _dynamicClient = null;
export function getActiveSupabase() {
  if (supabase) return supabase;
  if (_dynamicClient) return _dynamicClient;

  const url =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof window !== 'undefined' ? localStorage.getItem('neyvix_supabase_url') : '') ||
    '';
  const key =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof window !== 'undefined' ? localStorage.getItem('neyvix_supabase_key') : '') ||
    '';

  if (url.trim().length > 10 && url.trim().startsWith('http') && key.trim().length > 15) {
    _dynamicClient = createClient(url.trim(), key.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return _dynamicClient;
  }
  return null;
}

// ==============================================================================
// DATOS SEMILLA INICIALES (MOCK STORE REACTIVO PARA FALLBACK LOCAL)
// ==============================================================================
export const INITIAL_ORDERS_SEED = [
  {
    id: 'ord-001',
    order_code: 'NVX-001',
    customer_name: 'Juan Pérez Calderón',
    customer_phone: '978123456',
    customer_doc: '72458912',
    device_type: 'Laptop',
    device_brand: 'Lenovo',
    device_model: 'Legion 5 15ACH6H',
    device_serial: 'PF2X9L0M',
    accessories: ['Cargador original 230W', 'Mochila Lenovo'],
    visual_inspection: {
      screen: 'Sin rayones',
      hinges: 'En buen estado',
      chassis: 'Completa',
      battery: 'Operativa',
      power: 'Enciende',
    },
    reported_issue: 'Equipo se sobrecalienta al jugar y se apaga de golpe a los 15 minutos.',
    services_selected: ['mantenimiento'],
    services_data: {
      thermal: {
        disassembly: true,
        fans_cleaning: true,
        thermal_paste_applied: true,
        paste_brand: 'Arctic MX-4',
        initial_temp_cpu: 96,
        final_temp_cpu: 68,
        initial_temp_gpu: 88,
        final_temp_gpu: 64,
      },
    },
    qa_checklist: {
      wifi_bt: true,
      keyboard: true,
      audio_mic: true,
      webcam: true,
      cleaning: true,
    },
    total_cost: 90.0,
    advance_payment: 50.0,
    balance_payment: 40.0,
    warranty_period: '30 días',
    status: 'listo',
    technician_name: 'Neyver Vásquez',
    technician_id: 'tech-001',
    created_at: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'ord-002',
    order_code: 'NVX-002',
    customer_name: 'Rosa Morales Sánchez',
    customer_phone: '956781234',
    customer_doc: '45127896',
    device_type: 'Laptop',
    device_brand: 'HP',
    device_model: 'Pavilion 15-dw1024la',
    device_serial: '5CD1298XX',
    accessories: ['Cargador original 45W'],
    visual_inspection: {
      screen: 'Con marcas leves',
      hinges: 'En buen estado',
      chassis: 'Falta 1 tornillo inferior',
      battery: 'Operativa',
      power: 'Enciende',
    },
    reported_issue: 'Muy lenta al encender y abrir Excel. Disco mecánico al 100%. Desea repotenciar y formatear.',
    services_selected: ['repotenciacion', 'formateo'],
    services_data: {
      hardware: {
        ssd_installed: true,
        ssd_type: 'M.2 NVMe PCIe',
        ssd_capacity: '512GB',
        crystal_health_percent: 100,
        crystal_status: 'Bueno',
        ram_expanded: true,
        ram_installed_gb: '8GB',
        ram_frequency: '3200MHz',
        ram_brand: 'Crucial',
      },
      software: {
        os_installed: 'Windows 11 Pro (64 bits)',
        drivers_updated: true,
        basic_utilities: true,
        office_suite: true,
        boot_optimization: true,
      },
    },
    qa_checklist: {
      wifi_bt: true,
      keyboard: true,
      audio_mic: true,
      webcam: true,
      cleaning: true,
    },
    total_cost: 220.0,
    advance_payment: 100.0,
    balance_payment: 120.0,
    warranty_period: '3 meses',
    status: 'en_proceso',
    technician_name: 'Carlos Mendoza',
    technician_id: 'tech-002',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'ord-003',
    order_code: 'NVX-003',
    customer_name: 'Estudio Contable Chiclayo SAC',
    customer_phone: '979456123',
    customer_doc: '20608976541',
    device_type: 'PC Escritorio',
    device_brand: 'Custom Tower',
    device_model: 'Core i7 10700K / B460',
    device_serial: 'SN-DESK-2023',
    accessories: ['Cable de poder'],
    visual_inspection: {
      screen: 'No aplica',
      hinges: 'No aplica',
      chassis: 'Buen estado con polvo',
      battery: 'No aplica',
      power: 'No enciende',
    },
    reported_issue: 'No da ninguna señal de vida tras tormenta eléctrica. Posible daño en fuente o motherboard.',
    services_selected: ['electronica'],
    services_data: {
      electronica: {
        board_diagnosis: 'Línea de 12V en corto circuito en sección VRM de la placa madre. Mosfet de entrada perforado.',
        components_replaced: 'Reemplazo de 2 Mosfets N-Channel de potencia en fase principal y fusible SMD.',
        notes: 'Prueba de banco estable por 4 horas con test de estrés Furmark y Prime95.',
      },
    },
    qa_checklist: {
      wifi_bt: true,
      keyboard: true,
      audio_mic: true,
      webcam: true,
      cleaning: true,
    },
    total_cost: 180.0,
    advance_payment: 0.0,
    balance_payment: 180.0,
    warranty_period: '3 meses',
    status: 'diagnostico',
    technician_name: 'Neyver Vásquez',
    technician_id: 'tech-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ord-004',
    order_code: 'NVX-004',
    customer_name: 'Dra. Patricia Alva',
    customer_phone: '942998877',
    customer_doc: '41223344',
    device_type: 'Laptop',
    device_brand: 'Dell',
    device_model: 'Inspiron 3501',
    device_serial: 'D3LL-8899',
    accessories: ['Cargador original Dell'],
    visual_inspection: {
      screen: 'Sin rayones',
      hinges: 'En buen estado',
      chassis: 'Completa',
      battery: 'Operativa',
      power: 'Enciende',
    },
    reported_issue: 'Mantenimiento preventivo anual y actualización de antivirus.',
    services_selected: ['mantenimiento', 'formateo'],
    services_data: {
      thermal: {
        disassembly: true,
        fans_cleaning: true,
        thermal_paste_applied: true,
        paste_brand: 'Arctic MX-4',
        initial_temp_cpu: 85,
        final_temp_cpu: 58,
      },
      software: {
        os_installed: 'Windows 11 Pro (64 bits)',
        drivers_updated: true,
        basic_utilities: true,
        office_suite: true,
        boot_optimization: true,
      },
    },
    qa_checklist: {
      wifi_bt: true,
      keyboard: true,
      audio_mic: true,
      webcam: true,
      cleaning: true,
    },
    total_cost: 120.0,
    advance_payment: 120.0,
    balance_payment: 0.0,
    warranty_period: '30 días',
    status: 'entregado',
    technician_name: 'Carlos Mendoza',
    technician_id: 'tech-002',
    created_at: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
  },
];

export const DEMO_TECHNICIANS = [
  {
    id: 'tech-001',
    email: 'admin@neyvixtech.com',
    full_name: 'Neyver Vásquez',
    role: 'admin',
    phone: '929443131',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'tech-002',
    email: 'tecnico@neyvixtech.com',
    full_name: 'Carlos Mendoza',
    role: 'technician',
    phone: '974112233',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

// ==============================================================================
// HELPERS DE SANITIZACIÓN Y VALIDACIÓN (POSTGRESQL / SUPABASE)
// ==============================================================================

export const isUuid = (val) =>
  typeof val === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

/**
 * Sanitizar y validar los tipos de datos del payload para que coincidan EXACTAMENTE con las columnas de work_orders en Supabase:
 * - order_code (string)
 * - customer_name (string)
 * - customer_phone (string)
 * - customer_doc (string)
 * - device_type (string)
 * - device_brand (string)
 * - device_model (string)
 * - device_serial (string)
 * - accessories (array JSON)
 * - visual_inspection (objeto JSON)
 * - reported_issue (string)
 * - services_selected (array JSON)
 * - services_data (objeto JSON, almacena también internal_notes)
 * - qa_checklist (objeto JSON)
 * - total_cost (número)
 * - advance_payment (número)
 * - warranty_period (string)
 * - status (string)
 * - technician_name (string)
 */
export function sanitizeOrderPayload(order) {
  const total = Number(order.total_cost) || 0;
  const advance = Number(order.advance_payment) || 0;

  // Preparar services_data e incorporar internal_notes si existe en el formulario
  const rawServicesData =
    typeof order.services_data === 'object' && order.services_data !== null
      ? { ...order.services_data }
      : {};

  const internalNotesValue = order.internal_notes || rawServicesData.internal_notes || '';
  if (internalNotesValue && String(internalNotesValue).trim()) {
    rawServicesData.internal_notes = String(internalNotesValue).trim();
  }

  // Objeto EXACTO con únicamente las 19 columnas de la tabla work_orders en Supabase
  const payload = {
    order_code: order.order_code ? String(order.order_code).trim() : '',
    customer_name: (order.customer_name || '').trim(),
    customer_phone: (order.customer_phone || '').trim(),
    customer_doc: order.customer_doc ? String(order.customer_doc).trim() : '',
    device_type: order.device_type || 'Laptop',
    device_brand: (order.device_brand || '').trim(),
    device_model: (order.device_model || '').trim(),
    device_serial: order.device_serial ? String(order.device_serial).trim() : '',
    accessories: Array.isArray(order.accessories) ? order.accessories : [],
    visual_inspection:
      typeof order.visual_inspection === 'object' && order.visual_inspection !== null
        ? order.visual_inspection
        : {},
    reported_issue: (order.reported_issue || '').trim(),
    services_selected: Array.isArray(order.services_selected) ? order.services_selected : [],
    services_data: rawServicesData,
    qa_checklist:
      typeof order.qa_checklist === 'object' && order.qa_checklist !== null
        ? order.qa_checklist
        : {},
    total_cost: total,
    advance_payment: advance,
    warranty_period: order.warranty_period || '30 días',
    status: order.status || 'diagnostico',
    technician_name: order.technician_name ? String(order.technician_name).trim() : 'Técnico Neyvix',
  };

  return payload;
}

// ==============================================================================
// HELPERS DE ALMACENAMIENTO HÍBRIDO (SUPABASE / LOCAL STORAGE)
// ==============================================================================

/**
 * Obtener órdenes de trabajo centralizado
 */
export async function getWorkOrders() {
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

        try {
          localStorage.setItem('neyvix_work_orders', JSON.stringify(normalized));
        } catch {}

        return normalized;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage', e);
    }
  }

  return getLocalOrders();
}

/**
 * Guardar o actualizar una orden de trabajo con validación explícita
 */
export async function saveWorkOrder(order) {
  const isNew = !order?.id || String(order.id).startsWith('temp_') || String(order.id).startsWith('ord-');
  const payload = sanitizeOrderPayload(order);
  if (!payload.order_code) {
    payload.order_code = getNextOrderCode(getLocalOrders());
  }

  const total = Number(order.total_cost || 0);
  const advance = Number(order.advance_payment || 0);
  const calculatedBalance = Math.max(0, total - advance);

  if (isSupabaseConfigured() && supabase) {
    if (isNew) {
      const { data, error } = await supabase
        .from('work_orders')
        .insert([payload])
        .select();

      if (error) {
        console.error("Error al guardar en Supabase:", error.message, error.details);
        alert("Error al guardar la orden: " + error.message);
        throw error;
      }

      if (data && data.length > 0) {
        const saved = {
          ...data[0],
          balance_payment: Number(data[0].balance_payment ?? calculatedBalance),
        };
        syncLocalOrder(saved);
        return saved;
      }
    } else {
      const { data, error } = await supabase
        .from('work_orders')
        .update(payload)
        .eq('id', order.id)
        .select();

      if (error) {
        console.error("Error al actualizar en Supabase:", error.message, error.details);
        alert("Error al actualizar la orden: " + error.message);
        throw error;
      }

      if (data && data.length > 0) {
        const saved = {
          ...data[0],
          balance_payment: Number(data[0].balance_payment ?? calculatedBalance),
        };
        syncLocalOrder(saved);
        return saved;
      }
    }
  }

  // Fallback a localStorage
  const fallbackId = isNew ? 'ord-' + Date.now() : order.id;
  const localOrder = {
    ...payload,
    id: fallbackId,
    order_code: payload.order_code || getNextOrderCode(getLocalOrders()),
    balance_payment: calculatedBalance,
    created_at: isNew ? new Date().toISOString() : order.created_at || new Date().toISOString(),
  };

  syncLocalOrder(localOrder);
  return localOrder;
}

export function syncLocalOrder(order) {
  if (typeof window === 'undefined') return;
  const current = getLocalOrders();
  const index = current.findIndex((o) => o?.id === order?.id || (order?.order_code && o?.order_code === order?.order_code));
  if (index >= 0) {
    current[index] = order;
  } else {
    current.unshift(order);
  }
  try {
    localStorage.setItem('neyvix_work_orders', JSON.stringify(current));
  } catch {
    // ignore
  }
}

export function getLocalOrders() {
  if (typeof window === 'undefined') return INITIAL_ORDERS_SEED || [];
  const raw = localStorage.getItem('neyvix_work_orders');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return INITIAL_ORDERS_SEED || [];
    }
  }
  return INITIAL_ORDERS_SEED || [];
}

/**
 * Eliminar una orden de trabajo
 */
export async function deleteWorkOrder(orderId) {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('work_orders').delete().eq('id', orderId);
    } catch (e) {
      console.warn('Supabase delete error', e);
    }
  }

  if (typeof window !== 'undefined') {
    const current = getLocalOrders().filter((o) => o?.id !== orderId);
    try {
      localStorage.setItem('neyvix_work_orders', JSON.stringify(current));
    } catch {
      // ignore
    }
  }
  return true;
}

/**
 * Actualizar únicamente el estado de una orden de trabajo (sin updated_at)
 */
export async function updateOrderStatus(orderId, newStatus) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('work_orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error al actualizar estado:', error.message);
      alert('Error al actualizar estado: ' + error.message);
      return { success: false, error };
    }

    if (data && data[0]) {
      syncLocalOrder(data[0]);
    }
    return { success: true, data: data?.[0] };
  }

  // Fallback local
  const orders = getLocalOrders();
  const target = orders.find((o) => o?.id === orderId);
  if (target) {
    const updated = { ...target, status: newStatus };
    syncLocalOrder(updated);
    return { success: true, data: updated };
  }
  return { success: false, error: new Error('Order not found') };
}

/**
 * Generar siguiente código correlativo de orden (NVX-XXX)
 */
export function getNextOrderCode(orders = []) {
  if (!orders || orders.length === 0) return 'NVX-001';
  const codes = orders
    .map((o) => {
      const match = (o.order_code || '').match(/NVX-(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n) && n > 0);

  const max = codes.length > 0 ? Math.max(...codes) : 0;
  const next = max + 1;
  return `NVX-${String(next).padStart(3, '0')}`;
}
