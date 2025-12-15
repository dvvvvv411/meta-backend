import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Bitcoin - Orange
export const BitcoinIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
    <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.046-1.13 4.532c-.086.212-.303.531-.793.41.017.025-1.256-.314-1.256-.314l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.292 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" fill="#FFF"/>
  </svg>
);

// Ethereum - Blue/Purple
export const EthereumIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
    <g fill="#FFF">
      <path fillOpacity=".6" d="M16.498 4v8.87l7.497 3.35z"/>
      <path d="M16.498 4L9 16.22l7.498-3.35z"/>
      <path fillOpacity=".6" d="M16.498 21.968v6.027L24 17.616z"/>
      <path d="M16.498 27.995v-6.028L9 17.616z"/>
      <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
      <path fillOpacity=".6" d="M9 16.22l7.498 4.353v-7.701z"/>
    </g>
  </svg>
);

// Tether USDT - Green
export const TetherIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#26A17B"/>
    <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" fill="#FFF"/>
  </svg>
);

// USD Coin - Blue
export const USDCIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#2775CA"/>
    <path d="M15.75 27.5A11.75 11.75 0 1 1 27.5 15.75 11.75 11.75 0 0 1 15.75 27.5zm-.7-16.11a2.58 2.58 0 0 0-2.45 2.47c0 1.21.74 2 2.31 2.33l1.1.26c1.07.25 1.51.61 1.51 1.22s-.77 1.21-1.77 1.21a1.9 1.9 0 0 1-1.8-.91.68.68 0 0 0-.61-.39h-.59a.35.35 0 0 0-.28.41 2.73 2.73 0 0 0 2.61 2.08v.84a.7.7 0 0 0 1.41 0v-.85a2.62 2.62 0 0 0 2.59-2.58c0-1.27-.73-2-2.46-2.37l-1-.22c-1.09-.28-1.47-.53-1.47-1.14 0-.56.59-1.08 1.67-1.08a1.45 1.45 0 0 1 1.35.7.57.57 0 0 0 .52.37h.61a.37.37 0 0 0 .38-.4 2.22 2.22 0 0 0-2.21-1.79v-.74a.7.7 0 0 0-1.41 0z" fill="#FFF"/>
  </svg>
);

// Litecoin - Silver
export const LitecoinIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#BFBBBB"/>
    <path d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z" fill="#FFF"/>
  </svg>
);

// Solana - Gradient Purple
export const SolanaIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="solana-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFA3"/>
        <stop offset="50%" stopColor="#03E1FF"/>
        <stop offset="100%" stopColor="#DC1FFF"/>
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#solana-grad)"/>
    <path d="M9.925 20.275a.515.515 0 0 1 .364-.151h12.687c.23 0 .345.278.183.44l-2.484 2.485a.515.515 0 0 1-.364.151H7.624a.258.258 0 0 1-.183-.44zm0-11.324a.529.529 0 0 1 .364-.151h12.687c.23 0 .345.278.183.44l-2.484 2.485a.515.515 0 0 1-.364.151H7.624a.258.258 0 0 1-.183-.44zm12.75 5.527a.515.515 0 0 0-.364-.151H9.624a.258.258 0 0 0-.183.44l2.484 2.485a.515.515 0 0 0 .364.151h12.687c.23 0 .345-.278.183-.44z" fill="#FFF"/>
  </svg>
);

// Tron - Red
export const TronIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#EF0027"/>
    <path d="M21.932 9.913L7.5 7.257l7.595 19.112 10.583-12.894zm-.232 1.17l2.208 2.099-6.038 1.093zm-1.4.388l-5.027 4.074-.664-3.556zM11.6 9.566l8.053 1.593.696 3.727-8.43 6.837zm.738 12.818l5.64-7.2 5.903-1.063z" fill="#FFF"/>
  </svg>
);

// BNB - Yellow
export const BNBIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
    <path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144zM6 16l2.26-2.26L10.52 16l-2.26 2.26zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003zM21.48 16l2.26-2.26L26 16l-2.26 2.26zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706z" fill="#FFF"/>
  </svg>
);

