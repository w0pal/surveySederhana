// Survey questions data structure

export interface Option {
 value: string;
 label: string;
}

export interface Question {
 id: string;
 type: 'radio' | 'select' | 'text' | 'textarea' | 'checkbox';
 title: string;
 subtitle?: string;
 options?: Option[];
 required?: boolean;
 placeholder?: string;
 dependsOn?: {
  questionId: string;
  values: string[];
  action: 'show' | 'hide' | 'stop';
 };
 jumpTo?: {
  [value: string]: string; // value -> section/question to jump to
 };
}

export interface Section {
 id: string;
 title: string;
 description?: string;
 questions: Question[];
}

export const provinces: Option[] = [
 { value: '1', label: 'Aceh' },
 { value: '2', label: 'Bali' },
 { value: '3', label: 'Bangka Belitung' },
 { value: '4', label: 'Banten' },
 { value: '5', label: 'Bengkulu' },
 { value: '6', label: 'DKI Jakarta' },
 { value: '7', label: 'Daerah Istimewa Yogyakarta' },
 { value: '8', label: 'Gorontalo' },
 { value: '9', label: 'Jambi' },
 { value: '10', label: 'Jawa Barat' },
 { value: '11', label: 'Jawa Tengah' },
 { value: '12', label: 'Jawa Timur' },
 { value: '13', label: 'Kalimantan Barat' },
 { value: '14', label: 'Kalimantan Tengah' },
 { value: '15', label: 'Kalimantan Timur' },
 { value: '16', label: 'Kalimantan Utara' },
 { value: '17', label: 'Kalimantan Selatan' },
 { value: '18', label: 'Kepulauan Riau' },
 { value: '19', label: 'Lampung' },
 { value: '20', label: 'Maluku' },
 { value: '21', label: 'Maluku Utara' },
 { value: '22', label: 'NTB' },
 { value: '23', label: 'NTT' },
 { value: '24', label: 'Papua (Jayapura)' },
 { value: '25', label: 'Papua Barat (Manokwari)' },
 { value: '26', label: 'Papua Tengah (Nabire)' },
 { value: '27', label: 'Papua Pegunungan (Jayawijaya)' },
 { value: '28', label: 'Papua Selatan (Merauke)' },
 { value: '29', label: 'Papua Barat Daya (Sorong)' },
 { value: '30', label: 'Riau' },
 { value: '31', label: 'Sulawesi Utara' },
 { value: '32', label: 'Sulawesi Tengah' },
 { value: '33', label: 'Sulawesi Selatan' },
 { value: '34', label: 'Sulawesi Tenggara' },
 { value: '35', label: 'Sulawesi Barat' },
 { value: '36', label: 'Sumatera Selatan' },
 { value: '37', label: 'Sumatera Barat' },
 { value: '38', label: 'Sumatera Utara' },
];

export const provincesWithAbroad: Option[] = [
 ...provinces,
 { value: '39', label: 'Luar Negeri' },
];

export const ageOptions: Option[] = [
 { value: 'a', label: '≤ 14 Tahun' },
 { value: 'b', label: '15 – 19 tahun' },
 { value: 'c', label: '20 – 24 tahun' },
 { value: 'd', label: '25 – 29 tahun' },
 { value: 'e', label: '30 – 34 tahun' },
 { value: 'f', label: '35 – 39 tahun' },
 { value: 'g', label: '40 – 44 tahun' },
 { value: 'h', label: '45 – 49 tahun' },
 { value: 'i', label: '55 – 59 tahun' },
 { value: 'j', label: '60 – 64 tahun' },
 { value: 'k', label: '65 – 69 tahun' },
 { value: 'l', label: '70 – 74 tahun' },
 { value: 'm', label: '≥ 75 tahun' },
];

export const genderOptions: Option[] = [
 { value: 'a', label: 'Perempuan' },
 { value: 'b', label: 'Laki-laki' },
];

