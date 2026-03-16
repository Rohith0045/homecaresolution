# Home Care Harmony 🌿

> Sustainable and affordable home-care essentials tailored for Indian households.

A complete, production-ready e-commerce platform for eco-friendly cleaning products with authentication, multi-language support, checkout flow, and admin management panel.

---

## 📋 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- Bun package manager (or npm/yarn)

### Installation & Running

```bash
cd home-care-harmony-main
bun install
bun run dev
```

The application will be available at `http://localhost:5173`

---

## 📚 Documentation

### For Users
- **[Authentication & Admin Guide](./AUTHENTICATION_GUIDE.md)** - How to login, signup, and access the admin panel
  - Demo credentials provided
  - Step-by-step authentication workflow
  - Admin panel access instructions

### For Testers
- **[Testing & User Journey Guide](./TESTING_GUIDE.md)** - Complete testing scenarios
  - Test cases for every feature
  - User journey workflows
  - Edge cases and error handling
  - Responsive design testing
  - Accessibility testing

### For Developers
- **[Technical Implementation Guide](./TECHNICAL_GUIDE.md)** - Architecture and code details
  - Complete project structure
  - Authentication system architecture
  - API design and state management
  - Animation patterns (Framer Motion)
  - Deployment checklist

---

## ✨ Key Features

### 🛍️ E-Commerce Core
- ✅ Product browsing with categories
- ✅ Product details with reviews and ratings
- ✅ Shopping cart with quantity management
- ✅ Coupon/discount code system
- ✅ 3-step checkout process (Flipkart-style)
  - Address selection/addition
  - Delivery option selection (Standard/Express)
  - Payment method selection
- ✅ Order confirmation with timeline

### 🔐 Authentication
- ✅ User login and signup
- ✅ Password validation (min 6 characters)
- ✅ Email uniqueness checking
- ✅ Session persistence (localStorage)
- ✅ Admin role detection
- ✅ Demo credentials for testing

### 👨‍💼 Admin Panel
- ✅ Protected admin routes
- ✅ Dashboard overview
- ✅ Product management interface
- ✅ User management interface
- ✅ Order management interface
- ✅ Admin-only access with auto-redirect

### 🌍 Multi-Language Support
- ✅ English
- ✅ Tamil
- ✅ Hindi
- ✅ Language persistence across pages
- ✅ Translation system for all UI elements

### 🎨 Design & Animations
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Smooth Framer Motion animations
- ✅ Hero banner carousel
- ✅ Navbar with animations
- ✅ Button and link hover effects
- ✅ Toast notifications (Sonner)
- ✅ Loading states

### 📱 Responsive & Accessible
- ✅ Mobile-first design
- ✅ Tablet and desktop layouts
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Touch-friendly interactions

---

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **React Context API** - State management
- **Framer Motion** - Animations

### Styling & Components
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### Development
- **Vite** - Modern bundler
- **Bun** - JavaScript runtime
- **TypeScript** - Type checking
- **Vitest** - Testing framework

### Notifications & UI
- **Sonner** - Toast notifications
- **Radix UI** - Accessible components

---

## 📂 Project Structure

```
src/
├── components/
│   ├── admin/              # Admin layout and protection
│   ├── ui/                 # shadcn/ui components
│   ├── Header.tsx          # Navigation with animations
│   ├── ProductCard.tsx     # Product display card
│   └── ...
├── context/
│   ├── AuthContext.tsx     # Authentication (login/signup/logout)
│   ├── CartContext.tsx     # Shopping cart state
│   └── LanguageContext.tsx # Language selection
├── pages/
│   ├── Index.tsx           # Home page
│   ├── Products.tsx        # Products listing
│   ├── ProductDetail.tsx   # Single product
│   ├── Cart.tsx            # Shopping cart
│   ├── Checkout.tsx        # 3-step checkout
│   ├── Login.tsx           # Authentication page
│   ├── admin/              # Admin pages
│   └── ...
├── hooks/
│   ├── useTranslation.ts   # Translation hook
│   └── ...
├── data/
│   ├── products.ts         # Product data
│   ├── translations.ts     # Language data
│   └── ...
├── App.tsx                 # Root component with routing
└── main.tsx                # Entry point
```

---

## 🔑 Demo Credentials

