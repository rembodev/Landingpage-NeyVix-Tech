-- ==============================================================================
-- NEYVIX TECH - ESQUEMA DE BASE DE DATOS SUPABASE (POSTGRESQL)
-- Servicio Técnico Especializado en Chiclayo, Perú
-- ==============================================================================

-- 1. EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE TÉCNICOS Y ADMINISTRADORES
CREATE TABLE IF NOT EXISTS public.technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'technician' CHECK (role IN ('admin', 'lead_tech', 'technician')),
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. SECUENCIA PARA CÓDIGO CORRELATIVO DE ÓRDENES (NVX-001, NVX-002, ...)
CREATE SEQUENCE IF NOT EXISTS work_order_seq START WITH 1 INCREMENT BY 1;

-- 4. TABLA PRINCIPAL DE ÓRDENES DE TRABAJO (WORK_ORDERS)
CREATE TABLE IF NOT EXISTS public.work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL UNIQUE, -- Ej: NVX-001
    
    -- Datos del Cliente
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL, -- WhatsApp (ej: 929443131)
    customer_doc TEXT,           -- DNI / RUC opcional
    
    -- Datos del Equipo
    device_type TEXT NOT NULL DEFAULT 'Laptop' CHECK (device_type IN ('Laptop', 'PC Escritorio', 'Todo en Uno', 'Otro')),
    device_brand TEXT NOT NULL,
    device_model TEXT NOT NULL,
    device_serial TEXT,
    
    -- Accesorios Recibidos (JSONB Array)
    accessories JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Inspección Visual Previa (JSONB Object)
    visual_inspection JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Falla reportada por el cliente
    reported_issue TEXT NOT NULL,
    
    -- Servicios Marcados (Array de strings: ["mantenimiento", "repotenciacion", "formateo", "electronica"])
    services_selected JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Detalle técnico estructurado de los servicios realizados
    services_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Control de Calidad QA Checklist
    qa_checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Datos Económicos y Garantía
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    advance_payment NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    balance_payment NUMERIC(10, 2) GENERATED ALWAYS AS (total_cost - advance_payment) STORED,
    warranty_period TEXT NOT NULL DEFAULT '30 días' CHECK (warranty_period IN ('30 días', '3 meses', '6 meses', '1 año', 'Sin garantía')),
    
    -- Estado de la Orden de Taller
    status TEXT NOT NULL DEFAULT 'diagnostico' CHECK (status IN (
        'diagnostico',       -- En Diagnóstico Inicial
        'en_proceso',        -- En Proceso de Taller
        'control_calidad',   -- En Control de Calidad / Pruebas
        'listo',             -- Listo para Entrega
        'entregado',         -- Entregado y Cobrado
        'cancelado'          -- Cancelado / No Reparado
    )),
    
    -- Asignación Técnica
    technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
    technician_name TEXT,
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. FUNCIÓN Y TRIGGER PARA ASIGNACIÓN AUTOMÁTICA DE CÓDIGO NVX-XXX
CREATE OR REPLACE FUNCTION set_work_order_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_code IS NULL OR NEW.order_code = '' THEN
        NEW.order_code := 'NVX-' || LPAD(nextval('work_order_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_work_order_code ON public.work_orders;
CREATE TRIGGER trg_set_work_order_code
BEFORE INSERT ON public.work_orders
FOR EACH ROW
EXECUTE FUNCTION set_work_order_code();

-- 6. TRIGGER PARA ACTUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_technicians_timestamp ON public.technicians;
CREATE TRIGGER trg_update_technicians_timestamp
BEFORE UPDATE ON public.technicians
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_update_work_orders_timestamp ON public.work_orders;
CREATE TRIGGER trg_update_work_orders_timestamp
BEFORE UPDATE ON public.work_orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 7. ÍNDICES PARA BÚSQUEDA Y RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_work_orders_code ON public.work_orders (order_code);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON public.work_orders (status);
CREATE INDEX IF NOT EXISTS idx_work_orders_phone ON public.work_orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_work_orders_customer ON public.work_orders (customer_name);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_at ON public.work_orders (created_at DESC);

-- 8. POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians viewable by authenticated users"
ON public.technicians FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Work orders readable by authenticated technicians"
ON public.work_orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Work orders insertable by authenticated technicians"
ON public.work_orders FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Work orders updatable by authenticated technicians"
ON public.work_orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 9. DATOS SEMILLA DE PRUEBA (SEED INICIAL)
INSERT INTO public.technicians (id, email, full_name, role, phone, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin@neyvixtech.com', 'Neyver Vásquez (Admin)', 'admin', '929443131', true),
    ('22222222-2222-2222-2222-222222222222', 'tecnico@neyvixtech.com', 'Carlos Mendoza (Técnico Senior)', 'technician', '974112233', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.work_orders (
    order_code, customer_name, customer_phone, customer_doc,
    device_type, device_brand, device_model, device_serial,
    accessories, visual_inspection, reported_issue,
    services_selected, services_data, qa_checklist,
    total_cost, advance_payment, warranty_period, status,
    technician_name
) VALUES 
(
    'NVX-001',
    'Juan Pérez Calderón',
    '978123456',
    '72458912',
    'Laptop',
    'Lenovo',
    'Legion 5 15ACH6H',
    'PF2X9L0M',
    '["Cargador original 230W", "Mochila Lenovo"]'::jsonb,
    '{"screen": "Sin rayones", "hinges": "En buen estado", "chassis": "Completa", "battery": "Operativa", "power": "Enciende"}'::jsonb,
    'Equipo se sobrecalienta al jugar y se apaga de golpe a los 15 minutos.',
    '["mantenimiento"]'::jsonb,
    '{
        "thermal": {
            "disassembly": true,
            "fans_cleaning": true,
            "thermal_paste_applied": true,
            "paste_brand": "Arctic MX-4",
            "initial_temp_cpu": 96,
            "final_temp_cpu": 68,
            "initial_temp_gpu": 88,
            "final_temp_gpu": 64
        }
    }'::jsonb,
    '{"wifi_bt": true, "keyboard": true, "audio_mic": true, "webcam": true, "cleaning": true}'::jsonb,
    90.00,
    50.00,
    '30 días',
    'listo',
    'Neyver Vásquez'
),
(
    'NVX-002',
    'Rosa Morales Sánchez',
    '956781234',
    '45127896',
    'Laptop',
    'HP',
    'Pavilion 15-dw1024la',
    '5CD1298XX',
    '["Cargador original 45W"]'::jsonb,
    '{"screen": "Con marcas leves", "hinges": "En buen estado", "chassis": "Falta 1 tornillo inferior", "battery": "Operativa", "power": "Enciende"}'::jsonb,
    'Muy lenta al encender y abrir Excel. Disco duro mecánico al 100%. Desea repotenciar y formatear.',
    '["repotenciacion", "formateo"]'::jsonb,
    '{
        "hardware": {
            "ssd_installed": true,
            "ssd_type": "M.2 NVMe PCIe",
            "ssd_capacity": "512GB",
            "crystal_health_percent": 100,
            "crystal_status": "Bueno",
            "ram_expanded": true,
            "ram_installed_gb": "8GB",
            "ram_frequency": "3200MHz",
            "ram_brand": "Crucial"
        },
        "software": {
            "os_installed": "Windows 11 Pro (64 bits)",
            "drivers_updated": true,
            "basic_utilities": true,
            "office_suite": true,
            "boot_optimization": true
        }
    }'::jsonb,
    '{"wifi_bt": true, "keyboard": true, "audio_mic": true, "webcam": true, "cleaning": true}'::jsonb,
    220.00,
    100.00,
    '3 meses',
    'en_proceso',
    'Carlos Mendoza'
),
(
    'NVX-003',
    'Estudio Contable Chiclayo SAC',
    '979456123',
    '20608976541',
    'PC Escritorio',
    'Custom Tower',
    'Core i7 10700K / B460 / 16GB',
    'SN-DESK-2023',
    '["Cable de poder"]'::jsonb,
    '{"screen": "No aplica", "hinges": "No aplica", "chassis": "Buen estado con polvo", "battery": "No aplica", "power": "No enciende"}'::jsonb,
    'No da ninguna señal de vida tras tormenta eléctrica. Posible daño en fuente o motherboard.',
    '["electronica"]'::jsonb,
    '{
        "electronica": {
            "board_diagnosis": "Línea de 12V en corto circuito en sección VRM de la placa madre. Mosfet de entrada perforado.",
            "components_replaced": "Reemplazo de 2 Mosfets N-Channel de potencia en fase principal y fusible SMD.",
            "notes": "Prueba de banco estable por 4 horas con test de estrés Furmark y Prime95."
        }
    }'::jsonb,
    '{"wifi_bt": true, "keyboard": true, "audio_mic": true, "webcam": true, "cleaning": true}'::jsonb,
    180.00,
    0.00,
    '3 meses',
    'diagnostico',
    'Neyver Vásquez'
)
ON CONFLICT (order_code) DO NOTHING;
