import { Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getCoinList } from '@/lib/crypto-config';

interface TransactionFiltersProps {
  coinFilter: string;
  statusFilter: string;
  onCoinFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onExportCSV: () => void;
}

export function TransactionFilters({
  coinFilter,
  statusFilter,
  onCoinFilterChange,
  onStatusFilterChange,
  onExportCSV,
}: TransactionFiltersProps) {
  const coins = getCoinList();

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-background border" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Coin</label>
              <Select value={coinFilter} onValueChange={onCoinFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Coins" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="all">Alle Coins</SelectItem>
                  {coins.map((coin) => (
                    <SelectItem key={coin.symbol} value={coin.symbol}>
                      {coin.icon} {coin.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="completed">Bestätigt</SelectItem>
                  <SelectItem value="failed">Fehlgeschlagen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={onExportCSV}>
        <Download className="h-4 w-4 mr-2" />
        CSV Export
      </Button>
    </div>
  );
}
