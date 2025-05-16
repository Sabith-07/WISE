import { Shield } from 'lucide-react'; // Using Shield as a generic app icon

export function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-4 sm:px-6 lg:px-8 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-3">
        <Shield size={32} className="text-primary-foreground" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">WISE</h1>
      </div>
    </header>
  );
}
