/**
 * Reminder Scheduler Service
 * Runs every hour to check which users need a weekly test reminder
 * and creates in-app notifications for them.
 */

const cron = require("node-cron");
const mongoose = require("mongoose");
let User, Session, Notification;

// Lazy-load models to avoid circular deps
function getModels() {
  if (!User)         User         = require("../models/User");
  if (!Session)      Session      = require("../models/Session");
  if (!Notification) Notification = mongoose.models.Notification ||
    mongoose.model("Notification", new mongoose.Schema({
      userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
      type:      { type: String, default: "reminder" },
      severity:  { type: String, default: "warning" },
      title:     { type: String, required: true },
      message:   { type: String, required: true },
      read:      { type: Boolean, default: false },
      actionUrl: { type: String, default: "/tests" },
    }, { timestamps: true }));
}
// ─── Check and send reminders ─────────────────────────────────────────────────
async function checkAndSendReminders() {
  try {
    getModels();
    const now = new Date();

    // Find all users with reminders enabled
    const users = await User.find({ "reminders.enabled": true });

    for (const user of users) {
      try {
        const freq = user.reminders?.frequencyDays || 7;

        // Get last completed session
        const lastSession = await Session.findOne({ userId: user._id, isComplete: true })
          .sort({ createdAt: -1 });

        const lastTestDate = lastSession?.createdAt || user.createdAt;
        const daysSince = Math.floor((now - new Date(lastTestDate)) / (1000 * 60 * 60 * 24));

        if (daysSince < freq) continue; // Not due yet

        // Check if we already sent a reminder recently (within last 24h)
        const recentReminder = await Notification.findOne({
          userId: user._id,
          type: "reminder",
          createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) },
        });
        if (recentReminder) continue;

        // Create reminder notification
        const messages = [
          `It's been ${daysSince} days since your last cognitive assessment. Regular testing helps detect changes early!`,
          `Your brain health check is due! Complete your ${freq}-day cognitive assessment to track your progress.`,
          `Weekly reminder: Take your cognitive tests to keep your Digital Twin model up to date.`,
          `Don't forget your cognitive health check! It only takes 15 minutes and helps monitor your brain health.`,
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];

        await Notification.create({
          userId: user._id,
          type: "reminder",
          severity: daysSince >= freq * 2 ? "danger" : "warning",
          title: daysSince >= freq * 2
            ? `⚠️ Overdue: ${daysSince} Days Since Last Test`
            : `⏰ Time for Your ${freq}-Day Cognitive Check`,
          message: msg,
          read: false,
          actionUrl: "/tests",
        });

        // Update nextReminderDue
        const nextDue = new Date(now);
        nextDue.setDate(nextDue.getDate() + freq);
        await User.findByIdAndUpdate(user._id, {
          "reminders.lastReminderSent": now,
          "reminders.nextReminderDue": nextDue,
        });

        console.log(`📬 Reminder sent to ${user.email} (${daysSince} days since last test)`);
      } catch (userErr) {
        console.error(`Reminder error for user ${user._id}:`, userErr.message);
      }
    }
  } catch (err) {
    console.error("Reminder scheduler error:", err.message);
  }
}

// ─── Start scheduler ──────────────────────────────────────────────────────────
function startReminderScheduler() {
  // Run every hour at minute 0
  cron.schedule("0 * * * *", () => {
    console.log("⏰ Running reminder check...");
    checkAndSendReminders();
  });

  // Also run once on startup after 5 seconds
  setTimeout(checkAndSendReminders, 5000);

  console.log("📅 Reminder scheduler started (runs every hour)");
}

module.exports = { startReminderScheduler, checkAndSendReminders };
