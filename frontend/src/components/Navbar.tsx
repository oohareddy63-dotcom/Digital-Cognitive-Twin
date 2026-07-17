import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Menu, X, LogOut, Bell, AlertTriangle, CheckCircle, Info, Clock } from "lucide-react";
import { notificationsApi, type AppNotification } from "@/lib/api";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const navLinks = isAuthenticated
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/tests",     label: "Tests"     },
        { to: "/twin",      label: "AI Twin"   },
        { to: "/ai-chat",   label: "AI Chat"   },
        { to: "/reports",   label: "Reports"   },
        { to: "/profile",   label: "Profile"   },
        { to: "/settings",  label: "Settings"  },
      ]
    : [
        { to: "/",         label: "Home"     },
        { to: "/login",    label: "Login"    },
        { to: "/register", label: "Register" },
      ];

  // Load notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const load = () => {
      notificationsApi.getAll()
        .then(({ notifications: n, unreadCount: u }) => {
          setNotifications(n);
          setUnreadCount(u);
        })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead();
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    setUnreadCount(0);
  };

  const handleNotifClick = async (notif: AppNotification) => {
    if (!notif.read) {
      await notificationsApi.markRead(notif._id);
      setNotifications((n) => n.map((x) => x._id === notif._id ? { ...x, read: true } : x));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setNotifOpen(false);
    navigate(notif.actionUrl || "/dashboard");
  };

  const severityIcon = (n: AppNotification) => {
    if (n.severity === "danger")  return <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />;
    if (n.severity === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />;
    if (n.severity === "success") return <CheckCircle   className="w-4 h-4 text-green-400 shrink-0" />;
    return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-btn flex items-center justify-center p-0">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-foreground">CogTwin</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
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

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-[10px] flex items-center justify-center text-white font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 glass-card overflow-hidden shadow-xl"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="text-xs text-primary hover:underline"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <button
                                key={n._id}
                                onClick={() => handleNotifClick(n)}
                                className={`w-full text-left px-4 py-3 border-b border-border/10 hover:bg-muted/20 transition-colors flex gap-3 ${
                                  !n.read ? "bg-primary/5" : ""
                                }`}
                              >
                                <div className="mt-0.5">{severityIcon(n)}</div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                    {n.message}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                                    {!n.read && (
                                      <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))
                          )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-border/20">
                          <Link
                            to="/dashboard"
                            onClick={() => setNotifOpen(false)}
                            className="text-xs text-primary hover:underline"
                          >
                            View Dashboard →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
                <Link key={link.to} to={link.to}
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
