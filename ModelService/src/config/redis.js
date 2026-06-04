import IORedis from 'ioredis';
import config from '../config/index.js';

/**
 * Shared Redis connection for BullMQ.
 * BullMQ requires ioredis — this module creates and exports
 * a reusable connection instance.
 */
const connection = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  maxRetriesPerRequest: null, // Required by BullMQ
});

connection.on('connect', () => {
  console.log(`✅ Redis connected at ${config.redis.host}:${config.redis.port}`);
});

connection.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.error(`
❌ Redis Connection Failed! 
   Make sure Docker Desktop is RUNNING.
   If it is running, start the Redis container:
   > docker start clipperzz-redis
    `);
  } else {
    console.error('❌ Redis connection error:', err.message);
  }
});

export default connection;
