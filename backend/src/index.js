require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Initialize database
require('./database/init');

// Rate limiters
const { globalLimiter, surveyLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Railway/Vercel/etc (required for rate limiting)
app.set('trust proxy', 1);

// Middleware
app.use(helmet());

// CORS configuration - support multiple origins
const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (corsOrigins.indexOf(origin) !== -1 || corsOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiter to all routes
app.use(globalLimiter);


// Routes
app.use('/api/survey', require('./routes/survey'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/provinces', require('./routes/provinces'));
app.use('/api/admin/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// One-time password reset endpoint (secured with reset secret)
const bcrypt = require('bcryptjs');
const SettingsModel = require('./models/settingsModel');
app.post('/api/reset-admin-key', (req, res) => {
    const resetSecret = req.headers['x-reset-secret'];
    const expectedSecret = process.env.RESET_SECRET;

    if (!expectedSecret || resetSecret !== expectedSecret) {
        return res.status(401).json({ success: false, message: 'Invalid reset secret' });
    }

    try {
        const newPassword = process.env.PASSWORD_ADMIN;
        if (!newPassword) {
            return res.status(500).json({ success: false, message: 'PASSWORD_ADMIN not set' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const db = require('./database/connection');
        db.prepare('DELETE FROM app_settings WHERE key = ?').run('admin_key');
        db.prepare('INSERT INTO app_settings (key, value) VALUES (?, ?)').run('admin_key', hashedPassword);

        res.json({ success: true, message: 'Admin key reset successfully' });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ success: false, message: 'Failed to reset admin key' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Survey API: http://localhost:${PORT}/api/survey`);
    console.log(`👨‍💼 Admin API: http://localhost:${PORT}/api/admin`);
});

module.exports = app;
