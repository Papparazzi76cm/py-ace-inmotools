import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, FileText, Sparkles, Loader2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { useInmoAI } from "@/hooks/useInmoAI";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

const estilos = [
  { value: "formal", label: "Formal" },
  { value: "comercial", label: "Comercial" },
  { value: "directo", label: "Directo" },
  { value: "emocional", label: "Emocional" },
  { value: "lujo", label: "Lujo" },
];

const DescripcionesPage = () => {
  const [tipo, setTipo] = useState("");
  const [estilo, setEstilo] = useState("comercial");
  const [habitaciones, setHabitaciones] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [extras, setExtras] = useState("");
  const [resultadoDesc, setResultadoDesc] = useState<{ corta: string; larga: string; redes: string } | null>(null);
  const [resultadoAnuncios, setResultadoAnuncios] = useState<{ facebook: string; instagram: string; portal: string } | null>(null);
  const { generate, loading } = useInmoAI();

  const generarDescripciones = async () => {
    const result = await generate("descripciones", {
      tipo, estilo, habitaciones, superficie, ubicacion, extras,
    });
    if (result) {
      setResultadoDesc({
        corta: result.corta || "",
        larga: result.larga || "",
        redes: result.redes || "",
      });
    }
  };

  const generarAnuncios = async () => {
    const result = await generate("anuncios", {
      tipo, precio, ubicacion, caracteristicas: extras,
    });
    if (result) {
      setResultadoAnuncios({
        facebook: result.facebook || "",
        instagram: result.instagram || "",
        portal: result.portal || "",
      });
    }
  };

  const copiar = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <UsageLimitBanner toolId="descripciones" />
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Descripciones y Anuncios</h1>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario compartido */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Datos del Inmueble</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de inmueble</Label>
              <Input placeholder="Casa, departamento, terreno..." value={tipo} onChange={(e) => setTipo(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Habitaciones</Label>
                <Input type="number" placeholder="3" value={habitaciones} onChange={(e) => setHabitaciones(e.target.value)} />
              </div>
              <div>
                <Label>Superficie (m²)</Label>
                <Input type="number" placeholder="120" value={superficie} onChange={(e) => setSuperficie(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Ubicación</Label>
              <Input placeholder="Asunción, Barrio..." value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
            </div>
            <div>
              <Label>Precio</Label>
              <Input placeholder="USD 85.000" value={precio} onChange={(e) => setPrecio(e.target.value)} />
            </div>
            <div>
              <Label>Estilo de redacción</Label>
              <Select value={estilo} onValueChange={setEstilo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {estilos.map((e) => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Extras / Características</Label>
              <Textarea placeholder="Piscina, garaje doble, vista panorámica..." value={extras} onChange={(e) => setExtras(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={generarDescripciones} className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                Descripciones
              </Button>
              <Button onClick={generarAnuncios} className="w-full" disabled={loading} variant="outline">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Megaphone className="h-4 w-4 mr-2" />}
                Anuncios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados con tabs */}
        <div className="space-y-4">
          {(resultadoDesc || resultadoAnuncios) ? (
            <Tabs defaultValue={resultadoDesc ? "descripciones" : "anuncios"}>
              <TabsList className="w-full">
                <TabsTrigger value="descripciones" className="flex-1" disabled={!resultadoDesc}>
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Descripciones
                </TabsTrigger>
                <TabsTrigger value="anuncios" className="flex-1" disabled={!resultadoAnuncios}>
                  <Megaphone className="h-3.5 w-3.5 mr-1.5" /> Anuncios
                </TabsTrigger>
              </TabsList>
              <TabsContent value="descripciones" className="space-y-4 mt-4">
                {resultadoDesc && (
                  <>
                    <ResultCard title="Versión Corta" text={resultadoDesc.corta} onCopy={() => copiar(resultadoDesc.corta, "Versión corta")} />
                    <ResultCard title="Versión Larga" text={resultadoDesc.larga} onCopy={() => copiar(resultadoDesc.larga, "Versión larga")} />
                    <ResultCard title="Redes Sociales" text={resultadoDesc.redes} onCopy={() => copiar(resultadoDesc.redes, "Versión redes")} />
                  </>
                )}
              </TabsContent>
              <TabsContent value="anuncios" className="space-y-4 mt-4">
                {resultadoAnuncios && (
                  <>
                    <ResultCard title="Facebook Ads" text={resultadoAnuncios.facebook} onCopy={() => copiar(resultadoAnuncios.facebook, "Facebook")} />
                    <ResultCard title="Instagram" text={resultadoAnuncios.instagram} onCopy={() => copiar(resultadoAnuncios.instagram, "Instagram")} />
                    <ResultCard title="Portal Inmobiliario" text={resultadoAnuncios.portal} onCopy={() => copiar(resultadoAnuncios.portal, "Portal")} />
                  </>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-8 text-center text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Completá los datos y presioná "Descripciones" o "Anuncios" para generar textos con IA.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

function ResultCard({ title, text, onCopy }: { title: string; text: string; onCopy: () => void }) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCopy} className="h-8 w-8">
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  );
}

export default DescripcionesPage;
