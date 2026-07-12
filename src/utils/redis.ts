import { createClient } from 'redis';
import logger from './logger';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const cacheData = async (key: string, data: any, ttlSeconds: number = 3600) => {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    logger.error('Redis Cache Error', error);
  }
};

export const getCachedData = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis Get Error', error);
    return null;
  }
};

export const invalidateCache = async (pattern: string) => {
  try {
    // Note: KEYS is generally not recommended in production for large datasets,
    // but works for this ERP scale. A Better approach is using Redis Sets for tags.
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.error('Redis Invalidate Error', error);
  }
};
