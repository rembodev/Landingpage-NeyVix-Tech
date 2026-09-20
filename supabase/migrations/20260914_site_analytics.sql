-- ==============================================================================
-- NEYVIX TECH - MIGRACIÓN DE ANALÍTICA WEB & TRACKING EN TIEMPO REAL
-- Ejecutar en: Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. CREACIÓN DE LA TABLA DE EVENTOS DE ANALÍTICA
CREATE TABLE IF NOT EXISTS public.site_analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,           -- 'page_view', 'click_whatsapp', 'click_service', 'cta_click', 'diagnostic_calc', etc.
    event_target TEXT,                  -- Ej: 'Cotizar Mantenimiento Térmico', 'Boton Flotante WhatsApp', 'Ver Protocolo'
    page_path TEXT DEFAULT '/',         -- Ej: '/', '#servicios', '#diagnostico'
    device_type TEXT DEFAULT 'Desktop', -- 'Móvil', 'Desktop', 'Tablet'
    referrer TEXT DEFAULT 'Directo',    -- 'Directo', 'Google', 'Facebook', 'Instagram', 'TikTok', 'WhatsApp', etc.
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb  -- Datos opcionales adicionales (precio estimado, opciones seleccionadas, etc.)
);

-- Comentarios explicativos
COMMENT ON TABLE public.site_analytics_events IS 'Registro de interacciones y visitas anónimas en la landing page de Neyvix Tech';
COMMENT ON COLUMN public.site_analytics_events.session_id IS 'Identificador anónimo único de sesión persistido en el cliente';
COMMENT ON COLUMN public.site_analytics_events.event_type IS 'Categoría del evento: page_view, click_whatsapp, click_service, etc.';

-- 2. SEGURIDAD Y POLÍTICAS DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.site_analytics_events ENABLE ROW LEVEL SECURITY;

-- Política de INSERCIÓN: Permitir que cualquier visitante (anónimo o logueado) registre eventos de navegación
DROP POLICY IF EXISTS "Permitir insercion publica de eventos de analitica" ON public.site_analytics_events;
CREATE POLICY "Permitir insercion publica de eventos de analitica"
ON public.site_analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política de LECTURA: Restringir la lectura de métricas ÚNICAMENTE a técnicos y administradores autenticados
DROP POLICY IF EXISTS "Permitir lectura de analitica solo a usuarios autenticados" ON public.site_analytics_events;
CREATE POLICY "Permitir lectura de analitica solo a usuarios autenticados"
ON public.site_analytics_events
FOR SELECT
TO authenticated
USING (true);

-- 3. ÍNDICES DE OPTIMIZACIÓN PARA CONSULTAS Y AGREGACIONES RÁPIDAS
CREATE INDEX IF NOT EXISTS idx_analytics_created_at 
    ON public.site_analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type 
    ON public.site_analytics_events (event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_session_id 
    ON public.site_analytics_events (session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_composite_time_type 
    ON public.site_analytics_events (created_at DESC, event_type);

CREATE INDEX IF NOT EXISTS idx_analytics_device_type 
    ON public.site_analytics_events (device_type);

-- 4. ACTIVAR SUPABASE REALTIME PARA LA TABLA
-- Esto permite que el Live Activity Feed en /tracking reciba nuevos clics al instante
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'site_analytics_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.site_analytics_events;
    END IF;
END $$;
