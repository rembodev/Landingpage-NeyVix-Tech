/**
 * NEYVIX TECH - RASTREADOR ASÍNCRONO DE INTERACCIONES Y ANALÍTICA
 * Script cliente para tracking de visitantes, clics a WhatsApp y servicios en Supabase.
 */
import { supabase, getActiveSupabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'neyvix_local_analytics_events';
const SESSION_STORAGE_KEY = 'neyvix_visitor_session_id';

/**
 * Obtener o generar identificador anónimo de sesión único
 */
export function getSessionId() {
  if (typeof window === 'undefined') return 'nvx_srv_session';
  try {
    let sess = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sess) {
      sess = localStorage.getItem(SESSION_STORAGE_KEY);
    }
    if (!sess) {
      sess = 'nvx_s_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, sess);
        localStorage.setItem(SESSION_STORAGE_KEY, sess);
      } catch {}
    }
    return sess;
  } catch {
    return 'nvx_s_fallback';
  }
}

/**
 * Detección automática y no intrusiva del tipo de dispositivo
 */
export function getDeviceType() {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = (navigator.userAgent || '').toLowerCase();
  const width = window.innerWidth || 1024;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (
    /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua) ||
    width <= 640
  ) {
    return 'Móvil';
  }
  if (width <= 1024) {
    return 'Tablet';
  }
  return 'Desktop';
}

/**
 * Normalizar origen del tráfico (Referrer / UTM)
 */
export function getReferrerSource() {
  if (typeof window === 'undefined') return 'Directo';

  // 1. Priorizar parámetros UTM en URL
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    if (utmSource) {
      return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
    }
  } catch {}

  // 2. Analizar document.referrer
  const ref = (document.referrer || '').toLowerCase();
  if (!ref || ref.includes(window.location.hostname)) {
    return 'Directo';
  }
  if (ref.includes('facebook.com') || ref.includes('fb.me')) return 'Facebook';
  if (ref.includes('instagram.com')) return 'Instagram';
  if (ref.includes('tiktok.com')) return 'TikTok';
  if (ref.includes('google.com') || ref.includes('google.com.pe')) return 'Google';
  if (ref.includes('whatsapp.com') || ref.includes('wa.me') || ref.includes('wa.link')) return 'WhatsApp';
  if (ref.includes('linkedin.com')) return 'LinkedIn';
  if (ref.includes('youtube.com')) return 'YouTube';
  if (ref.includes('t.co') || ref.includes('twitter.com') || ref.includes('x.com')) return 'X / Twitter';

  try {
    const refHost = new URL(document.referrer).hostname.replace('www.', '');
    return refHost || 'Referido Externo';
  } catch {
    return 'Referido Externo';
  }
}

// ==============================================================================
// VARIABLES DE CONTROL SINGLETON Y DEDUPLICACIÓN EN MEMORIA
// ==============================================================================
let isTrackerInitialized = false;
let lastPageViewTime = 0;
let lastPageViewPath = '';
const PAGE_VIEW_COOLDOWN_MS = 2000;

/**
 * Reiniciar el estado del tracker (útil para pruebas unitarias o recarga limpia)
 */
export function resetTrackerState() {
  isTrackerInitialized = false;
  lastPageViewTime = 0;
  lastPageViewPath = '';
}

/**
 * Registrar y despachar un evento de analítica hacia Supabase y localStorage
 */
