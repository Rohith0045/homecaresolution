import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Leaf, Baby, Recycle } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";
import { useTranslation } from "@/hooks/useTranslation";

const HeroSection = () => {
  const { t } = useTranslation();
  
  const features = [
    { icon: Leaf, label: t('hero.ecoFriendly') },
    { icon: Shield, label: t('hero.nonToxic') },
    { icon: Recycle, label: t('hero.biodegradable') },
    { icon: Baby, label: t('hero.safeKidsPets') },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Clean kitchen" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36 lg:py-44">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block text-primary-foreground/80 text-sm font-medium tracking-wider uppercase mb-4">
            {t('hero.tagline')}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            {t('hero.title')} <span className="italic">{t('hero.titleItalic')}</span>
          </h1>
          <p className="text-primary-foreground/85 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-forest font-semibold px-8 py-3.5 rounded-full hover:bg-primary-foreground/90 transition-colors"
            >
              {t('hero.shopNow')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-foreground/40 text-primary-foreground font-semibold px-8 py-3.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
            >
              {t('hero.ourStory')}
            </Link>
          </div>

          <div className="flex flex-wrap gap-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm rounded-full px-4 py-2">
                <Icon className="w-4 h-4 text-primary-foreground" />
                <span className="text-primary-foreground text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
