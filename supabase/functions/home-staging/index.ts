import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, style, tipoEspacio, estancia, quality, customPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const model = quality === "premium"
      ? "google/gemini-3-pro-image-preview"
      : "google/gemini-2.5-flash-image";

    if (!imageBase64) throw new Error("No se proporcionó imagen");

    const esInterior = tipoEspacio === "interior";
    const espacioLabel = estancia || (esInterior ? "habitación" : "espacio exterior");

    const stylePrompts: Record<string, string> = {
      moderno: `Redecora ${esInterior ? "esta estancia (" + espacioLabel + ")" : "este espacio exterior (" + espacioLabel + ")"} con un estilo moderno y minimalista: muebles de líneas limpias, colores neutros con acentos en negro y madera natural, iluminación cálida LED. Mantén exactamente la misma perspectiva, puertas, ventanas, escaleras y elementos estructurales.`,
      clasico: `Redecora ${esInterior ? "esta estancia (" + espacioLabel + ")" : "este espacio exterior (" + espacioLabel + ")"} con un estilo clásico y elegante: muebles de madera noble, tapicería en tonos beige y dorado, cortinas pesadas, lámparas de araña o apliques clásicos. Mantén exactamente la misma perspectiva y elementos estructurales.`,
      nordico: `Redecora ${esInterior ? "esta estancia (" + espacioLabel + ")" : "este espacio exterior (" + espacioLabel + ")"} con un estilo nórdico escandinavo: muebles de madera clara, textiles blancos y grises, plantas verdes, iluminación natural potenciada. Mantén exactamente la misma perspectiva y elementos estructurales.`,
      industrial: `Redecora ${esInterior ? "esta estancia (" + espacioLabel + ")" : "este espacio exterior (" + espacioLabel + ")"} con un estilo industrial: muebles de metal y madera reciclada, lámparas tipo Edison, acabados en ladrillo visto y concreto. Mantén exactamente la misma perspectiva y elementos estructurales.`,
      boho: `Redecora ${esInterior ? "esta estancia (" + espacioLabel + ")" : "este espacio exterior (" + espacioLabel + ")"} con un estilo bohemio: textiles coloridos y con patrones, plantas abundantes, muebles de ratán y madera, alfombras tejidas, macramé. Mantén exactamente la misma perspectiva y elementos estructurales.`,
      lujo: `Redecora ${esInterior ? "esta estancia (" + espacioLabel + ")" : "este espacio exterior (" + espacioLabel + ")"} con un estilo lujoso premium: muebles de diseñador, mármol, acabados en oro o latón, iluminación ambiental sofisticada, textiles de alta gama. Mantén exactamente la misma perspectiva y elementos estructurales.`,
      vacio: `Elimina todos los muebles y decoración de ${esInterior ? "esta estancia (" + espacioLabel + ")" : "este espacio exterior (" + espacioLabel + ")"}, dejándolo completamente vacío pero limpio y listo para mostrar. Mantén exactamente la misma perspectiva y elementos estructurales. Muestra solo las superficies limpias.`,
    };

    let prompt = stylePrompts[style] || stylePrompts.moderno;

    if (customPrompt && typeof customPrompt === "string" && customPrompt.trim().length > 0) {
      prompt += ` Además, aplica las siguientes instrucciones del usuario: ${customPrompt.trim().slice(0, 500)}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
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
    const images = aiData.choices?.[0]?.message?.images;

    if (!images || images.length === 0) {
      throw new Error("No se generó imagen. Intenta con otra foto o estilo.");
    }

    const resultImageUrl = images[0]?.image_url?.url;

    return new Response(JSON.stringify({ result: { imageUrl: resultImageUrl } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("home-staging error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
