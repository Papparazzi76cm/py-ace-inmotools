import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AgencyProfile {
  agency_name: string;
  agency_phone: string;
  agency_email: string;
  agency_logo_url: string;
  full_name: string;
}

export function useAgencyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AgencyProfile>({
    agency_name: "",
    agency_phone: "",
    agency_email: "",
    agency_logo_url: "",
    full_name: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("agency_name, agency_phone, agency_email, agency_logo_url, full_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({
            agency_name: data.agency_name || "",
            agency_phone: (data as any).agency_phone || "",
            agency_email: (data as any).agency_email || "",
            agency_logo_url: (data as any).agency_logo_url || "",
            full_name: data.full_name || "",
          });
        }
        setLoading(false);
      });
  }, [user]);

  const updateProfile = async (updates: Partial<AgencyProfile>) => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update(updates as any)
      .eq("user_id", user.id);
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/logo.${ext}`;

    const { error } = await supabase.storage
      .from("agency-logos")
      .upload(path, file, { upsert: true });

    if (error) return null;

    const { data } = supabase.storage.from("agency-logos").getPublicUrl(path);
    const url = data.publicUrl + "?t=" + Date.now();
    await updateProfile({ agency_logo_url: url } as any);
    return url;
  };

  return { profile, loading, updateProfile, uploadLogo };
}
