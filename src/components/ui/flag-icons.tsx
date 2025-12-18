import { cn } from '@/lib/utils';

interface FlagProps {
  className?: string;
}

export const GermanFlag = ({ className }: FlagProps) => (
  <svg 
    viewBox="0 0 30 20" 
    className={cn("rounded-sm shadow-sm", className)}
    aria-label="German flag"
  >
    <rect width="30" height="6.67" fill="#000" />
    <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
    <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
  </svg>
);

export const BritishFlag = ({ className }: FlagProps) => (
  <svg 
    viewBox="0 0 30 20" 
    className={cn("rounded-sm shadow-sm", className)}
    aria-label="British flag"
  >
    <rect width="30" height="20" fill="#012169"/>
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="4"/>
    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2"/>
    <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="6"/>
    <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.6"/>
  </svg>
);
