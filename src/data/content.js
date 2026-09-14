export const BRAND_DATA = {
  name: "Neyvix Tech",
  slogan: "Soporte Técnico Especializado & Soluciones IT",
  phone: "+51 929 443 131",
  phoneRaw: "929443131",
  email: "neyvixtech@gmail.com",
  location: "Chiclayo, Perú (Atención en taller, a domicilio y remota)",
  hours: "Lunes a Sábado: 8:30 AM - 7:30 PM",
  defaultWhatsAppUrl: "https://wa.me/51929443131?text=Hola%20Neyvix%20Tech,%20deseo%20cotizar%20un%20servicio",
  socials: {
    facebook: "https://facebook.com/neyvixtech.pe",
    instagram: "https://instagram.com/neyvixtech",
  }
};

export const createWhatsAppLink = (customText) => {
  const encoded = encodeURIComponent(customText || "Hola Neyvix Tech, deseo cotizar un servicio para mi equipo.");
  return `https://wa.me/${BRAND_DATA.phoneRaw}?text=${encoded}`;
};

export const TRUST_METRICS = [
  { value: "+650", label: "Equipos Optimizados", sub: "Laptops & PCs recuperadas" },
  { value: "100%", label: "Garantía Real", sub: "En mano de obra y repuestos" },
  { value: "< 24h", label: "Diagnóstico Express", sub: "Tiempos récord de respuesta" },
  { value: "4.9 / 5", label: "Satisfacción Cliente", sub: "Calificaciones comprobadas" },
];

export const SERVICES = [
  {
    id: "mantenimiento",
    badge: "Más Solicitado",
    title: "Mantenimiento Preventivo & Térmico",
    shortDesc: "Evita que tu laptop o PC sufra por sobrecalentamiento, apagones repentinos y polvo acumulado.",
    fullDesc: "Servicio integral de limpieza profunda de componentes, disipador y turbinas. Reemplazo de pasta térmica de alto rendimiento (Arctic MX-4 / Thermal Grizzly) y pruebas de estrés térmico.",
    icon: "ShieldAlert",
    color: "cyan",
    features: [
      "Limpieza profunda y desensamble minucioso",
      "Pasta térmica de grado prémium (hasta -20°C en carga)",
      "Lubricación y calibración de ventiladores / coolers",
      "Test de estrés térmico y reporte de temperaturas",
      "Revisión de voltajes y salud de componentes"
    ],
    idealFor: "Laptops gamer, equipos de oficina que calientan o hacen ruido excesivo",
    suggestedTime: "3 a 5 horas",
    whatsappText: "Hola Neyvix Tech, deseo cotizar un Mantenimiento Preventivo y Térmico para mi equipo."
  },
  {
    id: "repotenciacion",
    badge: "Velocidad x10",
    title: "Repotenciación de Hardware",
    shortDesc: "Dale una segunda vida ultra veloz a tu equipo cambiando ese disco lento o ampliando memoria.",
    fullDesc: "Migración a unidades de estado sólido ultrarrápidas (SSD NVMe M.2 / SATA) y ampliación de memoria RAM en Dual Channel. Clonación exacta de tu sistema sin perder fotos, archivos ni programas instalados.",
    icon: "Cpu",
    color: "blue",
    features: [
      "Instalación de SSD NVMe PCIe 4.0 / SATA III",
      "Ampliación de RAM (DDR4 / DDR5 en Dual Channel)",
      "Clonación de disco 1:1 sin pérdida de datos",
      "Arranque del sistema en menos de 12 segundos",
      "Configuración de disco secundario para almacenamiento"
    ],
    idealFor: "Equipos lentos con disco mecánico (HDD) o memoria insuficiente",
    suggestedTime: "Mismo día (2 a 4 horas)",
    whatsappText: "Hola Neyvix Tech, me interesa repotenciar mi equipo con disco SSD y/o memoria RAM."
  },
  {
    id: "reparacion",
    badge: "Diagnóstico & Solución",
    title: "Diagnóstico & Mantenimiento Correctivo",
    shortDesc: "Identificación precisa de fallas, solución a problemas de lentitud, calentamiento y cambio modular de piezas defectuosas.",
    fullDesc: "Servicio técnico orientado a detectar el origen exacto de las fallas de tu equipo, solucionar problemas de calentamiento y lentitud, y realizar el recambio modular de componentes defectuosos con repuestos garantizados.",
    icon: "Wrench",
    color: "violet",
    features: [
      "Diagnóstico exhaustivo de problemas de encendido, reinicios y pantallas azules.",
      "Reemplazo e instalación de repuestos modulares (teclados, pantallas, baterías, ventiladores).",
      "Reconstrucción, lubricación y ajuste mecánico de bisagras rígidas o rotas.",
      "Pruebas de estrés y estabilidad de memoria RAM, disco y procesador.",
      "Asesoría técnica clara antes de cualquier compra de repuestos."
    ],
    idealFor: "Equipos con lentitud, apagones repentinos, bisagras rotas, teclado defectuoso o pantalla dañada",
    suggestedTime: "Según disponibilidad de repuesto",
    whatsappText: "Hola Neyvix Tech, tengo un equipo con fallas y deseo cotizar el servicio de Diagnóstico & Mantenimiento Correctivo."
  },
  {
    id: "software",
    badge: "Seguridad & Estabilidad",
    title: "Software & Optimización",
    shortDesc: "Sistema operativo limpio, veloz, libre de virus y configurado a la medida de tu flujo de trabajo.",
    fullDesc: "Formateo profesional e instalación limpia de Windows 10/11 o Linux con controladores oficiales actualizados, eliminación de bloatware, desinfección de malware y configuración de software productivo.",
    icon: "Terminal",
    color: "emerald",
    features: [
      "Instalación limpia de Windows 11 / 10 / Linux",
      "Drivers oficiales y firmware BIOS actualizado",
      "Eliminación de virus, troyanos, mineros y adware",
      "Configuración de software de oficina, diseño y utilitarios",
      "Copia de seguridad y respaldo seguro de archivos personales"
    ],
    idealFor: "Equipos con pantallas azules, publicidad invasiva, bloqueos o virus",
    suggestedTime: "2 a 3 horas",
    whatsappText: "Hola Neyvix Tech, requiero formateo limpio y optimización de software para mi equipo."
  }
];

