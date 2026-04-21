import cron from 'node-cron';
import { PriceService } from '../services/PriceService';
import { MockProvider } from '../providers/MockProvider';
import { CoinGeckoProvider } from '../providers/CoinGeckoProvider';
import { BinanceProvider } from '../providers/BinanceProvider';

const priceService = new PriceService([
  new MockProvider(),
  new CoinGeckoProvider(),
  new BinanceProvider()
]);

const TRACKED_SYMBOLS = ['BTC-USD', 'ETH-USD'];
const PROVIDERS_TO_USE = ['CoinGecko', 'Binance'];

export const startDailyJob = () => {
  // Schedule task to run at 00:00 every day
  cron.schedule('0 0 * * *', async () => {
    console.log('Running Daily Price Job...');
    for (const symbol of TRACKED_SYMBOLS) {
      for (const provider of PROVIDERS_TO_USE) {
        try {
          await priceService.fetchAndStorePrice(symbol, provider);
          console.log(`Stored price for ${symbol} from ${provider}`);
        } catch (error) {
          console.error(`Failed to store price for ${symbol} from ${provider}`, error);
        }
      }
    }
  });
};
