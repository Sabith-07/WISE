'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from '@/components/maps/LeafletComponents';
import { createDefaultIcon } from '@/utils/leaflet-icon';
import { MapPlaceholder } from '@/components/shared/MapPlaceholder';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  position: [number, number];
  isVisible: boolean;
}

export function LocationMap({ position, isVisible }: LocationMapProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setIcon(createDefaultIcon());

    // Check if we're on HTTPS
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
      setError('Geolocation requires a secure HTTPS connection');
    }
  }, []);

  if (!mounted) return <MapPlaceholder />;
  
  if (error) {
    return (
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={() => setError(null)}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-[300px] h-[200px] sm:w-[400px] sm:h-[300px] rounded-lg overflow-hidden shadow-lg">
      {mounted && icon && (
        <MapContainer
          center={position}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
          key={`${position[0]}-${position[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={icon}>
            <Popup>
              Your current location
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
} 