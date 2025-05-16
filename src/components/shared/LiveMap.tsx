'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, AlertTriangle, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface LiveMapProps {
  isSharing: boolean;
  className?: string;
}

function MapFallback({ message = "Map loading...", description = "Please ensure you have an active internet connection" }) {
  return (
    <div className="w-full h-[400px] rounded-lg bg-muted flex items-center justify-center">
      <div className="text-center space-y-4">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
        <div className="space-y-2">
          <p className="text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function MapInactive() {
  return (
    <div className="w-full h-[400px] rounded-lg bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
      <div className="text-center space-y-4">
        <EyeOff className="w-12 h-12 text-muted-foreground/50 mx-auto" />
        <div className="space-y-2">
          <p className="text-muted-foreground font-medium">Location Sharing Inactive</p>
          <p className="text-xs text-muted-foreground/80">Enable location sharing to view the live map</p>
        </div>
      </div>
    </div>
  );
}

function MapError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="w-full h-[400px] rounded-lg bg-destructive/10 flex items-center justify-center">
      <div className="text-center space-y-4 p-6">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-destructive font-medium">Failed to load map</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
          {onRetry && (
            <Button 
              variant="outline" 
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LiveMap({ isSharing, className }: LiveMapProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [icon, setIcon] = useState<any>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSecureContext, setIsSecureContext] = useState(false);

  useEffect(() => {
    setMounted(true);
    const secure = typeof window !== 'undefined' && (
      window.isSecureContext || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );
    setIsSecureContext(secure);

    // Initialize Leaflet icon
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: '/marker-icon.png',
        iconRetinaUrl: '/marker-icon-2x.png',
        shadowUrl: '/marker-shadow.png',
      });
      setIcon(new L.Icon.Default());
    });
  }, []);

  // Handle location tracking
  useEffect(() => {
    if (!mounted || !isSharing) {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    if (!isSecureContext) {
      setError('Geolocation requires a secure HTTPS connection');
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setError(null);
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
        }
        setError(errorMessage);
      }
    );

    // Start watching position
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setError(null);
      },
      (error) => {
        let errorMessage = 'Failed to track your location';
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location tracking timed out. Please try again.';
              break;
          }
        }
        setError(errorMessage);
      }
    );
    setWatchId(id);

    return () => {
      if (id) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [isSharing, mounted, isSecureContext]);

  if (!mounted) return null;

  if (!isSharing) {
    return <MapInactive />;
  }

  if (error) {
    return <MapError error={error} onRetry={() => setError(null)} />;
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      {mounted && icon && (
        <MapContainer
          center={position}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
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