# 👨‍💻 Technical Implementation & Architecture Guide

## Project Structure

```
home-care-harmony-main/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx      # Admin layout wrapper
│   │   │   └── RequireAdmin.tsx     # Admin protection component
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── Header.tsx               # Navigation bar with animations
│   │   ├── HeroBannerCarousel.tsx   # Auto-rotating product carousel
│   │   ├── ProductCard.tsx          # Individual product display
│   │   ├── ProductCarousel.tsx      # Horizontal product scroller
│   │   └── ...other components
│   ├── context/
│   │   ├── AuthContext.tsx          # Authentication state & methods
│   │   ├── CartContext.tsx          # Shopping cart state
│   │   └── LanguageContext.tsx      # Internationalization
│   ├── pages/
│   │   ├── Index.tsx                # Home page
│   │   ├── Products.tsx             # Products listing
│   │   ├── ProductDetail.tsx        # Single product page
│   │   ├── Cart.tsx                 # Shopping cart
│   │   ├── Login.tsx                # Authentication page
│   │   ├── Checkout.tsx             # 3-step checkout
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx        # Admin overview
│   │   │   ├── Products.tsx         # Product management
│   │   │   ├── Users.tsx            # User management
│   │   │   └── Orders.tsx           # Order management
│   │   └── ...other pages
│   ├── hooks/
│   │   ├── useTranslation.ts        # Translation hook
│   │   └── use-*.tsx                # shadcn/ui hooks
│   ├── data/
│   │   ├── products.ts              # Product data
│   │   ├── translations.ts          # Language translations
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts                 # Helper utilities
│   │   └── admin.ts                 # Admin utilities
│   ├── App.tsx                      # Root component with routing
│   └── main.tsx                     # App entry point
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
└── vitest.config.ts                 # Test configuration
```

---

## Core Technologies & Stack

### Frontend Framework
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **React Router v6** - Client-side routing
- **React Context API** - State management

### Styling & Animation
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Professional animations and transitions
- **Lucide React** - Icon library
- **shadcn/ui** - Component library built on Radix UI

### Build & Development
- **Vite** - Modern bundler and dev server
- **Bun** - Fast JavaScript runtime and package manager
- **TypeScript** - Type checking and compilation

### Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing (optional setup)

### Notifications
- **Sonner** - Toast notifications library

---

## Authentication System Architecture

### AuthContext Implementation

**Location:** `src/context/AuthContext.tsx`

**Key Type Definitions:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}
```

**Core Methods:**

1. **login(email, password)**
   - Retrieves registered users from localStorage
   - Validates email/password combination
   - Returns User object with admin flag
   - Throws error with message for UI handling

2. **signup(name, email, password)**
   - Validates all inputs (non-empty, password length)
   - Checks email uniqueness
   - Auto-detects admin role (email === "admin@homecare.com")
   - Creates user object and saves to localStorage
   - Auto-logs in user

3. **logout()**
   - Clears user state
   - Removes user from localStorage

**Storage Structure:**
```typescript
// localStorage key: "auth_user"
{
  id: "1698765432123",
  name: "Demo User",
  email: "user@example.com",
  isAdmin: false
}

// localStorage key: "registered_users"
{
  "user@example.com": {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
    isAdmin: false
  },
  "admin@homecare.com": {
    id: "2",
    name: "Admin",
    email: "admin@homecare.com",
    password: "admin123",
    isAdmin: true
  }
}
```

**Usage in Components:**
```typescript
import { useAuth } from '@/context/AuthContext';

const MyComponent = () => {
  const { user, login, signup, logout } = useAuth();
  
  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      console.log('Logged in as:', user.name);
    } catch (error) {
      console.error(error.message);
    }
  };
  
  if (user) {
    return <div>Welcome, {user.name}!</div>;
  }
};
```

---

## Authentication Flow

### Login Flow
```
User enters credentials
        ↓
    Login(email, password)
        ↓
    Validate format (not empty)
        ↓
    Retrieve registered_users from localStorage
        ↓
    Find user by email
        ↓
    ├─ Not found? → Throw "User not found" error
    │
    └─ Found? → Validate password
        ↓
        ├─ Password mismatch? → Throw error
        │
        └─ Password match? → Create User object
            ↓
            Set isAdmin = (email === "admin@homecare.com")
            ↓
            Save to localStorage["auth_user"]
            ↓
            Return User object to component
            ↓
            Component redirects based on isAdmin flag
```

### Signup Flow
```
User submits signup form
        ↓
    Signup(name, email, password)
        ↓
    Validate inputs (non-empty, password >= 6 chars)
        ↓
    Check if email already registered
        ├─ Exists? → Throw "Email already in use" error
        │
        └─ Unique? → Proceed
            ↓
            Create new User object
            ↓
            Check if email === "admin@homecare.com"
            ├─ Yes → isAdmin = true
            └─ No → isAdmin = false
            ↓
            Add to registered_users in localStorage
            ↓
            Auto-login (call login method)
            ↓
            Redirect to home (regular) or /admin (admin)
