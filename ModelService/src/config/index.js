import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  storagePath: process.env.STORAGE_PATH || './storage',

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },

  whisper: {
    model: process.env.WHISPER_MODEL || 'base',
  },
};

export default config;
