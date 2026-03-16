import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Package, MapPin, Truck, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Invoice from "@/components/Invoice";
import { AdminOrder } from "@/lib/admin";
import { useAuth } from "@/context/AuthContext";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabase";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as any;

  useEffect(() => {
    if (!state) {
      navigate('/cart');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { orderID, address, deliveryOption, paymentMethod, items, total } = state;
  const deliveryDays = deliveryOption === 'express' ? '1-2' : '3-5';

  const paymentMethodLabel: Record<string, string> = {
    upi: 'UPI',
    card: 'Credit/Debit Card',
    netbanking: 'Net Banking'
  };

  const invoiceOrder: AdminOrder = {
    id: orderID,
    orderID,
    userId: user?.id || "guest",
    customerName: address.name,
    customerEmail: user?.email || "unknown@example.com",
    items: items.map((i: any) => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    })),
    subtotal: items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0),
    shippingCost: items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0) < 1500 ? 199 : 0,
    total,
    paymentMethod,
    deliveryOption,
    address,
    status: paymentMethod === 'cod' ? 'pending' : 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [uploadStatus, setUploadStatus] = useState<string>('Initializing invoice storage...');

  useEffect(() => {
    const generateAndUploadInvoice = async () => {
      // Wait for components to fully render
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const element = document.getElementById('invoice-to-pdf');
      if (!element) {
         setUploadStatus('Error: Invoice element not found in DOM.');
         return;
      }

      try {
        setUploadStatus('Generating PDF Document...');
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        const pdfBlob = pdf.output('blob');

        setUploadStatus('Uploading Invoice directly to Supabase Storage...');
        const { error } = await supabase.storage
          .from('invoices')
          .upload(`invoice_${orderID}.pdf`, pdfBlob, {
             contentType: 'application/pdf'
          });
        if (error) {
           setUploadStatus(`Upload Failed: ${error.message || 'Error uploading'}.`);
           console.error('Error uploading invoice:', error);
        } else {
           setUploadStatus('Invoice stored successfully in Supabase! ✅');
        }
      } catch (err: any) {
        setUploadStatus(`PDF Generation Error: ${err.message || err}`);
        console.error('Failed to generate/upload PDF:', err);
      }
    };

    if (state && orderID) {
      generateAndUploadInvoice();
    }
  }, [state, orderID]);

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print">
        <Header />

        <div className="container mx-auto px-4 py-12">
          {/* Success Animation */}
          <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className={`text-xs font-mono mt-2 ${uploadStatus.includes('Failed') || uploadStatus.includes('Error') ? 'text-red-500' : uploadStatus.includes('successfully') ? 'text-green-600' : 'text-primary'}`}>
             {uploadStatus}
          </p>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
            {/* Order ID */}
            <motion.div className="bg-card border border-border rounded-xl p-6" whileHover={{ borderColor: '#16a34a' }}>
              <h2 className="font-display text-lg font-bold text-foreground mb-4">Order Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-semibold text-foreground font-mono">{orderID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-foreground">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <motion.span
                    className="font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-700 rounded-full text-xs"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    Confirmed
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div className="bg-card border border-border rounded-xl p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">Delivery Address</h2>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">{address.name}</p>
                <p className="text-muted-foreground mt-1">
                  {address.street}<br />
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-muted-foreground text-xs mt-2">{address.phone}</p>
              </div>
            </motion.div>

            {/* Delivery & Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div className="bg-card border border-border rounded-xl p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Delivery</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">In {deliveryDays} business days</p>
                <p className="text-xs text-muted-foreground">
                  {deliveryOption === 'express' ? 'Express' : 'Standard'} Delivery
                </p>
              </motion.div>

              <motion.div className="bg-card border border-border rounded-xl p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-semibold text-foreground mb-3">Payment Method</h3>
                <p className="text-sm text-muted-foreground">
                  {paymentMethodLabel[paymentMethod]}
                </p>
              </motion.div>
            </div>

            {/* Order Items */}
            <motion.div className="bg-card border border-border rounded-xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-foreground">Items</h2>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item: any) => (
                  <motion.div key={item.product.id} className="flex gap-4 pb-3 border-b border-border last:border-0" whileHover={{ x: 5 }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-1">{item.product.category}</p>
                      <p className="text-sm font-bold text-foreground mt-2">
                        ₹{item.product.price.toFixed(0)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{(item.product.price * item.quantity).toFixed(0)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Order Total</h3>

            <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary">Free</span>
              </div>
              {items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0) < 1500 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charge</span>
                  <span>₹199</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <motion.button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 border border-border text-foreground py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors mb-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </motion.button>

            <motion.div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-700">
              <p className="font-semibold mb-1">📧 Confirmation email sent</p>
              <p>Check your inbox for order confirmation and tracking details.</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div className="bg-gradient-to-r from-primary/5 to-emerald-500/5 border border-primary/10 rounded-xl p-8 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">What is Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Order Processing',
                desc: 'We are preparing your order for shipment. This usually takes 1-2 hours.'
              },
              {
                step: '2',
                title: 'Shipped',
                desc: 'Once shipped, you will receive a tracking number to monitor your delivery.'
              },
              {
                step: '3',
                title: 'Delivered',
                desc: `Your order will be delivered in ${deliveryDays} business days.`
              }
            ].map((item, idx) => (
              <motion.div key={idx} className="flex gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (idx + 1) }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={() => navigate('/products')}
            className="px-8 py-3 border border-border text-foreground rounded-full font-semibold hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Shopping
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-forest transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </div>
        </div>
        <Footer />
      </div>

      {/* Render element securely for PDF rendering without breaking styles (opaque but pushed behind layout stack) */}
      <div id="invoice-to-pdf" className="fixed top-0 left-0 w-[210mm] bg-white text-black p-8 -z-50 pointer-events-none">
         <Invoice order={invoiceOrder} />
      </div>

      <div className="hidden print:block print:bg-white print:m-0 print:p-0 absolute inset-0 w-full z-50 bg-white">
        <Invoice order={invoiceOrder} />
      </div>
    </div>
  );
};

export default OrderConfirmation;
