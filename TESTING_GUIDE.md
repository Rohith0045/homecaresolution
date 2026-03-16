# 🧪 Application Testing & User Journey Guide

## Complete User Journey

This guide walks through all major user interactions in Home Care Harmony from start to finish.

---

## 1️⃣ Getting Started

### Prerequisites
- Node.js with Bun package manager installed
- VS Code or any code editor
- Terminal/Command Prompt

### Installation & Setup
```bash
cd home-care-harmony-main
bun install
bun run dev
```

The app will open at `http://localhost:5173` (or your configured Vite port)

---

## 2️⃣ Testing the Homepage

### Scenario: First-time Visitor
1. ✅ Open the app on `localhost:5173`
2. ✅ View Hero Banner Carousel (auto-rotating carousel with navigation buttons)
3. ✅ See Hero Section with tagline and CTA buttons
4. ✅ Browse Category Grid (different product categories)
5. ✅ View Product Carousel (horizontal scrolling product cards)
6. ✅ Read Sustainability Section
7. ✅ Check Testimonials Section
8. ✅ Subscribe to Newsletter
9. ✅ View Footer with links

### Navigation Bar Features
- **Logo** - Clicking "Home Care Harmony" returns to home
- **Nav Links** - Home, Products, About, Contact pages
- **Language Selector** - Switch between English, Tamil, Hindi
- **Cart Icon** - Shows item count badge
- **Mobile Menu** - Hamburger menu on smaller screens

---

## 3️⃣ Testing Authentication & User Accounts

### Test Case 1: Login with Demo User Account
**Objective:** Verify login functionality works correctly

**Steps:**
1. Click **"Login"** in navbar or navigate to `/login`
2. The Login Tab should be selected by default
3. Enter Email: `user@example.com`
4. Enter Password: `password123`
5. Click **"Login"** button
6. ✅ See success message: "Welcome, Demo User!"
7. ✅ Auto-redirect to home page (`/`)
8. ✅ See user name in navbar (if implemented)

### Test Case 2: Sign Up New User Account
**Objective:** Test user registration and signup validation

**Steps:**
1. Navigate to `/login`
2. Click **"Sign Up"** tab
3. Enter Full Name: `John Doe`
4. Enter Email: `john.doe@example.com` (unique, not existing)
5. Enter Password: `securepass123`
6. Confirm Password: `securepass123`
7. ✅ Check "I agree to Terms of Service"
8. Click **"Create Account"**
9. ✅ See success message: "Welcome, John Doe!"
10. ✅ Auto-redirect to home page as regular user

### Test Case 3: Admin Login & Access
**Objective:** Verify admin authentication and redirect

**Steps:**
1. Navigate to `/login`
2. Use Email: `admin@homecare.com`
3. Use Password: `admin123`
4. Click **"Login"**
5. ✅ See success message: "Welcome, Admin!"
6. ✅ Auto-redirect to `/admin` (admin panel)
7. ✅ See **"Admin"** link in navbar
8. ✅ View dashboard/admin pages

### Test Case 4: Logout
**Objective:** Test session termination

**Steps:**
1. Login as any user
2. Look for logout option (user menu or button)
3. Click **"Logout"**
4. ✅ Session cleared from localStorage
5. ✅ Redirect to login page or home

---

## 4️⃣ Testing Products & Browse Experience

### Test Case 1: View All Products
**Objective:** Test product listing and filtering

**Steps:**
1. Click **"Products"** in navbar
2. ✅ See all available products
3. ✅ View product cards with image, name, price, rating
4. ✅ Products should be responsive (1-2-3 columns based on screen)

### Test Case 2: Filter by Category
**Objective:** Test category filtering

**Steps:**
1. From Category Grid on homepage, click a category
2. Or use filter options if present on Products page
3. ✅ Products filtered to selected category
4. ✅ Category name appears in breadcrumb

### Test Case 3: Search & Sort
**Objective:** Test search and sorting functionality

**Steps:**
1. Look for search bar on Products page
2. Enter product name (e.g., "Soap", "Cleaner")
3. ✅ Products filtered by search term
4. ✅ Sort by price, popularity, rating
5. ✅ Sorting order changes product display

### Test Case 4: View Product Details
**Objective:** Test individual product page

**Steps:**
1. Click on any product card
2. Navigate to Product Detail page (`/products/:id`)
3. ✅ See full product image
4. ✅ View product name, price, rating, reviews
5. ✅ Read product description
6. ✅ See available quantity/stock status
7. ✅ View "Add to Cart" button
8. ✅ Check related products recommendation