```

### Logout Flow
```
User clicks logout button
        ↓
    Logout()
        ↓
    Clear user state to null
        ↓
    Remove "auth_user" from localStorage
        ↓
    Redirect to login page (usually automatic via component)
```

---

## Checkout System Architecture

### Checkout Component Structure

**Location:** `src/pages/Checkout.tsx`

**State Management:**
```typescript
interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutState {
  step: 1 | 2 | 3;
  addresses: Address[];
  selectedAddress: Address | null;
  deliveryOption: 'standard' | 'express' | null;
  paymentMethod: string | null;
  processingPayment: boolean;
}
```

**Step 1: Address Selection**
- Display saved addresses with radio buttons
- Form to add new address (collapsible)
- Submit button to proceed
- Validation: Check address selected

**Step 2: Delivery Options**
- Standard (3-5 days, free) - Default
- Express (1-2 days, ₹150) - Premium
- Radio button selection
- Real-time totals update

**Step 3: Payment Methods**
- UPI: Google Pay, PhonePe, Paytm
- Cards: Visa, Mastercard, RuPay
- Net Banking: Available banks
- Radio button selection
- "Place Order" button triggers payment processing

**Order Summary (Sticky Sidebar):**
```
Items:
- Product 1    x2    ₹X.XX
- Product 2    x1    ₹X.XX

Subtotal:            ₹XXX.XX
Discount (Coupon):   -₹X.XX
Shipping:            ₹0.00
Delivery Charge:     +₹150.00
─────────────────────────────
TOTAL              ₹XXX.XX
```

### Order Confirmation Component

**Location:** `src/pages/OrderConfirmation.tsx`

**Data Reception:**
```typescript
// Receives from location state (React Router)
location.state = {
  orderId: string;
  orderDate: Date;
  deliveryAddress: Address;
  deliveryOption: 'standard' | 'express';
  paymentMethod: string;
  deliveryCharges: number;
  orderItems: CartItem[];
  totalAmount: number;
  discountAmount: number;
}
```

**Display Sections:**
1. Success checkmark animation
2. Order ID, status, date
3. Delivery address
4. Timeline (Processing → Shipped → Delivered)
5. Items list with prices
6. Order total breakdown
7. Email confirmation notification
8. Action buttons (Continue Shopping, Back to Home)

---

## Cart Context

### Structure
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  couponCode: string | null;
  discount: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  applyCoupon: (code: string) => void;
  clearCart: () => void;
}
```

### Available Coupon Codes
- `SAVE10` - 10% discount
- `SAVE20` - 20% discount
- (Can be extended in data file)

### Usage
```typescript
const CartPage = () => {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, e.target.valueAsNumber)}
          />
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};
```

---

## Language & Internationalization

### Translation System

**Location:** `src/hooks/useTranslation.ts`

**Supported Languages:**
- English (`en`)
- Tamil (`ta`)
- Hindi (`hi`)

**Translation File Structure:**
```typescript
// src/data/translations.ts
const translations = {
  en: {
    header: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact"
    },
    cart: {
      title: "Shopping Cart",
      subtotal: "Subtotal",
      total: "Total"
    }
    // ... more keys
  },
  ta: {
    header: {
      home: "முகப்பு",
      products: "பொருட்கள்",
      // ...
    }
  },
  hi: {
    // Hindi translations...
  }
};
```

**Usage in Components:**
```typescript
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t('header.home')}</h1>
      <p>{t('cart.total')}</p>
    </div>
  );
};
```

**Translation Hierarchy:**
1. Check current language in LanguageContext
2. Get translation from translations.ts
3. Return translated string
4. Fallback to English if key not found in other languages

---

## Component Animation Patterns

### Framer Motion Animations Used

**1. NavLink Underline Animation (Header.tsx)**
```typescript
<motion.div
  layoutId="underline"
  className="absolute bottom-0 left-0 h-0.5 bg-primary"
  animate={{ width: animatedWidth }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
/>
```

**2. Language Dropdown (Header.tsx)**
```typescript
<AnimatePresence>
  {openLanguage && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
    >
      {/* Dropdown content */}
    </motion.div>
  )}
</AnimatePresence>
```

**3. Cart Badge Bounce (Header.tsx)**
```typescript
<motion.div
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 0.3 }}
>
  {cartItems.length}
</motion.div>
```

**4. Success Message (Login.tsx, OrderConfirmation.tsx)**
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 100, damping: 10 }}
>
  <CheckCircle className="animate-rotate" />
</motion.div>
```

**5. Stagger Animation (Mobile Menu)**
```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## Routing Configuration

### React Router Setup (App.tsx)

