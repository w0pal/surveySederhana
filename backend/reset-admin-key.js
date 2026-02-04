/**
 * Reset Admin Key Script
 * 
 * Menghapus admin_key dari database agar di-regenerate dengan hash baru
 * saat server restart.
 */

require('dotenv').config();
const db = require('./src/database/connection');

console.log('Resetting admin_key...');

try {
    // Delete existing admin_key
    const deleteStmt = db.prepare('DELETE FROM app_settings WHERE key = ?');
    const result = deleteStmt.run('admin_key');

    if (result.changes > 0) {
        console.log('✅ admin_key deleted. Restart server to generate new hashed key.');
    } else {
        console.log('ℹ️  admin_key not found in database.');
    }
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}

console.log('');
console.log('Next steps:');
console.log('1. Restart the backend server');
console.log('2. New hashed admin_key will be created from PASSWORD_ADMIN in .env');
