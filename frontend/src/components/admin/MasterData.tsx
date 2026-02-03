'use client';

import { useState, useEffect, useMemo } from 'react';
import { provincesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Province {
  id: number;
  name: string;
}

export default function MasterData() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setIsLoading(true);
    try {
      const result = await provincesApi.getAll();
      setProvinces(result.data || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Gagal mengambil data provinsi');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProvinces = useMemo(() => {
    if (!searchTerm) return provinces;
    return provinces.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [provinces, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">🗂️ Data Master Provinsi</h3>
            <p className="text-sm text-gray-500 mt-1">Daftar provinsi yang tersedia dalam survey</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {provinces.length} provinsi
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Cari provinsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Provinces Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProvinces.map((province) => (
              <div
                key={province.id}
                className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    {province.id}
                  </div>
                  <span className="text-sm text-gray-700 font-medium truncate">{province.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProvinces.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">🔍</p>
            <p>Tidak ada provinsi ditemukan</p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Tentang Data Master</h4>
            <p className="text-sm text-blue-700 mt-1">
              Data provinsi ini digunakan dalam pertanyaan survey untuk menentukan asal dan tujuan responden.
              Data bersumber dari database internal dan sudah mencakup seluruh provinsi di Indonesia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
