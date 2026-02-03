'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { adminApi } from '@/lib/api';

interface GeoData {
  province_id: number;
  province_name: string;
  latitude: number;
  longitude: number;
  respondent_count: number;
}

interface GISMapProps {
  adminKey: string;
}

// Separate MapView component that only renders on client
function MapView({ geoData }: { geoData: GeoData[] }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapId = 'gis-map-container';

  const maxCount = useMemo(() => {
    return Math.max(...geoData.map(d => d.respondent_count), 1);
  }, [geoData]);

  useEffect(() => {
    let map: any = null;
    let L: any = null;

    const initializeMap = async () => {
      try {
        // Import Leaflet
        L = (await import('leaflet')).default;

        // Add CSS if not present
        if (!document.getElementById('leaflet-css-link')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css-link';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          // Wait for CSS
          await new Promise(r => setTimeout(r, 300));
        }

        const container = document.getElementById(mapId);
        if (!container) return;

        // Clear any existing map
        if ((container as any)._leaflet_id) {
          return; // Already initialized
        }

        // Create map
        map = L.map(container).setView([-2.5, 118], 5);

        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 18,
        }).addTo(map);

        // Add markers
        geoData.forEach((location) => {
          if (!location.latitude || !location.longitude) return;
          
          const radius = 8 + (location.respondent_count / maxCount) * 25;

          const marker = L.circleMarker([location.latitude, location.longitude], {
            radius: radius,
            fillColor: '#ef4444',
            color: '#b91c1c',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map);

          marker.bindPopup(`
            <div style="text-align:center;padding:5px;">
              <strong style="font-size:14px;">${location.province_name}</strong><br/>
              <span style="font-size:20px;color:#dc2626;font-weight:bold;">${location.respondent_count}</span>
              <span style="font-size:12px;color:#666;"> responden</span>
            </div>
          `);

          marker.bindTooltip(`${location.province_name}: ${location.respondent_count}`, {
            permanent: false,
            direction: 'top',
            offset: [0, -radius],
          });
        });

        setMapLoaded(true);

        // Resize after short delay
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 500);

      } catch (err) {
        console.error('Map init error:', err);
      }
    };

    initializeMap();

    return () => {
      if (map) {
        try {
          map.remove();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []); // Only run once on mount

  return (
    <div 
      id={mapId}
      className="h-80 rounded-lg border-2 border-gray-200 bg-gray-50"
      style={{ minHeight: '320px', zIndex: 1 }}
    />
  );
}

export default function GISMap({ adminKey }: GISMapProps) {
  const [geoData, setGeoData] = useState<GeoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Delay map rendering to avoid SSR issues
    const timer = setTimeout(() => setShowMap(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const result = await adminApi.getGeoDistribution(adminKey);
        setGeoData(result.data || []);
      } catch (error) {
        console.error('Error fetching geo data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (adminKey) {
      fetchGeoData();
    }
  }, [adminKey]);

  const totalRespondents = useMemo(() => {
    return geoData.reduce((sum, d) => sum + d.respondent_count, 0);
  }, [geoData]);

  const maxCount = useMemo(() => {
    return Math.max(...geoData.map(d => d.respondent_count), 1);
  }, [geoData]);

  if (!isClient || isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🗺️ Peta Sebaran Responden</h3>
        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">🗺️ Peta Sebaran Responden</h3>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-red-600">{totalRespondents}</span> responden dari{' '}
          <span className="font-semibold">{geoData.length}</span> provinsi
        </div>
      </div>

      {/* Interactive Map */}
      {showMap && geoData.length > 0 ? (
        <MapView geoData={geoData} />
      ) : geoData.length === 0 ? (
        <div className="h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-2">🗺️</p>
            <p className="text-gray-500">Peta akan muncul saat ada data responden</p>
          </div>
        </div>
      ) : (
        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-red-700"></div>
          <span>Lokasi Responden</span>
        </div>
        <span className="text-gray-300">|</span>
        <span>Ukuran = jumlah responden</span>
        <span className="text-gray-300">|</span>
        <span>Klik marker untuk detail</span>
      </div>

      {/* Distribution Summary */}
      {geoData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">📊 Top Provinsi:</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {geoData.slice(0, 10).map((item, index) => (
              <div 
                key={item.province_id} 
                className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg px-3 py-2 border border-red-100"
              >
                <span className="text-xs font-bold text-red-600">#{index + 1}</span>
                <span className="text-xs text-gray-700 truncate flex-1">{item.province_name}</span>
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
                  {item.respondent_count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {geoData.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 font-medium">⚠️ Belum ada data sebaran</p>
          <p className="text-sm text-yellow-600">Data muncul setelah ada responden mengisi survey.</p>
        </div>
      )}
    </div>
  );
}
