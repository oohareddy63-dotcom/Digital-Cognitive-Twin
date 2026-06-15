const mongoose = require("mongoose");
// A session = one full round of all 5 tests
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    scores: {
      memory: { type: Number, default: null },
      reaction: { type: Number, default: null },
      pattern: { type: Number, default: null },
      attention: { type: Number, default: null },
      decision: { type: Number, default: null },
    },
    overallScore: {
      type: Number,
      default: null,
    },
    testsCompleted: {
      type: Number,
      default: 0,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    // AI-generated insights for this session
    insights: [
      {
        type: { type: String, enum: ["positive", "warning", "info"] },
        title: String,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Session", sessionSchema);
