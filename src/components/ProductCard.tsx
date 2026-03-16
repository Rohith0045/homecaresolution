import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getProductTranslation } from "@/data/productTranslations";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { language } = useTranslation();
  
  const productName = getProductTranslation(`prod${product.id}.name`, language);
  const productDesc = getProductTranslation(`prod${product.id}.desc`, language);
  const productBadge = getProductTranslation(`prod${product.id}.badge`, language);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${productName} added to cart`);
  };

  const priceVal = typeof product.price === "number" ? product.price : 0;
  const originalVal = typeof product.originalPrice === "number" ? product.originalPrice : undefined;
  const discountPercent = originalVal
    ? Math.round(((originalVal - priceVal) / originalVal) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300">
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <img
              src={product.image || 'https://via.placeholder.com/600x600?text=Product'}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                {productBadge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercent}%
              </span>
            )}
          </div>

          <div className="p-4">
            <p className="text-xs text-muted-foreground capitalize mb-1">{(product.category || "").replace("-", " ")}</p>
            <h3 className="font-display font-semibold text-card-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
              {productName}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{productDesc}</p>

            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 0) ? "fill-accent text-accent" : "text-border"}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">({product.reviewCount || 0})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-foreground">₹{priceVal.toFixed(0)}</span>
                {originalVal && (
                  <span className="text-xs text-muted-foreground line-through">₹{originalVal.toFixed(0)}</span>
                )}
              </div>

              <button
                onClick={handleAdd}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-forest transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
