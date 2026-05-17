import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar, Save, Loader2 } from "lucide-react";
import { profileApi } from "@/lib/api";

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalTests: 0, totalSessions: 0, avgScore: null as number | null, streak: 0 });

  useEffect(() => {
    profileApi
      .get()
      .then(({ stats: s }) => setStats(s))
      .catch(() => {
        // Use data from auth context as fallback
        setStats({
          totalTests: 0,
          totalSessions: 0,
          avgScore: null,
          streak: user?.streak?.current ?? 0,
        });
      });
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await profileApi.update({ name: name.trim() });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile</h1>

        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center p-0 text-2xl font-bold">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Member Since
              </label>
              <input
                type="text"
                value={user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "N/A"}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="gradient-btn inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* Baseline status */}
        {user?.baseline && (
          <div className="glass-card p-6 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Cognitive Baseline</h3>
            {user.baseline.established ? (
              <p className="text-sm text-green-400">
                ✅ Baseline established ({user.baseline.sessionsCompleted} sessions)
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                ⏳ {user.baseline.sessionsCompleted}/3 sessions completed — keep going to establish your baseline!
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tests Taken", value: stats.totalTests || "0" },
            { label: "Avg Score", value: stats.avgScore ? stats.avgScore.toFixed(0) : "—" },
            { label: "Streak", value: `${stats.streak} days` },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
