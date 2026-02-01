import { Request, Response } from 'express';
import { PriceService } from '../services/PriceService';
import { MockProvider } from '../providers/MockProvider';

const priceService = new PriceService(new MockProvider());

export class PriceController {
  async getHistory(req: Request, res: Response) {
    try {
      const { symbol } = req.params as { symbol: string };
      const history = await priceService.getHistory(symbol);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async triggerFetch(req: Request, res: Response) {
    try {
      const { symbol } = req.params as { symbol: string };
      const result = await priceService.fetchAndStorePrice(symbol);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
