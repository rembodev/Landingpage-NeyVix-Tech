/**
 * Motor de notificaciones de WhatsApp para Neyvix Tech (Chiclayo, Perú)
 * Genera enlaces directos a WhatsApp con mensajes técnicos profesionales personalizados según el estado de la orden.
 */

export const WORKSHOP_PHONE = '929443131';
export const WORKSHOP_CITY = 'Chiclayo, Perú';
export const WORKSHOP_WEB = 'neyvixtech.netlify.app';

/**
 * Limpia y formatea un número de teléfono peruano para WhatsApp (prefijo 51)
 */
export function formatPhoneForWhatsApp(phone) {
  if (!phone) return '';
  // Remover espacios, guiones, símbolos
  const clean = phone.toString().replace(/\D/g, '');
  
  // Si ya tiene el 51 al inicio y tiene 11 dígitos, dejarlo
  if (clean.startsWith('51') && clean.length === 11) {
    return clean;
  }
  // Si tiene 9 dígitos (formato estándar de celular en Perú), anteponer 51
  if (clean.length === 9) {
    return `51${clean}`;
  }
  // Si el usuario ingresó +51...
  return clean.length >= 9 ? `51${clean.slice(-9)}` : clean;
}

/**
 * Genera el mensaje según el estado de la orden
 */
export function generateWhatsAppMessage(order, customStatus = null) {
  const status = customStatus || order.status;
  const clientName = order.customer_name || 'Estimado(a) cliente';
  const code = order.order_code || 'NVX-000';
  const device = `${order.device_brand || ''} ${order.device_model || ''}`.trim() || 'su equipo';
  const balance = Number(order.balance_payment ?? (Number(order.total_cost || 0) - Number(order.advance_payment || 0))).toFixed(2);
  const total = Number(order.total_cost || 0).toFixed(2);
  const warranty = order.warranty_period || '30 días';

  switch (status) {
    case 'diagnostico':
    default:
      return (
        `¡Hola *${clientName}*! 👋 Le saludamos de *Neyvix Tech* (Servicio Técnico Especializado - Chiclayo).\n\n` +
        `📥 Hemos recibido formalmente su equipo *${device}* en nuestro laboratorio técnico.\n` +
        `📋 *Orden de Servicio:* #${code}\n` +
        `🔍 *Falla Reportada:* ${order.reported_issue || 'Revisión técnica general'}\n\n` +
        `Nuestro equipo técnico iniciará la inspección detallada. Le estaremos comunicando los avances.\n` +
        `🌐 Web: ${WORKSHOP_WEB}\n` +
        `📞 Contacto: 929 443 131`
      );

    case 'en_proceso':
      return (
        `¡Hola *${clientName}*! 🔧 Actualización de su orden *#${code}* en *Neyvix Tech*.\n\n` +
        `Su equipo *${device}* se encuentra actualmente *EN PROCESO DE MANTENIMIENTO / REPARACIÓN* en nuestro taller.\n` +
        `Estamos aplicando los protocolos técnicos correspondientes y pruebas de laboratorio.\n\n` +
        `Le avisaremos de inmediato una vez concluyan las pruebas de control de calidad.\n` +
        `¡Gracias por su confianza!`
      );

    case 'control_calidad':
      return (
        `¡Hola *${clientName}*! 🧪 Control de Calidad en *Neyvix Tech* (Orden *#${code}*).\n\n` +
        `Los trabajos técnicos en su equipo *${device}* han finalizado y nos encontramos ejecutando las *pruebas finales de QA* (rendimiento térmico, teclado, audio, video y estabilidad).\n\n` +
        `En breve le notificaremos para su retiro.`
      );

    case 'listo':
      return (
        `¡Hola *${clientName}*! 🎉 ¡Excelentes noticias!\n\n` +
        `Su equipo *${device}* (Orden *#${code}*) ha superado exitosamente todas las pruebas de control de calidad y está *LISTO PARA ENTREGA* en nuestro taller en Chiclayo.\n\n` +
        `💰 *Detalle de liquidación:*\n` +
        `• Costo Total: S/ ${total}\n` +
        `• Adelanto: S/ ${Number(order.advance_payment || 0).toFixed(2)}\n` +
        `• *Saldo Pendiente: S/ ${balance}*\n` +
        `🛡️ *Garantía del Servicio:* ${warranty}\n\n` +
        `📍 Puede pasar a recogerlo con su documento o código de orden.\n` +
        `¡Le esperamos en Neyvix Tech!`
      );

    case 'entregado':
      return (
        `¡Hola *${clientName}*! 🤝 Muchas gracias por preferir a *Neyvix Tech*.\n\n` +
        `Confirmamos la entrega de su equipo *${device}* (Orden *#${code}*).\n` +
        `🛡️ Recuerde que su servicio cuenta con *${warranty} de garantía técnica*.\n\n` +
        `Cualquier consulta técnica estamos a su entera disposición en el 929 443 131.\n` +
        `¡Que disfrute del máximo rendimiento de su equipo!`
      );
  }
}

/**
 * Abre el chat de WhatsApp con el mensaje preformateado
 */
export function openWhatsAppChat(order, customStatus = null) {
  const phone = formatPhoneForWhatsApp(order.customer_phone);
  if (!phone) {
    alert('El cliente no tiene registrado un número de teléfono válido.');
    return;
  }
  const message = generateWhatsAppMessage(order, customStatus);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