export const educationOptions: Option[] = [
 { value: 'a', label: 'SD/sederajat' },
 { value: 'b', label: 'SMP/sederajat' },
 { value: 'c', label: 'SMA/sederajat' },
 { value: 'd', label: 'D1/D2/D3/sederajat' },
 { value: 'e', label: 'D4/S1' },
 { value: 'f', label: 'S2/S3' },
];

export const jobOptions: Option[] = [
 { value: 'a', label: 'PNS/ASN' },
 { value: 'b', label: 'TNI/POLRI' },
 { value: 'c', label: 'Pegawai BUMN/BUMD' },
 { value: 'd', label: 'Tenaga Pendidik Non ASN (Dosen/Guru)' },
 { value: 'e', label: 'Karyawan Tetap di Sektor Swasta' },
 { value: 'f', label: 'Pekerja Kontrak Sektor Swasta' },
 { value: 'g', label: 'Wiraswasta/Pedagang/UMKM' },
 {
  value: 'h',
  label:
   'Pekerja Berbasis Digital (Pengemudi Transportasi Online/Content Creator/Pedagang/Pekerja di Online Shop)',
 },
 {
  value: 'i',
  label: 'Pekerja Dengan Penghasilan Harian/Tidak Tetap/Freelancer',
 },
 { value: 'j', label: 'Pekerja Rumah Tangga (Asisten Rumah Tangga/Pengasuh)' },
 { value: 'k', label: 'Pensiunan' },
 { value: 'l', label: 'Belum Dapat Pekerjaan/Terkena PHK' },
 { value: 'm', label: 'Pelajar/Mahasiswa' },
 { value: 'n', label: 'Ibu Rumah Tangga' },
 { value: 'o', label: 'Lainnya' },
];

export const incomeOptions: Option[] = [
 { value: 'a', label: 'Tidak punya penghasilan' },
 { value: 'b', label: '≤ 2,5 juta' },
 { value: 'c', label: '> 2,5 juta s.d. 5 juta' },
 { value: 'd', label: '> 5 juta s.d. 10 juta' },
 { value: 'e', label: '> 10 juta s.d. 20 juta' },
 { value: 'f', label: '> 20 juta s.d. 30 juta' },
 { value: 'g', label: '> 30 juta' },
 { value: 'h', label: 'Tidak ingin menjawab' },
];

export const travelPlanOptions: Option[] = [
 { value: 'ya', label: 'Ya' },
 { value: 'tidak', label: 'Tidak' },
];

export const noTravelReasonOptions: Option[] = [
 { value: 'a', label: 'Tidak punya kampung halaman' },
 { value: 'b', label: 'Tidak punya biaya' },
 { value: 'c', label: 'Tidak mendapat cuti' },
 { value: 'd', label: 'Menghindari kemacetan' },
 { value: 'e', label: 'Cuaca buruk atau kurang mendukung' },
 { value: 'f', label: 'Masih dalam kondisi bencana' },
 { value: 'g', label: 'Melakukan perjalanan/liburan di dalam kota' },
 { value: 'h', label: 'Malas kemana mana' },
 { value: 'i', label: 'Tidak merayakan lebaran' },
 { value: 'j', label: 'Lainnya' },
];

export const travelGroupOptions: Option[] = [
 { value: 'a', label: '1 orang (Anda sendiri)' },
 { value: 'b', label: '2 orang' },
 { value: 'c', label: '3 orang' },
 { value: 'd', label: '4 orang' },
 { value: 'e', label: '5 orang' },
 { value: 'f', label: 'Lebih dari 5 orang' },
];

