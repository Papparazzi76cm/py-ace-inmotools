import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface LandingNavProps {
  onGetStarted: () => void;
}

const LandingNav = ({ onGetStarted }: LandingNavProps) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">InmoTools</span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Herramientas</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">Cómo funciona</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Precios</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onGetStarted}>
            Iniciar Sesión
          </Button>
          <Button size="sm" onClick={onGetStarted} className="rounded-lg shadow-sm shadow-primary/20">
            Registrarse
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNav;
