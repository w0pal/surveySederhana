/**
 * Admin Authentication Middleware
 * 
 * Verifikasi admin key dengan bcrypt hashing
 */

const bcrypt = require('bcryptjs');
const SettingsModel = require('../models/settingsModel');

/**
 * Admin authentication middleware
 * Checks hashed password from database
 */
const adminAuth = async (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];

    if (!adminKey) {
        return res.status(401).json({ success: false, message: 'Admin key required' });
    }

    try {
        // Get hashed admin key from database
        const hashedKey = SettingsModel.getSetting('admin_key');

        if (!hashedKey) {
            // No admin key in database - this shouldn't happen in production
            console.error('No admin_key found in database!');
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }

        // Compare with bcrypt
        const isValid = await bcrypt.compare(adminKey, hashedKey);

        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

module.exports = { adminAuth };
