import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";

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
  const [extras, setExtras] = useState("");
  const [resultado, setResultado] = useState<{ corta: string; larga: string; redes: string } | null>(null);

  const generar = () => {
    const tipoText = tipo || "propiedad";
    const habText = habitaciones ? `${habitaciones} habitaciones` : "";
    const supText = superficie ? `${superficie} m²` : "";
    const ubText = ubicacion ? `en ${ubicacion}` : "";
    const detalles = [habText, supText, ubText].filter(Boolean).join(", ");

    const toneMap: Record<string, { adj: string; opener: string }> = {
      formal: { adj: "excepcional", opener: "Presentamos" },
      comercial: { adj: "increíble", opener: "¡No pierdas esta oportunidad!" },
      directo: { adj: "ideal", opener: "Disponible ahora:" },
      emocional: { adj: "soñada", opener: "Imagina vivir en" },
      lujo: { adj: "exclusiva", opener: "Una joya inmobiliaria:" },
    };

    const tone = toneMap[estilo] || toneMap.comercial;

    const corta = `${tone.opener} ${tipoText} ${tone.adj}${detalles ? ` con ${detalles}` : ""}. ${extras ? extras + "." : "Contacta para más información."}`;

    const larga = `${tone.opener} esta ${tone.adj} ${tipoText}${ubText ? ` ubicada ${ubText}` : ""}.\n\n${
      detalles ? `Cuenta con ${detalles}, ` : ""
    }ofreciendo el espacio perfecto para ${
      estilo === "lujo" ? "quienes buscan lo mejor" : "toda la familia"
    }.\n\n${
      extras ? `Características destacadas: ${extras}.\n\n` : ""
    }Una oportunidad que no querrás dejar pasar. ¡Agenda tu visita hoy!`;

    const redes = `🏠 ${tipoText.charAt(0).toUpperCase() + tipoText.slice(1)} ${tone.adj}${ubText ? ` ${ubText}` : ""}\n${
      detalles ? `📐 ${detalles}\n` : ""
    }${extras ? `✨ ${extras}\n` : ""}📩 ¡Escríbenos para más info!\n#inmobiliaria #paraguay #realestate`;

    setResultado({ corta, larga, redes });
  };

  const copiar = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiada al portapapeles`);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Generador de Descripciones</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <Button onClick={generar} className="w-full">
              Generar Descripciones
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {resultado ? (
            <>
              <ResultCard title="Versión Corta" text={resultado.corta} onCopy={() => copiar(resultado.corta, "Versión corta")} />
              <ResultCard title="Versión Larga" text={resultado.larga} onCopy={() => copiar(resultado.larga, "Versión larga")} />
              <ResultCard title="Redes Sociales" text={resultado.redes} onCopy={() => copiar(resultado.redes, "Versión redes")} />
            </>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-8 text-center text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Completa los datos y presiona "Generar" para ver las descripciones.</p>
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
