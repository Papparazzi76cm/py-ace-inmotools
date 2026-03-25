import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Sparkles, Loader2, Navigation, Copy } from "lucide-react";
import { toast } from "sonner";
import { useInmoAI } from "@/hooks/useInmoAI";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";
import { supabase } from "@/integrations/supabase/client";

const EntornoPage = () => {
  const [zona, setZona] = useState("");
  const [detalles, setDetalles] = useState("");
  const [geolocating, setGeolocating] = useState(false);
  const [mapQuery, setMapQuery] = useState("");
  const [resultado, setResultado] = useState<{
    descripcion: string;
    servicios: string[];
    estilo_vida: string;
    atractivos: string[];
  } | null>(null);
  const { generate, loading } = useInmoAI();

  const generar = async () => {
    if (!zona.trim()) return;
    const result = await generate("entorno", { zona, detalles });
    if (result) {
      setResultado(result);
      setMapQuery(zona);
    }
  };

  const geolocalizarme = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización.");
      return;
    }

    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await supabase.functions.invoke("geocode", {
            body: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          if (data?.address) {
            setZona(data.address);
            toast.success("Dirección detectada correctamente");
          } else {
            setZona(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
          }
        } catch {
          setZona(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
        } finally {
          setGeolocating(false);
        }
      },
      () => {
        toast.error("No se pudo obtener tu ubicación. Verifica los permisos.");
        setGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const copiar = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Texto copiado al portapapeles");
  };

  const copiarTodo = () => {
    if (!resultado) return;
    const text = `DESCRIPCIÓN DE ENTORNO — ${zona}\n\n` +
      `DESCRIPCIÓN\n${resultado.descripcion}\n\n` +
      `ESTILO DE VIDA\n${resultado.estilo_vida}\n\n` +
      `SERVICIOS\n${resultado.servicios.map(s => `• ${s}`).join("\n")}\n\n` +
      `ATRACTIVOS\n${resultado.atractivos.map(a => `• ${a}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success("Informe de entorno copiado");
  };

  const mapEmbedUrl = mapQuery
    ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}&q=${encodeURIComponent(mapQuery)}&zoom=15&language=es`
    : "";

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <UsageLimitBanner toolId="entorno" />
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Descripción de Entorno</h1>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Zona o Dirección</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Zona / Barrio / Dirección</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  placeholder="Villa Morra, Asunción"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={geolocalizarme}
                  disabled={geolocating}
                  title="Usar mi ubicación"
                >
                  {geolocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Escribe una dirección o pulsa el icono para geolocalizarte
              </p>
            </div>

            <div>
              <Label>Detalles adicionales (opcional)</Label>
              <Textarea
                placeholder="Cerca de shopping, zona residencial..."
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                rows={3}
                className="mt-1.5"
              />
            </div>

            <Button onClick={generar} className="w-full" disabled={loading || !zona.trim()}>
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generando...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Describir Entorno con IA</>
              )}
            </Button>

            {/* Google Maps embed */}
            {mapQuery && mapEmbedUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border">
                <iframe
                  title="Mapa de ubicación"
                  src={mapEmbedUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {resultado ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">Resultado</span>
                <Button variant="outline" size="sm" onClick={copiarTodo}>
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Copiar todo
                </Button>
              </div>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{resultado.descripcion}</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Estilo de Vida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{resultado.estilo_vida}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Servicios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {resultado.servicios?.map((s, i) => (
                        <li key={i} className="text-sm flex gap-1">
                          <span className="text-primary">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Atractivos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {resultado.atractivos?.map((a, i) => (
                        <li key={i} className="text-sm flex gap-1">
                          <span className="text-primary">•</span>{a}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="glass-card h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="p-8 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm mb-1">Ingresa la zona para generar una descripción</p>
                <p className="text-xs opacity-60">
                  La IA analizará el entorno y generará una descripción atractiva
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntornoPage;
