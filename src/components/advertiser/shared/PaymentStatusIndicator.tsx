import { Loader2, Check, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentStatusIndicatorProps {
  status: string;
  className?: string;
}

export function PaymentStatusIndicator({ status, className }: PaymentStatusIndicatorProps) {
  const { t } = useLanguage();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return { 
          text: t.deposit.statusWaiting, 
          color: 'text-amber-600 bg-amber-50 border-amber-200',
          dotColor: 'bg-amber-500',
          Icon: Clock,
          animate: true
        };
      case 'confirming':
        return { 
          text: t.deposit.statusConfirming, 
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          dotColor: 'bg-blue-500',
          Icon: Loader2,
          animate: true
        };
      case 'confirmed':
      case 'finished':
        return { 
          text: t.deposit.statusSuccess, 
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          dotColor: 'bg-emerald-500',
          Icon: Check,
          animate: false
        };
      case 'failed':
      case 'expired':
        return { 
          text: t.deposit.statusFailed, 
          color: 'text-red-600 bg-red-50 border-red-200',
          dotColor: 'bg-red-500',
          Icon: AlertCircle,
          animate: false
        };
      default:
        return { 
          text: t.deposit.statusUnknown, 
          color: 'text-muted-foreground bg-muted border-border',
          dotColor: 'bg-muted-foreground',
          Icon: Loader2,
          animate: true
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      "flex items-center justify-center gap-3 p-4 rounded-xl border",
      config.color,
      className
    )}>
      {/* Pulsing dot */}
      <div className="relative">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full",
          config.dotColor
        )} />
        {config.animate && (
          <div className={cn(
            "absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75",
            config.dotColor
          )} />
        )}
      </div>
      
      {/* Icon */}
      <config.Icon className={cn(
        "h-5 w-5",
        config.animate && config.Icon === Loader2 && "animate-spin"
      )} />
      
      {/* Text */}
      <span className="font-semibold">{config.text}</span>
    </div>
  );
}
