'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSurveyStore } from '@/lib/store';
import { surveyApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CompletePage() {
 const router = useRouter();
 const { responseId, answers, resetSurvey } = useSurveyStore();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSubmitted, setIsSubmitted] = useState(false);

 useEffect(() => {
  if (!responseId) {
   router.push('/');
   return;
  }

  const submitSurvey = async () => {
   if (isSubmitted) return;

   setIsSubmitting(true);
   try {
    // Save all answers first
    const formattedAnswers = Object.entries(answers).map(
     ([question_id, answer_value]) => ({
      question_id,
      answer_value: String(answer_value),
     }),
    );
    await surveyApi.saveAnswers(responseId, formattedAnswers);

    // Complete the survey
    const whatsappNumber = answers['q45_whatsapp'] || '';
    await surveyApi.completeSurvey(responseId, whatsappNumber);

    setIsSubmitted(true);
    toast.success('Survey berhasil dikirim!');
   } catch (error) {
    console.error('Error submitting survey:', error);
    toast.error('Gagal mengirim survey. Data Anda tetap tersimpan.');
   } finally {
    setIsSubmitting(false);
   }
  };

  submitSurvey();
 }, [responseId, answers, router, isSubmitted]);

 const handleNewSurvey = () => {
  resetSurvey();
  router.push('/');
 };

 if (isSubmitting) {
  return (
   <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
    <div className="text-center">
     <div className="animate-spin h-16 w-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
     <p className="text-lg text-gray-600">Mengirim jawaban Anda...</p>
    </div>
   </main>
  );
 }

 return (
  <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
   <div className="max-w-2xl mx-auto px-4 py-12">
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
     {/* Success Icon */}
     <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg
       className="w-12 h-12 text-green-600"
       fill="none"
       stroke="currentColor"
       viewBox="0 0 24 24"
      >
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
       />
      </svg>
     </div>

     <h1 className="text-3xl font-bold text-gray-900 mb-4">Terima Kasih!</h1>

     <p className="text-lg text-gray-600 mb-6">
      Jawaban Anda telah berhasil disimpan. Terima kasih atas partisipasi Anda
      dalam Survei Prakiraan Pergerakan Masyarakat Lebaran 2026.
     </p>

     {/* Reward Info */}
     <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
      <p className="text-yellow-800 font-semibold mb-2">🎁 Informasi Hadiah</p>
      <p className="text-yellow-700 text-sm">
       Bagi 50 orang yang terpilih secara acak akan mendapatkan pulsa/e-wallet
       senilai
       <strong> Rp100.000</strong>. Pengumuman pemenang akan disampaikan melalui
       Instagram <strong>@baketrans</strong>.
      </p>
      <p className="text-yellow-600 text-xs mt-2">
       Pastikan Anda telah follow Instagram @baketrans untuk mendapatkan
       informasi terbaru!
      </p>
     </div>

     {/* Social Media Links */}
     <div className="flex justify-center gap-4 mb-8">
      <a
       href="https://instagram.com/baketrans"
       target="_blank"
       rel="noopener noreferrer"
       className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
      >
       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
       </svg>
       Follow @baketrans
      </a>
     </div>

     {/* Response ID */}
     <div className="bg-gray-50 rounded-lg p-4 mb-8">
      <p className="text-xs text-gray-500 mb-1">ID Respons Anda:</p>
      <code className="text-sm text-gray-700 font-mono">{responseId}</code>
     </div>

     {/* Actions */}
     <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button onClick={handleNewSurvey} className="btn-primary">
       Isi Survey Baru
      </button>
      <button onClick={() => window.close()} className="btn-secondary">
       Tutup
      </button>
     </div>

     {/* Footer */}
     <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-500">
       © 2026 Badan Kebijakan Transportasi - Kementerian Perhubungan
      </p>
     </div>
    </div>
   </div>
  </main>
 );
}
