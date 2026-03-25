import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Sparkles, Loader2 } from "lucide-react";
import { useInmoAI } from "@/hooks/useInmoAI";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

const EntornoPage = () => {
  const [zona, setZona] = useState("");
  const [detalles, setDetalles] = useState("");
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
    if (result) setResultado(result);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <UsageLimitBanner toolId="entorno" />
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Descripción de Entorno</h1>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Zona o Dirección</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Zona / Barrio / Dirección</Label><Input placeholder="Villa Morra, Asunción" value={zona} onChange={(e) => setZona(e.target.value)} /></div>
            <div><Label>Detalles adicionales (opcional)</Label><Textarea placeholder="Cerca de shopping, zona residencial..." value={detalles} onChange={(e) => setDetalles(e.target.value)} rows={3} /></div>
            <Button onClick={generar} className="w-full" disabled={loading || !zona.trim()}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generando...</> : "Describir Entorno con IA"}
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {resultado ? (
            <>
              <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Descripción</CardTitle></CardHeader>
                <CardContent><p className="text-sm whitespace-pre-line leading-relaxed">{resultado.descripcion}</p></CardContent></Card>
              <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Estilo de Vida</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{resultado.estilo_vida}</p></CardContent></Card>
              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Servicios</CardTitle></CardHeader>
                  <CardContent><ul className="space-y-1">{resultado.servicios?.map((s, i) => <li key={i} className="text-sm flex gap-1"><span className="text-primary">•</span>{s}</li>)}</ul></CardContent></Card>
                <Card className="glass-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Atractivos</CardTitle></CardHeader>
                  <CardContent><ul className="space-y-1">{resultado.atractivos?.map((a, i) => <li key={i} className="text-sm flex gap-1"><span className="text-primary">•</span>{a}</li>)}</ul></CardContent></Card>
              </div>
            </>
          ) : (
            <Card className="glass-card"><CardContent className="p-8 text-center text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" /><p className="text-sm">Ingresa la zona para generar una descripción atractiva del entorno.</p>
            </CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntornoPage;
