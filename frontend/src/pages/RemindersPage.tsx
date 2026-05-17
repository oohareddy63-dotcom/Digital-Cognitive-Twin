import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bell, BellOff, Clock, Calendar, CheckCircle,
  AlertTriangle, Play, Save, Loader2, RefreshCw, Zap,
} from "lucide-react";
import { remindersApi, type ReminderSettings, type ReminderStatus } from "@/lib/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const FREQ_OPTIONS = [
  { value: 1,  label: "Every day"      },
  { value: 3,  label: "Every 3 days"   },
  { value: 7,  label: "Every week"     },
  { value: 14, label: "Every 2 weeks"  },
  { value: 30, label: "Every month"    },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

const RemindersPage = () => {
  const [settings, setSettings]   = useState<ReminderSettings | null>(null);
  const [status, setStatus]       = useState<ReminderStatus | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [testing, setTesting]     = useState(false);
  const [saved, setSaved]         = useState(false);
  const [testMsg, setTestMsg]     = useState<string | null>(null);
  const [pushGranted, setPushGranted] = useState<boolean | null>(null);

  // Check browser notification permission
  useEffect(() => {
    if ("Notification" in window) {
      setPushGranted(Notification.permission === "granted");
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [s, st] = await Promise.all([
        remindersApi.getSettings(),
        remindersApi.getStatus(),
      ]);
      setSettings(s.reminders);
      setStatus(st);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const requestPushPermission = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setPushGranted(perm === "granted");
    if (perm === "granted" && settings) {
      setSettings({ ...settings, browserPush: true });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await remindersApi.updateSettings(settings);
      setSettings(res.reminders);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleTestReminder = async () => {
    setTesting(true);
    setTestMsg(null);
    try {
      // Show browser notification immediately
      if (pushGranted && "Notification" in window) {
        new Notification("⏰ CogTwin Weekly Reminder", {
          body: "This is a test reminder! Time to take your cognitive assessment.",
          icon: "/favicon.svg",
          badge: "/favicon.svg",
          tag: "cogtwin-reminder",
        });
      }
      const res = await remindersApi.sendTest();
      setTestMsg(res.message);
    } catch (e: unknown) {
      setTestMsg(e instanceof Error ? e.message : "Failed to send test");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const nextDue = status?.nextReminderDue ? new Date(status.nextReminderDue) : null;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <motion.div initial="hidden" animate="visible" className="space-y-6">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} custom={0}>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" /> Test Reminders
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get notified when it's time to take your weekly cognitive assessment
          </p>
        </motion.div>

        {/* ── Status Card ── */}
        {status && (
          <motion.div variants={fadeUp} custom={1}
            className={`p-5 rounded-xl border flex items-start gap-4 ${
              status.isDue
                ? "border-yellow-500/30 bg-yellow-500/5"
                : "border-green-500/30 bg-green-500/5"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              status.isDue ? "bg-yellow-500/20" : "bg-green-500/20"
            }`}>
              {status.isDue
                ? <AlertTriangle className="w-5 h-5 text-yellow-400" />
                : <CheckCircle   className="w-5 h-5 text-green-400"  />
              }
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {status.isDue
                  ? status.daysSinceLast === null
                    ? "You haven't taken any tests yet!"
                    : `Assessment overdue — ${status.daysSinceLast} days since last test`
                  : `Next assessment in ${status.daysLeft} day${status.daysLeft !== 1 ? "s" : ""}`
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {status.lastTestDate
                  ? `Last test: ${new Date(status.lastTestDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
                  : "No tests completed yet"
                }
              </p>
              {nextDue && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Next reminder: {nextDue.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
              )}
            </div>
            {status.isDue && (
              <Link to="/tests" className="gradient-btn text-xs inline-flex items-center gap-1.5 shrink-0">
                <Play className="w-3 h-3" /> Take Test Now
              </Link>
            )}
          </motion.div>
        )}

        {/* ── Settings Card ── */}
        {settings && (
          <motion.div variants={fadeUp} custom={2} className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Reminder Settings</h2>

            {/* Enable toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20">
              <div className="flex items-center gap-3">
                {settings.enabled
                  ? <Bell    className="w-5 h-5 text-primary" />
                  : <BellOff className="w-5 h-5 text-muted-foreground" />
                }
                <div>
                  <p className="text-sm font-semibold text-foreground">Enable Reminders</p>
                  <p className="text-xs text-muted-foreground">
                    {settings.enabled ? "You will receive periodic reminders" : "Reminders are disabled"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  settings.enabled ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>

            {settings.enabled && (
              <div className="space-y-5">
                {/* Frequency */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" /> Reminder Frequency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FREQ_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSettings({ ...settings, frequencyDays: opt.value })}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          settings.frequencyDays === opt.value
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-muted/20 border-border/20 text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred day */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Preferred Day
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSettings({ ...settings, preferredDay: day })}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                          settings.preferredDay === day
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-muted/20 border-border/20 text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred time */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Preferred Time
                  </label>
                  <input
                    type="time"
                    value={settings.preferredTime}
                    onChange={(e) => setSettings({ ...settings, preferredTime: e.target.value })}
                    className="px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Best time for cognitive tests: 9–11 AM (peak performance window)
                  </p>
                </div>

                {/* Browser push notifications */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Browser Push Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Get instant pop-up reminders in your browser
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, browserPush: !settings.browserPush })}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        settings.browserPush ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        settings.browserPush ? "translate-x-7" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  {/* Permission status */}
                  {pushGranted === false && settings.browserPush && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-xs text-yellow-400">
                        Browser notifications are blocked. Click to enable.
                      </p>
                      <button
                        onClick={requestPushPermission}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Enable →
                      </button>
                    </div>
                  )}
                  {pushGranted === true && (
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Browser notifications are enabled
                    </div>
                  )}
                  {pushGranted === null && (
                    <p className="text-xs text-muted-foreground">
                      Your browser doesn't support push notifications.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="gradient-btn inline-flex items-center gap-2 disabled:opacity-50"
              >
                {saving
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : saved
                  ? <CheckCircle className="w-4 h-4" />
                  : <Save className="w-4 h-4" />
                }
                {saved ? "Saved!" : saving ? "Saving…" : "Save Settings"}
              </button>

              <button
                onClick={handleTestReminder}
                disabled={testing}
                className="glass-card px-4 py-2 text-sm inline-flex items-center gap-2 hover:border-primary/40 transition-colors disabled:opacity-50"
              >
                {testing
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Bell className="w-4 h-4 text-primary" />
                }
                Send Test Reminder
              </button>
            </div>

            {testMsg && (
              <p className="text-xs text-green-400 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> {testMsg}
              </p>
            )}
          </motion.div>
        )}

        {/* ── How it works ── */}
        <motion.div variants={fadeUp} custom={3} className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">How Reminders Work</h2>
          <div className="space-y-3">
            {[
              { icon: "1", title: "Set your frequency", desc: "Choose how often you want to be reminded — weekly is recommended for best results." },
              { icon: "2", title: "Backend checks automatically", desc: "The server checks every hour and creates a notification when your test is due." },
              { icon: "3", title: "Bell icon lights up", desc: "The notification bell in the navbar shows your reminder with a red badge." },
              { icon: "4", title: "Browser pop-up (optional)", desc: "Enable browser push notifications to get an instant pop-up even when the tab is in the background." },
              { icon: "5", title: "Take your test", desc: "Click the reminder to go directly to the Tests page and complete your assessment." },
            ].map((step) => (
              <div key={step.icon} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default RemindersPage;
