import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Leaf, Heart, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const About = () => {
  const { t } = useTranslation();

  const values = [
    { icon: Leaf, titleKey: "about.sustainabilityFirst", descKey: "about.sustainabilityDesc" },
    { icon: Heart, titleKey: "about.familySafe", descKey: "about.familySafeDesc" },
    { icon: Users, titleKey: "about.communityDriven", descKey: "about.communityDesc" },
    { icon: Globe, titleKey: "about.localImpact", descKey: "about.impactDesc" },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about.mission')}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.missionText')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{t(v.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">{t('about.story')}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {t('about.storyText1')}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.storyText2')}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