export const travelReasonOptions: Option[] = [
 { value: 'a', label: 'Mudik, merayakan Idul Fitri di kampung halaman' },
 { value: 'b', label: 'Mudik, dalam rangka merayakan Hari Raya Nyepi' },
 { value: 'c', label: 'Memanfaatkan waktu liburan lebaran ke lokasi wisata' },
 { value: 'd', label: 'Tradisi mengunjungi orangtua/sanak saudara di kampung' },
 { value: 'e', label: 'Tugas/dinas/pekerjaan' },
 { value: 'f', label: 'Perjalanan rutin' },
 { value: 'g', label: 'Perjalanan Lainnya' },
];

export const departureDateOptions: Option[] = [
 { value: 'sebelum_h7', label: 'Sebelum H-7' },
 { value: 'h7', label: 'H-7, Sabtu 14 Maret 2026' },
 { value: 'h6', label: 'H-6, Minggu 15 Maret 2026' },
 { value: 'h5', label: 'H-5, Senin 16 Maret 2026 (Mulai Libur Anak Sekolah)' },
 { value: 'h4', label: 'H-4, Selasa 17 Maret 2026' },
 {
  value: 'h3',
  label: 'H-3, Rabu 18 Maret 2026 (Cuti Bersama Hari Raya Nyepi)',
 },
 { value: 'h2', label: 'H-2, Kamis 19 Maret 2026 (Hari Raya Nyepi)' },
 { value: 'h1', label: 'H-1, Jumat 20 Maret 2026 (Cuti Bersama Lebaran)' },
 { value: 'lebaran1', label: 'H1, Sabtu 21 Maret 2026 (Hari Lebaran Pertama)' },
 { value: 'lebaran2', label: 'H2, Minggu 22 Maret 2026 (Hari Lebaran Kedua)' },
 { value: 'h_plus1', label: 'H+1, Senin 23 Maret 2026 (Cuti Bersama)' },
 { value: 'h_plus2', label: 'H+2, Selasa 24 Maret 2026 (Cuti Bersama)' },
 { value: 'h_plus3', label: 'H+3, Rabu 25 Maret 2026' },
 { value: 'h_plus4', label: 'H+4, Kamis 26 Maret 2026' },
 { value: 'h_plus5', label: 'H+5, Jumat 27 Maret 2026' },
 { value: 'h_plus6', label: 'H+6, Sabtu 28 Maret 2026' },
 { value: 'h_plus7', label: 'H+7, Minggu 29 Maret 2026' },
 { value: 'setelah_h7', label: 'Setelah H+7' },
];

export const departureTimeOptions: Option[] = [
 { value: 'a', label: 'Pukul 00.00 – 03.59' },
 { value: 'b', label: 'Pukul 04.00 – 06.59' },
 { value: 'c', label: 'Pukul 07.00 – 09.59' },
 { value: 'd', label: 'Pukul 10.00 – 12.59' },
 { value: 'e', label: 'Pukul 13.00 – 15.59' },
 { value: 'f', label: 'Pukul 16.00 – 18.59' },
 { value: 'g', label: 'Pukul 19.00 – 21.59' },
 { value: 'h', label: 'Pukul 22.00 – 23.59' },
];

export const stayDurationOptions: Option[] = [
 { value: 'a', label: '< 4 Jam' },
 { value: 'b', label: '> 4 jam s.d 8 jam' },
 { value: 'c', label: '> 8 jam s.d 12 jam' },
 { value: 'd', label: '1 hari' },
 { value: 'e', label: '2-4 hari' },
 { value: 'f', label: '4-6 hari' },
 { value: 'g', label: 'Seminggu' },
 { value: 'h', label: '> Seminggu' },
 { value: 'i', label: 'Selama masa liburan lebaran' },
];

export const budgetOptions: Option[] = [
 { value: 'a', label: '≤ Rp. 1.000.000' },
 { value: 'b', label: '> Rp. 1.000.000 – Rp. 3.000.000' },
 { value: 'c', label: '> Rp. 3.000.000 – Rp. 5.000.000' },
 { value: 'd', label: '> Rp. 5.000.000 – Rp. 7.000.000' },
 { value: 'e', label: '> Rp. 7.000.000 – Rp. 10.000.000' },
 { value: 'f', label: '> Rp. 10.000.000 – Rp. 15.000.000' },
 { value: 'g', label: '> Rp. 15.000.000 – Rp. 20.000.000' },
 { value: 'h', label: '> Rp. 20.000.000' },
];

