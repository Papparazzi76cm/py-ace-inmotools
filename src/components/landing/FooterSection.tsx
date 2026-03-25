import { Sparkles } from "lucide-react";

const FooterSection = () => (
  <footer className="border-t border-border/40 py-12 px-4">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground text-sm">InmoTools</span>
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} InmoTools. Hecho con IA para agentes inmobiliarios en Paraguay.
      </p>
    </div>
  </footer>
);

export default FooterSection;
