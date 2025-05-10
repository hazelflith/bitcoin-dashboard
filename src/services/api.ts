import axios from 'axios';

const COINGECKO_API = 'https://pro-api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.REACT_APP_COINGECKO_API_KEY;

export interface BitcoinData {
  timestamp: number;
  price: number;
  volume: number;
  marketCap: number;
}

export const fetchBitcoinData = async (): Promise<BitcoinData[]> => {
  try {
    // Fetch historical data for the last 30 days
    const response = await axios.get(
      `${COINGECKO_API}/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: '30',
          interval: 'hourly',
        },
        headers: {
          'x-cg-pro-api-key': COINGECKO_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const { prices, total_volumes, market_caps } = response.data;

    return prices.map((price: [number, number], index: number) => ({
      timestamp: price[0],
      price: price[1],
      volume: total_volumes[index][1],
      marketCap: market_caps[index][1],
    }));
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    // Return mock data if API fails
    return generateMockData();
  }
};

export const fetchMacroData = async () => {
  try {
    // Fetch macroeconomic indicators
    const [fearGreedResponse, dominanceResponse] = await Promise.all([
      axios.get('https://api.alternative.me/fng/'),
      axios.get(`${COINGECKO_API}/global`, {
        headers: {
          'x-cg-pro-api-key': COINGECKO_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }),
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
    const basePrice = 40000 + Math.random() * 10000;
    data.push({
      timestamp,
      price: basePrice,
      volume: basePrice * 1000000,
      marketCap: basePrice * 19000000,
    });
  }
  
  return data;
}; 