export const ROADMAP = [
  {
    phase: "FASE 01",
    status: "Fase Activa",
    statusColor: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
    title: "Soporte Técnico & Optimización de Hardware",
    description: "Mantenimiento preventivo profundo, cambio de pasta térmica de calidad, repotenciación con SSDs/RAM y formateo optimizado para laptops y PCs personales o de trabajo.",
    bullets: [
      "Mantenimiento preventivo y limpieza profunda de componentes.",
      "Repotenciación con unidades SSD NVMe/SATA y memorias RAM.",
      "Formateo limpio, instalación de sistemas y programas esenciales.",
      "Diagnóstico transparente y servicio a domicilio coordinado en Chiclayo."
    ],
    icon: "Wrench"
  },
  {
    phase: "FASE 02",
    status: "Próximamente",
    statusColor: "text-blue-400 border-blue-500/40 bg-blue-950/40",
    title: "Seguridad Electrónica & Conectividad",
    description: "Protección y conectividad para hogares, consultorios y pequeños negocios mediante soluciones prácticas y accesibles.",
    bullets: [
      "Instalación y configuración de cámaras de seguridad (WiFi y circuitos CCTV).",
      "Configuración de acceso móvil para monitoreo en tiempo real desde el celular.",
      "Optimización de redes WiFi domésticas, repetidores y cableado de red local.",
      "Paquetes de mantenimiento preventivo periódico para oficinas y boticas."
    ],
    icon: "ShieldCheck"
  },
  {
    phase: "FASE 03",
    status: "Visión Tecnológica",
    statusColor: "text-purple-400 border-purple-500/40 bg-purple-950/40",
    title: "Soluciones Web & Digitalización",
    description: "Desarrollo de presencia digital y herramientas tecnológicas para impulsar el crecimiento de micro y pequeñas empresas.",
    bullets: [
      "Diseño y desarrollo de sitios web modernos y landing pages de alta conversión.",
      "Implementación de catálogos virtuales y herramientas de gestión básica.",
      "Asesoría tecnológica integral para digitalizar pequeños comercios."
    ],
    icon: "Globe"
  }
];

