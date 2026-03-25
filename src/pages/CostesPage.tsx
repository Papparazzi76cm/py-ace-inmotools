import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, ArrowDown, ArrowUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CostesPage = () => {
  const [precio, setPrecio] = useState("");
  const [operacion, setOperacion] = useState("compraventa");
  const [comision, setComision] = useState("3");
  const [resultado, setResultado] = useState<{
    comprador: { impuestos: number; notaria: number; registro: number; gestoria: number; total: number };
    vendedor: { plusvalia: number; irp: number; comision: number; total: number };
  } | null>(null);

  const calcular = () => {
    const p = parseFloat(precio);
    if (!p || p <= 0) return;

    const comPct = parseFloat(comision) / 100;

    // Costes del comprador (estimaciones Paraguay)
    const impuestosComprador = p * 0.015; // IVA transferencia ~1.5%
    const notaria = p * 0.005; // ~0.5%
    const registro = p * 0.003; // ~0.3%
    const gestoria = Math.max(p * 0.002, 200000); // ~0.2% min 200k Gs

    // Costes del vendedor
    const plusvalia = p * 0.025; // ~2.5% estimado
    const irp = p * 0.01; // IRP ~1%
    const comisionMonto = p * comPct;

    setResultado({
      comprador: {
        impuestos: impuestosComprador,
        notaria,
        registro,
        gestoria,
        total: impuestosComprador + notaria + registro + gestoria,
      },
      vendedor: {
        plusvalia,
        irp,
        comision: comisionMonto,
        total: plusvalia + irp + comisionMonto,
      },
    });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(n);

  const fmtUsd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n / 7500);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold">Calculadora de Costes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Datos de la Operación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Precio del inmueble (Gs.)</Label>
              <Input type="number" placeholder="500.000.000" value={precio} onChange={(e) => setPrecio(e.target.value)} />
            </div>
            <div>
              <Label>Tipo de operación</Label>
              <Select value={operacion} onValueChange={setOperacion}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="compraventa">Compraventa</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Comisión inmobiliaria (%)</Label>
              <Input type="number" placeholder="3" value={comision} onChange={(e) => setComision(e.target.value)} />
            </div>
            <Button onClick={calcular} className="w-full">
              Calcular Costes
            </Button>
          </CardContent>
        </Card>

        {resultado ? (
          <>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Comprador</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CostLine label="Impuestos de transferencia" value={resultado.comprador.impuestos} fmt={fmt} fmtUsd={fmtUsd} />
                <CostLine label="Notaría" value={resultado.comprador.notaria} fmt={fmt} fmtUsd={fmtUsd} />
                <CostLine label="Registro" value={resultado.comprador.registro} fmt={fmt} fmtUsd={fmtUsd} />
                <CostLine label="Gestoría" value={resultado.comprador.gestoria} fmt={fmt} fmtUsd={fmtUsd} />
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-primary">{fmt(resultado.comprador.total)}</div>
                    <div className="text-xs text-muted-foreground">{fmtUsd(resultado.comprador.total)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Vendedor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CostLine label="Plusvalía estimada" value={resultado.vendedor.plusvalia} fmt={fmt} fmtUsd={fmtUsd} />
                <CostLine label="IRP" value={resultado.vendedor.irp} fmt={fmt} fmtUsd={fmtUsd} />
                <CostLine label="Comisión inmobiliaria" value={resultado.vendedor.comision} fmt={fmt} fmtUsd={fmtUsd} />
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-primary">{fmt(resultado.vendedor.total)}</div>
                    <div className="text-xs text-muted-foreground">{fmtUsd(resultado.vendedor.total)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="glass-card lg:col-span-2">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Calculator className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Ingresa el precio y presiona "Calcular" para ver el desglose.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

function CostLine({
  label,
  value,
  fmt,
  fmtUsd,
}: {
  label: string;
  value: number;
  fmt: (n: number) => string;
  fmtUsd: (n: number) => string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right">
        <div>{fmt(value)}</div>
        <div className="text-[11px] text-muted-foreground">{fmtUsd(value)}</div>
      </div>
    </div>
  );
}

export default CostesPage;
