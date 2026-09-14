import React, { useRef } from 'react';
import { X, Printer, MessageCircle, ShieldCheck } from 'lucide-react';
import { openWhatsAppChat, WORKSHOP_PHONE, WORKSHOP_WEB } from '../../lib/whatsapp';

export default function ReceiptModal({ isOpen, onClose, order }) {
  const printRef = useRef(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  // 1. Cálculos de Pago y Saldos Dinámicos
  const total = Number(order.total_cost || 0);
  const advance = Number(order.advance_payment || 0);
  const saldo = Math.max(0, total - advance);
  const isFullyPaid = saldo <= 0 && total > 0;

  // 2. Lógica Dinámica de Garantía según el Servicio
  const hasHardware =
    (order.services_selected || []).includes('repotenciacion') ||
    (order.services_selected || []).includes('electronica') ||
    Boolean(order.services_data?.hardware?.ssd_installed) ||
    Boolean(order.services_data?.hardware?.ram_expanded) ||
    Boolean(order.services_data?.electronica?.components_replaced);

  const warrantyTitle = hasHardware
    ? `Garantía de Componentes: ${order.warranty_period || '6 meses'}`
    : `Garantía de Servicio: ${order.warranty_period || '30 días'}`;

  const warrantyBadge = hasHardware
    ? 'Cobertura sobre Componentes Físicos & Mano de Obra'
    : 'Cobertura sobre Soporte Técnico & Mano de Obra';

  const termsList = hasHardware
    ? [
        `1. COBERTURA DE COMPONENTES: La garantía cubre el funcionamiento de los componentes y repuestos nuevos instalados o reparados (${order.warranty_period || '6 meses'}) contra defectos de fabricación.`,
        '2. CONDICIONES DE ANULACIÓN: La garantía queda anulada si se detecta rotura de sellos de seguridad, manipulación por terceros, caídas, golpes, derrame de líquidos o daños por sobretensión de la red eléctrica.',
        '3. CUSTODIA Y RETIRO: Pasados 30 días calendario de notificada la entrega, el equipo incurrirá en costos de custodia técnica de S/ 2.00 diarios conforme a ley.',
      ]
    : [
        `1. COBERTURA DE SERVICIO: La garantía cubre el mantenimiento preventivo térmico y/o configuración limpia de software por el período de ${order.warranty_period || '30 días'}.`,
        '2. EXCLUSIONES DE SOFTWARE: La garantía no cubre infecciones posteriores por virus/malware, alteración del sistema operativo por terceros ni fallas físicas preexistentes de hardware no intervenido.',
        '3. CUSTODIA Y RETIRO: Pasados 30 días calendario de notificada la entrega, el equipo incurrirá en costos de custodia técnica de S/ 2.00 diarios conforme a ley.',
      ];

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('es-PE');

  const internalNotes = order.services_data?.internal_notes || order.internal_notes;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-transparent print:static print:block print:overflow-visible">
      <div className="bg-[#121926] border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none print:bg-transparent print:text-black print:overflow-visible print:max-h-none print:block print:static">
        {/* Barra superior de controles (Oculta al imprimir) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-[#0B0F17] shrink-0 print:hidden no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">Comprobante de Orden Técnica</span>
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {order.order_code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openWhatsAppChat(order)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enviar WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* COMPROBANTE FÍSICO / VISTA IMPRIMIBLE (A4 VERTICAL COMPLETO) */}
        {/* ==================================================================== */}
        <div
          ref={printRef}
          id="comprobante-imprimible"
          className="flex-1 overflow-y-auto p-4 sm:p-5 bg-white text-slate-900 print:p-0 print:overflow-hidden print:text-black flex flex-col justify-between"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div>
            {/* Header con Logo y Datos de la Empresa (Espaciado compacto) */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shadow-xs shrink-0 bg-white">
                  <img
                    src="/logo.webp"
                    alt="Neyvix Tech Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-wider text-slate-900 uppercase leading-none">
                    NEYVIX <span className="text-cyan-600">TECH</span>
                  </h1>
                  <p className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                    Servicio Técnico Especializado • Chiclayo, Perú
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2.5 text-[10px] text-slate-600 mt-0.5">
                    <span>📞 Tel: {WORKSHOP_PHONE}</span>
                    <span>🌐 {WORKSHOP_WEB}</span>
                    <span>📍 Chiclayo, Lambayeque</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-slate-900 text-white px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider mb-0.5">
                  ORDEN DE SERVICIO TÉCNICO
                </div>
                <div className="text-xl font-black text-cyan-700 tracking-wider leading-tight">
                  {order.order_code}
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">
                  Fecha: {formattedDate}
                </p>
                {order.technician_name && (
                  <p className="text-[10px] text-slate-600 font-medium">
                    Técnico: <span className="font-bold text-slate-800">{order.technician_name}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Ficha del Cliente y del Equipo */}
            <div className="grid grid-cols-2 gap-2.5 mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              {/* Cliente */}
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10.5px] border-b border-slate-200 pb-0.5 mb-1 flex items-center justify-between">
                  <span>Datos del Cliente</span>
                  <span className="text-[9.5px] text-slate-400 font-normal">Titular</span>
                </h3>
                <div className="space-y-0.5">
                  <p className="text-slate-800 text-[11px]">
                    <span className="font-bold text-slate-900">Cliente:</span> {order.customer_name}
                  </p>
                  <p className="text-slate-800 text-[11px]">
                    <span className="font-bold text-slate-900">WhatsApp / Teléfono:</span> +51 {order.customer_phone}
                  </p>
                  {order.customer_doc && (
                    <p className="text-slate-800 text-[11px]">
                      <span className="font-bold text-slate-900">DNI / RUC:</span> {order.customer_doc}
                    </p>
                  )}
                </div>
              </div>

              {/* Equipo */}
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[10.5px] border-b border-slate-200 pb-0.5 mb-1 flex items-center justify-between">
                  <span>Identificación del Dispositivo</span>
                  <span className="text-[9.5px] text-slate-400 font-normal">Revisión Taller</span>
                </h3>
                <div className="space-y-0.5">
                  <p className="text-slate-800 text-[11px]">
                    <span className="font-bold text-slate-900">Tipo de Equipo:</span> {order.device_type}
                  </p>
                  <p className="text-slate-800 text-[11px]">
                    <span className="font-bold text-slate-900">Marca & Modelo:</span> {order.device_brand} {order.device_model}
                  </p>
                  <p className="text-slate-800 text-[11px]">
                    <span className="font-bold text-slate-900">N° Serie (S/N):</span> {order.device_serial || 'No registrado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Accesorios e Inspección Física */}
            <div className="grid grid-cols-2 gap-2.5 mb-2 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                <span className="font-bold text-slate-900 block mb-0.5 text-[10.5px] uppercase tracking-wider text-slate-700">
                  Accesorios Recibidos en Recepción:
                </span>
                <p className="text-slate-800 text-[11px] leading-tight">
                  {order.accessories && order.accessories.length > 0
                    ? order.accessories.join(', ')
                    : 'Ninguno registrado'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                <span className="font-bold text-slate-900 block mb-0.5 text-[10.5px] uppercase tracking-wider text-slate-700">
                  Inspección Visual Previa del Dispositivo:
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10.5px] text-slate-700 leading-tight">
                  <span>• Pantalla: <strong className="text-slate-900">{order.visual_inspection?.screen || 'N/A'}</strong></span>
                  <span>• Bisagras: <strong className="text-slate-900">{order.visual_inspection?.hinges || 'N/A'}</strong></span>
                  <span>• Carcasa: <strong className="text-slate-900">{order.visual_inspection?.chassis || 'N/A'}</strong></span>
                  <span>• Batería: <strong className="text-slate-900">{order.visual_inspection?.battery || 'N/A'}</strong></span>
                </div>
              </div>
            </div>

            {/* Falla Reportada */}
            <div className="mb-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-0.5 uppercase tracking-wider text-[10px]">
                Falla y Motivo de Ingreso Reportado por el Cliente:
              </span>
              <p className="text-slate-800 text-[11px] leading-snug font-medium">
                {order.reported_issue}
              </p>
            </div>

            {/* Desglose de Trabajos Realizados */}
            <div className="mb-2 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-900 text-[10.5px] uppercase tracking-wider border-b border-slate-200 flex items-center justify-between">
                <span>Servicios Técnicos & Acciones de Taller Realizadas</span>
                <span className="text-[9.5px] text-cyan-700 font-extrabold uppercase">Laboratorio Neyvix Tech</span>
              </div>
              <div className="p-2.5 space-y-2 text-xs">
                {/* Mantenimiento Térmico */}
                {order.services_selected?.includes('mantenimiento') && (
                  <div className="border-b border-slate-100 pb-1.5">
                    <p className="font-bold text-slate-900 text-[11.5px] flex items-center gap-1.5">
                      <span className="text-cyan-600 font-bold">✓</span> Mantenimiento Preventivo Profundo & Optimización Térmica
                    </p>
                    <p className="text-slate-600 text-[10.5px] mt-0.5 leading-snug">
                      Desarme de seguridad, limpieza ultrasónica de ventiladores y disipador de cobre, y aplicación de pasta térmica ({order.services_data?.thermal?.paste_brand || 'Arctic MX-4'}).
                    </p>
                    {(order.services_data?.thermal?.initial_temp_cpu || order.services_data?.thermal?.final_temp_cpu) && (
                      <div className="flex flex-wrap gap-3 mt-1 font-mono text-[10.5px] text-slate-800 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                        <span>Temp Inicial: <strong>{order.services_data.thermal.initial_temp_cpu || '--'}°C CPU / {order.services_data.thermal.initial_temp_gpu || '--'}°C GPU</strong></span>
                        <span className="font-bold text-cyan-800">→ Temp Final: {order.services_data.thermal.final_temp_cpu || '--'}°C CPU / {order.services_data.thermal.final_temp_gpu || '--'}°C GPU</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Repotenciación Hardware */}
                {order.services_selected?.includes('repotenciacion') && (
                  <div className="border-b border-slate-100 pb-1.5">
                    <p className="font-bold text-slate-900 text-[11.5px] flex items-center gap-1.5">
                      <span className="text-cyan-600 font-bold">✓</span> Repotenciación y Actualización de Hardware (SSD / RAM)
                    </p>
                    <div className="mt-0.5 space-y-0.5 text-[10.5px] text-slate-700">
                      {order.services_data?.hardware?.ssd_installed && (
                        <p>
                          • <strong className="text-slate-900">Almacenamiento SSD:</strong> {order.services_data.hardware.ssd_type} {order.services_data.hardware.ssd_capacity} (CrystalDisk: {order.services_data.hardware.crystal_health_percent}% - {order.services_data.hardware.crystal_status})
                        </p>
                      )}
                      {order.services_data?.hardware?.ram_expanded && (
                        <p>
                          • <strong className="text-slate-900">Memoria RAM:</strong> {order.services_data.hardware.ram_installed_gb} {order.services_data.hardware.ram_frequency} {order.services_data.hardware.ram_brand}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Formateo & Software */}
                {order.services_selected?.includes('formateo') && (
                  <div className="border-b border-slate-100 pb-1.5">
                    <p className="font-bold text-slate-900 text-[11.5px] flex items-center gap-1.5">
                      <span className="text-cyan-600 font-bold">✓</span> Formateo Limpio & Optimización de Software
                    </p>
                    <p className="text-slate-700 text-[10.5px] mt-0.5 leading-snug">
                      Sistema Operativo: <strong className="text-slate-900">{order.services_data?.software?.os_installed || 'Windows 11 Pro (64 bits)'}</strong> • Drivers actualizados • Paquetería utilitaria y optimización de arranque.
                    </p>
                  </div>
                )}

                {/* Diagnóstico Electrónico */}
                {order.services_selected?.includes('electronica') && (
                  <div className="border-b border-slate-100 pb-1.5">
                    <p className="font-bold text-slate-900 text-[11.5px] flex items-center gap-1.5">
                      <span className="text-cyan-600 font-bold">✓</span> Diagnóstico & Reparación Electrónica de Microcomponentes
                    </p>
                    <p className="text-slate-700 text-[10.5px] mt-0.5">
                      <strong className="text-slate-900">Diagnóstico:</strong> {order.services_data?.electronica?.board_diagnosis || 'Reparación de circuitos electrónicos de placa madre'}
                    </p>
                    {order.services_data?.electronica?.components_replaced && (
                      <p className="text-slate-700 text-[10.5px] mt-0.5 italic">
                        Reemplazados: <span className="font-medium text-slate-900">{order.services_data.electronica.components_replaced}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Observaciones técnicas si existen */}
                {internalNotes && (
                  <div>
                    <p className="text-[10.5px] font-bold text-slate-800">Observaciones Técnicas:</p>
                    <p className="text-slate-600 text-[10.5px] italic mt-0.5 leading-snug">{internalNotes}</p>
                  </div>
                )}

                {/* Si no marcó ninguno de los 4 */}
                {(!order.services_selected || order.services_selected.length === 0) && (
                  <p className="text-slate-600 italic text-[11px]">Revisión técnica de taller, diagnóstico y pruebas de funcionamiento.</p>
                )}
              </div>
            </div>

            {/* QA Checklist de Pruebas */}
            {order.qa_checklist && (
              <div className="mb-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1 uppercase tracking-wider text-[10px]">
                  Control de Calidad & Verificación Funcional (QA Checklist):
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {[
                    { key: 'wifi_bt', label: 'Wi-Fi / BT' },
                    { key: 'keyboard', label: 'Teclado' },
                    { key: 'audio_mic', label: 'Audio / Mic' },
                    { key: 'webcam', label: 'Cámara' },
                    { key: 'cleaning', label: 'Limpieza' },
                  ].map((item) => {
                    const isChecked = !!order.qa_checklist?.[item.key];
                    return (
                      <div
                        key={item.key}
                        className={`p-1 rounded-md border font-semibold flex items-center justify-center gap-1 ${
                          isChecked
                            ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <span className="font-black text-[11px]">{isChecked ? '✓' : '—'}</span>
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resumen Económico, Saldo y Garantía */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
              {/* LÓGICA CONDICIONAL DE PAGO */}
              {isFullyPaid ? (
                <div className="border-2 border-emerald-600 rounded-xl p-2.5 bg-emerald-50/80 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 block leading-tight">
                        ESTADO DE PAGO: TOTALMENTE CANCELADO
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Servicio cancelado al 100% • Sin saldo pendiente
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-emerald-200 pt-1.5 flex justify-between items-baseline">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase">Total Pagado:</span>
                    <span className="text-lg font-black text-emerald-800">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-300 rounded-xl p-2.5 bg-slate-50 flex flex-col justify-between">
                  <div className="space-y-0.5 mb-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-600 font-semibold">Total Servicio:</span>
                      <span className="font-bold text-slate-900">S/ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-600 font-semibold">Abono / A Cuenta:</span>
                      <span className="font-bold text-emerald-700">S/ {advance.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-slate-900 pt-1 flex justify-between items-baseline bg-amber-50 -mx-2.5 -mb-2.5 p-2 rounded-b-xl border-t border-amber-300">
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-amber-950">
                      SALDO PENDIENTE A CANCELAR:
                    </span>
                    <span className="text-lg font-black text-cyan-900">
                      S/ {saldo.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* BLOQUE DE GARANTÍA DINÁMICA */}
              <div className="border border-slate-300 rounded-xl p-2.5 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-cyan-800 font-black text-[11px] uppercase tracking-wider mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>{warrantyTitle}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium leading-tight">
                    {warrantyBadge}
                  </p>
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10.5px]">
                  <span className="font-bold text-slate-700">Período Otorgado:</span>
                  <span className="font-black px-2 py-0.5 rounded bg-slate-900 text-white text-[11px]">
                    {order.warranty_period || (hasHardware ? '6 meses' : '30 días')}
                  </span>
                </div>
              </div>
            </div>

            {/* Términos y Condiciones Dinámicos */}
            <div className="text-[10px] text-slate-600 border border-slate-200 rounded-xl p-2.5 bg-slate-50/70 space-y-0.5 mb-1.5 leading-tight">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-0.5">
                Términos y Condiciones de la Garantía:
              </p>
              {termsList.map((term, i) => (
                <p key={i} className="leading-tight">{term}</p>
              ))}
            </div>
          </div>

          {/* Footer Informativo de Taller (Sin firmas, pegado inmediatamente) */}
          <div className="pt-1.5 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left text-[9.5px] text-slate-500 font-medium">
            <div>
              <span className="font-bold text-slate-800 uppercase">Neyvix Tech • Taller Especializado</span>
              <span className="mx-1.5">•</span>
              <span>Chiclayo, Lambayeque</span>
            </div>
            <div className="text-[9.5px] text-slate-400">
              Documento oficial de control de servicio y garantía técnica
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
