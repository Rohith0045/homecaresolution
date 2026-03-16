import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAdminOrders, updateAdminOrder, deleteAdminOrder, type AdminOrder } from "../../lib/admin";
import { motion } from "framer-motion";
import { Trash2, Eye, CheckCircle, Clock, Truck, Package, Download } from "lucide-react";
import { toast } from "sonner";
import Invoice from "@/components/Invoice";

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAdminOrders,
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [filter, setFilter] = useState<AdminOrder['status'] | 'all'>('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusColors: Record<AdminOrder['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusIcons: Record<AdminOrder['status'], React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    processing: <Package className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <span>✕</span>,
  };

  const handleStatusChange = (order: AdminOrder, newStatus: AdminOrder['status']) => {
    updateMutation.mutate({ ...order, status: newStatus });
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="p-6">
      <div className="no-print">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Orders Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length, color: 'bg-blue-500' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'bg-purple-500' },
          { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: 'bg-indigo-500' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
        ].map((stat, i) => (
          <motion.div key={i} className="p-4 bg-card border border-border rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{order.orderID}</h3>
                  <p className="text-sm text-muted-foreground">{order.customerName} • {order.customerEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusIcons[order.status]}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Items</p>
                  <p className="font-semibold text-foreground">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="font-semibold text-foreground">₹{order.total.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment</p>
                  <p className="font-semibold text-foreground text-xs">{order.paymentMethod.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Delivery</p>
                  <p className="font-semibold text-foreground text-xs">{order.deliveryOption.charAt(0).toUpperCase() + order.deliveryOption.slice(1)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Items:</p>
                <div className="space-y-1">
                  {order.items.map(item => (
                    <p key={item.id} className="text-xs text-muted-foreground">
                      {item.name} × {item.quantity} - ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Delivery Address:</p>
                <p className="text-xs font-medium">{order.address.name}</p>
                <p className="text-xs text-muted-foreground">{order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                <p className="text-xs text-muted-foreground">{order.address.phone}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e.target.value as AdminOrder['status'])}
                  className="px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-3 py-2 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>
                <button
                  onClick={() => {
                    deleteMutation.mutate(order.id);
                    toast.success('Order deleted');
                  }}
                  className="px-3 py-2 text-xs bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedOrder.orderID}</h2>
                <p className="text-muted-foreground text-sm">Created {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-muted-foreground hover:text-foreground p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                    {statusIcons[selectedOrder.status]}
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-3">Items</h3>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-semibold">₹{selectedOrder.subtotal.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-semibold">₹{selectedOrder.shippingCost.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-semibold uppercase">
                      {selectedOrder.paymentMethod}
                      {selectedOrder.paymentMethod === 'upi' && selectedOrder.upiTransactionId && (
                        <span className="block text-xs font-normal text-muted-foreground mt-0.5 normal-case">
                          Txn ID: <span className="font-mono">{selectedOrder.upiTransactionId}</span>
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery</p>
                    <p className="font-semibold capitalize">{selectedOrder.deliveryOption}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-lg font-bold text-primary">Total: ₹{selectedOrder.total.toFixed(0)}</p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <p className="font-medium">{selectedOrder.address.name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.address.street}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
                <p className="text-sm text-muted-foreground">Phone: {selectedOrder.address.phone}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>

      {selectedOrder && (
        <div className="hidden print:block print:bg-white print:m-0 print:p-0 absolute inset-0 w-full z-50 bg-white">
          <Invoice order={selectedOrder} />
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
