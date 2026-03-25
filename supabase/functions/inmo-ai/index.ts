import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tool, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (tool) {
      case "descripciones": {
        systemPrompt = `Eres un experto copywriter inmobiliario en Paraguay. Genera descripciones profesionales de inmuebles.
Siempre responde en formato JSON con esta estructura exacta:
{"corta": "descripción corta de 1-2 líneas", "larga": "descripción detallada de 4-6 líneas", "redes": "copy para redes sociales con emojis y hashtags"}`;
        userPrompt = `Genera descripciones para: Tipo: ${data.tipo || "propiedad"}. Habitaciones: ${data.habitaciones || "N/A"}. Superficie: ${data.superficie || "N/A"} m². Ubicación: ${data.ubicacion || "Paraguay"}. Extras: ${data.extras || "ninguno"}. Estilo: ${data.estilo || "comercial"}.`;
        break;
      }
      case "consultor-legal": {
        systemPrompt = `Eres un consultor jurídico inmobiliario especializado en la legislación de Paraguay.
Responde con lenguaje claro y accesible. Incluye referencias a leyes paraguayas cuando sea posible.
IMPORTANTE: Aclara que tus respuestas son orientativas y no sustituyen asesoramiento legal profesional.
Responde en formato JSON: {"respuesta": "texto principal", "resumen": "resumen en 2-3 puntos", "recomendaciones": ["recomendación 1", "recomendación 2"]}`;
        userPrompt = data.consulta;
        break;
      }
      case "anuncios": {
        systemPrompt = `Eres un experto en marketing inmobiliario digital en Paraguay.
Genera anuncios adaptados a cada plataforma. Responde en JSON:
{"facebook": "texto para Facebook Ads", "instagram": "caption para Instagram con emojis y hashtags", "portal": "descripción para portales inmobiliarios profesional"}`;
        userPrompt = `Genera anuncios para: Tipo: ${data.tipo}. Precio: ${data.precio}. Ubicación: ${data.ubicacion}. Características: ${data.caracteristicas}. Público objetivo: ${data.publico || "general"}.`;
        break;
      }
      case "entorno": {
        systemPrompt = `Eres un experto en el mercado inmobiliario de Paraguay. Conoces bien las zonas, barrios y ciudades.
Genera una descripción atractiva del entorno/zona para uso inmobiliario.
Responde en JSON: {"descripcion": "texto descriptivo del entorno", "servicios": ["servicio 1", "servicio 2"], "estilo_vida": "descripción del estilo de vida de la zona", "atractivos": ["atractivo 1", "atractivo 2"]}`;
        userPrompt = `Describe el entorno inmobiliario de: ${data.zona}. ${data.detalles || ""}`;
        break;
      }
      case "guiones": {
        systemPrompt = `Eres un creador de contenido inmobiliario para redes sociales en Paraguay.
Genera guiones profesionales y dinámicos. Responde en JSON:
{"reel": "guión para Instagram Reel (30-60 seg)", "tiktok": "guión para TikTok (15-60 seg)", "youtube": "guión para YouTube (2-3 min con intro, desarrollo y cierre)"}`;
        userPrompt = `Guión para inmueble: Tipo: ${data.tipo}. Ubicación: ${data.ubicacion}. Precio: ${data.precio || "consultar"}. Características: ${data.caracteristicas}. Tono: ${data.tono || "profesional y cercano"}.`;
        break;
      }
      case "captacion": {
        systemPrompt = `Eres un experto en captación inmobiliaria en Paraguay. Conoces las mejores técnicas para captar propietarios.
Responde en JSON:
{"script_llamada": "guión para llamada telefónica", "script_puerta": "guión para visita puerta a puerta", "argumentario": "argumentos de venta principales", "objeciones": [{"objecion": "texto objeción", "respuesta": "cómo manejarla"}]}`;
        userPrompt = `Genera material de captación para: Zona: ${data.zona}. Tipo de inmueble: ${data.tipo || "general"}. Contexto: ${data.contexto || "captación general"}.`;
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Herramienta no válida" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos agotados. Contacta al administrador." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI error: ${response.status}`);
    }

    const aiData = await response.json();
    
    // Extract from tool call response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let result;
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      result = parsed.result;
    } else {
      // Fallback: try to parse content as JSON
      const content = aiData.choices?.[0]?.message?.content || "";
      try {
        result = JSON.parse(content);
      } catch {
        result = { raw: content };
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("inmo-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
