import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Eye, Target, GitBranch, CheckCircle, Play, RotateCcw } from "lucide-react";

type TestType = "reaction" | "memory" | "pattern" | "attention" | "decision";
type TestState = "idle" | "running" | "complete";

interface TestConfig {
  id: TestType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const tests: TestConfig[] = [
  { id: "reaction", title: "Reaction Time", description: "Test how quickly you respond to visual stimuli.", icon: Zap, color: "text-yellow-400" },
  { id: "memory", title: "Memory Recall", description: "Remember and recall sequences of numbers.", icon: Brain, color: "text-primary" },
  { id: "pattern", title: "Pattern Recognition", description: "Identify the correct pattern in a sequence.", icon: Eye, color: "text-accent" },
  { id: "attention", title: "Attention Span", description: "Track a target among distractors over time.", icon: Target, color: "text-green-400" },
  { id: "decision", title: "Decision Making", description: "Make quick decisions under time pressure.", icon: GitBranch, color: "text-orange-400" },
];

// Reaction Time Test
const ReactionTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [phase, setPhase] = useState<"wait" | "ready" | "go" | "done">("wait");
  const [startTime, setStartTime] = useState(0);
  const [times, setTimes] = useState<number[]>([]);

  useEffect(() => {
    if (phase === "wait") {
      const delay = 2000 + Math.random() * 3000;
      const t = setTimeout(() => { setPhase("go"); setStartTime(Date.now()); }, delay);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleClick = () => {
    if (phase === "go") {
      const rt = Date.now() - startTime;
      const newTimes = [...times, rt];
      setTimes(newTimes);
      if (newTimes.length >= 3) {
        const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
        const score = Math.max(0, Math.min(100, Math.round(100 - (avg - 150) / 5)));
        onComplete(score);
      } else {
        setPhase("wait");
      }
    } else if (phase === "ready") {
      setPhase("wait");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-muted-foreground text-sm">Round {times.length + 1}/3 — Click when the screen turns green!</p>
      <button
        onClick={handleClick}
        className={`w-64 h-64 rounded-2xl flex items-center justify-center text-2xl font-bold transition-colors ${
          phase === "go" ? "bg-green-500 text-background" : phase === "wait" ? "bg-red-500/20 text-red-400 border-2 border-red-500/30" : "bg-muted text-muted-foreground"
        }`}
      >
        {phase === "go" ? "CLICK!" : "Wait..."}
      </button>
      {times.length > 0 && (
        <p className="text-sm text-muted-foreground">Last: {times[times.length - 1]}ms</p>
      )}
    </div>
  );
};

// Memory Test
const MemoryTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [showing, setShowing] = useState(true);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const len = round + 3;
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    setSequence(seq);
    setShowing(true);
    setUserInput([]);
    const t = setTimeout(() => setShowing(false), 2000 + len * 500);
    return () => clearTimeout(t);
  }, [round]);

  const handleInput = (num: number) => {
    const next = [...userInput, num];
    setUserInput(next);
    if (next.length === sequence.length) {
      const correct = next.every((n, i) => n === sequence[i]);
      const newScore = score + (correct ? 20 : 0);
      if (round >= 5) {
        onComplete(newScore);
      } else {
        setScore(newScore);
        setRound(round + 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-muted-foreground text-sm">Round {round}/5 — Remember the sequence!</p>
      {showing ? (
        <div className="flex gap-3 text-4xl font-mono font-bold gradient-text">
          {sequence.map((n, i) => <span key={i}>{n}</span>)}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-foreground text-center">Enter: {userInput.join(" ")} ({userInput.length}/{sequence.length})</p>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <button key={i} onClick={() => handleInput(i)} className="w-12 h-12 rounded-xl bg-muted hover:bg-primary/20 text-foreground font-bold transition-colors">
                {i}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Pattern Test
const PatternTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const patterns = [
    { seq: [2, 4, 6, 8, "?"], answer: 10, options: [9, 10, 11, 12] },
    { seq: [1, 1, 2, 3, 5, "?"], answer: 8, options: [6, 7, 8, 9] },
    { seq: [3, 6, 12, 24, "?"], answer: 48, options: [36, 48, 30, 42] },
    { seq: [1, 4, 9, 16, "?"], answer: 25, options: [20, 25, 30, 36] },
    { seq: [2, 6, 18, 54, "?"], answer: 162, options: [108, 162, 216, 72] },
  ];

  const current = patterns[round - 1];

  const handleAnswer = (val: number) => {
    const newScore = score + (val === current.answer ? 20 : 0);
    if (round >= 5) {
      onComplete(newScore);
    } else {
      setScore(newScore);
      setRound(round + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-muted-foreground text-sm">Round {round}/5 — Find the pattern!</p>
      <div className="flex gap-3 text-2xl font-mono font-bold text-foreground">
        {current.seq.map((n, i) => (
          <span key={i} className={n === "?" ? "gradient-text" : ""}>{n}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {current.options.map((opt) => (
          <button key={opt} onClick={() => handleAnswer(opt)} className="px-8 py-3 rounded-xl bg-muted hover:bg-primary/20 text-foreground font-semibold transition-colors">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// Attention Test
const AttentionTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
    }, 1500);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      const score = Math.min(100, Math.round((hits / (hits + misses + 1)) * 100));
      onComplete(score);
    }
  }, [timeLeft, hits, misses, onComplete]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-xs text-sm text-muted-foreground">
        <span>Hits: {hits}</span>
        <span className="gradient-text font-bold">{timeLeft}s</span>
        <span>Misses: {misses}</span>
      </div>
      <div
        className="relative w-72 h-72 rounded-2xl bg-muted/30 border border-border/30 overflow-hidden cursor-crosshair"
        onClick={() => setMisses(misses + 1)}
      >
        <motion.div
          animate={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-primary cursor-pointer shadow-lg"
          style={{ boxShadow: "0 0 20px hsl(259,100%,62%,0.5)" }}
          onClick={(e) => { e.stopPropagation(); setHits(hits + 1); }}
        />
      </div>
    </div>
  );
};

// Decision Test
const DecisionTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  const questions = [
    { q: "A patient has a fever and cough. Most likely?", a: "Flu", opts: ["Flu", "Allergy", "Migraine", "Sprain"] },
    { q: "Which number is largest?", a: "847", opts: ["748", "847", "784", "478"] },
    { q: "Odd one out:", a: "Banana", opts: ["Apple", "Banana", "Carrot", "Grape"] },
    { q: "Complete: Hot is to Cold as Day is to...", a: "Night", opts: ["Morning", "Night", "Evening", "Noon"] },
    { q: "Which shape has the most sides?", a: "Hexagon", opts: ["Triangle", "Square", "Pentagon", "Hexagon"] },
  ];

  const current = questions[round - 1];

  useEffect(() => {
    setTimeLeft(5);
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [round]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (round >= 5) onComplete(score);
      else { setRound(round + 1); }
    }
  }, [timeLeft, round, score, onComplete]);

  const handleAnswer = (opt: string) => {
    const newScore = score + (opt === current.a ? 20 : 0);
    if (round >= 5) onComplete(newScore);
    else { setScore(newScore); setRound(round + 1); }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-sm text-sm">
        <span className="text-muted-foreground">Round {round}/5</span>
        <span className={`font-bold ${timeLeft <= 2 ? "text-red-400" : "gradient-text"}`}>{timeLeft}s</span>
      </div>
      <p className="text-foreground font-medium text-center">{current.q}</p>
      <div className="grid grid-cols-2 gap-3">
        {current.opts.map((opt) => (
          <button key={opt} onClick={() => handleAnswer(opt)} className="px-6 py-3 rounded-xl bg-muted hover:bg-primary/20 text-foreground text-sm font-semibold transition-colors">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

const TestComponents: Record<TestType, React.FC<{ onComplete: (score: number) => void }>> = {
  reaction: ReactionTest,
  memory: MemoryTest,
  pattern: PatternTest,
  attention: AttentionTest,
  decision: DecisionTest,
};

const CognitiveTestsPage = () => {
  const [activeTest, setActiveTest] = useState<TestType | null>(null);
  const [testState, setTestState] = useState<TestState>("idle");
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleComplete = useCallback((score: number) => {
    setLastScore(score);
    setTestState("complete");
  }, []);

  const startTest = (test: TestType) => {
    setActiveTest(test);
    setTestState("running");
    setLastScore(null);
  };

  const reset = () => {
    setActiveTest(null);
    setTestState("idle");
    setLastScore(null);
  };

  const ActiveComponent = activeTest ? TestComponents[activeTest] : null;
  const activeConfig = activeTest ? tests.find((t) => t.id === activeTest) : null;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cognitive Tests</h1>
          <p className="text-muted-foreground text-sm mt-1">Complete all 5 tests to update your cognitive profile</p>
        </div>

        <AnimatePresence mode="wait">
          {testState === "idle" && (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test, i) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                  className="glass-card-hover p-6 space-y-4 cursor-pointer"
                  onClick={() => startTest(test.id)}
                >
                  <test.icon className={`w-8 h-8 ${test.color}`} />
                  <h3 className="text-lg font-semibold text-foreground">{test.title}</h3>
                  <p className="text-sm text-muted-foreground">{test.description}</p>
                  <button className="gradient-btn text-sm flex items-center gap-2 w-full justify-center">
                    <Play className="w-4 h-4" /> Start Test
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {testState === "running" && ActiveComponent && (
            <motion.div key="test" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-8 text-center space-y-6">
              <h2 className="text-xl font-bold text-foreground">{activeConfig?.title}</h2>
              <ActiveComponent onComplete={handleComplete} />
            </motion.div>
          )}

          {testState === "complete" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-8 text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Test Complete!</h2>
              <p className="text-5xl font-black gradient-text">{lastScore}</p>
              <p className="text-muted-foreground">out of 100</p>
              <button onClick={reset} className="gradient-btn inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Back to Tests
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CognitiveTestsPage;
