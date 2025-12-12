import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface CSVColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | null | undefined);
}

export function generateCSV<T>(data: T[], columns: CSVColumn<T>[]): string {
  const headers = columns.map(col => `"${col.header}"`).join(',');
  
  const rows = data.map(item => {
    return columns.map(col => {
      let value: string | number | null | undefined;
      
      if (typeof col.accessor === 'function') {
        value = col.accessor(item);
      } else {
        value = item[col.accessor] as string | number | null | undefined;
      }
      
      if (value === null || value === undefined) {
        return '""';
      }
      
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return `"${value}"`;
    }).join(',');
  });
  
  return [headers, ...rows].join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function formatDateForCSV(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd.MM.yyyy', { locale: de });
}

export function formatCurrencyForCSV(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '0,00';
  return amount.toFixed(2).replace('.', ',');
}
