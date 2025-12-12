import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  product: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  validFrom: Date;
  validUntil: Date;
}

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const formatDate = (date: Date) => format(date, 'dd.MM.yyyy', { locale: de });
  const formatCurrency = (amount: number, currency: string) => 
    currency === 'EUR' ? `${amount.toFixed(2)} €` : `${amount.toFixed(2)} ${currency}`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Rechnung ${data.invoiceNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1a1a1a; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
    .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
    .invoice-number { color: #666; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    .table th { background: #f9fafb; font-weight: 600; }
    .total-row { font-weight: bold; font-size: 18px; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Agency Ads</div>
    <div style="text-align: right;">
      <div class="invoice-title">Rechnung</div>
      <div class="invoice-number">${data.invoiceNumber}</div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Rechnungsdatum</div>
    <div>${formatDate(data.date)}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Rechnungsempfänger</div>
    <div>${data.companyName || data.customerName}</div>
    <div>${data.customerEmail}</div>
  </div>
  
  <table class="table">
    <thead>
      <tr>
        <th>Beschreibung</th>
        <th>Zeitraum</th>
        <th style="text-align: right;">Betrag</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${data.product}</td>
        <td>${formatDate(data.validFrom)} - ${formatDate(data.validUntil)}</td>
        <td style="text-align: right;">${formatCurrency(data.amount, data.currency)}</td>
      </tr>
      <tr class="total-row">
        <td colspan="2">Gesamtbetrag</td>
        <td style="text-align: right;">${formatCurrency(data.amount, data.currency)}</td>
      </tr>
    </tbody>
  </table>
  
  <div class="section" style="margin-top: 30px;">
    <div class="section-title">Zahlungsmethode</div>
    <div>${data.paymentMethod}</div>
  </div>
  
  <div class="footer">
    <p>Diese Rechnung wurde elektronisch erstellt und ist ohne Unterschrift gültig.</p>
    <p>Bei Fragen kontaktieren Sie uns unter support@agency-ads.de</p>
  </div>
</body>
</html>
  `;
};

export const downloadInvoice = (data: InvoiceData) => {
  const html = generateInvoiceHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `Rechnung_${data.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
