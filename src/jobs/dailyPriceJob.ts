import cron from 'node-cron';
import { PriceService } from '../services/PriceService';
import { MockProvider } from '../providers/MockProvider';

const priceService = new PriceService(new MockProvider());

const TRACKED_SYMBOLS = ['BTC-USD', 'ETH-USD', 'EUR-USD'];

export const startDailyJob = () => {
  // Schedule task to run at 00:00 every day
  cron.schedule('0 0 * * *', async () => {
    console.log('Running Daily Price Job...');
    for (const symbol of TRACKED_SYMBOLS) {
      try {
        await priceService.fetchAndStorePrice(symbol);
        console.log(`Stored price for ${symbol}`);
      } catch (error) {
        console.error(`Failed to store price for ${symbol}`, error);
      }
    }
  });
};
