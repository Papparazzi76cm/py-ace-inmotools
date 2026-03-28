import {
  Image,
  FileText,
  Scale,
  Calculator,
  BarChart3,
  FileSpreadsheet,
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
    title: "Convertí cualquier inmueble en irresistible",
    description: "Atraé compradores rápido con imágenes que venden. Inmuebles que enamoran al instante",
    icon: Image,
    path: "/herramientas/home-staging",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "descripciones",
    title: "Olvidate del bloqueo creativo: textos y anuncios listos",
    description: "Creá descripciones y anuncios profesionales para portales y redes sociales en segundos",
    icon: FileText,
    path: "/herramientas/descripciones",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "consultor-legal",
    title: "Resolvé dudas legales al instante sin complicaciones",
    description:
      "Asesoría legal rápida para tus operaciones inmobiliarias, adaptada al marco jurídico paraguayo",
    icon: Scale,
    path: "/herramientas/consultor-legal",
    category: "legal",
    ready: true,
  },
  {
    id: "costes",
    title: "Calculá todos los costes al instante",
    description: "Evitá sorpresas y ayudá a tus clientes a planificar cada operación con precisión",
    icon: Calculator,
    path: "/herramientas/costes",
    category: "analisis",
    ready: true,
  },
  {
    id: "rentabilidad",
    title: "Conocé la rentabilidad real al instante",
    description: "Tus clientes van a saber que toman decisiones seguras maximizando sus beneficios",
    icon: BarChart3,
    path: "/herramientas/rentabilidad",
    category: "analisis",
    ready: true,
  },
  {
    id: "informes",
    title: "Informes profesionales en minutos",
    description: "Generá informes profesionales personalizados en 1 solo clic",
    icon: FileSpreadsheet,
    path: "/herramientas/informes",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "entorno",
    title: "Descubrí el entorno antes de vender",
    description:
      "Describí la zona y servicios cercanos al inmueble. Información detallada que convence a los compradores",
    icon: MapPin,
    path: "/herramientas/entorno",
    category: "contenido",
    ready: true,
  },
  {
    id: "guiones",
    title: "Creá guiones de videos que venden sin esfuerzo",
    description: "Scripts para Reels, TikTok y YouTube. Guiones listos para captar la atención de tus clientes",
    icon: Video,
    path: "/herramientas/guiones",
    category: "contenido",
    ready: true,
  },
  {
    id: "captacion",
    title: "Conseguí nuevos clientes sin esfuerzo",
    description:
      "Scripts y argumentarios para captar propietarios. Asistente inteligente que impulsa tu captación",
    icon: UserPlus,
    path: "/herramientas/captacion",
    category: "captacion",
    ready: true,
  },
  {
    id: "contratos",
    title: "Contratos listos en segundos",
    description: "Generá documentos legales sin complicaciones ni errores, adaptados a leyes paraguayas",
    icon: FileSignature,
    path: "/herramientas/contratos",
    category: "legal",
    ready: true,
  },
  {
    id: "roleplay",
    title: "Entrená tus ventas con clientes simulados",
    description: "Entrená negociación con clientes simulados por IA. De agente en formación a top producer",
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
