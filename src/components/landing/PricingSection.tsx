import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap } from "lucide-react";

interface PricingSectionProps {
  onGetStarted: () => void;
}

const PricingSection = ({ onGetStarted }: PricingSectionProps) => {
  const plans = [
    {
      name: "Mensual",
      price: "19",
      period: "/mes",
      icon: Zap,
      features: [
        "Acceso a todas las herramientas",
        "Generaciones ilimitadas con IA",
        "Soporte por email",
        "Actualizaciones incluidas",
      ],
      popular: false,
    },
    {
      name: "Anual",
      price: "12",
      period: "/mes",
      badge: "Ahorrá 37%",
      icon: Crown,
      features: [
        "Todo del plan mensual",
        "Generaciones ilimitadas con IA",
        "Soporte prioritario",
        "Nuevas herramientas primero",
        "Facturación anual: $144/año",
      ],
      popular: true,
    },
  ];

  return (
    <section className="relative py-24 px-4" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Precios{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              simples y transparentes
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sin sorpresas. Acceso completo a todas las herramientas desde el primer día.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.popular
                  ? "border-primary/50 bg-card shadow-2xl shadow-primary/10 scale-[1.02]"
                  : "border-border/50 bg-card/60 backdrop-blur-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-primary/20" : "bg-muted"}`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={onGetStarted}
                className={`w-full rounded-xl py-5 ${
                  plan.popular
                    ? "shadow-lg shadow-primary/20"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Empezar Ahora
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