export const transportConsiderationOptions: Option[] = [
 { value: 'a', label: 'Biaya terjangkau' },
 { value: 'b', label: 'Lebih tepat waktu sampai ke tujuan' },
 { value: 'c', label: 'Lebih cepat sampai di tujuan' },
 { value: 'd', label: 'Lebih aman dan nyaman' },
 { value: 'e', label: 'Lebih fleksibel' },
 { value: 'f', label: 'Tidak ada pilihan transportasi lainnya' },
 { value: 'g', label: 'Lainnya' },
];

export const mainTransportOptions: Option[] = [
 { value: 'a', label: 'Pesawat' },
 { value: 'b', label: 'Kereta Api Antar Kota' },
 { value: 'c', label: 'Kereta Cepat' },
 { value: 'd', label: 'Kereta Commuter Line (KRL/LRT/KRD)' },
 { value: 'e', label: 'Bus' },
 { value: 'f', label: 'Kapal Laut/PELNI' },
 { value: 'g', label: 'Kapal Penyeberangan/Ferry/ASDP' },
 { value: 'h', label: 'Mobil Travel' },
 { value: 'i', label: 'Mobil Sewa' },
 { value: 'j', label: 'Taksi Reguler' },
 { value: 'k', label: 'Mobil Online/Taksi Online' },
 { value: 'l', label: 'Mobil pribadi' },
 { value: 'm', label: 'Sepeda Motor' },
 { value: 'n', label: 'Sepeda' },
 { value: 'o', label: 'Angkutan Mudik Gratis' },
 { value: 'p', label: 'Angkutan lainnya' },
];

export const routeOptions: Option[] = [
 { value: 'a', label: 'Jalur Lintas Utara Jawa (Pantura)' },
 { value: 'b', label: 'Jalur Lintas Selatan Jawa (Pansela)' },
 { value: 'c', label: 'Jalur Lintas Tengah Jawa' },
 { value: 'd', label: 'Jalur Bogor – Puncak – Cianjur (Bopunjur)' },
 { value: 'e', label: 'Jalur Ciawi – Sukabumi' },
 { value: 'f', label: 'Jalur jalan arteri/jalur utama lainnya' },
 { value: 'g', label: 'Jalur alternatif lainnya/selain jalur utama' },
];

export const routeWithTollOptions: Option[] = [
 { value: 'a', label: 'Jalan Tol' },
 { value: 'b', label: 'Trans Sumatera (Non Tol)' },
 { value: 'c', label: 'Jalur Lintas Utara Jawa (Pantura)' },
 { value: 'd', label: 'Jalur Lintas Selatan Jawa (Pansela)' },
 { value: 'e', label: 'Jalur Lintas Tengah Jawa' },
 { value: 'f', label: 'Jalur Bogor – Puncak – Cianjur (Bopunjur)' },
 { value: 'g', label: 'Jalur Ciawi – Sukabumi' },
 { value: 'h', label: 'Jalur jalan arteri/jalur utama lainnya' },
 { value: 'i', label: 'Jalur alternatif lainnya/selain jalur utama' },
];

export const restIntervalOptions: Option[] = [
 { value: 'a', label: 'Tidak istirahat' },
 { value: 'b', label: 'Ya istirahat, kurang dari 4 jam perjalanan' },
 { value: 'c', label: 'Ya istirahat, setelah 4-6 jam perjalanan' },
 { value: 'd', label: 'Ya istirahat, setelah 6-8 jam perjalanan' },
 { value: 'e', label: 'Ya istirahat, setelah 8-10 jam perjalanan' },
 { value: 'f', label: 'Ya istirahat, setelah lebih dari 10 jam perjalanan' },
];

