import { Shield, Lock, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  variant?: 'inline' | 'footer';
  className?: string;
}

export function TrustBadges({ variant = 'inline', className }: TrustBadgesProps) {
  const badges = [
    { icon: Lock, label: '256-bit SSL' },
    { icon: CheckCircle2, label: 'Verifiziert' },
    { icon: Shield, label: 'Sicher' },
  ];

  if (variant === 'footer') {
    return (
      <div className={cn(
        "flex items-center justify-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border/50",
        className
      )}>
        {badges.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-success/10 border border-success/20",
      className
    )}>
      <Lock className="h-3.5 w-3.5 text-success" />
      <span className="text-xs font-medium text-success">
        256-bit SSL verschlüsselt • Sofortige Gutschrift
      </span>
    </div>
  );
}

interface PoweredByBadgeProps {
  className?: string;
}

export function PoweredByBadge({ className }: PoweredByBadgeProps) {
  return (
    <div className={cn(
      "flex items-center justify-center gap-2 text-xs text-muted-foreground",
      className
    )}>
      <Zap className="h-3 w-3" />
      <span>Powered by NOWPayments</span>
    </div>
  );
}
