import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/data/products";

const HeroBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setAutoPlay(false);
  };

  const getVisibleProducts = () => {
    const visibleCount = 5;
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(products[(currentIndex + i) % products.length]);
    }
    return items;
  };

  return (
    <div className="relative py-12 bg-gradient-to-r from-primary/5 via-cream to-secondary/5 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h3 className="text-sm uppercase tracking-widest font-bold text-primary/70">FEATURED COLLECTION</h3>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1">
            Our Best Sellers
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevious}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gradient-to-br from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Carousel Content */}
          <div className="overflow-hidden">
            <div className="flex gap-4 md:gap-5 lg:gap-6 px-4">
              {getVisibleProducts().map((product, index) => (
                <motion.div
                  key={`${product.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onMouseEnter={() => setAutoPlay(false)}
                  onMouseLeave={() => setAutoPlay(true)}
                  className="flex-1 min-w-0"
                >
                  <div className="group/card relative h-72 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2 cursor-pointer bg-white dark:bg-slate-900">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 group-hover/card:from-primary/10 group-hover/card:to-emerald-50/10 transition-all duration-500" />

                    {/* Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/card:scale-120 transition-transform duration-700 ease-out mix-blend-overlay group-hover/card:mix-blend-normal"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover/card:opacity-100 transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                      {/* Top - Badge */}
                      <div className="flex justify-between items-start">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          className="flex gap-2"
                        >
                          {product.badge && (
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                              {product.badge}
                            </span>
                          )}
                        </motion.div>

                        {/* Rating */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="flex gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm"
                        >
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-300"
                                  : "text-gray-400"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </motion.div>
                      </div>

                      {/* Bottom - Info and Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="space-y-3"
                      >
                        <div>
                          <h4 className="font-display font-bold text-sm leading-snug line-clamp-2 group-hover/card:text-emerald-300 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-200 line-clamp-1 mt-1">{product.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display font-bold text-lg">₹{product.price.toFixed(0)}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-300 line-through">
                                ₹{product.originalPrice.toFixed(0)}
                              </span>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>

                    {/* Glow Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover/card:border-primary/50 transition-all duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-gradient-to-br from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          {products.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setAutoPlay(false);
              }}
              whileHover={{ scale: 1.2 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-8 shadow-lg shadow-primary/50"
                  : "bg-primary/30 w-2 hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground/70 mt-6"
        >
          ⏱️ Auto-scrolls every 5 seconds • 🖱️ Hover to pause • ⬅️➡️ Click arrows to browse
        </motion.p>
      </div>
    </div>
  );
};

export default HeroBannerCarousel;
