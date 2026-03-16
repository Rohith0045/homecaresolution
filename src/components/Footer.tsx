import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-forest text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">Home Care Harmony</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                { to: "/products", label: t('footer.products') },
                { to: "/about", label: t('footer.about') },
                { to: "/contact", label: t('footer.contact') },
                { to: "/products", label: t('footer.faq') },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-primary-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {[
                t('footer.cat_kitchen'),
                t('footer.cat_bathroom'),
                t('footer.cat_floor'),
                t('footer.cat_laundry')
              ].map((c) => (
                <li key={c}>
                  <Link to="/products" className="hover:text-primary-foreground transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@homecare-harmony.in</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 9842730330</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> {t('footer.location')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
