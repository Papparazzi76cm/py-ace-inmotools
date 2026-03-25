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
  LayoutDashboard,
} from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: typeof Image;
  path: string;
  category: "captacion" | "comercializacion" | "analisis" | "legal" | "contenido";
  ready: boolean;
}

export const tools: Tool[] = [
  {
    id: "home-staging",
    title: "Home Staging IA",
    description: "Edita imágenes de inmuebles con inteligencia artificial",
    icon: Image,
    path: "/herramientas/home-staging",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "descripciones",
    title: "Generador de Descripciones",
    description: "Crea y optimiza textos inmobiliarios profesionales",
    icon: FileText,
    path: "/herramientas/descripciones",
    category: "comercializacion",
    ready: true,
  },
  {
    id: "consultor-legal",
    title: "Consultor Jurídico",
    description: "Resuelve dudas legales inmobiliarias de Paraguay",
    icon: Scale,
    path: "/herramientas/consultor-legal",
    category: "legal",
    ready: true,
  },
  {
    id: "costes",
    title: "Calculadora de Costes",
    description: "Desglose completo de costes de compraventa",
    icon: Calculator,
    path: "/herramientas/costes",
    category: "analisis",
    ready: true,
  },
  {
    id: "rentabilidad",
    title: "Calculadora de Rentabilidad",
    description: "Analiza la rentabilidad de inversiones inmobiliarias",
    icon: BarChart3,
    path: "/herramientas/rentabilidad",
    category: "analisis",
    ready: true,
  },
  {
    id: "informes",
    title: "Informes de Valoración",
    description: "Genera informes profesionales personalizados",
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
    title: "Descripción de Entorno",
    description: "Describe la zona y servicios cercanos al inmueble",
    icon: MapPin,
    path: "/herramientas/entorno",
    category: "contenido",
    ready: true,
  },
  {
    id: "guiones",
    title: "Guiones de Vídeo",
    description: "Scripts para Reels, TikTok y YouTube",
    icon: Video,
    path: "/herramientas/guiones",
    category: "contenido",
    ready: true,
  },
  {
    id: "captacion",
    title: "Asistente de Captación",
    description: "Scripts y argumentarios para captar propietarios",
    icon: UserPlus,
    path: "/herramientas/captacion",
    category: "captacion",
    ready: true,
  },
];

export const dashboardItem = {
  title: "Dashboard",
  icon: LayoutDashboard,
  path: "/",
};
