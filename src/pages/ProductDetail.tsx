import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getProductTranslation } from "@/data/productTranslations";
import { Star, ShoppingCart, ChevronRight, Truck, Shield, Leaf, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { t, language } = useTranslation();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "usage" | "reviews">("description");

  const productName = product ? getProductTranslation(`prod${product.id}.name`, language) : '';
  const productDesc = product ? getProductTranslation(`prod${product.id}.desc`, language) : '';
  const productLongDesc = product ? getProductTranslation(`prod${product.id}.longDesc`, language) : '';
  const productBadge = product ? getProductTranslation(`prod${product.id}.badge`, language) : '';
  const productUsage = product ? getProductTranslation(`prod${product.id}.usage`, language) : '';

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">{t('product.notFound')}</h1>
          <Link to="/products" className="text-primary mt-4 inline-block">{t('product.browseProducts')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty}x ${productName} ${t('product.addedCart')}`);
  };

  const tabs = [
    { key: "description" as const, label: t('product.description') },
    { key: "ingredients" as const, label: t('product.ingredients') },
    { key: "usage" as const, label: t('product.usage') },
    { key: "reviews" as const, label: `${t('product.reviews')} (${product.reviewCount})` },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t('product.home')}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-primary">{t('product.products')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{productName}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-4">
              <img
                src={product.images[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? "border-primary" : "border-border"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            {product.badge && (
              <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">
                {productBadge}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{productName}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{productLongDesc}</p>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2 text-sm">{t('product.keyBenefits')}</h3>
              <ul className="space-y-1.5">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Leaf className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary rounded-l-full transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary rounded-r-full transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-forest transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> {t('product.addCart')}
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: t('product.freeShipping') },
                { icon: Shield, label: t('product.ecoCertified') },
                { icon: Leaf, label: t('product.natural') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 py-3 bg-secondary rounded-lg">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && <p className="text-muted-foreground leading-relaxed max-w-3xl">{productLongDesc}</p>}
            {activeTab === "ingredients" && (
              <ul className="space-y-2 max-w-md">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" /> {ing}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "usage" && <p className="text-muted-foreground leading-relaxed max-w-3xl">{productUsage}</p>}
            {activeTab === "reviews" && (
              <p className="text-muted-foreground">{t('product.reviewsSoon')}</p>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t('product.related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
