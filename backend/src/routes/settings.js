const express = require('express');
const router = express.Router();
const SettingsModel = require('../models/settingsModel');

// Admin authentication middleware - checks database first, then env fallback
const adminAuth = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];

    // Try to get admin key from database first
    let storedAdminKey;
    try {
        storedAdminKey = SettingsModel.getSetting('admin_key');
    } catch (error) {
        console.error('Error getting admin key from database:', error);
    }

    // Fallback to env if not in database
    const validAdminKey = storedAdminKey || process.env.PASSWORD_ADMIN || 'admin123';

    if (adminKey !== validAdminKey) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next();
};

// Get all settings
router.get('/', adminAuth, (req, res) => {
    try {
        const settings = SettingsModel.getAllSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error getting settings:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil settings' });
    }
});

// Update settings
router.put('/', adminAuth, (req, res) => {
    try {
        const settings = req.body;
        SettingsModel.updateSettings(settings);
        res.json({ success: true, message: 'Settings berhasil disimpan' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, message: 'Gagal menyimpan settings' });
    }
});

// Get GIS data - respondent distribution by province
router.get('/geo/distribution', adminAuth, (req, res) => {
    try {
        const distribution = SettingsModel.getRespondentDistribution();
        res.json({ success: true, data: distribution });
    } catch (error) {
        console.error('Error getting geo distribution:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data distribusi' });
    }
});

// Get all province coordinates
router.get('/geo/provinces', adminAuth, (req, res) => {
    try {
        const provinces = SettingsModel.getProvinceCoordinates();
        res.json({ success: true, data: provinces });
    } catch (error) {
        console.error('Error getting province coordinates:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data koordinat provinsi' });
    }
});

module.exports = router;
