// Caches rates in memory to avoid spamming the free API
let rateCache = { rates: {}, timestamp: 0 };
const CACHE_TTL = 3600000; // 1 hour

export async function getCurrencyData(req) {
  // 1. Detect Country: Use Vercel header in prod, DEV_COUNTRY locally (e.g., 'PH')
  const countryCode = process.env.DEV_COUNTRY || req.headers.get('x-vercel-ip-country') || 'US';
  
  // Map country to currency (simplified)
  const currencyMap = { 'PH': 'PHP', 'JP': 'JPY', 'GB': 'GBP', 'US': 'USD', 'EU': 'EUR' };
  const currency = currencyMap[countryCode] || 'USD';

  // 2. Fetch Rates
  if (Date.now() - rateCache.timestamp > CACHE_TTL) {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await res.json();
      rateCache = { rates: data.rates, timestamp: Date.now() };
    } catch (e) {
      console.error("Rate fetch failed, using stale cache");
    }
  }

  const rate = rateCache.rates[currency] || 1;
  return { countryCode, currency, rate };
}

export function formatPrice(amountUsd, rate, currency) {
  const localAmount = amountUsd * rate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2
  }).format(localAmount);
}