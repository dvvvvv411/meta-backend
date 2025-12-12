import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';
import { downloadInvoice } from '@/lib/invoice-generator';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Dummy invoices for placeholder
const DUMMY_INVOICES = [
  {
    id: 'INV-2024-001',
    date: new Date('2024-01-15'),
    description: 'Agency Account Miete - Januar 2024',
    amount: 150,
    status: 'paid' as const,
    validFrom: new Date('2024-01-15'),
    validUntil: new Date('2024-02-14'),
  },
  {
    id: 'INV-2024-002',
    date: new Date('2024-02-15'),
    description: 'Agency Account Miete - Februar 2024',
    amount: 150,
    status: 'paid' as const,
    validFrom: new Date('2024-02-15'),
    validUntil: new Date('2024-03-14'),
  },
  {
    id: 'INV-2024-003',
    date: new Date('2024-03-15'),
    description: 'Guthaben Aufladung - 500 USDT',
    amount: 490,
    status: 'paid' as const,
    validFrom: new Date('2024-03-15'),
    validUntil: new Date('2024-03-15'),
  },
  {
    id: 'INV-2024-004',
    date: new Date('2024-03-15'),
    description: 'Agency Account Miete - März 2024',
    amount: 150,
    status: 'pending' as const,
    validFrom: new Date('2024-03-15'),
    validUntil: new Date('2024-04-14'),
  },
];

const statusConfig = {
  paid: { label: 'Bezahlt', variant: 'default' as const },
  pending: { label: 'Ausstehend', variant: 'secondary' as const },
  failed: { label: 'Fehlgeschlagen', variant: 'destructive' as const },
};

export function InvoiceTable() {
  const handleDownload = (invoice: typeof DUMMY_INVOICES[0]) => {
    downloadInvoice({
      invoiceNumber: invoice.id,
      date: invoice.date,
      customerName: 'Max Mustermann',
      customerEmail: 'max@example.com',
      companyName: 'Meine Firma GmbH',
      product: invoice.description,
      amount: invoice.amount,
      currency: 'EUR',
      paymentMethod: 'Krypto (USDT)',
      validFrom: invoice.validFrom,
      validUntil: invoice.validUntil,
    });
  };

  if (DUMMY_INVOICES.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Noch keine Rechnungen vorhanden</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rechnungsnr.</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Beschreibung</TableHead>
          <TableHead className="text-right">Betrag</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aktion</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {DUMMY_INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              {format(invoice.date, 'dd. MMM yyyy', { locale: de })}
            </TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell className="text-right font-medium">
              {invoice.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </TableCell>
            <TableCell>
              <Badge variant={statusConfig[invoice.status].variant}>
                {statusConfig[invoice.status].label}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDownload(invoice)}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
