import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success(`${t('newsletter.subscribe')}! 🌿`);
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            {t('newsletter.title')}
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            {t('newsletter.description')}
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              className="flex-1 px-5 py-3 rounded-full bg-primary-foreground/15 border border-primary-foreground/25 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-primary-foreground text-forest font-semibold text-sm hover:bg-primary-foreground/90 transition-colors flex items-center gap-2"
            >
              {t('newsletter.subscribe')} <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
