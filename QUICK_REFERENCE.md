# 🎯 Quick Reference Card - Home Care Harmony

## Emergency Cheat Sheet

### 🏃 Get Running (30 seconds)
```bash
cd home-care-harmony-main
bun install
bun run dev
# Open http://localhost:5173
```

### 🔑 Instant Credentials
| Role | Email | Password | Redirect |
|------|-------|----------|----------|
| User | user@example.com | password123 | Home / |
| Admin | admin@homecare.com | admin123 | /admin |

### 📍 Key File Locations
| What | Where |
|------|-------|
| Authentication | `src/context/AuthContext.tsx` |
| Shopping Cart | `src/context/CartContext.tsx` |
| Languages | `src/context/LanguageContext.tsx` |
| Login Page | `src/pages/Login.tsx` |
| Checkout | `src/pages/Checkout.tsx` |
| Routes | `src/App.tsx` |

---

## 🗺️ User Journey Map

```
START → Home → Products → Product Detail
           ↓       ↓
        Cart → Checkout (3 Steps: Address → Delivery → Payment)
                         ↓
                    Order Confirmation
```

### Admin Journey
```
Login with admin@homecare.com → Auto-redirect → /admin Dashboard
                                   ↓
                        Products | Users | Orders
```

---

## ✨ Core Features at a Glance

### E-Commerce
- **Product** - Browse, view details, add to cart
- **Cart** - Update quantities, apply coupons, proceed checkout
- **Checkout** - 3 steps (address, delivery, payment)
- **Order** - Confirmation page with timeline

### Auth
- **Login** - Email + password
- **Sign Up** - Name, email (unique), password (6+ chars)
- **Logout** - Clears session
- **Admin** - Auto-access to /admin if email = admin@homecare.com

### Languages
- **English** - Default
- **Tamil** - via dropdown
- **Hindi** - via dropdown

### Admin
- Dashboard overview
- Product management
- User management
- Order management

---

## 🎮 Component Navigation

### Key Components
| Component | Path | Purpose |
|-----------|------|---------|
| Header | `components/Header.tsx` | Navigation bar |
| Cart | `pages/Cart.tsx` | Shopping cart display |
| Checkout | `pages/Checkout.tsx` | 3-step checkout |
| Login | `pages/Login.tsx` | Auth page |
| OrderConfirmation | `pages/OrderConfirmation.tsx` | Success page |

### Admin Components
| Component | Path | Purpose |
|-----------|------|---------|
| Dashboard | `pages/admin/Dashboard.tsx` | Overview |
| Products | `pages/admin/Products.tsx` | Manage products |
| Users | `pages/admin/Users.tsx` | Manage users |
| Orders | `pages/admin/Orders.tsx` | Manage orders |

---

## 🔄 Data Flow

### Authentication Flow
```
User Input (email, password)
    ↓
AuthContext.login() / signup()
    ↓
Validate & Check localStorage["registered_users"]
    ↓
Success → Save to localStorage["auth_user"] → Update state
Fail → Throw error → Show toast message
```

### Cart Flow
```
Add Item → CartContext.addItem()
    ↓
Update localStorage["cart"] → Re-render
    ↓
Show toast notification
```

### Checkout Flow
```
Step 1: Select Address
    ↓
Step 2: Select Delivery (Standard/Express)
    ↓
Step 3: Select Payment Method
    ↓
Simulate Payment (2 sec delay)
    ↓
Redirect to OrderConfirmation with state
```

---

## 📱 Responsive Breakpoints

| Device | Width | Columns |
|--------|-------|---------|
| Mobile | < 480px | 1 |
| Tablet | 480-1024px | 2 |
| Desktop | > 1024px | 3 |

---

## 🎨 Color Palette

From `tailwind.config.ts`:
- **Primary (Green)**: `#10b981` - Eco-friendly
- **Secondary (Purple)**: `#8b5cf6` - Accent
- **Foreground**: `#ffffff` - Text
- **Background**: `#f9fafb` - Background
- **Border**: `#e5e7eb` - Lines

---

## 🚀 Common Tasks

### Add New Route
```typescript
// In src/App.tsx
<Route path="/new-page" element={<NewPage />} />
```

### Use Translation
```typescript
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const t = useTranslation();
  return <h1>{t('header.title')}</h1>;
};
```

### Access Cart Context
```typescript
import { useCart } from '@/context/CartContext';

const MyComponent = () => {
  const { items, addItem, removeFromCart } = useCart();
  // Use cart methods
};
```

### Protect Admin Route
```typescript
<Route 
  path="/admin/products" 
  element={<RequireAdmin><AdminProducts /></RequireAdmin>} 
/>
```

### Navigate Programmatically
```typescript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  navigate('/checkout'); // Simple
  navigate('/confirm', { state: { orderId: '123' } }); // With state
  navigate(-1); // Go back
};
```

### Getting Route State
```typescript
import { useLocation } from 'react-router-dom';

const MyComponent = () => {
  const location = useLocation();
  const orderData = location.state;
};
```

---

## 🧪 Testing Checklist

