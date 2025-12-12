import { useState } from 'react';
import { Wallet, CreditCard, Bitcoin, Copy, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdvertiserAccount } from '@/hooks/useAdvertiserAccount';
import { useToast } from '@/hooks/use-toast';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const { balanceEur, balanceUsdt } = useAdvertiserAccount();
  const { toast } = useToast();

  const walletAddress = 'TXkZ9qJ7vP3mN5wR2sT8yU4iO6pL1kJ3hG';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Adresse kopiert',
      description: 'Die Wallet-Adresse wurde in die Zwischenablage kopiert.',
    });
  };

  const handleBankTransfer = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Ungültiger Betrag',
        description: 'Bitte gib einen gültigen Betrag ein.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Einzahlung initiiert',
      description: `Überweise ${amount}€ an die unten angegebene Bankverbindung.`,
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    return `${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} USDT`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Guthaben einzahlen</h1>
        <p className="text-muted-foreground mt-1">
          Wähle eine Einzahlungsmethode und lade dein Konto auf.
        </p>
      </div>

      {/* Current Balance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aktuelles EUR Guthaben
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balanceEur, 'EUR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aktuelles USDT Guthaben
            </CardTitle>
            <Bitcoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balanceUsdt, 'USDT')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Deposit Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Einzahlungsmethode wählen</CardTitle>
          <CardDescription>
            Wähle deine bevorzugte Einzahlungsmethode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bank" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Banküberweisung
              </TabsTrigger>
              <TabsTrigger value="crypto" className="flex items-center gap-2">
                <Bitcoin className="h-4 w-4" />
                Krypto (USDT)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bank" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Betrag (EUR)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="z.B. 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Empfänger:</span>
                    <span className="font-medium">Agency Ads GmbH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IBAN:</span>
                    <span className="font-medium font-mono">DE89 3704 0044 0532 0130 00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">BIC:</span>
                    <span className="font-medium font-mono">COBADEFFXXX</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Verwendungszweck:</span>
                    <span className="font-medium">DEPOSIT-[Deine User ID]</span>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={handleBankTransfer}>
                Einzahlung bestätigen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4 mt-6">
              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Netzwerk</p>
                    <p className="font-medium">TRC20 (Tron)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Wallet Adresse</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-background px-3 py-2 rounded-md text-sm font-mono break-all">
                        {walletAddress}
                      </code>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleCopyAddress}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  <strong>Wichtig:</strong> Sende nur USDT (TRC20) an diese Adresse. 
                  Andere Tokens oder Netzwerke werden nicht unterstützt und können zu Verlust führen.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
