import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Activity, Shield, LineChart, Zap, Users, ArrowRight, Star } from "lucide-react";
import aiBrainImg from "@/assets/ai-brain.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const features = [
  { icon: Brain, title: "Digital Cognitive Twin", desc: "AI-powered virtual model of your brain's cognitive patterns and performance." },
  { icon: Activity, title: "Real-Time Monitoring", desc: "Track cognitive metrics in real-time with advanced neural analytics." },
  { icon: Shield, title: "Anomaly Detection", desc: "AI detects unusual cognitive patterns before they become problems." },
  { icon: LineChart, title: "Trend Prediction", desc: "Predict future cognitive performance using machine learning models." },
  { icon: Zap, title: "5 Cognitive Tests", desc: "Comprehensive assessments for memory, reaction, pattern, attention & decisions." },
  { icon: Users, title: "Personalized Insights", desc: "Tailored recommendations based on your unique cognitive baseline." },
];

const steps = [
  { num: "01", title: "Take Cognitive Tests", desc: "Complete 5 scientifically designed cognitive assessments." },
  { num: "02", title: "AI Builds Your Twin", desc: "Our AI creates a digital model of your cognitive patterns." },
  { num: "03", title: "Monitor & Improve", desc: "Track trends, get alerts, and follow personalized recommendations." },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Neurologist", text: "CogTwin's AI analysis provides insights I've never seen in traditional assessments. Revolutionary.", stars: 5 },
  { name: "James Miller", role: "Research Scientist", text: "The digital twin concept applied to cognitive health is brilliant. The predictions are remarkably accurate.", stars: 5 },
  { name: "Maria Rodriguez", role: "Clinical Psychologist", text: "My patients love the interactive tests. The dashboard makes tracking progress effortless.", stars: 5 },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Zap className="w-3.5 h-3.5" /> AI-Powered Brain Health
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your <span className="gradient-text">Digital Cognitive Twin</span> for Brain Health
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-xl">
                Monitor, analyze, and optimize your cognitive performance with AI-driven insights. Build a digital twin of your brain's capabilities.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Link to="/register" className="gradient-btn inline-flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-all">
                  Sign In
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-primary" /> HIPAA Compliant</span>
                <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-primary" /> Real-time Analytics</span>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] animate-pulse-glow" />
              <img src={aiBrainImg} alt="AI Brain Visualization" width={500} height={500} className="relative animate-float drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold mb-4">
              Powered by <span className="gradient-text">Advanced AI</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive cognitive health monitoring with machine learning at its core.
            </motion.p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass-card-hover p-6 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </motion.h2>
          </motion.div>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass-card p-6 flex items-start gap-6"
              >
                <span className="text-4xl font-black gradient-text">{s.num}</span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">Professionals</span>
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass-card-hover p-6 space-y-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">CogTwin</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CogTwin. AI-Driven Digital Cognitive Twin.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
