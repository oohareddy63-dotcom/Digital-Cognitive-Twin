const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes      = require("./routes/auth");
const testRoutes      = require("./routes/tests");
const dashboardRoutes = require("./routes/dashboard");
const profileRoutes   = require("./routes/profile");
const mlRoutes        = require("./routes/ml");
const aiRoutes        = require("./routes/ai");
const reminderRoutes  = require("./routes/reminders");
const { router: notifRoutes } = require("./routes/notifications");
const { startScheduler }      = require("./scheduler");

const app = express();

// ─── CORS — allow ALL origins (required for Render free tier) ─────────────────
app.use(cors({
  origin: true,          // reflect the request origin — allows everything
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight for all routes
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/tests",         testRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/profile",       profileRoutes);
app.use("/api/ml",            mlRoutes);
app.use("/api/ai",            aiRoutes);
app.use("/api/reminders",     reminderRoutes);
app.use("/api/notifications", notifRoutes);

// Root
app.get("/", (_req, res) => {
  res.json({
    message: "CogTwin API ✅",
    status: "running",
    health: "/api/health",
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("❌", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 20000,
  })
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    app.listen(PORT, () => {
      console.log(`🚀 Backend  →  http://localhost:${PORT}`);
      console.log(`📡 Health   →  http://localhost:${PORT}/api/health`);
      startScheduler();
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
