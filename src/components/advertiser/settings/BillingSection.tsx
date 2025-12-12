import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CreditCard, MapPin } from 'lucide-react';
import { InvoiceTable } from './InvoiceTable';

export function BillingSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    company: '',
    street: '',
    zip: '',
    city: '',
    country: 'DE',
    vatId: '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save - in production, save to database
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    toast.success('Rechnungsadresse gespeichert');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Rechnungsadresse
          </CardTitle>
          <CardDescription>
            Diese Adresse wird für alle Rechnungen verwendet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="billingCompany">Firma / Name</Label>
            <Input
              id="billingCompany"
              placeholder="Meine Firma GmbH"
              value={billingAddress.company}
              onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="street">Straße & Hausnummer</Label>
            <Input
              id="street"
              placeholder="Musterstraße 123"
              value={billingAddress.street}
              onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip">PLZ</Label>
              <Input
                id="zip"
                placeholder="12345"
                value={billingAddress.zip}
                onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="city">Stadt</Label>
              <Input
                id="city"
                placeholder="Berlin"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Land</Label>
              <Select 
                value={billingAddress.country} 
                onValueChange={(value) => setBillingAddress({ ...billingAddress, country: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DE">Deutschland</SelectItem>
                  <SelectItem value="AT">Österreich</SelectItem>
                  <SelectItem value="CH">Schweiz</SelectItem>
                  <SelectItem value="NL">Niederlande</SelectItem>
                  <SelectItem value="FR">Frankreich</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatId">USt-IdNr. (optional)</Label>
              <Input
                id="vatId"
                placeholder="DE123456789"
                value={billingAddress.vatId}
                onChange={(e) => setBillingAddress({ ...billingAddress, vatId: e.target.value })}
              />
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Speichern...' : 'Adresse speichern'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Rechnungshistorie
          </CardTitle>
          <CardDescription>
            Alle bisherigen Rechnungen und Zahlungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTable />
        </CardContent>
      </Card>
    </div>
  );
}
