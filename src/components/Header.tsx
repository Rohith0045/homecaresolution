import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Leaf, Globe } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Language } from "@/data/translations";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { totalItems } = useCart();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        if (!mobileOpen) setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileOpen]);

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
    <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl glass rounded-2xl shadow-elevated transition-all duration-300 ${visible ? "translate-y-0" : "-translate-y-28 opacity-0"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between h-16 md:h-16">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
            <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
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
                  className="absolute right-0 mt-3 glass border border-border/30 rounded-xl shadow-elevated z-50 min-w-max overflow-hidden p-1 px-1"
                >
                  {languages.map((lang, idx) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                        language === lang.code
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-primary/10'
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

        <div className="flex items-center gap-1 md:hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors block">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.button
            className="p-2"
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
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border/20 glass rounded-b-2xl mt-1 px-2"
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
                    className="text-sm font-medium text-foreground hover:text-primary py-2 block"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="h-px bg-border/20 my-2" />
              
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase px-2 mb-2">Language</p>
                <div className="flex flex-wrap gap-2 px-2">
                  {languages.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setMobileOpen(false); }} 
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border border-border/30 ${language === lang.code ? 'bg-primary text-primary-foreground' : 'glass text-foreground'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 px-2">
                {!user ? (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-forest transition-colors">Login</Link>
                ) : (
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-destructive/10 transition-colors">Logout</button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
