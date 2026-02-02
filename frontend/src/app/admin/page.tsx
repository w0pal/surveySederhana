'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Response {
 id: string;
 whatsapp_number: string;
 created_at: string;
 is_complete: number;
}

interface Statistics {
 totalResponses: number;
 completedResponses: number;
 responsesByDate: Array<{ date: string; count: number }>;
 ageDistribution: Array<{ answer_value: string; count: number }>;
 genderDistribution: Array<{ answer_value: string; count: number }>;
 travelPlanDistribution: Array<{ answer_value: string; count: number }>;
}

export default function AdminPage() {
 const [adminKey, setAdminKey] = useState('');
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [responses, setResponses] = useState<Response[]>([]);
 const [statistics, setStatistics] = useState<Statistics | null>(null);
 const [pagination, setPagination] = useState({
  page: 1,
  totalPages: 1,
  total: 0,
 });
 const [isLoading, setIsLoading] = useState(false);
 const [activeTab, setActiveTab] = useState<'responses' | 'statistics'>(
  'responses',
 );
 const [selectedResponse, setSelectedResponse] = useState<any>(null);

 const fetchResponses = useCallback(
  async (page = 1) => {
   setIsLoading(true);
   try {
    const result = await adminApi.getResponses(page, 20, adminKey, {
     is_complete: 1,
    });
    setResponses(result.data);
    setPagination(result.pagination);
   } catch (error: any) {
    if (error.response?.status === 401) {
     toast.error('Kunci admin tidak valid');
     setIsAuthenticated(false);
    } else {
     toast.error('Gagal mengambil data');
    }
   } finally {
    setIsLoading(false);
   }
  },
  [adminKey],
 );

 const fetchStatistics = useCallback(async () => {
  try {
   const result = await adminApi.getStatistics(adminKey);
   setStatistics(result.data);
  } catch (error) {
   console.error('Error fetching statistics:', error);
  }
 }, [adminKey]);

 useEffect(() => {
  if (isAuthenticated) {
   fetchResponses();
   fetchStatistics();
  }
 }, [isAuthenticated, fetchResponses, fetchStatistics]);

 const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  if (adminKey.trim()) {
   setIsAuthenticated(true);
  }
 };

 const handleViewResponse = async (responseId: string) => {
  try {
   const result = await adminApi.getResponse(responseId, adminKey);
   setSelectedResponse(result.data);
  } catch (error) {
   toast.error('Gagal mengambil detail respons');
  }
 };

 const handleDeleteResponse = async (responseId: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus respons ini?')) return;

  try {
   await adminApi.deleteResponse(responseId, adminKey);
   toast.success('Respons berhasil dihapus');
   fetchResponses(pagination.page);
   fetchStatistics();
  } catch (error) {
   toast.error('Gagal menghapus respons');
  }
 };

 const handleExportCsv = async () => {
  try {
   const blob = await adminApi.exportCsv(adminKey);
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
   document.body.appendChild(a);
   a.click();
   window.URL.revokeObjectURL(url);
   document.body.removeChild(a);
   toast.success('Data berhasil di-export');
  } catch (error) {
   toast.error('Gagal export data');
  }
 };

 if (!isAuthenticated) {
  return (
   <main className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
     <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
      🔐 Admin Panel
     </h1>
     <form onSubmit={handleLogin}>
      <div className="mb-4">
       <label className="block text-sm font-medium text-gray-700 mb-2">
        Admin Key
       </label>
       <input
        type="password"
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
        className="input-field"
        placeholder="Masukkan admin key..."
       />
      </div>
      <button type="submit" className="btn-primary w-full">
       Login
      </button>
     </form>
    </div>
   </main>
  );
 }

 return (
  <main className="min-h-screen bg-gray-100">
   {/* Header */}
   <div className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 py-4">
     <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">
       📊 Admin Panel - Survey Lebaran 2026
      </h1>
      <div className="flex gap-4">
       <button onClick={handleExportCsv} className="btn-secondary text-sm">
        📥 Export CSV
       </button>
       <button
        onClick={() => setIsAuthenticated(false)}
        className="btn-danger text-sm"
       >
        Logout
       </button>
      </div>
     </div>
    </div>
   </div>

   <div className="max-w-7xl mx-auto px-4 py-6">
    {/* Statistics Cards */}
    {statistics && (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-6 shadow">
       <p className="text-sm text-gray-500">Total Respons</p>
       <p className="text-3xl font-bold text-primary-600">
        {statistics.totalResponses}
       </p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow">
       <p className="text-sm text-gray-500">Respons Lengkap</p>
       <p className="text-3xl font-bold text-green-600">
        {statistics.completedResponses}
       </p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow">
       <p className="text-sm text-gray-500">Completion Rate</p>
       <p className="text-3xl font-bold text-blue-600">
        {statistics.totalResponses > 0
         ? Math.round(
            (statistics.completedResponses / statistics.totalResponses) * 100,
           )
         : 0}
        %
       </p>
      </div>
     </div>
    )}

    {/* Tabs */}
    <div className="bg-white rounded-xl shadow overflow-hidden">
     <div className="border-b border-gray-200">
      <nav className="flex">
       <button
        onClick={() => setActiveTab('responses')}
        className={`px-6 py-4 text-sm font-medium ${
         activeTab === 'responses'
          ? 'border-b-2 border-primary-500 text-primary-600'
          : 'text-gray-500 hover:text-gray-700'
        }`}
       >
        📋 Daftar Respons
       </button>
       <button
        onClick={() => setActiveTab('statistics')}
        className={`px-6 py-4 text-sm font-medium ${
         activeTab === 'statistics'
          ? 'border-b-2 border-primary-500 text-primary-600'
          : 'text-gray-500 hover:text-gray-700'
        }`}
       >
        📈 Statistik
       </button>
      </nav>
     </div>

     {/* Responses Tab */}
     {activeTab === 'responses' && (
      <div className="p-6">
       {isLoading ? (
        <div className="text-center py-12">
         <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
         <p className="text-gray-500 mt-4">Memuat data...</p>
        </div>
       ) : (
        <>
         <div className="overflow-x-auto">
          <table className="w-full">
           <thead>
            <tr className="bg-gray-50">
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
             </th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              WhatsApp
             </th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tanggal
             </th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
             </th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Aksi
             </th>
            </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
            {responses.map((response) => (
             <tr key={response.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono text-gray-600">
               {response.id.substring(0, 8)}...
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
               {response.whatsapp_number || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
               {new Date(response.created_at).toLocaleString('id-ID')}
              </td>
              <td className="px-4 py-3">
               <span
                className={`px-2 py-1 text-xs rounded-full ${
                 response.is_complete
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                }`}
               >
                {response.is_complete ? 'Lengkap' : 'Belum Lengkap'}
               </span>
              </td>
              <td className="px-4 py-3">
               <div className="flex gap-2">
                <button
                 onClick={() => handleViewResponse(response.id)}
                 className="text-primary-600 hover:text-primary-800 text-sm"
                >
                 Lihat
                </button>
                <button
                 onClick={() => handleDeleteResponse(response.id)}
                 className="text-red-600 hover:text-red-800 text-sm"
                >
                 Hapus
                </button>
               </div>
              </td>
             </tr>
            ))}
           </tbody>
          </table>
         </div>

         {/* Pagination */}
         <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
           Menampilkan {responses.length} dari {pagination.total} respons
          </p>
          <div className="flex gap-2">
           <button
            onClick={() => fetchResponses(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="btn-secondary text-sm disabled:opacity-50"
           >
            ← Prev
           </button>
           <span className="px-4 py-2 text-sm text-gray-600">
            {pagination.page} / {pagination.totalPages}
           </span>
           <button
            onClick={() => fetchResponses(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="btn-secondary text-sm disabled:opacity-50"
           >
            Next →
           </button>
          </div>
         </div>
        </>
       )}
      </div>
     )}

     {/* Statistics Tab */}
     {activeTab === 'statistics' && statistics && (
      <div className="p-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Responses by Date */}
        <div className="bg-gray-50 rounded-lg p-4">
         <h3 className="font-semibold text-gray-800 mb-4">Respons per Hari</h3>
         <div className="space-y-2">
          {statistics.responsesByDate.slice(0, 7).map((item) => (
           <div key={item.date} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{item.date}</span>
            <div className="flex items-center gap-2">
             <div
              className="h-4 bg-primary-500 rounded"
              style={{ width: `${Math.max(20, item.count * 3)}px` }}
             />
             <span className="text-sm font-medium">{item.count}</span>
            </div>
           </div>
          ))}
         </div>
        </div>

        {/* Travel Plan Distribution */}
        <div className="bg-gray-50 rounded-lg p-4">
         <h3 className="font-semibold text-gray-800 mb-4">
          Rencana Perjalanan
         </h3>
         <div className="space-y-2">
          {statistics.travelPlanDistribution.map((item) => (
           <div
            key={item.answer_value}
            className="flex justify-between items-center"
           >
            <span className="text-sm text-gray-600">
             {item.answer_value === 'ya'
              ? 'Ya, akan bepergian'
              : 'Tidak bepergian'}
            </span>
            <span className="text-sm font-medium">{item.count}</span>
           </div>
          ))}
         </div>
        </div>
       </div>
      </div>
     )}
    </div>
   </div>

   {/* Response Detail Modal */}
   {selectedResponse && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
     <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
       <h2 className="text-lg font-semibold">Detail Respons</h2>
       <button
        onClick={() => setSelectedResponse(null)}
        className="text-gray-500 hover:text-gray-700"
       >
        ✕
       </button>
      </div>
      <div className="p-4">
       <div className="mb-4">
        <p className="text-sm text-gray-500">ID</p>
        <p className="font-mono">{selectedResponse.id}</p>
       </div>
       <div className="mb-4">
        <p className="text-sm text-gray-500">WhatsApp</p>
        <p>{selectedResponse.whatsapp_number || '-'}</p>
       </div>
       <div className="mb-4">
        <p className="text-sm text-gray-500">Tanggal</p>
        <p>{new Date(selectedResponse.created_at).toLocaleString('id-ID')}</p>
       </div>
       <div>
        <p className="text-sm text-gray-500 mb-2">Jawaban</p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
         {Object.entries(selectedResponse.answers || {}).map(
          ([key, value]: [string, any]) => (
           <div key={key} className="flex justify-between text-sm">
            <span className="text-gray-600">{key}</span>
            <span className="font-medium">{value?.value || value || '-'}</span>
           </div>
          ),
         )}
        </div>
       </div>
      </div>
     </div>
    </div>
   )}
  </main>
 );
}
