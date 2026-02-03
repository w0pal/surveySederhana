const db = require('./connection');

// Initialize database schema
function initializeDatabase() {
  console.log('Initializing database...');

  // Create survey_responses table - stores each survey submission
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id TEXT PRIMARY KEY,
      whatsapp_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_complete INTEGER DEFAULT 0,
      ip_address TEXT,
      user_agent TEXT
    )
  `);

  // Create survey_answers table - stores individual answers
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      response_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      answer_value TEXT,
      answer_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE
    )
  `);

  // Create index for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_answers_response_id ON survey_answers(response_id);
    CREATE INDEX IF NOT EXISTS idx_answers_question_id ON survey_answers(question_id);
    CREATE INDEX IF NOT EXISTS idx_responses_created_at ON survey_responses(created_at);
  `);

  // Create provinces table
  db.exec(`
    CREATE TABLE IF NOT EXISTS provinces (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);

  // Create regencies/cities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS regencies (
      id INTEGER PRIMARY KEY,
      province_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (province_id) REFERENCES provinces(id)
    )
  `);

  // Insert provinces data
  const provinces = [
    [1, 'Aceh'], [2, 'Bali'], [3, 'Bangka Belitung'], [4, 'Banten'],
    [5, 'Bengkulu'], [6, 'DKI Jakarta'], [7, 'Daerah Istimewa Yogyakarta'],
    [8, 'Gorontalo'], [9, 'Jambi'], [10, 'Jawa Barat'], [11, 'Jawa Tengah'],
    [12, 'Jawa Timur'], [13, 'Kalimantan Barat'], [14, 'Kalimantan Tengah'],
    [15, 'Kalimantan Timur'], [16, 'Kalimantan Utara'], [17, 'Kalimantan Selatan'],
    [18, 'Kepulauan Riau'], [19, 'Lampung'], [20, 'Maluku'], [21, 'Maluku Utara'],
    [22, 'NTB'], [23, 'NTT'], [24, 'Papua (Jayapura)'], [25, 'Papua Barat (Manokwari)'],
    [26, 'Papua Tengah (Nabire)'], [27, 'Papua Pegunungan (Jayawijaya)'],
    [28, 'Papua Selatan (Merauke)'], [29, 'Papua Barat Daya (Sorong)'],
    [30, 'Riau'], [31, 'Sulawesi Utara'], [32, 'Sulawesi Tengah'],
    [33, 'Sulawesi Selatan'], [34, 'Sulawesi Tenggara'], [35, 'Sulawesi Barat'],
    [36, 'Sumatera Selatan'], [37, 'Sumatera Barat'], [38, 'Sumatera Utara'],
    [39, 'Luar Negeri']
  ];

  const insertProvince = db.prepare('INSERT OR IGNORE INTO provinces (id, name) VALUES (?, ?)');
  for (const prov of provinces) {
    insertProvince.run(prov[0], prov[1]);
  }

  // Create app_settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Insert default app settings
  const defaultSettings = [
    ['app_name', 'Survey Lebaran 2026'],
    ['app_version', '1.0.0'],
    ['copyright_text', 'Survey Sederhana'],
    ['copyright_year', '2026'],
    ['logo_url', ''],
    ['admin_key', process.env.PASSWORD_ADMIN || 'admin123']  // Default admin key
  ];
  const insertSetting = db.prepare('INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)');
  for (const setting of defaultSettings) {
    insertSetting.run(setting[0], setting[1]);
  }

  // Create province_coordinates table for GIS
  db.exec(`
    CREATE TABLE IF NOT EXISTS province_coordinates (
      province_id INTEGER PRIMARY KEY,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      FOREIGN KEY (province_id) REFERENCES provinces(id)
    )
  `);

  // Insert province coordinates (centroid)
  const provinceCoords = [
    [1, 4.6951, 96.7494],    // Aceh
    [2, -8.4095, 115.1889],  // Bali
    [3, -2.7411, 106.4406], // Bangka Belitung
    [4, -6.4058, 106.0640], // Banten
    [5, -3.7928, 102.2608], // Bengkulu
    [6, -6.2088, 106.8456], // DKI Jakarta
    [7, -7.7956, 110.3695], // DIY
    [8, 0.6999, 122.4467],  // Gorontalo
    [9, -1.6101, 103.6131], // Jambi
    [10, -6.9175, 107.6191], // Jawa Barat
    [11, -7.1509, 110.1403], // Jawa Tengah
    [12, -7.5361, 112.2384], // Jawa Timur
    [13, -0.2787, 111.4752], // Kalimantan Barat
    [14, -1.6815, 113.3824], // Kalimantan Tengah
    [15, -0.5023, 117.1536], // Kalimantan Timur
    [16, 2.7257, 117.0949],  // Kalimantan Utara
    [17, -3.0926, 115.2838], // Kalimantan Selatan
    [18, 0.9159, 104.4502],  // Kepulauan Riau
    [19, -4.5586, 105.4068], // Lampung
    [20, -3.2385, 130.1453], // Maluku
    [21, 1.5709, 127.8089],  // Maluku Utara
    [22, -8.6529, 117.3616], // NTB
    [23, -8.6573, 121.0794], // NTT
    [24, -2.5489, 140.7040], // Papua (Jayapura)
    [25, -1.3361, 133.1747], // Papua Barat (Manokwari)
    [26, -3.4286, 136.0694], // Papua Tengah
    [27, -4.0835, 138.6568], // Papua Pegunungan
    [28, -6.8756, 140.5089], // Papua Selatan
    [29, -0.8615, 131.2558], // Papua Barat Daya
    [30, 0.5071, 101.4478],  // Riau
    [31, 1.4748, 124.8421],  // Sulawesi Utara
    [32, -1.4300, 121.4456], // Sulawesi Tengah
    [33, -3.6687, 119.9740], // Sulawesi Selatan
    [34, -4.1449, 122.1746], // Sulawesi Tenggara
    [35, -2.8442, 119.2321], // Sulawesi Barat
    [36, -3.3194, 104.9147], // Sumatera Selatan
    [37, -0.7399, 100.8000], // Sumatera Barat
    [38, 2.1154, 99.5451],   // Sumatera Utara
    [39, 0, 0]               // Luar Negeri (no specific coords)
  ];
  const insertCoord = db.prepare('INSERT OR IGNORE INTO province_coordinates (province_id, latitude, longitude) VALUES (?, ?, ?)');
  for (const coord of provinceCoords) {
    insertCoord.run(coord[0], coord[1], coord[2]);
  }

  console.log('Database initialized successfully!');
}

// Run initialization
initializeDatabase();

module.exports = { initializeDatabase };
