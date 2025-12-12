import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NoAccountOverlay() {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
      <div className="text-center space-y-4 p-8 max-w-md animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Agency Account erforderlich
        </h3>
        <p className="text-muted-foreground">
          Miete ein Agency Account um echte Kampagnen-Statistiken und Performance-Daten zu sehen.
        </p>
        <Button 
          onClick={() => navigate('/advertiser/rent-account')}
          className="mt-4"
        >
          Account mieten
        </Button>
      </div>
    </div>
  );
}
