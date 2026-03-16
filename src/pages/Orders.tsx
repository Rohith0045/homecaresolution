import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import Invoice from "@/components/Invoice";
import { AdminOrder } from "@/lib/admin";
import { Download } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
}

interface UserOrder {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  delivery_option: string;
  address: any;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<AdminOrder | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as any);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const statusColors: Record<string, string> = {
    pending_payment: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print">
        <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-xl">
             <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
             <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
             <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders yet!</p>
             <Link to="/products" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium inline-block">
                Start Shopping
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
             {orders.map((order) => (
                <motion.div key={order.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-border mb-4 gap-2">
                      <div>
                         <p className="text-xs text-muted-foreground">Order ID</p>
                         <h3 className="font-semibold text-foreground">{order.order_id}</h3>
                         <p className="text-xs text-muted-foreground mt-0.5">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium w-fit ${statusColors[order.status] || 'bg-secondary text-secondary-foreground'}`}>
                         {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                      </span>
                   </div>
                   
                   <div className="space-y-3 mb-4">
                      {order.order_items?.map((item) => (
                         <div key={item.id} className="flex justify-between items-center text-sm">
                            <p className="text-foreground font-medium">{item.product_name} <span className="text-muted-foreground text-xs">× {item.quantity}</span></p>
                            <p className="text-muted-foreground font-semibold">₹{(item.price * item.quantity).toFixed(0)}</p>
                         </div>
                      ))}
                   </div>

                   <div className="border-t border-border pt-4 flex justify-between items-center">
                      <button 
                        onClick={() => {
                          const invoiceOrder: AdminOrder = {
                             id: order.id,
                             orderID: order.order_id,
                             userId: user?.id || "guest",
                             customerName: order.customer_name,
                             customerEmail: order.customer_email,
                             items: order.order_items.map(i => ({ id: i.id, name: i.product_name, price: i.price, quantity: i.quantity })),
                             subtotal: order.subtotal,
                             shippingCost: order.shipping_cost,
                             total: order.total,
                             paymentMethod: order.payment_method,
                             deliveryOption: order.delivery_option,
                             address: order.address,
                             status: order.status,
                             createdAt: order.created_at,
                             updatedAt: order.created_at
                          };
                          setSelectedOrderForInvoice(invoiceOrder);
                          setTimeout(() => window.print(), 200);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                         <Download className="w-3.5 h-3.5" /> Download Invoice
                      </button>
                      <div className="text-right">
                         <p className="text-xs text-muted-foreground">Total Paid</p>
                         <p className="text-lg font-bold text-primary">₹{order.total.toFixed(0)}</p>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        )}
      </div>
        <Footer />
      </div>

      {selectedOrderForInvoice && (
         <div className="hidden print:block print:bg-white print:m-0 print:p-0 absolute inset-0 w-full z-50 bg-white">
            <Invoice order={selectedOrderForInvoice} />
         </div>
      )}
    </div>
  );
};

export default Orders;
