export interface PriceProvider {
  getPrice(symbol: string): Promise<number>;
  getProviderName(): string;
}
