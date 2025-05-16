import { AppHeader } from '@/components/layout/AppHeader';
import { SOSButton } from '@/components/features/SOSButton';
import { FakeCallManager } from '@/components/features/FakeCallManager';
import { LocationSharingCard } from '@/components/features/LocationSharingCard';
import { RouteMonitoringCard } from '@/components/features/RouteMonitoringCard';
import { SafetyScoreCard } from '@/components/features/SafetyScoreCard';
import { Shield, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8" />
            WISE
            <Heart className="h-8 w-8 text-secondary-500" />
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personal safety companion, empowering you with smart features to stay secure and connected.
          </p>
        </div>

        {/* SOS Button Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-100/50 to-transparent -z-10 rounded-3xl blur-xl"></div>
          <SOSButton />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-8">
            <FakeCallManager />
            <RouteMonitoringCard />
          </div>
          <div className="space-y-8">
            <LocationSharingCard />
            <SafetyScoreCard />
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} WISE. Empowering safety through technology. 💜
          </p>
        </div>
      </footer>
    </div>
  );
}
