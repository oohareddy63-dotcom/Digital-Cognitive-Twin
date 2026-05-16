import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Menu, X, LogOut, User, Bell } from "lucide-react";
import { notifications } from "@/data/mockData";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = isAuthenticated
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/tests", label: "Tests" },
        { to: "/reports", label: "Reports" },
        { to: "/profile", label: "Profile" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" },
      ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center p-0">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-foreground">CogTwin</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-72 glass-card p-3 space-y-2"
                      >
                        {notifications.map((n) => (
                          <div key={n.id} className={`p-2 rounded-lg text-xs ${n.read ? "text-muted-foreground" : "text-foreground bg-muted/30"}`}>
                            <p>{n.text}</p>
                            <span className="text-muted-foreground text-[10px]">{n.time}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={logout} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-muted-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/20"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
