import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Palette, Save } from "lucide-react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [saved, setSaved] = useState(false);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? "bg-primary" : "bg-muted"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${enabled ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7" /> Settings
        </h1>

        <div className="space-y-4">
          <div className="glass-card p-6 space-y-5">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notifications
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive alerts about your cognitive health</p>
              </div>
              <Toggle enabled={notifications} onChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Daily Reminder</p>
                <p className="text-xs text-muted-foreground">Get reminded to complete your daily tests</p>
              </div>
              <Toggle enabled={dailyReminder} onChange={setDailyReminder} />
            </div>
          </div>

          <div className="glass-card p-6 space-y-5">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Privacy
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Anonymized Data Sharing</p>
                <p className="text-xs text-muted-foreground">Help improve AI models with anonymized data</p>
              </div>
              <Toggle enabled={dataSharing} onChange={setDataSharing} />
            </div>
          </div>

          <div className="glass-card p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" /> Appearance
            </h3>
            <p className="text-sm text-muted-foreground">Dark mode is enabled by default for optimal viewing of cognitive data.</p>
          </div>
        </div>

        <button onClick={handleSave} className="gradient-btn inline-flex items-center gap-2 text-sm">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Settings"}
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