**Route Structure:**
```typescript
<BrowserRouter>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes (Protected) */}
              <Route path="/admin" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
              <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
              <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
              <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
</BrowserRouter>
```

### Route Navigation Examples

**Using Link Component:**
```typescript
import { Link } from 'react-router-dom';

<Link to="/products">View Products</Link>
```

**Using useNavigate Hook:**
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Simple navigation
navigate('/checkout');

// With state
navigate('/order-confirmation', {
  state: {
    orderId: 'ORD-123',
    totalAmount: 1299.99
  }
});

// Go back
navigate(-1);
```

**Accessing Route State:**
```typescript
import { useLocation } from 'react-router-dom';

const confirm = () => {
  const location = useLocation();
  const orderData = location.state; // { orderId, totalAmount, ... }
};
```

---

## Admin Protection

### RequireAdmin Component (src/components/admin/RequireAdmin.tsx)

**Purpose:** Protect admin routes from unauthorized access

**Implementation:**
```typescript
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

**Usage in Routes:**
```typescript
<Route 
  path="/admin" 
  element={
    <RequireAdmin>
      <Dashboard />
    </RequireAdmin>
  } 
/>
```

---

## Data Structures

### Product Object
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity?: number;
}
```

### Order Object
```typescript
interface Order {
  id: string;
  userId: string;
  orderDate: Date;
  deliveryAddress: Address;
  deliveryOption: 'standard' | 'express';
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shippingCharge: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  trackingNumber?: string;
}
```

---

## Styling & Tailwind Configuration

### Custom Colors (tailwind.config.ts)
```typescript
colors: {
  primary: '#10b981',        // Eco-friendly green
  secondary: '#8b5cf6',      // Purple accent
  foreground: '#ffffff',
  background: '#f9fafb',
  muted: {
    foreground: '#6b7280'
  },
  border: '#e5e7eb',
  card: '#ffffff'
}
```

### Common Tailwind Classes Used
- **Spacing:** `p-4`, `m-2`, `gap-3`, `space-y-4`
- **Typography:** `text-lg`, `font-semibold`, `text-center`
- **Colors:** `bg-primary`, `text-foreground`, `border-border`
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Flex:** `flex`, `justify-between`, `items-center`, `gap-2`
- **Responsive:** `hidden md:block`, `w-full md:w-1/2`

---

## Testing Strategy

### Unit Testing (Vitest)

**Location:** `src/test/`

**Example Test:**
```typescript
import { describe, it, expect } from 'vitest';

describe('AuthContext', () => {
  it('should login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const user = await result.current.login(
        'user@example.com',
        'password123'
      );
    });
    
    expect(result.current.user).toBeDefined();
    expect(result.current.user?.email).toBe('user@example.com');
  });
  
  it('should throw error on invalid password', async () => {
    const { result } = renderHook(() => useAuth());
    
    await expect(
      result.current.login('user@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid password');
  });
});
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { Login } from '@/pages/Login';

describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />);
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const Checkout = lazy(() => import('./pages/Checkout'));
const AdminPanel = lazy(() => import('./pages/admin/Dashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Checkout />
</Suspense>
```

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

const ProductCard = memo(({ product, onAdd }) => {
  // Component only re-renders if product or onAdd changes
  return <div>...</div>;
});

const handleAddItem = useCallback(() => {
  // Function reference remains stable
  addItem(product);
}, [product]);
```

### Image Optimization
```typescript
<img 
  src={product.image}
  alt={product.name}
  loading="lazy"
  className="w-full aspect-square object-cover"
/>
```

---

## Environment Variables

### Create `.env.local`
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Home Care Harmony
VITE_ENABLE_ADMIN=true
```

### Usage
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## Future Enhancements

### Backend Integration
1. Replace localStorage auth with JWT tokens
2. Create REST API endpoints for auth, products, orders
3. Implement database persistence
4. Add email notifications

### Payment Gateway
1. Integrate Razorpay or Stripe
2. Replace mock payment processing
3. Store payment records
4. Implement refund handling

### Admin Features
1. Product CRUD operations
2. User management
3. Order tracking and updates
4. Analytics dashboard
5. Inventory management

### Additional Features
1. Product reviews and ratings
2. Wishlist functionality
3. User profile management
4. Order history and tracking
5. Return/refund management
6. Newsletter email system

---

## Deployment Checklist

Before deploying to production:

- [ ] Replace localStorage auth with backend API
- [ ] Implement password hashing (bcrypt)
- [ ] Add JWT token handling
- [ ] Set up CORS properly
- [ ] Remove demo credentials
- [ ] Implement real payment gateway
- [ ] Add error logging/monitoring
- [ ] Set up database backups
- [ ] Configure environment variables
- [ ] Run security audit
- [ ] Test all features in production environment
- [ ] Set up CI/CD pipeline
- [ ] Document API endpoints
- [ ] Create admin user interface for management