### Regular User
```
Email: user@example.com
Password: password123
```
*Redirects to home page*

### Admin User
```
Email: admin@homecare.com
Password: admin123
```
*Redirects to /admin dashboard*

---

## 🚀 User Workflows

### Complete Shopping Journey
1. **Browse** - View products on home page or products page
2. **Select** - Click product for details
3. **Add to Cart** - Add items to shopping cart
4. **Review Cart** - Check items and apply coupons
5. **Checkout** - 3-step process:
   - Select delivery address
   - Choose delivery option (Standard/Express)
   - Select payment method
6. **Confirm** - View order confirmation with timeline

### Admin Access
1. Navigate to `/login`
2. Login with admin credentials (`admin@homecare.com` / `admin123`)
3. Auto-redirect to `/admin` dashboard
4. Manage products, users, and orders

### Language Switching
1. Click globe icon in navbar
2. Select desired language (English, Tamil, Hindi)
3. All content translates immediately
4. Selection persists across pages

---

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for:
- Complete test cases for all features
- User journey testing scenarios
- Edge cases and error handling
- Responsive design testing
- Performance and animation verification

Quick test:
```bash
bun run test
```

---

## 📦 Production Build

```bash
bun run build
```

Output is generated in the `dist/` folder. Deploy this folder to any static hosting provider.

### Deployment Options
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static host (nginx, Apache, etc.)

---

## 🔒 Security Notes

### Current State (Development)
- ✅ Passwords stored in localStorage (demo only)
- ✅ No real payment processing
- ✅ Basic authentication without JWT

### For Production
You must implement:
- [ ] Backend API for authentication
- [ ] Password hashing (bcrypt)
- [ ] JWT token management
- [ ] Real payment gateway (Razorpay, Stripe)
- [ ] Database for persistent storage
- [ ] HTTPS/SSL certificates
- [ ] CORS security headers
- [ ] Rate limiting
- [ ] Input validation and sanitization

See [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md) for deployment checklist.

---

## 🎓 Learning Resources

### For Getting Started
1. Read [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for user features
2. Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing workflows
3. Check [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md) for code details

### Key Concepts
- **Authentication**: See `src/context/AuthContext.tsx`
- **Cart**: See `src/context/CartContext.tsx`
- **Routing**: See `src/App.tsx`
- **Animations**: See `src/components/Header.tsx` and `src/pages/Checkout.tsx`
- **UI Components**: See `src/components/ui/`

---

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules .next
bun install
bun run dev
```

### Port already in use
```bash
# Change port in vite.config.ts or use:
bun run dev -- --port 3000
```

### Authentication issues
- Clear browser localStorage: `localStorage.clear()`
- Check demo credentials in AUTHENTICATION_GUIDE.md
- Verify AuthContext.tsx is properly imported

### Styling issues
- Rebuild Tailwind: `bun run build`
- Check tailwind.config.ts for theme configuration
- Clear browser cache

---

## 📞 Support & Documentation

- **User Guide**: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- **Testing**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Development**: [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md)
- **Carousel Guide**: [CAROUSEL_ENHANCEMENTS.md](./CAROUSEL_ENHANCEMENTS.md)

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly (see TESTING_GUIDE.md)
4. Submit a pull request

---

## 📄 License

[Add your license here]

---

## 🎯 Future Roadmap

### Phase 1 (In Progress)
- ✅ Core e-commerce functionality
- ✅ Authentication system
- ✅ Multi-language support
- ✅ Checkout flow

### Phase 2 (Planned)
- [ ] Backend API integration
- [ ] Real payment gateway
- [ ] Database persistence
- [ ] Email notifications
- [ ] Order tracking

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Recommendation engine
- [ ] Wishlist & bookmarking
- [ ] Customer reviews

---

## 📊 Project Stats

- **Pages**: 10+ (Home, Products, Cart, Checkout, etc.)
- **Components**: 20+ (Header, ProductCard, etc.)
- **Context Providers**: 3 (Auth, Cart, Language)
- **Supported Languages**: 3 (English, Tamil, Hindi)
- **Checkout Steps**: 3 (Address → Delivery → Payment)
- **Animation Libraries**: Framer Motion
- **UI Components**: 25+ from shadcn/ui

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)

---

**Happy coding! 🚀 For detailed information, see the documentation files above.**