export const restDurationOptions: Option[] = [
 { value: 'a', label: 'Kurang dari 30 menit' },
 { value: 'b', label: '30 menit sampai dengan 1 jam' },
 { value: 'c', label: '1 sampai dengan 2 jam' },
 { value: 'd', label: 'Lebih dari 2 jam' },
 { value: 'e', label: 'Tidak istirahat' },
];

export const transportCostOptions: Option[] = [
 { value: 'a', label: '≤ Rp. 1.000.000' },
 { value: 'b', label: '> Rp. 1.000.000 – Rp. 3.000.000' },
 { value: 'c', label: '> Rp. 3.000.000 – Rp. 5.000.000' },
 { value: 'd', label: '> Rp. 5.000.000 – Rp. 7.000.000' },
 { value: 'e', label: '> Rp. 7.000.000 – Rp. 10.000.000' },
 { value: 'f', label: '> Rp. 10.000.000' },
];

export const feederTransportOptions: Option[] = [
 { value: 'a', label: 'Kereta Perkotaan (KRL, MRT, LRT, KRD)' },
 { value: 'b', label: 'Kereta Api Bandara' },
 { value: 'c', label: 'Bus Bandara' },
 { value: 'd', label: 'Bus Umum' },
 { value: 'e', label: 'Angkot/Angdes/Mikrolet' },
 { value: 'f', label: 'Mobil Sewa' },
 { value: 'g', label: 'Taksi' },
 { value: 'h', label: 'Bajaj' },
 { value: 'i', label: 'Angkutan Sewa Khusus (Taksi Online)' },
 { value: 'j', label: 'Ojek Online' },
 { value: 'k', label: 'Ojek Pangkalan' },
 { value: 'l', label: 'Mobil Pribadi' },
 { value: 'm', label: 'Sepeda Motor' },
 { value: 'n', label: 'Bentor' },
 { value: 'o', label: 'Becak' },
 { value: 'p', label: 'Sepeda' },
 { value: 'q', label: 'Angkutan Sungai, Danau, dan Penyeberangan' },
 { value: 'r', label: 'Jalan Kaki' },
 { value: 's', label: 'Lainnya' },
];

export const ticketPurchaseOptions: Option[] = [
 { value: 'a', label: 'Saat ini belum membeli tiket untuk libur Lebaran' },
 { value: 'b', label: '1 Bulan sebelum tanggal bepergian' },
 { value: 'c', label: '3 Minggu sebelum tanggal bepergian' },
 { value: 'd', label: '2 Minggu sebelum tanggal bepergian' },
 { value: 'e', label: '1 Minggu sebelum tanggal bepergian' },
 { value: 'f', label: '< 1 Minggu sebelum tanggal bepergian' },
];

export const returnDateOptions: Option[] = [
 { value: 'lebaran2', label: 'H2, Minggu 22 Maret 2026 (Hari Lebaran Kedua)' },
 { value: 'h_plus1', label: 'H+1, Senin 23 Maret 2026 (Cuti Bersama)' },
 { value: 'h_plus2', label: 'H+2, Selasa 24 Maret 2026 (Cuti Bersama)' },
 { value: 'h_plus3', label: 'H+3, Rabu 25 Maret 2026' },
 { value: 'h_plus4', label: 'H+4, Kamis 26 Maret 2026' },
 {
  value: 'h_plus5',
  label: 'H+5, Jumat 27 Maret 2026 (Akhir libur anak sekolah)',
 },
 { value: 'h_plus6', label: 'H+6, Sabtu 28 Maret 2026' },
 { value: 'h_plus7', label: 'H+7, Minggu 29 Maret 2026' },
 { value: 'setelah_h7', label: 'Setelah H+7' },
];

