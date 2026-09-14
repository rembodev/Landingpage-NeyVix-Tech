import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  HardDrive,
  Disc,
  Activity,
  DollarSign,
  User,
  Wrench,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getNextOrderCode } from '../../lib/supabaseClient';

export default function OrderReceptionModal({
  isOpen,
  onClose,
  onSave,
  existingOrder = null,
  allOrders = [],
}) {
  const { user } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    order_code: '',
    customer_name: '',
    customer_phone: '',
    customer_doc: '',
    device_type: 'Laptop',
    device_brand: '',
    device_model: '',
    device_serial: '',
    accessories: [],
    visual_inspection: {
      screen: 'Sin rayones',
      hinges: 'En buen estado',
      chassis: 'Completa',
      battery: 'Operativa',
      power: 'Enciende',
    },
    reported_issue: '',
    services_selected: [],
    services_data: {
      thermal: {
        disassembly: false,
        fans_cleaning: false,
        thermal_paste_applied: false,
        paste_brand: 'Arctic MX-4',
        initial_temp_cpu: '',
        final_temp_cpu: '',
        initial_temp_gpu: '',
        final_temp_gpu: '',
      },
      hardware: {
        ssd_installed: false,
        ssd_type: 'M.2 NVMe PCIe',
        ssd_capacity: '512GB',
        crystal_health_percent: 100,
        crystal_status: 'Bueno',
        ram_expanded: false,
        ram_installed_gb: '8GB',
        ram_frequency: '3200MHz',
        ram_brand: '',
      },
      software: {
        os_installed: 'Windows 11 Pro (64 bits)',
        drivers_updated: true,
        basic_utilities: true,
        office_suite: true,
        boot_optimization: true,
      },
      electronica: {
        board_diagnosis: '',
        components_replaced: '',
        notes: '',
      },
    },
    qa_checklist: {
      wifi_bt: false,
      keyboard: false,
      audio_mic: false,
      webcam: false,
      cleaning: false,
    },
    total_cost: 0,
    advance_payment: 0,
    warranty_period: '30 días',
    status: 'diagnostico',
    technician_name: '',
    internal_notes: '',
  });

  const [activeAccordions, setActiveAccordions] = useState({
    thermal: false,
    hardware: false,
    software: false,
    electronica: false,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sincronizar cuando se abre con una orden existente o nueva
  useEffect(() => {
    if (!isOpen) return;

    if (existingOrder) {
      setFormData({
        ...existingOrder,
        accessories: existingOrder.accessories || [],
        visual_inspection: existingOrder.visual_inspection || {},
        services_selected: existingOrder.services_selected || [],
        services_data: {
          thermal: { ...existingOrder.services_data?.thermal },
          hardware: { ...existingOrder.services_data?.hardware },
          software: { ...existingOrder.services_data?.software },
          electronica: { ...existingOrder.services_data?.electronica },
          internal_notes: existingOrder.services_data?.internal_notes || existingOrder.internal_notes || '',
        },
        qa_checklist: existingOrder.qa_checklist || {},
      });

      // Abrir acordiones si esos servicios están seleccionados
      const sel = existingOrder.services_selected || [];
      setActiveAccordions({
        thermal: sel.includes('mantenimiento'),
        hardware: sel.includes('repotenciacion'),
        software: sel.includes('formateo'),
        electronica: sel.includes('electronica'),
      });
    } else {
      // Nueva Orden: Asignar correlativo NVX-XXX
      const nextCode = getNextOrderCode(allOrders);
      setFormData({
        order_code: nextCode,
        customer_name: '',
        customer_phone: '',
        customer_doc: '',
        device_type: 'Laptop',
        device_brand: '',
        device_model: '',
        device_serial: '',
        accessories: ['Cargador original'],
        visual_inspection: {
          screen: 'Sin rayones',
          hinges: 'En buen estado',
          chassis: 'Completa',
          battery: 'Operativa',
          power: 'Enciende',
        },
        reported_issue: '',
        services_selected: ['mantenimiento'],
        services_data: {
          thermal: {
            disassembly: true,
            fans_cleaning: true,
            thermal_paste_applied: true,
            paste_brand: 'Arctic MX-4',
            initial_temp_cpu: '',
            final_temp_cpu: '',
            initial_temp_gpu: '',
            final_temp_gpu: '',
          },
          hardware: {
            ssd_installed: false,
            ssd_type: 'M.2 NVMe PCIe',
            ssd_capacity: '512GB',
            crystal_health_percent: 100,
            crystal_status: 'Bueno',
            ram_expanded: false,
            ram_installed_gb: '8GB',
            ram_frequency: '3200MHz',
            ram_brand: '',
          },
          software: {
            os_installed: 'Windows 11 Pro (64 bits)',
            drivers_updated: true,
            basic_utilities: true,
            office_suite: true,
            boot_optimization: true,
          },
          electronica: {
            board_diagnosis: '',
            components_replaced: '',
            notes: '',
          },
        },
        qa_checklist: {
          wifi_bt: false,
          keyboard: false,
          audio_mic: false,
          webcam: false,
          cleaning: false,
        },
        total_cost: 80,
        advance_payment: 0,
        warranty_period: '30 días',
        status: 'diagnostico',
        technician_name: user?.full_name || user?.email || 'Técnico Neyvix',
        internal_notes: '',
      });

      setActiveAccordions({
        thermal: true,
        hardware: false,
        software: false,
        electronica: false,
      });
    }
  }, [isOpen, existingOrder, user?.full_name, user?.email]);

  if (!isOpen) return null;

  // Manejo de Accesorios checkboxes
  const toggleAccessory = (item) => {
    const current = formData.accessories || [];
    if (current.includes(item)) {
      setFormData({ ...formData, accessories: current.filter((x) => x !== item) });
    } else {
      if (item === 'Sin accesorios') {
        setFormData({ ...formData, accessories: ['Sin accesorios'] });
      } else {
        setFormData({
          ...formData,
          accessories: [...current.filter((x) => x !== 'Sin accesorios'), item],
        });
      }
    }
  };

  // Manejo de Selección de Servicios (Acordeón Dinámico)
  const toggleService = (serviceKey, accordionName) => {
    const current = formData.services_selected || [];
    const isSelected = current.includes(serviceKey);
    const updated = isSelected ? current.filter((s) => s !== serviceKey) : [...current, serviceKey];

    setFormData({ ...formData, services_selected: updated });
    setActiveAccordions({
      ...activeAccordions,
      [accordionName]: !isSelected,
    });
  };

  // Saldo calculado en vivo
  const calculatedBalance = Math.max(0, Number(formData.total_cost || 0) - Number(formData.advance_payment || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim()) {
      setErrorMsg('Por favor ingrese el nombre del cliente');
      return;
    }
    if (!formData.customer_phone.trim()) {
      setErrorMsg('Por favor ingrese el número de WhatsApp del cliente');
      return;
    }
    if (!formData.device_brand.trim() || !formData.device_model.trim()) {
      setErrorMsg('Ingrese la marca y el modelo del equipo');
      return;
    }
    if (!formData.reported_issue.trim()) {
      setErrorMsg('Especifique la falla reportada por el cliente');
      return;
    }

    setSaving(true);
    try {
      const res = await onSave({
        ...formData,
        balance_payment: calculatedBalance,
      });
      if (res !== null && res !== false) {
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar la orden de trabajo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121926] border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F17]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {existingOrder ? `Editar Orden ${formData.order_code}` : 'Nueva Recepción Técnica'}
                </h3>
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {formData.order_code}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Taller Especializado Neyvix Tech • Chiclayo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable del Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ==================================================================== */}
          {/* BLOQUE A: CLIENTE & EQUIPO (Siempre visible) */}
          {/* ==================================================================== */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <User className="w-4 h-4" />
                <span>Datos del Cliente & Equipo</span>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">* Campos obligatorios</span>
            </div>

            {/* Fila Cliente: Nombre, WhatsApp (+51), DNI/RUC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Nombre Completo del Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Ej: Marco Antonio Díaz"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  WhatsApp (Chiclayo / Perú) *
                </label>
                <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-950 focus-within:border-cyan-400">
                  <span className="px-2.5 py-2 text-xs font-bold text-cyan-400 bg-slate-900 border-r border-slate-700 flex items-center">
                    +51
                  </span>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="929443131"
                    className="w-full px-3 py-2 bg-transparent text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  DNI o RUC (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.customer_doc}
                  onChange={(e) => setFormData({ ...formData, customer_doc: e.target.value })}
                  placeholder="Ej: 72458912"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Fila Equipo: Tipo, Marca, Modelo, S/N */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Tipo de Equipo
                </label>
                <select
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Laptop">Laptop / Portátil</option>
                  <option value="PC Escritorio">PC Escritorio / Torre</option>
                  <option value="Todo en Uno">Todo en Uno (AIO)</option>
                  <option value="Otro">Otro Dispositivo</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Marca *
                </label>
                <input
                  type="text"
                  required
                  value={formData.device_brand}
                  onChange={(e) => setFormData({ ...formData, device_brand: e.target.value })}
                  placeholder="Lenovo, Asus, HP, Dell..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Modelo Exacto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.device_model}
                  onChange={(e) => setFormData({ ...formData, device_model: e.target.value })}
                  placeholder="Ej: Legion 5 / Pavilion 15"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Número de Serie (S/N)
                </label>
                <input
                  type="text"
                  value={formData.device_serial}
                  onChange={(e) => setFormData({ ...formData, device_serial: e.target.value })}
                  placeholder="PF2X9L0M"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Accesorios Recibidos (Checkboxes Rápidos) */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Accesorios Recibidos en Taller:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Cargador original', 'Mochila / Funda', 'Mouse', 'Cable de poder', 'Sin accesorios'].map(
                  (acc) => {
                    const isChecked = (formData.accessories || []).includes(acc);
                    return (
                      <button
                        type="button"
                        key={acc}
                        onClick={() => toggleAccessory(acc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                          isChecked
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-sm flex items-center justify-center border text-[9px] ${
                          isChecked ? 'bg-cyan-400 text-black border-cyan-400' : 'border-slate-600'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span>{acc}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Inspección Visual Previa (Respaldo técnico) */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Inspección Visual Previa (Check de Respaldo):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {/* Pantalla */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Pantalla</span>
                  <select
                    value={formData.visual_inspection?.screen || 'Sin rayones'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visual_inspection: { ...formData.visual_inspection, screen: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-white p-1"
                  >
                    <option value="Sin rayones">Sin rayones</option>
                    <option value="Con marcas leves">Con marcas leves</option>
                    <option value="Rayada / Fisurada">Rayada / Fisurada</option>
                    <option value="No aplica">No aplica (PC)</option>
                  </select>
                </div>

                {/* Bisagras */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Bisagras</span>
                  <select
                    value={formData.visual_inspection?.hinges || 'En buen estado'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visual_inspection: { ...formData.visual_inspection, hinges: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-white p-1"
                  >
                    <option value="En buen estado">En buen estado</option>
                    <option value="Flojas">Flojas</option>
                    <option value="Rotas / Forzadas">Rotas / Forzadas</option>
                    <option value="No aplica">No aplica</option>
                  </select>
                </div>

                {/* Carcasa */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Carcasa / Tornillos</span>
                  <select
                    value={formData.visual_inspection?.chassis || 'Completa'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visual_inspection: { ...formData.visual_inspection, chassis: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-white p-1"
                  >
                    <option value="Completa">Completa</option>
                    <option value="Faltan tornillos">Faltan tornillos</option>
                    <option value="Daño estético / Rajada">Daño estético / Rajada</option>
                  </select>
                </div>

                {/* Batería */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Batería</span>
                  <select
                    value={formData.visual_inspection?.battery || 'Operativa'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visual_inspection: { ...formData.visual_inspection, battery: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-white p-1"
                  >
                    <option value="Operativa">Operativa</option>
                    <option value="Agotada / No retiene">Agotada / No retiene</option>
                    <option value="Hinchada / Riesgo">Hinchada / Riesgo</option>
                    <option value="No aplica">No aplica</option>
                  </select>
                </div>

                {/* Enciende */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Encendido</span>
                  <select
                    value={formData.visual_inspection?.power || 'Enciende'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visual_inspection: { ...formData.visual_inspection, power: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-white p-1"
                  >
                    <option value="Enciende">Enciende y da video</option>
                    <option value="Enciende sin video">Enciende sin video</option>
                    <option value="No enciende">No enciende / Muerto</option>
                    <option value="Se apaga solo">Se apaga tras minutos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Falla Reportada por el Cliente */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Falla Reportada por el Cliente *
              </label>
              <textarea
                required
                rows={2}
                value={formData.reported_issue}
                onChange={(e) => setFormData({ ...formData, reported_issue: e.target.value })}
                placeholder="Describa con exactitud lo manifestado por el cliente..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* ==================================================================== */}
          {/* BLOQUE B: SELECTOR DINÁMICO DE SERVICIOS (Acordeones condicionales) */}
          {/* ==================================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Selector Dinámico de Servicios de Taller
              </span>
              <span className="text-[11px] text-slate-500">
                (Marque las casillas para desplegar cada bloque técnico)
              </span>
            </div>

            {/* 1. MANTENIMIENTO PREVENTIVO & TÉRMICO */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div
                onClick={() => toggleService('mantenimiento', 'thermal')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(formData.services_selected || []).includes('mantenimiento')}
                    onChange={() => {}} // handled by parent onClick
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      1. Mantenimiento Preventivo & Optimización Térmica
                    </span>
                  </div>
                </div>
                {activeAccordions.thermal ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {activeAccordions.thermal && (
                <div className="p-4 pt-0 border-t border-slate-800/60 bg-slate-950/40 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services_data.thermal.disassembly}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              thermal: { ...formData.services_data.thermal, disassembly: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span className="text-slate-300 font-medium">Desarme seguro & desconexión batería</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services_data.thermal.fans_cleaning}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              thermal: { ...formData.services_data.thermal, fans_cleaning: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span className="text-slate-300 font-medium">Limpieza de ventiladores y disipador</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services_data.thermal.thermal_paste_applied}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              thermal: { ...formData.services_data.thermal, thermal_paste_applied: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span className="text-slate-300 font-medium">Pasta térmica alto rendimiento</span>
                    </label>
                  </div>

                  {/* Telemetría Térmica: Inicial vs Final */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Temp Inicial CPU (°C)</span>
                      <input
                        type="number"
                        placeholder="Ej: 94"
                        value={formData.services_data.thermal.initial_temp_cpu}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              thermal: { ...formData.services_data.thermal, initial_temp_cpu: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold block mb-1">Temp Final CPU (°C)</span>
                      <input
                        type="number"
                        placeholder="Ej: 65"
                        value={formData.services_data.thermal.final_temp_cpu}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              thermal: { ...formData.services_data.thermal, final_temp_cpu: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-300 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Temp Inicial GPU (°C)</span>
                      <input
                        type="number"
                        placeholder="Ej: 86"
                        value={formData.services_data.thermal.initial_temp_gpu}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              thermal: { ...formData.services_data.thermal, initial_temp_gpu: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold block mb-1">Temp Final GPU (°C)</span>
                      <input
                        type="number"
                        placeholder="Ej: 60"
                        value={formData.services_data.thermal.final_temp_gpu}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              thermal: { ...formData.services_data.thermal, final_temp_gpu: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. REPOTENCIACIÓN DE HARDWARE (SSD / RAM) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div
                onClick={() => toggleService('repotenciacion', 'hardware')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(formData.services_selected || []).includes('repotenciacion')}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      2. Repotenciación de Hardware (Unidad SSD / Memoria RAM)
                    </span>
                  </div>
                </div>
                {activeAccordions.hardware ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {activeAccordions.hardware && (
                <div className="p-4 pt-0 border-t border-slate-800/60 bg-slate-950/40 space-y-4 text-xs">
                  {/* Bloque SSD */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={formData.services_data.hardware.ssd_installed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              hardware: { ...formData.services_data.hardware, ssd_installed: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span>Instalación de Unidad de Estado Sólido (SSD)</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Tipo de SSD</span>
                        <select
                          value={formData.services_data.hardware.ssd_type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services_data: {
                                ...formData.services_data,
                                hardware: { ...formData.services_data.hardware, ssd_type: e.target.value },
                              },
                            })
                          }
                          className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        >
                          <option value="M.2 NVMe PCIe">M.2 NVMe PCIe</option>
                          <option value="SATA 2.5 pulg">SATA 2.5"</option>
                          <option value="M.2 SATA">M.2 SATA</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Capacidad</span>
                        <select
                          value={formData.services_data.hardware.ssd_capacity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services_data: {
                                ...formData.services_data,
                                hardware: { ...formData.services_data.hardware, ssd_capacity: e.target.value },
                              },
                            })
                          }
                          className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        >
                          <option value="256GB">256GB</option>
                          <option value="512GB">512GB</option>
                          <option value="1TB">1TB (1000GB)</option>
                          <option value="2TB">2TB</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Salud CrystalDiskInfo (%)</span>
                        <input
                          type="number"
                          value={formData.services_data.hardware.crystal_health_percent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services_data: {
                                ...formData.services_data,
                                hardware: {
                                  ...formData.services_data.hardware,
                                  crystal_health_percent: Number(e.target.value),
                                },
                              },
                            })
                          }
                          className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Estado CrystalDisk</span>
                        <select
                          value={formData.services_data.hardware.crystal_status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services_data: {
                                ...formData.services_data,
                                hardware: { ...formData.services_data.hardware, crystal_status: e.target.value },
                              },
                            })
                          }
                          className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        >
                          <option value="Bueno">Bueno (100%)</option>
                          <option value="Riesgo">En Riesgo (Sectores)</option>
                          <option value="Malo">Malo / Dañado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bloque RAM */}
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={formData.services_data.hardware.ram_expanded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              hardware: { ...formData.services_data.hardware, ram_expanded: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span>Ampliación de Memoria RAM</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Capacidad Agregada</span>
                        <select
                          value={formData.services_data.hardware.ram_installed_gb}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services_data: {
                                ...formData.services_data,
                                hardware: { ...formData.services_data.hardware, ram_installed_gb: e.target.value },
                              },
                            })
                          }
                          className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        >
                          <option value="8GB">8GB DDR4/DDR5</option>
                          <option value="16GB">16GB DDR4/DDR5</option>
                          <option value="32GB">32GB Dual Channel</option>
                          <option value="4GB">4GB</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Frecuencia (MHz)</span>
                        <input
                          type="text"
                          placeholder="Ej: 3200MHz / 4800MHz"
                          value={formData.services_data.hardware.ram_frequency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services_data: {
                                ...formData.services_data,
                                hardware: { ...formData.services_data.hardware, ram_frequency: e.target.value },
                              },
                            })
                          }
                          className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Marca de Memoria</span>
                        <input
                          type="text"
                          placeholder="Crucial, Kingston, Corsair..."
                          value={formData.services_data.hardware.ram_brand}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services_data: {
                                ...formData.services_data,
                                hardware: { ...formData.services_data.hardware, ram_brand: e.target.value },
                              },
                            })
                          }
                          className="w-full p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. FORMATEO & SOFTWARE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div
                onClick={() => toggleService('formateo', 'software')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(formData.services_selected || []).includes('formateo')}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <Disc className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      3. Formateo Limpio & Optimización de Software
                    </span>
                  </div>
                </div>
                {activeAccordions.software ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {activeAccordions.software && (
                <div className="p-4 pt-0 border-t border-slate-800/60 bg-slate-950/40 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-300 block mb-1">
                      Sistema Operativo Instalado
                    </span>
                    <select
                      value={formData.services_data.software.os_installed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          services_data: {
                            ...formData.services_data,
                            software: { ...formData.services_data.software, os_installed: e.target.value },
                          },
                        })
                      }
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
                    >
                      <option value="Windows 11 Pro (64 bits)">Windows 11 Pro (64 bits - Oficial)</option>
                      <option value="Windows 10 Pro (64 bits)">Windows 10 Pro (64 bits - Oficial)</option>
                      <option value="Windows 11 Home">Windows 11 Home</option>
                      <option value="Linux / Dual Boot">Linux / Dual Boot</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services_data.software.drivers_updated}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              software: { ...formData.services_data.software, drivers_updated: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span className="text-[11px] text-slate-300">Drivers oficiales</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services_data.software.basic_utilities}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              software: { ...formData.services_data.software, basic_utilities: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span className="text-[11px] text-slate-300">Navegador y utilitarios</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services_data.software.office_suite}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              software: { ...formData.services_data.software, office_suite: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span className="text-[11px] text-slate-300">Suite de Oficina</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services_data.software.boot_optimization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            services_data: {
                              ...formData.services_data,
                              software: { ...formData.services_data.software, boot_optimization: e.target.checked },
                            },
                          })
                        }
                        className="rounded text-cyan-400"
                      />
                      <span className="text-[11px] text-slate-300">Optimización inicio</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 4. DIAGNÓSTICO ELECTRÓNICO & REPARACIÓN ESPECIAL */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div
                onClick={() => toggleService('electronica', 'electronica')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(formData.services_selected || []).includes('electronica')}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      4. Diagnóstico Electrónico & Reparación Especial
                    </span>
                  </div>
                </div>
                {activeAccordions.electronica ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {activeAccordions.electronica && (
                <div className="p-4 pt-0 border-t border-slate-800/60 bg-slate-950/40 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-300 block mb-1">
                      Diagnóstico de Placa Madre / Líneas de Voltaje
                    </span>
                    <textarea
                      rows={2}
                      value={formData.services_data.electronica.board_diagnosis}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          services_data: {
                            ...formData.services_data,
                            electronica: { ...formData.services_data.electronica, board_diagnosis: e.target.value },
                          },
                        })
                      }
                      placeholder="Ej: Cortocircuito en carril de 19V / Mosfet en fuga / Reprogramación de BIOS SPI..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-300 block mb-1">
                      Componentes Electrónicos Reemplazados
                    </span>
                    <input
                      type="text"
                      value={formData.services_data.electronica.components_replaced}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          services_data: {
                            ...formData.services_data,
                            electronica: { ...formData.services_data.electronica, components_replaced: e.target.value },
                          },
                        })
                      }
                      placeholder="Ej: Mosfet 7410 N-Channel, Fusible SMD 10A, Capacitor de tantalio..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================================== */}
          {/* BLOQUE C: CONTROL DE CALIDAD FINAL (QA Checklist antes de entregar) */}
          {/* ==================================================================== */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Control de Calidad Final (QA Checklist)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Pruebas obligatorias previas a entrega
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { key: 'wifi_bt', label: 'Wi-Fi / Bluetooth' },
                { key: 'keyboard', label: 'Teclado Completo' },
                { key: 'audio_mic', label: 'Audio & Micrófono' },
                { key: 'webcam', label: 'Cámara Web' },
                { key: 'cleaning', label: 'Limpieza Externa' },
              ].map((qa) => {
                const checked = !!formData.qa_checklist?.[qa.key];
                return (
                  <button
                    type="button"
                    key={qa.key}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        qa_checklist: {
                          ...formData.qa_checklist,
                          [qa.key]: !checked,
                        },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-center font-semibold transition cursor-pointer flex flex-col items-center gap-1 ${
                      checked
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      checked ? 'bg-emerald-400 text-black font-bold' : 'border border-slate-600'
                    }`}>
                      {checked ? '✓' : ''}
                    </span>
                    <span className="text-[11px]">{qa.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================================================================== */}
          {/* BLOQUE D: DATOS ECONÓMICOS Y GARANTÍA */}
          {/* ==================================================================== */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <DollarSign className="w-4 h-4" />
              <span>Datos Económicos, Liquidación & Garantía</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Costo Total del Servicio (S/)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={formData.total_cost}
                  onChange={(e) => setFormData({ ...formData, total_cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Adelanto / Pago a Cuenta (S/)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={formData.advance_payment}
                  onChange={(e) => setFormData({ ...formData, advance_payment: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-sm focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Saldo Pendiente (S/)
                </label>
                <div className={`px-3 py-2 rounded-xl font-bold text-sm border flex items-center justify-between ${
                  calculatedBalance > 0
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                }`}>
                  <span>S/</span>
                  <span>{calculatedBalance.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Tiempo de Garantía
                </label>
                <select
                  value={formData.warranty_period}
                  onChange={(e) => setFormData({ ...formData, warranty_period: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:border-cyan-400"
                >
                  <option value="30 días">30 días de garantía</option>
                  <option value="3 meses">3 meses de garantía</option>
                  <option value="6 meses">6 meses de garantía</option>
                  <option value="1 año">1 año de garantía</option>
                  <option value="Sin garantía">Sin garantía (Rep. externa)</option>
                </select>
              </div>
            </div>

            {/* Asignación y Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Estado Actual de la Orden
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:border-cyan-400 font-semibold"
                >
                  <option value="diagnostico">En Diagnóstico Inicial</option>
                  <option value="en_proceso">En Proceso (Taller)</option>
                  <option value="control_calidad">En Control de Calidad / Pruebas</option>
                  <option value="listo">Listo para Entrega</option>
                  <option value="entregado">Entregado y Cobrado</option>
                  <option value="cancelado">Cancelado / No Reparado</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Técnico Responsable Asignado
                </label>
                <input
                  type="text"
                  value={formData.technician_name}
                  onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })}
                  placeholder="Nombre del técnico responsable"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Observaciones & Notas Internas de Laboratorio (Guardadas en services_data.internal_notes) */}
            <div className="pt-2 border-t border-slate-800/60">
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Notas Internas / Observaciones del Taller (Opcional)
              </label>
              <textarea
                rows="2"
                value={formData.services_data?.internal_notes || formData.internal_notes || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    internal_notes: e.target.value,
                    services_data: {
                      ...formData.services_data,
                      internal_notes: e.target.value,
                    },
                  })
                }
                placeholder="Anotaciones confidenciales, pruebas previas, condiciones específicas del equipo..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 placeholder:text-slate-600 resize-none"
              />
            </div>
          </div>

          {/* Footer de Acciones del Formulario */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{existingOrder ? 'Actualizar Orden' : 'Guardar y Generar Orden'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
