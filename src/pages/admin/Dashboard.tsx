import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminOrders, fetchProducts, fetchUsers } from "@/lib/admin";
import { ShoppingCart, DollarSign, Users, TrendingUp, Package, AlertCircle } from "lucide-react";

const Sparkline: React.FC<{ data?: number[] }> = ({ data = [2, 3.5, 4, 3.2, 5, 4.8, 6, 5.5, 6.5, 7] }) => {
  const width = 220;
  const height = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-80">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / (max - min || 1)) * height;
        return <circle key={i} cx={x} cy={y} r={2} fill="currentColor" opacity={0.5} />;
      })}
    </svg>
  );
};

const AdminDashboard: React.FC = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAdminOrders,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchProducts,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalProducts = products.length;
  const totalUsers = users.length;

  // Recent orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // KPIs
  const kpis = [
    { id: "orders", label: "Total Orders", value: totalOrders, delta: "+12%", icon: ShoppingCart, color: "text-blue-600" },
    { id: "revenue", label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}K`, delta: "+8%", icon: DollarSign, color: "text-green-600" },
    { id: "products", label: "Products", value: totalProducts, delta: "Active", icon: Package, color: "text-purple-600" },
    { id: "users", label: "Users", value: totalUsers, delta: "Total", icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your business</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
                  <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${k.color} bg-opacity-10`}>
                  <Icon className={`w-5 h-5 ${k.color}`} />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">{k.delta}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Orders Performance</h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{totalOrders} orders</p>
                <p className="text-xs text-secondary-foreground">This period</p>
              </div>
            </div>
            <div className="text-primary/60">
              <Sparkline data={[totalOrders * 0.6, totalOrders * 0.7, totalOrders * 0.8, totalOrders * 0.75, totalOrders * 0.9, totalOrders * 0.95, totalOrders]} />
            </div>
          </motion.div>

          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Order Status Breakdown</h3>
            <div className="space-y-3">
              {[
                { status: "Pending", count: pendingOrders, color: "bg-yellow-500", percentage: (pendingOrders / totalOrders) * 100 },
                { status: "Processing", count: orders.filter(o => o.status === "processing").length, color: "bg-blue-500", percentage: (orders.filter(o => o.status === "processing").length / totalOrders) * 100 },
                { status: "Shipped", count: orders.filter(o => o.status === "shipped").length, color: "bg-purple-500", percentage: (orders.filter(o => o.status === "shipped").length / totalOrders) * 100 },
                { status: "Delivered", count: deliveredOrders, color: "bg-green-500", percentage: (deliveredOrders / totalOrders) * 100 },
                { status: "Completed", count: completedOrders, color: "bg-emerald-500", percentage: (completedOrders / totalOrders) * 100 },
              ].map((item) => (
                <div key={item.status}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                    <p className="text-sm font-semibold text-foreground">{item.count}</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.percentage || 5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.orderID}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">₹{order.total.toFixed(0)}</p>
                      <p className={`text-xs font-medium capitalize ${
                        order.status === 'delivered' || order.status === 'completed' ? 'text-green-600' :
                        order.status === 'shipped' ? 'text-blue-600' :
                        order.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">Avg Order Value</p>
                <p className="text-lg font-bold text-primary">₹{avgOrderValue.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs text-muted-foreground">Delivered</p>
                <p className="text-lg font-bold text-green-600">{deliveredOrders}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-bold text-emerald-600">{completedOrders}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-lg font-bold text-yellow-600">{pendingOrders}</p>
              </div>
            </div>
          </motion.div>

          {/* Alerts */}
          {pendingOrders > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
            >
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-700">{pendingOrders} Orders Pending</p>
                  <p className="text-xs text-yellow-700 mt-1">Review and process pending orders soon</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Product Inventory</h3>
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products added yet</p>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground truncate">{product.name}</p>
                    <p className="font-semibold text-foreground">₹{product.price.toFixed(0)}</p>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-xs text-muted-foreground pt-2">+{products.length - 5} more products</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