export const additionalPeopleOptions: Option[] = [
 { value: 'a', label: 'Tidak ada tambahan orang' },
 { value: 'b', label: 'Ada tambahan 1 orang ikut dari kampung' },
 { value: 'c', label: 'Ada tambahan 2 orang ikut dari kampung' },
 { value: 'd', label: 'Ada tambahan 3 orang ikut dari kampung' },
 { value: 'e', label: 'Ada tambahan 4 orang ikut dari kampung' },
 { value: 'f', label: 'Ada tambahan lebih dari 4 orang ikut dari kampung' },
];

export const cancelReasonOptions: Option[] = [
 { value: 'a', label: 'Tidak punya biaya/ekonomi kurang mendukung' },
 { value: 'b', label: 'Tidak mendapat cuti/Tidak Work from Anywhere (WFA)' },
 { value: 'c', label: 'Cuaca buruk atau kurang mendukung' },
 { value: 'd', label: 'Situasi politik kurang mendukung' },
 { value: 'e', label: 'Adanya wabah penyakit menular' },
 { value: 'f', label: 'Adanya musibah/bencana alam' },
 { value: 'g', label: 'Lainnya' },
];

export const servicePerceptionOptions: Option[] = [
 { value: 'a', label: 'Sangat Puas' },
 { value: 'b', label: 'Puas' },
 { value: 'c', label: 'Sedang' },
 { value: 'd', label: 'Tidak Puas' },
 { value: 'e', label: 'Sangat Tidak Puas' },
];

export const rewardOptions: Option[] = [
 { value: 'a', label: 'Pulsa' },
 { value: 'b', label: 'GoPay' },
 { value: 'c', label: 'OVO' },
 { value: 'd', label: 'ShopeePay' },
 { value: 'e', label: 'Dana' },
 { value: 'f', label: 'LinkAja' },
];

export const surveyMediaOptions: Option[] = [
 { value: 'a', label: 'SMS' },
 { value: 'b', label: 'WhatsApp (WA)' },
 { value: 'c', label: 'Instagram' },
 { value: 'd', label: 'Website Badan Kebijakan Transportasi' },
 { value: 'e', label: 'Facebook (FB)' },
 { value: 'f', label: 'Lainnya' },
];

export const yesNoOptions: Option[] = [
 { value: 'ya', label: 'Ya' },
 { value: 'tidak', label: 'Tidak' },
];

export const wfaPreferenceOptions: Option[] = [
 { value: 'a', label: 'Penambahan cuti bersama' },
 {
  value: 'b',
  label: 'Pemberlakuan Work from Anywhere (WFA) atau bekerja dari mana saja',
 },
 { value: 'c', label: 'Lainnya' },
];

export const wfaStartDateOptions: Option[] = [
 { value: 'a', label: 'Mulai Senin, 16 Maret 2026' },
 { value: 'b', label: 'Mulai Selasa, 17 Maret 2026' },
];

export const wfaAfterDateOptions: Option[] = [
 { value: 'a', label: 'Rabu 25 Maret 2026 (satu hari)' },
 { value: 'b', label: 'Rabu 25 Maret dan Kamis 26 Maret 2026 (dua hari)' },
 {
  value: 'c',
  label: "Rabu 25 Maret, Kamis 26 Maret dan Jum'at 27 Maret 2026 (3 hari)",
 },
];

export const tollInfoMediaOptions: Option[] = [
 { value: 'a', label: 'SMS' },
 { value: 'b', label: 'Call Center' },
 { value: 'c', label: 'WhatsApp (WA)' },
 { value: 'd', label: 'Instagram' },
 { value: 'e', label: 'Website' },
 { value: 'f', label: 'Facebook (FB)' },
 { value: 'g', label: 'Aplikasi di Smartphone' },
 { value: 'h', label: 'Rambu yang terpasang' },
 { value: 'i', label: 'Lainnya' },
];
