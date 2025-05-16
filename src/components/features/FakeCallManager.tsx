'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SmartphoneNfc, Sparkles, User, MessageSquareText, Phone, PhoneOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fakeCallFormSchema, type FakeCallFormValues } from '@/lib/schemas';
import { handleGenerateFakeCall } from '@/app/actions';
import type { GenerateFakeCallOutput } from '@/ai/flows/generate-fake-call';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function FakeCallManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<GenerateFakeCallOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/ringtonenew.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const form = useForm<FakeCallFormValues>({
    resolver: zodResolver(fakeCallFormSchema),
    defaultValues: {
      callerId: '',
      preRecordedMessage: '',
    },
  });

  async function onSubmit(values: FakeCallFormValues) {
    setIsLoading(true);
    setScenario(null);
    setError(null);

    const result = await handleGenerateFakeCall(values);

    setIsLoading(false);
    if (result.success && result.data) {
      setScenario(result.data);
      toast({
        title: 'Fake Call Scenario Generated!',
        description: 'Review the scenario below. You can "receive" this call now.',
      });
    } else {
      setError(result.error || 'Failed to generate scenario.');
      toast({
        title: 'Error Generating Scenario',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }

  const startFakeCall = async () => {
    setShowCallDialog(true);
    setIsCallActive(true);
    
    // Start vibration if supported
    if ('vibrate' in navigator) {
      const vibratePattern = () => {
        navigator.vibrate([1000, 1000, 1000, 1000]);
        if (isCallActive) {
          setTimeout(vibratePattern, 4000);
        }
      };
      vibratePattern();
    }

    // Play ringtone
    try {
      if (audioRef.current) {
        // Reset the audio to start from beginning
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error playing ringtone:', error);
      toast({
        title: 'Audio Playback Error',
        description: 'Please click anywhere on the page first to enable sound.',
        variant: 'destructive',
      });
    }
  };

  const endFakeCall = () => {
    setIsCallActive(false);
    setShowCallDialog(false);
    
    // Stop vibration
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }

    // Stop ringtone
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    toast({
      title: 'Call Ended',
      description: 'The fake call has been ended.',
      duration: 3000,
    });
  };

  // Clean up when dialog is closed externally
  useEffect(() => {
    if (!showCallDialog) {
      endFakeCall();
    }
  }, [showCallDialog]);

  return (
    <>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SmartphoneNfc className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Smart Distraction - Fake Call</CardTitle>
          </div>
          <CardDescription>Generate a fake incoming call to subtly get out of uncomfortable situations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="callerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <User size={16}/> Caller ID
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mom, Work, Dr. Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preRecordedMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MessageSquareText size={16}/> What the call is about? (Briefly)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Urgent, need you home now', 'Package delivery issue', 'Quick question about project'"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <LoadingSpinner size="1rem" className="mr-2" />
                ) : (
                  <Sparkles size={18} className="mr-2" />
                )}
                Generate Call Scenario
              </Button>
            </form>
          </Form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scenario && (
            <Card className="mt-6 bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles size={20} className="text-primary" />
                  Generated Scenario
                </CardTitle>
                <CardDescription>This is what your fake call could be about.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{scenario.scenarioDescription}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={startFakeCall}>
                  <SmartphoneNfc size={18} className="mr-2" />
                  Simulate Receiving This Call
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {form.getValues().callerId || 'Unknown'} is calling...
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-8">
            <Button
              size="lg"
              variant="destructive"
              className="h-16 w-16 rounded-full"
              onClick={endFakeCall}
            >
              <PhoneOff className="h-6 w-6" />
              <span className="sr-only">Decline Call</span>
            </Button>
            <Button
              size="lg"
              variant="default"
              className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
              onClick={endFakeCall}
            >
              <Phone className="h-6 w-6" />
              <span className="sr-only">Accept Call</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
