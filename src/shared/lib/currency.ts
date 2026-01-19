// Currency definitions with Angola focus
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  namePt: string;
  decimals: number;
}

export const currencies: Currency[] = [
  { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza', namePt: 'Kwanza Angolano', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', namePt: 'Euro', decimals: 2 },
  { code: 'USD', symbol: '$', name: 'US Dollar', namePt: 'Dólar Americano', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', namePt: 'Libra Esterlina', decimals: 2 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', namePt: 'Rand Sul-Africano', decimals: 2 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', namePt: 'Real Brasileiro', decimals: 2 },
];

// Default currency for Angola
export const DEFAULT_CURRENCY = 'AOA';

// Get currency by code
export function getCurrency(code: string): Currency | undefined {
  return currencies.find(c => c.code === code);
}

// Format currency amount
export function formatCurrency(
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY,
  locale: string = 'pt-PT'
): string {
  const currency = getCurrency(currencyCode);
  if (!currency) {
    return `${amount.toFixed(2)}`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(amount);
  } catch {
    // Fallback for unsupported currencies
    return `${currency.symbol} ${amount.toFixed(currency.decimals)}`;
  }
}

// Currency options for select dropdowns
export function getCurrencyOptions(locale: 'en' | 'pt-PT' = 'pt-PT') {
  return currencies.map(c => ({
    value: c.code,
    label: `${c.code} (${c.symbol}) - ${locale === 'pt-PT' ? c.namePt : c.name}`,
  }));
}