export async function trackEvent({
  event_type = 'custom_event',
  event_target = '',
  page_path = '',
  metadata = {},
}) {
  if (typeof window === 'undefined') return null;

  const currentPath =
    page_path ||
    (window.location.pathname === '/' && window.location.hash
      ? window.location.hash
      : (window.location.pathname || '/') + (window.location.hash || ''));

  const cleanEventType = String(event_type).trim();
  const cleanPath = currentPath || '/';

  // Deduplicación inteligente: Evitar disparar dos page_view idénticos a la misma ruta en menos de 2s
  if (cleanEventType === 'page_view') {
    const now = Date.now();
    if (
      lastPageViewPath === cleanPath &&
      now - lastPageViewTime < PAGE_VIEW_COOLDOWN_MS
    ) {
      console.log(
        `[Tracker] Page view duplicado ignorado para "${cleanPath}" (< ${PAGE_VIEW_COOLDOWN_MS}ms cooldown)`
      );
      return null;
    }
    lastPageViewTime = now;
    lastPageViewPath = cleanPath;
  }

  const payload = {
    session_id: getSessionId(),
    event_type: cleanEventType,
    event_target: String(event_target || '').trim(),
    page_path: cleanPath,
    device_type: getDeviceType(),
    referrer: getReferrerSource(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    metadata: metadata && typeof metadata === 'object' ? metadata : {},
  };

  // Depuración visual en consola para trazabilidad
  console.log('[Tracker] Evento registrado:', payload);

  // 1. Guardar copia local en caché para soporte offline/fallback
  syncLocalAnalyticsEvent({
    ...payload,
    id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString(),
  });

  // 2. Obtener instancia activa de Supabase
  const client = getActiveSupabase() || supabase;

  if (!client || !isSupabaseConfigured()) {
    console.warn(
      '[Tracker Aviso] Supabase no está configurado o VITE_SUPABASE_URL está ausente. Verifica tu archivo .env o credenciales en localStorage.'
    );
    return payload;
  }

  // 3. Envío real a la tabla site_analytics_events en Supabase
  try {
    const { data, error } = await client
      .from('site_analytics_events')
      .insert([payload])
      .select();

    if (error) {
      console.error('[Tracker Error]:', error.message, error.details || error);
    } else {
      console.log('[Tracker] Evento sincronizado con Supabase exitosamente:', data?.[0] || data);
    }
  } catch (err) {
    console.error('[Tracker Error]: Excepción al enviar evento a Supabase:', err);
  }

  return payload;
}

/**
 * Almacenar evento en caché local para persistencia rápida
 */
export function syncLocalAnalyticsEvent(event) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const events = raw ? JSON.parse(raw) : [...INITIAL_ANALYTICS_SEED];
    if (Array.isArray(events)) {
      events.unshift(event);
      if (events.length > 300) events.length = 300;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
    }
  } catch {}
}

/**
 * Obtener eventos locales guardados (fallback)
 */
export function getLocalAnalyticsEvents() {
  if (typeof window === 'undefined') return INITIAL_ANALYTICS_SEED;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_ANALYTICS_SEED;
}

/**
 * Inicializador global de tracking para la Landing Page (Patrón Singleton)
 */
