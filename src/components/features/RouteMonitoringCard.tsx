'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Route,
  BellRing,
  PlayCircle,
  StopCircle,
  RouteOff
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// ✅ Dynamically import MapPlaceholder with proper typing
const MapPlaceholder = dynamic(() => import('@/components/shared/MapPlaceholder').then(mod => mod.MapPlaceholder), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-muted rounded-md animate-pulse" />
});

export function RouteMonitoringCard() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  const handleToggleMonitoring = () => {
    const newMonitoringState = !isMonitoring;
    setIsMonitoring(newMonitoringState);

    if (newMonitoringState) {
      toast({
        title: 'Route Monitoring Activated',
        description: 'Your journey is now being actively monitored by your guardians.',
        duration: 3000
      });
    } else {
      toast({
        title: 'Route Monitoring Deactivated',
        description: 'Your journey is no longer being monitored.',
        variant: 'default',
        duration: 3000
      });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Route className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Safe Journey - Route Monitoring</CardTitle>
        </div>
        <CardDescription>
          Allow trusted guardians to monitor your route and receive alerts if you deviate or need help.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isMonitoring ? (
          <Alert variant="default" className="bg-primary/10 border-primary/30">
            <BellRing className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Monitoring Active</AlertTitle>
            <AlertDescription>
              Your current route to "Home" is being monitored by <Badge variant="secondary">Mom</Badge>. Deviations will trigger an alert.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <RouteOff className="h-4 w-4" />
            <AlertTitle>Monitoring Inactive</AlertTitle>
            <AlertDescription>
              Activate route monitoring to share your journey progress with guardians.
            </AlertDescription>
          </Alert>
        )}

        <MapPlaceholder hint="route map navigation" />
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isMonitoring ? 'outline' : 'default'}
          onClick={handleToggleMonitoring}
        >
          {isMonitoring ? <StopCircle className="mr-2" /> : <PlayCircle className="mr-2" />}
          {isMonitoring ? 'Stop Route Monitoring' : 'Start Monitoring My Route'}
        </Button>
      </CardFooter>
    </Card>
  );
}
