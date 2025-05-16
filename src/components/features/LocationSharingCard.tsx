'use client';

import { useState, useEffect } from 'react';
import { MapPin, Users, CheckCircle, XCircle, X, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LiveMap } from '@/components/shared/LiveMap';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Guardian = {
  id: string;
  name: string;
  phone?: string;
};

let guardianIdCounter = 3; // Start from 3 since we have 2 initial guardians

export function LocationSharingCard() {
  const [isSharing, setIsSharing] = useState(false);
  const [guardians, setGuardians] = useState<Guardian[]>([
    { id: '1', name: 'Mom', phone: '+1234567890' },
    { id: '2', name: 'Dad', phone: '+0987654321' },
  ]);
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleSharing = (checked: boolean) => {
    if (checked && !navigator.geolocation) {
      toast({
        title: 'Location Access Required',
        description: 'Please enable location services to share your location.',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    setIsSharing(checked);
    toast({
      title: checked ? 'Location Sharing Activated' : 'Location Sharing Deactivated',
      description: checked 
        ? 'Your live location is now being shared with selected guardians.'
        : 'Live location sharing has been stopped.',
      duration: 3000,
    });
  };

  const handleRemoveGuardian = (guardianId: string) => {
    setGuardians(prev => prev.filter(g => g.id !== guardianId));
    toast({
      title: 'Guardian Removed',
      description: 'The guardian has been removed from your trusted list.',
      duration: 3000,
    });
  };

  const handleAddGuardian = () => {
    if (!newGuardianName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a name for the guardian.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    const newGuardian: Guardian = {
      id: String(guardianIdCounter++),
      name: newGuardianName.trim(),
      phone: newGuardianPhone.trim() || undefined,
    };

    setGuardians(prev => [...prev, newGuardian]);
    setNewGuardianName('');
    setNewGuardianPhone('');
    setIsDialogOpen(false);
    toast({
      title: 'Guardian Added',
      description: `${newGuardian.name} has been added to your trusted guardians.`,
      duration: 3000,
    });
  };

  // Don't render interactive elements until mounted
  if (!isMounted) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Live Location Sharing</CardTitle>
          </div>
          <CardDescription>Share your real-time location with trusted guardians during designated periods.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[400px] rounded-lg bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Live Location Sharing</CardTitle>
        </div>
        <CardDescription>Share your real-time location with trusted guardians during designated periods.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg bg-background shadow-sm">
          <Label htmlFor="location-sharing-toggle" className="font-medium flex items-center gap-2">
            {isSharing ? <CheckCircle className="text-green-500" /> : <XCircle className="text-destructive" /> }
            {isSharing ? 'Sharing Active' : 'Sharing Inactive'}
          </Label>
          <Switch
            id="location-sharing-toggle"
            checked={isSharing}
            onCheckedChange={handleToggleSharing}
            aria-label={isSharing ? "Deactivate location sharing" : "Activate location sharing"}
          />
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2"><Users size={18} /> Guardians</h4>
          <div className="flex flex-wrap gap-2">
            {guardians.map(guardian => (
              <Badge 
                key={guardian.id} 
                variant="secondary"
                className="pl-2 pr-1 py-1 flex items-center gap-1"
              >
                {guardian.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveGuardian(guardian.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {guardian.name}</span>
                </Button>
              </Badge>
            ))}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Guardian
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Guardian</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Name</Label>
                    <Input
                      id="guardianName"
                      placeholder="Enter guardian's name"
                      value={newGuardianName}
                      onChange={(e) => setNewGuardianName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Phone Number (Optional)</Label>
                    <Input
                      id="guardianPhone"
                      placeholder="Enter guardian's phone number"
                      value={newGuardianPhone}
                      onChange={(e) => setNewGuardianPhone(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddGuardian}>
                    Add Guardian
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-muted-foreground">Manage who can see your location.</p>
        </div>

        <LiveMap isSharing={isSharing} />
      </CardContent>
    </Card>
  );
}
