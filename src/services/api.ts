import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface BitcoinData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const fetchBitcoinData = async (): Promise<BitcoinData[]> => {
  try {
    // Fetch OHLC data for the last 30 days
    const response = await axios.get(
      `${COINGECKO_API}/coins/bitcoin/ohlc`,
      {
        params: {
          vs_currency: 'usd',
          days: '30',
        },
      }
    );

    // Response format: [timestamp, open, high, low, close]
    return response.data.map((item: [number, number, number, number, number]) => ({
      timestamp: item[0],
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
    }));
  } catch (error) {
    console.error('Error fetching Bitcoin OHLC data:', error);
    // Return mock data if API fails
    return generateMockData();
  }
};

export const fetchMacroData = async () => {
  try {
    // Fetch macroeconomic indicators
    const [fearGreedResponse, dominanceResponse] = await Promise.all([
      axios.get('https://api.alternative.me/fng/'),
      axios.get(`${COINGECKO_API}/global`),
    ]);

    return {
      fearGreedIndex: fearGreedResponse.data.data[0].value,
      marketDominance: dominanceResponse.data.data.market_cap_percentage.btc,
    };
  } catch (error) {
    console.error('Error fetching macro data:', error);
    // Return mock data if API fails
    return {
      fearGreedIndex: 50,
      marketDominance: 45.5,
    };
  }
};

// Generate mock data for development/testing
const generateMockData = (): BitcoinData[] => {
  const now = Date.now();
  const data: BitcoinData[] = [];
  
  for (let i = 30; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const open = 40000 + Math.random() * 10000;
    const close = open + (Math.random() - 0.5) * 2000;
    const high = Math.max(open, close) + Math.random() * 1000;
    const low = Math.min(open, close) - Math.random() * 1000;
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
    });
  }
  
  return data;
}; 