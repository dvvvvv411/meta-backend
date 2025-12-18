import { cn } from '@/lib/utils';

interface FlagProps {
  className?: string;
}

export const GermanFlag = ({ className }: FlagProps) => (
  <svg 
    viewBox="0 0 5 3" 
    className={cn("rounded-sm shadow-sm", className)}
    aria-label="German flag"
  >
    <rect width="5" height="1" fill="#000" />
    <rect y="1" width="5" height="1" fill="#DD0000" />
    <rect y="2" width="5" height="1" fill="#FFCE00" />
  </svg>
);

export const BritishFlag = ({ className }: FlagProps) => (
  <svg 
    viewBox="0 0 60 30" 
    className={cn("rounded-sm shadow-sm", className)}
    aria-label="British flag"
  >
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);
