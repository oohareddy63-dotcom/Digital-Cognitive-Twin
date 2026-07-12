/**
 * ML / Digital Twin API Routes
 * GET  /api/ml/twin          — get current Digital Twin status & predictions
 * POST /api/ml/train         — trigger model training
 * GET  /api/ml/analyze       — full cognitive analysis with features + trends
 * GET  /api/ml/predict       — predict next session score
 */
const express = require("express");
const Session = require("../models/Session");
const TestResult = require("../models/TestResult");
const User = require("../models/User");
const DigitalTwin = require("../models/DigitalTwin");
const { protect } = require("../middleware/auth");
const {
  extractFeatures,
  analyzeTrend,
  trainDigitalTwin,
  predictNextScore,
  generateRecommendations,
} = require("../ml/cognitiveEngine");

const router = express.Router();

// ─── GET /api/ml/twin ─────────────────────────────────────────────────────────
router.get("/twin", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const twin = await DigitalTwin.findOne({ userId });
    const user = await User.findById(userId);
    const sessionCount = await Session.countDocuments({ userId, isComplete: true });

    res.json({
      twin: twin
        ? {
            accuracy: twin.accuracy,
            trainedOn: twin.trainedOn,
            lastTrained: twin.lastTrained,
            trendAnalysis: twin.trendAnalysis,
            featureStats: twin.featureStats,
            lastPrediction: twin.lastPrediction,
          }
        : null,
      baseline: user.baseline,
      sessionCount,
      readyToTrain: sessionCount >= 3,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/ml/train ───────────────────────────────────────────────────────
router.post("/train", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({ userId, isComplete: true })
      .sort({ createdAt: 1 })
      .limit(50);

    if (sessions.length < 3) {
      return res.status(400).json({
        error: `Need at least 3 complete sessions to train the Digital Twin. You have ${sessions.length}.`,
        sessionsNeeded: 3 - sessions.length,
      });
    }

    const types = ["memory", "reaction", "pattern", "attention", "decision"];

    // Feature extraction per type
    const featureStats = {};
    types.forEach((type) => {
      const scores = sessions.map((s) => s.scores[type]).filter((s) => s != null);
      featureStats[type] = extractFeatures(scores);
    });

    // Overall trend analysis
    const overallScores = sessions.map((s) => s.overallScore).filter((s) => s != null);
    const trendAnalysis = analyzeTrend(overallScores);

    // Train TF.js neural network
    const modelResult = await trainDigitalTwin(sessions);

    // If TF training returned null (not enough valid data), compute stats-based accuracy
    let accuracy, trainedOn, weights, lastTrained;
    if (modelResult) {
      accuracy    = modelResult.accuracy;
      trainedOn   = modelResult.trainedOn;
      weights     = modelResult.weights;
      lastTrained = modelResult.lastTrained;
    } else {
      // Fallback: use consistency score as proxy accuracy
      const consistencies = types
        .map((t) => featureStats[t]?.consistency)
        .filter((c) => c != null);
      const avgConsistency = consistencies.length
        ? consistencies.reduce((a, b) => a + b, 0) / consistencies.length
        : 0.5;
      accuracy    = parseFloat((avgConsistency * 100).toFixed(1));
      trainedOn   = sessions.length;
      weights     = null;
      lastTrained = new Date();
    }

    const twinData = {
      featureStats,
      trendAnalysis,
      accuracy,
      trainedOn,
      lastTrained,
      ...(weights ? { weights } : {}),
    };

    const twin = await DigitalTwin.findOneAndUpdate(
      { userId },
      twinData,
      { upsert: true, new: true }
    );

    res.json({
      message: "Digital Twin trained successfully",
      accuracy: twin.accuracy,
      trainedOn: twin.trainedOn,
      trendAnalysis: twin.trendAnalysis,
      featureStats: twin.featureStats,
    });
  } catch (err) {
    console.error("Train error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/ml/analyze ──────────────────────────────────────────────────────
router.get("/analyze", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const sessions = await Session.find({ userId, isComplete: true })
      .sort({ createdAt: 1 })
      .limit(50);

    if (sessions.length === 0) {
      return res.json({
        message: "No sessions yet. Complete cognitive tests to see analysis.",
        featureStats: null,
        trendAnalysis: null,
        anomalySummary: null,
      });
    }

    const types = ["memory", "reaction", "pattern", "attention", "decision"];

    // Feature extraction per type
    const featureStats = {};
    types.forEach((type) => {
      const scores = sessions.map((s) => s.scores[type]).filter((s) => s != null);
      featureStats[type] = extractFeatures(scores);
    });

    // Overall trend
    const overallScores = sessions.map((s) => s.overallScore).filter(Boolean);
    const trendAnalysis = analyzeTrend(overallScores);

    // Anomaly summary from recent test results
    const recentResults = await TestResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const anomalySummary = {
      total: recentResults.filter((r) => r.anomaly?.detected).length,
      severe: recentResults.filter((r) => r.anomaly?.severity === "severe").length,
      moderate: recentResults.filter((r) => r.anomaly?.severity === "moderate").length,
      mild: recentResults.filter((r) => r.anomaly?.severity === "mild").length,
    };

    // Recommendations
    const metrics = types.map((type) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      score: sessions[sessions.length - 1]?.scores[type] ?? null,
    }));
    const recommendations = generateRecommendations(metrics, user.baseline, trendAnalysis);

    res.json({
      featureStats,
      trendAnalysis,
      anomalySummary,
      recommendations,
      sessionCount: sessions.length,
      baseline: user.baseline,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/ml/predict ──────────────────────────────────────────────────────
router.get("/predict", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const twin = await DigitalTwin.findOne({ userId });

    if (!twin || !twin.weights) {
      return res.status(400).json({
        error: "Digital Twin not trained yet. Complete 3+ sessions and train the model.",
      });
    }

    const sessions = await Session.find({ userId, isComplete: true })
      .sort({ createdAt: -1 })
      .limit(1);

    const lastSession = sessions[0];
    const sessionCount = await Session.countDocuments({ userId, isComplete: true });

    const predicted = await predictNextScore(
      twin.weights,
      lastSession?.scores || {},
      sessionCount,
      new Date()
    );

    // Save prediction
    await DigitalTwin.findOneAndUpdate(
      { userId },
      { lastPrediction: { score: predicted, predictedAt: new Date() } }
    );

    res.json({
      predictedScore: predicted,
      confidence: twin.accuracy,
      basedOnSessions: twin.trainedOn,
      trendAnalysis: twin.trendAnalysis,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
