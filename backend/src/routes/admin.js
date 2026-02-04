const express = require('express');
const router = express.Router();
const SurveyModel = require('../models/surveyModel');
const { adminAuth } = require('../middleware/adminAuth');
const { authLimiter } = require('../middleware/rateLimiter');


// Get all responses
router.get('/responses', adminAuth, (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const filters = {
            is_complete: req.query.is_complete !== undefined ? parseInt(req.query.is_complete) : undefined,
            start_date: req.query.start_date,
            end_date: req.query.end_date
        };

        const result = SurveyModel.getAllResponses(page, limit, filters);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Error getting responses:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data' });
    }
});

// Get single response detail
router.get('/responses/:responseId', adminAuth, (req, res) => {
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

// Delete response
router.delete('/responses/:responseId', adminAuth, (req, res) => {
    try {
        const { responseId } = req.params;
        const result = SurveyModel.deleteResponse(responseId);

        if (!result.deleted) {
            return res.status(404).json({ success: false, message: 'Response tidak ditemukan' });
        }

        res.json({ success: true, message: 'Response berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting response:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data' });
    }
});

// Get statistics
router.get('/statistics', adminAuth, (req, res) => {
    try {
        const stats = SurveyModel.getStatistics();
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
    }
});

// Export data as JSON
router.get('/export', adminAuth, (req, res) => {
    try {
        const data = SurveyModel.exportAllData();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ success: false, message: 'Gagal export data' });
    }
});

// Export data as CSV
router.get('/export/csv', adminAuth, (req, res) => {
    try {
        const data = SurveyModel.exportAllData();

        if (data.length === 0) {
            return res.status(404).json({ success: false, message: 'Tidak ada data untuk di-export' });
        }

        // Get all unique question IDs
        const allQuestionIds = new Set();
        data.forEach(item => {
            Object.keys(item.answers || {}).forEach(key => allQuestionIds.add(key));
        });

        const headers = ['id', 'whatsapp_number', 'created_at', ...Array.from(allQuestionIds)];

        const csvRows = [headers.join(',')];

        data.forEach(item => {
            const row = [
                item.id,
                item.whatsapp_number || '',
                item.created_at,
                ...Array.from(allQuestionIds).map(qId => {
                    const answer = item.answers[qId] || '';
                    // Escape commas and quotes in CSV
                    return `"${String(answer).replace(/"/g, '""')}"`;
                })
            ];
            csvRows.push(row.join(','));
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=survey-responses.csv');
        res.send(csvRows.join('\n'));
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ success: false, message: 'Gagal export CSV' });
    }
});

module.exports = router;
