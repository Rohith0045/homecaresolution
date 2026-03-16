import { Droplets, Leaf, ShieldCheck, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const SustainabilitySection = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Leaf,
      titleKey: "sustainability.plantBased",
      descKey: "sustainability.plantBasedDesc",
    },
    {
      icon: ShieldCheck,
      titleKey: "sustainability.safetyTested",
      descKey: "sustainability.safetyTestedDesc",
    },
    {
      icon: Droplets,
      titleKey: "sustainability.biodegradable",
      descKey: "sustainability.biodegradableDesc",
    },
    {
      icon: FlaskConical,
      titleKey: "sustainability.transparentIng",
      descKey: "sustainability.transparentIngDesc",
    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('sustainability.title')}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('sustainability.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{t(v.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
