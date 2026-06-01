# ✂️ Clipperzz

> **An AI-powered short-form content intelligence platform** that takes long-form videos (YouTube, podcasts, interviews) and automatically extracts high-potential clips — scored by hook strength, pacing, virality, and retention — ready for Reels, Shorts, and TikTok.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg)
![Express](https://img.shields.io/badge/Express-5-000000.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [AI Pipeline](#-ai-pipeline)
- [Backend API](#-backend-api)
- [Data Models](#-data-models-9-total)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [ER Diagrams](#-er-diagrams)
- [Contributors](#-contributors)

---

## 🎯 Overview

Clipperzz is a **full-stack monorepo platform** consisting of three services that work together:

| Component | Purpose |
|-----------|---------|
| **Frontend** | React web app — landing page, user dashboard, admin panel |
| **Backend** | Express REST API — auth, clips, jobs, subscriptions, payments |
| **ModelService** | AI/ML service — video transcription, clip scoring, generation |

### Key Features

- 🎬 **Video Ingestion** — Submit YouTube URLs or upload videos directly
- 🤖 **AI Clip Scoring** — Every clip is scored on Hook, Pacing, Virality, and Retention (0–100)
- ✂️ **Auto Clip Generation** — FFmpeg-powered extraction of the highest-scoring moments
- 📝 **Subtitle Generation** — Short-form optimised, punchy auto-captions
- 💳 **Subscription & Billing** — Stripe-integrated Starter / Pro / Enterprise plans
- 📊 **Usage Tracking** — Per-user monthly limits tracked and enforced
- 🔐 **Role-based Auth** — User, Premium, Pro, Admin, SuperAdmin roles
- 🔑 **Google OAuth** — One-click sign-in via Google
- 📬 **Email & SMS** — OTP verification via Nodemailer + Twilio
- 🛡️ **Admin Dashboard** — Full user management, audit logs, report triage
- 📋 **User Reports** — In-app bug reports, feedback, and contact forms

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         FRONTEND                              │
│           React 19 + Vite 7 + Tailwind CSS 4                 │
│                                                               │
│  Landing Page  │  User Dashboard  │  Admin Dashboard          │
└───────────────────────────┬───────────────────────────────────┘
                            │  HTTP / REST
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                       BACKEND API                             │
│              Express 5 + Node.js (ESM, port 5002)            │
│                                                               │
│  Auth  │  Videos  │  Clips  │  Jobs  │  Stripe  │  Reports   │
└──────────────┬──────────────────────────────┬─────────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────┐        ┌─────────────────────────────┐
│       MongoDB        │        │       ModelService           │
│  (Mongoose ODM)      │        │  AI/ML Processing (port 5001)│
│                      │        │                              │
│  Users, Videos,      │        │  Whisper Transcription       │
│  Clips, Jobs,        │        │  NLP Segment Scoring         │
│  Subscriptions,      │        │  FFmpeg Clip Generation      │
│  Usage, AuditLogs,   │        │  Subtitle Generation         │
│  UserReports,        │        │                              │
│  PendingUsers        │        └─────────────────────────────┘
└──────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend (`Backend/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | ^5.2.1 | REST API framework |
| **MongoDB + Mongoose** | ^9.3.1 | NoSQL database + ODM |
| **bcryptjs** | ^3.0.3 | Password hashing |
| **jsonwebtoken** | ^9.0.3 | JWT authentication |
| **google-auth-library** | ^10.6.2 | Google OAuth verification |
| **Stripe** | ^22.0.1 | Payment processing & webhooks |
| **Nodemailer** | ^8.0.4 | Email OTP & notifications |
| **Twilio** | ^5.13.1 | SMS OTP verification |
| **nodemon** | ^3.1.14 | Dev auto-reload |

### Frontend (`Frontend/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.2.0 | UI library |
| **Vite** | ^7.2.4 | Build tool & dev server |
| **Tailwind CSS** | ^4.1.18 | Utility-first styling |
| **React Router DOM** | ^7.12.0 | Client-side routing |
| **Axios** | ^1.14.0 | HTTP client |
| **Lucide React** | ^0.563.0 | Icon library |
| **Radix UI** | ^1.2.4 | Accessible UI primitives |

### ModelService (`ModelService/`)

| Technology | Purpose |
|------------|---------|
| **Whisper / STT** | Speech-to-text transcription |
| **NLP Scoring Engine** | Hook, Pacing, Virality, Retention analysis |
| **FFmpeg** | Video slicing and clip generation |
| **Subtitle Generator** | Short-form optimised caption creation |

---


## 🤖 AI Pipeline

The ModelService handles all compute-heavy video intelligence. It is called by the Backend after a video job is queued.

### Pipeline Flow

```
User submits YouTube URL or Video Upload
          │
          ▼
  ┌───────────────────┐
  │   Video Fetcher   │  ← yt-dlp / direct upload
  │  Metadata fetch   │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │ Audio Extraction  │  ← FFmpeg strips audio track
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Transcription    │  ← Whisper speech-to-text
  │  + Segmentation   │    Sentence & boundary detection
  └────────┬──────────┘
           │
           ▼
  ┌─────────────────────────────────────┐
  │        NLP Scoring Engine           │
  │                                     │
  │  Hook Score    (0–100)              │
  │  Pacing Score  (0–100)              │
  │  Retention     (0–100)              │
  │  Virality      (0–100)              │
  │  AI Insight text                    │
  └────────┬────────────────────────────┘
           │
           ▼
  ┌───────────────────┐
  │  Clip Selection   │  ← Top 3–5 segments selected
  │  (Start / End)    │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │   FFmpeg Cutter   │  ← Precise video trimming
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │ Subtitle Generator│  ← Punchy short-form captions
  └────────┬──────────┘
           │
           ▼
  PATCH /api/clips/:id/score  ← Scores written back to Backend DB
          │
          ▼
  Clip ready for user preview & download
```

### Clip Score Breakdown

| Signal | Description |
|--------|-------------|
| **Hook** | Strength of the opening seconds — does it grab attention? |
| **Pacing** | Speed of speech, cut rhythm, information flow |
| **Retention** | Predicted watch-through likelihood |
| **Virality** | Presence of contrast, questions, shock, clarity, humour |
| **clipScore** | Weighted composite of all four (0–100) |

---

## 🔌 Backend API

### Available Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register with email + OTP |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `POST` | `/api/auth/google` | Public | Google OAuth sign-in |
| `POST` | `/api/auth/verify-otp` | Public | Verify email OTP |
| `POST` | `/api/auth/resend-otp` | Public | Resend email OTP |
| `GET` | `/api/users/me` | User | Get current user profile |
| `PUT` | `/api/users/me` | User | Update profile |
| `GET` | `/api/videos` | User | List user's videos |
| `POST` | `/api/videos` | User | Submit YouTube URL / upload |
| `GET` | `/api/videos/:id` | User | Get video with clips |
| `DELETE` | `/api/videos/:id` | User | Delete video |
| `GET` | `/api/clips` | User | List user's clips |
| `POST` | `/api/clips` | User | Create clip manually |
| `GET` | `/api/clips/:id` | User | Get clip details & score |
| `PUT` | `/api/clips/:id` | User | Update clip metadata |
| `DELETE` | `/api/clips/:id` | User | Delete clip |
| `GET` | `/api/clips/stats` | User | Clip statistics summary |
| `PATCH` | `/api/clips/:id/score` | Admin | Write AI score from ModelService |
| `GET` | `/api/jobs` | User | List background jobs |
| `GET` | `/api/jobs/:id` | User | Get job progress |
| `GET` | `/api/subscriptions/me` | User | Get current plan |
| `POST` | `/api/stripe/checkout` | User | Create Stripe checkout session |
| `POST` | `/api/stripe/webhook` | Public | Stripe event webhook (raw body) |
| `GET` | `/api/stripe/portal` | User | Stripe billing portal |
| `GET` | `/api/usage/me` | User | Get monthly usage & limits |
| `GET` | `/api/logs` | Admin | List audit logs |
| `GET` | `/api/reports` | User | List submitted reports |
| `POST` | `/api/reports` | User | Submit bug report / feedback |

---

## 🗄️ Data Models (9 Total)

### Core Models

| Model | Key Fields |
|-------|-----------|
| **User** | name, email, password, authProvider (local/google), role (user/premium/pro/admin/superadmin), stripeCustomerId, emailVerified, phone |
| **PendingUser** | email, otp, expiresAt — holds unverified registrations |
| **Video** | user (ref), title, sourceType (youtube/upload), sourceUrl, duration, status (processing/completed/failed), jobId |
| **Clip** | user (ref), video (ref), title, clipUrl, duration, platform (reels/shorts/tiktok), status, clipScore (0-100), scoreBreakdown {hook, pacing, retention, virality}, aiInsight |
| **Job** | user (ref), type (clip_generation/video_upload/export/thumbnail_generation), status (queued/processing/completed/failed), progress (0-100), startedAt, completedAt, error, metadata |

### Billing Models

| Model | Key Fields |
|-------|-----------|
| **Subscription** | user (ref), plan (starter/pro/enterprise), status (active/cancelled/expired), startDate, endDate, stripeSubscriptionId, stripePriceId, amount |
| **Usage** | user (ref), videosProcessed, clipsGenerated, monthlyLimit, resetDate |

### Admin & Audit Models

| Model | Key Fields |
|-------|-----------|
| **AuditLog** | admin (ref), action, target, type (user/system/admin/content/payment), details, timestamp |
| **UserReport** | user (ref), type (report/feedback/contact), category (bug/ui/payment/feature/other), title, description, status, priority, assignedTo (ref), replies [{admin, message, sentAt}] |

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed before you begin:

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| **npm** | ≥ 9.x | Bundled with Node.js |
| **MongoDB** | Local or Atlas | [mongodb.com](https://www.mongodb.com) |
| **FFmpeg** | Latest | [ffmpeg.org](https://ffmpeg.org/download.html) — add to PATH |
| **Python** | ≥ 3.9 | Required by ModelService (Whisper) |

> [!TIP]
> Running MongoDB locally? Start it with `mongod` or use [MongoDB Compass](https://www.mongodb.com/products/compass) for a GUI. Alternatively, create a free [MongoDB Atlas](https://cloud.mongodb.com) cluster and use the connection string.

---

### Option A — Run Everything at Once (Recommended)

From the project root, install all dependencies and start all three services concurrently:

```bash
# 1. Clone the repository
git clone https://github.com/rahil-den/Clipperzz.git
cd Clipperzz

# 2. Install root + all workspace dependencies
npm run install:all

# 3. Configure environment variables (see section below)
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env

# 4. Start all services in development mode
npm run dev
```

This runs:
- `Frontend` on **http://localhost:5173**
- `Backend` on **http://localhost:5002**
- `ModelService` on **http://localhost:5001**

---

### Option B — Run Services Individually

#### Backend

```bash
cd Backend
npm install
# Copy and fill in your .env (see Environment Variables section)
npm run dev       # Development (nodemon auto-reload)
# OR
npm start         # Production
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

#### ModelService

```bash
cd ModelService
# If Python-based:
pip install -r requirements.txt
python main.py
# OR if Node-based:
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

```env
# Server
PORT=5002
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/clipperzz

# Auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (Nodemailer — for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (CORS + redirect)
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Twilio (SMS OTP)
TWILIO_SID=your-twilio-account-sid
TWILIO_TOKEN=your-twilio-auth-token
TWILIO_NO=+1234567890

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PRICE_PRO=price_your_pro_price_id
STRIPE_PRICE_ENTERPRISE=price_your_enterprise_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Model Service
MODEL_SERVICE_URL=http://localhost:5001
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5002
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

> [!CAUTION]
> Never commit real secrets or API keys to version control. Keep `.env` files listed in `.gitignore` at all times.

---

## 📊 ER Diagrams

### 1. Database Entity Relationships — All 9 Models

```mermaid
erDiagram
    direction LR

    USER {
        ObjectId  _id             PK
        string    name
        string    email
        string    password
        string    authProvider    "local | google"
        string    role            "user | premium | pro | admin | superadmin"
        boolean   isActive        "default: true"
        boolean   emailVerified   "default: false"
        string    countryCode     "default: +91"
        string    phone
        string    stripeCustomerId
        date      createdAt
        date      updatedAt
    }

    PENDING_USER {
        ObjectId  _id       PK
        string    email
        string    otp
        date      expiresAt
        date      createdAt
    }

    VIDEO {
        ObjectId  _id        PK
        ObjectId  user       FK
        string    title
        string    sourceType "youtube | upload"
        string    sourceUrl
        number    duration   "seconds, default: 0"
        string    status     "processing | completed | failed"
        string    jobId
        date      createdAt
        date      updatedAt
    }

    CLIP {
        ObjectId  _id            PK
        ObjectId  user           FK
        ObjectId  video          FK
        string    title
        string    clipUrl
        number    duration       "seconds, default: 0"
        string[]  platform       "reels | shorts | tiktok"
        string    status         "processing | ready | failed"
        number    clipScore      "0-100, null until AI done"
        number    score_hook     "0-100"
        number    score_pacing   "0-100"
        number    score_retention "0-100"
        number    score_virality "0-100"
        string    aiInsight      "human-readable AI text"
        date      createdAt
        date      updatedAt
    }

    JOB {
        ObjectId  _id          PK
        ObjectId  user         FK
        string    type         "clip_generation | video_upload | export | thumbnail_generation"
        string    status       "queued | processing | completed | failed"
        number    progress     "0-100"
        date      startedAt
        date      completedAt
        string    error
        object    metadata
        date      createdAt
        date      updatedAt
    }

    SUBSCRIPTION {
        ObjectId  _id                   PK
        ObjectId  user                  FK
        string    plan                  "starter | pro | enterprise"
        string    status                "active | cancelled | expired"
        date      startDate             "default: now"
        date      endDate
        string    stripeSubscriptionId
        string    stripePriceId
        number    amount                "USD, 0 for free"
        date      createdAt
        date      updatedAt
    }

    USAGE {
        ObjectId  _id              PK
        ObjectId  user             FK
        number    videosProcessed  "default: 0"
        number    clipsGenerated   "default: 0"
        number    monthlyLimit     "default: 10"
        date      resetDate        "1st of next month"
        date      createdAt
        date      updatedAt
    }

    AUDIT_LOG {
        ObjectId  _id        PK
        ObjectId  admin      FK
        string    action
        string    target
        string    type       "user | system | admin | content | payment"
        string    details
        date      timestamp  "default: now"
        date      createdAt
        date      updatedAt
    }

    USER_REPORT {
        ObjectId  _id         PK
        ObjectId  user        FK
        ObjectId  assignedTo  FK
        string    type        "report | feedback | contact"
        string    category    "bug | ui | payment | feature | improvement | other"
        string    title
        string    description
        string    status      "new | reviewed | open | in-progress | resolved | pending | closed"
        string    priority    "low | medium | high"
        array     replies     "[{admin, message, sentAt}]"
        date      createdAt
        date      updatedAt
    }

    USER         ||--o{ VIDEO        : "submits"
    USER         ||--o{ CLIP         : "owns"
    USER         ||--o{ JOB          : "triggers"
    USER         ||--||  SUBSCRIPTION : "subscribed to"
    USER         ||--||  USAGE        : "tracked by"
    USER         ||--o{ AUDIT_LOG    : "performed by admin"
    USER         ||--o{ USER_REPORT  : "submits"
    USER         ||--o{ USER_REPORT  : "assigned to"
    VIDEO        ||--o{ CLIP         : "produces"
    VIDEO        ||--o{ JOB          : "processed by"
```

---

### 2. AI Pipeline — End-to-End Flow

```mermaid
flowchart TD
    classDef user      fill:#6366f1,color:#fff,stroke:#4338ca,rx:8
    classDef backend   fill:#0f172a,color:#e2e8f0,stroke:#334155,rx:8
    classDef db        fill:#166534,color:#dcfce7,stroke:#15803d,rx:8
    classDef model     fill:#7c3aed,color:#fff,stroke:#5b21b6,rx:8
    classDef score     fill:#b45309,color:#fff,stroke:#92400e,rx:8
    classDef output    fill:#065f46,color:#d1fae5,stroke:#047857,rx:8
    classDef decision  fill:#1e3a5f,color:#bfdbfe,stroke:#1d4ed8

    U(["👤 User\nSubmits YouTube URL or Upload"]):::user
    U --> B1

    subgraph BACKEND ["🖥️  Backend — Express API :5002"]
        B1["POST /api/videos\nValidate & save Video doc"]:::backend
        B2["Create Job\ntype: clip_generation\nstatus: queued"]:::backend
        B3["POST /api/clips/:id/score\nWrite scores back to DB"]:::backend
    end

    B1 --> DB1
    B1 --> B2

    DB1[("MongoDB\nVideo — status: processing")]:::db
    DB2[("MongoDB\nClip — status: ready\nclipScore, scoreBreakdown")]:::db

    B2 --> MS

    subgraph MS ["🤖  ModelService — AI Pipeline :5001"]
        direction TB
        M1["📥 Video Fetcher\nyt-dlp / direct file"]:::model
        M2["🎵 Audio Extractor\nFFmpeg — strips audio track"]:::model
        M3["📝 Transcription\nWhisper STT + sentence segmentation"]:::model
        M4{"🧠 NLP Scoring Engine"}:::decision
        M5["🪝 Hook Score\n0 – 100"]:::score
        M6["⚡ Pacing Score\n0 – 100"]:::score
        M7["👁️ Retention Score\n0 – 100"]:::score
        M8["🔥 Virality Score\n0 – 100"]:::score
        M9["📊 Composite clipScore\nWeighted average of 4 signals"]:::score
        M10["✂️ Top 3–5 Clips Selected\nHighest-scoring time windows"]:::model
        M11["🎬 FFmpeg Cutter\nPrecise start/end trim"]:::model
        M12["📄 Subtitle Generator\nPunchy short-form captions"]:::model
        M13["☁️ Clip URL Stored\nCloud / local storage"]:::output

        M1 --> M2 --> M3 --> M4
        M4 --> M5 & M6 & M7 & M8
        M5 & M6 & M7 & M8 --> M9
        M9 --> M10 --> M11 --> M12 --> M13
    end

    M13 --> B3
    B3 --> DB2
    DB2 --> DONE

    DONE(["✅ Clip ready\nUser sees scored clips in dashboard"]):::user

    B2 --> JOBS
    JOBS["GET /api/jobs/:id\nPolled for progress 0–100%"]:::backend
    JOBS --> DONE
```

---

## 🖥️ UI Structure

### Public Pages (Landing)

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Hero, Features, Workflow, Pricing, Testimonials, FAQ, CTA |
| **Login** | `/login` | Email/password + Google OAuth |
| **Signup** | `/signup` | Registration + OTP email verification |
| **Terms** | `/terms` | Terms of service |
| **Privacy** | `/privacy` | Privacy policy |

### User Dashboard (Protected)

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/dashboard` | Overview, recent clips, usage summary |
| **My Videos** | `/dashboard/videos` | Manage submitted videos |
| **Clips** | `/dashboard/clips` | Browse, preview, and download clips |
| **Templates** | `/dashboard/templates` | Clip style presets |
| **Usage** | `/dashboard/usage` | Monthly processing limits |
| **Billing** | `/dashboard/billing` | Stripe subscription management |
| **Settings** | `/dashboard/settings` | Profile, password, notifications |

### Admin Dashboard (Admin/SuperAdmin only)

| Feature | Description |
|---------|-------------|
| User Management | View, activate, deactivate, role-change users |
| Reports Triage | Review user-submitted bug reports & feedback |
| Audit Logs | Track all admin actions with timestamps |
| Clip Oversight | View all generated clips across users |

---

## 💳 Subscription Plans

| Feature | Starter (Free) | Pro | Enterprise |
|---------|---------------|-----|------------|
| Videos/month | 10 | Unlimited | Unlimited |
| Clips per video | 3 | 5 | 10 |
| Subtitle generation | ✅ | ✅ | ✅ |
| AI score breakdown | ❌ | ✅ | ✅ |
| Priority processing | ❌ | ✅ | ✅ |
| Custom templates | ❌ | ❌ | ✅ |
| Stripe billing | ❌ | ✅ | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Contributors

- [Rahil](https://github.com/rahil-den)
- [Talha](https://github.com/Talha-X-Dev)
- [Iyan](https://github.com/iyan-devcore)
- [Kaif](https://github.com/KaifCodes20)

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Made with ❤️ for creators who are serious about short-form growth
</p>
