import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lat, lng } = await req.json();
    const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!GOOGLE_MAPS_API_KEY) throw new Error("GOOGLE_MAPS_API_KEY is not configured");

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=es`;
    const response = await fetch(url);
    const data = await response.json();

    let address = "";
    if (data.status === "OK" && data.results?.length > 0) {
      address = data.results[0].formatted_address;
    }

    return new Response(JSON.stringify({ address }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("geocode error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
