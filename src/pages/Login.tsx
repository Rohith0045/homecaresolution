import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn, UserPlus, Mail, Lock, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Login = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Remove demo user localStorage initialization as we use Supabase now
  useEffect(() => {
    // Only cleanup old localStorage if present, or just leave it blank
    localStorage.removeItem("registered_users");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Login successful!');
      // Will be redirected by useEffect
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(signupForm.name, signupForm.email, signupForm.password);
      toast.success('Account created successfully!');
      // Will be redirected by useEffect
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect after successful login/signup
  // If a `from` location exists (e.g. trying to access /checkout), go there
  // otherwise send admin to /admin and normal users home.
  useEffect(() => {
    if (user) {
      const state = (location.state || {}) as any;
      const redirectTo = state.from?.pathname || (user.isAdmin ? '/admin' : '/');
      navigate(redirectTo, { replace: true });
    }
  }, [user, location, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Success Message */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
            >
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-emerald-700 mb-1">Welcome, {user.name}!</h2>
              <p className="text-sm text-emerald-700 mb-3">
                {user.isAdmin ? 'Redirecting to admin panel...' : 'Redirecting home...'}
              </p>
              <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </motion.div>
          )}

          {/* Header */}
          {!user && (
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Join Us'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' ? 'Login to your account to continue shopping' : 'Create an account to get started'}
              </p>
            </motion.div>
          )}

          {/* Mode Tabs */}
          {!user && (
            <motion.div className="flex gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <motion.button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-foreground hover:bg-secondary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login
              </motion.button>
              <motion.button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-foreground hover:bg-secondary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Sign Up
              </motion.button>
            </motion.div>
          )}

          {/* Login Form */}
          {mode === 'login' && !user && (
            <motion.form
              onSubmit={handleLogin}
              className="space-y-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Notice */}
              <motion.div 
                className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-700"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-semibold mb-2">ℹ️ Note:</p>
                <p className="text-xs mb-3">Please use the <strong>Sign Up</strong> tab to create a new account, or use your existing credentials.</p>
                <div className="border-t border-blue-500/20 pt-2">
                  <p className="text-xs font-semibold text-emerald-700">🔐 Admin Setup:</p>
                  <p className="text-xs text-emerald-700">Sign up with <code className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-900">admin@homecare.com</code> to automatically get admin privileges.</p>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
            </motion.form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && !user && (
            <motion.form
              onSubmit={handleSignup}
              className="space-y-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 accent-primary"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </motion.form>
          )}

          {/* Admin Access Info */}
          {!user && (
            <motion.div
              className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-700">
                  <p className="font-semibold mb-1">🔐 Access Admin Panel:</p>
                  <ol className="space-y-1 text-xs">
                    <li>1️⃣ Sign up with the email: <code className="bg-emerald-500/20 px-1 rounded">admin@homecare.com</code></li>
                    <li>2️⃣ You'll automatically be redirected to /admin after login</li>
                    <li>3️⃣ Or click "Admin" in navbar when logged in</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
