import rateLimit from 'express-rate-limit';

// General rate limiter for all public APIs (100 req/min)
export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests from this IP, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for Authentication routes (5 req/min)
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many login attempts from this IP, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict for password reset/forgot password (3 req/hour)
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many password reset attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});
