import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar, Save } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile</h1>

        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center p-0 text-2xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
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
              <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
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

          <button onClick={handleSave} className="gradient-btn inline-flex items-center gap-2 text-sm">
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tests Taken", value: "42" },
            { label: "Avg Score", value: "84" },
            { label: "Streak", value: "7 days" },
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
