const db = require('../database/connection');
const bcrypt = require('bcryptjs');

class SettingsModel {
    // Get all settings
    static getAllSettings() {
        const stmt = db.prepare('SELECT key, value FROM app_settings');
        const rows = stmt.all();
        const settings = rows.reduce((acc, row) => {
            // Don't expose admin_key hash in getAllSettings
            if (row.key !== 'admin_key') {
                acc[row.key] = row.value;
            }
            return acc;
        }, {});
        return settings;
    }

    // Get single setting
    static getSetting(key) {
        const stmt = db.prepare('SELECT value FROM app_settings WHERE key = ?');
        const row = stmt.get(key);
        return row ? row.value : null;
    }

    // Update settings (handles admin_key specially with hashing)
    static updateSettings(settings) {
        const updateStmt = db.prepare('UPDATE app_settings SET value = ? WHERE key = ?');
        const insertStmt = db.prepare('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)');

        const transaction = db.transaction((settings) => {
            for (const [key, value] of Object.entries(settings)) {
                let valueToStore = value;

                // Hash admin_key before storing
                if (key === 'admin_key' && value) {
                    valueToStore = bcrypt.hashSync(value, 10);
                }

                const result = updateStmt.run(valueToStore, key);
                if (result.changes === 0) {
                    insertStmt.run(key, valueToStore);
                }
            }
        });

        transaction(settings);
        return { success: true };
    }

    // Verify admin key (for authentication)
    static verifyAdminKey(plainPassword) {
        const hashedKey = this.getSetting('admin_key');
        if (!hashedKey) return false;
        return bcrypt.compareSync(plainPassword, hashedKey);
    }

    // Set admin key (for password change)
    static setAdminKey(newPassword) {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const stmt = db.prepare('UPDATE app_settings SET value = ? WHERE key = ?');
        stmt.run(hashedPassword, 'admin_key');
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
