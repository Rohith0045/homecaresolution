import { supabase } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface AdminProduct extends Product {
  category?: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  sku?: string;
  images?: string[];
  badge?: string;
  ingredients?: string[];
  benefits?: string[];
  usage?: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  orderID: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "upi" | "card" | "netbanking" | string;
  upiTransactionId?: string;
  deliveryOption: "standard" | "express" | string;
  address: any;
  status: "pending" | "processing" | "shipped" | "delivered" | "completed" | "cancelled" | string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  status: "pending" | "shipped" | "delivered" | "cancelled" | string;
}

// Map from DB row to frontend User
function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    isAdmin: row.is_admin,
  };
}

// Map from DB row to frontend AdminProduct
function mapProduct(row: any): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
    rating: parseFloat(row.rating),
    reviewCount: row.review_count,
    category: row.category,
    image: row.image,
    images: row.images,
    badge: row.badge,
    ingredients: row.ingredients,
    benefits: row.benefits,
    usage: row.usage,
    isBestSeller: row.is_best_seller,
    isTrending: row.is_trending,
  };
}

// users
export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) console.error("Error fetching users", error);
  return (data || []).map(mapUser);
}

export async function createUser(user: User): Promise<User> {
  const { data, error } = await supabase.from('users').insert([{
    id: user.id, // usually id comes from auth, but admin might insert
    name: user.name,
    email: user.email,
    is_admin: user.isAdmin
  }]).select().single();
  if (error) throw error;
  return mapUser(data);
}

export async function updateUser(user: User): Promise<User> {
  const { data, error } = await supabase.from('users').update({
    name: user.name,
    email: user.email,
    is_admin: user.isAdmin
  }).eq('id', user.id).select().single();
  if (error) throw error;
  return mapUser(data);
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

// products
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  if (error) console.error("Error fetching products", error);
  return (data || []).map(mapProduct);
}

export async function createProduct(p: Product | AdminProduct): Promise<Product> {
  const asAdminProd = p as AdminProduct;
  const insertData = {
    name: p.name,
    description: p.description || '',
    long_description: asAdminProd.usage ? asAdminProd.description : p.description || '',
    price: p.price,
    original_price: asAdminProd.originalPrice,
    category: asAdminProd.category || 'general',
    image: p.image || '',
    images: asAdminProd.images || [],
    usage: asAdminProd.usage || '',
  };
  const { data, error } = await supabase.from('products').insert([insertData]).select().single();
  if (error) throw error;
  try { window.dispatchEvent(new Event('admin_products_changed')); } catch {}
  return mapProduct(data);
}

export async function updateProduct(p: Product | AdminProduct): Promise<Product> {
  const asAdminProd = p as AdminProduct;
  const updateData = {
    name: p.name,
    description: p.description,
    price: p.price,
    category: asAdminProd.category,
    image: p.image,
  };
  const { data, error } = await supabase.from('products').update(updateData).eq('id', p.id).select().single();
  if (error) throw error;
  try { window.dispatchEvent(new Event('admin_products_changed')); } catch {}
  return mapProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  try { window.dispatchEvent(new Event('admin_products_changed')); } catch {}
}

// orders (legacy / simplified order format)
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return [];
  return data.map((o: any) => ({
    id: o.id,
    userId: o.user_id,
    productId: '', // simplified format from old mock
    status: o.status,
  }));
}

export async function createOrder(o: Order): Promise<Order> {
  return o; // Not implemented for simple order, use createAdminOrder
}

export async function updateOrder(o: Order): Promise<Order> {
  const { error } = await supabase.from('orders').update({ status: o.status }).eq('id', o.id);
  if (error) throw error;
  return o;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

// enhanced orders (real checkout data)
function mapAdminOrder(row: any, items: any[]): AdminOrder {
  return {
    id: row.id,
    orderID: row.order_id,
    userId: row.user_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    items: items.map((i: any) => ({
      id: i.product_id,
      name: i.product_name,
      price: parseFloat(i.price),
      quantity: i.quantity,
    })),
    subtotal: parseFloat(row.subtotal),
    shippingCost: parseFloat(row.shipping_cost),
    total: parseFloat(row.total),
    paymentMethod: row.payment_method,
    upiTransactionId: row.upi_transaction_id,
    deliveryOption: row.delivery_option,
    address: row.address,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  // We need to join over order_items
  const { data, error } = await supabase.from('orders').select(`
    *,
    order_items (*)
  `);
  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  return data.map((o: any) => mapAdminOrder(o, o.order_items || []));
}

export async function createAdminOrder(order: Omit<AdminOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminOrder> {
  const orderIdVal = order.orderID || `ORD-${Date.now().toString().slice(-6)}`;
  // Ensure user_id is either a valid UUID or null (for guests)
  const finalUserId = (order.userId && order.userId !== "guest") ? order.userId : null;

  const { data, error } = await supabase.from('orders').insert([{
    order_id: orderIdVal,
    user_id: finalUserId,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    subtotal: order.subtotal,
    shipping_cost: order.shippingCost,
    total: order.total,
    payment_method: order.paymentMethod,
    upi_transaction_id: order.upiTransactionId,
    delivery_option: order.deliveryOption,
    address: order.address,
    status: order.status || 'pending',
  }]).select().single();
  
  if (error) {
    console.error("Failed inserting into 'orders':", error);
    throw error;
  }

  // insert items
  if (order.items && order.items.length > 0) {
    // Check if the product_id is a valid UUID
    const isValidUUID = (id: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

    const itemsData = order.items.map(i => ({
      order_id: data.id,
      product_id: isValidUUID(i.id) ? i.id : null, // Fallback to null if it's a demo product ID like "1"
      product_name: i.name,
      price: i.price,
      quantity: i.quantity
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(itemsData);
    if (itemsError) {
      console.error("Failed inserting into 'order_items':", itemsError);
      throw itemsError;
    }
  }

  return mapAdminOrder(data, order.items || []);
}

export async function updateAdminOrder(order: AdminOrder): Promise<AdminOrder> {
  const { data, error } = await supabase.from('orders').update({
    status: order.status,
    updated_at: new Date().toISOString()
  }).eq('id', order.id).select().single();
  if (error) throw error;
  return order;
}

export async function deleteAdminOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}
