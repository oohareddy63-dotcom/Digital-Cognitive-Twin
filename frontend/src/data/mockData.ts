export const cognitiveScoreHistory = [
  { date: "Mon", score: 72, memory: 68, reaction: 78, pattern: 71, attention: 74, decision: 69 },
  { date: "Tue", score: 75, memory: 72, reaction: 76, pattern: 74, attention: 77, decision: 71 },
  { date: "Wed", score: 78, memory: 74, reaction: 80, pattern: 76, attention: 79, decision: 75 },
  { date: "Thu", score: 74, memory: 70, reaction: 77, pattern: 73, attention: 75, decision: 73 },
  { date: "Fri", score: 82, memory: 80, reaction: 84, pattern: 79, attention: 83, decision: 80 },
  { date: "Sat", score: 85, memory: 83, reaction: 86, pattern: 82, attention: 87, decision: 82 },
  { date: "Sun", score: 88, memory: 86, reaction: 89, pattern: 85, attention: 90, decision: 84 },
];

export const monthlyTrends = [
  { month: "Jan", score: 68 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 70 },
  { month: "Apr", score: 76 },
  { month: "May", score: 79 },
  { month: "Jun", score: 82 },
];

export const cognitiveMetrics = [
  { name: "Memory", score: 86, change: +4, status: "improving" as const },
  { name: "Reaction Time", score: 89, change: +2, status: "improving" as const },
  { name: "Pattern Recognition", score: 85, change: -1, status: "stable" as const },
  { name: "Attention Span", score: 90, change: +5, status: "improving" as const },
  { name: "Decision Making", score: 84, change: +3, status: "improving" as const },
];

export const aiInsights = [
  {
    id: 1,
    type: "positive" as const,
    title: "Memory Improvement Detected",
    description: "Your short-term memory scores have improved by 12% over the past 2 weeks. Keep up the brain exercises!",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "warning" as const,
    title: "Attention Fluctuation",
    description: "Your attention span shows variability during afternoon sessions. Consider taking breaks every 45 minutes.",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "info" as const,
    title: "New Baseline Established",
    description: "Your cognitive twin has updated its baseline model with 30 new data points for improved accuracy.",
    timestamp: "1 day ago",
  },
];

export const notifications = [
  { id: 1, text: "Complete your daily cognitive assessment", time: "Now", read: false },
  { id: 2, text: "New AI insight available for review", time: "1h ago", read: false },
  { id: 3, text: "Weekly report is ready to download", time: "3h ago", read: true },
  { id: 4, text: "Memory test streak: 7 days!", time: "1d ago", read: true },
];

export const recommendations = [
  "Practice the Memory Recall test daily to strengthen short-term memory pathways",
  "Try meditation for 10 minutes before cognitive tests for better focus",
  "Your reaction time peaks at 10 AM — schedule important tasks accordingly",
  "Increase sleep duration by 30 minutes to improve pattern recognition scores",
  "Engage in physical exercise to boost overall cognitive performance by up to 15%",
];

export const testResults = [
  { date: "2024-01-15", test: "Memory Recall", score: 82, duration: "3:24" },
  { date: "2024-01-15", test: "Reaction Time", score: 91, duration: "1:45" },
  { date: "2024-01-14", test: "Pattern Recognition", score: 78, duration: "4:12" },
  { date: "2024-01-14", test: "Attention Span", score: 85, duration: "5:00" },
  { date: "2024-01-13", test: "Decision Making", score: 80, duration: "3:55" },
  { date: "2024-01-13", test: "Memory Recall", score: 79, duration: "3:30" },
  { date: "2024-01-12", test: "Reaction Time", score: 88, duration: "1:52" },
  { date: "2024-01-12", test: "Pattern Recognition", score: 75, duration: "4:30" },
];
