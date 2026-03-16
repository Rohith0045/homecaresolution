import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('contact.success'));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 glow-mesh opacity-15 pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-foreground mb-3 text-center">{t('contact.title')}</h1>
          <p className="text-muted-foreground text-center mb-12">{t('contact.subtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6">
                {[
                  { icon: Mail, labelKey: 'contact.email', value: t('contact.emailAddress') },
                  { icon: Phone, labelKey: 'contact.phone', value: t('contact.phoneNumber') },
                  { icon: MapPin, labelKey: 'contact.address', value: t('contact.locationAddress') },
                ].map(({ icon: Icon, labelKey, value }) => (
                  <div key={labelKey} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t(labelKey)}</p>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t('contact.yourName')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-border/40 glass text-foreground text-sm shadow-sm"
              />
              <input
                type="email"
                placeholder={t('contact.yourEmail')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                maxLength={255}
                className="w-full px-4 py-3 rounded-xl border border-border/40 glass text-foreground text-sm shadow-sm"
              />
              <textarea
                placeholder={t('contact.yourMessage')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                maxLength={1000}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border/40 glass text-foreground text-sm resize-none shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-forest transition-colors"
              >
                {t('contact.sendMessage')} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
