const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never returned in queries by default
    },
    age: {
      type: Number,
      min: 5,
      max: 120,
    },
    avatar: {
      type: String,
      default: null,
    },
    // Cognitive baseline (established after 3-5 sessions)
    baseline: {
      established: { type: Boolean, default: false },
      sessionsCompleted: { type: Number, default: 0 },
      memory: { type: Number, default: null },
      reaction: { type: Number, default: null },
      pattern: { type: Number, default: null },
      attention: { type: Number, default: null },
      decision: { type: Number, default: null },
      overall: { type: Number, default: null },
      lastUpdated: { type: Date, default: null },
    },
    // Streak tracking
    streak: {
      current: { type: Number, default: 0 },
      lastTestDate: { type: Date, default: null },
    },
    // Reminder preferences
    reminders: {
      enabled:          { type: Boolean, default: true },
      frequencyDays:    { type: Number, default: 7, min: 1, max: 30 },
      preferredDay:     { type: String, default: "Sunday", enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      preferredTime:    { type: String, default: "09:00" },
      browserPush:      { type: Boolean, default: true },
      lastReminderSent: { type: Date, default: null },
      nextReminderDue:  { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user object (no password)
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    joinedDate: this.createdAt,
    baseline: this.baseline,
    streak: this.streak,
    reminders: this.reminders,
  };
};

module.exports = mongoose.model("User", userSchema);
