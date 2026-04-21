import axios from 'axios';
import { PriceProvider } from './PriceProvider';

export class BinanceProvider implements PriceProvider {
  getProviderName(): string {
    return 'Binance';
  }

  async getPrice(symbol: string): Promise<number> {
    const symbolMap: Record<string, string> = {
      'BTC-USD': 'BTCUSDT',
      'ETH-USD': 'ETHUSDT',
      'EUR-USD': 'EURUSDT' // Binance might not have this as a direct pair in the same way, but it's an example
    };
    
    const binanceSymbol = symbolMap[symbol];
    if (!binanceSymbol) {
      throw new Error(`BinanceProvider does not support symbol: ${symbol}`);
    }

    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`);
    return parseFloat(response.data.price);
  }
}