---

## 5️⃣ Testing Shopping Cart

### Test Case 1: Add Product to Cart
**Objective:** Test cart addition

**Steps:**
1. Go to Products page
2. Click on a product
3. Click **"Add to Cart"** button
4. ✅ Toast notification appears: "Added to cart"
5. ✅ Cart badge in navbar increments
6. Cart now shows 1 item

### Test Case 2: View Shopping Cart
**Objective:** Test cart display

**Steps:**
1. Click **Cart Icon** in navbar
2. Navigate to `/cart`
3. ✅ See all added items
4. ✅ Each item shows: image, name, price, quantity
5. ✅ Order summary on right showing subtotal, tax, total
6. ✅ Items display in selected language (English/Tamil/Hindi)

### Test Case 3: Modify Cart Quantities
**Objective:** Test quantity adjustments

**Steps:**
1. In cart page, find an item
2. Click **"+"** button to increase quantity
3. ✅ Quantity increases
4. ✅ Item subtotal updates
5. ✅ Order total recalculates
6. Click **"−"** button to decrease quantity
7. ✅ Minimum quantity is 1 (can't go below)
8. Price updates accordingly

### Test Case 4: Remove Item from Cart
**Objective:** Test item removal

**Steps:**
1. In cart page, click **"Remove"** or **"X"** button on an item
2. ✅ Item disappears from cart
3. ✅ Cart badge decrements
4. ✅ Order total updates
5. ✅ If cart is empty, show "Your cart is empty" message

### Test Case 5: Apply Coupon Code
**Objective:** Test discount application

**Steps:**
1. In cart page, find coupon input field
2. Type a valid coupon code (e.g., `SAVE10`)
3. Click **"Apply"** button
4. ✅ Discount appears in order summary
5. ✅ Total price reduced by discount amount
6. ✅ Invalid codes show error message

### Test Case 6: Proceed to Checkout
**Objective:** Test transition to checkout

**Steps:**
1. In cart page, click **"Proceed to Checkout"** button
2. ✅ Redirect to `/checkout` page
3. ✅ Cart items are preserved and visible in sidebar
4. ✅ Step 1 of checkout displayed

---

## 6️⃣ Testing Checkout Flow (3-Step Process)

### Test Case 1: Step 1 - Select/Add Delivery Address
**Objective:** Test address selection and addition

**Initial State:**
1. Navigate to `/checkout`
2. ✅ Step 1 displayed: "Delivery Address"
3. ✅ Existing saved addresses shown (if any)

**Adding New Address:**
1. Click **"Add New Address"** or similar button
2. Form appears with fields:
   - Full Name
   - Phone Number
   - Street Address
   - City
   - State
   - Postal Code
3. Fill all fields with valid data
4. Click **"Save Address"**
5. ✅ New address appears in list
6. ✅ It's automatically selected (radio button checked)

**Selecting Existing Address:**
1. Click radio button next to an existing address
2. ✅ Address is selected
3. Address details shown

**Continuing:**
1. Click **"Continue to Delivery"** button
2. ✅ Move to Step 2

### Test Case 2: Step 2 - Select Delivery Option
**Objective:** Test delivery method selection

**Options Available:**
1. ✅ Standard Delivery (3-5 days, Free)
2. ✅ Express Delivery (1-2 days, +₹150)

**Selection:**
1. Click radio button for desired option
2. ✅ Option is selected
3. ✅ Price updates in order summary
4. Description shows delivery timeline

**Navigation:**
1. Click **"Back to Address"** to go back to Step 1
2. Click **"Continue to Payment"** to progress to Step 3

### Test Case 3: Step 3 - Select Payment Method
**Objective:** Test payment method selection

**Payment Options Displayed:**
1. ✅ UPI Payments (Google Pay, PhonePe, Paytm)
2. ✅ Credit/Debit Card (Visa, Mastercard, RuPay)
3. ✅ Net Banking (major Indian banks)

**Selection:**
1. Click radio button for desired payment method
2. ✅ Method is selected
3. Details/icons displayed below

**Order Summary Review:**
1. ✅ Right sidebar shows complete summary:
   - All items with quantities and prices
   - Subtotal calculation
   - Delivery charge (if applicable)
   - Discount (if coupon applied)
   - **Grand Total**

**Confirming Order:**
1. Click **"Place Order"** button
2. ✅ Loading/processing state appears ("Processing payment...")
3. ✅ 2-second delay simulates payment processing
4. ✅ Redirect to `/order-confirmation` page

---

## 7️⃣ Testing Order Confirmation

### Test Case: Order Confirmation Page
**Objective:** Verify order success and next steps

**Confirmation Details Displayed:**
1. ✅ Success checkmark animation
2. ✅ Order Status: "Confirmed" badge
3. ✅ Order ID (format: ORD-{timestamp})
4. ✅ Order date and time
5. ✅ Delivery address with MapPin icon
6. ✅ Delivery method and estimated days
7. ✅ Payment method used
8. ✅ All ordered items with quantities and prices
9. ✅ Order summary with total amount

**Timeline Section:**
1. ✅ Shows "What's Next?" with steps:
   - Processing (2-2 hours)
   - Shipped (with tracking update note)
   - Delivered (in X business days)

**Actions Available:**
1. ✅ **"Download Invoice"** button
2. ✅ **"Continue Shopping"** button (redirect to `/`)
3. ✅ **"Back to Home"** button (redirect to `/`)

**Email Notification:**
1. ✅ Banner appears: "Confirmation email sent to [email]"

---

## 8️⃣ Testing Language & Internationalization

### Test Case: Language Switching
**Objective:** Verify multi-language support

**Available Languages:**
1. English
2. Tamil
3. Hindi

**How to Switch:**
1. Click **Globe icon** in navbar
2. Dropdown menu appears with language options
3. Click desired language

**Verification After Switch:**
1. ✅ Home page content translated
2. ✅ Navigation menu translated
3. ✅ Product page translated
4. ✅ Cart page translated (item names, "Subtotal", "Total", etc.)
5. ✅ Checkout page translated
6. ✅ Language persists on page refresh
7. ✅ Returning to home shows selected language

**Test in Each Language:**
1. Switch to Tamil
2. ✅ All UI text appears in Tamil
3. Switch to Hindi
4. ✅ All UI text appears in Hindi
5. Switch to English
6. ✅ All UI text appears in English

---

## 9️⃣ Testing Admin Panel

### Prerequisites
- Login as admin: `admin@homecare.com` / `admin123`
- You'll be auto-redirected to `/admin`

### Test Case 1: Admin Dashboard
**Objective:** View admin overview

**Steps:**
1. Access `/admin`
2. ✅ Dashboard page displays
3. ✅ Key metrics visible (if implemented):
   - Total users
   - Total products
   - Total orders
   - Revenue

### Test Case 2: Admin - Manage Products
**Objective:** Test product management

**Steps:**
1. Click **"Products"** in admin menu
2. ✅ See list of all products
3. ✅ Can view product details
4. ✅ Can add new product (if implemented)
5. ✅ Can edit existing product (if implemented)
6. ✅ Can delete product (if implemented)

### Test Case 3: Admin - Manage Users
**Objective:** Test user management

**Steps:**
1. Click **"Users"** in admin menu
2. ✅ See list of all registered users
3. ✅ User details visible (name, email, registration date)
4. ✅ Can view user orders
5. ✅ Can deactivate/manage users (if implemented)

### Test Case 4: Admin - Manage Orders
**Objective:** Test order management

**Steps:**
1. Click **"Orders"** in admin menu
2. ✅ See list of all orders
3. ✅ Order details visible (order ID, customer, amount, status)
4. ✅ Can view order details
5. ✅ Can update order status (if implemented)
6. ✅ Can process refunds (if implemented)

---

## 🔟 Testing Edge Cases & Error Handling

### Test Case 1: Invalid Login Attempts
**Objective:** Verify error messages

**Steps:**
1. Go to `/login`
2. Enter wrong password for valid email
3. ✅ Error message displays: "Invalid password"
4. Enter non-existent email
5. ✅ Error message displays: "User not found"
6. Leave email/password empty
7. ✅ Error message displays: "Please fill all fields"

### Test Case 2: Invalid Signup Attempts
**Objective:** Verify signup validation

**Steps:**
1. Go to `/login`, click "Sign Up"
2. Leave any field empty
3. Click "Create Account"
4. ✅ Error message displays
5. Enter mismatched passwords
6. ✅ Error message: "Passwords do not match"
7. Enter email that's already registered
8. ✅ Error message: "Email already in use"
9. Enter password less than 6 characters
10. ✅ Error message: "Password too short"

### Test Case 3: Empty Cart
**Objective:** Verify empty cart handling

**Steps:**
1. Logout and remove all cart items
2. Navigate to `/cart`
3. ✅ Show message: "Your cart is empty"
4. ✅ "Continue Shopping" button available
5. Click button
6. ✅ Redirect to products page

### Test Case 4: Product Out of Stock
**Objective:** Verify stock handling

**Steps:**
1. Try to add out-of-stock product to cart
2. ✅ Button may be disabled or show "Out of Stock"
3. Can't add to cart
4. ✅ Clear message shown

### Test Case 5: Unauthorized Admin Access
**Objective:** Verify admin protection

**Steps:**
1. Logout (or be logged in as regular user)
2. Try to visit `/admin` directly
3. ✅ Either redirected to login or shown 404
4. Login as regular user
5. Try to visit `/admin`
6. ✅ Access denied or redirected to home

---

## 1️⃣1️⃣ Testing Responsive Design

### Mobile (320px - 480px)
1. ✅ Logo visible and clickable
2. ✅ Hamburger menu visible
3. ✅ Navigation collapses into mobile menu
4. ✅ Products display in 1 column
5. ✅ Cart items stack properly
6. ✅ Checkout form fields full width
7. ✅ All text readable without horizontal scroll

### Tablet (481px - 1024px)
1. ✅ Products display in 2 columns
2. ✅ Sidebar visible on larger tablets
3. ✅ Navigation visible or accessible
4. ✅ All functionality works
5. ✅ Layout adapts properly

### Desktop (1025px+)
1. ✅ Products display in 3 columns
2. ✅ Full navigation visible
3. ✅ Sidebar visible
4. ✅ All animations smooth
5. ✅ Everything properly spaced

---

## 1️⃣2️⃣ Testing Performance & Animations

### Animations to Verify
1. ✅ Hero Banner Carousel - smooth transitions
2. ✅ Category Grid hover effects
3. ✅ Product cards scale on hover
4. ✅ Language dropdown slide down
5. ✅ Navigation link underlines animate
6. ✅ Cart badge bounces on add
7. ✅ Checkout step transitions smooth
8. ✅ Order confirmation animations
9. ✅ Login success message animates

### Performance Checks
1. ✅ Page loads in under 3 seconds
2. ✅ Interactions respond immediately (< 100ms)
3. ✅ No stuttering or jank in animations
4. ✅ Images load properly
5. ✅ No console errors

---

## 1️⃣3️⃣ Accessibility Testing

### Keyboard Navigation
1. ✅ Tab through all interactive elements
2. ✅ Enter/Space to activate buttons
3. ✅ Arrow keys for dropdowns (if supported)
4. ✅ Esc to close modals/dropdowns

### Screen Readers
1. ✅ Images have alt text
2. ✅ Buttons have descriptive labels
3. ✅ Form fields properly labeled
4. ✅ Headings properly structured

### Color Contrast
1. ✅ Text has sufficient contrast with background
2. ✅ No information conveyed by color alone

---

## Test Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Language switching works in all pages
- [ ] Product browsing and filtering functional
- [ ] Product details page displays correctly
- [ ] Add to cart functionality works
- [ ] Cart displays all items correctly
- [ ] Cart modifications (add/remove/quantity) work
- [ ] Coupon code application works
- [ ] Login with demo user works
- [ ] Signup creates new user
- [ ] Admin login redirects to /admin
- [ ] Checkout 3-step flow completes
- [ ] Order confirmation displays correctly
- [ ] Logout clears session
- [ ] Mobile responsive design works
- [ ] All animations are smooth
- [ ] No console errors
- [ ] Toast notifications appear correctly
- [ ] Admin features accessible to admin only

---

## Troubleshooting Common Issues

### "Page not found" / 404 Error
- Make sure you're on the correct port (usually 5173)
- Check URL spelling
- Refresh the page

### "Network Error" in Console
- Check if backend server is running (if using API)
- Verify API endpoints in code
- Check browser console for specific error

### Cart Items Disappear After Refresh
- This is expected with localStorage (clears on cache clear)
- For persistent storage, implement database

### Language Not Changing
- Clear browser cache
- Check LanguageContext is properly implemented
- Verify translation keys exist in all languages

### Admin Not Redirecting to /admin
- Make sure you're logging in with `admin@homecare.com`
- Check browser console for errors
- Verify `isAdmin` flag is set correctly in AuthContext

---

## Contact & Support

For issues, check:
- Browser console for errors (F12 → Console)
- React DevTools for state issues
- Network tab for API issues
- Terminal output for build issues

