import { useState } from 'react';
import { Copy, Check, Maximize2, AlertTriangle, HelpCircle, ChevronDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { getCoinBySymbol } from '@/lib/crypto-config';

interface WalletDisplayProps {
  selectedCoin: string;
  onPaymentInitiated: () => void;
  isValid: boolean;
  showConfirmations?: boolean;
  confirmations?: number;
  requiredConfirmations?: number;
}

export function WalletDisplay({ 
  selectedCoin, 
  onPaymentInitiated, 
  isValid,
  showConfirmations = false,
  confirmations = 0,
  requiredConfirmations = 3
}: WalletDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const { toast } = useToast();
  
  const coinConfig = getCoinBySymbol(selectedCoin);
  if (!coinConfig) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(coinConfig.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Adresse kopiert',
      description: 'Die Wallet-Adresse wurde in die Zwischenablage kopiert.',
    });
  };

  const confirmationProgress = (confirmations / requiredConfirmations) * 100;

  return (
    <div className="space-y-4">
      <Label>3. Sende an diese Wallet-Adresse</Label>
      
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* QR Code */}
            <div className="shrink-0">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <QRCodeSVG 
                  value={coinConfig.address} 
                  size={120}
                  level="H"
                />
              </div>
            </div>

            {/* Address Info */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Netzwerk</p>
                <p className="font-medium" style={{ color: coinConfig.color }}>
                  {coinConfig.network}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Wallet-Adresse</p>
                <code className="block bg-background px-3 py-2 rounded-md text-sm font-mono break-all border">
                  {coinConfig.address}
                </code>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyAddress}
                  className="flex-1 sm:flex-none"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-success" />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Kopieren
                    </>
                  )}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Maximize2 className="h-4 w-4 mr-2" />
                      QR Fullscreen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>QR-Code für {selectedCoin}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center p-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm">
                        <QRCodeSVG 
                          value={coinConfig.address} 
                          size={250}
                          level="H"
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      {coinConfig.network}
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How-to Accordion */}
      <Collapsible open={howToOpen} onOpenChange={setHowToOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between h-auto py-3 px-4 bg-muted/30 hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">So funktioniert's</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${howToOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 pt-2 bg-muted/30 rounded-b-lg -mt-1">
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Öffne deine Wallet-App (z.B. Trust Wallet, MetaMask)</li>
            <li>Wähle <strong>{selectedCoin}</strong> zum Senden aus</li>
            <li>Scanne den QR-Code oder kopiere die Adresse</li>
            <li>Sende den exakten Betrag über das <strong>{coinConfig.network}</strong>-Netzwerk</li>
            <li>Klicke auf "Zahlung prüfen" nachdem du gesendet hast</li>
          </ol>
        </CollapsibleContent>
      </Collapsible>

      {/* Confirmations Counter */}
      {showConfirmations && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Netzwerk-Bestätigungen</p>
              <span className="text-sm font-bold text-primary">{confirmations}/{requiredConfirmations}</span>
            </div>
            <Progress value={confirmationProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {confirmations === 0 
                ? 'Warte auf erste Bestätigung...'
                : confirmations < requiredConfirmations
                  ? 'Transaktion wird bestätigt...'
                  : 'Transaktion bestätigt!'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Warning */}
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-destructive">Wichtiger Hinweis</p>
          <p className="text-muted-foreground mt-1">
            Sende nur <strong>{selectedCoin}</strong> ({coinConfig.network}) an diese Adresse. 
            Andere Coins oder Netzwerke führen zu permanentem Verlust!
          </p>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={onPaymentInitiated}
        disabled={!isValid}
      >
        Ich habe gesendet – Zahlung prüfen
      </Button>
    </div>
  );
}
