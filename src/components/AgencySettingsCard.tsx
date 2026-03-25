import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAgencyProfile } from "@/hooks/useAgencyProfile";
import { Building2, Upload, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AgencySettingsCardProps {
  collapsed?: boolean;
}

export function AgencySettingsCard({ collapsed }: AgencySettingsCardProps) {
  const { profile, updateProfile, uploadLogo } = useAgencyProfile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [initialized, setInitialized] = useState(false);

  // Sync state once profile loads
  if (!initialized && profile.agency_name !== undefined) {
    setName(profile.agency_name);
    setPhone(profile.agency_phone);
    setEmail(profile.agency_email);
    setInitialized(true);
  }

  const guardar = async () => {
    setSaving(true);
    await updateProfile({
      agency_name: name,
      agency_phone: phone,
      agency_email: email,
    });
    setSaving(false);
    toast.success("Datos de agencia guardados");
  };

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("El logo no debe superar 2MB");
      return;
    }
    setUploading(true);
    const url = await uploadLogo(file);
    setUploading(false);
    if (url) toast.success("Logo actualizado");
    else toast.error("Error al subir el logo");
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Datos de la Agencia (para PDF)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          {profile.agency_logo_url ? (
            <img
              src={profile.agency_logo_url}
              alt="Logo"
              className="w-12 h-12 rounded-lg object-contain border border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
              {profile.agency_logo_url ? "Cambiar logo" : "Subir logo"}
            </Button>
            <p className="text-[10px] text-muted-foreground mt-0.5">Máx 2MB, PNG/JPG</p>
          </div>
        </div>

        <div>
          <Label className="text-xs">Nombre de la agencia</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mi Inmobiliaria" className="mt-1 h-8 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Teléfono</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+595 9XX..." className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@..." className="mt-1 h-8 text-sm" />
          </div>
        </div>
        <Button size="sm" onClick={guardar} className="w-full" disabled={saving}>
          {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
          Guardar datos
        </Button>
      </CardContent>
    </Card>
  );
}
