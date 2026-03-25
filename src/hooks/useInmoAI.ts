import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useInmoAI() {
  const [loading, setLoading] = useState(false);

  const generate = async (tool: string, data: Record<string, string>) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("inmo-ai", {
        body: { tool, data },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      return result.result;
    } catch (e: any) {
      toast.error(e.message || "Error al generar con IA");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
}
