'use client';

import { SimpleMap } from '@/components/features/SimpleMap';

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Location Map</h1>
      <SimpleMap />
    </div>
  );
} 