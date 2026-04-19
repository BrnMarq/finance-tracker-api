import request from 'supertest';
import app from '../app';
import { prismaMock } from '../singleton';

describe('PriceController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/prices/:symbol should return price history', async () => {
    const mockHistory = [
      { id: 1, symbol: 'BTC-USD', provider: 'Mock', price: 40000, date: new Date('2026-01-01') },
      { id: 2, symbol: 'BTC-USD', provider: 'Mock', price: 42000, date: new Date('2026-01-02') }
    ];

    prismaMock.dailyPrice.findMany.mockResolvedValue(mockHistory);

    const response = await request(app).get('/api/prices/BTC-USD');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].price).toBe(40000);
  });

  it('POST /api/prices/:symbol/fetch should fetch and store current price', async () => {
    const mockPriceRecord = {
      id: 3,
      symbol: 'BTC-USD',
      provider: 'Mock',
      price: 42000.50,
      date: new Date()
    };

    // Upsert resolves with the created/updated record
    prismaMock.dailyPrice.upsert.mockResolvedValue(mockPriceRecord);

    const response = await request(app).post('/api/prices/BTC-USD/fetch');

    expect(response.status).toBe(200);
    expect(response.body.price).toBe(42000.50);
  });
});
