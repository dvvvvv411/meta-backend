import { useQuery } from '@tanstack/react-query';

interface CoinGeckoResponse {
  tether: {
    eur: number;
  };
}

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eur';

export const useUsdtRate = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['usdt-eur-rate'],
    queryFn: async (): Promise<number> => {
      const response = await fetch(COINGECKO_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch USDT rate');
      }
      const data: CoinGeckoResponse = await response.json();
      return data.tether.eur;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Fallback to 1:1 if API fails
  const usdtToEur = data ?? 1;

  const eurToUsdt = (eurAmount: number): number => {
    if (usdtToEur === 0) return eurAmount;
    return eurAmount / usdtToEur;
  };

  const usdtToEurAmount = (usdtAmount: number): number => {
    return usdtAmount * usdtToEur;
  };

  return {
    usdtToEur,
    eurToUsdt,
    usdtToEurAmount,
    isLoading,
    error,
  };
};
