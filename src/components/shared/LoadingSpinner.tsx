import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number | string; // Allow string for Tailwind sizes e.g. "h-12 w-12"
  message?: string;
}

export function LoadingSpinner({ className, size = "1.5rem", message }: LoadingSpinnerProps) {
  const sizeClass = typeof size === 'string' ? size : '';
  const iconSize = typeof size === 'number' ? size : undefined;

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
      <Loader2
        className={cn('animate-spin text-primary', sizeClass, className)}
        style={iconSize ? { width: iconSize, height: iconSize } : {}}
      />
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
