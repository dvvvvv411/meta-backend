import { useState, useMemo } from 'react';
import { Search, Loader2, Star, TrendingUp, Coins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCryptoIcon, getNetworkIcon } from '@/lib/crypto-icons';
import { cn } from '@/lib/utils';

export interface CurrencyOption {
  id: string;
  name: string;
  symbol: string;
  network?: string;
  minEur: number;
  category: 'stablecoin' | 'crypto';
}

export const CURRENCIES: CurrencyOption[] = [
  // Stablecoins
  { id: 'usdttrc20', name: 'Tether', symbol: 'USDT', network: 'TRC20', minEur: 10, category: 'stablecoin' },
  { id: 'usdterc20', name: 'Tether', symbol: 'USDT', network: 'ERC20', minEur: 20, category: 'stablecoin' },
  { id: 'usdtbsc', name: 'Tether', symbol: 'USDT', network: 'BSC (BEP20)', minEur: 10, category: 'stablecoin' },
  { id: 'usdtmatic', name: 'Tether', symbol: 'USDT', network: 'Polygon', minEur: 10, category: 'stablecoin' },
  { id: 'usdcerc20', name: 'USD Coin', symbol: 'USDC', network: 'ERC20', minEur: 20, category: 'stablecoin' },
  // Cryptocurrencies
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', minEur: 50, category: 'crypto' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', minEur: 30, category: 'crypto' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', minEur: 10, category: 'crypto' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', minEur: 10, category: 'crypto' },
  { id: 'trx', name: 'Tron', symbol: 'TRX', minEur: 5, category: 'crypto' },
  { id: 'bnbbsc', name: 'BNB', symbol: 'BNB', network: 'BSC', minEur: 15, category: 'crypto' },
  { id: 'xmr', name: 'Monero', symbol: 'XMR', minEur: 10, category: 'crypto' },
];

const POPULAR_IDS = ['usdttrc20', 'btc', 'eth', 'usdcerc20'];

type FilterType = 'all' | 'stablecoin' | 'crypto';

interface CurrencySearchSelectorProps {
  onSelect: (currency: CurrencyOption) => void;
  isLoading?: boolean;
  loadingCurrencyId?: string;
  amount?: number;
}

export function CurrencySearchSelector({ 
  onSelect, 
  isLoading, 
  loadingCurrencyId,
  amount = 150
}: CurrencySearchSelectorProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredCurrencies = useMemo(() => {
    let filtered = CURRENCIES;
    
    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(c => c.category === filter);
    }
    
    // Apply search
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.symbol.toLowerCase().includes(query) ||
        c.network?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [search, filter]);

  const popularCurrencies = CURRENCIES.filter(c => POPULAR_IDS.includes(c.id));

  const renderCurrencyItem = (currency: CurrencyOption, isPopular = false) => {
    const CryptoIcon = getCryptoIcon(currency.id);
    const NetworkIcon = (currency.symbol === 'USDT' || currency.symbol === 'USDC') 
      ? getNetworkIcon(currency.id) 
      : null;
    const isBelowMin = amount < currency.minEur;
    const isCurrentLoading = isLoading && loadingCurrencyId === currency.id;
    
    return (
      <button
        key={currency.id}
        onClick={() => !isBelowMin && onSelect(currency)}
        disabled={isLoading || isBelowMin}
        className={cn(
          "group relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
          isPopular && "flex-col justify-center text-center min-w-[90px]",
          isBelowMin 
            ? "opacity-40 cursor-not-allowed border-border bg-muted/20"
            : "border-border/50 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
          isCurrentLoading && "border-primary bg-primary/10"
        )}
      >
        {/* Icon with Network Badge */}
        <div className="relative">
          <div className={cn(
            "rounded-full flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110",
            isPopular ? "w-10 h-10" : "w-9 h-9"
          )}>
            <CryptoIcon size={isPopular ? 40 : 36} />
          </div>
          {NetworkIcon && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5 shadow-sm">
              <NetworkIcon size={14} />
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className={cn("flex-1", isPopular ? "text-center" : "text-left")}>
          <p className={cn(
            "font-semibold text-foreground",
            isPopular ? "text-sm" : "text-sm"
          )}>
            {currency.symbol}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {isPopular 
              ? (currency.network || currency.name)
              : `${currency.name}${currency.network ? ` • ${currency.network}` : ''}`
            }
          </p>
        </div>
        
        {/* Status indicators */}
        {!isPopular && (
          <div className="flex items-center gap-2">
            {isBelowMin && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Min. {currency.minEur}€
              </span>
            )}
            {isCurrentLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        )}
        
        {/* Loading overlay for popular */}
        {isPopular && isCurrentLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Suche nach Name oder Symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 bg-muted/30 border-border/50 focus:border-primary focus:bg-background transition-colors"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'Alle', icon: Coins },
          { value: 'stablecoin', label: 'Stablecoins', icon: TrendingUp },
          { value: 'crypto', label: 'Krypto', icon: Star },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value as FilterType)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              filter === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Popular Section - only show when no search and filter is 'all' */}
      {!search && filter === 'all' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Beliebt
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {popularCurrencies.map(c => renderCurrencyItem(c, true))}
          </div>
        </div>
      )}

      {/* All Currencies List - 50/50 Layout */}
      {filteredCurrencies.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Keine Ergebnisse für "{search}"</p>
          <p className="text-xs mt-1">Versuche einen anderen Suchbegriff</p>
        </div>
      ) : filter === 'all' ? (
        /* Two-column layout when showing all */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Column: Stablecoins */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Stablecoins
              </span>
            </div>
            <ScrollArea className="h-[200px] pr-2">
              <div className="space-y-2">
                {filteredCurrencies
                  .filter(c => c.category === 'stablecoin')
                  .map(c => renderCurrencyItem(c, false))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Column: Cryptocurrencies */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Kryptowährungen
              </span>
            </div>
            <ScrollArea className="h-[200px] pr-2">
              <div className="space-y-2">
                {filteredCurrencies
                  .filter(c => c.category === 'crypto')
                  .map(c => renderCurrencyItem(c, false))}
              </div>
            </ScrollArea>
          </div>
        </div>
      ) : (
        /* Single column when filtered */
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {filter === 'stablecoin' ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Coins className="h-3.5 w-3.5 text-amber-500" />
            )}
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {filter === 'stablecoin' ? 'Stablecoins' : 'Kryptowährungen'}
            </span>
          </div>
          <ScrollArea className="h-[200px] pr-2">
            <div className="space-y-2">
              {filteredCurrencies.map(c => renderCurrencyItem(c, false))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
