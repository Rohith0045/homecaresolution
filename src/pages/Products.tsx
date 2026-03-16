import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { loadProducts } from "@/lib/productsClient";
import { useTranslation } from "@/hooks/useTranslation";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [sortBy, setSortBy] = useState("popular");
  const { language, t } = useTranslation();

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

  const [allProducts, setAllProducts] = useState(() => loadProducts());

  // reload when admin changes localStorage (simple approach: listen storage event)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'admin_products') {
        setAllProducts(loadProducts());
      }
    };
    const onAdminChange = () => setAllProducts(loadProducts());
    window.addEventListener('storage', onStorage);
    window.addEventListener('admin_products_changed', onAdminChange as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('admin_products_changed', onAdminChange as EventListener);
    };
  }, []);

  const filtered = useMemo(() => {
    let result = activeCategory === "all" ? allProducts : allProducts.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case "price-low": return [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high": return [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating": return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: return [...result].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }
  }, [activeCategory, sortBy, allProducts]);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 glow-mesh opacity-15 pointer-events-none" />
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{t('products.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('products.subtitle')}</p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 glass p-4 rounded-2xl border border-border/30 shadow-md">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
            >
              {t('products.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
              >
                {cat.icon} {getTranslatedCategoryName(cat.id)}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="md:ml-auto px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
          >
            <option value="popular">{t('products.sortPopular')}</option>
            <option value="rating">{t('products.sortRated')}</option>
            <option value="price-low">{t('products.sortLowHigh')}</option>
            <option value="price-high">{t('products.sortHighLow')}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">{t('products.noFound')}</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
