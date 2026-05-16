import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, TrendingUp, TrendingDown, Minus, Activity, AlertTriangle, Lightbulb, Target } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cognitiveScoreHistory, cognitiveMetrics, aiInsights, recommendations, monthlyTrends } from "@/data/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const radarData = cognitiveMetrics.map((m) => ({ subject: m.name, score: m.score, fullMark: 100 }));

const DashboardPage = () => {
  const { user } = useAuth();
  const overallScore = 86;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" className="space-y-8">
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back, {user?.name || "User"}</h1>
            <p className="text-muted-foreground text-sm mt-1">Your cognitive health overview</p>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-muted-foreground">AI Twin Active</span>
          </div>
        </motion.div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={fadeUp} custom={1} className="glass-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Score</span>
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold gradient-text">{overallScore}</span>
              <span className="text-sm text-green-400 flex items-center gap-0.5 mb-1"><TrendingUp className="w-3 h-3" />+5</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${overallScore}%` }} />
            </div>
          </motion.div>

          {cognitiveMetrics.slice(0, 3).map((m, i) => (
            <motion.div key={m.name} variants={fadeUp} custom={i + 2} className="glass-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{m.name}</span>
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">{m.score}</span>
                <span className={`text-sm flex items-center gap-0.5 mb-1 ${m.change > 0 ? "text-green-400" : m.change < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                  {m.change > 0 ? <TrendingUp className="w-3 h-3" /> : m.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {m.change > 0 ? "+" : ""}{m.change}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${m.score}%` }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} custom={5} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cognitiveScoreHistory}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(259,100%,62%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(259,100%,62%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,25%)" />
                <XAxis dataKey="date" stroke="hsl(215,20%,65%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,65%)" fontSize={12} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "hsl(217,33%,17%)", border: "1px solid hsl(217,33%,25%)", borderRadius: "12px", color: "hsl(210,40%,98%)" }} />
                <Area type="monotone" dataKey="score" stroke="hsl(259,100%,62%)" fill="url(#scoreGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="memory" stroke="hsl(220,80%,65%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="attention" stroke="hsl(150,80%,50%)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={fadeUp} custom={6} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Cognitive Radar</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(217,33%,25%)" />
                <PolarAngleAxis dataKey="subject" stroke="hsl(215,20%,65%)" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(217,33%,25%)" fontSize={10} />
                <Radar name="Score" dataKey="score" stroke="hsl(259,100%,62%)" fill="hsl(259,100%,62%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Monthly Trend & Metrics */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} custom={7} className="glass-card p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,25%)" />
                <XAxis dataKey="month" stroke="hsl(215,20%,65%)" fontSize={12} />
                <YAxis stroke="hsl(215,20%,65%)" fontSize={12} domain={[60, 90]} />
                <Tooltip contentStyle={{ background: "hsl(217,33%,17%)", border: "1px solid hsl(217,33%,25%)", borderRadius: "12px", color: "hsl(210,40%,98%)" }} />
                <Bar dataKey="score" fill="hsl(259,100%,62%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={fadeUp} custom={8} className="glass-card p-6 lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" /> AI Insights
            </h3>
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-xl border ${
                insight.type === "positive" ? "border-green-500/20 bg-green-500/5" :
                insight.type === "warning" ? "border-yellow-500/20 bg-yellow-500/5" :
                "border-accent/20 bg-accent/5"
              }`}>
                <div className="flex items-start gap-3">
                  {insight.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  ) : (
                    <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    <span className="text-[10px] text-muted-foreground mt-2 block">{insight.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div variants={fadeUp} custom={9} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" /> Personalized Recommendations
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendations.slice(0, 6).map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/20 text-sm text-muted-foreground">
                {rec}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