export const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Contacto & Consulta Rápida",
    desc: "Nos escribes directamente al WhatsApp indicando la marca, modelo de tu equipo y la falla o mejora que necesitas.",
    icon: "MessageSquareText"
  },
  {
    step: "02",
    title: "Diagnóstico Transparente",
    desc: "Revisamos tu equipo a detalle. Identificamos la causa raíz del problema con pruebas físicas, térmicas y de voltaje.",
    icon: "ScanSearch"
  },
  {
    step: "03",
    title: "Presupuesto Claro & Sin Sorpresas",
    desc: "Te presentamos una cotización cerrada antes de tocar cualquier tornillo. Tú decides y apruebas sin cobros ocultos.",
    icon: "CheckCircle2"
  },
  {
    step: "04",
    title: "Entrega con Pruebas & Garantía",
    desc: "Te entregamos tu equipo con pruebas de rendimiento en vivo y garantía formal por escrito en mano de obra y repuestos.",
    icon: "ShieldCheck"
  }
];

export const FAQS = [
  {
    question: "¿Cuánto demora un mantenimiento preventivo y térmico?",
    answer: "En promedio, un mantenimiento preventivo completo toma entre 3 a 5 horas. Esto incluye el desensamble minucioso, limpieza profunda, cambio de pasta térmica de alta conductividad y 30 a 45 minutos de pruebas de estrés térmico para certificar la baja de temperaturas."
  },
  {
    question: "¿Realizan servicio o recojo a domicilio?",
    answer: "¡Sí! Ofrecemos servicio a domicilio y recojo programado según tu ubicación. Para mantenimientos preventivos y formateos podemos realizarlos in-situ previa coordinación, o recoger el equipo de forma segura para diagnósticos electrónicos en taller."
  },
  {
    question: "¿Qué garantía tienen los trabajos y repuestos instalados?",
    answer: "Todos nuestros servicios cuentan con garantía real: 3 meses de garantía directa en mano de obra y de 6 a 12 meses (según el fabricante) en repuestos nuevos como discos SSD, memorias RAM y pantallas originales."
  },
  {
    question: "¿Se pierden mis fotos, archivos o programas al cambiar el disco a SSD?",
    answer: "No. Contamos con tecnología de clonación bit a bit. Transferimos absolutamente todo tu sistema operativo, documentos, contraseñas y programas tal cual los tienes, pero funcionando hasta 10 veces más rápido."
  },
  {
    question: "¿Cómo solicito una cotización formal para mi empresa u oficina?",
    answer: "Escríbenos por WhatsApp al +51 938 231 843 o a nuestro correo oficial. Podemos coordinar una visita técnica a tu oficina para evaluar tu parque de computadoras y enviarte una propuesta formal con factura."
  }
];

export const TESTIMONIALS = [
  {
    name: "Carlos Mendieta",
    role: "Diseñador Gráfico Freelance",
    comment: "Mi laptop tardaba casi 6 minutos en encender y los renders hacían que hirviera. Le pusieron SSD NVMe y cambio de pasta térmica. Ahora arranca en 9 segundos y las temperaturas no pasan de 65°C. Totalmente recomendados.",
    service: "Repotenciación SSD + Mantenimiento",
    rating: 5
  },
  {
    name: "Dra. Patricia Valenzuela",
    role: "Consultorio Médico Privado",
    comment: "Teníamos 4 PCs de recepción lentísimas y con constantes bloqueos. El equipo de Neyvix Tech las optimizó el fin de semana sin interrumpir nuestra atención. Atención transparente y rápida.",
    service: "Mantenimiento Preventivo PYME",
    rating: 5
  },
  {
    name: "Renzo Alarcón",
    role: "Gamer & Creador de Contenido",
    comment: "Mi laptop gamer se apagaba sola en pleno stream por thermal throttling. Hicieron limpieza con pasta prémium y lubricaron los fans. El resultado fue increíble, recuperé como 25 FPS estables.",
    service: "Mantenimiento Térmico Especializado",
    rating: 5
  }
];
