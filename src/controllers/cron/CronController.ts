import { Request, Response } from 'express';
import { PriceService } from '../../services/PriceService';
import { MockProvider } from '../../providers/MockProvider';
import { CoinGeckoProvider } from '../../providers/CoinGeckoProvider';
import { BinanceProvider } from '../../providers/BinanceProvider';

const priceService = new PriceService([
  new MockProvider(),
  new CoinGeckoProvider(),
  new BinanceProvider()
]);

const TRACKED_SYMBOLS = ['BTC-USD', 'ETH-USD'];
const PROVIDERS_TO_USE = ['CoinGecko', 'Binance'];

export class CronController {
  async triggerDailyPrices(req: Request, res: Response) {
    // Vercel Cron sends a specific authorization header. We check it here to ensure
    // random users can't trigger the daily job multiple times.
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    console.log('[Cron] Starting Daily Price Job triggered by Vercel...');
    const results: any[] = [];

    for (const symbol of TRACKED_SYMBOLS) {
      for (const provider of PROVIDERS_TO_USE) {
        try {
          const result = await priceService.fetchAndStorePrice(symbol, provider);
          console.log(`[Cron] Stored price for ${symbol} from ${provider}`);
          results.push({ symbol, provider, status: 'success', data: result });
        } catch (error: any) {
          console.error(`[Cron] Failed to store price for ${symbol} from ${provider}`, error);
          results.push({ symbol, provider, status: 'error', message: error.message });
        }
      }
    }

    res.status(200).json({
      message: 'Daily price job completed',
      results
    });
  }
}
