import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, couponCode, setCouponCode, discount, applyCoupon } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  useEffect(() => {
    const checkFirstOrder = async () => {
      if (!user?.id) return;
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (!error && count === 0) {
        setIsFirstOrder(true);
      }
    };
    checkFirstOrder();
  }, [user]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
          <p className="text-muted-foreground mb-6">{t('cart.emptyDesc')}</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-forest transition-colors">
            {t('cart.browseProducts')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 bg-card border border-border rounded-xl p-4"
              >
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-semibold text-foreground text-sm hover:text-primary transition-colors">{item.product.name}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.product.category}</p>
                  <p className="font-bold text-foreground mt-2">₹{item.product.price.toFixed(0)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <div className="flex items-center border border-border rounded-full">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">{t('cart.orderSummary')}</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.subtotal')}</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>{t('cart.discount')} ({discount}%)</span>
                  <span>-₹{((subtotal * discount) / 100).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.shipping')}</span>
                <span>{(subtotal >= 1500 || isFirstOrder) ? t('cart.free') : "₹199"}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-base">
                <span>{t('cart.total')}</span>
                <span>₹{(totalPrice + ((subtotal >= 1500 || isFirstOrder) ? 0 : 199)).toFixed(0)}</span>
              </div>
            </div>



            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-forest transition-colors"
            >
              {t('cart.checkout')}
            </button>

            <Link to="/products" className="block text-center text-sm text-primary mt-3 hover:underline">
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
