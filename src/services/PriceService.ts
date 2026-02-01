import { PrismaClient } from '@prisma/client';
import { PriceProvider } from '../providers/PriceProvider';

const prisma = new PrismaClient();

export class PriceService {
  private provider: PriceProvider;

  constructor(provider: PriceProvider) {
    this.provider = provider;
  }

  async fetchAndStorePrice(symbol: string) {
    const price = await this.provider.getPrice(symbol);
    const today = new Date();
    // Normalize to midnight for consistent daily records
    today.setHours(0, 0, 0, 0);

    return prisma.dailyPrice.upsert({
      where: {
        symbol_date_provider: {
          symbol,
          date: today,
          provider: this.provider.getProviderName()
        }
      },
      update: { price },
      create: {
        symbol,
        date: today,
        provider: this.provider.getProviderName(),
        price
      }
    });
  }

  async getHistory(symbol: string) {
    return prisma.dailyPrice.findMany({
      where: { symbol },
      orderBy: { date: 'asc' }
    });
  }
}
