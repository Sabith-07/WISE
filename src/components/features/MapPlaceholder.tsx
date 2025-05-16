'use client';

interface MapPlaceholderProps {
  hint: string;
}

export function MapPlaceholder({ hint }: MapPlaceholderProps) {
  return (
    <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded-md">
      <span className="text-gray-600">{hint}</span>
    </div>
  );
}
