const mongoose = require("mongoose");

/**
 * Stores the trained TensorFlow.js neural network weights
 * and metadata for each user's Digital Twin model.
 */
const digitalTwinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Serialized TF.js model weights (layer by layer)
    weights: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // Model performance metrics
    accuracy: { type: Number, default: null },
    trainedOn: { type: Number, default: 0 }, // number of sessions used
    lastTrained: { type: Date, default: null },

    // Cached feature statistics per test type
    featureStats: {
      memory:   { mean: Number, stdDev: Number, consistency: Number, trendSlope: Number },
      reaction: { mean: Number, stdDev: Number, consistency: Number, trendSlope: Number },
      pattern:  { mean: Number, stdDev: Number, consistency: Number, trendSlope: Number },
      attention:{ mean: Number, stdDev: Number, consistency: Number, trendSlope: Number },
      decision: { mean: Number, stdDev: Number, consistency: Number, trendSlope: Number },
    },

    // Trend analysis results
    trendAnalysis: {
      slope: Number,
      r2: Number,
      direction: String,
      predicted7Day: Number,
      predicted30Day: Number,
    },

    // Latest prediction
    lastPrediction: {
      score: Number,
      predictedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DigitalTwin", digitalTwinSchema);
