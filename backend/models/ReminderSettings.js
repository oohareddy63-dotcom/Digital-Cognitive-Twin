const mongoose = require("mongoose");
const reminderSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Master switch
    enabled: { type: Boolean, default: true },

    // Weekly reminder — day of week (0=Sun … 6=Sat) + hour (0-23)
    weeklyDay:  { type: Number, default: 0, min: 0, max: 6 },  // Sunday
    weeklyHour: { type: Number, default: 10, min: 0, max: 23 }, // 10 AM

    // How many days between reminders (default 7)
    intervalDays: { type: Number, default: 7, min: 1, max: 30 },

    // Browser push subscription (Web Push API)
    pushSubscription: { type: mongoose.Schema.Types.Mixed, default: null },

    // Last reminder sent
    lastReminderSent: { type: Date, default: null },

    // Notification preferences
    notifyOnAnomaly:   { type: Boolean, default: true },
    notifyOnBaseline:  { type: Boolean, default: true },
    notifyOnDecline:   { type: Boolean, default: true },
    notifyWeekly:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReminderSettings", reminderSettingsSchema);
