/**
 * Notifications & Reminders API
 * GET  /api/notifications          — get user notifications
 * POST /api/notifications/read/:id — mark as read
 * POST /api/notifications/read-all — mark all as read
 * GET  /api/notifications/reminder — check if weekly reminder needed
 */
const express = require("express");
const mongoose = require("mongoose");
const Session = require("../models/Session");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ─── Notification Schema (inline) ────────────────────────────────────────────
const notificationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type:      { type: String, enum: ["reminder","alert","insight","milestone","warning"], default: "insight" },
  severity:  { type: String, enum: ["info","warning","danger","success"], default: "info" },
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  actionUrl: { type: String, default: "/tests" },
}, { timestamps: true });

const Notification = mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

// ─── Helper: create notification ─────────────────────────────────────────────
async function createNotification(userId, { type, severity, title, message, actionUrl }) {
  return Notification.create({ userId, type, severity, title, message, actionUrl: actionUrl || "/tests" });
}

// ─── Helper: generate smart notifications for a user ─────────────────────────
async function generateSmartNotifications(userId) {
  const user = await User.findById(userId);
  const now  = new Date();

  // 1. Weekly reminder — if last session > 7 days ago
  const lastSession = await Session.findOne({ userId, isComplete: true }).sort({ createdAt: -1 });
  if (lastSession) {
    const daysSince = (now - new Date(lastSession.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysSince >= 7) {
      const existing = await Notification.findOne({
        userId, type: "reminder", read: false,
        createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) },
      });
      if (!existing) {
        await createNotification(userId, {
          type: "reminder", severity: "warning",
          title: "⏰ Weekly Assessment Due",
          message: `It's been ${Math.floor(daysSince)} days since your last cognitive test. Regular weekly testing helps detect changes early. Take your assessment now!`,
          actionUrl: "/tests",
        });
      }
    }
  } else {
    // No sessions at all — first-time reminder
    const existing = await Notification.findOne({ userId, type: "reminder", read: false });
    if (!existing) {
      await createNotification(userId, {
        type: "reminder", severity: "info",
        title: "🧠 Start Your Cognitive Journey",
        message: "Complete your first cognitive assessment to establish your personal baseline. It takes about 15 minutes.",
        actionUrl: "/tests",
      });
    }
  }

  // 2. Baseline milestone notifications
  if (!user.baseline?.established && user.baseline?.sessionsCompleted > 0) {
    const remaining = 3 - user.baseline.sessionsCompleted;
    const existing = await Notification.findOne({
      userId, type: "milestone",
      title: { $regex: "baseline", $options: "i" },
      createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) },
    });
    if (!existing) {
      await createNotification(userId, {
        type: "milestone", severity: "info",
        title: "📊 Baseline Progress",
        message: `${user.baseline.sessionsCompleted}/3 sessions completed. Complete ${remaining} more session${remaining !== 1 ? "s" : ""} to establish your personal cognitive baseline.`,
        actionUrl: "/tests",
      });
    }
  }

  if (user.baseline?.established) {
    const milestoneExists = await Notification.findOne({
      userId, type: "milestone", title: "Baseline Established",
    });
    if (!milestoneExists) {
      await createNotification(userId, {
        type: "milestone", severity: "success",
        title: "✅ Baseline Established!",
        message: "Your personal cognitive baseline has been calculated. Future tests will be compared against your unique profile for accurate anomaly detection.",
        actionUrl: "/dashboard",
      });
    }
  }
}

// ─── GET /api/notifications ───────────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    // Generate smart notifications first
    await generateSmartNotifications(req.user._id);

    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/notifications/read/:id ────────────────────────────────────────
router.post("/read/:id", protect, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/notifications/read-all ────────────────────────────────────────
router.post("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/notifications/anomaly (called internally after test) ───────────
router.post("/anomaly", protect, async (req, res) => {
  try {
    const { testType, score, zScore, severity, baselineScore } = req.body;
    if (!severity || severity === "none") return res.json({ created: false });

    const diff = Math.abs(score - baselineScore).toFixed(0);
    const direction = score < baselineScore ? "below" : "above";
    const severityMap = { mild: "warning", moderate: "warning", severe: "danger" };

    await createNotification(req.user._id, {
      type: "alert",
      severity: severityMap[severity] || "warning",
      title: `⚠️ ${severity.charAt(0).toUpperCase() + severity.slice(1)} Anomaly: ${testType.charAt(0).toUpperCase() + testType.slice(1)}`,
      message: `Your ${testType} score (${score}) is ${diff} points ${direction} your baseline (${baselineScore}). Z-score: ${zScore}. ${
        severity === "severe"
          ? "Consider consulting a healthcare professional."
          : "Consider rest and stress reduction."
      }`,
      actionUrl: "/dashboard",
    });

    res.json({ created: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, createNotification };
