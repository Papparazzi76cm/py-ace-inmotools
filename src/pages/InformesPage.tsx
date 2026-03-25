import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Sparkles, Loader2, Copy, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useInmoAI } from "@/hooks/useInmoAI";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";
import { exportInformePdf } from "@/lib/exportInformePdf";

const tiposInmueble = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento / Piso" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
  { value: "duplex", label: "Dúplex" },
  { value: "edificio", label: "Edificio" },
  { value: "galpon", label: "Galpón / Nave" },
];

const estadosConservacion = [
  { value: "nuevo", label: "Nuevo / A estrenar" },
  { value: "excelente", label: "Excelente" },
  { value: "bueno", label: "Bueno" },
  { value: "regular", label: "Regular" },
  { value: "reformar", label: "A reformar" },
];

interface InformeResult {
  resumen_ejecutivo: string;
  analisis_mercado: string;
  valoracion_estimada: string;
  factores_positivos: string[];
  factores_negativos: string[];
  recomendaciones: string[];
  metodologia: string;
  disclaimer: string;
}

const InformesPage = () => {
  const [tipo, setTipo] = useState("casa");
  const [ubicacion, setUbicacion] = useState("");
  const [superficie, setSuperficie] = useState("");
  const [superficieTerreno, setSuperficieTerreno] = useState("");
  const [habitaciones, setHabitaciones] = useState("");
  const [banos, setBanos] = useState("");
  const [antiguedad, setAntiguedad] = useState("");
  const [estado, setEstado] = useState("bueno");
  const [extras, setExtras] = useState("");
  const [precioReferencia, setPrecioReferencia] = useState("");
  const [resultado, setResultado] = useState<InformeResult | null>(null);
  const { generate, loading } = useInmoAI();

  const generar = async () => {
    if (!ubicacion.trim()) {
      toast.error("Indica la ubicación del inmueble.");
      return;
    }

    const result = await generate("informes", {
      tipo,
      ubicacion,
      superficie,
      superficieTerreno,
      habitaciones,
      banos,
      antiguedad,
      estado,
      extras,
      precioReferencia,
    });

    if (result) {
      setResultado({
        resumen_ejecutivo: result.resumen_ejecutivo || "",
        analisis_mercado: result.analisis_mercado || "",
        valoracion_estimada: result.valoracion_estimada || "",
        factores_positivos: result.factores_positivos || [],
        factores_negativos: result.factores_negativos || [],
        recomendaciones: result.recomendaciones || [],
        metodologia: result.metodologia || "",
        disclaimer: result.disclaimer || "",
      });
    }
  };

  const copiarInforme = () => {
    if (!resultado) return;
    const text = `INFORME DE VALORACIÓN INMOBILIARIA\n\n` +
      `RESUMEN EJECUTIVO\n${resultado.resumen_ejecutivo}\n\n` +
      `ANÁLISIS DE MERCADO\n${resultado.analisis_mercado}\n\n` +
      `VALORACIÓN ESTIMADA\n${resultado.valoracion_estimada}\n\n` +
      `FACTORES POSITIVOS\n${resultado.factores_positivos.map(f => `• ${f}`).join("\n")}\n\n` +
      `FACTORES NEGATIVOS\n${resultado.factores_negativos.map(f => `• ${f}`).join("\n")}\n\n` +
      `RECOMENDACIONES\n${resultado.recomendaciones.map(r => `• ${r}`).join("\n")}\n\n` +
      `METODOLOGÍA\n${resultado.metodologia}\n\n` +
      `NOTA LEGAL\n${resultado.disclaimer}`;
    navigator.clipboard.writeText(text);
    toast.success("Informe copiado al portapapeles");
  };

  const imprimirInforme = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <UsageLimitBanner toolId="informes" />
      <div className="flex items-center gap-2 mb-6">
        <FileSpreadsheet className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Informes de Valoración</h1>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Datos del Inmueble</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tipo de inmueble</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tiposInmueble.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ubicación *</Label>
              <Input
                placeholder="Ciudad, barrio, calle..."
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Superficie construida (m²)</Label>
                <Input type="number" placeholder="120" value={superficie} onChange={(e) => setSuperficie(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Superficie terreno (m²)</Label>
                <Input type="number" placeholder="300" value={superficieTerreno} onChange={(e) => setSuperficieTerreno(e.target.value)} className="mt-1.5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Habitaciones</Label>
                <Input type="number" placeholder="3" value={habitaciones} onChange={(e) => setHabitaciones(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Baños</Label>
                <Input type="number" placeholder="2" value={banos} onChange={(e) => setBanos(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Antigüedad</Label>
                <Input type="number" placeholder="5 años" value={antiguedad} onChange={(e) => setAntiguedad(e.target.value)} className="mt-1.5" />
              </div>
            </div>

            <div>
              <Label>Estado de conservación</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {estadosConservacion.map((e) => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Precio de referencia (opcional)</Label>
              <Input
                placeholder="Ej: 150.000 USD"
                value={precioReferencia}
                onChange={(e) => setPrecioReferencia(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Extras y características</Label>
              <Textarea
                placeholder="Piscina, garaje, ascensor, reforma reciente..."
                value={extras}
                onChange={(e) => setExtras(e.target.value)}
                rows={3}
                className="mt-1.5"
              />
            </div>

            <Button onClick={generar} className="w-full" disabled={loading || !ubicacion.trim()}>
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generando informe...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Generar Informe</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 print:col-span-3">
          {resultado ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between print:hidden">
                <span className="text-sm font-medium text-primary">Informe generado</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copiarInforme}>
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copiar
                  </Button>
                  <Button variant="outline" size="sm" onClick={imprimirInforme}>
                    <Printer className="h-3.5 w-3.5 mr-1.5" /> Imprimir
                  </Button>
                </div>
              </div>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-primary">Resumen Ejecutivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{resultado.resumen_ejecutivo}</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-primary">Valoración Estimada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed font-medium">{resultado.valoracion_estimada}</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Análisis de Mercado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{resultado.analisis_mercado}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-500">Factores Positivos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {resultado.factores_positivos.map((f, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-destructive">Factores Negativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {resultado.factores_negativos.map((f, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-destructive mt-0.5">✗</span> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recomendaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {resultado.recomendaciones.map((r, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">→</span> {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Metodología</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{resultado.metodologia}</p>
                </CardContent>
              </Card>

              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-[10px] text-muted-foreground leading-relaxed">{resultado.disclaimer}</p>
              </div>
            </div>
          ) : (
            <Card className="glass-card h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="p-8 text-center text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm mb-1">Completa los datos del inmueble</p>
                <p className="text-xs opacity-60">
                  La IA generará un informe de valoración profesional personalizado
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformesPage;
