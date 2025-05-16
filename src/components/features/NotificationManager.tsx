'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface NotificationManagerProps {
  onSend?: (success: boolean) => void;
}

export function NotificationManager({ onSend }: NotificationManagerProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      setStatus('success');
      onSend?.(true);
      
      // Reset form after success
      setTimeout(() => {
        setPhoneNumber('');
        setMessage('');
        setStatus('idle');
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Failed to send notification');
      onSend?.(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center">Send Emergency Notification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Indian Mobile Number
          </label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter mobile number (e.g., +919876543210)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            pattern="^(\+91|91)?[6-9]\d{9}$"
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500">Format: +91XXXXXXXXXX or 91XXXXXXXXXX</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full min-h-[100px] px-3 py-2 border rounded-md"
            placeholder="Enter your emergency message..."
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'loading'}
          variant={status === 'error' ? 'destructive' : 'default'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Notification'}
        </Button>
      </form>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle2 className="h-5 w-5" />
          <p>Notification sent successfully!</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
} 