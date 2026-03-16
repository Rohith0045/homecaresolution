import { Link } from "react-router-dom";
import { categories } from "@/data/products";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { getProductTranslation } from "@/data/productTranslations";

const CategoryGrid = () => {
  const { t, language } = useTranslation();
  
  const getCategoryKey = (catId: string): string => {
    const keyMap: Record<string, string> = {
      'kitchen': 'Kitchen Cleaning',
      'bathroom': 'Bathroom Cleaning',
      'floor': 'Floor Cleaning',
      'laundry': 'Laundry Care',
      'handwash': 'Hand Wash & Sanitizers',
      'accessories': 'Accessories'
    };
    return keyMap[catId] || 'Kitchen Cleaning';
  };
  
  const getTranslatedCategoryName = (catId: string): string => {
    const nameMap: Record<string, Record<string, string>> = {
      'en': {
        'kitchen': 'Kitchen Cleaning',
        'bathroom': 'Bathroom Cleaning',
        'floor': 'Floor Cleaning',
        'laundry': 'Laundry Care',
        'handwash': 'Hand Wash & Sanitizers',
        'accessories': 'Accessories'
      },
      'ta': {
        'kitchen': 'சமையலறை சுத்தம்',
        'bathroom': 'குளியலறை சுத்தம்',
        'floor': 'தரை சுத்தம்',
        'laundry': 'பணிமுதல் கவனிப்பு',
        'handwash': 'கை கழுவு மற்றும் சுரக்ષितமயாக்கிகள்',
        'accessories': 'உபकरण'
      },
      'hi': {
        'kitchen': 'रसोई सफाई',
        'bathroom': 'बाथरूम सफाई',
        'floor': 'फर्श सफाई',
        'laundry': 'कपड़ा देखभाल',
        'handwash': 'हाथ धोना और सैनिटाइजर',
        'accessories': 'सहायक'
      }
    };
    return (nameMap[language] || nameMap['en'])[catId] || 'Kitchen Cleaning';
  };
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{t('categories.title')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t('categories.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="group block glass glowing-card rounded-2xl p-6 text-center border-border/40 transition-all duration-500 relative overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.span 
                    className="text-4xl block mb-3 inline-block"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {cat.icon}
                  </motion.span>
                  <h3 className="font-display font-bold text-sm text-card-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {getTranslatedCategoryName(cat.id)}
                  </h3>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {cat.productCount} {t('product.products')}
                  </p>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center"
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
