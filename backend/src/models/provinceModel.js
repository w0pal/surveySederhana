const db = require('../database/connection');

class ProvinceModel {
    static getAllProvinces() {
        const stmt = db.prepare('SELECT * FROM provinces ORDER BY name');
        return stmt.all();
    }

    static getRegenciesByProvince(provinceId) {
        const stmt = db.prepare('SELECT * FROM regencies WHERE province_id = ? ORDER BY name');
        return stmt.all(provinceId);
    }
}

module.exports = ProvinceModel;
