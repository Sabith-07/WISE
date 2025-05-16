'use client';

import 'regenerator-runtime/runtime';
import { useEffect, useState, useCallback } from 'react';
import { AlertOctagon, ShieldCheck, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_EMERGENCY_WHATSAPP_NUMBER || '';

export function SOSButton() {
  const [sosActive, setSosActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Initialize SpeechRecognition
    if (typeof window !== 'undefined') {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    }
  }, []);

  const requestMicrophonePermission = async () => {
    if (!isClient) return false;
    setIsRequestingPermission(true);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Browser does not support media devices');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setMicPermissionGranted(true);
        toast({
          title: "Permission Granted",
          description: "Microphone access has been enabled",
          duration: 3000,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setMicPermissionGranted(false);
      toast({
        title: "Permission Error",
        description: "Please allow microphone access in your browser settings",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const getCurrentLocation = async () => {
    if (!isClient) return 'Location unavailable';

    try {
      if (!navigator?.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    } catch (error) {
      console.error('Error getting location:', error);
      return 'Location unavailable';
    }
  };

  const sendWhatsAppAlert = async () => {
    try {
      const locationLink = await getCurrentLocation();
      const message = `EMERGENCY ALERT! Location: ${locationLink}`;
      const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
    } catch (error) {
      console.error('Error sending WhatsApp alert:', error);
      toast({
        title: "Error",
        description: "Failed to send WhatsApp alert",
        variant: "destructive",
      });
    }
  };

  const handleSOSActivation = useCallback(async () => {
    setSosActive((prev) => !prev);
    if (!sosActive) {
      toast({
        title: "SOS Activated!",
        description: "Your emergency contacts have been notified and your location is being shared.",
        variant: "destructive",
        duration: 5000,
      });
      await sendWhatsAppAlert();
    } else {
      toast({
        title: "SOS Deactivated",
        description: "Emergency alerts have been cancelled.",
        duration: 3000,
      });
    }
  }, [sosActive, toast]);

  const startListening = async () => {
    if (!window.SpeechRecognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    try {
      const recognition = new window.SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase();
        if (text.includes('help')) {
          handleSOSActivation();
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      await recognition.start();
      setIsListening(true);
      toast({
        title: "Voice Detection Active",
        description: "Say 'HELP' to activate emergency response",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to start speech recognition",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (window.SpeechRecognition) {
      const recognition = new window.SpeechRecognition();
      recognition.stop();
    }
  };

  const toggleVoiceRecognition = async () => {
    if (!isClient) return;

    try {
      if (isListening) {
        stopListening();
      } else {
        if (micPermissionGranted === false || micPermissionGranted === null) {
          const hasPermission = await requestMicrophonePermission();
          if (!hasPermission) return;
        }
        await startListening();
      }
    } catch (error) {
      console.error('Error toggling voice recognition:', error);
      toast({
        title: "Error",
        description: "Failed to toggle voice recognition",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center gap-4 my-8">
        <div className="text-center text-muted-foreground">
          Loading voice recognition...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8 relative">
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handleSOSActivation}
          className={cn(
            "rounded-full w-16 h-16 text-sm font-bold shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2",
            sosActive
              ? "bg-destructive hover:bg-destructive/90 focus:ring-destructive/50 text-destructive-foreground sos-pulsing"
              : "bg-accent hover:bg-accent/90 focus:ring-accent/50 text-accent-foreground",
          )}
          aria-pressed={sosActive}
          aria-label={sosActive ? "Deactivate SOS" : "Activate SOS"}
        >
          <div className="flex flex-col items-center justify-center">
            {sosActive ? (
              <ShieldCheck size={24} />
            ) : (
              <AlertOctagon size={24} />
            )}
          </div>
        </Button>

        <Button
          onClick={toggleVoiceRecognition}
          disabled={isRequestingPermission}
          className={cn(
            "rounded-full w-16 h-16 sm:w-20 sm:h-20 text-sm font-bold shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2",
            isListening
              ? "bg-green-500 hover:bg-green-600 focus:ring-green-400/50"
              : micPermissionGranted === false
              ? "bg-red-500 hover:bg-red-600 focus:ring-red-400/50"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400/50",
            "text-white",
            isRequestingPermission && "opacity-70 cursor-not-allowed"
          )}
        >
          <div className="flex flex-col items-center justify-center">
            {isRequestingPermission ? (
              <>
                <Mic size={24} className="animate-pulse" />
                <span className="text-xs mt-1">Requesting...</span>
              </>
            ) : isListening ? (
              <>
                <Mic size={24} className={cn("animate-pulse")} />
                <span className="text-xs mt-1">Listening</span>
              </>
            ) : micPermissionGranted === false ? (
              <>
                <MicOff size={24} />
                <span className="text-xs mt-1">Denied</span>
              </>
            ) : (
              <>
                <Mic size={24} />
                <span className="text-xs mt-1">Enable</span>
              </>
            )}
          </div>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs mt-2">
        {isRequestingPermission
          ? "Please allow microphone access when prompted..."
          : isListening
          ? "Say 'HELP' to activate emergency response"
          : micPermissionGranted === false
          ? "Click to request microphone access again"
          : "Click the microphone to enable voice detection"}
      </p>
    </div>
  );
}
