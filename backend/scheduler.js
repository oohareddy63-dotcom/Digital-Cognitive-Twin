/**
 * CogTwin Weekly Reminder Scheduler
 * Runs every hour, checks all users, sends reminders when due.
 * No external cron library needed — uses setInterval.
 */

const User             = require("./models/User");
const Session          = require("./models/Session");
const ReminderSettings = require("./models/ReminderSettings");
const mongoose         = require("mongoose");

// Import createNotification inline to avoid circular deps
async function createNotification(userId, data) {
  // Dynamically require to avoid circular dependency
  const mongoose = require("mongoose");
  const schema = new mongoose.Schema({
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type:      { type: String, default: "reminder" },
    severity:  { type: String, default: "warning" },
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    read:      { type: Boolean, default: false },
    actionUrl: { type: String, default: "/tests" },
  }, { timestamps: true });

  const Notification = mongoose.models.Notification ||
    mongoose.model("Notification", schema);

  return Notification.create({ userId, ...data });
}

async function checkAndSendReminders() {
  try {
    const now = new Date();
    console.log(`⏰ Scheduler: checking reminders at ${now.toLocaleTimeString()}`);

    // Get all users with reminders enabled
    const allSettings = await ReminderSettings.find({ enabled: true, notifyWeekly: true });

    for (const settings of allSettings) {
      try {
        const userId = settings.userId;

        // Find last complete session
        const lastSession = await Session.findOne({ userId, isComplete: true })
          .sort({ createdAt: -1 });

        const daysSinceLast = lastSession
          ? Math.floor((now - new Date(lastSession.createdAt)) / (1000 * 60 * 60 * 24))
          : null;

        const isDue = daysSinceLast === null || daysSinceLast >= settings.intervalDays;
        if (!isDue) continue;

        // Check if we already sent a reminder recently (within last 24h)
        const recentlySent = settings.lastReminderSent &&
          (now - new Date(settings.lastReminderSent)) < 24 * 60 * 60 * 1000;
        if (recentlySent) continue;

        // Check if it's the right hour (within the user's preferred hour)
        const currentHour = now.getHours();
        if (currentHour !== settings.weeklyHour) continue;

        // Send the reminder notification
        const user = await User.findById(userId);
        if (!user) continue;

        const daysText = daysSinceLast === null
          ? "You haven't taken any tests yet"
          : `It's been ${daysSinceLast} days since your last assessment`;

        await createNotification(userId, {
          type: "reminder",
          severity: "warning",
          title: "⏰ Weekly Cognitive Assessment Due",
          message: `${daysText}. Regular weekly testing helps detect cognitive changes early and keeps your Digital Twin model accurate. Take your 15-minute assessment now!`,
          actionUrl: "/tests",
        });

        // Update last reminder sent
        await ReminderSettings.findByIdAndUpdate(settings._id, {
          lastReminderSent: now,
        });

        console.log(`✅ Reminder sent to user ${user.email}`);
      } catch (userErr) {
        console.error(`Reminder error for user ${settings.userId}:`, userErr.message);
      }
    }
  } catch (err) {
    console.error("Scheduler error:", err.message);
  }
}

// Also create default settings for new users who don't have them
async function ensureDefaultSettings() {
  try {
    const users = await User.find({});
    for (const user of users) {
      const exists = await ReminderSettings.findOne({ userId: user._id });
      if (!exists) {
        await ReminderSettings.create({ userId: user._id });
      }
    }
  } catch (err) {
    console.error("Default settings error:", err.message);
  }
}

function startScheduler() {
  console.log("⏰ Reminder scheduler started (checks every hour)");

  // Run once on startup after 5 seconds
  setTimeout(async () => {
    await ensureDefaultSettings();
    await checkAndSendReminders();
  }, 5000);

  // Then run every hour
  setInterval(checkAndSendReminders, 60 * 60 * 1000);
}

module.exports = { startScheduler };
