'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from '@/components/maps/LeafletComponents';
import { createDefaultIcon } from '@/utils/leaflet-icon';
import { MapPlaceholder } from '@/components/shared/MapPlaceholder';
import 'leaflet/dist/leaflet.css';

export function SimpleMap() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setIcon(createDefaultIcon());

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  if (!mounted) return <MapPlaceholder />;

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      {mounted && icon && (
        <MapContainer
          center={position}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={icon}>
            <Popup>
              Your location
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
} 