/**
 * Reminder Settings API
 * GET    /api/reminders/settings        — get user reminder settings
 * PUT    /api/reminders/settings        — save reminder settings
 * GET    /api/reminders/status          — check if reminder is due now
 * POST   /api/reminders/test            — send a test reminder notification
 */

const express = require("express");
const ReminderSettings = require("../models/ReminderSettings");
const Session          = require("../models/Session");
const { protect }      = require("../middleware/auth");
const { createNotification } = require("./notifications");

const router = express.Router();

// ─── GET /api/reminders/settings ─────────────────────────────────────────────
router.get("/settings", protect, async (req, res) => {
  try {
    let settings = await ReminderSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = await ReminderSettings.create({ userId: req.user._id });
    }
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/reminders/settings ─────────────────────────────────────────────
router.put("/settings", protect, async (req, res) => {
  try {
    const {
      enabled, weeklyDay, weeklyHour, intervalDays,
      notifyOnAnomaly, notifyOnBaseline, notifyOnDecline, notifyWeekly,
    } = req.body;

    const update = {};
    if (enabled          !== undefined) update.enabled          = enabled;
    if (weeklyDay        !== undefined) update.weeklyDay        = weeklyDay;
    if (weeklyHour       !== undefined) update.weeklyHour       = weeklyHour;
    if (intervalDays     !== undefined) update.intervalDays     = intervalDays;
    if (notifyOnAnomaly  !== undefined) update.notifyOnAnomaly  = notifyOnAnomaly;
    if (notifyOnBaseline !== undefined) update.notifyOnBaseline = notifyOnBaseline;
    if (notifyOnDecline  !== undefined) update.notifyOnDecline  = notifyOnDecline;
    if (notifyWeekly     !== undefined) update.notifyWeekly     = notifyWeekly;

    const settings = await ReminderSettings.findOneAndUpdate(
      { userId: req.user._id },
      update,
      { upsert: true, new: true }
    );

    res.json({ settings, message: "Reminder settings saved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/reminders/status ────────────────────────────────────────────────
router.get("/status", protect, async (req, res) => {
  try {
    const userId   = req.user._id;
    const settings = await ReminderSettings.findOne({ userId });
    const lastSession = await Session.findOne({ userId, isComplete: true })
      .sort({ createdAt: -1 });

    const now = new Date();
    const daysSinceLast = lastSession
      ? Math.floor((now - new Date(lastSession.createdAt)) / (1000 * 60 * 60 * 24))
      : null;

    const intervalDays = settings?.intervalDays ?? 7;
    const isDue = daysSinceLast === null || daysSinceLast >= intervalDays;

    // Next due date
    let nextDueDate = null;
    if (lastSession) {
      nextDueDate = new Date(lastSession.createdAt);
      nextDueDate.setDate(nextDueDate.getDate() + intervalDays);
    }

    res.json({
      isDue,
      daysSinceLast,
      intervalDays,
      nextDueDate,
      lastTestDate: lastSession?.createdAt ?? null,
      reminderEnabled: settings?.enabled ?? true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/reminders/test ─────────────────────────────────────────────────
router.post("/test", protect, async (req, res) => {
  try {
    await createNotification(req.user._id, {
      type: "reminder",
      severity: "info",
      title: "🔔 Test Reminder",
      message: "This is a test reminder notification. Your weekly cognitive assessment is ready. Click to start your tests!",
      actionUrl: "/tests",
    });
    res.json({ success: true, message: "Test reminder sent to your notifications." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