export function initTracker() {
  if (typeof window === 'undefined') {
    return () => {};
  }

  // 1. Patrón Singleton: Si ya está inicializado, retornar inmediatamente
  if (isTrackerInitialized) {
    console.log('[Tracker] Instancia Singleton ya activa. Inicialización de listeners omitida.');
    return () => {};
  }

  console.log('[Tracker] Inicializando tracking automático de Neyvix Tech...');

  // 2. Escuchar cambios de sección por Hash o Historia
  const handleHashChange = () => {
    const navPath = (window.location.pathname || '/') + (window.location.hash || '');
    trackEvent({
      event_type: 'page_view',
      event_target: `Navegación a sección ${window.location.hash || 'Inicio'}`,
      page_path: navPath,
    });
  };

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('popstate', handleHashChange);

  // 3. Listener global de clics por delegación (Captura temprana para asegurar registro)
  const handleGlobalClick = (e) => {
    try {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      // A. Elementos con data-track explícito (Prioridad de etiquetado)
      const trackEl = target.closest('[data-track]');
      if (trackEl) {
        const rawType = trackEl.getAttribute('data-track-type');
        const href = trackEl.getAttribute('href') || '';
        const isWhatsApp =
          rawType === 'click_whatsapp' ||
          href.includes('wa.me') ||
          href.includes('wa.link') ||
          href.includes('whatsapp.com');

        const eventType = isWhatsApp ? 'click_whatsapp' : rawType || 'cta_click';
        const eventTarget =
          trackEl.getAttribute('data-track') ||
          trackEl.getAttribute('aria-label') ||
          trackEl.textContent?.trim()?.slice(0, 60) ||
          'Botón interactivo';

        trackEvent({
          event_type: eventType,
          event_target: eventTarget,
          metadata: {
            href: href || undefined,
            tag: trackEl.tagName,
            id: trackEl.id || undefined,
          },
        });
        return;
      }

      // B. Cualquier enlace con href que contenga wa.link, wa.me o whatsapp.com
      const waLink = target.closest('a[href*="wa.me"], a[href*="wa.link"], a[href*="whatsapp.com"]');
      if (waLink) {
        const href = waLink.getAttribute('href') || '';
        let targetLabel = waLink.getAttribute('aria-label') || waLink.textContent?.trim()?.slice(0, 60);

        try {
          const urlObj = new URL(href);
          const textParam = urlObj.searchParams.get('text');
          if (textParam) {
            targetLabel = 'WhatsApp: ' + decodeURIComponent(textParam).slice(0, 60);
          }
        } catch {}

        trackEvent({
          event_type: 'click_whatsapp',
          event_target: targetLabel || 'Clic en enlace de WhatsApp',
          metadata: { href },
        });
        return;
      }

      // C. Enlaces telefónicos directos (tel:)
      const telLink = target.closest('a[href^="tel:"]');
      if (telLink) {
        trackEvent({
          event_type: 'cta_click',
          event_target: 'Llamada telefónica a ' + telLink.getAttribute('href'),
        });
        return;
      }
    } catch (err) {
      console.error('[Tracker Error]: Error al procesar clic global:', err);
    }
  };

  document.addEventListener('click', handleGlobalClick, true);

  // 4. Registrar page_view inicial al cargar la Landing Page
  const initialPath = (window.location.pathname || '/') + (window.location.hash || '');
  trackEvent({
    event_type: 'page_view',
    event_target: 'Carga inicial de Landing Page',
    page_path: initialPath,
  });

  // 5. Marcar como inicializado solo tras el primer registro exitoso
  isTrackerInitialized = true;

  return () => {
    window.removeEventListener('hashchange', handleHashChange);
    window.removeEventListener('popstate', handleHashChange);
    document.removeEventListener('click', handleGlobalClick, true);
    isTrackerInitialized = false;
  };
}

// ==============================================================================
// FUNCIONES DE PRUEBA Y DEPURACIÓN GLOBAL (window.__testTracker & window.__resetTracker)
// ==============================================================================
if (typeof window !== 'undefined') {
  window.__resetTracker = resetTrackerState;

  window.__testTracker = async () => {
    console.log('[Tracker Test] ========================================');
    console.log('[Tracker Test] Ejecutando inserción de prueba directa en Supabase...');
    const client = getActiveSupabase() || supabase;
    const isConfigured = isSupabaseConfigured();

    console.log('[Tracker Test] Supabase configurado:', isConfigured);
    console.log('[Tracker Test] Instancia de Supabase activa:', !!client);

    if (!client) {
      console.error(
        '[Tracker Test Error] No se encontró cliente de Supabase. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env o localStorage.'
      );
      return { success: false, error: 'Cliente de Supabase ausente' };
    }

    const testPayload = {
      session_id: getSessionId(),
      event_type: 'test_event',
      event_target: 'Prueba manual desde window.__testTracker()',
      page_path: (window.location.pathname || '/') + (window.location.hash || ''),
      device_type: getDeviceType(),
      referrer: getReferrerSource(),
      user_agent: navigator.userAgent,
      metadata: {
        test: true,
        timestamp: new Date().toISOString(),
        testTime: Date.now(),
      },
    };

    console.log('[Tracker Test] Payload a insertar:', testPayload);

    try {
      const { data, error } = await client
        .from('site_analytics_events')
        .insert([testPayload])
        .select();

      if (error) {
        console.error('[Tracker Test Error] Supabase respondió con error:', error.message, error);
        return { success: false, error };
      }

      console.log('[Tracker Test ÉXITO] Registro insertado en Supabase en tiempo real:', data);
      console.log('[Tracker Test] ========================================');
      return { success: true, data };
    } catch (err) {
      console.error('[Tracker Test Error] Excepción al ejecutar query:', err);
      return { success: false, error: err };
    }
  };

  console.log('[Tracker] Función de prueba disponible: ejecuta window.__testTracker() en la consola.');
}

