'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface AppSettingsProps {
  adminKey: string;
}

interface Settings {
  app_name: string;
  app_version: string;
  copyright_text: string;
  copyright_year: string;
  logo_url: string;
}

export default function AppSettings({ adminKey }: AppSettingsProps) {
  const [settings, setSettings] = useState<Settings>({
    app_name: '',
    app_version: '',
    copyright_text: '',
    copyright_year: '',
    logo_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await adminApi.getSettings(adminKey);
        setSettings(result.data || {});
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Gagal mengambil pengaturan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [adminKey]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminApi.updateSettings(adminKey, settings as unknown as Record<string, string>);
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">⚙️ Pengaturan Aplikasi</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Aplikasi
            </label>
            <input
              type="text"
              value={settings.app_name}
              onChange={(e) => handleChange('app_name', e.target.value)}
              className="input-field"
              placeholder="Nama aplikasi..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Versi Aplikasi
              </label>
              <input
                type="text"
                value={settings.app_version}
                onChange={(e) => handleChange('app_version', e.target.value)}
                className="input-field"
                placeholder="1.0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Copyright
              </label>
              <input
                type="text"
                value={settings.copyright_year}
                onChange={(e) => handleChange('copyright_year', e.target.value)}
                className="input-field"
                placeholder="2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teks Copyright
            </label>
            <input
              type="text"
              value={settings.copyright_text}
              onChange={(e) => handleChange('copyright_text', e.target.value)}
              className="input-field"
              placeholder="Nama organisasi..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Logo
            </label>
            <input
              type="text"
              value={settings.logo_url}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              className="input-field"
              placeholder="https://example.com/logo.png"
            />
            {settings.logo_url && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img
                  src={settings.logo_url}
                  alt="Logo preview"
                  className="h-16 object-contain bg-gray-100 rounded p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Menyimpan...' : '💾 Simpan Pengaturan'}
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h4 className="text-md font-semibold text-gray-700 mb-4">Preview Footer</h4>
        <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600">
          {settings.logo_url && (
            <img
              src={settings.logo_url}
              alt="Logo"
              className="h-8 mx-auto mb-2 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <p>
            © {settings.copyright_year} {settings.copyright_text}. {settings.app_name} v{settings.app_version}
          </p>
        </div>
      </div>
    </div>
  );
}