// Monero XMR - Orange
export const MoneroIcon = ({ className, size = 24 }: IconProps) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
    <circle cx="16" cy="16" r="16" fill="#FF6600"/>
    <path d="M15.97 5.235c5.985 0 10.825 4.84 10.825 10.824a10.77 10.77 0 0 1-2.078 6.378h-3.129v-10.1l-5.618 5.62-5.618-5.62v10.1H7.223a10.77 10.77 0 0 1-2.077-6.378c0-5.984 4.84-10.824 10.824-10.824m-5.143 18.678v-6.464l5.143 5.143 5.143-5.143v6.464h3.903c-2.2 2.097-5.166 3.382-8.42 3.382-3.254 0-6.22-1.285-8.421-3.382z" fill="#FFF"/>
  </svg>
);

// Network Icons (small badges for USDT/USDC networks)
export const TRC20Icon = ({ className, size = 14 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <circle cx="12" cy="12" r="12" fill="#EF0027"/>
    <path d="M8.5 7h7l-1.5 2h-4l-1.5-2zm2.5 3h2v7h-2v-7z" fill="#FFF"/>
  </svg>
);

export const ERC20Icon = ({ className, size = 14 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <circle cx="12" cy="12" r="12" fill="#627EEA"/>
    <path d="M12 4l-5 8 5 3 5-3-5-8zm-5 9l5 7 5-7-5 3-5-3z" fill="#FFF" fillOpacity="0.8"/>
  </svg>
);

export const BSCIcon = ({ className, size = 14 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <circle cx="12" cy="12" r="12" fill="#F3BA2F"/>
    <path d="M12 5l2 2-2 2-2-2 2-2zm-5 5l2-2 2 2-2 2-2-2zm10 0l-2-2 2-2 2 2-2 2zm-5 2l2 2-2 2-2-2 2-2zm-5 3l2-2 2 2-2 2-2-2zm10 0l-2-2 2-2 2 2-2 2z" fill="#FFF"/>
  </svg>
);

export const PolygonIcon = ({ className, size = 14 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <circle cx="12" cy="12" r="12" fill="#8247E5"/>
    <path d="M15.5 9.5l-2-1.2c-.3-.2-.7-.2-1 0l-2 1.2c-.3.2-.5.5-.5.9v2.4c0 .4.2.7.5.9l2 1.2c.3.2.7.2 1 0l2-1.2c.3-.2.5-.5.5-.9v-2.4c0-.4-.2-.7-.5-.9z" fill="#FFF"/>
  </svg>
);

// Get network icon for USDT/USDC variants
export const getNetworkIcon = (currencyId: string): React.FC<IconProps> | null => {
  const id = currencyId.toLowerCase();
  if (id.includes('trc20')) return TRC20Icon;
  if (id.includes('erc20')) return ERC20Icon;
  if (id.includes('bsc') || id.includes('bep20')) return BSCIcon;
  if (id.includes('matic') || id.includes('polygon')) return PolygonIcon;
  return null;
};

// Map currency IDs to their icons
export const CryptoIconMap: Record<string, React.FC<IconProps>> = {
  btc: BitcoinIcon,
  eth: EthereumIcon,
  usdt: TetherIcon,
  usdttrc20: TetherIcon,
  usdterc20: TetherIcon,
  usdtbsc: TetherIcon,
  usdtmatic: TetherIcon,
  usdtsol: TetherIcon,
  usdc: USDCIcon,
  usdcerc20: USDCIcon,
  ltc: LitecoinIcon,
  sol: SolanaIcon,
  trx: TronIcon,
  bnb: BNBIcon,
  bnbbsc: BNBIcon,
  xmr: MoneroIcon,
};

export const getCryptoIcon = (currencyId: string): React.FC<IconProps> => {
  return CryptoIconMap[currencyId.toLowerCase()] || BitcoinIcon;
};
