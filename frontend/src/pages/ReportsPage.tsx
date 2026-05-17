import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { profileApi, type FormattedTestResult, type MonthlyTrend } from "@/lib/api";
import { testResults as mockResults, monthlyTrends as mockMonthly } from "@/data/mockData";
import jsPDF from "jspdf";

const ReportsPage = () => {
  const [testResults, setTestResults] = useState<FormattedTestResult[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi
      .reports()
      .then(({ testResults: tr, monthlyTrends: mt }) => {
        setTestResults(tr.length ? tr : []);
        setMonthlyTrends(mt.length ? mt : []);
      })
      .catch(() => {
        // Fall back to mock data if backend unavailable
        setTestResults([]);
        setMonthlyTrends([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Use real data if available, otherwise mock
  const displayResults = testResults.length ? testResults : mockResults;
  const displayMonthly = monthlyTrends.length ? monthlyTrends : mockMonthly;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(108, 59, 255);
    doc.text("CogTwin — Cognitive Health Report", 20, 25);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);

    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text("Recent Test Results", 20, 50);

    doc.setFontSize(10);
    let y = 60;
    displayResults.forEach((r) => {
      doc.text(`${r.date}  |  ${r.test}  |  Score: ${r.score}  |  Duration: ${r.duration}`, 20, y);
      y += 8;
    });

    y += 10;
    doc.setFontSize(14);
    doc.text("AI Recommendations", 20, y);
    y += 10;
    doc.setFontSize(10);
    const recs = [
      "Practice Memory Recall daily",
      "Schedule cognitive tasks at peak hours (10 AM)",
      "Increase sleep by 30 minutes",
      "Try meditation before assessments",
    ];
    recs.forEach((r) => { doc.text(`• ${r}`, 25, y); y += 8; });

    doc.save("CogTwin_Report.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground text-sm mt-1">View history and export your cognitive data</p>
          </div>
          <button onClick={generatePDF} className="gradient-btn inline-flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>

        {/* Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Score Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={displayMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,25%)" />
              <XAxis dataKey="month" stroke="hsl(215,20%,65%)" fontSize={12} />
              <YAxis stroke="hsl(215,20%,65%)" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "hsl(217,33%,17%)", border: "1px solid hsl(217,33%,25%)", borderRadius: "12px", color: "hsl(210,40%,98%)" }} />
              <Bar dataKey="score" fill="hsl(259,100%,62%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Results Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border/20">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Recent Results
            </h3>
          </div>
          {displayResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No test results yet. Complete some cognitive tests to see your history here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/20 text-left text-sm text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Test</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {displayResults.map((r, i) => (
                    <tr key={"id" in r ? r.id : i} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-3 text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> {r.date}
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground font-medium">{r.test}</td>
                      <td className="px-6 py-3">
                        <span className={`text-sm font-semibold ${r.score >= 85 ? "text-green-400" : r.score >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                          {r.score}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{r.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
