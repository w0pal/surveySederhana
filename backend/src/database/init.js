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

    console.log('Database initialized successfully!');
}

// Run initialization
initializeDatabase();

module.exports = { initializeDatabase };
