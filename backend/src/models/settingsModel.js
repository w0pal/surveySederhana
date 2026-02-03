const db = require('../database/connection');

class SettingsModel {
    // Get all settings
    static getAllSettings() {
        const stmt = db.prepare('SELECT key, value FROM app_settings');
        const rows = stmt.all();
        return rows.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
        }, {});
    }

    // Get single setting
    static getSetting(key) {
        const stmt = db.prepare('SELECT value FROM app_settings WHERE key = ?');
        const row = stmt.get(key);
        return row ? row.value : null;
    }

    // Update settings
    static updateSettings(settings) {
        const updateStmt = db.prepare('UPDATE app_settings SET value = ? WHERE key = ?');
        const insertStmt = db.prepare('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)');

        const transaction = db.transaction((settings) => {
            for (const [key, value] of Object.entries(settings)) {
                const result = updateStmt.run(value, key);
                if (result.changes === 0) {
                    insertStmt.run(key, value);
                }
            }
        });

        transaction(settings);
        return { success: true };
    }

    // Get province coordinates for GIS
    static getProvinceCoordinates() {
        const stmt = db.prepare(`
            SELECT p.id, p.name, pc.latitude, pc.longitude
            FROM provinces p
            LEFT JOIN province_coordinates pc ON p.id = pc.province_id
            WHERE pc.latitude IS NOT NULL AND pc.longitude IS NOT NULL
            AND pc.latitude != 0 AND pc.longitude != 0
        `);
        return stmt.all();
    }

    // Get respondent distribution by province with coordinates
    static getRespondentDistribution() {
        const stmt = db.prepare(`
            SELECT 
                p.id as province_id,
                p.name as province_name,
                pc.latitude,
                pc.longitude,
                COUNT(DISTINCT sr.id) as respondent_count
            FROM provinces p
            LEFT JOIN province_coordinates pc ON p.id = pc.province_id
            LEFT JOIN survey_answers sa ON sa.question_id = 'q6_province' AND CAST(sa.answer_value AS INTEGER) = p.id
            LEFT JOIN survey_responses sr ON sa.response_id = sr.id AND sr.is_complete = 1
            WHERE pc.latitude IS NOT NULL AND pc.longitude IS NOT NULL
            AND pc.latitude != 0 AND pc.longitude != 0
            GROUP BY p.id, p.name, pc.latitude, pc.longitude
            HAVING respondent_count > 0
            ORDER BY respondent_count DESC
        `);
        return stmt.all();
    }
}

module.exports = SettingsModel;
