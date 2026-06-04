import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/index.js';
import * as processController from '../controllers/processController.js';

const router = Router();

// ─── Multer config for file uploads ──────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(config.storagePath, 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/mkv', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

// ─── Endpoints ───────────────────────────────────────────

// POST /api/process — Submit a video URL or upload a file for processing
router.post('/process', upload.single('video'), processController.create);

// GET /api/status/:jobId — Check the status of a processing job
router.get('/status/:jobId', processController.getStatus);

// GET /api/download/:filename — Watch or Download a processed clip
router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.resolve(config.storagePath, 'processed', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File not found: ${filename}` });
  }

  if (req.query.dl === '1') {
    return res.download(filePath, filename);
  } else {
    // This allows byte-range requests for watchable inline video viewing
    return res.sendFile(filePath);
  }
});

export default router;
