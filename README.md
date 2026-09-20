# NEYVIX TECH — Plataforma Web & Sistema de Gestión de Taller

> **Plataforma integral de soporte técnico y TI especializada en Chiclayo, Perú.**  
> Diseñada para ofrecer una experiencia de cara al cliente moderna y de alto rendimiento, complementada con un módulo administrativo privado para gestión de órdenes de trabajo de taller y analítica web en tiempo real.

---

## Vista General y Módulos

La plataforma se divide en tres subsistemas integrados:

### 1. Landing Page Pública (`/`)
Diseño *dark mode premium* (`#0B0F17` / `#070b13`) con estética neón en azul cian (`#00D2FF`) y violeta (`#9D4EDD`), orientada a conversión y transparencia:
- **Hero Interactivo:** Presentación de propuesta de valor con llamados a la acción rápidos.
- **Catálogo de Servicios:** Detalle de mantenimiento térmico (con pasta Arctic MX-4), repotenciación SSD/RAM NVMe, optimización de software y reparación electrónica.
- **Cotizador / Diagnóstico Interactivo:** Calculadora dinámica de presupuestos aproximados según el problema seleccionado.
- **Flujo de Trabajo & Protocolo de Seguridad:** Explicación transparente de recepción, diagnóstico, autorización y entrega.
- **Testimonios & Preguntas Frecuentes (FAQ):** Resolución de dudas comunes y validación social.
- **Integración con WhatsApp:** Botón flotante inteligente y enlaces con mensajes predefinidos y formateados según el servicio solicitado.

---

### 2. Sistema de Gestión de Taller (`/taller` o `/admin`)
Módulo privado para técnicos y administradores, protegido por **Supabase Auth**:
- **Panel de Métricas (Dashboard):** Conteo de órdenes activas, equipos en diagnóstico, en reparación, listos para entrega y recaudación acumulada.
- **Pipeline Kanban & Vista de Tabla:** Flujo de estados con actualización reactiva (`diagnostico` ➔ `en_proceso` ➔ `control_calidad` ➔ `listo` ➔ `entregado`).
- **Recepción Técnica y Hoja de Entrada:**
  - Registro de cliente (Nombre, WhatsApp, DNI/RUC).
  - Datos del equipo (Tipo, marca, modelo, número de serie).
  - Inspección visual interactiva de daños previos (chasis, pantalla, teclado, puertos, bisagras, tornillos).
  - Registro de accesorios recibidos (cargador, funda, mouse, cable de poder, etc.).
  - Falla reportada y selección de servicios a cotizar.
- **Comprobante de Servicio Imprimible (A4 - 1 Página):**
  - Adaptado estrictamente para impresión en 1 sola hoja física vía `@media print`.
  - Código correlativo autogenerado (ej. `NVX-001`).
  - Lógica dinámica de garantía según el trabajo realizado (Hardware/Componentes vs. Mano de obra/Software).
  - Código QR de autenticidad y términos de servicio claros (sin firmas innecesarias para máxima limpieza).
- **Perfil de Técnico y Seguridad:**
  - Menú modal de perfil para actualización de datos y visualización del rol asignado.
  - Indicador de conexión en vivo con Supabase (punto verde/rojo según el estado de red).

---

### 3. Analítica Web & Tracking en Tiempo Real (`/tracking` o `/analytics`)
Módulo analítico interno para monitorear el comportamiento de los visitantes en la landing page:
- **Rastreador Asíncrono (`src/lib/tracker.js`):**
  - Registro de `page_view`, clics en WhatsApp, cotizaciones y enlaces telefónicos.
  - Identificador anónimo de sesión único (`session_id`).
  - Detección de dispositivo (Móvil, Tablet, Desktop) y canal de procedencia (Google, Facebook, Instagram, TikTok, WhatsApp, Directo, UTMs).
  - Patrón **Singleton** y **cooldown de deduplicación (2s)** para prevenir registros dobles causados por el doble montaje de `React.StrictMode` en desarrollo.
- **Dashboard de Analítica:**
  - Tasas de conversión de visitantes a leads de WhatsApp.
  - Distribución de tráfico por canal y tipo de dispositivo.
  - Registro de eventos recientes con sincronización en vivo mediante **Supabase Realtime**.

---

## Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React |
| **Backend & BD** | Supabase (PostgreSQL 15+, Supabase Auth, Row Level Security, Realtime) |
| **Despliegue** | Netlify (con configuración SPA en `public/_redirects`) |
| **Herramientas** | Oxlint, PostCSS, Autoprefixer |

---

## Estructura del Proyecto

