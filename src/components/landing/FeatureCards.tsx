import { motion } from "framer-motion";
import { tools } from "@/lib/tools";
import { Cpu } from "lucide-react";

const FeatureCards = () => {
  return (
    <section className="relative py-24 px-4" id="features">
      {/* Background gradient band */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
            <Cpu className="h-3 w-3" /> Herramientas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Todo lo que necesitás,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-primary to-cyan-400 bg-clip-text text-transparent">
              en un solo lugar
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada herramienta está diseñada para resolver un problema real del día a día inmobiliario.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40"
            >
              {/* Hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-blue-400/20 group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-foreground font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>

                {tool.ready ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary glow-pulse" />
                    Disponible
                  </span>
                ) : (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    Próximamente
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
