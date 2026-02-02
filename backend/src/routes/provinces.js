const express = require('express');
const router = express.Router();
const ProvinceModel = require('../models/provinceModel');

// Get all provinces
router.get('/', (req, res) => {
    try {
        const provinces = ProvinceModel.getAllProvinces();
        res.json({ success: true, data: provinces });
    } catch (error) {
        console.error('Error getting provinces:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data provinsi' });
    }
});

// Get regencies by province
router.get('/:provinceId/regencies', (req, res) => {
    try {
        const { provinceId } = req.params;
        const regencies = ProvinceModel.getRegenciesByProvince(parseInt(provinceId));
        res.json({ success: true, data: regencies });
    } catch (error) {
        console.error('Error getting regencies:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data kabupaten/kota' });
    }
});

module.exports = router;
