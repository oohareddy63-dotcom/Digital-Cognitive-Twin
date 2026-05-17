import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, Bell, Shield, Palette, Save, Loader2,
  Clock, Calendar, CheckCircle, AlertTriangle, Send,
  Brain, TrendingDown, RefreshCw,
} from "lucide-react";
import { remindersApi, type ReminderSettings } from "@/lib/api";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const ampm = i >= 12 ? "PM" : "AM";
  const h    = i % 12 || 12;
  return { value: i, label: `${h}:00 ${ampm}` };
});
const INTERVALS = [
  { value: 3,  label: "Every 3 days" },
  { value: 7,  label: "Every week (recommended)" },
  { value: 14, label: "Every 2 weeks" },
  { value: 30, label: "Every month" },
];

// ─── Toggle component ─────────────────────────────────────────────────────────
const Toggle = ({
  enabled, onChange, disabled = false,
}: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${
      enabled ? "bg-primary" : "bg-muted"
    } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    aria-checked={enabled}
    role="switch"
  >
    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
      enabled ? "translate-x-6" : "translate-x-0.5"
    }`} />
  </button>
);

// ─── Select component ─────────────────────────────────────────────────────────
const Select = ({
  value, onChange, options,
}: { value: number; onChange: (v: number) => void; options: { value: number; label: string }[] }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

// ─── Main Settings Page ───────────────────────────────────────────────────────
const SettingsPage = () => {
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled:          true,
    weeklyDay:        0,
    weeklyHour:       10,
    intervalDays:     7,
    notifyOnAnomaly:  true,
    notifyOnBaseline: true,
    notifyOnDecline:  true,
    notifyWeekly:     true,
  });

  const [status, setStatus]   = useState<{
    isDue: boolean; daysSinceLast: number | null; nextDueDate: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [dataSharing, setDataSharing] = useState(false);

  // Load settings on mount
  useEffect(() => {
    Promise.all([remindersApi.getSettings(), remindersApi.getStatus()])
      .then(([{ settings: s }, st]) => {
        setSettings(s);
        setStatus(st);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await remindersApi.saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      // Refresh status
      const st = await remindersApi.getStatus();
      setStatus(st);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleTestReminder = async () => {
    setTestLoading(true);
    try {
      await remindersApi.sendTest();
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send test");
    } finally {
      setTestLoading(false);
    }
  };

  const update = (key: keyof ReminderSettings, value: unknown) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary" /> Settings
        </h1>

        {error && (
          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── Reminder Status Card ── */}
        {status && (
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${
            status.isDue
              ? "border-yellow-500/30 bg-yellow-500/5"
              : "border-green-500/20 bg-green-500/5"
          }`}>
            {status.isDue
              ? <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0" />
              : <CheckCircle   className="w-6 h-6 text-green-400 shrink-0" />
            }
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {status.isDue
                  ? status.daysSinceLast === null
                    ? "No tests taken yet — start your first assessment!"
                    : `Assessment overdue — ${status.daysSinceLast} days since last test`
                  : "You're on track with your assessments ✅"
                }
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {status.nextDueDate
                  ? `Next assessment due: ${formatDate(status.nextDueDate)}`
                  : "Complete your first test to set up your schedule"
                }
              </p>
            </div>
          </div>
        )}

        {/* ── Weekly Reminder Settings ── */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Weekly Reminders
            </h3>
            <Toggle
              enabled={settings.enabled}
              onChange={(v) => update("enabled", v)}
            />
          </div>

          {settings.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-5 pt-2 border-t border-border/20"
            >
              {/* Interval */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Reminder Frequency</p>
                    <p className="text-xs text-muted-foreground">How often to remind you</p>
                  </div>
                </div>
                <Select
                  value={settings.intervalDays}
                  onChange={(v) => update("intervalDays", v)}
                  options={INTERVALS}
                />
              </div>

              {/* Day of week */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Preferred Day</p>
                    <p className="text-xs text-muted-foreground">Day of week for weekly reminders</p>
                  </div>
                </div>
                <Select
                  value={settings.weeklyDay}
                  onChange={(v) => update("weeklyDay", v)}
                  options={DAYS.map((d, i) => ({ value: i, label: d }))}
                />
              </div>

              {/* Hour */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Reminder Time</p>
                    <p className="text-xs text-muted-foreground">What time to send the reminder</p>
                  </div>
                </div>
                <Select
                  value={settings.weeklyHour}
                  onChange={(v) => update("weeklyHour", v)}
                  options={HOURS}
                />
              </div>

              {/* Summary */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                📅 You'll be reminded every <strong className="text-foreground">{
                  INTERVALS.find((i) => i.value === settings.intervalDays)?.label.toLowerCase()
                }</strong> on <strong className="text-foreground">{DAYS[settings.weeklyDay]}</strong> at{" "}
                <strong className="text-foreground">{HOURS[settings.weeklyHour]?.label}</strong>
              </div>

              {/* Test reminder button */}
              <button
                onClick={handleTestReminder}
                disabled={testLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 text-primary text-sm hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                {testLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : testSent
                  ? <CheckCircle className="w-4 h-4 text-green-400" />
                  : <Send className="w-4 h-4" />
                }
                {testSent ? "Test reminder sent to notifications!" : "Send Test Reminder Now"}
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Notification Types ── */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notification Types
          </h3>

          {[
            {
              key: "notifyWeekly" as const,
              icon: <Clock className="w-4 h-4 text-yellow-400" />,
              label: "Weekly Assessment Reminders",
              desc: "Get notified when it's time for your weekly cognitive test",
            },
            {
              key: "notifyOnAnomaly" as const,
              icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
              label: "Anomaly Alerts",
              desc: "Get alerted when a test score deviates significantly from your baseline",
            },
            {
              key: "notifyOnDecline" as const,
              icon: <TrendingDown className="w-4 h-4 text-orange-400" />,
              label: "Decline Detection Alerts",
              desc: "Get warned when a consistent cognitive decline trend is detected",
            },
            {
              key: "notifyOnBaseline" as const,
              icon: <Brain className="w-4 h-4 text-primary" />,
              label: "Baseline Milestones",
              desc: "Get notified when your baseline is established or updated",
            },
          ].map(({ key, icon, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {icon}
                <div>
                  <p className="text-sm text-foreground font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
              <Toggle
                enabled={settings[key] as boolean}
                onChange={(v) => update(key, v)}
              />
            </div>
          ))}
        </div>

        {/* ── Privacy ── */}
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Privacy
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground font-medium">Anonymized Data Sharing</p>
              <p className="text-xs text-muted-foreground">Help improve AI models with anonymized data</p>
            </div>
            <Toggle enabled={dataSharing} onChange={setDataSharing} />
          </div>
        </div>

        {/* ── Appearance ── */}
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" /> Appearance
          </h3>
          <p className="text-sm text-muted-foreground">
            Dark mode is enabled by default for optimal viewing of cognitive data visualizations.
          </p>
        </div>

        {/* ── Save button ── */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="gradient-btn inline-flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {saving
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : saved
            ? <CheckCircle className="w-4 h-4" />
            : <Save className="w-4 h-4" />
          }
          {saved ? "Settings Saved!" : saving ? "Saving…" : "Save Settings"}
        </button>

      </motion.div>
    </div>
  );
};

export default SettingsPage;
