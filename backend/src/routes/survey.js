const express = require('express');
const router = express.Router();
const SurveyModel = require('../models/surveyModel');
const { body, validationResult } = require('express-validator');

// Start new survey response
router.post('/start', (req, res) => {
    try {
        const response = SurveyModel.createResponse({
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
        });
        res.status(201).json({ success: true, data: response });
    } catch (error) {
        console.error('Error starting survey:', error);
        res.status(500).json({ success: false, message: 'Gagal memulai survey' });
    }
});

// Save answers (can be called multiple times for auto-save)
router.post('/:responseId/answers', [
    body('answers').isArray().withMessage('Answers must be an array')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { responseId } = req.params;
        const { answers } = req.body;

        SurveyModel.saveAnswers(responseId, answers);
        res.json({ success: true, message: 'Jawaban berhasil disimpan' });
    } catch (error) {
        console.error('Error saving answers:', error);
        res.status(500).json({ success: false, message: 'Gagal menyimpan jawaban' });
    }
});

// Complete survey
router.post('/:responseId/complete', (req, res) => {
    try {
        const { responseId } = req.params;
        const { whatsapp_number } = req.body;

        // Basic validation - just ensure whatsapp_number is string or undefined
        let cleanedNumber = null;
        if (whatsapp_number && typeof whatsapp_number === 'string') {
            // Remove non-digits except + at the start
            cleanedNumber = whatsapp_number.trim();
        }

        SurveyModel.completeResponse(responseId, cleanedNumber);
        res.json({ success: true, message: 'Survey berhasil diselesaikan. Terima kasih atas partisipasi Anda!' });
    } catch (error) {
        console.error('Error completing survey:', error);
        res.status(500).json({ success: false, message: 'Gagal menyelesaikan survey' });
    }
});

// Get single response (for resuming)
router.get('/:responseId', (req, res) => {
    try {
        const { responseId } = req.params;
        const response = SurveyModel.getResponseById(responseId);

        if (!response) {
            return res.status(404).json({ success: false, message: 'Response tidak ditemukan' });
        }

        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error getting response:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

module.exports = router;
