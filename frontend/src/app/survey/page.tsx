'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSurveyStore } from '@/lib/store';
import { surveyApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import RadioGroup from '@/components/RadioGroup';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';
import * as surveyData from '@/lib/surveyData';

const TOTAL_SECTIONS = 9;

export default function SurveyPage() {
 const router = useRouter();
 const { responseId, currentSection, answers, setAnswer, setCurrentSection } =
  useSurveyStore();
 const [isLoading, setIsLoading] = useState(false);
 const [isSaving, setIsSaving] = useState(false);

 // Redirect if no responseId
 useEffect(() => {
  if (!responseId) {
   router.push('/');
  }
 }, [responseId, router]);

 // Auto-save answers
 const saveAnswers = useCallback(async () => {
  if (!responseId || Object.keys(answers).length === 0) return;

  setIsSaving(true);
  try {
   const formattedAnswers = Object.entries(answers).map(
    ([question_id, answer_value]) => ({
     question_id,
     answer_value: String(answer_value),
    }),
   );
   await surveyApi.saveAnswers(responseId, formattedAnswers);
  } catch (error) {
   console.error('Error saving answers:', error);
  } finally {
   setIsSaving(false);
  }
 }, [responseId, answers]);

 // Auto-save on section change
 useEffect(() => {
  const timer = setTimeout(saveAnswers, 2000);
  return () => clearTimeout(timer);
 }, [answers, saveAnswers]);

  // Validate required questions for current section
  const validateSection = (): boolean => {
    const requiredQuestions: { [key: number]: string[] } = {
      0: ['q1_age', 'q2_gender', 'q3_education', 'q4_job', 'q5_income', 'q6_province', 'q7_travel_plan'],
      1: ['q8_no_travel_reason'],
      2: ['q9_travel_group', 'q10_travel_reason', 'q11_destination_province', 'q12_departure_date', 'q13_departure_time', 'q14_stay_duration', 'q15_budget', 'q16_transport_consideration', 'q17_transportation'],
      3: getValue('q17_transportation') === 'm' || getValue('q17_transportation') === 'n' 
        ? ['q18_route', 'q20_rest_interval', 'q21_rest_duration', 'q22_transport_cost']
        : getValue('q19_route_toll') === 'a'
        ? ['q19_route_toll', 'q19a_toll_discount', 'q19b_traffic_engineering', 'q19c_rest_area', 'q19d_toll_info_media', 'q20_rest_interval', 'q21_rest_duration', 'q22_transport_cost']
        : ['q19_route_toll', 'q20_rest_interval', 'q21_rest_duration', 'q22_transport_cost'],
      4: ['q23_feeder_transport', 'q24_last_mile_transport', 'q25_ticket_purchase', 'q26_alternative_transport'],
      5: getValue('q29_same_transport') === 'tidak'
        ? ['q27_return_date', 'q28_return_time', 'q29_same_transport', 'q30_return_transport', 'q31_additional_people']
        : ['q27_return_date', 'q28_return_time', 'q29_same_transport', 'q31_additional_people'],
      6: getValue('q33_wfa_perception') === 'setuju'
        ? ['q32_cancel_reason', 'q33_wfa_perception', 'q34_wfa_preference', 'q35_wfa_start_date', 'q36_change_departure', 'q37_wfa_after_date', 'q38_change_return']
        : ['q32_cancel_reason', 'q33_wfa_perception'],
      7: getValue('q39_travel_2025') === 'ya'
        ? ['q39_travel_2025', 'q40_service_perception', 'q42_reward_preference', 'q43_survey_media', 'q44_willing_respondent', 'q45_whatsapp']
        : ['q39_travel_2025', 'q42_reward_preference', 'q43_survey_media', 'q44_willing_respondent', 'q45_whatsapp'],
    };

    const required = requiredQuestions[currentSection] || [];
    const missing = required.filter(q => !answers[q] || answers[q] === '');

    if (missing.length > 0) {
      toast.error('Mohon lengkapi semua pertanyaan yang wajib diisi sebelum melanjutkan.');
      return false;
    }

    return true;
  };

 const handleNext = async () => {
    // Validate before proceeding
    if (!validateSection()) {
      return;
    }

  await saveAnswers();

  // Handle conditional jumping
  let nextSection = currentSection + 1;

  // Section 0 (Karakteristik) - Check age
  if (currentSection === 0 && answers.q1_age === 'a') {
   toast.error('Maaf, survei ini hanya untuk usia 15 tahun ke atas.');
   return;
  }

  // Section 1 - Check travel plan
  if (currentSection === 0 && answers.q7_travel_plan === 'tidak') {
   nextSection = 1; // Go to "Yang Tidak Melakukan Perjalanan"
  } else if (currentSection === 0 && answers.q7_travel_plan === 'ya') {
   nextSection = 2; // Go to "Yang Melakukan Perjalanan"
  }

  // After "Yang Tidak Melakukan Perjalanan" - jump to Section 8
  if (currentSection === 1) {
   nextSection = 7; // Bagian 8
  }

  // Section 3 (After choosing transportation) - routing based on transport type
  if (currentSection === 2) {
   const transport = answers.q17_transportation;
   if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(transport)) {
    nextSection = 4; // Public transport - go to Section 5
   } else if (['m', 'n'].includes(transport)) {
    nextSection = 3; // Motor/Sepeda - go to Section 4
   } else if (['h', 'i', 'j', 'k', 'l'].includes(transport)) {
    nextSection = 3; // Private vehicle - go to Section 4
   } else {
    nextSection = 5; // Mudik gratis/other - go to Section 6
   }
  }

  // After Section 4 (Private transport questions) - go to Section 6
  if (currentSection === 3) {
   nextSection = 5;
  }

  // After Section 5 (Public transport questions) - go to Section 6
  if (currentSection === 4) {
   nextSection = 5;
  }

  if (nextSection >= TOTAL_SECTIONS) {
   router.push('/survey/complete');
   return;
  }

  setCurrentSection(nextSection);
  window.scrollTo(0, 0);
 };

 const handlePrevious = () => {
  if (currentSection > 0) {
    let prevSection = currentSection - 1;
    const travelPlan = answers.q7_travel_plan;

    // If user travels (ya), skip Section 1 when going back
    // From Section 2 → go back to Section 0
    if (travelPlan === 'ya' && prevSection === 1) {
      prevSection = 0;
    }

    // If user doesn't travel (tidak), skip Sections 2-6 when going back
    // From Section 7 → go back to Section 1
    if (travelPlan === 'tidak' && prevSection >= 2 && prevSection <= 6) {
      prevSection = 1;
    }

    setCurrentSection(prevSection);
    window.scrollTo(0, 0);
  }
 };

 const getValue = (key: string) => answers[key] || '';

 if (!responseId) {
  return null;
 }

 return (
  <main className="min-h-screen bg-gray-50 pb-24">
   {/* Header */}
   <div className="bg-primary-700 text-white py-4 sticky top-0 z-50">
    <div className="max-w-3xl mx-auto px-4">
     <h1 className="text-lg font-semibold text-center">
      Survei Angkutan Lebaran 2026
     </h1>
     <div className="mt-3">
      <ProgressBar current={currentSection + 1} total={TOTAL_SECTIONS} />
     </div>
    </div>
   </div>

   {/* Auto-save indicator */}
   {isSaving && (
    <div className="fixed top-20 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
     Menyimpan...
    </div>
   )}

   <div className="max-w-3xl mx-auto px-4 py-6">
    {/* Section 0: Karakteristik Responden */}
    {currentSection === 0 && (
     <div className="space-y-6">
      <div className="bg-primary-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-primary-800">
        BAGIAN 1: Karakteristik Responden
       </h2>
      </div>

      <QuestionCard number={1} title="Berapa usia Anda saat ini?">
       <RadioGroup
        options={surveyData.ageOptions}
        value={getValue('q1_age')}
        onChange={(v) => setAnswer('q1_age', v)}
        name="q1_age"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard number={2} title="Jenis kelamin:">
       <RadioGroup
        options={surveyData.genderOptions}
        value={getValue('q2_gender')}
        onChange={(v) => setAnswer('q2_gender', v)}
        name="q2_gender"
       />
      </QuestionCard>

      <QuestionCard number={3} title="Pendidikan terakhir Anda?">
       <RadioGroup
        options={surveyData.educationOptions}
        value={getValue('q3_education')}
        onChange={(v) => setAnswer('q3_education', v)}
        name="q3_education"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard number={4} title="Status pekerjaan Anda saat ini?">
       <RadioGroup
        options={surveyData.jobOptions}
        value={getValue('q4_job')}
        onChange={(v) => setAnswer('q4_job', v)}
        name="q4_job"
       />
      </QuestionCard>

      <QuestionCard number={5} title="Berapa penghasilan per bulan saat ini?">
       <RadioGroup
        options={surveyData.incomeOptions}
        value={getValue('q5_income')}
        onChange={(v) => setAnswer('q5_income', v)}
        name="q5_income"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={6}
       title="Daerah tempat tinggal/domisili Anda saat ini?"
      >
       <SelectField
        options={surveyData.provinces}
        value={getValue('q6_province')}
        onChange={(v) => setAnswer('q6_province', v)}
        placeholder="Pilih Provinsi..."
       />
      </QuestionCard>

      <QuestionCard
       number={7}
       title="Pada masa lebaran 2026 (Idul Fitri 1447 H) nanti, apakah Anda berencana akan melakukan perjalanan ke luar kota untuk mudik/liburan?"
      >
       <RadioGroup
        options={surveyData.travelPlanOptions}
        value={getValue('q7_travel_plan')}
        onChange={(v) => setAnswer('q7_travel_plan', v)}
        name="q7_travel_plan"
       />
      </QuestionCard>
     </div>
    )}

    {/* Section 1: Yang Tidak Melakukan Perjalanan */}
    {currentSection === 1 && (
     <div className="space-y-6">
      <div className="bg-orange-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-orange-800">
        BAGIAN 2: Yang Tidak Melakukan Perjalanan
       </h2>
      </div>

      <QuestionCard
       number={8}
       title="Alasan tidak melakukan perjalanan ke luar kota?"
      >
       <RadioGroup
        options={surveyData.noTravelReasonOptions}
        value={getValue('q8_no_travel_reason')}
        onChange={(v) => setAnswer('q8_no_travel_reason', v)}
        name="q8_no_travel_reason"
       />
      </QuestionCard>
     </div>
    )}

    {/* Section 2: Yang Melakukan Perjalanan */}
    {currentSection === 2 && (
     <div className="space-y-6">
      <div className="bg-green-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-green-800">
        BAGIAN 3: Yang Melakukan Perjalanan
       </h2>
      </div>

      <QuestionCard
       number={9}
       title="Berapa jumlah orang yang melakukan perjalanan ke luar kota termasuk Anda?"
      >
       <RadioGroup
        options={surveyData.travelGroupOptions}
        value={getValue('q9_travel_group')}
        onChange={(v) => setAnswer('q9_travel_group', v)}
        name="q9_travel_group"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={10}
       title="Alasan melakukan perjalanan ke luar kota pada masa Lebaran Tahun 2026?"
      >
       <RadioGroup
        options={surveyData.travelReasonOptions}
        value={getValue('q10_travel_reason')}
        onChange={(v) => setAnswer('q10_travel_reason', v)}
        name="q10_travel_reason"
       />
      </QuestionCard>

      <QuestionCard number={11} title="Daerah tujuan perjalanan Anda?">
       <SelectField
        options={surveyData.provincesWithAbroad}
        value={getValue('q11_destination_province')}
        onChange={(v) => setAnswer('q11_destination_province', v)}
        placeholder="Pilih Provinsi Tujuan..."
       />
      </QuestionCard>

      <QuestionCard
       number={12}
       title="Bila Anda melakukan perjalanan ke luar kota, kapan Anda merencanakan pergi?"
      >
       <RadioGroup
        options={surveyData.departureDateOptions}
        value={getValue('q12_departure_date')}
        onChange={(v) => setAnswer('q12_departure_date', v)}
        name="q12_departure_date"
       />
      </QuestionCard>

      <QuestionCard
       number={13}
       title="Bila Anda melakukan perjalanan, pukul berapa akan berangkat?"
      >
       <RadioGroup
        options={surveyData.departureTimeOptions}
        value={getValue('q13_departure_time')}
        onChange={(v) => setAnswer('q13_departure_time', v)}
        name="q13_departure_time"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={14}
       title="Berapa lama biasanya Anda berada di kota/kab lokasi tujuan pada saat Lebaran 2026?"
      >
       <RadioGroup
        options={surveyData.stayDurationOptions}
        value={getValue('q14_stay_duration')}
        onChange={(v) => setAnswer('q14_stay_duration', v)}
        name="q14_stay_duration"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={15}
       title="Perkiraan total dana yang akan dihabiskan untuk liburan lebaran di luar kota? (di luar biaya transportasi)"
      >
       <RadioGroup
        options={surveyData.budgetOptions}
        value={getValue('q15_budget')}
        onChange={(v) => setAnswer('q15_budget', v)}
        name="q15_budget"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={16}
       title="Apa pertimbangan utama Anda dalam memilih moda utama yang akan digunakan untuk perjalanan lebaran?"
      >
       <RadioGroup
        options={surveyData.transportConsiderationOptions}
        value={getValue('q16_transport_consideration')}
        onChange={(v) => setAnswer('q16_transport_consideration', v)}
        name="q16_transport_consideration"
       />
      </QuestionCard>

      <QuestionCard
       number={17}
       title="Berdasarkan pertimbangan tersebut, transportasi utama apa yang akan Anda gunakan untuk perjalanan ke luar kota pada masa Lebaran?"
      >
       <RadioGroup
        options={surveyData.mainTransportOptions}
        value={getValue('q17_transportation')}
        onChange={(v) => setAnswer('q17_transportation', v)}
        name="q17_transportation"
        columns={2}
       />
      </QuestionCard>
     </div>
    )}

    {/* Section 3: Angkutan Pribadi/Sewa */}
    {currentSection === 3 && (
     <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-blue-800">
        BAGIAN 4: Pertanyaan Untuk Yang Menggunakan Angkutan Pribadi/Sewa
       </h2>
      </div>

      {['m', 'n'].includes(getValue('q17_transportation')) ? (
       <QuestionCard
        number={18}
        title="Mana jalur utama yang akan Anda lewati?"
       >
        <RadioGroup
         options={surveyData.routeOptions}
         value={getValue('q18_route')}
         onChange={(v) => setAnswer('q18_route', v)}
         name="q18_route"
        />
       </QuestionCard>
      ) : (
       <>
        <QuestionCard
         number={19}
         title="Mana jalur utama yang akan Anda lewati?"
        >
         <RadioGroup
          options={surveyData.routeWithTollOptions}
          value={getValue('q19_route_toll')}
          onChange={(v) => setAnswer('q19_route_toll', v)}
          name="q19_route_toll"
         />
        </QuestionCard>

        {getValue('q19_route_toll') === 'a' && (
         <>
          <QuestionCard
           number={0}
           title="Apabila diberlakukan discount tarif tol apakah anda akan mengubah waktu jadwal perjalanan?"
          >
           <RadioGroup
            options={surveyData.yesNoOptions}
            value={getValue('q19a_toll_discount')}
            onChange={(v) => setAnswer('q19a_toll_discount', v)}
            name="q19a_toll_discount"
           />
          </QuestionCard>

          <QuestionCard
           number={0}
           title="Apabila diberlakukan rekayasa lalu lintas (seperti contra flow, one way dan sebagainya) apakah anda akan mengubah waktu jadwal perjalanan?"
          >
           <RadioGroup
            options={surveyData.yesNoOptions}
            value={getValue('q19b_traffic_engineering')}
            onChange={(v) => setAnswer('q19b_traffic_engineering', v)}
            name="q19b_traffic_engineering"
           />
          </QuestionCard>

          <QuestionCard
           number={0}
           title="Apakah anda berencana melakukan istirahat di rest area jalan tol?"
          >
           <RadioGroup
            options={surveyData.yesNoOptions}
            value={getValue('q19c_rest_area')}
            onChange={(v) => setAnswer('q19c_rest_area', v)}
            name="q19c_rest_area"
           />
           {getValue('q19c_rest_area') === 'ya' && (
            <div className="mt-4">
             <TextField
              value={getValue('q19c_rest_area_km')}
              onChange={(v) => setAnswer('q19c_rest_area_km', v)}
              placeholder="Rest area KM berapa? (contoh: KM 57)"
             />
            </div>
           )}
          </QuestionCard>

          <QuestionCard
           number={0}
           title="Dari media mana, anda mengetahui informasi terkait jalan tol?"
          >
           <RadioGroup
            options={surveyData.tollInfoMediaOptions}
            value={getValue('q19d_toll_info_media')}
            onChange={(v) => setAnswer('q19d_toll_info_media', v)}
            name="q19d_toll_info_media"
            columns={2}
           />
          </QuestionCard>
         </>
        )}
       </>
      )}

      <QuestionCard
       number={20}
       title="Dalam melakukan perjalanan apakah Anda melakukan istirahat?"
      >
       <RadioGroup
        options={surveyData.restIntervalOptions}
        value={getValue('q20_rest_interval')}
        onChange={(v) => setAnswer('q20_rest_interval', v)}
        name="q20_rest_interval"
       />
      </QuestionCard>

      <QuestionCard
       number={21}
       title="Berapa lama biasanya Anda beristirahat di rest area?"
      >
       <RadioGroup
        options={surveyData.restDurationOptions}
        value={getValue('q21_rest_duration')}
        onChange={(v) => setAnswer('q21_rest_duration', v)}
        name="q21_rest_duration"
       />
      </QuestionCard>

      <QuestionCard
       number={22}
       title="Perkiraan biaya transportasi pulang dan pergi (Biaya BBM dan tol)"
      >
       <RadioGroup
        options={surveyData.transportCostOptions}
        value={getValue('q22_transport_cost')}
        onChange={(v) => setAnswer('q22_transport_cost', v)}
        name="q22_transport_cost"
        columns={2}
       />
      </QuestionCard>
     </div>
    )}

    {/* Section 4: Angkutan Umum */}
    {currentSection === 4 && (
     <div className="space-y-6">
      <div className="bg-purple-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-purple-800">
        BAGIAN 5: Pertanyaan Untuk Yang Menggunakan Angkutan Umum
       </h2>
      </div>

      <QuestionCard
       number={23}
       title="Sebelum naik transportasi utama, angkutan apa yang Anda gunakan untuk menuju ke terminal/stasiun/pelabuhan/bandara?"
      >
       <RadioGroup
        options={surveyData.feederTransportOptions}
        value={getValue('q23_feeder_transport')}
        onChange={(v) => setAnswer('q23_feeder_transport', v)}
        name="q23_feeder_transport"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={24}
       title="Setelah turun dari transportasi utama, angkutan lanjutan apa yang Anda gunakan untuk sampai ke lokasi tujuan akhir?"
      >
       <RadioGroup
        options={surveyData.feederTransportOptions}
        value={getValue('q24_last_mile_transport')}
        onChange={(v) => setAnswer('q24_last_mile_transport', v)}
        name="q24_last_mile_transport"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard number={25} title="Kapan anda membeli tiket?">
       <RadioGroup
        options={surveyData.ticketPurchaseOptions}
        value={getValue('q25_ticket_purchase')}
        onChange={(v) => setAnswer('q25_ticket_purchase', v)}
        name="q25_ticket_purchase"
       />
      </QuestionCard>

      <QuestionCard
       number={26}
       title="Jika tidak mendapatkan tiket, moda alternatif apa yang akan Anda gunakan untuk melakukan perjalanan?"
      >
       <RadioGroup
        options={[
         ...surveyData.mainTransportOptions,
         { value: 'o_cancel', label: 'Tidak jadi bepergian' },
        ]}
        value={getValue('q26_alternative_transport')}
        onChange={(v) => setAnswer('q26_alternative_transport', v)}
        name="q26_alternative_transport"
        columns={2}
       />
      </QuestionCard>
     </div>
    )}

    {/* Section 5: Pulang/Kembali */}
    {currentSection === 5 && (
     <div className="space-y-6">
      <div className="bg-teal-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-teal-800">
        BAGIAN 6: Pulang/Kembali
       </h2>
      </div>

      <QuestionCard
       number={27}
       title="Bila Anda memilih melakukan perjalanan pada masa lebaran, kapan Anda merencanakan pulang/kembali?"
      >
       <RadioGroup
        options={surveyData.returnDateOptions}
        value={getValue('q27_return_date')}
        onChange={(v) => setAnswer('q27_return_date', v)}
        name="q27_return_date"
       />
      </QuestionCard>

      <QuestionCard
       number={28}
       title="Pada pukul berapa Anda akan pulang/kembali?"
      >
       <RadioGroup
        options={surveyData.departureTimeOptions}
        value={getValue('q28_return_time')}
        onChange={(v) => setAnswer('q28_return_time', v)}
        name="q28_return_time"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={29}
       title="Apakah Anda menggunakan moda transportasi yang sama dengan ketika Anda berangkat?"
      >
       <RadioGroup
        options={surveyData.yesNoOptions}
        value={getValue('q29_same_transport')}
        onChange={(v) => setAnswer('q29_same_transport', v)}
        name="q29_same_transport"
       />
      </QuestionCard>

      {getValue('q29_same_transport') === 'tidak' && (
       <QuestionCard
        number={30}
        title="Transportasi utama apa yang akan Anda gunakan untuk perjalanan pulang/kembali dari libur lebaran?"
       >
        <RadioGroup
         options={surveyData.mainTransportOptions}
         value={getValue('q30_return_transport')}
         onChange={(v) => setAnswer('q30_return_transport', v)}
         name="q30_return_transport"
         columns={2}
        />
       </QuestionCard>
      )}

      <QuestionCard
       number={31}
       title="Apakah ada rencana menambah orang pada saat balik kembali untuk ikut ke kota/daerah asal dari kampung halaman?"
      >
       <RadioGroup
        options={surveyData.additionalPeopleOptions}
        value={getValue('q31_additional_people')}
        onChange={(v) => setAnswer('q31_additional_people', v)}
        name="q31_additional_people"
       />
      </QuestionCard>
     </div>
    )}

    {/* Section 6: Evaluasi dan Faktor */}
    {currentSection === 6 && (
     <div className="space-y-6">
      <div className="bg-amber-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-amber-800">
        BAGIAN 7: Evaluasi dan Faktor yang Memengaruhi
       </h2>
      </div>

      <QuestionCard
       number={32}
       title="Hal apa yang paling memengaruhi Anda membatalkan perjalanan pada saat libur Lebaran 2026?"
      >
       <RadioGroup
        options={surveyData.cancelReasonOptions}
        value={getValue('q32_cancel_reason')}
        onChange={(v) => setAnswer('q32_cancel_reason', v)}
        name="q32_cancel_reason"
       />
      </QuestionCard>

      <QuestionCard
       number={33}
       title="Dalam rangka pengendalian pergerakan masyarakat pada masa lebaran, guna meningkatkan kelancaran lalu lintas angkutan, bagaimana persepsi anda apabila pemerintah memberlakukan WFA atau cuti bersama?"
      >
       <RadioGroup
        options={[
         { value: 'setuju', label: 'Setuju' },
         { value: 'tidak_setuju', label: 'Tidak Setuju' },
        ]}
        value={getValue('q33_wfa_perception')}
        onChange={(v) => setAnswer('q33_wfa_perception', v)}
        name="q33_wfa_perception"
       />
      </QuestionCard>

      {getValue('q33_wfa_perception') === 'setuju' && (
       <>
        <QuestionCard
         number={34}
         title="Apabila ada kebijakan pemerintah untuk mengendalikan pergerakan masyarakat, agar tidak terjadi kepadatan transportasi, mana yang Anda pilih?"
        >
         <RadioGroup
          options={surveyData.wfaPreferenceOptions}
          value={getValue('q34_wfa_preference')}
          onChange={(v) => setAnswer('q34_wfa_preference', v)}
          name="q34_wfa_preference"
         />
        </QuestionCard>

        <QuestionCard
         number={35}
         title="Apabila akan diberlakukan cuti bersama atau WFA sebelum lebaran, tanggal berapa pilihan anda?"
        >
         <RadioGroup
          options={surveyData.wfaStartDateOptions}
          value={getValue('q35_wfa_start_date')}
          onChange={(v) => setAnswer('q35_wfa_start_date', v)}
          name="q35_wfa_start_date"
         />
        </QuestionCard>

        <QuestionCard
         number={36}
         title="Apabila diberlakukan WFA sebelum lebaran pada hari dan tanggal pilihan Anda tersebut, apakah Anda akan mengubah hari keberangkatan?"
        >
         <RadioGroup
          options={surveyData.yesNoOptions}
          value={getValue('q36_change_departure')}
          onChange={(v) => setAnswer('q36_change_departure', v)}
          name="q36_change_departure"
         />
        </QuestionCard>

        <QuestionCard
         number={37}
         title="Apabila akan diberlakukan WFA atau cuti bersama setelah lebaran tanggal berapa pilihan anda?"
        >
         <RadioGroup
          options={surveyData.wfaAfterDateOptions}
          value={getValue('q37_wfa_after_date')}
          onChange={(v) => setAnswer('q37_wfa_after_date', v)}
          name="q37_wfa_after_date"
         />
        </QuestionCard>

        <QuestionCard
         number={38}
         title="Apabila diberlakukan WFA setelah lebaran pada hari dan tanggal pilihan Anda tersebut, apakah Anda akan mengubah hari kepulangan?"
        >
         <RadioGroup
          options={surveyData.yesNoOptions}
          value={getValue('q38_change_return')}
          onChange={(v) => setAnswer('q38_change_return', v)}
          name="q38_change_return"
         />
        </QuestionCard>
       </>
      )}
     </div>
    )}

    {/* Section 7: Pertanyaan untuk semua responden */}
    {currentSection === 7 && (
     <div className="space-y-6">
      <div className="bg-rose-50 rounded-xl p-4 mb-6">
       <h2 className="text-xl font-bold text-rose-800">
        BAGIAN 8: Pertanyaan untuk Semua Responden
       </h2>
      </div>

      <QuestionCard
       number={39}
       title="Pada masa liburan Lebaran 2025 yang lalu, apakah Anda melakukan perjalanan ke luar kota?"
      >
       <RadioGroup
        options={surveyData.yesNoOptions}
        value={getValue('q39_travel_2025')}
        onChange={(v) => setAnswer('q39_travel_2025', v)}
        name="q39_travel_2025"
       />
      </QuestionCard>

      {getValue('q39_travel_2025') === 'ya' && (
       <QuestionCard
        number={40}
        title="Bagaimana Persepsi Anda tentang pelayanan Angkutan Lebaran 2025?"
       >
        <RadioGroup
         options={surveyData.servicePerceptionOptions}
         value={getValue('q40_service_perception')}
         onChange={(v) => setAnswer('q40_service_perception', v)}
         name="q40_service_perception"
        />
       </QuestionCard>
      )}

      <QuestionCard
       number={41}
       title="Apa Saran Anda untuk pemerintah dalam penyelenggaraan angkutan Lebaran 2026 ini?"
       required={false}
      >
       <TextField
        value={getValue('q41_suggestion')}
        onChange={(v) => setAnswer('q41_suggestion', v)}
        placeholder="Tuliskan saran Anda..."
        multiline
        rows={4}
       />
      </QuestionCard>

      <QuestionCard
       number={42}
       title="Apabila Anda terpilih mendapat reward, dalam bentuk apa yang Anda inginkan?"
      >
       <RadioGroup
        options={surveyData.rewardOptions}
        value={getValue('q42_reward_preference')}
        onChange={(v) => setAnswer('q42_reward_preference', v)}
        name="q42_reward_preference"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={43}
       title="Lewat media apa, Anda mengetahui link survey ini?"
      >
       <RadioGroup
        options={surveyData.surveyMediaOptions}
        value={getValue('q43_survey_media')}
        onChange={(v) => setAnswer('q43_survey_media', v)}
        name="q43_survey_media"
        columns={2}
       />
      </QuestionCard>

      <QuestionCard
       number={44}
       title="Jika Kementerian Perhubungan mengadakan survei sebagaimana di atas, apakah anda bersedia menjadi responden?"
      >
       <RadioGroup
        options={surveyData.yesNoOptions}
        value={getValue('q44_willing_respondent')}
        onChange={(v) => setAnswer('q44_willing_respondent', v)}
        name="q44_willing_respondent"
       />
      </QuestionCard>

      <QuestionCard
       number={45}
       title="Nomor WhatsApp (WA)"
       subtitle="Untuk keperluan hadiah dan informasi lanjutan"
      >
       <TextField
        value={getValue('q45_whatsapp')}
        onChange={(v) => setAnswer('q45_whatsapp', v)}
        placeholder="Contoh: 08123456789"
        type="tel"
       />
      </QuestionCard>
     </div>
    )}

    {/* Navigation Buttons */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
     <div className="max-w-3xl mx-auto flex gap-4">
      {currentSection > 0 && (
       <button onClick={handlePrevious} className="btn-secondary flex-1">
        ← Sebelumnya
       </button>
      )}
      <button
       onClick={handleNext}
       disabled={isLoading}
       className="btn-primary flex-1"
      >
       {isLoading ? (
        <span className="flex items-center justify-center gap-2">
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
           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
         </svg>
         Menyimpan...
        </span>
       ) : currentSection >= TOTAL_SECTIONS - 2 ? (
        'Selesai & Kirim →'
       ) : (
        'Selanjutnya →'
       )}
      </button>
     </div>
    </div>
   </div>
  </main>
 );
}
