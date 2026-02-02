'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { surveyApi } from '@/lib/api';
import { useSurveyStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function HomePage() {
 const [isLoading, setIsLoading] = useState(false);
 const [agreed, setAgreed] = useState(false);
 const router = useRouter();
 const { setResponseId, resetSurvey } = useSurveyStore();

 const handleStart = async () => {
  if (!agreed) {
   toast.error('Anda harus menyetujui persyaratan untuk melanjutkan');
   return;
  }

  setIsLoading(true);
  try {
   resetSurvey();
   const result = await surveyApi.startSurvey();
   if (result.success) {
    setResponseId(result.data.id);
    router.push('/survey');
   }
  } catch (error) {
   toast.error('Gagal memulai survey. Silakan coba lagi.');
   console.error('Error starting survey:', error);
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
   {/* Header */}
   <div className="bg-primary-700 text-white py-6">
    <div className="max-w-4xl mx-auto px-4">
     <div className="flex items-center justify-center gap-4 mb-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
       <span className="text-primary-700 text-2xl font-bold">🚗</span>
      </div>
     </div>
     <h1 className="text-2xl md:text-3xl font-bold text-center">
      SURVEI PRAKIRAAN PERGERAKAN MASYARAKAT
     </h1>
     <p className="text-center text-primary-100 mt-2">
      Dalam Rangka Persiapan Penyelenggaraan Angkutan Lebaran 2026
     </p>
    </div>
   </div>

   {/* Content */}
   <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
     {/* Introduction */}
     <div className="prose max-w-none mb-8">
      <p className="text-gray-700 leading-relaxed">Bapak/Ibu yang terhormat,</p>
      <p className="text-gray-700 leading-relaxed mt-4">
       Badan Kebijakan Transportasi Kementerian Perhubungan melakukan survei
       persepsi masyarakat guna memprakirakan mobilitas masyarakat pada libur
       Lebaran 2026. Survei ini sudah mendapatkan rekomendasi dari Badan Pusat
       Statistik (BPS).
      </p>

      {/* Reward Info */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
       <p className="text-yellow-800 font-medium">🎁 Apresiasi Partisipasi</p>
       <p className="text-yellow-700 text-sm mt-2">
        Sebagai bentuk apresiasi atas partisipasi pengisian survei ini, bagi 50
        orang akan mendapatkan{' '}
        <strong>pulsa/e-wallet senilai Rp100.000,-</strong> yang terpilih secara
        acak dan akan diumumkan melalui Instagram @baketrans.
       </p>
      </div>

      <p className="text-gray-700 leading-relaxed">
       Dengan mengikuti survei ini, Anda memberikan persetujuan kepada
       Kementerian Perhubungan untuk menyimpan dan menganalisis jawaban atas
       pertanyaan survei. Mohon kerja samanya untuk menjawab pertanyaan berikut
       secara benar.
      </p>
     </div>

     {/* Data Privacy Consent */}
     <div className="border border-gray-200 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
       📋 Persetujuan Penggunaan Data Pribadi
      </h2>
      <div className="text-sm text-gray-600 space-y-3">
       <p>
        Dengan penuh kesadaran dan tanpa paksaan, saya bersedia secara sukarela
        untuk memberikan informasi dan data pribadi yang meliputi:
       </p>
       <ol className="list-decimal list-inside space-y-1 ml-4">
        <li>Nomor telepon</li>
        <li>
         Kode Provinsi dan Kabupaten (lokasi tempat tinggal dan tujuan
         perjalanan)
        </li>
        <li>Usia</li>
        <li>Pekerjaan</li>
        <li>Pendidikan</li>
        <li>Penghasilan</li>
       </ol>
       <p className="mt-4">Saya memberikan kuasa kepada Kemenhub untuk:</p>
       <ol className="list-decimal list-inside space-y-1 ml-4">
        <li>
         Memperoleh, mengumpulkan, mengolah, menganalisis, menyimpan,
         menampilkan, mengumumkan, mengirimkan, dan/atau memusnahkan Data
         Pribadi sesuai dengan Tujuan.
        </li>
        <li>Mengirimkan data tersebut kepada pihak Kemenhub.</li>
       </ol>
       <p className="mt-4 text-gray-500 italic">
        Kemenhub memastikan bahwa ketika mentransfer data pribadi telah
        dilakukan enkripsi dan/atau bentuk upaya lainnya untuk perlindungan
        data.
       </p>
      </div>
     </div>

     {/* Agreement Checkbox */}
     <div className="mb-8">
      <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
       <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
       />
       <span className="text-sm text-gray-700">
        Saya telah membaca dan <strong>menyetujui</strong> persyaratan di atas,
        dan bersedia menjadi responden survei ini.
       </span>
      </label>
     </div>

     {/* Start Button */}
     <div className="text-center">
      <button
       onClick={handleStart}
       disabled={!agreed || isLoading}
       className="btn-primary px-12 py-4 text-lg"
      >
       {isLoading ? (
        <span className="flex items-center gap-2">
         <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
           className="opacity-25"
           cx="12"
           cy="12"
           r="10"
           stroke="currentColor"
           strokeWidth="4"
           fill="none"
          />
          <path
           className="opacity-75"
           fill="currentColor"
           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
         </svg>
         Memuat...
        </span>
       ) : (
        'Setuju dan Lanjutkan →'
       )}
      </button>
     </div>

     {/* Footer */}
     <div className="mt-8 pt-6 border-t border-gray-200 text-center">
      <p className="text-sm text-gray-500">
       Atas partisipasinya, diucapkan terima kasih.
      </p>
      <p className="text-xs text-gray-400 mt-2">
       © 2026 Badan Kebijakan Transportasi - Kementerian Perhubungan
      </p>
     </div>
    </div>
   </div>
  </main>
 );
}
