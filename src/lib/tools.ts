import {
  Image,
  FileText,
  Scale,
  Calculator,
  BarChart3,
  FileSpreadsheet,
  Megaphone,
  MapPin,
  Video,
  UserPlus,
  FileSignature,
  LayoutDashboard,
  Users,
} from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: typeof Image;
  path: string;
  category: "captacion" | "comercializacion" | "analisis" | "legal" | "contenido" | "formacion";
  ready: boolean;
}

export const tools: Tool[] = [
  {
    id: "home-staging",
    title: "Convierte cualquier inmueble en irresistible",
    description: "Atrae compradores rápidamente con imágenes que venden. Inmuebles que enamoran al instante",
    icon: Image,
    path: "/herramientas/home-staging",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "descripciones",
    title: "Olvídate del bloqueo creativo: anuncios listos en segundos",
    description: "Crea y optimiza textos inmobiliarios profesionales",
    icon: FileText,
    path: "/herramientas/descripciones",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "consultor-legal",
    title: "Resuelve dudas legales al instante sin complicaciones",
    description:
      "Asesoría legal rápida para tus operaciones inmobiliarias, totalmente adaptado al marco jurídico paraguayo",
    icon: Scale,
    path: "/herramientas/consultor-legal",
    category: "legal",
    ready: true,
  },
  {
    id: "costes",
    title: "Calcula todos los costes al instante",
    description: "Evita sorpresas y ayuda a tus clientes a planificar cada operación con precisión",
    icon: Calculator,
    path: "/herramientas/costes",
    category: "analisis",
    ready: true,
  },
  {
    id: "rentabilidad",
    title: "Conoce la rentabilidad real al instante",
    description: "Tusclientes sabrán que toman decisiones seguras y maximizando sus beneficios",
    icon: BarChart3,
    path: "/herramientas/rentabilidad",
    category: "analisis",
    ready: true,
  },
  {
    id: "informes",
    title: "Informes profesionales en minutos",
    description: "Genera informes profesionales personalizados en 1 solo clic",
    icon: FileSpreadsheet,
    path: "/herramientas/informes",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "anuncios",
    title: "Generador de Anuncios",
    description: "Crea anuncios para redes sociales y portales",
    icon: Megaphone,
    path: "/herramientas/anuncios",
    category: "contenido",
    ready: true,
  },
  {
    id: "entorno",
    title: "Descubre el entorno antes de vender",
    description:
      "Describe la zona y servicios cercanos al inmueble. Información detallada que convence a los compradores",
    icon: MapPin,
    path: "/herramientas/entorno",
    category: "contenido",
    ready: true,
  },
  {
    id: "guiones",
    title: "Crea guiones de videos que venden sin esfuerzo",
    description: "Scripts para Reels, TikTok y YouTube. Guiones listos para captar la atención de tus clientes",
    icon: Video,
    path: "/herramientas/guiones",
    category: "contenido",
    ready: true,
  },
  {
    id: "captacion",
    title: "Consigue nuevos clientes sin esfuerzo",
    description:
      "Scripts y argumentarios para captar propietarios. Asistente inteligente que impulsa tu captación inmobiliaria",
    icon: UserPlus,
    path: "/herramientas/captacion",
    category: "captacion",
    ready: true,
  },
  {
    id: "contratos",
    title: "Contratos listos en segundos",
    description: "Genera documentos legales sin complicaciones ni errores, adaptados a leyes paraguayas",
    icon: FileSignature,
    path: "/herramientas/contratos",
    category: "legal",
    ready: true,
  },
  {
    id: "roleplay",
    title: "Entrena tus ventas con clientes simulados",
    description: "Entrena negociación con clientes simulados por IA. De agente en formación a top producer",
    icon: Users,
    path: "/herramientas/roleplay",
    category: "formacion",
    ready: true,
  },
];

export const dashboardItem = {
  title: "Dashboard",
  icon: LayoutDashboard,
  path: "/",
};
