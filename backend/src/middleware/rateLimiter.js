/**
 * Rate Limiter Middleware
 * 
 * Membatasi jumlah request untuk mencegah spam dan brute force attacks
 */

const rateLimit = require('express-rate-limit');

// Seeder API Key (untuk bypass rate limit saat seeding)
const SEEDER_API_KEY = process.env.SEEDER_API_KEY || null;

/**
 * Check if request is from seeder (bypass rate limit)
 */
const isSeederRequest = (req) => {
    if (!SEEDER_API_KEY) return false;
    const apiKey = req.headers['x-seeder-key'];
    return apiKey === SEEDER_API_KEY;
};

/**
 * Skip rate limit if seeder key is valid
 */
const skipIfSeeder = (req) => isSeederRequest(req);

/**
 * Global Rate Limiter
 * - 100 requests per 15 minutes per IP
 * - Applies to all endpoints
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipIfSeeder,
    message: {
        success: false,
        message: 'Terlalu banyak request. Coba lagi dalam 15 menit.',
    },
});

/**
 * Survey Submission Rate Limiter
 * - 10 submissions per hour per IP
 * - Applies to /api/survey/start and /api/survey/:id/complete
 */
const surveyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 submissions per hour
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipIfSeeder,
    message: {
        success: false,
        message: 'Terlalu banyak pengisian survey. Maksimal 10 per jam.',
    },
    keyGenerator: (req) => {
        // Use IP + user agent for better fingerprinting
        return `${req.ip}-${req.get('User-Agent') || 'unknown'}`;
    },
});

/**
 * Auth Rate Limiter (for admin login)
 * - 5 attempts per 15 minutes per IP
 * - Prevents brute force password attacks
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
    },
});

/**
 * Strict limiter for sensitive operations
 * - 3 attempts per hour per IP  
 * - For password changes, etc.
 */
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Terlalu banyak percobaan. Coba lagi dalam 1 jam.',
    },
});

module.exports = {
    globalLimiter,
    surveyLimiter,
    authLimiter,
    strictLimiter,
    isSeederRequest,
};
