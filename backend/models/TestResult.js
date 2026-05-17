const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Which test was taken
    testType: {
      type: String,
      enum: ["reaction", "memory", "pattern", "attention", "decision"],
      required: true,
    },
    // Score 0-100
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    // Duration in seconds
    durationSeconds: {
      type: Number,
      default: null,
    },
    // Session: a group of tests taken together
    sessionId: {
      type: String,
      default: null,
    },
    // Anomaly detection results
    anomaly: {
      detected: { type: Boolean, default: false },
      zScore: { type: Number, default: null },
      severity: {
        type: String,
        enum: ["none", "mild", "moderate", "severe"],
        default: "none",
      },
    },
    // Deviation from baseline (%)
    deviationFromBaseline: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
testResultSchema.index({ userId: 1, createdAt: -1 });
testResultSchema.index({ userId: 1, testType: 1, createdAt: -1 });

module.exports = mongoose.model("TestResult", testResultSchema);
