export interface CryptoConfig {
  name: string;
  symbol: string;
  network: string;
  address: string;
  confirmationsRequired: number;
  color: string;
  icon: string;
}

export const CRYPTO_CONFIG: Record<string, CryptoConfig> = {
  USDT: {
    name: 'Tether USD',
    symbol: 'USDT',
    network: 'TRC-20 (Tron)',
    address: 'TXkZ9qJ7vP3mN5wR2sT8yU4iO6pL1kJ3hG',
    confirmationsRequired: 3,
    color: '#26A17B',
    icon: '💵',
  },
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    network: 'ERC-20 (Ethereum)',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1aB23',
    confirmationsRequired: 12,
    color: '#2775CA',
    icon: '🔵',
  },
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Mainnet',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    confirmationsRequired: 3,
    color: '#F7931A',
    icon: '🟠',
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'Ethereum Mainnet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1aB23',
    confirmationsRequired: 12,
    color: '#627EEA',
    icon: '🔷',
  },
};

export const DEPOSIT_FEE_PERCENT = 2;
export const MIN_DEPOSIT_USD = 10;
export const MAX_DEPOSIT_USD = 10000;
export const RENTAL_PRICE_USD = 59;

// Exchange rates (USDT/USDC ≈ 1:1 with USD)
export const EXCHANGE_RATES: Record<string, number> = {
  USDT: 1, // 1 USD = 1 USDT
  USDC: 1, // 1 USD = 1 USDC
  BTC: 0.000015, // 1 USD ≈ 0.000015 BTC
  ETH: 0.00028, // 1 USD ≈ 0.00028 ETH
};

export const getCoinList = () => Object.values(CRYPTO_CONFIG);
export const getCoinBySymbol = (symbol: string) => CRYPTO_CONFIG[symbol];
