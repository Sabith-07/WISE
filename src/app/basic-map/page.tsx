import dynamic from 'next/dynamic';

const BasicMapWithNoSSR = dynamic(
  () => import('@/components/features/BasicMap').then(mod => mod.BasicMap),
  { ssr: false }
);

export default function BasicMapPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Basic Map</h1>
      <BasicMapWithNoSSR />
    </div>
  );
} 