```plaintext
neyvix-tech/
├── public/
│   ├── _redirects              # Regla de redirección SPA para Netlify
│   ├── favicon.svg             # Favicon vectorial oficial
│   └── logo.webp               # Logotipo de Neyvix Tech
├── src/
│   ├── assets/                 # Recursos gráficos (imágenes, diagramas)
│   ├── components/
│   │   ├── analytics/          # Componentes de analítica en tiempo real
│   │   │   └── AnalyticsDashboard.jsx
│   │   ├── workshop/           # Componentes del módulo de taller
│   │   │   ├── DashboardMetrics.jsx
│   │   │   ├── OrderReceptionModal.jsx
│   │   │   ├── OrdersPipeline.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   ├── ReceiptModal.jsx
│   │   │   ├── WorkshopApp.jsx
│   │   │   ├── WorkshopHeader.jsx
│   │   │   └── WorkshopLogin.jsx
│   │   ├── ContactFooter.jsx
│   │   ├── DiagnosticTool.jsx
│   │   ├── FAQ.jsx
│   │   ├── FloatingWhatsApp.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Roadmap.jsx
│   │   ├── Services.jsx
│   │   ├── Testimonials.jsx
│   │   ├── WhatsAppIcon.jsx
│   │   └── Workflow.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # Contexto global de sesión y autenticación
│   ├── data/
│   │   └── content.js          # Textos, servicios y configuraciones estáticas
│   ├── lib/
│   │   ├── supabaseClient.js   # Inicialización y validación del cliente Supabase
│   │   ├── tracker.js          # Motor cliente de tracking y eventos analíticos
│   │   └── whatsapp.js         # Generador de enlaces dinámicos para WhatsApp
│   ├── App.jsx                 # Enrutamiento condicional y punto de entrada UI
│   ├── index.css               # Estilos globales y directivas de Tailwind CSS
│   └── main.jsx                # Bootstrap de la aplicación React
├── supabase/
│   ├── migrations/
│   │   └── 20260914_site_analytics.sql  # Esquema y RLS para la tabla de eventos analíticos
│   └── schema.sql              # Esquema completo de la BD (técnicos, órdenes, secuencias, triggers)
├── .env.example                # Plantilla de variables de entorno requeridas
├── package.json                # Dependencias y scripts de ejecución
└── vite.config.js              # Configuración de compilación con Vite y Tailwind
```

---

## Instalación y Puesta en Marcha

### Requisitos Previos
- **Node.js** v18 o superior
- **npm** v9 o superior (o pnpm/yarn)
- Una cuenta y proyecto activo en [Supabase](https://supabase.com)

### 1. Clonar el Repositorio e Instalar Dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd neyvix-tech
npm install
```

### 2. Configuración de Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

```bash
cp .env.example .env
```

Define tus credenciales de Supabase (las encuentras en **Supabase Dashboard > Project Settings > API**):
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica-de-supabase
```

### 3. Configuración de la Base de Datos en Supabase
Ingresa al **SQL Editor** en tu panel de Supabase y ejecuta en orden:

1. **Esquema de Taller (`supabase/schema.sql`):**
   - Crea las tablas `technicians` y `work_orders`.
   - Crea la secuencia automática `work_order_seq` y triggers para generar correlativos (ej. `NVX-001`).
   - Habilita las políticas de **Row Level Security (RLS)** para control de acceso técnico.

2. **Esquema de Analítica (`supabase/migrations/20260914_site_analytics.sql`):**
   - Crea la tabla `site_analytics_events`.
   - Configura la política de inserción pública anónima y lectura exclusiva para técnicos autenticados.
   - Habilita índices de rendimiento y publicación en **Supabase Realtime**.

### 4. Ejecutar en Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible localmente en `http://localhost:5173`.

---

## Rutas de la Aplicación

| Ruta / Hash | Descripción | Acceso |
|---|---|---|
| `/` | Landing page principal de Neyvix Tech | Público |
| `/taller` o `/admin` | Panel de control de órdenes de servicio e ingreso de equipos | Privado (Requiere Login) |
| `/tracking` o `/analytics` | Dashboard de analítica web y conversiones en tiempo real | Privado (Requiere Login) |

---

## Pruebas y Depuración Rápida en Consola

Para verificar que el sistema de analítica y la conexión con Supabase estén activos, puedes abrir la consola de desarrollo del navegador (`F12`) en la landing page y ejecutar:

```javascript
// Disparar una inserción de prueba en tiempo real hacia Supabase
await window.__testTracker();

// Reiniciar la bandera Singleton del tracker si se requiere re-probar el ciclo de vida
window.__resetTracker();
```

---

## Scripts Disponibles

- `npm run dev` — Inicia el servidor de desarrollo local con Hot Module Replacement (HMR).
- `npm run build` — Compila y optimiza la aplicación para producción en la carpeta `dist/`.
- `npm run preview` — Levanta un servidor local para previsualizar la compilación de producción.
- `npm run lint` — Ejecuta Oxlint para análisis estático ultrarrápido de código.

---

## Licencia

Este proyecto es propiedad privada de **NEYVIX TECH** — Chiclayo, Perú. Todos los derechos reservados.
