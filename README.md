# 🧠 CogTwin — AI Driven Digital Cognitive Twin for Brain Health Monitoring
  
> A web-based AI system that creates a personalized Digital Twin of your cognitive behavior using brain games, machine learning, and Groq LLM.
https://digital-cognitive-twin-1.onrender.com



---
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [Project Structure](#-project-structure)
6. [Database Schema](#-database-schema)
7. [API Reference](#-api-reference)
8. [ML & AI Pipeline](#-ml--ai-pipeline)
9. [Use Cases](#-use-cases)
10. [Installation & Setup](#-installation--setup)
11. [Running the Project](#-running-the-project)
12. [Pages & Features](#-pages--features)
13. [Weekly Reminder System](#-weekly-reminder-system)
14. [Environment Variables](#-environment-variables)
15. [Project Workflow](#-project-workflow)

---

## 🎯 Project Overview

**CogTwin** is an AI-powered web application that monitors brain health by having users complete 5 interactive cognitive tests weekly. The system:

- Creates a **personalized Digital Twin** — a neural network model of each user's unique cognitive patterns
- Detects **early signs of cognitive decline** using z-score anomaly detection
- Provides **AI-generated insights and recommendations** powered by Groq (Llama 3.1)
- Sends **weekly reminders** to ensure consistent testing
- Tracks **trends over time** using linear regression
- Generates **PDF health reports** for sharing with doctors

### Problem Statement
Traditional brain health monitoring requires expensive MRI scans and clinical visits. CogTwin provides an **affordable, non-invasive, continuous** monitoring system accessible from any device.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎮 **5 Cognitive Tests** | Reaction Time, Memory Recall, Pattern Recognition, Attention Span, Decision Making |
| 🧬 **Personal Baseline** | Established after 3 sessions — compares YOU to YOUR own history |
| 🤖 **Digital Twin (TF.js)** | Neural network trained on your session data to predict future performance |
| 📊 **Anomaly Detection** | Z-score based detection flags deviations > 1.5 standard deviations |
| 📈 **Trend Analysis** | Linear regression over 30 days with 7-day and 30-day forecasts |
| 🤖 **Groq AI Insights** | Llama 3.1 generates personalized health insights and recommendations |
| 💬 **AI Chat** | Ask any cognitive health question — answered using your real data |
| ⏰ **Weekly Reminders** | Configurable reminders sent when assessment is overdue |
| 🔔 **Smart Notifications** | Anomaly alerts, baseline milestones, decline warnings |
| 📄 **PDF Reports** | Export full cognitive health report to share with doctors |
| 🔐 **Secure Auth** | JWT authentication with bcrypt password hashing |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │Dashboard │ │  Tests   │ │ AI Twin  │ │   AI Chat    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Reports  │ │ Profile  │ │Settings  │ │Notifications │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ Vite Proxy /api → :5000
┌─────────────────────▼───────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                │
│                                                              │
│  /api/auth    /api/tests    /api/dashboard   /api/profile   │
│  /api/ml      /api/ai       /api/reminders   /api/notifs    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              ML ENGINE                               │    │
│  │  TensorFlow.js  │  simple-statistics  │  mathjs      │    │
│  │  Neural Network │  Feature Extraction │  Math Ops    │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              GROQ AI (Llama 3.1)                     │    │
│  │  Insights  │  Recommendations  │  Chat  │  Reports   │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              SCHEDULER                               │    │
│  │  Runs every hour — sends weekly reminders            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────────────────┐
│                  MongoDB Atlas (Cloud)                       │
│  Users │ Sessions │ TestResults │ DigitalTwin │ Notifs      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.8 | Type safety |
| Vite | 5.4 | Build tool + dev proxy |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui | latest | UI components |
| Framer Motion | 12 | Animations |
| Recharts | 3.8 | Data visualization |
| React Router | 6.30 | Client-side routing |
| TanStack Query | 5.83 | Server state management |
| jsPDF | 4.2 | PDF report generation |
| Lucide React | 0.462 | Icons |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | v24 | Runtime |
| Express.js | 4.18 | Web framework |
| MongoDB | Atlas | Cloud database |
| Mongoose | 8.4 | ODM |
| JWT | 9.0 | Authentication |
| bcryptjs | 2.4 | Password hashing |
| express-rate-limit | 7.3 | Rate limiting |
| dotenv | 16.4 | Environment config |
| nodemon | 3.1 | Dev auto-reload |

### ML & AI
| Technology | Version | Purpose |
|-----------|---------|---------|
| TensorFlow.js | 4.22 | Neural network (Digital Twin) |
| simple-statistics | latest | Feature extraction, regression |
| mathjs | latest | Mathematical operations |
| Groq SDK | latest | LLM API (Llama 3.1-8b-instant) |

---

## 📁 Project Structure

```
MajorProject/
├── README.md                          ← This file
│
├── backend/
│   ├── server.js                      ← Express app entry point
│   ├── scheduler.js                   ← Weekly reminder scheduler
│   ├── .env                           ← Environment variables
│   ├── package.json
│   │
│   ├── models/
│   │   ├── User.js                    ← User schema (auth + baseline + streak)
│   │   ├── TestResult.js              ← Individual test scores + anomaly data
│   │   ├── Session.js                 ← Groups 5 tests into one session
│   │   ├── DigitalTwin.js             ← TF.js model weights + feature stats
│   │   └── ReminderSettings.js        ← Per-user reminder configuration
│   │
│   ├── routes/
│   │   ├── auth.js                    ← Register, login, /me, update-profile
│   │   ├── tests.js                   ← Submit test, history, sessions
│   │   ├── dashboard.js               ← Full dashboard data + AI insights
│   │   ├── profile.js                 ← Profile stats + reports data
│   │   ├── ml.js                      ← Train/predict Digital Twin
│   │   ├── ai.js                      ← Groq AI insights, recommendations, chat
│   │   ├── notifications.js           ← Smart notifications system
│   │   └── reminders.js               ← Reminder settings + status
│   │
│   ├── ml/
│   │   ├── cognitiveEngine.js         ← TF.js + simple-statistics ML engine
│   │   └── groqAI.js                  ← Groq LLM integration
│   │
│   └── middleware/
│       └── auth.js                    ← JWT protect middleware
│
└── frontend/
    ├── vite.config.ts                 ← Vite config with /api proxy
    ├── src/
    │   ├── App.tsx                    ← Routes + providers
    │   ├── main.tsx                   ← React entry point
    │   │
    │   ├── pages/
    │   │   ├── LandingPage.tsx        ← Public homepage
    │   │   ├── LoginPage.tsx          ← Sign in
    │   │   ├── RegisterPage.tsx       ← Create account
    │   │   ├── DashboardPage.tsx      ← Main dashboard (all use cases)
    │   │   ├── CognitiveTestsPage.tsx ← 5 interactive brain tests
    │   │   ├── DigitalTwinPage.tsx    ← ML model training + analysis
    │   │   ├── AIChatPage.tsx         ← Groq AI chat interface
    │   │   ├── ReportsPage.tsx        ← History + PDF export
    │   │   ├── ProfilePage.tsx        ← User profile + stats
    │   │   └── SettingsPage.tsx       ← Reminder configuration
    │   │
    │   ├── components/
    │   │   ├── Navbar.tsx             ← Navigation + real-time notifications
    │   │   └── ui/                    ← shadcn/ui components
    │   │
    │   ├── contexts/
    │   │   └── AuthContext.tsx        ← Auth state + JWT management
    │   │
    │   └── lib/
    │       └── api.ts                 ← All API calls + TypeScript types
```

---

## 🗄 Database Schema

### User
```js
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  age: Number,
  baseline: {
    established: Boolean,
    sessionsCompleted: Number,
    memory: Number,       // avg score across sessions
    reaction: Number,
    pattern: Number,
    attention: Number,
    decision: Number,
    overall: Number,
    lastUpdated: Date
  },
  streak: {
    current: Number,      // consecutive days tested
    lastTestDate: Date
  },
  createdAt: Date
}
```

### TestResult
```js
{
  userId: ObjectId,
  testType: "reaction" | "memory" | "pattern" | "attention" | "decision",
  score: Number (0-100),
  durationSeconds: Number,
  sessionId: String,
  anomaly: {
    detected: Boolean,
    zScore: Number,
    severity: "none" | "mild" | "moderate" | "severe",
    direction: "above" | "below"
  },
  deviationFromBaseline: Number (%),
  createdAt: Date
}
```

### Session
```js
{
  userId: ObjectId,
  sessionId: String (UUID),
  scores: {
    memory: Number, reaction: Number, pattern: Number,
    attention: Number, decision: Number
  },
  overallScore: Number,    // average of all 5
  testsCompleted: Number,
  isComplete: Boolean,
  insights: [{ type, title, description }],
  createdAt: Date
}
```

### DigitalTwin
```js
{
  userId: ObjectId,
  weights: Mixed,          // serialized TF.js model weights
  accuracy: Number,        // R² score (0-100%)
  trainedOn: Number,       // number of sessions used
  lastTrained: Date,
  featureStats: {
    memory: { mean, stdDev, consistency, trendSlope },
    // ... per test type
  },
  trendAnalysis: {
    slope: Number, r2: Number, direction: String,
    predicted7Day: Number, predicted30Day: Number
  },
  lastPrediction: { score: Number, predictedAt: Date }
}
```

### ReminderSettings
```js
{
  userId: ObjectId,
  enabled: Boolean,
  weeklyDay: Number (0-6),   // 0=Sunday
  weeklyHour: Number (0-23), // 10 = 10 AM
  intervalDays: Number,      // default 7
  notifyOnAnomaly: Boolean,
  notifyOnBaseline: Boolean,
  notifyOnDecline: Boolean,
  notifyWeekly: Boolean,
  lastReminderSent: Date
}
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Sign in, get JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PATCH | `/api/auth/update-profile` | Update name/age | ✅ |

### Tests
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tests/submit` | Submit test score | ✅ |
| GET | `/api/tests/history` | Get test history | ✅ |
| GET | `/api/tests/sessions` | Get completed sessions | ✅ |
| GET | `/api/tests/session/:id` | Get specific session | ✅ |

### Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard` | Full dashboard data | ✅ |

### ML / Digital Twin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/ml/twin` | Get Digital Twin status | ✅ |
| POST | `/api/ml/train` | Train neural network | ✅ |
| GET | `/api/ml/analyze` | Feature stats + trends | ✅ |
| GET | `/api/ml/predict` | Predict next score | ✅ |

### Groq AI
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/insights` | AI-generated insights | ✅ |
| POST | `/api/ai/recommendations` | Smart recommendations | ✅ |
| POST | `/api/ai/explain-anomaly` | Explain anomaly in plain language | ✅ |
| GET | `/api/ai/weekly-report` | Weekly summary | ✅ |
| POST | `/api/ai/ask` | Ask a health question | ✅ |

### Reminders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reminders/settings` | Get reminder config | ✅ |
| PUT | `/api/reminders/settings` | Save reminder config | ✅ |
| GET | `/api/reminders/status` | Check if reminder due | ✅ |
| POST | `/api/reminders/test` | Send test notification | ✅ |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get all notifications | ✅ |
| POST | `/api/notifications/read/:id` | Mark as read | ✅ |
| POST | `/api/notifications/read-all` | Mark all as read | ✅ |

### Profile & Reports
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profile` | Profile + stats | ✅ |
| PATCH | `/api/profile` | Update profile | ✅ |
| GET | `/api/profile/reports` | Test history + monthly trends | ✅ |

---

## 🤖 ML & AI Pipeline

### Phase 1 — Feature Extraction (simple-statistics)
After each session, the system extracts:
- **Time features**: mean, median, standard deviation, consistency
- **Accuracy features**: correct %, error rate
- **Learning features**: improvement rate, trend slope
- **Attention features**: focus duration, variability

### Phase 2 — Anomaly Detection (Z-Score)
```
z = (current_score - baseline_mean) / std_deviation

|z| > 1.5 → Mild anomaly
|z| > 2.0 → Moderate anomaly
|z| > 2.5 → Severe anomaly
```

### Phase 3 — Trend Analysis (Linear Regression)
- Performs linear regression on last 30 sessions
- Calculates slope (improvement/decline rate) and R² (confidence)
- Predicts scores 7 days and 30 days into the future
- Detects consistent decline over 8+ weeks

### Phase 4 — Digital Twin (TensorFlow.js Neural Network)
```
Architecture:
  Input:  [memory, reaction, pattern, attention, decision, sessionIdx, dayOfWeek, hour]
  Layer1: Dense(32, relu)
  Layer2: Dense(16, relu)
  Output: Dense(1, sigmoid) → predicted overall score

Training: Adam optimizer, MSE loss, 100 epochs
Accuracy: R² score on training data
```

### Phase 5 — Groq AI (Llama 3.1-8b-instant)
- Receives user's cognitive data as context
- Generates personalized insights in JSON format
- Creates science-backed recommendations
- Answers natural language health questions
- Writes weekly report summaries

---

## 📖 Use Cases

### Use Case 1: New User Registration & Baseline
1. User registers → JWT token issued → redirected to dashboard
2. Dashboard shows baseline progress: `0/3 sessions completed`
3. User completes 3 full sessions (all 5 tests each)
4. System calculates personal baseline → "✅ Baseline Established!"
5. All future tests compared against personal baseline

### Use Case 2: Cognitive Health Monitoring
1. User logs in → dashboard shows current score and trends
2. User clicks "Start Assessment" → completes 5 tests
3. System runs z-score anomaly detection vs baseline
4. If reaction time is 35% slower → "⚠️ Moderate Anomaly Detected"
5. Groq AI generates: "Get more sleep, reduce stress"
6. Dashboard shows trend chart with decline highlighted

### Use Case 3: Early Cognitive Decline Detection
1. User completes weekly assessments for 2+ months
2. Linear regression detects consistent decline over 8 weeks
3. System generates severe alert: "Consult healthcare professional"
4. User exports PDF report → shares with doctor
5. Doctor orders clinical tests → early treatment started

### Use Case 4: Student Performance Optimization
1. Student tests at different times of day
2. System analyzes performance by hour
3. Dashboard shows: "You're 25% sharper at 10 AM than at 7 PM"
4. Student schedules study sessions in the morning
5. After 2 weeks: improved consistency and learning rate

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB Atlas** account (free tier works)
- **Groq API key** (free at [console.groq.com](https://console.groq.com))

### Step 1 — Clone / Open the project
```bash
cd MajorProject
```

### Step 2 — Backend Setup
```bash
cd backend
npm install
```

Create/edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key_here
```

### Step 3 — Frontend Setup
```bash
cd frontend
npm install
```

---

## ▶ Running the Project

### Terminal 1 — Start Backend
```bash
cd MajorProject/backend
node server.js
```
Expected output:
```
✅ MongoDB Atlas connected
🚀 Backend      →  http://localhost:5000
🧠 ML Engine    →  TensorFlow.js + simple-statistics + mathjs
🤖 Groq AI      →  llama-3.1-8b-instant
📡 Health check →  http://localhost:5000/api/health
⏰ Reminder scheduler started (checks every hour)
```

### Terminal 2 — Start Frontend
```bash
cd MajorProject/frontend
npm run dev
```
Expected output:
```
VITE v5.4.21  ready in 800ms
➜  Local:   http://localhost:5173/
```

### Open in Browser
```
http://localhost:5173
```

> **Note:** The Vite dev server proxies all `/api` requests to `localhost:5000` automatically — no CORS issues.

---

## 📱 Pages & Features

### 🏠 Landing Page (`/`)
- Project introduction and feature overview
- "Get Started" → Register, "Sign In" → Login

### 🔐 Login / Register (`/login`, `/register`)
- JWT-based authentication
- Real error messages from backend
- Password minimum 6 characters

### 📊 Dashboard (`/dashboard`)
- Overall cognitive score with trend indicator
- 3 metric cards (Memory, Reaction, Pattern)
- Weekly performance area chart
- Cognitive radar chart
- Monthly trend bar chart
- **Anomaly alerts** with severity badges
- **AI insights** (Groq-powered)
- **Personalized recommendations**
- Baseline progress banner
- Weekly reminder banner
- Decline detection alert
- Peak performance time insight
- Quick action buttons

### 🎮 Cognitive Tests (`/tests`)
Five interactive tests in one session:
1. **Reaction Time** — Click when screen turns green (3 rounds)
2. **Memory Recall** — Remember number sequences (5 rounds, increasing length)
3. **Pattern Recognition** — Find the next number in sequence (5 rounds)
4. **Attention Span** — Click moving purple dot (20 seconds)
5. **Decision Making** — Answer questions under 6-second timer (5 rounds)

After each test: score saved to MongoDB, anomaly detected, session updated.

### 🧬 AI Twin (`/twin`)
- Digital Twin model status (trained/untrained)
- Model accuracy percentage
- Trend direction with slope and R²
- Next session score prediction
- Cognitive feature profile radar chart
- Score forecast line chart (7-day, 30-day)
- ML feature statistics table (mean, std dev, consistency, trend)
- Anomaly detection summary
- AI recommendations

### 💬 AI Chat (`/ai-chat`)
- Chat interface powered by Groq (Llama 3.1)
- Suggested questions for new users
- Answers use your actual cognitive data as context
- Clear chat button

### 📄 Reports (`/reports`)
- Monthly score trend bar chart
- Full test history table (date, test, score, duration)
- **Export PDF** button — generates downloadable report

### 👤 Profile (`/profile`)
- Edit name
- View email and join date
- Baseline status (established / in progress)
- Stats: total tests, average score, streak

### ⚙️ Settings (`/settings`)
- **Reminder status card** — shows if assessment is overdue
- **Weekly reminder toggle** — enable/disable
- **Frequency** — every 3 days / weekly / 2 weeks / monthly
- **Preferred day** — Sunday through Saturday
- **Preferred time** — any hour (12 AM to 11 PM)
- **Notification types** — weekly, anomaly, decline, baseline
- **Send test reminder** button
- Privacy settings

### 🔔 Notifications (Bell icon in Navbar)
- Real-time notification count badge
- Click to view all notifications
- Mark individual or all as read
- Types: reminder, alert, milestone, warning, insight
- Auto-generated by backend scheduler

---

## ⏰ Weekly Reminder System

The reminder system works on three levels:

### 1. Backend Scheduler (`scheduler.js`)
- Runs every **1 hour** using `setInterval`
- Checks all users with reminders enabled
- If `daysSinceLastTest >= intervalDays` AND current hour matches `weeklyHour`:
  - Creates a notification in MongoDB
  - Updates `lastReminderSent` timestamp
  - Prevents duplicate reminders within 24 hours

### 2. In-App Notifications
- Bell icon in navbar shows unread count
- Notifications fetched every 60 seconds
- Click notification → navigate to `/tests`

### 3. Dashboard Banner
- Yellow banner appears when assessment is overdue
- Shows days since last test
- Direct "Take Test" button

### Configuring Reminders
Go to **Settings** (`/settings`) to:
- Set frequency (3 days / weekly / 2 weeks / monthly)
- Choose preferred day and time
- Toggle specific notification types
- Send a test reminder to verify it works

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
# Server
PORT=5000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cogtwin

# JWT
JWT_SECRET=your_very_long_random_secret_key
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Groq AI API Key (get free at console.groq.com)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

---

## 🔄 Project Workflow

```
User Registers
      ↓
Takes 5 Cognitive Tests (one session)
      ↓
Scores saved to MongoDB
      ↓
ML Engine runs:
  • Feature extraction (simple-statistics)
  • Z-score anomaly detection
  • Trend analysis (linear regression)
      ↓
After 3 sessions → Baseline established
      ↓
Digital Twin trained (TensorFlow.js neural network)
      ↓
Groq AI generates personalized insights
      ↓
Dashboard shows:
  • Score + trend
  • Anomaly alerts
  • AI insights
  • Recommendations
      ↓
Weekly scheduler checks every hour
  → Sends reminder if 7+ days since last test
      ↓
User takes test again → cycle repeats
```

---

## 📊 Scoring System

| Score Range | Status | Color |
|-------------|--------|-------|
| 85 - 100 | Excellent | 🟢 Green |
| 70 - 84 | Good | 🟡 Yellow |
| 50 - 69 | Fair | 🟠 Orange |
| 0 - 49 | Poor | 🔴 Red |

### Test Scoring
- **Reaction Time**: `score = 100 - (avg_ms - 150) / 6.5` (clamped 0-100)
- **Memory Recall**: 20 points per correct round × 5 rounds = 100 max
- **Pattern Recognition**: 20 points per correct answer × 5 rounds = 100 max
- **Attention Span**: `score = (hits / max_possible_hits) × 100`
- **Decision Making**: 20 points per correct answer × 5 rounds = 100 max

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT tokens** expire in 7 days
- All protected routes require `Authorization: Bearer <token>`
- **Rate limiting**: 1000 requests per 15 minutes per IP
- CORS restricted to localhost origins only
- MongoDB credentials stored in `.env` (never committed)

---

## 📦 Backend Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.18.2",
  "express-rate-limit": "^7.3.1",
  "groq-sdk": "latest",
  "jsonwebtoken": "^9.0.2",
  "mathjs": "latest",
  "mongoose": "^8.4.1",
  "simple-statistics": "latest",
  "@tensorflow/tfjs": "^4.22.0"
}
```

## 📦 Frontend Dependencies

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "@tanstack/react-query": "^5.83.0",
  "framer-motion": "^12.38.0",
  "recharts": "^3.8.1",
  "tailwindcss": "^3.4.17",
  "jspdf": "^4.2.1",
  "lucide-react": "^0.462.0",
  "zod": "^3.25.76"
}
```

---

## 👥 Team

**Department of Computer Science and Engineering**  
**AIT — Academic Year 2025-26**

---

## 📄 License

This project is developed for academic purposes at AIT.

---

*Built with ❤️ using React, Node.js, MongoDB, TensorFlow.js, and Groq AI*
