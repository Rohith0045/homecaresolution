# 🔐 Authentication & Admin Panel Guide

## Authentication System

### Features
- ✅ User Registration (Sign Up)
- ✅ User Login with Email & Password
- ✅ Password Validation (Minimum 6 characters)
- ✅ Session Management (localStorage)
- ✅ Logout Functionality
- ✅ Auto-redirect based on user role

## Demo Credentials

### Regular User Account
**Email:** `user@example.com`  
**Password:** `password123`

### Admin Account
**Email:** `admin@homecare.com`  
**Password:** `admin123`

---

## How to Login

### Step 1: Navigate to Login Page
1. Click the **"Login"** button in the navbar
2. Or directly visit `/login`

### Step 2: Enter Credentials
1. Click the **"Login"** tab (or it's selected by default)
2. Enter your email address
3. Enter your password
4. Click on the **"Login"** button

### Step 3: Automatic Redirect
- **Regular Users:** Redirected to home page (`/`)
- **Admin Users:** Redirected to admin panel (`/admin`)

---

## How to Sign Up

### Step 1: Create Account
1. Go to `/login`
2. Click the **"Sign Up"** tab
3. Fill in all required fields:
   - **Full Name**
   - **Email Address** (must be unique)
   - **Password** (minimum 6 characters)
   - **Confirm Password** (must match)

### Step 2: Accept Terms
- Check the checkbox: "I agree to the Terms of Service and Privacy Policy"

### Step 3: Create Account
- Click **"Create Account"** button
- You will be automatically logged in
- Regular users are redirected to home page

### Important Notes
- Emails must be unique
- Passwords must be at least 6 characters
- Passwords must match in both fields
- After signup, you're immediately logged in

---

## How to Access Admin Panel

### Method 1: Automatic Redirect (Recommended)
1. Login with admin email: `admin@homecare.com`
2. Password: `admin123`
3. You will be **automatically redirected** to `/admin` panel

### Method 2: Manual Navigation (After Login)
1. Login as admin user
2. Look for **"Admin"** link in the navbar (only visible for admin users)
3. Click the **"Admin"** link

### Method 3: Direct URL
1. Login as admin user
2. Visit directly: `http://localhost:8080/admin`

### Admin Features (Available at `/admin`)
- 📊 **Dashboard** - Overview of key metrics
- 👥 **Users** - Manage user accounts
- 📦 **Products** - Add, edit, delete products
- 📋 **Orders** - View and manage orders

---

## Authentication Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Visit /login                                │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
    Login Tab              Sign Up Tab
        │                            │
        ▼                            ▼
   ┌─────────┐              ┌──────────────┐
   │ Login   │              │ Sign Up      │
   │ Form    │              │ Form         │
   └────┬────┘              └────┬─────────┘
        │                         │
        ├─────────────┬───────────┤
        │             │           │
    Validate    Valid    Create
    Credentials Credentials  Account
        │             │           │
        ├─────────────┴───────────┤
        │                         │
        ▼                         ▼
   ┌──────────────────────────────────────┐
   │    Save user to localStorage         │
   │    Set user in React state           │
   └──────────────────────┬───────────────┘
                          │
           ┌──────────────┴──────────────┐
           │                             │
        Admin User             Regular User
           │                             │
           ▼                             ▼
      /admin                           /
   (Admin Panel)              (Home Page)
```

---

## Security Information

### Data Storage
- User data is stored in **localStorage**
- Passwords are currently stored in plain text (for demo purposes)
- **In production:** Use proper backend authentication, hash passwords, use JWT tokens

### Session Management
- Sessions persist even after page refresh
- Click **"Logout"** to clear session from localStorage
- Users are logged out automatically when clearing browser cache

### Logout
1. Look for your **name/profile** in the navbar (top right)
2. If logged in as user: Logout button appears in navbar
3. Click **"Logout"** to end your session

---

## Troubleshooting

### Problem: "User not found"
**Solution:** Make sure you've entered the correct email address. First-time users should sign up at `/login` using the "Sign Up" tab.

### Problem: "Invalid email or password"
**Solution:** Check your password. Passwords are case-sensitive and must be at least 6 characters.

### Problem: "User already exists with this email"
**Solution:** This email is already registered. Try logging in instead or use a different email address.

### Problem: "Passwords do not match"
**Solution:** Ensure both password fields have the same value.

### Problem: Can't access Admin Panel
**Solution:** 
1. Make sure you're logged in with `admin@homecare.com`
2. Check the navbar for the "Admin" link
3. Or visit `/admin` directly if logged in as admin

### Problem: Lost access after browser refresh
**Solution:** Your session should persist. If not, log in again. Data is stored in browser localStorage.

---

## API Reference (AuthContext)

### useAuth() Hook

```typescript
const { user, login, signup, logout } = useAuth();

// Login
await login(email: string, password: string);

// Sign Up
await signup(name: string, email: string, password: string);

// Logout
logout();

// Get Current User
console.log(user); // { id, name, email, isAdmin }
```

### User Object
```typescript
interface User {
  id: string;           // Unique user ID
  name: string;         // User's full name
  email: string;        // Email address
  isAdmin: boolean;     // Is admin user
}
```

---

## Creating a New Admin

To create a new admin user, edit the AuthContext signup function:

In `src/context/AuthContext.tsx`, find this line:
```typescript
isAdmin: email === "admin@homecare.com"
```

Change it to include multiple admin emails:
```typescript
isAdmin: ["admin@homecare.com", "newemail@admin.com"].includes(email)
```

---

## Best Practices

1. ✅ Always use strong passwords (more than 6 characters)
2. ✅ Don't share admin credentials
3. ✅ Use unique email addresses for each account
4. ✅ Logout when finished, especially on shared devices
5. ✅ In production, implement proper backend authentication

---

## Support

For issues or questions, refer to the authentication code in:
- `src/context/AuthContext.tsx` - Authentication logic
- `src/pages/Login.tsx` - Login/Signup UI
- `src/components/Header.tsx` - Logout button

