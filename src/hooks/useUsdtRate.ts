// Simplified USDT rate hook - since we're now using USD, USDT is 1:1
export const useUsdtRate = () => {
  // USDT ≈ 1:1 with USD
  const usdtToUsd = 1;

  const usdToUsdt = (usdAmount: number): number => {
    return usdAmount; // 1:1 ratio
  };

  const usdtToUsdAmount = (usdtAmount: number): number => {
    return usdtAmount; // 1:1 ratio
  };

  return {
    usdtToUsd,
    usdToUsdt,
    usdtToUsdAmount,
    isLoading: false,
    error: null,
  };
};
