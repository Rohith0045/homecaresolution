import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getProductTranslation } from "@/data/productTranslations";
import { toast } from "sonner";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

const ProductCarousel = ({ products, title, subtitle }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const { addToCart } = useCart();
  const { language } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else if (window.innerWidth < 1280) setItemsPerView(3);
      else setItemsPerView(4);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);
  const totalSlides = Math.ceil(products.length / itemsPerView);
  const currentSlide = Math.floor(currentIndex / itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerView;
      return newIndex < 0 ? Math.max(0, products.length - itemsPerView) : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + itemsPerView;
      return newIndex + itemsPerView > products.length ? 0 : newIndex;
    });
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    const productName = getProductTranslation(`prod${product.id}.name`, language);
    toast.success(`${productName} added to cart`);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex-1">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product, i) => {
              const productName = getProductTranslation(`prod${product.id}.name`, language);
              const productDesc = getProductTranslation(`prod${product.id}.desc`, language);
              const productBadge = getProductTranslation(`prod${product.id}.badge`, language);
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Link to={`/product/${product.id}`} className="group block h-full">
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col h-full hover:border-primary/50">
                      
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors duration-300">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        
                        {/* Overlay Gradient - Enhanced */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Sparkle Effect on Hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-radial-gradient" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 right-4 flex gap-2 justify-between z-10">
                          {product.badge && (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.1 }}
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            >
                              {productBadge}
                            </motion.span>
                          )}
                          {discountPercent > 0 && (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              whileHover={{ scale: 1.1 }}
                              className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                            >
                              -{discountPercent}%
                            </motion.span>
                          )}
                        </div>

                        {/* Quick Add Button - Appears on Hover with smooth animation */}
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          onClick={(e) => handleAdd(product, e)}
                          className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-primary via-emerald-500 to-emerald-600 hover:from-primary/90 hover:via-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 transform opacity-0 group-hover:opacity-100 active:scale-95 z-20"
                        >
                          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Quick Add
                        </motion.button>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white/50 to-white dark:from-slate-900/50 dark:to-slate-900 group-hover:from-white group-hover:to-primary/5 dark:group-hover:from-slate-900 dark:group-hover:to-slate-800/50 transition-all duration-300">
                        <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                          {product.category.replace("-", " ")}
                        </p>
                        
                        <h3 className="font-display font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-primary group-hover:scale-105 transition-all duration-300 line-clamp-2 origin-left">
                          {productName}
                        </h3>
                        
                        <p className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground line-clamp-2 mb-4 flex-grow transition-colors duration-300">
                          {productDesc}
                        </p>

                        {/* Rating - Enhanced Animation */}
                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0.3, scale: 0.8 }}
                                whileInView={{ opacity: i < Math.floor(product.rating) ? 1 : 0.3, scale: 1 }}
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <svg
                                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" : "text-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </motion.div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground/70 ml-1 group-hover:text-muted-foreground transition-colors">({product.reviewCount})</span>
                        </div>

                        {/* Price - Enhanced Layout */}
                        <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-slate-700/50 pt-4 group-hover:border-primary/20 transition-colors duration-300">
                          <div className="flex items-baseline gap-2">
                            <motion.span 
                              className="font-display font-bold text-lg text-primary group-hover:text-green-600 transition-colors"
                              whileHover={{ scale: 1.05 }}
                            >
                              ₹{product.price.toFixed(0)}
                            </motion.span>
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground/60 line-through">₹{product.originalPrice.toFixed(0)}</span>
                            )}
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 cursor-pointer active:scale-95"
                            onClick={(e) => handleAdd(product, e)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Border Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/30 transition-all duration-500 pointer-events-none" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentIndex(i * itemsPerView)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "bg-primary w-8"
                  : "bg-primary/30 w-2 hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
