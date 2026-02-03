'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AccountSettingsProps {
  adminKey: string;
  onLogout: () => void;
  onAdminKeyChange?: (newKey: string) => void;
}

export default function AccountSettings({ adminKey, onLogout, onAdminKeyChange }: AccountSettingsProps) {
  const [showKey, setShowKey] = useState(false);
  const [newAdminKey, setNewAdminKey] = useState('');
  const [confirmAdminKey, setConfirmAdminKey] = useState('');
  const [isChangingKey, setIsChangingKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(adminKey);
    toast.success('Admin key berhasil disalin');
  };

  const handleChangeAdminKey = async () => {
    if (!newAdminKey.trim()) {
      toast.error('Admin key baru tidak boleh kosong');
      return;
    }
    
    if (newAdminKey.length < 6) {
      toast.error('Admin key minimal 6 karakter');
      return;
    }

    if (newAdminKey !== confirmAdminKey) {
      toast.error('Konfirmasi admin key tidak cocok');
      return;
    }

    setIsSaving(true);
    try {
      await adminApi.updateSettings(adminKey, { admin_key: newAdminKey } as any);
      toast.success('Admin key berhasil diubah! Silakan login ulang.');
      
      // Reset form
      setNewAdminKey('');
      setConfirmAdminKey('');
      setIsChangingKey(false);
      
      // Logout user so they can login with new key
      setTimeout(() => {
        onLogout();
      }, 1500);
    } catch (error) {
      console.error('Error changing admin key:', error);
      toast.error('Gagal mengubah admin key');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">👤 Pengaturan Akun</h3>
        
        <div className="space-y-6">
          {/* Current Session */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sesi Aktif</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Terautentikasi
                </p>
              </div>
              <button
                onClick={onLogout}
                className="btn-danger text-sm"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Current Admin Key Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Admin Key Saat Ini</h4>
            <div className="flex items-center gap-3">
              <input
                type={showKey ? 'text' : 'password'}
                value={adminKey}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="text-gray-500 hover:text-gray-700 text-sm whitespace-nowrap"
              >
                {showKey ? '🙈 Sembunyi' : '👁️ Tampil'}
              </button>
              <button
                onClick={handleCopyKey}
                className="text-primary-600 hover:text-primary-800 text-sm whitespace-nowrap"
              >
                📋 Salin
              </button>
            </div>
          </div>

          {/* Change Admin Key */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">🔐 Ubah Admin Key</h4>
              {!isChangingKey && (
                <button
                  onClick={() => setIsChangingKey(true)}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                >
                  Ubah Key →
                </button>
              )}
            </div>
            
            {isChangingKey ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Admin Key Baru</label>
                  <input
                    type="password"
                    value={newAdminKey}
                    onChange={(e) => setNewAdminKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Minimal 6 karakter..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Konfirmasi Admin Key Baru</label>
                  <input
                    type="password"
                    value={confirmAdminKey}
                    onChange={(e) => setConfirmAdminKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ketik ulang admin key baru..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleChangeAdminKey}
                    disabled={isSaving}
                    className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isSaving ? '⏳ Menyimpan...' : '✅ Simpan'}
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingKey(false);
                      setNewAdminKey('');
                      setConfirmAdminKey('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Klik "Ubah Key" untuk mengganti admin key Anda.
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-sm font-medium text-red-800">Catatan Keamanan</h4>
                <ul className="text-sm text-red-700 mt-1 space-y-1">
                  <li>• Admin key disimpan di database dan bisa diubah dari dashboard ini</li>
                  <li>• Setelah mengubah key, Anda akan diminta login ulang</li>
                  <li>• Pastikan untuk mengingat key baru Anda</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Info Card */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h4 className="text-md font-semibold text-gray-700 mb-4">📊 Informasi Sesi</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Browser</p>
            <p className="text-gray-900 font-medium truncate">
              {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-2).join(' ') : '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Login Time</p>
            <p className="text-gray-900 font-medium">
              {new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