- [ ] Login works with correct credentials
- [ ] Signup creates new user
- [ ] Admin login redirects to /admin
- [ ] Add to cart increments counter
- [ ] Remove from cart works
- [ ] Apply coupon works
- [ ] Checkout 3-step process completes
- [ ] Order confirmation displays
- [ ] Language switching works
- [ ] Mobile responsive works
- [ ] All animations are smooth
- [ ] Logout clears session

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Auth not working | Clear `localStorage` → `localStorage.clear()` |
| Not redirecting to /admin | Verify email is `admin@homecare.com` exactly |
| Language not changing | Clear browser cache, refresh page |
| Styles not showing | Run `bun run build` to rebuild Tailwind |
| Port already in use | Use different port: `bun run dev -- --port 3000` |
| Products not showing | Check `src/data/products.ts` exists |

---

## 📊 Storage Keys (localStorage)

| Key | Data | Used For |
|-----|------|----------|
| `auth_user` | Current logged-in user | Session management |
| `registered_users` | All registered users | Authentication |
| `cart` | Shopping cart items | Cart persistence |
| `language` | Selected language | Language persistence |
| `couponapplied` | Applied coupon code | Discount tracking |

---

## 🎯 Shortcut Routes

- Home: `/`
- Products: `/products`
- Product Detail: `/products/:id`
- Cart: `/cart`
- Checkout: `/checkout`
- Order Confirmation: `/order-confirmation`
- Login: `/login`
- Admin Dashboard: `/admin`
- Admin Products: `/admin/products`
- Admin Users: `/admin/users`
- Admin Orders: `/admin/orders`

---

## 📦 NPM/Bun Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run tests
bun run test

# Preview production build
bun run preview
```

---

## 🔐 Coupon Codes

| Code | Discount | Type |
|------|----------|------|
| SAVE10 | 10% | Percentage |
| SAVE20 | 20% | Percentage |

*Extendable in `src/data/products.ts` or data file*

---

## 💡 Key Concepts Quick Recap

### React Context API
Three main contexts for state management:
1. **AuthContext** - User authentication & admin access
2. **CartContext** - Shopping cart items & operations
3. **LanguageContext** - UI language selection

### React Router v6
Handles client-side routing with:
- `<BrowserRouter>` - Wrapper
- `<Routes>` - Define all routes
- `<Route>` - Individual route
- `useNavigate()` - Programmatic navigation
- `useLocation()` - Get current route & state

### Framer Motion
Animations for:
- Navbar underlines (slide)
- Language dropdown (spring)
- Cart badge (bounce)
- Success messages (scale + rotate)
- Mobile menu items (stagger)

### Tailwind CSS
Styling with utility classes for:
- Spacing: `p-4 m-2 gap-3`
- Colors: `bg-primary text-foreground`
- Layout: `flex grid justify-between`
- Responsive: `hidden md:block lg:flex`

---

## 🎓 Documentation Links

- **Full Auth Guide**: Read `AUTHENTICATION_GUIDE.md`
- **Testing Guide**: Read `TESTING_GUIDE.md`
- **Technical Details**: Read `TECHNICAL_GUIDE.md`
- **Carousel**: Read `CAROUSEL_ENHANCEMENTS.md`

---

## ⚡ Performance Tips

1. **Code Splitting**: Use `React.lazy()` for admin routes
2. **Memoization**: Use `React.memo()` for ProductCard component
3. **useCallback**: Wrap event handlers to prevent re-renders
4. **Image Optimization**: Use `loading="lazy"` on images
5. **CSS**: Tailwind already optimized (production build removes unused CSS)

---

## 🔄 State Management Summary

### AuthContext
```
State: user (User | null), loading (boolean)
Methods: login(), signup(), logout()
Storage: localStorage["auth_user"], localStorage["registered_users"]
```

### CartContext
```
State: items (CartItem[]), totalPrice, couponCode, discount
Methods: addItem(), removeFromCart(), updateQuantity(), applyCoupon()
Storage: localStorage["cart"]
```

### LanguageContext
```
State: language ("en" | "ta" | "hi")
Methods: setLanguage()
Storage: localStorage["language"]
```

---

## 🛠️ Dependencies Installed

- **Core**: react, react-dom, react-router-dom
- **State**: (Built-in Context API)
- **Animation**: framer-motion
- **UI**: shadcn/ui, @radix-ui/*, lucide-react
- **Styling**: tailwindcss, postcss
- **Notifications**: sonner
- **Build**: vite, typescript
- **Testing**: vitest

---

## 📋 Admin Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Protected Routes | ✅ Complete | Via RequireAdmin component |
| Dashboard | ✅ Complete | Basic overview page |
| Product Mgmt | ⚠️ Layout Only | UI created, CRUD pending |
| User Mgmt | ⚠️ Layout Only | UI created, CRUD pending |
| Order Mgmt | ⚠️ Layout Only | UI created, CRUD pending |

---

## 💾 Production Deployment Checklist

Before deploying to production:

- [ ] Replace localStorage auth with JWT backend
- [ ] Implement real payment gateway
- [ ] Add database persistence
- [ ] Remove demo credentials
- [ ] Set up environment variables
- [ ] Configure CORS properly
- [ ] Add error logging/monitoring
- [ ] Implement password hashing
- [ ] Add rate limiting
- [ ] Set up HTTPS/SSL
- [ ] Test all features
- [ ] Performance optimization
- [ ] Security audit

---

**Last Updated**: From recent session with full authentication, checkout, and admin panel implementation.

**Status**: 🟢 Ready for Testing & Development
