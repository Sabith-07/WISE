'use client';

import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  hint?: string;
  className?: string;
}

export function MapPlaceholder({ hint = "Map loading...", className }: MapPlaceholderProps) {
  return (
    <div className={`h-64 w-full bg-muted flex items-center justify-center rounded-md shadow-inner ${className || ''}`}>
      <div className="text-center">
        <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
