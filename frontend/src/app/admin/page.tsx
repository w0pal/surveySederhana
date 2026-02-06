'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import GISMap from '@/components/admin/GISMap';
import AppSettings from '@/components/admin/AppSettings';
import AccountSettings from '@/components/admin/AccountSettings';
import MasterData from '@/components/admin/MasterData';

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
 provinceDistribution?: Array<{ answer_value: string; count: number }>;
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
 const [activeMenu, setActiveMenu] = useState('dashboard');
 const [selectedResponse, setSelectedResponse] = useState<any>(null);
 const [appSettings, setAppSettings] = useState<any>({});

 const fetchResponses = useCallback(
  async (page = 1) => {
   setIsLoading(true);
   try {
    const result = await adminApi.getResponses(page, 20, adminKey, {});
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

 const fetchAppSettings = useCallback(async () => {
  try {
   const result = await adminApi.getSettings(adminKey);
   setAppSettings(result.data || {});
  } catch (error) {
   console.error('Error fetching app settings:', error);
  }
 }, [adminKey]);

 useEffect(() => {
  if (isAuthenticated) {
   fetchResponses();
   fetchStatistics();
   fetchAppSettings();
  }
 }, [isAuthenticated, fetchResponses, fetchStatistics, fetchAppSettings]);

 const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  if (adminKey.trim()) {
   setIsAuthenticated(true);
  }
 };

 const handleLogout = () => {
  setIsAuthenticated(false);
  setAdminKey('');
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
   <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
     <div className="text-center mb-8">
      <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
       <span className="text-3xl">🔐</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
      <p className="text-slate-400">Masukkan admin key untuk melanjutkan</p>
     </div>
     <form onSubmit={handleLogin}>
      <div className="mb-6">
       <label className="block text-sm font-medium text-slate-300 mb-2">
        Admin Key
       </label>
       <input
        type="password"
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
        placeholder="Masukkan admin key..."
       />
      </div>
      <button 
       type="submit" 
       className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30"
      >
       Login
      </button>
     </form>
    </div>
   </main>
  );
 }

  return (
   <main className="min-h-screen bg-gray-100 lg:flex">
    {/* Sidebar */}
    <AdminSidebar
     activeMenu={activeMenu}
     onMenuChange={setActiveMenu}
     appName={appSettings.app_name}
     onLogout={handleLogout}
    />

    {/* Main Content */}
    <div className="flex-1 overflow-auto pt-16 lg:pt-0 min-h-screen">
     {/* Top Header - hidden on mobile since we have mobile nav bar */}
     <header className="bg-white shadow-sm lg:sticky lg:top-0 z-10">
      <div className="px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
       <div>
        <h2 className="text-base lg:text-xl font-semibold text-gray-800">
         {activeMenu === 'dashboard' && '📊 Dashboard'}
         {activeMenu === 'responses' && '📋 Daftar Respons'}
         {activeMenu === 'account' && '👤 Pengaturan Akun'}
         {activeMenu === 'app-settings' && '⚙️ Pengaturan Aplikasi'}
         {activeMenu === 'master-data' && '🗂️ Data Master'}
        </h2>
        <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">{appSettings.app_name || 'Survey Lebaran 2026'}</p>
       </div>
       <div className="flex items-center gap-2 lg:gap-4">
        {activeMenu === 'responses' && (
         <button onClick={handleExportCsv} className="btn-secondary text-xs lg:text-sm">
          📥 <span className="hidden sm:inline">Export</span> CSV
         </button>
        )}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
         <span className="w-2 h-2 bg-green-500 rounded-full"></span>
         Admin
        </div>
       </div>
      </div>
     </header>

     <div className="p-3 lg:p-6">
      {/* Dashboard View */}
      {activeMenu === 'dashboard' && (
       <div className="space-y-4 lg:space-y-6">
        {/* Statistics Cards */}
        {statistics && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-primary-500">
           <p className="text-xs text-gray-500 mb-1">Total Respons</p>
           <p className="text-2xl lg:text-3xl font-bold text-gray-800">
            {statistics.totalResponses.toLocaleString()}
           </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
           <p className="text-xs text-gray-500 mb-1">Respons Lengkap</p>
           <p className="text-2xl lg:text-3xl font-bold text-gray-800">
            {statistics.completedResponses.toLocaleString()}
           </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
           <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
           <p className="text-2xl lg:text-3xl font-bold text-gray-800">
            {statistics.totalResponses > 0
             ? Math.round(
                (statistics.completedResponses / statistics.totalResponses) * 100,
               )
             : 0}%
           </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
           <p className="text-xs text-gray-500 mb-1">Provinsi Aktif</p>
           <p className="text-2xl lg:text-3xl font-bold text-gray-800">
            {statistics.provinceDistribution?.length || 0}
           </p>
          </div>
         </div>
        )}

       {/* GIS Map */}
       <GISMap adminKey={adminKey} />

       {/* Statistics Charts */}
       {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Responses by Date */}
         <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold text-gray-800 mb-4">📈 Respons per Hari</h3>
          <div className="space-y-2">
           {statistics.responsesByDate.slice(0, 7).map((item) => (
            <div key={item.date} className="flex justify-between items-center">
             <span className="text-sm text-gray-600">{item.date}</span>
             <div className="flex items-center gap-2">
              <div
               className="h-4 bg-gradient-to-r from-primary-400 to-primary-600 rounded"
               style={{ width: `${Math.max(20, item.count * 3)}px` }}
              />
              <span className="text-sm font-medium w-8">{item.count}</span>
             </div>
            </div>
           ))}
          </div>
         </div>

         {/* Travel Plan Distribution */}
         <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold text-gray-800 mb-4">🚗 Rencana Perjalanan</h3>
          <div className="space-y-3">
           {statistics.travelPlanDistribution.map((item) => (
            <div key={item.answer_value} className="flex justify-between items-center">
             <span className="text-sm text-gray-600">
              {item.answer_value === 'ya' ? '✅ Ya, akan bepergian' : '❌ Tidak bepergian'}
             </span>
             <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {item.count}
             </span>
            </div>
           ))}
          </div>
         </div>
        </div>
       )}
      </div>
     )}

     {/* Responses View */}
     {activeMenu === 'responses' && (
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
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
               <span className={`px-2 py-1 text-xs rounded-full ${
                response.is_complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
               }`}>
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
         <div className="flex items-center justify-between p-4 border-t border-gray-200">
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

     {/* Account Settings View */}
     {activeMenu === 'account' && (
      <AccountSettings adminKey={adminKey} onLogout={handleLogout} />
     )}

     {/* App Settings View */}
     {activeMenu === 'app-settings' && (
      <AppSettings adminKey={adminKey} />
     )}

     {/* Master Data View */}
     {activeMenu === 'master-data' && (
      <MasterData />
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
