import { useParams, useNavigate } from "react-router-dom";
import { tools } from "@/lib/tools";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Construction } from "lucide-react";

const ToolPlaceholder = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Herramienta no encontrada.</p>
        <Button variant="ghost" onClick={() => navigate("/")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
      </Button>

      <Card className="glass-card">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
            <tool.icon className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-semibold mb-2">{tool.title}</h1>
          <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
          <Badge variant="secondary" className="gap-1">
            <Construction className="h-3 w-3" />
            En desarrollo
          </Badge>
          <p className="text-xs text-muted-foreground mt-6">
            Esta herramienta estará disponible próximamente. ¡Estamos trabajando en ella!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolPlaceholder;
