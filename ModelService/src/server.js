import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from './config/index.js';
import apiRoutes from './routes/index.js';
import './workers/videoWorker.js'; // Start the worker

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Storage Directories ─────────────────────────────────
const storageDirs = ['uploads', 'processed', 'audio', 'subtitles', 'temp'];

function ensureStorageDirs() {
  const basePath = path.resolve(config.storagePath);
  for (const dir of storageDirs) {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }
  console.log('✅ Storage directories ready');
}

// ─── Routes ──────────────────────────────────────────────
app.use('/api', apiRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start Server ────────────────────────────────────────
ensureStorageDirs();

app.listen(config.port, () => {
  console.log(`\n🚀 Clipperz server running on port ${config.port}`);
  console.log(`   Health: http://localhost:${config.port}/health`);
  console.log(`   API:    http://localhost:${config.port}/api\n`);
});

export default app;
