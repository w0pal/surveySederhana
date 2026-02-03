'use client';

import { useState } from 'react';

interface AdminSidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  appName?: string;
  onLogout?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Statistik & Peta' },
  { id: 'responses', label: 'Data Respons', icon: '📋', description: 'Daftar responden' },
  { id: 'account', label: 'Pengaturan Akun', icon: '👤', description: 'Akun admin' },
  { id: 'app-settings', label: 'Pengaturan Aplikasi', icon: '⚙️', description: 'Konfigurasi app' },
  { id: 'master-data', label: 'Data Master', icon: '🗂️', description: 'Daftar Provinsi' },
];

export default function AdminSidebar({ activeMenu, onMenuChange, appName, onLogout }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = (menuId: string) => {
    onMenuChange(menuId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white px-4 py-4 flex items-center justify-between shadow-lg h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <span className="font-semibold truncate">{appName || 'Admin Panel'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Online</span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed lg:relative z-50
        w-72 lg:w-64 
        bg-gradient-to-b from-slate-800 to-slate-900 
        min-h-screen text-white flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{appName || 'Admin Panel'}</h1>
              <p className="text-xs text-slate-400 mt-1">Sistem Manajemen Survey</p>
            </div>
            {/* Close button for mobile */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeMenu === item.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className={`text-xs ${activeMenu === item.id ? 'text-primary-200' : 'text-slate-400'}`}>
                      {item.description}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <span>🚪</span>
              <span className="text-sm">Logout</span>
            </button>
          )}
          <div className="text-center text-xs text-slate-500">
            <p>Powered by Survey Sederhana</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
