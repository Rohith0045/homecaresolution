import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Leaf, Globe } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Language } from "@/data/translations";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { totalItems } = useCart();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
  ];

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    ...(user ? [{ to: "/orders", label: "My Orders" }] : []),
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg md:text-xl font-bold text-foreground hidden xs:inline">
            Home Care <span className="text-primary">Harmony</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <motion.div key={link.to} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="relative">
              <Link
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1"
              >
                {link.label}
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
          {!user && (
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="relative">
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1"
              >
                Login
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
          {user && (
            <motion.button
              onClick={logout}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative py-1"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          )}
          <div className="relative">
            <motion.button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: langMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Globe className="w-5 h-5 text-foreground" />
              </motion.div>
              <span className="text-sm font-medium text-foreground uppercase ml-1">{language}</span>
            </motion.button>
              
            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-elevated z-50 min-w-max overflow-hidden"
                >
                  {languages.map((lang, idx) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors relative ${
                        language === lang.code
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      whileHover={{ paddingLeft: "1.25rem" }}
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: language === lang.code ? 1 : 0 }}
                        className="absolute left-2 text-sm"
                      >
                        ✓
                      </motion.span>
                      {lang.name}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors block">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {totalItems}
                  </motion.div>
                </motion.span>
              )}
            </Link>
          </motion.div>
          {user && user.isAdmin && (
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="relative">
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors ml-4 py-1"
              >
                Admin
              </Link>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </nav>

        <motion.button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: mobileOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <nav className="flex flex-col p-4 gap-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="text-sm font-medium text-muted-foreground hover:text-primary py-2 block"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
