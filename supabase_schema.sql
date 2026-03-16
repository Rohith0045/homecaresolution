-- Supabase Schema for Home Care Harmony --

-- 1. Create custom users profile table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

-- Function to check admin status bypassing RLS to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  caller_status BOOLEAN;
BEGIN
  SELECT is_admin INTO caller_status FROM public.users WHERE id = auth.uid();
  RETURN COALESCE(caller_status, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins can view all users" 
  ON public.users FOR SELECT 
  USING (public.is_admin());

-- Trigger to create user profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, is_admin)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    new.email, 
    COALESCE((new.raw_user_meta_data->>'is_admin')::boolean, FALSE)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  ingredients TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  usage TEXT NOT NULL,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product Policies
CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT 
  USING (TRUE);

CREATE POLICY "Only admins can insert products" 
  ON public.products FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update products" 
  ON public.products FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Only admins can delete products" 
  ON public.products FOR DELETE 
  USING (public.is_admin());


-- 3. Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL, -- e.g. ORD-1234
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_cost NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  upi_transaction_id TEXT,
  delivery_option TEXT NOT NULL,
  address JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order Policies
CREATE POLICY "Users can view their own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
  ON public.orders FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Users and guests can create orders" 
  ON public.orders FOR INSERT 
  WITH CHECK (
    -- Allow if authenticated user matches user_id OR if it's a guest checkout (user_id is null)
    (auth.uid() = user_id) OR (user_id IS NULL)
  );

CREATE POLICY "Admins can update orders" 
  ON public.orders FOR UPDATE 
  USING (public.is_admin());


-- 4. Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order Item Policies
CREATE POLICY "Users can view their own order items" 
  ON public.order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" 
  ON public.order_items FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Users and guests can insert order items" 
  ON public.order_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );
