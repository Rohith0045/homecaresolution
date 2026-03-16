import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Truck, CreditCard, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createAdminOrder } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'address' | 'delivery' | 'payment'>('address');
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      phone: '+91 9876543210',
      street: '123 Green Street',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true
    }
  ]);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking'>('cod');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const [paymentTimer, setPaymentTimer] = useState<number | null>(null);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<any>(null);
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentTimer !== null && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (paymentTimer === 0) {
      setPaymentTimer(null);
      toast.error("Payment time expired. Your order has been cancelled.");
      if (pendingOrderDetails?.id) {
         supabase.from('orders').update({ status: 'cancelled' }).eq('id', pendingOrderDetails.id);
      }
      setPendingOrderDetails(null);
      setProcessingPayment(false);
    }
    return () => clearInterval(interval);
  }, [paymentTimer, pendingOrderDetails]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = (subtotal >= 1500 || isFirstOrder) ? 0 : 199;
  const deliveryCharge = deliveryOption === 'express' ? 150 : 0;
  const finalTotal = totalPrice + shippingCost + deliveryCharge;

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill all fields');
      return;
    }
    const id = (addresses.length + 1).toString();
    setAddresses([...addresses, { ...newAddress, id }]);
    setSelectedAddress(id);
    setShowAddressForm(false);
    setNewAddress({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    toast.success('Address added successfully');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessingPayment(true);

    const createRazorpayOrder = async () => {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: Math.round(finalTotal * 100), currency: 'INR' }
      });

      if (error) throw new Error(error.message || "Failed to create payment order");
      if (data.error) throw new Error(data.error);

      return data;
    };

    // 1. Common Handler: Create the Order first in 'pending' status
    try {
      const selectedAddr = addresses.find(a => a.id === selectedAddress);
      const orderID = `ORD${Date.now()}`;

      const createdOrder = await createAdminOrder({
        orderID,
        userId: user?.id || "guest",
        customerName: selectedAddr?.name || "Unknown",
        customerEmail: user?.email || "unknown@example.com",
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        shippingCost: shippingCost,
        total: finalTotal,
        paymentMethod,
        deliveryOption,
        address: {
          name: selectedAddr?.name || "",
          street: selectedAddr?.street || "",
          city: selectedAddr?.city || "",
          state: selectedAddr?.state || "",
          pincode: selectedAddr?.pincode || "",
          phone: selectedAddr?.phone || ""
        },
        status: paymentMethod === 'cod' ? "pending" : "pending_payment"
      });

      if (paymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully via Cash on Delivery!');
        navigate('/order-confirmation', {
          state: { orderID, address: selectedAddr, deliveryOption, paymentMethod, items, total: finalTotal }
        });
        return;
      }

      // 2. Start the timer UI for online/UPI
      setPendingOrderDetails({ ...createdOrder, items, selectedAddr, orderID, total: finalTotal });
      setPaymentTimer(300); // 5 minutes

      // If UPI, we don't trigger Razorpay popup, we show our own QR on the countdown screen
      if (paymentMethod === 'upi') {
         setProcessingPayment(false); 
         return; 
      }

      // Online Payments flow for card/netbanking (Razorpay)
      const orderData = await createRazorpayOrder();

      const handlePaymentSuccess = async (response: any) => {
        try {
          setPaymentTimer(null); // Stop timer

          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }
          });

          if (verifyError || !verifyData?.ok) throw new Error(verifyError?.message || 'Verification failed');

          await supabase.from('orders').update({ 
            status: 'completed',
            upi_transaction_id: response.razorpay_payment_id
          }).eq('id', createdOrder.id);

          clearCart();
          toast.success('Payment successful! Order completed.');
          navigate('/order-confirmation', {
            state: { orderID, address: selectedAddr, deliveryOption, paymentMethod, items, total: finalTotal }
          });
        } catch (err) {
          console.error(err);
          toast.error('Payment verification failed.');
        } finally {
          setProcessingPayment(false);
        }
      };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Home Care Harmony",
        description: "Order payment",
        order_id: orderData.id,
        handler: handlePaymentSuccess,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#2563EB" },
        modal: {
          ondismiss: function() {
            setPaymentTimer(null);
            setProcessingPayment(false);
            toast.info("Payment cancelled.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", () => { setProcessingPayment(false); });
      rzp.open();

    } catch (err) {
      console.error(err);
      setProcessingPayment(false);
      toast.error(err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.');
    }
  };

  if (paymentTimer !== null) {
    const minutes = Math.floor(paymentTimer / 60);
    const seconds = paymentTimer % 60;

    const handleManualPaymentClick = async () => {
      setPaymentTimer(null);
      setProcessingPayment(false);
      
      try {
        if (pendingOrderDetails?.id) {
          // Update status to completed directly upon payment affirmation button click
          await supabase.from('orders').update({ status: 'completed' }).eq('id', pendingOrderDetails.id);
        }
        
        clearCart();
        toast.success("Payment submitted! We will verify and process your order.");
        navigate('/order-confirmation', {
          state: {
            orderID: pendingOrderDetails?.orderID,
            address: pendingOrderDetails?.selectedAddr,
            deliveryOption: pendingOrderDetails?.deliveryOption,
            paymentMethod: pendingOrderDetails?.paymentMethod,
            items: pendingOrderDetails?.items,
            total: pendingOrderDetails?.total
          }
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to update order. Please contact support.");
      }
    };

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center shadow-sm flex flex-col items-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Awaiting Payment</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Please complete the payment in {paymentMethod === 'upi' ? 'the QR code below' : 'the secure Razorpay window'}. 
            Do not refresh. Your order cancel in:
          </p>
          <div className="text-5xl font-mono font-bold text-primary mb-6 tracking-wider">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>

          {paymentMethod === 'upi' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-background border border-border rounded-xl flex flex-col items-center space-y-4 mb-6 w-full">
              <h3 className="font-display font-semibold text-foreground text-base">Scan to Pay via UPI</h3>
              <div className="p-2 bg-white rounded-lg shadow-sm border border-border">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=rohithsky45@okaxis&pn=Home Care Harmony&am=${pendingOrderDetails?.total || 0}`)}`}
                  alt="UPI QR Code" 
                  className="w-44 h-44 object-contain" 
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Amount to Pay</p>
                <p className="font-bold text-primary text-xl">₹{pendingOrderDetails?.total}</p>
              </div>
            </motion.div>
          )}

          {paymentMethod === 'upi' ? (
            <button 
              onClick={handleManualPaymentClick}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-forest transition-colors mb-3"
            >
              I Have Paid
            </button>
          ) : null}

          <button 
            onClick={() => {
              setPaymentTimer(null);
              setProcessingPayment(false);
            }}
            className="w-full py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-secondary transition-colors text-sm"
          >
            Cancel Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Steps */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            {(['address', 'delivery', 'payment'] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-4">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : idx < ['address', 'delivery', 'payment'].indexOf(step)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  animate={{ scale: step === s ? 1.1 : 1 }}
                >
                  {idx + 1}
                </motion.div>
                {idx < 2 && (
                  <div
                    className={`h-1 w-12 transition-all ${
                      idx < ['address', 'delivery', 'payment'].indexOf(step) ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-xs font-medium text-muted-foreground">
            <span>Address</span>
            <span>Delivery</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Address Step */}
            {step === 'address' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold text-foreground">Select Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <motion.label
                      key={addr.id}
                      className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:border-primary transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="w-5 h-5 mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{addr.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        {addr.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </motion.label>
                  ))}
                </div>

                {showAddressForm ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-6 border-2 border-dashed border-border rounded-xl">
                    <h3 className="font-semibold text-foreground mb-4">Add New Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="col-span-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="col-span-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="col-span-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleAddAddress}
                        className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-forest transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Save Address
                      </motion.button>
                      <motion.button
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 border border-border text-foreground py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full border-2 border-dashed border-border text-foreground py-3 rounded-xl font-medium hover:border-primary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    + Add New Address
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setStep('delivery')}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-forest transition-colors mt-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Delivery
                </motion.button>
              </motion.div>
            )}

            {/* Delivery Step */}
            {step === 'delivery' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold text-foreground">Select Delivery Option</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'standard', label: 'Standard Delivery', desc: 'Delivery in 3-5 business days', cost: 0 },
                    { id: 'express', label: 'Express Delivery', desc: 'Delivery in 1-2 business days', cost: 150 }
                  ].map((option) => (
                    <motion.label
                      key={option.id}
                      className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:border-primary transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={deliveryOption === option.id}
                        onChange={(e) => setDeliveryOption(e.target.value as 'standard' | 'express')}
                        className="w-5 h-5 mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{option.label}</h3>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                      <span className="font-semibold text-foreground">
                        {option.cost > 0 ? `+₹${option.cost}` : 'Free'}
                      </span>
                    </motion.label>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    onClick={() => setStep('address')}
                    className="flex-1 border border-border text-foreground py-3 rounded-full font-semibold hover:bg-secondary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    onClick={() => setStep('payment')}
                    className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-forest transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold text-foreground">Select Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay with cash or UPI upon delivery' },
                    { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                    { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported' }
                  ].map((method) => (
                    <motion.label
                      key={method.id}
                      className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:border-primary transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'upi' | 'card' | 'netbanking')}
                        className="w-5 h-5 mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{method.label}</h3>
                        <p className="text-sm text-muted-foreground">{method.desc}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>



                {paymentMethod === 'cod' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 mt-6 text-emerald-800"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm">Pay on Delivery Selected</h3>
                      <p className="text-xs mt-1">You will pay ₹{finalTotal.toFixed(0)} when your order arrives. Please keep exact change or UPI ready.</p>
                    </div>
                  </motion.div>
                )}

                <motion.div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-emerald-700">
                      <p className="font-semibold">100% Secure Payment</p>
                      <p className="text-xs mt-1">Your payment information is encrypted and protected.</p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    onClick={() => setStep('delivery')}
                    className="flex-1 border border-border text-foreground py-3 rounded-full font-semibold hover:bg-secondary transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={processingPayment}
                    className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: !processingPayment ? 1.02 : 1 }}
                    whileTap={{ scale: !processingPayment ? 0.98 : 1 }}
                  >
                    {processingPayment ? 'Processing...' : 'Place Order'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-foreground">₹{(item.product.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              {shippingCost > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>₹{shippingCost}</span>
                </div>
              )}
              {deliveryCharge > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Expedited Delivery</span>
                  <span>₹{deliveryCharge}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