// ==============================================================================
// DATOS SEMILLA INICIALES (MOCK REALISTA PARA PRUEBAS INMEDIATAS)
// ==============================================================================
export const INITIAL_ANALYTICS_SEED = [
  {
    id: 'seed-evt-001',
    created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    session_id: 'nvx_s_chicl_981',
    event_type: 'click_whatsapp',
    event_target: 'Cotizar Mantenimiento Térmico (Hero CTA)',
    page_path: '/',
    device_type: 'Móvil',
    referrer: 'Instagram',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    metadata: { service: 'mantenimiento', category: 'lead' },
  },
  {
    id: 'seed-evt-002',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    session_id: 'nvx_s_chicl_981',
    event_type: 'click_service',
    event_target: 'Ver Protocolo: Mantenimiento Térmico & Pasta Arctic MX-4',
    page_path: '#servicios',
    device_type: 'Móvil',
    referrer: 'Instagram',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    metadata: { service: 'mantenimiento' },
  },
  {
    id: 'seed-evt-003',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    session_id: 'nvx_s_chicl_742',
    event_type: 'click_whatsapp',
    event_target: 'Boton Flotante WhatsApp (Laptop Calienta)',
    page_path: '/',
    device_type: 'Móvil',
    referrer: 'Facebook',
    user_agent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B)',
    metadata: { source: 'floating_widget' },
  },
  {
    id: 'seed-evt-004',
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    session_id: 'nvx_s_chicl_519',
    event_type: 'click_service',
    event_target: 'Cotizar Repotenciación SSD & RAM Kingston NV3',
    page_path: '#servicios',
    device_type: 'Desktop',
    referrer: 'Google',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    metadata: { service: 'repotenciacion' },
  },
  {
    id: 'seed-evt-005',
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    session_id: 'nvx_s_chicl_519',
    event_type: 'click_whatsapp',
    event_target: 'Cotizar Repotenciación SSD Kingston 1TB NVMe',
    page_path: '#servicios',
    device_type: 'Desktop',
    referrer: 'Google',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    metadata: { service: 'repotenciacion', lead: true },
  },
  {
    id: 'seed-evt-006',
    created_at: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    session_id: 'nvx_s_chicl_204',
    event_type: 'diagnostic_calc',
    event_target: 'Cotizador Interactivo: Mantenimiento + SSD 500GB',
    page_path: '#diagnostico',
    device_type: 'Desktop',
    referrer: 'Directo',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    metadata: { totalEstimate: 175 },
  },
  {
    id: 'seed-evt-007',
    created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    session_id: 'nvx_s_chicl_882',
    event_type: 'click_service',
    event_target: 'Cotizar Formateo & Optimización Windows 11',
    page_path: '#servicios',
    device_type: 'Móvil',
    referrer: 'TikTok',
    user_agent: 'Mozilla/5.0 (Linux; Android 13; Redmi Note 12)',
    metadata: { service: 'formateo' },
  },
  {
    id: 'seed-evt-008',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    session_id: 'nvx_s_chicl_331',
    event_type: 'page_view',
    event_target: 'Carga inicial de Landing Page',
    page_path: '/',
    device_type: 'Desktop',
    referrer: 'Google',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    metadata: {},
  },
  {
    id: 'seed-evt-009',
    created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    session_id: 'nvx_s_chicl_647',
    event_type: 'click_whatsapp',
    event_target: 'Consulta Diagnóstico Electrónico de Placa',
    page_path: '#servicios',
    device_type: 'Móvil',
    referrer: 'WhatsApp',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)',
    metadata: { service: 'electronica' },
  },
  {
    id: 'seed-evt-010',
    created_at: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    session_id: 'nvx_s_chicl_119',
    event_type: 'page_view',
    event_target: 'Navegación a sección #diagnostico',
    page_path: '#diagnostico',
    device_type: 'Tablet',
    referrer: 'Facebook',
    user_agent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
    metadata: {},
  },
];
