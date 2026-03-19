# Clipperz Backend

Node.js + Express backend for the Clipperz SaaS platform, connected to MongoDB via Mongoose.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Dev Tools:** Nodemon, dotenv

## Project Structure

```
Backend/
├── config/
│   └── db.js              # MongoDB connection (with retry logic)
├── models/
│   ├── User.js            # Users + Admins (shared model)
│   ├── Video.js           # Uploaded/linked videos
│   ├── Clip.js            # Generated clips
│   ├── Subscription.js    # Plan & billing tracking
│   └── Usage.js           # Monthly usage limits
├── .env                   # Environment variables (not committed)
├── .gitignore
├── server.js              # Entry point
├── package.json
└── README.md
```

## Setup

```bash
# Install dependencies
npm install

# Create .env file with:
PORT=5000
MONGO_URI=mongodb://localhost:27017/clipperz

# Start dev server (with hot reload)
npm run dev

# Start production server
npm start
```

## Data Models

### User
- `name`, `email`, `password` (null for OAuth), `authProvider` (local/google)
- **Roles:** `user`, `premium`, `pro`, `admin`, `superadmin`
- `superadmin` is hidden from all normal queries automatically
- Password is stripped from JSON responses

### Video
- Linked to a `User`
- `sourceType`: youtube or upload
- `status`: processing → completed / failed

### Clip
- Linked to a `User` and a `Video`
- `platform`: reels, shorts, tiktok (array)
- `status`: processing → ready / failed

### Subscription
- Linked to a `User`
- `plan`: free, premium, pro
- `status`: active, cancelled, expired

### Usage
- Linked to a `User`
- Tracks `videosProcessed`, `clipsGenerated` against `monthlyLimit`
- `resetDate` auto-sets to the 1st of next month

## Model Relationships

```
User ──┬── Videos ── Clips
       ├── Subscription
       └── Usage
```

## Database Connection

- Uses Mongoose with connection retry (up to 5 attempts)
- Exponential backoff between retries
- Auto-exits process after max retries
